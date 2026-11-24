import type * as Pixi3DExtras from "@pixi/3d/extras";
import { OrbitCamera as PixiOrbitCamera } from "@pixi/3d/extras";
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

  // One effect per prop, so a change writes only that prop.
  for (const key of ORBIT_CAMERA_ASSIGNED_KEYS) {
    createEffect(() => assignDefinedProp(controller, key, local[key]));
  }

  onCleanup(() => {
    controller.destroy();
  });

  return null;
};
