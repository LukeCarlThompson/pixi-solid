import type * as Pixi3DExtras from "@pixi/3d/extras";
import { OrbitCamera as PixiOrbitCamera } from "@pixi/3d/extras";
import { getTicker } from "pixi-solid";
import type * as Pixi from "pixi.js";
import { createEffect, createRenderEffect, omit, onCleanup, untrack } from "solid-js";
import type { Component, Ref } from "solid-js";

import { applyRef } from "../apply-ref";

import { assignDefinedProp } from "./bind-props";
import { useView3D } from "./view-3d-context";

export type OrbitCameraProps = Omit<Partial<Pixi3DExtras.OrbitCameraOptions>, "autoUpdate"> & {
  autoUpdate?: boolean;
  ref?: Ref<Pixi3DExtras.OrbitCamera>;
  onchange?: () => void;
  onstart?: () => void;
  onend?: () => void;
};

const ORBIT_CAMERA_KEYS = [
  "ref",
  "autoUpdate",
  "onchange",
  "onstart",
  "onend",
  "target",
  "enabled",
  "minDistance",
  "maxDistance",
] as const;

/** Props copied onto the controller as-is. `target` is a vector, so it has its own effect. */
const ORBIT_CAMERA_ASSIGNED_KEYS = ["enabled", "minDistance", "maxDistance"] as const;

/** Controller events, and the props that handle them. */
const ORBIT_CAMERA_EVENTS = [
  ["change", "onchange"],
  ["start", "onstart"],
  ["end", "onend"],
] as const;

/**
 * SolidJS component to attach an OrbitCamera controller to the current `<View3D>` context.
 *
 * Automatically manages lifecycle and synchronizes frame updates with the scoped Pixi.Ticker
 * from context (e.g. `<PixiCanvas>`, `<PixiApplicationProvider>`, or `<TickerProvider>`)
 * instead of tying to global `Ticker.shared`.
 */
export const OrbitCamera: Component<OrbitCameraProps> = (props) =>
  // The body is one-time setup: build the controller, then let the effects below track props.
  untrack(() => {
    const view = useView3D();

    // Set autoUpdate: false on the engine instance so it doesn't attach to Ticker.shared
    const controller = new PixiOrbitCamera({
      view,
      autoUpdate: false,
      ...omit(props, ...ORBIT_CAMERA_KEYS),
    });

    createRenderEffect(
      () => props.ref,
      (ref) => applyRef(ref, controller),
    );

    // Bind to the scoped Pixi ticker from pixi-solid context
    createRenderEffect(
      () => props.autoUpdate,
      (autoUpdate) => {
        if (autoUpdate === false) return;

        try {
          const ticker = getTicker();
          const onTick = (currentTicker: Pixi.Ticker) => {
            controller.update(currentTicker);
          };

          ticker.add(onTick);
          return () => ticker.remove(onTick);
        } catch {
          // Rendered without a context ticker (e.g. headless without PixiCanvas/TickerProvider),
          // so updates stay manual.
          return;
        }
      },
    );

    for (const [eventName, propName] of ORBIT_CAMERA_EVENTS) {
      createRenderEffect(
        () => props[propName],
        (handler) => {
          if (!handler) return;

          controller.on(eventName, handler);
          return () => controller.off(eventName, handler);
        },
      );
    }

    createEffect(
      () => props.target,
      (target) => {
        if (!target) return;

        controller.target.set(target.x ?? 0, target.y ?? 0, target.z ?? 0);
      },
    );

    // One effect per prop, so a change writes only that prop.
    for (const key of ORBIT_CAMERA_ASSIGNED_KEYS) {
      createEffect(
        () => props[key],
        (value) => assignDefinedProp(controller, key, value),
      );
    }

    onCleanup(() => {
      controller.destroy();
    });

    return null;
  });
