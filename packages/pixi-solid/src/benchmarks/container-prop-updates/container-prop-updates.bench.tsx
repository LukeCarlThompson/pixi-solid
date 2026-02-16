import { batch, createRoot, createSignal } from "solid-js";
import { bench, describe } from "vitest";

import { Container } from "../../components/components";

const handlers = {
  a: () => undefined,
  b: () => undefined,
};

const createDirectState = () => {
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

    const instance = Container({
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
      get onclick() {
        return onclick();
      },
    } as any);

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

const directState = createDirectState();
const jsxState = createJsxState();
let directIteration = 0;
let jsxIteration = 0;

describe("container prop updates - mixed props", () => {
  bench("direct Container() props updates", () => {
    directIteration += 1;
    const i = directIteration;
    const toggle = i % 2 === 0;

    batch(() => {
      directState.setX(i);
      directState.setY(i + 1);
      directState.setAlpha((i % 100) / 100);
      directState.setRotation(i * 0.01);
      directState.setVisible(toggle);
      directState.setLabel(toggle ? "alpha" : "beta");
      directState.setPosition({ x: i, y: i + 2 });
      directState.setScale({ x: 1 + i * 0.001, y: 1 + i * 0.002 });
      directState.setSkewX(i * 0.0001);
      directState.setPivotY(i * 0.0002);
      directState.setOnclick(toggle ? handlers.a : handlers.b);
    });
  });

  bench("JSX <Container /> props updates", () => {
    jsxIteration += 1;
    const i = jsxIteration;
    const toggle = i % 2 === 0;

    batch(() => {
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

  bench("JSX <Container /> creation only", () => {
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
