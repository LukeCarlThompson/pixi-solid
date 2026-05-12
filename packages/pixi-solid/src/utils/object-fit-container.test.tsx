import type * as Pixi from "pixi.js";
import { Ticker, Texture } from "pixi.js";
import { createSignal } from "solid-js";
import { describe, expect, it } from "vitest";

import { Sprite } from "../components/components";
import { TickerProvider } from "../pixi-application";
import { mountHeadless } from "../testing";
import { ObjectFitContainer } from "./object-fit";

describe("ObjectFitContainer", () => {
  it("GIVEN observeBounds is false and no ticker context WHEN mounted THEN it does not throw", () => {
    expect(() => {
      const dispose = mountHeadless(() => (
        <ObjectFitContainer width={100} height={100} fitMode="contain" observeBounds={false}>
          <Sprite texture={Texture.WHITE} width={50} height={50} />
        </ObjectFitContainer>
      ));

      dispose();
    }).not.toThrow();
  });

  it("GIVEN no ticker context and observeBounds is omitted WHEN mounted THEN it does not throw", () => {
    expect(() => {
      const dispose = mountHeadless(() => (
        <ObjectFitContainer width={100} height={100} fitMode="contain">
          <Sprite texture={Texture.WHITE} width={50} height={50} />
        </ObjectFitContainer>
      ));

      dispose();
    }).not.toThrow();
  });

  it("GIVEN no ticker context and observeBounds is true WHEN mounted THEN it throws", () => {
    expect(() => {
      const dispose = mountHeadless(() => (
        <ObjectFitContainer width={100} height={100} fitMode="contain" observeBounds={true}>
          <Sprite texture={Texture.WHITE} width={50} height={50} />
        </ObjectFitContainer>
      ));

      dispose();
    }).toThrow();
  });

  it("GIVEN observeBounds is false WHEN child local bounds change THEN fit is not recomputed on ticker updates", () => {
    const ticker = new Ticker();
    const [spriteWidth, setSpriteWidth] = createSignal(50);
    let spriteRef: Pixi.Sprite | undefined;

    const dispose = mountHeadless(() => (
      <TickerProvider ticker={ticker}>
        <ObjectFitContainer width={100} height={100} fitMode="contain" observeBounds={false}>
          <Sprite
            texture={Texture.WHITE}
            width={spriteWidth()}
            height={50}
            ref={(sprite) => {
              spriteRef = sprite;
            }}
          />
        </ObjectFitContainer>
      </TickerProvider>
    ));

    const wrapper = spriteRef?.parent;
    expect(wrapper).toBeDefined();
    expect(wrapper?.scale.x).toBeCloseTo(2);
    expect(wrapper?.scale.y).toBeCloseTo(2);

    setSpriteWidth(100);
    ticker.update();

    expect(wrapper?.scale.x).toBeCloseTo(2);
    expect(wrapper?.scale.y).toBeCloseTo(2);

    dispose();
  });

  it("GIVEN observeBounds is true and child local bounds change WHEN ticker updates THEN fit is recomputed", () => {
    const ticker = new Ticker();
    const [spriteWidth, setSpriteWidth] = createSignal(50);
    let spriteRef: Pixi.Sprite | undefined;

    const dispose = mountHeadless(() => (
      <TickerProvider ticker={ticker}>
        <ObjectFitContainer width={100} height={100} fitMode="contain" observeBounds={true}>
          <Sprite
            texture={Texture.WHITE}
            width={spriteWidth()}
            height={50}
            ref={(sprite) => {
              spriteRef = sprite;
            }}
          />
        </ObjectFitContainer>
      </TickerProvider>
    ));

    const wrapper = spriteRef?.parent;
    expect(wrapper).toBeDefined();
    expect(wrapper?.scale.x).toBeCloseTo(2);
    expect(wrapper?.scale.y).toBeCloseTo(2);

    setSpriteWidth(100);
    ticker.update();

    expect(wrapper?.scale.x).toBeCloseTo(1);
    expect(wrapper?.scale.y).toBeCloseTo(1);

    dispose();
  });

  it("GIVEN multiple children with different sizes WHEN ObjectFitContainer mounts THEN all children are wrapped and scaled", () => {
    const ticker = new Ticker();
    let spriteRef1: Pixi.Sprite | undefined;
    let spriteRef2: Pixi.Sprite | undefined;

    const dispose = mountHeadless(() => (
      <TickerProvider ticker={ticker}>
        <ObjectFitContainer width={100} height={100} fitMode="contain" observeBounds={false}>
          <Sprite
            texture={Texture.WHITE}
            width={100}
            height={50}
            ref={(sprite) => {
              spriteRef1 = sprite;
            }}
          />
          <Sprite
            texture={Texture.WHITE}
            width={50}
            height={100}
            ref={(sprite) => {
              spriteRef2 = sprite;
            }}
          />
        </ObjectFitContainer>
      </TickerProvider>
    ));

    // Both sprites should have parents (their individual wrappers)
    expect(spriteRef1?.parent).toBeDefined();
    expect(spriteRef2?.parent).toBeDefined();

    // Both wrappers should be children of ObjectFitContainer's inner Container
    expect(spriteRef1?.parent?.parent).toBeDefined();
    expect(spriteRef2?.parent?.parent).toBeDefined();

    dispose();
  });

  it("GIVEN multiple children and observeBounds is true WHEN a child changes size THEN fit is recomputed for all children", () => {
    const ticker = new Ticker();
    const [sprite1Width, setSprite1Width] = createSignal(100);
    let spriteRef1: Pixi.Sprite | undefined;

    const dispose = mountHeadless(() => (
      <TickerProvider ticker={ticker}>
        <ObjectFitContainer width={100} height={100} fitMode="contain" observeBounds={true}>
          <Sprite
            texture={Texture.WHITE}
            width={sprite1Width()}
            height={50}
            ref={(sprite) => {
              spriteRef1 = sprite;
            }}
          />
          <Sprite texture={Texture.WHITE} width={50} height={100} />
        </ObjectFitContainer>
      </TickerProvider>
    ));

    const wrapper1 = spriteRef1?.parent;
    expect(wrapper1).toBeDefined();
    const initialScaleX = wrapper1?.scale.x ?? 0;
    const initialScaleY = wrapper1?.scale.y ?? 0;

    // Change first sprite size
    setSprite1Width(200);
    ticker.update();

    // Scale should change to accommodate the larger sprite
    expect(wrapper1?.scale.x).not.toBeCloseTo(initialScaleX);
    expect(wrapper1?.scale.y).not.toBeCloseTo(initialScaleY);

    dispose();
  });

  it("GIVEN multiple children WHEN fitMode is cover THEN each child is scaled appropriately", () => {
    const ticker = new Ticker();
    let spriteRef1: Pixi.Sprite | undefined;
    let spriteRef2: Pixi.Sprite | undefined;

    const dispose = mountHeadless(() => (
      <TickerProvider ticker={ticker}>
        <ObjectFitContainer width={100} height={100} fitMode="cover" observeBounds={false}>
          <Sprite
            texture={Texture.WHITE}
            width={50}
            height={200}
            ref={(sprite) => {
              spriteRef1 = sprite;
            }}
          />
          <Sprite
            texture={Texture.WHITE}
            width={200}
            height={50}
            ref={(sprite) => {
              spriteRef2 = sprite;
            }}
          />
        </ObjectFitContainer>
      </TickerProvider>
    ));

    const wrapper1 = spriteRef1?.parent;
    const wrapper2 = spriteRef2?.parent;

    expect(wrapper1).toBeDefined();
    expect(wrapper2).toBeDefined();

    // Each child has its own wrapper
    expect(wrapper1).not.toBe(wrapper2);

    // Both wrappers should scale equally (cover mode means max scale)
    const scaleY1 = wrapper1?.scale.y ?? 0;
    const scaleY2 = wrapper2?.scale.y ?? 0;
    const scaleX2 = wrapper2?.scale.x ?? 0;

    expect(wrapper1?.scale.x).toBeCloseTo(scaleY1);
    expect(wrapper2?.scale.x).toBeCloseTo(scaleY2);
    expect(wrapper1?.scale.x).toBeCloseTo(scaleX2);

    dispose();
  });
});
