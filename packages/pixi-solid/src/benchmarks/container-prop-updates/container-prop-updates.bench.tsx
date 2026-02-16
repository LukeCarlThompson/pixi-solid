import { createRoot, createSignal } from "solid-js";
import { bench, describe } from "vitest";

import { Container } from "../../components/components";

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

const jsxState = createJsxState();
let jsxIteration = 0;

describe("Container", () => {
  bench("mixed props updates", () => {
    jsxIteration += 1;
    const i = jsxIteration;
    const toggle = i % 2 === 0;

    jsxState.setX(i);
    jsxState.setY(i + 1);
    jsxState.setAlpha((i % 100) / 100);
    jsxState.setRotation(i * 0.01);
    jsxState.setVisible(toggle);
    jsxState.setLabel(toggle ? "alpha" : "beta");
    jsxState.setPosition({ x: i, y: i + 2 });
    jsxState.setScale({ x: 1 + i * 0.001, y: 1 + i * 0.002 });
    jsxState.setSkewX(i * 0.0001);
    jsxState.setPivotY(i * 0.0002);
    jsxState.setOnclick(toggle ? handlers.a : handlers.b);
  });
});

describe("Container", () => {
  bench("creation only", () => {
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
  });
});
