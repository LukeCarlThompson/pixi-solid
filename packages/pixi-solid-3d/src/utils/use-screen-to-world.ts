import type * as Pixi3D from "@pixi/3d";
import { onTick } from "pixi-solid";
import type { PointData } from "pixi.js";
import type { Accessor } from "solid-js";
import { createSignal } from "solid-js";

import { useOptionalView3D } from "../components/view-3d-context";

export type ScreenToWorldTarget = Pixi3D.Plane | number;

export type UseScreenToWorldOptions = {
  view?: Pixi3D.View3D;
};

export type ScreenToWorldPoint = {
  x: number;
  y: number;
  z: number;
};

/**
 * A SolidJS hook that reactively unprojects 2D screen coordinates into 3D world coordinates
 * against a 3D Plane or distance along the pick ray on each tick.
 *
 * @param screenPoint - A 2D point `{ x, y }` or an Accessor returning `{ x, y }`.
 * @param target - A 3D `Plane` to intersect with, or a number representing distance from the camera.
 * @param options - Optional configuration, including passing an explicit View3D instance.
 * @returns An Accessor returning `{ x, y, z }` or `null` if the ray misses the plane.
 *
 * @example
 * ```tsx
 * const [cursor, setCursor] = createSignal({ x: 100, y: 150 });
 * const groundPlane = new Plane(new Vector3(0, 1, 0), 0); // y = 0
 *
 * const worldPos = useScreenToWorld(cursor, groundPlane);
 *
 * return (
 *   <Show when={worldPos()}>
 *     {(pos) => <Mesh3D x={pos().x} y={pos().y} z={pos().z} ... />}
 *   </Show>
 * );
 * ```
 */
export const useScreenToWorld = (
  screenPoint: PointData | Accessor<PointData | null | undefined>,
  target: ScreenToWorldTarget | Accessor<ScreenToWorldTarget>,
  options?: UseScreenToWorldOptions,
): Accessor<ScreenToWorldPoint | null> => {
  const contextView = useOptionalView3D();
  const getView = () => options?.view ?? contextView;

  const resolveScreenPoint = (): PointData | null => {
    return typeof screenPoint === "function" ? (screenPoint() ?? null) : screenPoint;
  };

  const resolveTarget = (): ScreenToWorldTarget => {
    return typeof target === "function" ? target() : target;
  };

  const compute = (): ScreenToWorldPoint | null => {
    const view = getView();
    if (!view) return null;

    const pt = resolveScreenPoint();
    if (!pt) return null;

    const t = resolveTarget();
    let hit: Pixi3D.Vector3 | null;

    if (typeof t === "number") {
      hit = view.screenToWorld(pt, t);
    } else {
      hit = view.screenToWorld(pt, t);
    }

    if (!hit) return null;
    return { x: hit.x, y: hit.y, z: hit.z };
  };

  const [worldPos, setWorldPos] = createSignal<ScreenToWorldPoint | null>(compute());

  onTick(() => {
    const next = compute();
    const prev = worldPos();

    if (next === null && prev === null) return;
    if (next === null || prev === null) {
      setWorldPos(next);
      return;
    }

    if (next.x !== prev.x || next.y !== prev.y || next.z !== prev.z) {
      setWorldPos(next);
    }
  });

  return worldPos;
};
