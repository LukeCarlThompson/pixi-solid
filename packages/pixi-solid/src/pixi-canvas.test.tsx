import { Sprite as PixiSprite, Texture } from "pixi.js";
import type * as Pixi from "pixi.js";
import { Show, createSignal } from "solid-js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Sprite } from "./components";
import { PixiApplicationProvider } from "./pixi-application";
import { PixiCanvas } from "./pixi-canvas";
import { createTestContext, mountScene } from "./testing";

// jsdom has no ResizeObserver; PixiCanvas's onMount observes its wrapper div.
class MockResizeObserver {
  observe() {}
  disconnect() {}
  unobserve() {}
}

beforeEach(() => {
  vi.stubGlobal("ResizeObserver", MockResizeObserver);
});

afterEach(() => {
  // Restore the previous global so the mock doesn't leak into other suites
  vi.unstubAllGlobals();
});

describe("PixiCanvas stage binding cleanup", () => {
  it("GIVEN a PixiCanvas whose scene is bound to the app stage WHEN the canvas unmounts THEN the stage children are detached", async () => {
    const ctx = createTestContext();
    (ctx.app as any).queueResize = () => {};

    // A user-owned sprite: pixi-solid's `as` prop means the component does NOT
    // destroy it on cleanup, so only the stage binding can detach it.
    const rawSprite = new PixiSprite(Texture.WHITE);
    const [show, setShow] = createSignal(true);

    const { dispose } = mountScene(() => (
      <PixiApplicationProvider existingApp={ctx.app}>
        <Show when={show()}>
          <PixiCanvas style={{ position: "absolute", inset: "0" }}>
            <Sprite as={rawSprite} texture={Texture.WHITE} x={50} y={50} />
          </PixiCanvas>
        </Show>
      </PixiApplicationProvider>
    ));

    // Wait until the provider's resource has resolved and the canvas mounted
    // its scene onto the stage — no fixed tick count.
    await vi.waitFor(() => {
      expect(ctx.app.stage.children).toEqual([rawSprite]);
    });

    // WHEN: the canvas subtree unmounts while the provider survives.
    // The Show disposal is synchronous — no wait needed.
    setShow(false);

    // THEN: the scene must be detached from the shared stage…
    expect(ctx.app.stage.children).toEqual([]);
    // …and the user-owned instance must not be destroyed — pixi-solid only detaches what it does not own
    expect(rawSprite.destroyed).toBe(false);

    // AND: remounting must not stack a second copy. The remount goes through
    // the async provider resource again, so wait for the scene to re-mount.
    setShow(true);
    await vi.waitFor(() => {
      expect(ctx.app.stage.children).toEqual([rawSprite]);
    });

    dispose();
  });

  it("GIVEN a PixiCanvas with owned component children WHEN the canvas unmounts THEN the children are destroyed and the stage is emptied", async () => {
    const ctx = createTestContext();
    (ctx.app as any).queueResize = () => {};
    const [show, setShow] = createSignal(true);
    const destroyed: Pixi.Sprite[] = [];
    let spriteRef: Pixi.Sprite | undefined;

    const { dispose } = mountScene(() => (
      <PixiApplicationProvider existingApp={ctx.app}>
        <Show when={show()}>
          <PixiCanvas style={{ position: "absolute", inset: "0" }}>
            <Sprite
              texture={Texture.WHITE}
              ref={(el) => {
                spriteRef = el;
                const originalDestroy = el.destroy.bind(el);
                el.destroy = vi.fn((options) => {
                  destroyed.push(el);
                  originalDestroy(options);
                }) as any;
              }}
            />
          </PixiCanvas>
        </Show>
      </PixiApplicationProvider>
    ));

    // Wait until the provider's resource has resolved and the canvas mounted its scene
    await vi.waitFor(() => {
      expect(ctx.app.stage.children.length).toBe(1);
    });

    // WHEN: the canvas subtree unmounts while the provider survives.
    // The Show disposal is synchronous — no wait needed.
    setShow(false);

    // THEN: owned children are destroyed by their own component cleanups
    // and the stage no longer holds them
    expect(destroyed).toContain(spriteRef);
    expect(ctx.app.stage.children).toEqual([]);

    dispose();
  });

  it("GIVEN a PixiCanvas whose children are an inline render function creating raw instances WHEN the canvas unmounts THEN the stage does not keep the scene", async () => {
    const ctx = createTestContext();
    (ctx.app as any).queueResize = () => {};
    const [show, setShow] = createSignal(true);

    // The incident repro: an inline render function as children that creates
    // fresh raw Pixi instances. Raw instances have no component cleanup, so
    // only the stage binding can detach them on unmount.
    let createdSprite: PixiSprite | undefined;

    const { dispose } = mountScene(() => (
      <PixiApplicationProvider existingApp={ctx.app}>
        <Show when={show()}>
          <PixiCanvas style={{ position: "absolute", inset: "0" }}>
            {/* Raw instances are valid children at runtime; the JSX types don't model them. */}
            {(() => {
              createdSprite = new PixiSprite(Texture.WHITE);
              return createdSprite;
            }) as any}
          </PixiCanvas>
        </Show>
      </PixiApplicationProvider>
    ));

    // Wait until the provider's resource has resolved and the canvas mounted its scene
    await vi.waitFor(() => {
      expect(ctx.app.stage.children.length).toBe(1);
    });

    // WHEN: the canvas subtree unmounts while the provider survives.
    // The Show disposal is synchronous — no wait needed.
    setShow(false);

    // THEN: the raw sprite must be detached from the shared stage…
    expect(ctx.app.stage.children).toEqual([]);
    expect(createdSprite?.parent).toBeNull();
    // …but not destroyed — the library must not destroy what it does not own
    expect(createdSprite?.destroyed).toBe(false);

    // AND: remounting must not stack a second copy on top of the first
    setShow(true);
    await vi.waitFor(() => {
      expect(ctx.app.stage.children.length).toBe(1);
    });

    dispose();
  });
});
