import type * as Pixi from "pixi.js";
import { Texture, Ticker } from "pixi.js";
import { createSignal } from "solid-js";
import { afterEach, describe, expect, it, vi } from "vitest";

import { TickerProvider } from "../pixi-application";
import { mountHeadless } from "../testing";

import { AnimatedSprite, Container, RenderLayer, Sprite, TilingSprite } from "./components";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Component Factory Cleanup on Unmount", () => {
  it("GIVEN a Container component WHEN the root is disposedTHEN the instance is destroyed with children flag", () => {
    let containerRef: Pixi.Container | undefined;
    let destroyCalled = false;

    const dispose = mountHeadless(() => (
      <Container
        ref={(el) => {
          containerRef = el;
          const originalDestroy = el.destroy.bind(el);
          el.destroy = vi.fn((options) => {
            destroyCalled = true;
            expect(options).toEqual({ children: true });
            originalDestroy(options);
          });
        }}
      />
    ));

    expect(containerRef).toBeDefined();

    dispose();

    expect(destroyCalled).toBe(true);
  });

  it("GIVEN a component mounted and then unmounted WHEN remounted with new children THEN old children are destroyed before new ones added", () => {
    const destroyedInstances: Pixi.Container[] = [];
    const [shouldShow, setShouldShow] = createSignal(true);
    let currentContainerRef: Pixi.Container | undefined;

    const trackDestroy = (el: Pixi.Container) => {
      const originalDestroy = el.destroy.bind(el);
      el.destroy = vi.fn((options) => {
        destroyedInstances.push(el);
        originalDestroy(options);
      });
    };

    const dispose = mountHeadless(() =>
      shouldShow() ? (
        <Container
          ref={(el) => {
            trackDestroy(el);
            currentContainerRef = el;
          }}
        >
          <Container
            ref={(el) => {
              trackDestroy(el);
            }}
          />
        </Container>
      ) : null,
    );

    expect(currentContainerRef).toBeDefined();
    const firstContainerRef = currentContainerRef;

    // WHEN: Hide the component (triggers cleanup)
    setShouldShow(false);

    // THEN: The container and its child should be destroyed
    expect(destroyedInstances).toContain(firstContainerRef);
    expect(destroyedInstances.length).toBeGreaterThanOrEqual(2);

    // WHEN: Show a new component
    setShouldShow(true);

    // THEN: A new instance should be created
    expect(currentContainerRef).not.toBe(firstContainerRef);

    dispose();
  });

  it("GIVEN a Container with children WHEN unmounted THEN all children are properly destroyed", () => {
    const destroyedChildren: Pixi.Container[] = [];
    const [showContainer, setShowContainer] = createSignal(true);
    let parentRef: Pixi.Container | undefined;

    const dispose = mountHeadless(() =>
      showContainer() ? (
        <Container
          ref={(el) => {
            parentRef = el;
          }}
        >
          <Container
            ref={(el) => {
              const originalDestroy = el.destroy.bind(el);
              el.destroy = vi.fn((options) => {
                destroyedChildren.push(el);
                originalDestroy(options);
              });
            }}
          />
          <Container
            ref={(el) => {
              const originalDestroy = el.destroy.bind(el);
              el.destroy = vi.fn((options) => {
                destroyedChildren.push(el);
                originalDestroy(options);
              });
            }}
          />
        </Container>
      ) : null,
    );

    expect(parentRef).toBeDefined();
    expect(destroyedChildren.length).toBe(0);

    setShowContainer(false);

    expect(destroyedChildren.length).toBe(2);

    dispose();
  });

  it("GIVEN a Container remounted multiple times WHEN each cycle completes THEN all instances are properly destroyed", () => {
    const destroyedInstances: Pixi.Container[] = [];
    const [shouldShow, setShouldShow] = createSignal(true);

    const dispose = mountHeadless(() =>
      shouldShow() ? (
        <Container
          ref={(el) => {
            const originalDestroy = el.destroy.bind(el);
            el.destroy = vi.fn((options) => {
              destroyedInstances.push(el);
              originalDestroy(options);
            });
          }}
        />
      ) : null,
    );

    expect(destroyedInstances.length).toBe(0);

    setShouldShow(false);
    expect(destroyedInstances.length).toBe(1);

    setShouldShow(true);
    expect(destroyedInstances.length).toBe(1);

    setShouldShow(false);
    expect(destroyedInstances.length).toBe(2);

    dispose();
  });
});

