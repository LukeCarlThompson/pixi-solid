import type * as Pixi3DExtras from "@pixi/3d/extras";
import { ParticleSystem3D as PixiParticleSystem3D } from "@pixi/3d/extras";
import { getTicker } from "pixi-solid";
import type * as Pixi from "pixi.js";
import { createRenderEffect, on, onCleanup, splitProps, type JSX } from "solid-js";

import { bindInitialisationProps3D, bindRuntimeProps3D } from "./bind-props";
import { LEAF3D_RUNTIME_KEYS, type Leaf3DProps, type PixiComponent3D } from "./factories";

export type ParticleSystem3DComponentProps = Leaf3DProps<PixiParticleSystem3D> &
  Omit<Partial<Pixi3DExtras.ParticleSystem3DOptions>, "children"> & {
    playing?: boolean;
  };

const PARTICLE_SYSTEM_KEYS = [
  ...LEAF3D_RUNTIME_KEYS,
  "autoUpdate",
  "playing",
  "emitRate",
  "gravity",
  "drag",
  "frameRate",
] as const;

/**
 * SolidJS component that renders a 3D GPU particle system (`ParticleSystem3D`).
 *
 * Automatically manages lifecycle and synchronizes updates with the scoped Pixi.Ticker
 * from context (e.g. `<PixiCanvas>`, `<PixiApplicationProvider>`, or `<TickerProvider>`)
 * instead of tying to global `Ticker.shared`.
 */
export const ParticleSystem3D: PixiComponent3D<
  ParticleSystem3DComponentProps,
  PixiParticleSystem3D
> = (props) => {
  const [runtimeProps, initialisationProps] = splitProps(props as any, PARTICLE_SYSTEM_KEYS as any);

  const isUserOwnedInstance = runtimeProps.as !== undefined;
  const instance =
    props.as ||
    new PixiParticleSystem3D({
      autoUpdate: false,
      ...initialisationProps,
    });

  // Re-wire to the scoped context ticker if autoUpdate is not explicitly false
  createRenderEffect(
    on(
      () => (props as any).autoUpdate,
      (autoUpdate) => {
        if (autoUpdate === false) return;

        const onTick = (ticker: Pixi.Ticker) => {
          instance.update(ticker);
        };

        try {
          const ticker = getTicker();
          ticker.add(onTick);
          onCleanup(() => {
            ticker.remove(onTick);
          });
        } catch {
          // Fallback gracefully if mounted without context ticker
        }
      },
    ),
  );

  // Reactive setters for particle system parameters
  createRenderEffect(
    on(
      () => (props as any).playing,
      (playing) => {
        if (playing === undefined) return;
        if (playing) {
          instance.play();
        } else {
          instance.stop();
        }
      },
    ),
  );

  createRenderEffect(
    on(
      () => (props as any).emitRate,
      (emitRate) => {
        if (emitRate !== undefined) instance.emitRate = emitRate;
      },
    ),
  );

  createRenderEffect(
    on(
      () => (props as any).gravity,
      (gravity) => {
        if (gravity !== undefined) instance.gravity = gravity;
      },
    ),
  );

  createRenderEffect(
    on(
      () => (props as any).drag,
      (drag) => {
        if (drag !== undefined) instance.drag = drag;
      },
    ),
  );

  createRenderEffect(
    on(
      () => (props as any).frameRate,
      (frameRate) => {
        if (frameRate !== undefined) instance.frameRate = frameRate;
      },
    ),
  );

  bindInitialisationProps3D(instance, initialisationProps);
  bindRuntimeProps3D(instance, runtimeProps as any);

  onCleanup(() => {
    if (isUserOwnedInstance) return;
    instance.destroy({ children: true });
  });

  return instance as PixiParticleSystem3D & JSX.Element;
};
