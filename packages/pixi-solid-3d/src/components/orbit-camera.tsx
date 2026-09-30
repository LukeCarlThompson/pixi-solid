import "@pixi/3d";
import { OrbitCamera as PixiOrbitCamera, type OrbitCameraOptions } from "@pixi/3d/extras";
import { getTicker } from "pixi-solid";
import type { Ticker } from "pixi.js";
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

export type OrbitCameraProps = Omit<Partial<OrbitCameraOptions>, "autoUpdate"> & {
  autoUpdate?: boolean;
  ref?: Ref<PixiOrbitCamera>;
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

/**
 * SolidJS component to attach an OrbitCamera controller to the current `<View3D>` context.
 *
 * Automatically manages lifecycle and synchronizes frame updates with the scoped Pixi.Ticker
 * from context (e.g. `<PixiCanvas>`, `<PixiApplicationProvider>`, or `<TickerProvider>`)
 * instead of tying to global `Ticker.shared`.
 */
export const OrbitCamera: Component<OrbitCameraProps> = (props) => {
  const view = useView3D();
  const [local, initialisationOptions] = splitProps(props, ORBIT_CAMERA_KEYS);

  // Set autoUpdate: false on the engine instance so it doesn't attach to Ticker.shared
  const controller = new PixiOrbitCamera({
    view,
    autoUpdate: false,
    ...initialisationOptions,
  });

  if (local.ref) {
    (local.ref as unknown as (c: PixiOrbitCamera) => void)(controller);
  }

  // Bind to the scoped Pixi ticker from pixi-solid context
  createRenderEffect(
    on(
      () => local.autoUpdate,
      (autoUpdate) => {
        if (autoUpdate === false) return;

        const onTick = (ticker: Ticker) => {
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
    const handler = local.onstart;
    if (handler) {
      controller.on("start", handler);
      onCleanup(() => controller.off("start", handler));
    }
  });

  createRenderEffect(() => {
    const handler = local.onend;
    if (handler) {
      controller.on("end", handler);
      onCleanup(() => controller.off("end", handler));
    }
  });

  createEffect(() => {
    if (local.target) {
      controller.target.set(local.target.x ?? 0, local.target.y ?? 0, local.target.z ?? 0);
    }
  });

  createEffect(() => {
    if (local.enabled !== undefined) controller.enabled = local.enabled;
  });

  createEffect(() => {
    if (local.minDistance !== undefined) controller.minDistance = local.minDistance;
  });

  createEffect(() => {
    if (local.maxDistance !== undefined) controller.maxDistance = local.maxDistance;
  });

  onCleanup(() => {
    controller.destroy();
  });

  return null;
};
