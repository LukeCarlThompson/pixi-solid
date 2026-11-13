import type * as Pixi3D from "@pixi/3d";
import {
  Container3D as PixiContainer3D,
  CubeGeometry,
  FlatMaterial,
  Material3D,
  Mesh3D,
  Model3D as PixiModel3D,
} from "@pixi/3d";
import { cleanup, createTestContext, mountScene } from "pixi-solid/testing";
import { describe, expect, it, vi } from "vitest";

import { Model3D, View3D } from "../components";

/** A minimal `Scene3DSource` with one mesh node, and optionally one animation. */
const createSource = (options: { animated?: boolean } = {}): Pixi3D.Scene3DSource =>
  ({
    textures: [],
    materials: [new Material3D({ baseColor: 0xff0000 })],
    geometries: [[new CubeGeometry()]],
    texture: {},
    material: {},
    geometry: {},
    animations: options.animated ? { walk: { name: "walk", duration: 1, tracks: [] } } : {},
    scene: options.animated ? { default: { nodes: [] } } : {},
    _descriptor: {
      nodes: [{ geometry: 0, materials: [0], label: "Armor" }],
      scenes: [{ name: "default", children: [0] }],
      defaultScene: 0,
      skins: [],
    },
  }) as unknown as Pixi3D.Scene3DSource;

describe("Model3D component", () => {
  it("GIVEN an animated source WHEN the context ticker advances THEN the player updates from that ticker", async () => {
    // GIVEN
    const ctx = createTestContext();
    let modelRef: any;

    mountScene(() => (
      <ctx.Provider>
        <View3D width={300} height={300}>
          <Model3D
            ref={(m) => (modelRef = m)}
            source={createSource({ animated: true })}
            autoPlay="walk"
          />
        </View3D>
      </ctx.Provider>
    ));

    expect(modelRef).toBeDefined();
    expect(modelRef.player).toBeDefined();
    expect(modelRef.player.autoUpdate).toBe(false);

    const updateSpy = vi.spyOn(modelRef.player, "update");

    // WHEN
    await ctx.ticker.fastForwardFrames(2);

    // THEN
    expect(updateSpy).toHaveBeenCalled();

    cleanup();
  });

  it("GIVEN a traverse prop targeting a labelled mesh WHEN the model mounts THEN the mesh is customised", () => {
    // GIVEN
    let modelRef: any;
    const customMat = new FlatMaterial({ baseColor: 0x00ff00 });

    mountScene(() => (
      <View3D width={300} height={300}>
        <Model3D
          ref={(m) => (modelRef = m)}
          source={createSource()}
          traverse={(node) => {
            if (node instanceof Mesh3D && node.label === "Armor") {
              node.material = customMat;
            }
          }}
        />
      </View3D>
    ));

    // WHEN
    const armorMesh = modelRef.children[0] as Mesh3D;

    // THEN
    expect(armorMesh).toBeInstanceOf(Mesh3D);
    expect(armorMesh.material).toBe(customMat);

    cleanup();
  });

  it("GIVEN a model node tree WHEN traverse walks it THEN it visits the root then each descendant", () => {
    // GIVEN
    const parent = new PixiContainer3D();
    const child = new PixiContainer3D();
    parent.addChild(child);

    const visited: Pixi3D.Container3D[] = [];

    // WHEN
    parent.traverse((node) => visited.push(node));

    // THEN
    expect(visited).toEqual([parent, child]);
  });

  it("GIVEN materials overrides WHEN the model builds its meshes THEN it draws them without touching the source", () => {
    // GIVEN
    const sourceMaterial = new Material3D({ baseColor: 0xff0000 });
    const overrideMaterial = new Material3D({ baseColor: 0x0000ff });
    const source = createSource();
    (source as unknown as { materials: Material3D[] }).materials = [sourceMaterial];

    let modelRef: any;

    mountScene(() => (
      <View3D width={300} height={300}>
        <Model3D ref={(m) => (modelRef = m)} source={source} materials={() => overrideMaterial} />
      </View3D>
    ));

    // WHEN
    const armorMesh = modelRef.children[0] as Mesh3D;

    // THEN
    expect(armorMesh.material).toBe(overrideMaterial);
    expect(sourceMaterial.baseColor).toBe(0xff0000);

    cleanup();
  });

  it("GIVEN an existing Model3D adopted through as WHEN it unmounts THEN it is not destroyed", () => {
    // GIVEN
    const owned = new PixiModel3D({ source: createSource(), autoUpdate: false });

    mountScene(() => (
      <View3D width={300} height={300}>
        <Model3D as={owned} />
      </View3D>
    ));

    // WHEN
    cleanup();

    // THEN
    expect(owned.destroyed).toBe(false);

    owned.destroy({ children: true });
  });
});
