import type * as Pixi from "pixi.js";
import type { JSX, Ref } from "solid-js";
import { createRenderEffect, on, splitProps } from "solid-js";
import type { PixiEventHandlerMap } from "./event-names";
import { PIXI_SOLID_EVENT_HANDLER_NAMES } from "./event-names";
import type { PointAxisPropName } from "./point-property-names";
import { POINT_PROP_AXIS_NAMES } from "./point-property-names";
import { insert, setProp } from "./renderer";

/**
 * Prop definition for components that CAN have children
 */
export type ContainerProps<Component> = PixiEventHandlerMap &
  PointAxisProps & {
    ref?: Ref<Component>;
    as?: Component;
    children?: JSX.Element;
  };

export type PointAxisProps = Partial<Record<PointAxisPropName, number>>;

/**
 * Prop definition for components that CANNOT have children
 */
export type LeafProps<Component> = Omit<ContainerProps<Component>, "children">;

/**
 * Prop definition for filter components
 */
export type FilterProps<Component> = {
  ref?: Ref<Component>;
  as?: Component;
};

// Keys that are specific to Solid components and not Pixi props
export const SOLID_PROP_KEYS = ["ref", "as", "children"] as const;

/**
 * Apply's the props to a Pixi instance with subsriptions to maintain reactivity.
 *
 * @param instance The Pixi instance we want to apply props to.
 * @param props The props object.
 * @param defer Defers the createRenderEffect so the props aren't set on the first run.
 * This is useful because setting initialisation props can have unintended side effects.
 * Notibly in AnimatedSprite, if we set the textures roperty after instantiation it will stop the instance from playing.
 */
export const applyProps = <
  InstanceType extends Pixi.Container,
  OptionsType extends ContainerProps<InstanceType>,
>(
  instance: InstanceType,
  props: OptionsType,
  defer?: boolean,
) => {
  for (const key in props) {
    if (key === "as") continue;

    if (key === "ref") {
      createRenderEffect(() => {
        // Solid converts the ref prop to a callback function
        (props[key] as unknown as (arg: any) => void)(instance);
      });
    } else if (key === "children") {
      if (!("addChild" in instance)) {
        throw new Error(`Cannot set children on non-container instance.`);
      }
      createRenderEffect(() => {
        insert(instance, () => props.children);
      });
    } else if (defer) {
      createRenderEffect(
        on(
          () => props[key as keyof typeof props],
          () => {
            setProp(instance, key, props[key as keyof typeof props]);
          },
          { defer },
        ),
      );
    } else {
      createRenderEffect(() => {
        setProp(instance, key, props[key as keyof typeof props]);
      });
    }
  }
};

export const createContainerComponent = <
  InstanceType extends Pixi.Container,
  OptionsType extends object,
>(
  PixiClass: new (props: OptionsType) => InstanceType,
) => {
  return (
    props: Omit<OptionsType, "children"> & ContainerProps<InstanceType>,
  ): InstanceType & JSX.Element => {
    const [runtimeProps, initialisationProps] = splitProps(props, [
      ...SOLID_PROP_KEYS,
      ...PIXI_SOLID_EVENT_HANDLER_NAMES,
      ...POINT_PROP_AXIS_NAMES,
    ]);

    const instance = props.as || new PixiClass(initialisationProps as any);

    applyProps(instance, initialisationProps, true);
    applyProps(instance, runtimeProps);

    return instance as InstanceType & JSX.Element;
  };
};

export const createLeafComponent = <
  InstanceType extends Pixi.Container,
  OptionsType extends object,
>(
  PixiClass: new (props: OptionsType) => InstanceType,
) => {
  return (
    props: Omit<OptionsType, "children"> & LeafProps<InstanceType>,
  ): InstanceType & JSX.Element => {
    return createContainerComponent<InstanceType, OptionsType>(PixiClass)(props);
  };
};

export const createFilterComponent = <InstanceType extends Pixi.Filter, OptionsType extends object>(
  PixiClass: new (props: OptionsType) => InstanceType,
) => {
  return (props: OptionsType & FilterProps<InstanceType>): InstanceType & JSX.Element => {
    const [runtimeProps, initialisationProps] = splitProps(props, ["ref", "as"]);

    const instance = props.as || new PixiClass(initialisationProps as any);

    for (const key in initialisationProps) {
      if (key === "as") continue;

      if (key === "ref") {
        createRenderEffect(() => {
          // Solid converts the ref prop to a callback function
          (props[key] as unknown as (arg: any) => void)(instance);
        });
      } else if (key === "children") {
        throw new Error(`Cannot set children on non-container instance.`);
      } else {
        createRenderEffect(
          on(
            () => props[key as keyof typeof initialisationProps],
            () => {
              (instance as any)[key] = initialisationProps[key];
            },
            { defer: true },
          ),
        );
      }
    }

    for (const key in runtimeProps) {
      if (key === "as") continue;

      if (key === "ref") {
        createRenderEffect(() => {
          // Solid converts the ref prop to a callback function
          (props[key] as unknown as (arg: any) => void)(instance);
        });
      }
    }

    return instance as InstanceType & JSX.Element;
  };
};
