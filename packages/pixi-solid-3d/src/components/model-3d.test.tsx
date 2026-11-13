import type * as Pixi3D from "@pixi/3d";
import {
  Container3D as PixiContainer3D,
  CubeGeometry,
  FlatMaterial,
  Material3D,
  Mesh3D,
} from "@pixi/3d";
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

  it("supports traverse prop to walk and customize meshes on Model3D", () => {
    const mockSource = {
      textures: [],
      materials: [new Material3D({ baseColor: 0xff0000 })],
      geometries: [[new CubeGeometry()]],
      texture: {},
      material: {},
      geometry: {},
      animations: {},
      scene: {},
      _descriptor: {
        nodes: [{ geometry: 0, materials: [0], label: "Armor" }],
        scenes: [{ children: [0] }],
        defaultScene: 0,
        skins: [],
      },
    } as unknown as Pixi3D.Scene3DSource;

    let modelRef: any;
    const customMat = new FlatMaterial({ baseColor: 0x00ff00 });

    mountScene(() => (
      <View3D width={300} height={300}>
        <Model3D
          ref={(m) => (modelRef = m)}
          source={mockSource}
          traverse={(node) => {
            if (node instanceof Mesh3D && node.label === "Armor") {
              node.material = customMat;
            }
          }}
        />
      </View3D>
    ));

    expect(modelRef).toBeDefined();
    const armorMesh = modelRef.children[0] as Mesh3D;
    expect(armorMesh).toBeInstanceOf(Mesh3D);
    expect(armorMesh.material).toBe(customMat);

    cleanup();
  });

  it("walks descendants with the built-in Container3D.traverse", () => {
    const parent = new PixiContainer3D();
    const child = new PixiContainer3D();

    parent.addChild(child);

    const visited: Pixi3D.Container3D[] = [];

    parent.traverse((node) => visited.push(node));

    expect(visited).toEqual([parent, child]);
  });

  it("applies per-model materials without mutating the shared source", () => {
    const sourceMaterial = new Material3D({ baseColor: 0xff0000 });
    const overrideMaterial = new Material3D({ baseColor: 0x0000ff });

    const mockSource = {
      textures: [],
      materials: [sourceMaterial],
      geometries: [[new CubeGeometry()]],
      texture: {},
      material: {},
      geometry: {},
      animations: {},
      scene: {},
      _descriptor: {
        nodes: [{ geometry: 0, materials: [0], label: "Armor" }],
        scenes: [{ children: [0] }],
        defaultScene: 0,
        skins: [],
      },
    } as unknown as Pixi3D.Scene3DSource;

    let modelRef: any;

    mountScene(() => (
      <View3D width={300} height={300}>
        <Model3D
          ref={(m) => (modelRef = m)}
          source={mockSource}
          materials={() => overrideMaterial}
        />
      </View3D>
    ));

    const armorMesh = modelRef.children[0] as Mesh3D;

    expect(armorMesh.material).toBe(overrideMaterial);
    expect(sourceMaterial.baseColor).toBe(0xff0000);

    cleanup();
  });
});
