import type * as Pixi3DExtras from "@pixi/3d/extras";
import { ParticleSystem3D as PixiParticleSystem3D } from "@pixi/3d/extras";
import type { JSX } from "@solidjs/web";
import { getTicker } from "pixi-solid";
import type * as Pixi from "pixi.js";
import { createRenderEffect, omit, onCleanup, untrack } from "solid-js";

import { bindInitialisationProps3D, bindRuntimeProps3D } from "./bind-props";
import {
  LEAF3D_RUNTIME_KEYS,
  LEAF3D_RUNTIME_KEY_SET,
  type Leaf3DProps,
  type PixiComponent3D,
} from "./factories";

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
 * `autoUpdate` and `playing` have their own effects below. Binding them would write a getter, which
 * does nothing and trips the read-only warning.
 */
const PARTICLE_SYSTEM_INITIALISATION_RUNTIME_KEY_SET: ReadonlySet<string> = new Set(
  PARTICLE_SYSTEM_KEYS,
);

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
> = (props) =>
  // The body is one-time setup: build the system, then let the effects below track props.
  untrack(() => {
    const as = props.as;
    const isUserOwnedInstance = as !== undefined;
    const instance =
      as ??
      new PixiParticleSystem3D({
        autoUpdate: false,
        ...omit(props, ...PARTICLE_SYSTEM_KEYS),
      });

    // Re-wire to the scoped context ticker if autoUpdate is not explicitly false
    createRenderEffect(
      () => (props as any).autoUpdate,
      (autoUpdate) => {
        if (autoUpdate === false) return;

        try {
          const ticker = getTicker();
          const onTick = (currentTicker: Pixi.Ticker) => {
            instance.update(currentTicker);
          };

          ticker.add(onTick);
          return () => ticker.remove(onTick);
        } catch {
          // Rendered without a context ticker, so updates stay manual.
          return;
        }
      },
    );

    // `playing` is not a plain field: it calls play()/stop(), so it cannot go through the prop binder
    createRenderEffect(
      () => (props as any).playing,
      (playing) => {
        if (playing === undefined) return;

        if (playing) {
          instance.play();
        } else {
          instance.stop();
        }
      },
    );

    onCleanup(() => {
      if (isUserOwnedInstance) return;
      instance.destroy({ children: true });
    });

    bindInitialisationProps3D(instance, props, PARTICLE_SYSTEM_INITIALISATION_RUNTIME_KEY_SET, {
      deferInitialRun: !isUserOwnedInstance,
    });
    bindRuntimeProps3D(instance, props, LEAF3D_RUNTIME_KEY_SET);

    return instance as PixiParticleSystem3D & JSX.Element;
  });
