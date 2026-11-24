import type * as Pixi from "pixi.js";
import { Container } from "pixi.js";
import { createRoot, createSignal, flush } from "solid-js";
import { test } from "vitest";

import { bindPropsByKey } from "../../components/bind-props";
import { runBenchmarks } from "../baselines";

import { bindSingleEffectDiff, bindSingleEffectRewrite } from "./bind-props-strategies.variant";

type BindFn = (
  props: Record<string, unknown>,
  bindKey: (key: string, value: unknown) => void,
) => void;

/**
 * The shipped per-key binder against the single-effect alternative it replaced.
 *
 * The claim under test is that one effect per prop key beats one effect that
 * reads every prop. Both capture values during the compute, so neither pays a
 * per-change allocation, and the workloads change 1, 3, and 11 of 11 props. If
 * the per-key binder is not measurably better here, the extra machinery is not
 * paying for itself.
 */
const STRATEGIES: { name: string; bind: BindFn }[] = [
  {
    name: "per-key",
    bind: (props, bindKey) => bindPropsByKey(props, () => true, bindKey, false),
  },
  {
    name: "single/rewrite",
    bind: (props, bindKey) => bindSingleEffectRewrite(props, () => true, bindKey),
  },
  {
    name: "single/diff",
    bind: (props, bindKey) => bindSingleEffectDiff(props, () => true, bindKey),
  },
];

const createScenario = (bind: BindFn, instance: Pixi.Container) => {
  let dispose: () => void = () => undefined;

  const setters = createRoot((disposeRoot) => {
    dispose = disposeRoot;

    const [x, setX] = createSignal(0);
    const [y, setY] = createSignal(0);
    const [alpha, setAlpha] = createSignal(1);
    const [rotation, setRotation] = createSignal(0);
    const [visible, setVisible] = createSignal(true);
    const [label, setLabel] = createSignal("init");
    const [position, setPosition] = createSignal({ x: 0, y: 0 });
    const [scale, setScale] = createSignal({ x: 1, y: 1 });
    const [skewX, setSkewX] = createSignal(0);
    const [pivotY, setPivotY] = createSignal(0);
    const [tint, setTint] = createSignal(0xffffff);

    // Mirrors the compiler's props object: plain, one reactive getter per prop,
    // so it takes the same static path through the shipped binder.
    const props: Record<string, unknown> = {
      get x() {
        return x();
      },
      get y() {
        return y();
      },
      get alpha() {
        return alpha();
      },
      get rotation() {
        return rotation();
      },
      get visible() {
        return visible();
      },
      get label() {
        return label();
      },
      get position() {
        return position();
      },
      get scale() {
        return scale();
      },
      get skewX() {
        return skewX();
      },
      get pivotY() {
        return pivotY();
      },
      get tint() {
        return tint();
      },
    };

    bind(props, (key, value) => {
      if (key in instance) (instance as never as Record<string, unknown>)[key] = value;
    });

    return {
      setX,
      setY,
      setAlpha,
      setRotation,
      setVisible,
      setLabel,
      setPosition,
      setScale,
      setSkewX,
      setPivotY,
      setTint,
    };
  });

  return { ...setters, dispose };
};

test("prop binder strategies", async ({ bench }) => {
  let iteration = 0;
  const registrations: { name: string; fn: () => void }[] = [];
  const disposers: (() => void)[] = [];

  for (const strategy of STRATEGIES) {
    const scenario = createScenario(strategy.bind, new Container());
    disposers.push(scenario.dispose);

    registrations.push(
      {
        name: `${strategy.name} | single prop`,
        fn: () => {
          iteration += 1;
          scenario.setX(iteration);
          flush();
        },
      },
      {
        name: `${strategy.name} | three props`,
        fn: () => {
          iteration += 1;
          const i = iteration;

          scenario.setX(i);
          scenario.setAlpha((i % 100) / 100);
          scenario.setRotation(i * 0.01);
          flush();
        },
      },
      {
        name: `${strategy.name} | mixed props`,
        fn: () => {
          iteration += 1;
          const i = iteration;
          const toggle = i % 2 === 0;

          scenario.setX(i);
          scenario.setY(i + 1);
          scenario.setAlpha((i % 100) / 100);
          scenario.setRotation(i * 0.01);
          scenario.setVisible(toggle);
          scenario.setLabel(toggle ? "alpha" : "beta");
          scenario.setPosition({ x: i, y: i + 2 });
          scenario.setScale({ x: 1 + i * 0.001, y: 1 + i * 0.002 });
          scenario.setSkewX(i * 0.0001);
          scenario.setPivotY(i * 0.0002);
          scenario.setTint(toggle ? 0xff0000 : 0x00ff00);

          // Solid 2 batches writes, so flush to measure the binding path.
          flush();
        },
      },
    );
  }

  await runBenchmarks(bench, registrations);

  for (const dispose of disposers) dispose();
});
