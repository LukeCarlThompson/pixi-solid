import type * as Pixi from "pixi.js";
import type { JSX, Ref } from "solid-js";
import { createRenderEffect, on, splitProps, onCleanup } from "solid-js";

import { getTicker } from "../pixi-application";

import { bindInitialisationProps, bindRuntimeProps } from "./bind-props";
import type { PixiSolidEventHandlerMap } from "./bind-props/event-names";
import { PIXI_SOLID_EVENT_HANDLER_NAMES } from "./bind-props/event-names";
import type {
  CommonPointAxisPropName,
  AnchorPointAxisPropName,
  TilingPointAxisPropName,
} from "./bind-props/point-property-names";
import {
  COMMON_POINT_PROP_AXIS_NAMES,
  ANCHOR_POINT_PROP_AXIS_NAMES,
  TILING_POINT_PROP_AXIS_NAMES,
} from "./bind-props/point-property-names";

/**
 * Common point axis properties available on all Container-based components
 */
export type CommonPointAxisProps = Partial<Record<CommonPointAxisPropName, number>>;

/**
 * Anchor point axis properties available on Sprite-like components
 */
export type AnchorPointAxisProps = Partial<Record<AnchorPointAxisPropName, number>>;

/**
 * Tiling point axis properties available on TilingSprite
 */
export type TilingPointAxisProps = Partial<Record<TilingPointAxisPropName, number>>;

/**
 * This is a utility type useful for extending the props of custom components to allow props to be passed through to the underlying Pixi instance.
 *
 * If you don't require them all it's recommended to narrow the type by using Pick or Omit the props to only allow the ones you need.
 *
 * @example PixiComponentProps<Pixi.SpriteOptions>.
 */
export type PixiComponentProps<
  ComponentOptions extends Pixi.ContainerOptions = Pixi.ContainerOptions,
> = PixiSolidEventHandlerMap & CommonPointAxisProps & Omit<ComponentOptions, "children">;

/**
 * Prop definition for basic Container components (position, scale, pivot, skew only)
 */
export type ContainerProps<Component> = PixiSolidEventHandlerMap &
  CommonPointAxisProps &
  Record<string, unknown> & {
    ref?: Ref<Component>;
    as?: Component;
    children?: JSX.Element;
  };

/**
 * Prop definition for components that cannot have children
 */
export type LeafProps<Component> = Omit<ContainerProps<Component>, "children">;

/**
 * Prop definition for Sprite-like components (includes anchor properties)
 */
export type SpriteProps<Component> = PixiSolidEventHandlerMap &
  CommonPointAxisProps &
  AnchorPointAxisProps & {
    ref?: Ref<Component>;
    as?: Component;
  };

export type AnimatedSpriteProps<Component> = SpriteProps<Component> &
  Pick<Pixi.AnimatedSpriteOptions, "autoUpdate">;

type AnimatedSpriteLike = Pixi.Container & {
  autoUpdate: boolean;
  update: (ticker: Pixi.Ticker) => void;
};

/**
 * Prop definition for TilingSprite (includes anchor and tiling properties)
 */
