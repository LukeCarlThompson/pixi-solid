import type { JSX } from "@solidjs/web";
import type * as Pixi from "pixi.js";
import type { Ref } from "solid-js";
import { createRenderEffect, onCleanup, untrack, useContext } from "solid-js";

import { TickerContext } from "../pixi-application/context";

import { bindInitialisationProps, bindRuntimeProps } from "./bind-props";
import { PIXI_SOLID_EVENT_HANDLER_NAMES } from "./event-properties";
import type { PixiSolidEventHandlerMap } from "./event-properties";
import type {
  CommonPointAxisPropName,
  AnchorPointAxisPropName,
  TilingPointAxisPropName,
} from "./point-properties";
import {
  COMMON_POINT_PROP_AXIS_NAMES,
  ANCHOR_POINT_PROP_AXIS_NAMES,
  TILING_POINT_PROP_AXIS_NAMES,
} from "./point-properties";

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
> = PixiSolidEventHandlerMap &
  CommonPointAxisProps &
  (ComponentOptions extends { anchor?: any } ? AnchorPointAxisProps : unknown) &
  (ComponentOptions extends { tilePosition?: any } ? TilingPointAxisProps : unknown) &
  Omit<ComponentOptions, "children">;

type RefAsProps<Component> = {
  ref?: Ref<Component>;
  as?: Component;
};

type PixiComponent<Props, Instance> = (props: Props) => Instance & JSX.Element;

/**
 * Prop definition for basic Container components (position, scale, pivot, skew only)
 */
export type ContainerProps<Component> = PixiSolidEventHandlerMap &
  CommonPointAxisProps &
  RefAsProps<Component> & {
    children?: JSX.Element;
  };

/**
 * Prop definition for components that cannot have children
 */
export type LeafProps<Component> = PixiSolidEventHandlerMap &
  CommonPointAxisProps &
  RefAsProps<Component>;

/**
 * Prop definition for Sprite-like components (includes anchor properties)
 */
export type SpriteProps<Component> = PixiSolidEventHandlerMap &
  CommonPointAxisProps &
  AnchorPointAxisProps &
  RefAsProps<Component>;

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
  TilingPointAxisProps &
  RefAsProps<Component>;

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

const ANIMATED_SPRITE_INITIALISATION_RUNTIME_KEYS = [...SPRITE_RUNTIME_KEYS, "autoUpdate"] as const;

const CONTAINER_RUNTIME_KEY_SET: ReadonlySet<string> = new Set(CONTAINER_RUNTIME_KEYS);
const SPRITE_RUNTIME_KEY_SET: ReadonlySet<string> = new Set(SPRITE_RUNTIME_KEYS);
const TILING_SPRITE_RUNTIME_KEY_SET: ReadonlySet<string> = new Set(TILING_SPRITE_RUNTIME_KEYS);
const ANIMATED_SPRITE_INITIALISATION_RUNTIME_KEY_SET: ReadonlySet<string> = new Set(
  ANIMATED_SPRITE_INITIALISATION_RUNTIME_KEYS,
);

