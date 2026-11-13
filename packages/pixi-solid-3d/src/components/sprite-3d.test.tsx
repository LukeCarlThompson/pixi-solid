import type * as Pixi3D from "@pixi/3d";
import { FlatMaterial, Material3D, PlaneGeometry, Sprite3D as PixiSprite3D } from "@pixi/3d";
import { cleanup, mountScene } from "pixi-solid/testing";
import { Texture } from "pixi.js";
import { createSignal } from "solid-js";
import { describe, expect, it } from "vitest";

import { Container3D, Sprite3D } from "../components";

describe("Sprite3D component", () => {
  it("GIVEN texture, tint, alpha, anchor and billboard props WHEN it mounts THEN it carries them", () => {
    // GIVEN
    const texture = Texture.WHITE;

    // WHEN
    const { container } = mountScene<PixiSprite3D>(() => (
      <Sprite3D
        label="card"
        texture={texture}
        tint={0xff8800}
        alpha={0.5}
        anchor={0.5}
        billboardMode="cylindrical"
        x={1}
        y={2}
        z={3}
      />
    ));

    // THEN
    expect(container).toBeInstanceOf(PixiSprite3D);
    expect(container.texture).toBe(texture);
    expect(container.tint).toBe(0xff8800);
    expect(container.alpha).toBe(0.5);
    expect(container.anchor.x).toBe(0.5);
    expect(container.anchor.y).toBe(0.5);
    expect(container.billboardMode).toBe("cylindrical");
    expect(container.x).toBe(1);
    expect(container.y).toBe(2);
    expect(container.z).toBe(3);

    cleanup();
  });

  it("GIVEN a material with a base colour slot WHEN it mounts THEN the material win and sets alpha mode", () => {
    // GIVEN
    const material = new Material3D({ baseColorTexture: Texture.WHITE });

    // WHEN
    const { container } = mountScene<PixiSprite3D>(() => (
      <Sprite3D label="card" material={material} alphaMode="mask" alphaCutoff={0.25} />
    ));

    // THEN
    expect(container.material).toBe(material);
    expect(container.alphaMode).toBe("mask");
    expect(container.alphaCutoff).toBe(0.25);

    cleanup();
  });

  it("GIVEN signals bound to tint and alpha WHEN they change THEN the sprite follows", () => {
    // GIVEN
    const [tint, setTint] = createSignal<number>(0xffffff);
    const [alpha, setAlpha] = createSignal(1);

    const { container } = mountScene<PixiSprite3D>(() => (
      <Sprite3D label="card" texture={Texture.WHITE} tint={tint()} alpha={alpha()} />
    ));

    expect(container.tint).toBe(0xffffff);
    expect(container.alpha).toBe(1);

    // WHEN
    setTint(0x00ff00);

    // THEN
    expect(container.tint).toBe(0x00ff00);

    // WHEN
    setAlpha(0.25);

    // THEN
    expect(container.alpha).toBe(0.25);

    cleanup();
  });

  it("GIVEN two sprites WHEN they mount THEN they share one quad and own their materials", () => {
    // GIVEN
    const { container } = mountScene<Pixi3D.Container3D>(() => (
      <Container3D>
        <Sprite3D label="a" texture={Texture.WHITE} />
        <Sprite3D label="b" texture={Texture.WHITE} />
      </Container3D>
    ));

    const [first, second] = container.children;

    if (!(first instanceof PixiSprite3D) || !(second instanceof PixiSprite3D)) {
      throw new Error("expected two Sprite3D children");
    }

    const geometry = first.geometry;
    const material = first.material;
    const secondMaterial = second.material;

    // THEN
    expect(geometry).toBeInstanceOf(PlaneGeometry);
    expect(second.geometry).toBe(geometry);
    expect(material).toBeInstanceOf(FlatMaterial);
    expect(material.lit).toBe(false);
    expect(material.doubleSided).toBe(true);
    expect(secondMaterial).not.toBe(material);

    // WHEN
    cleanup();

    // THEN
    expect((geometry as unknown as { _destroyed: boolean })._destroyed).toBeFalsy();
    expect(material.destroyed).toBe(true);
    expect(secondMaterial.destroyed).toBe(true);
  });

  it("GIVEN an existing Sprite3D adopted through as WHEN it unmounts THEN it is not destroyed", () => {
    // GIVEN
    const owned = new PixiSprite3D({ texture: Texture.WHITE, label: "owned" });

    mountScene<PixiSprite3D>(() => <Sprite3D as={owned} />);

    // WHEN
    cleanup();

    // THEN
    expect(owned.destroyed).toBe(false);

    owned.destroy({ texture: false });
  });
});
