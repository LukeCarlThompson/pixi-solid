import type * as Pixi from "pixi.js";
import { createRoot, createSignal } from "solid-js";
import { describe, expect, it, vi } from "vitest";

import { NoMount } from "../testing";

import { Container, RenderLayer } from "./components";

describe("Component Factory Cleanup on Unmount", () => {
  it("GIVEN a Container component WHEN the root is disposedTHEN the instance is destroyed with children flag", () => {
    let containerRef: Pixi.Container | undefined;
    let destroyCalled = false;

    createRoot((dispose) => {
      const TestComponent = () => {
        return (
          <NoMount>
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
          </NoMount>
        );
      };

      TestComponent();

      expect(containerRef).toBeDefined();

      // Trigger cleanup
      dispose();

      expect(destroyCalled).toBe(true);
    });
  });

  it("GIVEN a component mounted and then unmounted WHEN remounted with new children THEN old children are destroyed before new ones added", async () => {
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

    await createRoot(async (dispose) => {
      const TestComponent = () => {
        return (
          <NoMount>
            {shouldShow() && (
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
            )}
          </NoMount>
        );
      };

      TestComponent();
      await Promise.resolve();

      expect(currentContainerRef).toBeDefined();
      const firstContainerRef = currentContainerRef;

      // WHEN: Hide the component (triggers cleanup)
      setShouldShow(false);

      // THEN: The container and its child should be destroyed
      expect(destroyedInstances).toContain(firstContainerRef);
      expect(destroyedInstances.length).toBeGreaterThanOrEqual(2); // parent + child

      // WHEN: Show a new component
      setShouldShow(true);

      // THEN: A new instance should be created
      expect(currentContainerRef).not.toBe(firstContainerRef);

      dispose();
    });
  });

  it("GIVEN a Container with children WHEN unmounted THEN all children are properly destroyed", () => {
    const destroyedChildren: Pixi.Container[] = [];
    const [showContainer, setShowContainer] = createSignal(true);

    createRoot((dispose) => {
      let parentRef: Pixi.Container | undefined;

      const TestComponent = () => {
        return (
          <NoMount>
            {showContainer() && (
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
            )}
          </NoMount>
        );
      };

      TestComponent();

      expect(parentRef).toBeDefined();
      expect(destroyedChildren.length).toBe(0);

      // WHEN: Remove the container
      setShowContainer(false);

      // THEN: Children should be destroyed
      expect(destroyedChildren.length).toBe(2);

      dispose();
    });
  });

  it("GIVEN a Container remounted multiple times WHEN each cycle completes THEN all instances are properly destroyed", () => {
    const destroyedInstances: Pixi.Container[] = [];
    const [shouldShow, setShouldShow] = createSignal(true);

    createRoot((dispose) => {
      const TestComponent = () => {
        return (
          <NoMount>
            {shouldShow() && (
              <Container
                ref={(el) => {
                  const originalDestroy = el.destroy.bind(el);
                  el.destroy = vi.fn((options) => {
                    destroyedInstances.push(el);
                    originalDestroy(options);
                  });
                }}
              />
            )}
          </NoMount>
        );
      };

      TestComponent();

      // Mount cycle 1
      expect(destroyedInstances.length).toBe(0);

      // Unmount
      setShouldShow(false);
      expect(destroyedInstances.length).toBe(1);

      // Remount with different key
      setShouldShow(true);
      expect(destroyedInstances.length).toBe(1); // Still 1, new instance created

      // Unmount again
      setShouldShow(false);
      expect(destroyedInstances.length).toBe(2); // Second instance destroyed

      dispose();
    });
  });
});

describe("RenderLayer Component Cleanup", () => {
  it("GIVEN a RenderLayer with children WHEN children are removed THEN children are not destroyed", () => {
    const detachedChildren: Pixi.Container[] = [];
    const [showChild, setShowChild] = createSignal(true);

    createRoot((dispose) => {
      let renderLayerRef: Pixi.Container | undefined;

      const TestComponent = () => {
        return (
          <NoMount>
            <RenderLayer
              ref={(el) => {
                renderLayerRef = el;
              }}
            >
              {showChild() && (
                <Container
                  ref={(el) => {
                    const originalDestroy = el.destroy.bind(el);
                    el.destroy = vi.fn((options) => {
                      detachedChildren.push(el);
                      originalDestroy(options);
                    });
                  }}
                />
              )}
            </RenderLayer>
          </NoMount>
        );
      };

      TestComponent();

      expect(renderLayerRef).toBeDefined();
      expect(detachedChildren.length).toBe(0);

      // WHEN: Remove the child
      setShowChild(false);

      // THEN: The child should NOT be destroyed (RenderLayer only detaches)
      expect(detachedChildren.length).toBe(0);

      dispose();
    });
  });
});