describe("RenderLayer Component Cleanup", () => {
  it("GIVEN a RenderLayer with component children WHEN children are removed THEN child component cleanup still destroys them", () => {
    const detachedChildren: Pixi.Container[] = [];
    const [showChild, setShowChild] = createSignal(true);
    let renderLayerRef: Pixi.Container | undefined;

    const dispose = mountHeadless(() => (
      <RenderLayer
        ref={(el) => {
          renderLayerRef = el;
        }}
      >
        {showChild() ? (
          <Container
            ref={(el) => {
              const originalDestroy = el.destroy.bind(el);
              el.destroy = vi.fn((options) => {
                detachedChildren.push(el);
                originalDestroy(options);
              });
            }}
          />
        ) : null}
      </RenderLayer>
    ));

    expect(renderLayerRef).toBeDefined();
    expect(detachedChildren.length).toBe(0);

    setShowChild(false);

    expect(detachedChildren.length).toBe(1);

    dispose();
  });
});

describe("AnimatedSprite ticker integration", () => {
  it("GIVEN an AnimatedSprite WHEN mounted in TickerProvider THEN context ticker is used and cleaned up", () => {
    const contextTicker = new Ticker();

    const contextTickerAddSpy = vi.spyOn(contextTicker, "add");
    const contextTickerRemoveSpy = vi.spyOn(contextTicker, "remove");
    const sharedTickerAddSpy = vi.spyOn(Ticker.shared, "add");
    const sharedTickerRemoveSpy = vi.spyOn(Ticker.shared, "remove");

    const dispose = mountHeadless(() => (
      <TickerProvider ticker={contextTicker}>
        <AnimatedSprite textures={[Texture.WHITE]} />
      </TickerProvider>
    ));

    expect(contextTickerAddSpy).toHaveBeenCalledTimes(1);
    expect(sharedTickerAddSpy).not.toHaveBeenCalled();

    const updateCallback = contextTickerAddSpy.mock.calls[0]?.[0];
    expect(updateCallback).toBeTypeOf("function");

    dispose();

    expect(contextTickerRemoveSpy).toHaveBeenCalledWith(updateCallback);
    expect(sharedTickerRemoveSpy).not.toHaveBeenCalled();
  });

  it("GIVEN autoUpdate is false WHEN mounted THEN update loop is not added to the context ticker", () => {
    const contextTicker = new Ticker();
    const contextTickerAddSpy = vi.spyOn(contextTicker, "add");

    const dispose = mountHeadless(() => (
      <TickerProvider ticker={contextTicker}>
        <AnimatedSprite textures={[Texture.WHITE]} autoUpdate={false} />
      </TickerProvider>
    ));

    expect(contextTickerAddSpy).toHaveBeenCalledTimes(0);

    dispose();
  });

  it("GIVEN autoUpdate is true WHEN mounted THEN update loop is added to context ticker and cleaned up on unmount", () => {
    const contextTicker = new Ticker();
    const contextTickerAddSpy = vi.spyOn(contextTicker, "add");
    const contextTickerRemoveSpy = vi.spyOn(contextTicker, "remove");

    const dispose = mountHeadless(() => (
      <TickerProvider ticker={contextTicker}>
        <AnimatedSprite textures={[Texture.WHITE]} autoUpdate={true} />
      </TickerProvider>
    ));

    expect(contextTickerAddSpy).toHaveBeenCalledTimes(1);

    const updateCallback = contextTickerAddSpy.mock.calls[0]?.[0];
    expect(updateCallback).toBeTypeOf("function");

    dispose();

    expect(contextTickerRemoveSpy).toHaveBeenCalledWith(updateCallback);
  });

  it("GIVEN autoUpdate changes reactively WHEN toggled from false to true and back THEN ticker subscription follows latest value", () => {
    const contextTicker = new Ticker();
    const [autoUpdate, setAutoUpdate] = createSignal(false);

    const contextTickerAddSpy = vi.spyOn(contextTicker, "add");
    const contextTickerRemoveSpy = vi.spyOn(contextTicker, "remove");

    const dispose = mountHeadless(() => (
      <TickerProvider ticker={contextTicker}>
        <AnimatedSprite textures={[Texture.WHITE]} autoUpdate={autoUpdate()} />
      </TickerProvider>
    ));

    expect(contextTickerAddSpy).toHaveBeenCalledTimes(0);

    setAutoUpdate(true);
    expect(contextTickerAddSpy).toHaveBeenCalledTimes(1);

    const updateCallback = contextTickerAddSpy.mock.calls[0]?.[0];
    expect(updateCallback).toBeTypeOf("function");

    setAutoUpdate(false);
    expect(contextTickerRemoveSpy).toHaveBeenCalledWith(updateCallback);

    return dispose();
  });

  it("GIVEN no TickerProvider WHEN mounted with autoUpdate={false} THEN it does not throw", () => {
    expect(() => {
      const dispose = mountHeadless(() => (
        <AnimatedSprite textures={[Texture.WHITE]} autoUpdate={false} />
      ));

      dispose();
    }).not.toThrow();
  });

  it("GIVEN no TickerProvider WHEN mounted with autoUpdate enabled THEN it throws", () => {
    expect(() => {
      const dispose = mountHeadless(() => <AnimatedSprite textures={[Texture.WHITE]} />);

      dispose();
    }).toThrow();
  });
});

