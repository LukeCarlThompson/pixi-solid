import type * as Pixi from "pixi.js";
import type { JSX, Ref } from "solid-js";
import { createRenderEffect, on, onCleanup, splitProps } from "solid-js";

import { bindInitialisationProps, bindRuntimeProps } from "./bind-props";
import type { PixiEventHandlerMap } from "./bind-props/event-names";
import { PIXI_SOLID_EVENT_HANDLER_NAMES } from "./bind-props/event-names";
import type { PointAxisPropName } from "./bind-props/point-property-names";
import { POINT_PROP_AXIS_NAMES } from "./bind-props/point-property-names";

/**
 * This is a utility type useful for extending the props of custom components to allow props to be passed through to the underlying Pixi instance.
 *
 * If you don't require them all it's recommended to narrow the type by using Pick or Omit the props to only allow the ones you need.
 *
 * @example PixiComponentProps<Pixi.SpriteOptions>.
 */
export type PixiComponentProps<
  ComponentOptions extends Pixi.ContainerOptions = Pixi.ContainerOptions,
> = PixiEventHandlerMap & PointAxisProps & Omit<ComponentOptions, "children">;

/**
 * Prop definition for components that CAN have children
 */
export type ContainerProps<Component> = PixiEventHandlerMap &
  PointAxisProps &
  FilterProperty & {
    ref?: Ref<Component>;
    as?: Component;
    children?: JSX.Element;
  };

export type PointAxisProps = Partial<Record<PointAxisPropName, number>>;

/**
 * Prop definition for components that CANNOT have children
 */
export type LeafProps<Component> = Omit<ContainerProps<Component>, "children">;

type FilterProperty = {
  filters?: Pixi.Filter | JSX.Element | (Pixi.Filter | JSX.Element)[];
};

/**
 * Prop definition for filter components
 */
export type FilterProps<Component> = {
  ref?: Ref<Component>;
  as?: Component;
};

// Keys that are specific to Solid components and not Pixi props
export const SOLID_PROP_KEYS = ["ref", "as", "children"] as const;

export const createContainerComponent = <
  InstanceType extends Pixi.Container,
  OptionsType extends object,
>(
  PixiClass: new (props: OptionsType) => InstanceType,
): ((
  props: Omit<OptionsType, "children" | "filters"> & ContainerProps<InstanceType>,
) => InstanceType & JSX.Element & FilterProperty) => {
  return (props): InstanceType & JSX.Element & FilterProperty => {
    const [runtimeProps, initialisationProps] = splitProps(props, [
      ...SOLID_PROP_KEYS,
      ...PIXI_SOLID_EVENT_HANDLER_NAMES,
      ...POINT_PROP_AXIS_NAMES,
    ]);

    const instance = props.as || new PixiClass(initialisationProps as any);

    bindInitialisationProps(instance, initialisationProps);
    bindRuntimeProps(instance, runtimeProps);

    return instance as InstanceType & JSX.Element & FilterProperty;
  };
};

export const createLeafComponent = <
  InstanceType extends Pixi.Container,
  OptionsType extends object,
>(
  PixiClass: new (props: OptionsType) => InstanceType,
) => {
  return (
    props: Omit<OptionsType, "children" | "filters"> & LeafProps<InstanceType>,
  ): InstanceType & JSX.Element & FilterProperty => {
    return createContainerComponent<InstanceType, OptionsType>(PixiClass)(props);
  };
};

export const createFilterComponent = <InstanceType extends Pixi.Filter, OptionsType extends object>(
  PixiClass: new (props: OptionsType) => InstanceType,
) => {
  return (props: OptionsType & FilterProps<InstanceType>): InstanceType & JSX.Element => {
    const [runtimeProps, initialisationProps] = splitProps(props, ["ref", "as"]);

    const instance = props.as || new PixiClass(initialisationProps as any);

    // Handle initialisation props
    createRenderEffect<boolean>((defer) => {
      for (const key in initialisationProps) {
        if (key === "children") {
          throw new Error(`Cannot set children on non-container instance.`);
        } else {
          createRenderEffect(
            on(
              () => initialisationProps[key],
              () => {
                (instance as any)[key] = initialisationProps[key];
              },
              { defer },
            ),
          );
        }
      }

      return false;
    }, true);

    // Handle runtime props
    createRenderEffect(() => {
      for (const key in runtimeProps) {
        if (key === "as") continue;

        if (key === "ref") {
          if (typeof runtimeProps[key] === "function") {
            (runtimeProps[key] as (arg: any) => void)(instance);
          } else {
            (runtimeProps[key] as any) = instance;
          }

          continue;
        }

        if (key in instance) {
          createRenderEffect(() => ((instance as any)[key] = (runtimeProps as any)[key]));
          continue;
        }
      }
    });

    // Destroy the filter here because filters aren't children of the component they are applied to, so they won't be destroyed through normal Pixi parent-child destruction.
    onCleanup(() => {
      instance.destroy(true);
    });

    return instance as InstanceType & JSX.Element;
  };
};
