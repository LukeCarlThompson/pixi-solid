import type * as Pixi3DExtras from "@pixi/3d/extras";
import { FPSCamera as PixiFPSCamera } from "@pixi/3d/extras";
import { getTicker } from "pixi-solid";
import type * as Pixi from "pixi.js";
import {
  createEffect,
  createRenderEffect,
  on,
  onCleanup,
  splitProps,
  type Component,
  type Ref,
} from "solid-js";

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

/**
 * SolidJS component to attach an FPSCamera (first-person WASD + mouse-look) controller to the current `<View3D>` context.
 *
 * Automatically manages lifecycle and synchronizes frame updates with the scoped Pixi.Ticker
 * from context (e.g. `<PixiCanvas>`, `<PixiApplicationProvider>`, or `<TickerProvider>`)
 * instead of tying to global `Ticker.shared`.
 */
export const FPSCamera: Component<FPSCameraProps> = (props) => {
  const view = useView3D();
  const [local, initialisationOptions] = splitProps(props, FPS_CAMERA_KEYS);

  // Set autoUpdate: false on the engine instance so it doesn't attach to Ticker.shared
  const controller = new PixiFPSCamera({
    view,
    autoUpdate: false,
    ...initialisationOptions,
  });

  if (local.ref) {
    (local.ref as unknown as (c: Pixi3DExtras.FPSCamera) => void)(controller);
  }

  // Bind to the scoped Pixi ticker from pixi-solid context
  createRenderEffect(
    on(
      () => local.autoUpdate,
      (autoUpdate) => {
        if (autoUpdate === false) return;

        const onTick = (ticker: Pixi.Ticker) => {
          controller.update(ticker);
        };

        try {
          const ticker = getTicker();
          ticker.add(onTick);
          onCleanup(() => {
            ticker.remove(onTick);
          });
        } catch {
          // If rendered without a context ticker (e.g. headless without PixiCanvas/TickerProvider),
          // fallback gracefully to manual controller.update() calls.
        }
      },
    ),
  );

  // Bind EventEmitter events
  createRenderEffect(() => {
    const handler = local.onchange;
    if (handler) {
      controller.on("change", handler);
      onCleanup(() => controller.off("change", handler));
    }
  });

  createRenderEffect(() => {
    const handler = local.onlock;
    if (handler) {
      controller.on("lock", handler);
      onCleanup(() => controller.off("lock", handler));
    }
  });

  createRenderEffect(() => {
    const handler = local.onunlock;
    if (handler) {
      controller.on("unlock", handler);
      onCleanup(() => controller.off("unlock", handler));
    }
  });

  createEffect(() => {
    if (local.enabled !== undefined) controller.enabled = local.enabled;
  });

  createEffect(() => {
    if (local.moveSpeed !== undefined) controller.moveSpeed = local.moveSpeed;
  });

  createEffect(() => {
    if (local.lookSpeed !== undefined) controller.lookSpeed = local.lookSpeed;
  });

  createEffect(() => {
    if (local.maxPitch !== undefined) controller.maxPitch = local.maxPitch;
  });

  createEffect(() => {
    if (local.yaw !== undefined) controller.yaw = local.yaw;
  });

  createEffect(() => {
    if (local.pitch !== undefined) controller.pitch = local.pitch;
  });

  onCleanup(() => {
    controller.destroy();
  });

  return null;
};
