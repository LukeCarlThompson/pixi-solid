import { render } from "@solidjs/testing-library";
import type * as Pixi from "pixi.js";
import { Container, Ticker } from "pixi.js";
import { createSignal } from "solid-js";
import { afterEach, describe, expect, it, vi } from "vitest";

import { TickerProvider } from "../pixi-application";
import { NoMount } from "../testing";

import { createSpriteComponent } from "./component-factories";

type TestSpriteOptions = {
  label?: string;
};

class TestAnimatedSpriteLike extends Container {
  public autoUpdate = true;

  public update = vi.fn((_ticker: Pixi.Ticker) => {
    return;
  });

  public constructor(_props: TestSpriteOptions) {
    super();
  }
}

const TestSprite = createSpriteComponent<TestAnimatedSpriteLike, TestSpriteOptions>(
  TestAnimatedSpriteLike,
);

afterEach(() => {
  vi.restoreAllMocks();
});

describe("createSpriteComponent ticker behavior", () => {
  it("GIVEN an AnimatedSprite-like component WHEN mounted THEN update loop uses ticker from context and cleans up on unmount", () => {
    const contextTicker = new Ticker();

    const contextTickerAddSpy = vi.spyOn(contextTicker, "add");
    const contextTickerRemoveSpy = vi.spyOn(contextTicker, "remove");
    const sharedTickerAddSpy = vi.spyOn(Ticker.shared, "add");
    const sharedTickerRemoveSpy = vi.spyOn(Ticker.shared, "remove");

    const mounted = render(() => (
      <TickerProvider ticker={contextTicker}>
        <NoMount>
          <TestSprite />
        </NoMount>
      </TickerProvider>
    ));

    expect(contextTickerAddSpy).toHaveBeenCalledTimes(1);
    expect(contextTickerRemoveSpy).toHaveBeenCalledTimes(0);
    expect(sharedTickerAddSpy).not.toHaveBeenCalled();
    expect(sharedTickerRemoveSpy).not.toHaveBeenCalled();

    const updateCallback = contextTickerAddSpy.mock.calls[0]?.[0];
    expect(updateCallback).toBeTypeOf("function");

    mounted.unmount();

    expect(contextTickerRemoveSpy).toHaveBeenCalledWith(updateCallback);
    expect(sharedTickerAddSpy).not.toHaveBeenCalled();
    expect(sharedTickerRemoveSpy).not.toHaveBeenCalled();
  });

  it("GIVEN autoUpdate is false WHEN mounted THEN update loop is not added to the context ticker", () => {
    const contextTicker = new Ticker();

    const contextTickerAddSpy = vi.spyOn(contextTicker, "add");
    const contextTickerRemoveSpy = vi.spyOn(contextTicker, "remove");

    render(() => (
      <TickerProvider ticker={contextTicker}>
        <NoMount>
          <TestSprite autoUpdate={false} />
        </NoMount>
      </TickerProvider>
    ));

    expect(contextTickerAddSpy).toHaveBeenCalledTimes(0);
    expect(contextTickerRemoveSpy).toHaveBeenCalledTimes(1);
  });

  it("GIVEN autoUpdate is true WHEN mounted THEN update loop is added to context ticker and cleaned up on unmount", () => {
    const contextTicker = new Ticker();

    const contextTickerAddSpy = vi.spyOn(contextTicker, "add");
    const contextTickerRemoveSpy = vi.spyOn(contextTicker, "remove");

    const mounted = render(() => (
      <TickerProvider ticker={contextTicker}>
        <NoMount>
          <TestSprite autoUpdate={true} />
        </NoMount>
      </TickerProvider>
    ));

    expect(contextTickerAddSpy).toHaveBeenCalledTimes(1);

    const updateCallback = contextTickerAddSpy.mock.calls[0]?.[0];
    expect(updateCallback).toBeTypeOf("function");

    mounted.unmount();

    expect(contextTickerRemoveSpy).toHaveBeenCalledWith(updateCallback);
  });

  it("GIVEN autoUpdate changes after initialisation WHEN toggled from false to true and back THEN ticker subscription follows latest value", () => {
    const contextTicker = new Ticker();
    const [autoUpdate, setAutoUpdate] = createSignal(false);

    const contextTickerAddSpy = vi.spyOn(contextTicker, "add");
    const contextTickerRemoveSpy = vi.spyOn(contextTicker, "remove");

    const mounted = render(() => (
      <TickerProvider ticker={contextTicker}>
        <NoMount>
          <TestSprite autoUpdate={autoUpdate()} />
        </NoMount>
      </TickerProvider>
    ));

    expect(contextTickerAddSpy).toHaveBeenCalledTimes(0);
    expect(contextTickerRemoveSpy).toHaveBeenCalledTimes(1);

    setAutoUpdate(true);

    expect(contextTickerAddSpy).toHaveBeenCalledTimes(1);

    const updateCallback = contextTickerAddSpy.mock.calls[0]?.[0];
    expect(updateCallback).toBeTypeOf("function");

    setAutoUpdate(false);

    expect(contextTickerRemoveSpy).toHaveBeenCalledWith(updateCallback);

    mounted.unmount();
  });
});
