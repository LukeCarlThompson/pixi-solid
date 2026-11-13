import { Container } from "pixi-solid";
import { cleanup, createTestContext, mountScene } from "pixi-solid/testing";
import type * as Pixi from "pixi.js";
import { Container as PixiContainer, Ticker } from "pixi.js";
import { createSignal } from "solid-js";
import { describe, expect, it, vi } from "vitest";

import { createContainerTexture } from "../components";

/** `ContainerTexture` only needs `render`, and `runners.destroy` to track the renderer. */
const createStubRenderer = () => {
  const render = vi.fn();

  return {
    render,
    renderer: {
      render,
      screen: { width: 800, height: 600, x: 0, y: 0 },
      runners: { destroy: { add: vi.fn(), remove: vi.fn() } },
    } as unknown as Pixi.Renderer,
  };
};

/**
 * Runs the hook inside the pixi-solid contexts with a renderer stub, and returns what it produced.
 */
const mountHook = <T,>(
  useHook: () => T,
): {
  hook: () => T;
  render: ReturnType<typeof vi.fn>;
  ctx: ReturnType<typeof createTestContext>;
} => {
  const { render, renderer } = createStubRenderer();
  const ctx = createTestContext({
    app: {
      renderer,
      stage: new PixiContainer(),
      ticker: new Ticker(),
    } as unknown as Pixi.Application,
  });

  let captured: T | undefined;

  const Probe = (): null => {
    captured = useHook();
    return null;
  };

  mountScene(() => (
    <ctx.Provider>
      <Probe />
    </ctx.Provider>
  ));

  return { hook: () => captured as T, render, ctx };
};

describe("createContainerTexture", () => {
  it("GIVEN a JSX tree WHEN it is passed THEN the container arrives with its children mounted", () => {
    // GIVEN
    const { hook, render } = mountHook(() =>
      createContainerTexture(
        <Container label="content">
          <Container label="child" />
        </Container>,
        { width: 256, height: 64 },
      ),
    );

    // WHEN
    const texture = hook();

    // THEN
    expect(texture.width).toBe(256);
    expect(texture.height).toBe(64);
    expect(texture.container.label).toBe("content");
    expect(texture.container.children.map((child) => child.label)).toEqual(["child"]);
    // The first render runs during setup, so the texture starts with an image rather than blanks.
    expect(render).toHaveBeenCalled();

    cleanup();
  });

  it("GIVEN content that is not a single container WHEN it is passed THEN it reports what to do", () => {
    // GIVEN / WHEN / THEN
    expect(() => {
      mountHook(() => createContainerTexture(<>one</>));
    }).toThrow("createContainerTexture expects a 2D container.");

    cleanup();
  });

  it("GIVEN the default autoUpdate WHEN the ticker in scope advances THEN the texture re-renders", async () => {
    // GIVEN
    const { hook, render, ctx } = mountHook(() =>
      createContainerTexture(<Container />, { width: 16, height: 16 }),
    );
    hook();

    const rendersAfterSetup = render.mock.calls.length;

    // WHEN
    await ctx.ticker.fastForwardFrames(2);

    // THEN
    expect(render.mock.calls.length).toBeGreaterThan(rendersAfterSetup);

    cleanup();
  });

  it("GIVEN autoUpdate is false WHEN the ticker advances THEN nothing renders", async () => {
    // GIVEN
    const { hook, render, ctx } = mountHook(() =>
      createContainerTexture(<Container />, { width: 16, height: 16, autoUpdate: false }),
    );
    hook();

    const rendersAfterSetup = render.mock.calls.length;

    // WHEN
    await ctx.ticker.fastForwardFrames(2);

    // THEN
    expect(render.mock.calls.length).toBe(rendersAfterSetup);

    cleanup();
  });

  it("GIVEN a mounted texture WHEN it unmounts THEN the texture and its render target are freed", () => {
    // GIVEN
    const { hook } = mountHook(() =>
      createContainerTexture(<Container />, { width: 16, height: 16 }),
    );
    const texture = hook();
    const source = texture.source;

    expect(texture.destroyed).toBe(false);

    // WHEN
    cleanup();

    // THEN
    expect(texture.destroyed).toBe(true);
    expect(source.destroyed).toBe(true);
  });

  it("GIVEN content bound to a signal WHEN the signal changes THEN the next frame renders it", async () => {
    // GIVEN
    const [label, setLabel] = createSignal("first");
    const { hook, render, ctx } = mountHook(() =>
      createContainerTexture(<Container label={label()} />, { width: 16, height: 16 }),
    );
    const texture = hook();

    const rendersAfterSetup = render.mock.calls.length;

    // WHEN
    setLabel("second");
    await ctx.ticker.fastForwardFrames(1);

    // THEN
    expect(texture.container.label).toBe("second");
    expect(render.mock.calls.length).toBeGreaterThan(rendersAfterSetup);

    cleanup();
  });

  it("GIVEN no pixi-solid provider WHEN the hook runs THEN it reports the missing renderer", () => {
    // GIVEN / WHEN / THEN
    expect(() => {
      mountScene(() => {
        createContainerTexture(<Container />, { width: 16, height: 16 });
        return null;
      });
    }).toThrow("getRenderer must be used within a PixiApplicationProvider or a PixiCanvas");

    cleanup();
  });
});
