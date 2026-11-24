import type * as Pixi3D from "@pixi/3d";
import type { JSX } from "@solidjs/web";
import { onCleanup, untrack } from "solid-js";
import type { Ref } from "solid-js";

import { bindInitialisationProps3D, bindRuntimeProps3D } from "./bind-props";
import {
  PIXI_SOLID_3D_EVENT_HANDLER_NAMES,
  type PixiSolid3DEventHandlerMap,
} from "./event-properties";
import {
  CONTAINER3D_AXIS_PROP_NAMES,
  type Container3DAxisPropName,
  TOP_LEVEL_AXIS_PROP_NAMES,
  type TopLevelAxisPropName,
} from "./vector-properties";

export type Container3DAxisProps = Partial<Record<Container3DAxisPropName, number>>;
export type TopLevelAxisProps = Partial<Record<TopLevelAxisPropName, number>>;

export type RefAsProps3D<Component> = {
  ref?: Ref<Component>;
  as?: Component;
};

export type PixiComponent3D<Props, Instance> = (props: Props) => Instance & JSX.Element;

/**
 * Constructor options, or none when the instance is adopted through `as`.
 *
 * Required options belong to construction: `<BatchedMesh3D as={batch} />` must not demand `size`,
 * and `<Model3D as={model} />` must not demand `source`.
 */
export type AdoptableProps<OptionsType extends object, InstanceType> =
  | (Omit<OptionsType, "children"> & { as?: undefined })
  | (Partial<Omit<OptionsType, "children">> & { as: InstanceType });

/**
 * Props every 3D node takes: pointer events, the point and axis shortcuts, and `ref` / `as`.
 */
export type Leaf3DProps<Component extends Pixi3D.Container3D = Pixi3D.Container3D> =
  PixiSolid3DEventHandlerMap &
    Container3DAxisProps &
    TopLevelAxisProps &
    RefAsProps3D<Component> & {
      position?: Pixi3D.PointData3D;
      scale?: Pixi3D.PointData3D | number;
      rotation?: Pixi3D.PointData3D;
      angle?: Pixi3D.PointData3D;
      quaternion?: Pixi3D.QuaternionData;
      origin?: Pixi3D.PointData3D | number;
      lookAt?: Pixi3D.PointData3D;
    };

/**
 * `Leaf3DProps` plus `children`, for components that mount 3D nodes beneath them.
 */
export type Container3DProps<Component extends Pixi3D.Container3D = Pixi3D.Container3D> =
  Leaf3DProps<Component> & { children?: JSX.Element };

export const SOLID_3D_PROP_KEYS = ["ref", "as", "children"] as const;

export const CONTAINER3D_RUNTIME_KEYS = [
  ...SOLID_3D_PROP_KEYS,
  ...PIXI_SOLID_3D_EVENT_HANDLER_NAMES,
  ...CONTAINER3D_AXIS_PROP_NAMES,
  ...TOP_LEVEL_AXIS_PROP_NAMES,
  "lookAt",
] as const;

export const LEAF3D_RUNTIME_KEYS = [
  "ref",
  "as",
  ...PIXI_SOLID_3D_EVENT_HANDLER_NAMES,
  ...CONTAINER3D_AXIS_PROP_NAMES,
  ...TOP_LEVEL_AXIS_PROP_NAMES,
  "lookAt",
] as const;

export const CONTAINER3D_RUNTIME_KEY_SET: ReadonlySet<string> = new Set(CONTAINER3D_RUNTIME_KEYS);
export const LEAF3D_RUNTIME_KEY_SET: ReadonlySet<string> = new Set(LEAF3D_RUNTIME_KEYS);

/**
 * Copies the props a constructor reads once, so the binder effects never feed an instance that
 * already exists.
 */
const getInstanceOptions = <Props extends object>(
  props: Props,
  excludedKeys: ReadonlySet<string>,
): Record<string, unknown> => {
  const propsRecord = props as Record<string, unknown>;
  const options: Record<string, unknown> = {};

  for (const key in propsRecord) {
    if (excludedKeys.has(key)) continue;

    options[key] = propsRecord[key];
  }

  return options;
};

/**
 * Shares the mount, bind and destroy sequence between the container and leaf factories.
 *
 * `runtimeKeys` names the props the binder owns: everything else reached the constructor, so it is
 * only re-applied when it changes. An instance passed through `as` never reached a constructor, so
 * its props are applied immediately.
 */
const createNode3DComponent = <InstanceType extends Pixi3D.Container3D, OptionsType extends object>(
  Pixi3DClass: new (...args: any[]) => InstanceType,
  runtimeKeys: ReadonlySet<string>,
): PixiComponent3D<
  Leaf3DProps<InstanceType> & AdoptableProps<OptionsType, InstanceType>,
  InstanceType
> => {
  return (props): InstanceType & JSX.Element =>
    // `createComponent` runs the body with a strict-read label, which warns on any
    // reactive read here. The body is entirely one-time setup, so run it under
    // `untrack`; the binder effects created inside establish their own tracking.
    untrack(() => {
      const as = props.as;
      const isUserOwnedInstance = as !== undefined;
      const instance = as || new Pixi3DClass(getInstanceOptions(props, runtimeKeys) as any);

      // Register cleanup before binding children. Cleanups run in unwind order,
      // so the child-detach cleanup from bindRuntimeProps3D runs before this
      // destroy. As a result, unowned children are detached but kept alive.
      onCleanup(() => {
        if (isUserOwnedInstance) return;
        instance.destroy({ children: true });
      });

      bindInitialisationProps3D(instance, props, runtimeKeys, {
        deferInitialRun: !isUserOwnedInstance,
      });
      bindRuntimeProps3D(instance, props, runtimeKeys);

      return instance as InstanceType & JSX.Element;
    });
};

/**
 * Factory for creating 3D container components that accept children.
 */
export const createContainer3DComponent = <
  InstanceType extends Pixi3D.Container3D,
  OptionsType extends object = Pixi3D.Container3DOptions,
>(
  Pixi3DClass: new (...args: any[]) => InstanceType,
): PixiComponent3D<
  Container3DProps<InstanceType> & AdoptableProps<OptionsType, InstanceType>,
  InstanceType
> => {
  const Component = (props: any): InstanceType & JSX.Element =>
    createNode3DComponent<InstanceType, OptionsType>(
      Pixi3DClass,
      CONTAINER3D_RUNTIME_KEY_SET,
    )(props);

  return Component;
};

/**
 * Factory for creating 3D leaf components that do not accept children (Mesh, Light, Camera, etc.).
 */
export const createLeaf3DComponent = <
  InstanceType extends Pixi3D.Container3D,
  OptionsType extends object = Pixi3D.Container3DOptions,
>(
  Pixi3DClass: new (...args: any[]) => InstanceType,
): PixiComponent3D<
  Leaf3DProps<InstanceType> & AdoptableProps<OptionsType, InstanceType>,
  InstanceType
> => {
  return createNode3DComponent<InstanceType, OptionsType>(Pixi3DClass, LEAF3D_RUNTIME_KEY_SET);
};