/**
 * Copy the props that are not owned by the runtime binder into a mutable
 * options object for the Pixi constructor. Built directly from the props
 * object rather than an `omit()` view: measurements show the direct loop is
 * faster, and the excluded-key set is precomputed per component type.
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

export const createContainerComponent = <
  InstanceType extends Pixi.Container,
  OptionsType extends object,
>(
  PixiClass: new (props: OptionsType) => InstanceType,
): PixiComponent<Omit<OptionsType, "children"> & ContainerProps<InstanceType>, InstanceType> => {
  // `createComponent` runs the body with a strict-read label, which warns on any
  // reactive read here. The body is entirely one-time setup, so run it under
  // `untrack`; the binder effects created inside establish their own tracking.
  return (props): InstanceType & JSX.Element =>
    untrack(() => {
      const as = props.as;
      const isUserOwnedInstance = as !== undefined;
      const options = getInstanceOptions(props, CONTAINER_RUNTIME_KEY_SET);
      const instance = as || new PixiClass(options as any);

      bindInitialisationProps(instance, props, CONTAINER_RUNTIME_KEY_SET, {
        deferInitialRun: !isUserOwnedInstance,
      });
      bindRuntimeProps(instance, props, CONTAINER_RUNTIME_KEY_SET);

      onCleanup(() => {
        if (isUserOwnedInstance) return;

        if ("attach" in instance) {
          // Means it's a render layer so we don't want to destroy children as they are managed elsewhere in the tree.
          instance.destroy({ children: false });
        } else {
          instance.destroy({ children: true });
        }
      });

      return instance as InstanceType & JSX.Element;
    });
};

export const createLeafComponent = <
  InstanceType extends Pixi.Container,
  OptionsType extends object,
>(
  PixiClass: new (props: OptionsType) => InstanceType,
): PixiComponent<Omit<OptionsType, "children"> & LeafProps<InstanceType>, InstanceType> => {
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
): PixiComponent<Omit<OptionsType, "children"> & SpriteProps<InstanceType>, InstanceType> => {
  return (
    props: Omit<OptionsType, "children"> & SpriteProps<InstanceType>,
  ): InstanceType & JSX.Element => {
    return untrack(() => {
      const as = props.as;
      const isUserOwnedInstance = as !== undefined;
      const options = getInstanceOptions(props, SPRITE_RUNTIME_KEY_SET);
      const instance = as || new PixiClass(options as any);

      bindInitialisationProps(instance, props, SPRITE_RUNTIME_KEY_SET, {
        deferInitialRun: !isUserOwnedInstance,
      });
      bindRuntimeProps(instance, props, SPRITE_RUNTIME_KEY_SET);

      onCleanup(() => {
        if (isUserOwnedInstance) return;
        instance.destroy({ children: true });
      });

      return instance as InstanceType & JSX.Element;
    });
  };
};

export const createAnimatedSpriteComponent = <
  InstanceType extends AnimatedSpriteLike,
  OptionsType extends object,
>(
  PixiClass: new (props: OptionsType) => InstanceType,
): PixiComponent<
  Omit<OptionsType, "children"> & AnimatedSpriteProps<InstanceType>,
  InstanceType
> => {
  return (
    props: Omit<OptionsType, "children"> & AnimatedSpriteProps<InstanceType>,
  ): InstanceType & JSX.Element => {
    return untrack(() => {
      const as = props.as;
      const isUserOwnedInstance = as !== undefined;
      const options = getInstanceOptions(props, ANIMATED_SPRITE_INITIALISATION_RUNTIME_KEY_SET);
      const instance = as || new PixiClass(options as any);

      // Set this to false to override Pixi's default shared ticker behaviour.
      instance.autoUpdate = false;
      let ticker: Pixi.Ticker | undefined;
      try {
        ticker = useContext(TickerContext);
      } catch {
        // No TickerProvider; `autoUpdate` has no ticker to attach to.
      }

      createRenderEffect(
        () => props.autoUpdate,
        (autoUpdate) => {
          if (autoUpdate === false) return;

          if (!ticker) {
            throw new Error(
              "getTicker must be used within a PixiApplicationProvider, PixiCanvas, or TickerProvider",
            );
          }

          const updateInstance = (currentTicker: Pixi.Ticker) => {
            instance.update(currentTicker);
          };

          ticker.add(updateInstance);
          return () => ticker.remove(updateInstance);
        },
      );

      bindInitialisationProps(instance, props, ANIMATED_SPRITE_INITIALISATION_RUNTIME_KEY_SET, {
        deferInitialRun: !isUserOwnedInstance,
      });
      bindRuntimeProps(instance, props, SPRITE_RUNTIME_KEY_SET);

      onCleanup(() => {
        if (isUserOwnedInstance) return;
        instance.destroy({ children: true });
      });

      return instance as InstanceType & JSX.Element;
    });
  };
};

export const createTilingSpriteComponent = <
  InstanceType extends Pixi.Container,
  OptionsType extends object,
>(
  PixiClass: new (props: OptionsType) => InstanceType,
): PixiComponent<Omit<OptionsType, "children"> & TilingSpriteProps<InstanceType>, InstanceType> => {
  return (
    props: Omit<OptionsType, "children"> & TilingSpriteProps<InstanceType>,
  ): InstanceType & JSX.Element => {
    return untrack(() => {
      const as = props.as;
      const isUserOwnedInstance = as !== undefined;
      const options = getInstanceOptions(props, TILING_SPRITE_RUNTIME_KEY_SET);
      const instance = as || new PixiClass(options as any);

      bindInitialisationProps(instance, props, TILING_SPRITE_RUNTIME_KEY_SET, {
        deferInitialRun: !isUserOwnedInstance,
      });
      bindRuntimeProps(instance, props, TILING_SPRITE_RUNTIME_KEY_SET);

      onCleanup(() => {
        if (isUserOwnedInstance) return;
        instance.destroy({ children: true });
      });

      return instance as InstanceType & JSX.Element;
    });
  };
};
