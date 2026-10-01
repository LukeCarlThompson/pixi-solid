import type * as Pixi3D from "@pixi/3d";
import { View3D as PixiView3D } from "@pixi/3d";
import { onTick } from "pixi-solid";
import type { PointData } from "pixi.js";
import type { Accessor, JSX, Ref } from "solid-js";
import {
  createContext,
  createRenderEffect,
  createSignal,
  onCleanup,
  splitProps,
  useContext,
} from "solid-js";

/** The active `View3D` for the nearest enclosing `<View3DProvider>` or `<View3D>`. */
export const View3DContext = createContext<Pixi3D.View3D>();

const CONTEXT_HINT =
  "must be used within a <View3D>, <View3DProvider>, or a component mounted inside one.";

const useView3DContext = (hookName: string): Pixi3D.View3D => {
  const view = useContext(View3DContext);
  if (!view) {
    throw new Error(`${hookName} ${CONTEXT_HINT}`);
  }
  return view;
};

/**
 * A SolidJS hook that provides access to the enclosing View3D instance.
 * Must be used within a `<View3D>` or `<View3DProvider>`.
 */
export const useView3D = <
  TRoot extends Pixi3D.Container3D = Pixi3D.Container3D,
>(): Pixi3D.View3D<TRoot> => {
  return useView3DContext("useView3D") as Pixi3D.View3D<TRoot>;
};

export type WorldToScreenResult = {
  x: number;
  y: number;
  visible: boolean;
};

const isContainer3D = (
  value: Pixi3D.Container3D | Pixi3D.PointData3D,
): value is Pixi3D.Container3D => "position" in value;

/**
 * A SolidJS hook that reactively projects a 3D world position onto 2D screen coordinates
 * on each tick of the contextual ticker.
 *
 * Resolves the `View3D` from the ambient context, so it works from inside `<View3D>` and from
 * sibling 2D components inside `<View3DProvider>`. Throws if neither is present.
 *
 * @param target - A Container3D instance, a PointData3D, or an accessor returning either.
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
): Accessor<WorldToScreenResult> => {
  const view = useView3DContext("useWorldToScreen");

  const resolveTarget = (): Pixi3D.PointData3D | null => {
    const value = typeof target === "function" ? target() : target;
    if (!value) return null;
    return isContainer3D(value) ? value.position : value;
  };

  const compute = (): WorldToScreenResult => {
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

export type ScreenToWorldTarget = Pixi3D.Plane | number;

export type ScreenToWorldPoint = {
  x: number;
  y: number;
  z: number;
};

/**
 * A SolidJS hook that reactively unprojects 2D screen coordinates into 3D world coordinates
 * against a 3D Plane or distance along the pick ray on each tick.
 *
 * Resolves the `View3D` from the ambient context, so it works from inside `<View3D>` and from
 * sibling 2D components inside `<View3DProvider>`. Throws if neither is present.
 *
 * @param screenPoint - A 2D point `{ x, y }` or an Accessor returning `{ x, y }`.
 * @param target - A 3D `Plane` to intersect with, or a number representing distance from the camera.
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
): Accessor<ScreenToWorldPoint | null> => {
  const view = useView3DContext("useScreenToWorld");

  const resolveScreenPoint = (): PointData | null => {
    return typeof screenPoint === "function" ? (screenPoint() ?? null) : screenPoint;
  };

  const resolveTarget = (): ScreenToWorldTarget => {
    return typeof target === "function" ? target() : target;
  };

  const compute = (): ScreenToWorldPoint | null => {
    const point = resolveScreenPoint();
    if (!point) return null;

    const resolvedTarget = resolveTarget();
    // `screenToWorld` is overloaded on `Plane` vs `number`, so the union must be narrowed first.
    const hit =
      typeof resolvedTarget === "number"
        ? view.screenToWorld(point, resolvedTarget)
        : view.screenToWorld(point, resolvedTarget);
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

const VIEW_3D_PROVIDER_RUNTIME_KEYS = ["children", "ref", "as"] as const;

export type View3DProviderProps<TRoot extends Pixi3D.Container3D = Pixi3D.Container3D> =
  Pixi3D.View3DOptions<TRoot> & {
    children?: JSX.Element;
    ref?: Ref<Pixi3D.View3D<TRoot>>;
    /** An existing `View3D` to adopt. The provider will not destroy it. */
    as?: Pixi3D.View3D<TRoot>;
  };

/**
 * Creates and owns a `View3D`, and shares it with every descendant through `View3DContext`.
 *
 * This is the component that owns the viewport. Mount a `<View3D>` beneath it to place the
 * viewport in the 2D scene graph, and put 2D overlays beside that `<View3D>` — they resolve the
 * same view without any ref or getter passing.
 *
 * Because the provider owns the instance, every `View3DOptions` prop belongs here rather than on
 * the `<View3D>` that mounts it. For multiple viewports (split-screen, minimap PIP), use one
 * provider per viewport.
 *
 * Pass `as` to adopt a `View3D` you created yourself; the provider then never destroys it.
 *
 * @example
 * ```tsx
 * <View3DProvider width={800} height={600} toneMapping="aces">
 *   <View3D>
 *     <Camera3D z={5} />
 *     <Mesh3D geometry={geometry} material={material} />
 *   </View3D>
 *
 *   <HealthBar />
 * </View3DProvider>
 * ```
 */
export const View3DProvider = <TRoot extends Pixi3D.Container3D = Pixi3D.Container3D>(
  props: View3DProviderProps<TRoot>,
): JSX.Element => {
  const [local, options] = splitProps(props, VIEW_3D_PROVIDER_RUNTIME_KEYS);

  const isUserOwnedInstance = local.as !== undefined;
  const view = local.as || new PixiView3D<TRoot>(options as Pixi3D.View3DOptions<TRoot>);

  createRenderEffect(() => {
    if (local.ref) {
      (local.ref as unknown as (instance: Pixi3D.View3D<TRoot>) => void)(view);
    }
  });

  createRenderEffect(() => {
    const source = props as unknown as Record<string, unknown>;
    for (const key in options) {
      const value = source[key];
      if (value !== undefined && key in view) {
        (view as unknown as Record<string, unknown>)[key] = value;
      }
    }
  });

  onCleanup(() => {
    if (isUserOwnedInstance) return;
    view.destroy({ children: true });
  });

  return (
    <View3DContext.Provider value={view as Pixi3D.View3D}>{local.children}</View3DContext.Provider>
  );
};
