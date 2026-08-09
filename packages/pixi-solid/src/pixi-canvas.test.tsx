import { Sprite as PixiSprite, Texture } from "pixi.js";
import { Show, createSignal } from "solid-js";
import { describe, expect, it } from "vitest";

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

const tick = () => new Promise((resolve) => setTimeout(resolve, 30));

describe("PixiCanvas stage binding cleanup", () => {
  it("GIVEN a PixiCanvas whose scene is bound to the app stage WHEN the canvas unmounts THEN the stage children are detached", async () => {
    (globalThis as any).ResizeObserver = MockResizeObserver;

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

    await tick();

    // Sanity: the scene is on the stage while the canvas is mounted
    expect(ctx.app.stage.children).toEqual([rawSprite]);

    // WHEN: the canvas subtree unmounts while the provider survives
    setShow(false);
    await tick();

    // THEN: the scene must be detached from the shared stage
    expect(ctx.app.stage.children).toEqual([]);

    // AND: remounting must not stack a second copy
    setShow(true);
    await tick();

    expect(ctx.app.stage.children).toEqual([rawSprite]);

    dispose();
  });
});
