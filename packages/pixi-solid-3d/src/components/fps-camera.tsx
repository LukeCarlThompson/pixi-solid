import type * as Pixi3DExtras from "@pixi/3d/extras";
import { FPSCamera as PixiFPSCamera } from "@pixi/3d/extras";
import { getTicker } from "pixi-solid";
import type * as Pixi from "pixi.js";
import { createEffect, createRenderEffect, omit, onCleanup, untrack } from "solid-js";
import type { Component, Ref } from "solid-js";

import { applyRef } from "../apply-ref";

import { assignDefinedProp } from "./bind-props";
import { useView3D } from "./view-3d-context";

export type FPSCameraProps = Omit<Partial<Pixi3DExtras.FPSCameraOptions>, "autoUpdate"> & {
  autoUpdate?: boolean;
  ref?: Ref<Pixi3DExtras.FPSCamera>;
  onchange?: () => void;
  onlock?: () => void;
  onunlock?: () => void;
};

const FPS_CAMERA_KEYS = [
  "ref",
  "autoUpdate",
  "onchange",
  "onlock",
  "onunlock",
  "enabled",
  "moveSpeed",
  "lookSpeed",
  "maxPitch",
  "pointerLock",
  "keyboard",
  "yaw",
  "pitch",
] as const;

/** Props copied onto the controller as-is. */
const FPS_CAMERA_ASSIGNED_KEYS = [
  "enabled",
  "moveSpeed",
  "lookSpeed",
  "maxPitch",
  "pointerLock",
  "keyboard",
  "yaw",
  "pitch",
] as const;

/** Controller events, and the props that handle them. */
const FPS_CAMERA_EVENTS = [
  ["change", "onchange"],
  ["lock", "onlock"],
  ["unlock", "onunlock"],
] as const;

/**
 * SolidJS component to attach an FPSCamera (first-person WASD + mouse-look) controller to the
 * current `<View3D>` context.
 *
 * Automatically manages lifecycle and synchronizes frame updates with the scoped Pixi.Ticker
 * from context (e.g. `<PixiCanvas>`, `<PixiApplicationProvider>`, or `<TickerProvider>`)
 * instead of tying to global `Ticker.shared`.
 */
export const FPSCamera: Component<FPSCameraProps> = (props) =>
  // The body is one-time setup: build the controller, then let the effects below track props.
  untrack(() => {
    const view = useView3D();

    // Set autoUpdate: false on the engine instance so it doesn't attach to Ticker.shared
    const controller = new PixiFPSCamera({
      view,
      autoUpdate: false,
      ...omit(props, ...FPS_CAMERA_KEYS),
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

    for (const [eventName, propName] of FPS_CAMERA_EVENTS) {
      createRenderEffect(
        () => props[propName],
        (handler) => {
          if (!handler) return;

          controller.on(eventName, handler);
          return () => controller.off(eventName, handler);
        },
      );
    }

    // One effect per prop, so a change writes only that prop.
    for (const key of FPS_CAMERA_ASSIGNED_KEYS) {
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
