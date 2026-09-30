import type * as Pixi3D from "@pixi/3d";
import type { JSX, Ref } from "solid-js";
import { onCleanup, splitProps } from "solid-js";

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
 * Prop definition for Container3D-based components
 */
export type Container3DProps<Component extends Pixi3D.Container3D = Pixi3D.Container3D> =
  PixiSolid3DEventHandlerMap &
    Container3DAxisProps &
    TopLevelAxisProps &
    RefAsProps3D<Component> & {
      children?: JSX.Element;
      position?: Pixi3D.PointData3D;
      scale?: Pixi3D.PointData3D | number;
      rotation?: Pixi3D.PointData3D;
      angle?: Pixi3D.PointData3D;
      quaternion?: Pixi3D.QuaternionData;
      origin?: Pixi3D.PointData3D | number;
      lookAt?: Pixi3D.PointData3D;
    };

/**
 * Prop definition for 3D leaf components that do not take children
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

/**
 * Factory for creating 3D container components that accept children
 */
export const createContainer3DComponent = <
  InstanceType extends Pixi3D.Container3D,
  OptionsType extends object = Pixi3D.Container3DOptions,
>(
  Pixi3DClass: new (...args: any[]) => InstanceType,
): PixiComponent3D<
  Omit<OptionsType, "children"> & Container3DProps<InstanceType>,
  InstanceType
> => {
  return (props): InstanceType & JSX.Element => {
    const [runtimeProps, initialisationProps] = splitProps(props, CONTAINER3D_RUNTIME_KEYS);

    const isUserOwnedInstance = runtimeProps.as !== undefined;
    const instance = props.as || new Pixi3DClass({ ...initialisationProps } as any);

    bindInitialisationProps3D(instance, initialisationProps);
    bindRuntimeProps3D(instance, runtimeProps as any);

    onCleanup(() => {
      if (isUserOwnedInstance) return;
      instance.destroy({ children: true });
    });

    return instance as InstanceType & JSX.Element;
  };
};

/**
 * Factory for creating 3D leaf components that do not accept children (Mesh, Light, Camera, etc.)
 */
export const createLeaf3DComponent = <
  InstanceType extends Pixi3D.Container3D,
  OptionsType extends object = Pixi3D.Container3DOptions,
>(
  Pixi3DClass: new (...args: any[]) => InstanceType,
): PixiComponent3D<Omit<OptionsType, "children"> & Leaf3DProps<InstanceType>, InstanceType> => {
  return (props): InstanceType & JSX.Element => {
    const [runtimeProps, initialisationProps] = splitProps(props, LEAF3D_RUNTIME_KEYS);

    const isUserOwnedInstance = runtimeProps.as !== undefined;
    const instance = props.as || new Pixi3DClass({ ...initialisationProps } as any);

    bindInitialisationProps3D(instance, initialisationProps);
    bindRuntimeProps3D(instance, runtimeProps as any);

    onCleanup(() => {
      if (isUserOwnedInstance) return;
      instance.destroy({ children: true });
    });

    return instance as InstanceType & JSX.Element;
  };
};
