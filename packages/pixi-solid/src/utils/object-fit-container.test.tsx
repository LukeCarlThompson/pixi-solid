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
});
