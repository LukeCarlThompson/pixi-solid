import type * as Pixi3D from "@pixi/3d";
import { CubeGeometry, Material3D } from "@pixi/3d";
import { cleanup, createTestContext, mountScene } from "pixi-solid/testing";
import { describe, expect, it, vi } from "vitest";

import { Model3D, View3D } from "../components";

describe("Model3D animation ticker integration", () => {
  it("initializes Model3D without attaching to Ticker.shared and connects to context ticker", async () => {
    const ctx = createTestContext();

    // Create a minimal Scene3DSource mock with animations
    const mockSource = {
      textures: [],
      materials: [new Material3D()],
      geometries: [[new CubeGeometry()]],
      texture: {},
      material: {},
      geometry: {},
      animations: {
        walk: {
          name: "walk",
          duration: 1,
          tracks: [],
        },
      },
      scene: {
        default: {
          nodes: [],
        },
      },
      _descriptor: {
        nodes: [{ name: "root" }],
        scenes: [{ name: "default", nodes: [0] }],
        defaultScene: 0,
        skins: [],
      },
    } as unknown as Pixi3D.Scene3DSource;

    let modelRef: any;

    mountScene(() => (
      <ctx.Provider>
        <View3D width={300} height={300}>
          <Model3D ref={(m) => (modelRef = m)} source={mockSource} autoPlay="walk" />
        </View3D>
      </ctx.Provider>
    ));

    expect(modelRef).toBeDefined();

    if (modelRef?.player) {
      // AutoUpdate on internal player should be false (not on global Ticker.shared)
      expect(modelRef.player.autoUpdate).toBe(false);

      const updateSpy = vi.spyOn(modelRef.player, "update");
      await ctx.ticker.fastForwardFrames(2);
      expect(updateSpy).toHaveBeenCalled();
    }

    cleanup();
  });
});