export type TilingSpriteProps<Component> = PixiSolidEventHandlerMap &
  CommonPointAxisProps &
  AnchorPointAxisProps &
  TilingPointAxisProps & {
    ref?: Ref<Component>;
    as?: Component;
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

// Combined keys for splitting props
const CONTAINER_RUNTIME_KEYS = [
  ...SOLID_PROP_KEYS,
  ...PIXI_SOLID_EVENT_HANDLER_NAMES,
  ...COMMON_POINT_PROP_AXIS_NAMES,
] as const;

// Sprite components don't accept "children" since they can't have children
const SPRITE_RUNTIME_KEYS = [
  "ref",
  "as",
  ...PIXI_SOLID_EVENT_HANDLER_NAMES,
  ...COMMON_POINT_PROP_AXIS_NAMES,
  ...ANCHOR_POINT_PROP_AXIS_NAMES,
] as const;

const TILING_SPRITE_RUNTIME_KEYS = [
  "ref",
  "as",
  ...PIXI_SOLID_EVENT_HANDLER_NAMES,
  ...COMMON_POINT_PROP_AXIS_NAMES,
  ...ANCHOR_POINT_PROP_AXIS_NAMES,
  ...TILING_POINT_PROP_AXIS_NAMES,
] as const;

export const createContainerComponent = <
  InstanceType extends Pixi.Container,
  OptionsType extends object,
>(
  PixiClass: new (props: OptionsType) => InstanceType,
): ((
  props: Omit<OptionsType, "children"> & ContainerProps<InstanceType>,
) => InstanceType & JSX.Element) => {
  return (props): InstanceType & JSX.Element => {
    const [runtimeProps, initialisationProps] = splitProps(props, CONTAINER_RUNTIME_KEYS);

    const instance = props.as || new PixiClass(initialisationProps as any);

    bindInitialisationProps(instance, initialisationProps);
    bindRuntimeProps(instance, runtimeProps);

    onCleanup(() => {
      if ("attach" in instance) {
        // Means it's a render layer so we don't want to destroy children as they are managed elsewhere in the tree.
        instance.destroy({ children: false });
      } else {
        instance.destroy({ children: true });
      }
    });

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

export const createSpriteComponent = <
  InstanceType extends Pixi.Container,
  OptionsType extends object,
>(
  PixiClass: new (props: OptionsType) => InstanceType,
) => {
  return (
    props: Omit<OptionsType, "children"> & SpriteProps<InstanceType>,
  ): InstanceType & JSX.Element => {
    const [runtimeProps, initialisationProps] = splitProps(props, SPRITE_RUNTIME_KEYS);

    const instance = props.as || new PixiClass(initialisationProps as any);

    bindInitialisationProps(instance, initialisationProps);
    bindRuntimeProps(instance, runtimeProps);

    onCleanup(() => {
      instance.destroy({ children: true });
    });

    return instance as InstanceType & JSX.Element;
  };
};

export const createAnimatedSpriteComponent = <
  InstanceType extends AnimatedSpriteLike,
  OptionsType extends object,
>(
  PixiClass: new (props: OptionsType) => InstanceType,
) => {
  return (
    props: Omit<OptionsType, "children"> & AnimatedSpriteProps<InstanceType>,
  ): InstanceType & JSX.Element => {
    // Specifically separate `autoUpdate` as we handle it manually below.
    const [runtimeProps, update, initialisationProps] = splitProps(props, SPRITE_RUNTIME_KEYS, [
      "autoUpdate",
    ]);

    const instance = props.as || new PixiClass(initialisationProps as any);

    // Set this to false to override Pixi's default shared ticker behaviour.
    instance.autoUpdate = false;

    createRenderEffect(
      on(
        () => update.autoUpdate,
        (autoUpdate) => {
          const updateInstance = (ticker: Pixi.Ticker) => {
            instance.update(ticker);
          };

          if (autoUpdate !== false) {
            const ticker = getTicker();
            ticker.add(updateInstance);
            onCleanup(() => {
              ticker.remove(updateInstance);
            });
          }
        },
      ),
    );

    bindInitialisationProps(instance, initialisationProps);
    bindRuntimeProps(instance, runtimeProps);

    onCleanup(() => {
      instance.destroy({ children: true });
    });

    return instance as InstanceType & JSX.Element;
  };
};

export const createTilingSpriteComponent = <
  InstanceType extends Pixi.Container,
  OptionsType extends object,
>(
  PixiClass: new (props: OptionsType) => InstanceType,
) => {
  return (
    props: Omit<OptionsType, "children"> & TilingSpriteProps<InstanceType>,
  ): InstanceType & JSX.Element => {
    const [runtimeProps, initialisationProps] = splitProps(props, TILING_SPRITE_RUNTIME_KEYS);

    const instance = props.as || new PixiClass(initialisationProps as any);

    bindInitialisationProps(instance, initialisationProps);
    bindRuntimeProps(instance, runtimeProps);

    onCleanup(() => {
      instance.destroy({ children: true });
    });

    return instance as InstanceType & JSX.Element;
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

    onCleanup(() => {
      instance.destroy();
    });

    return instance as InstanceType & JSX.Element;
  };
};
