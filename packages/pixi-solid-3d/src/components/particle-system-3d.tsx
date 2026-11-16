import type * as Pixi3DExtras from "@pixi/3d/extras";
import { ParticleSystem3D as PixiParticleSystem3D } from "@pixi/3d/extras";
import { getTicker } from "pixi-solid";
import type * as Pixi from "pixi.js";
import { createRenderEffect, on, onCleanup, splitProps, type JSX } from "solid-js";

import { bindInitialisationProps3D, bindRuntimeProps3D } from "./bind-props";
import { LEAF3D_RUNTIME_KEYS, type Leaf3DProps, type PixiComponent3D } from "./factories";

/**
 * Props for `<ParticleSystem3D>`.
 *
 * Not generic over the extra shader bits: a system derives every built-in bit from its options, and
 * `setParticle` accepts the built-in attributes whatever bits it has. `extraBits` only types the
 * attributes of bits you wrote yourself.
 */
export type ParticleSystem3DComponentProps = Leaf3DProps<PixiParticleSystem3D> &
  Omit<Partial<Pixi3DExtras.ParticleSystem3DOptions>, "children"> & {
    playing?: boolean;
  };

const PARTICLE_SYSTEM_KEYS = [...LEAF3D_RUNTIME_KEYS, "autoUpdate", "playing"] as const;

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
    props.as ??
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

  // `playing` is not a plain field: it calls play()/stop(), so it cannot go through the prop binder
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

  bindInitialisationProps3D(instance, initialisationProps);
  // `playing` is a getter with no setter: writing it does nothing and trips the read-only warning,
  // so the effect above is the only thing that drives it.
  const [, runtimeWithoutPlaying] = splitProps(runtimeProps, ["playing"]);
  bindRuntimeProps3D(instance, runtimeWithoutPlaying as any);

  onCleanup(() => {
    if (isUserOwnedInstance) return;
    instance.destroy({ children: true });
  });

  return instance as PixiParticleSystem3D & JSX.Element;
};