describe("Sprite-like component cleanup", () => {
  it("GIVEN a Sprite WHEN root is disposed THEN instance is destroyed", () => {
    let spriteRef: Pixi.Sprite | undefined;
    let destroyCalled = false;

    const dispose = mountHeadless(() => (
      <Sprite
        texture={Texture.WHITE}
        ref={(el) => {
          spriteRef = el;
          const originalDestroy = el.destroy.bind(el);
          el.destroy = vi.fn((options) => {
            destroyCalled = true;
            expect(options).toEqual({ children: true });
            originalDestroy(options);
          });
        }}
      />
    ));

    expect(spriteRef).toBeDefined();

    dispose();

    expect(destroyCalled).toBe(true);
  });

  it("GIVEN an AnimatedSprite WHEN root is disposed THEN instance is destroyed", () => {
    let animatedSpriteRef: Pixi.AnimatedSprite | undefined;
    let destroyCalled = false;
    const contextTicker = new Ticker();

    const dispose = mountHeadless(() => (
      <TickerProvider ticker={contextTicker}>
        <AnimatedSprite
          textures={[Texture.WHITE]}
          ref={(el) => {
            animatedSpriteRef = el;
            const originalDestroy = el.destroy.bind(el);
            el.destroy = vi.fn((options) => {
              destroyCalled = true;
              expect(options).toEqual({ children: true });
              originalDestroy(options);
            });
          }}
        />
      </TickerProvider>
    ));

    expect(animatedSpriteRef).toBeDefined();

    dispose();

    expect(destroyCalled).toBe(true);
  });

  it("GIVEN a TilingSprite WHEN root is disposed THEN instance is destroyed", () => {
    let tilingSpriteRef: Pixi.TilingSprite | undefined;
    let destroyCalled = false;

    const dispose = mountHeadless(() => (
      <TilingSprite
        texture={Texture.WHITE}
        width={100}
        height={100}
        ref={(el) => {
          tilingSpriteRef = el;
          const originalDestroy = el.destroy.bind(el);
          el.destroy = vi.fn((options) => {
            destroyCalled = true;
            expect(options).toEqual({ children: true });
            originalDestroy(options);
          });
        }}
      />
    ));

    expect(tilingSpriteRef).toBeDefined();

    dispose();

    expect(destroyCalled).toBe(true);
  });
});
