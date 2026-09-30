import type * as Pixi3D from "@pixi/3d";
import { onTick } from "pixi-solid";
import type { Accessor } from "solid-js";
import { createSignal } from "solid-js";

import { useOptionalView3D } from "../components/view-3d-context";

export type WorldToScreenResult = {
  x: number;
  y: number;
  visible: boolean;
};

export type UseWorldToScreenOptions = {
  view?: Pixi3D.View3D;
};

/**
 * A SolidJS hook that reactively projects a 3D world position onto 2D screen coordinates
 * on each tick of the contextual ticker.
 *
 * @param target - A Container3D instance, a PointData3D, or an accessor returning either.
 * @param options - Optional configuration, including passing an explicit View3D instance.
 * @returns An Accessor returning `{ x, y, visible }`. `visible` is false if the 3D position is behind the camera.
 *
 * @example
 * ```tsx
 * // Tracking a Container3D position
 * const screenPos = useWorldToScreen(mesh);
 *
 * return (
 *   <Show when={screenPos().visible}>
 *     <Container x={screenPos().x} y={screenPos().y - 20}>
 *       <Text text="Health Bar" />
 *     </Container>
 *   </Show>
 * );
 * ```
 */
export const useWorldToScreen = (
  target:
    | Pixi3D.Container3D
    | Pixi3D.PointData3D
    | Accessor<Pixi3D.Container3D | Pixi3D.PointData3D | null | undefined>,
  options?: UseWorldToScreenOptions,
): Accessor<WorldToScreenResult> => {
  const contextView = useOptionalView3D();
  const getView = () => options?.view ?? contextView;

  const resolveTarget = (): Pixi3D.PointData3D | null => {
    const value = typeof target === "function" ? (target as Accessor<any>)() : target;
    if (!value) return null;
    if ("position" in value && value.position) {
      return value.position;
    }
    return value as Pixi3D.PointData3D;
  };

  const compute = (): WorldToScreenResult => {
    const view = getView();
    if (!view) return { x: 0, y: 0, visible: false };

    const point = resolveTarget();
    if (!point) return { x: 0, y: 0, visible: false };

    const screen = view.worldToScreen(point);
    if (!screen) {
      return { x: 0, y: 0, visible: false };
    }
    return { x: screen.x, y: screen.y, visible: true };
  };

  const [screenPos, setScreenPos] = createSignal<WorldToScreenResult>(compute());

  onTick(() => {
    const next = compute();
    const prev = screenPos();
    if (next.x !== prev.x || next.y !== prev.y || next.visible !== prev.visible) {
      setScreenPos(next);
    }
  });

  return screenPos;
};
