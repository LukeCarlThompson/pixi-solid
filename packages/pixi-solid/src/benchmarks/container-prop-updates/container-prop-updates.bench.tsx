import { createRoot, createSignal } from "solid-js";
import { test } from "vitest";

import { Container } from "../../components";
import { runBenchmarks } from "../baselines";

const handlers = {
  a: () => undefined,
  b: () => undefined,
};

const createJsxState = () => {
  let dispose: () => void = () => undefined;
  const state = createRoot((disposeRoot) => {
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
    const [onclick, setOnclick] = createSignal<(() => void) | undefined>(undefined);

    const instance = (
      <Container
        x={x()}
        y={y()}
        alpha={alpha()}
        rotation={rotation()}
        visible={visible()}
        label={label()}
        position={position()}
        scale={scale()}
        skewX={skewX()}
        pivotY={pivotY()}
        onclick={onclick()}
      />
    );

    return {
      instance,
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
      setOnclick,
    };
  });

  return { ...state, dispose };
};

test("Container prop updates", async ({ bench }) => {
  const state = createJsxState();
  let jsxIteration = 0;

  // The common game case: a single prop changes per frame. A binder that reads
  // every prop on each update (for example one effect that diffs all of them)
  // shows up here as a large regression, so keep this granular.
  await runBenchmarks(bench, [
    {
      name: "single prop update",
      fn: () => {
        jsxIteration += 1;

        state.setX(jsxIteration);
      },
    },
    {
      name: "three prop updates",
      fn: () => {
        jsxIteration += 1;
        const i = jsxIteration;

        state.setX(i);
        state.setAlpha((i % 100) / 100);
        state.setOnclick(i % 2 === 0 ? handlers.a : handlers.b);
      },
    },
    {
      name: "mixed props updates",
      fn: () => {
        jsxIteration += 1;
        const i = jsxIteration;
        const toggle = i % 2 === 0;

        state.setX(i);
        state.setY(i + 1);
        state.setAlpha((i % 100) / 100);
        state.setRotation(i * 0.01);
        state.setVisible(toggle);
        state.setLabel(toggle ? "alpha" : "beta");
        state.setPosition({ x: i, y: i + 2 });
        state.setScale({ x: 1 + i * 0.001, y: 1 + i * 0.002 });
        state.setSkewX(i * 0.0001);
        state.setPivotY(i * 0.0002);
        state.setOnclick(toggle ? handlers.a : handlers.b);
      },
    },
  ]);

  state.dispose();
});

test("Container creation", async ({ bench }) => {
  await runBenchmarks(bench, [
    {
      name: "creation only",
      fn: () => {
        createRoot((dispose) => {
          const [x] = createSignal(0);
          const [y] = createSignal(0);
          const [alpha] = createSignal(1);
          const [rotation] = createSignal(0);
          const [visible] = createSignal(true);
          const [label] = createSignal("init");
          const [position] = createSignal({ x: 0, y: 0 });
          const [scale] = createSignal({ x: 1, y: 1 });
          const [skewX] = createSignal(0);
          const [pivotY] = createSignal(0);
          const [onclick] = createSignal<(() => void) | undefined>(handlers.a);

          void (
            <Container
              x={x()}
              y={y()}
              alpha={alpha()}
              rotation={rotation()}
              visible={visible()}
              label={label()}
              position={position()}
              scale={scale()}
              skewX={skewX()}
              pivotY={pivotY()}
              onclick={onclick()}
            />
          );

          dispose();
        });
      },
    },
  ]);
});
