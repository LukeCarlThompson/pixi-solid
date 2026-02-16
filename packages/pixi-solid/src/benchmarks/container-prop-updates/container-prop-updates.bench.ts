import { batch, createRoot, createSignal } from "solid-js";
import { bench, describe } from "vitest";

import { bindRuntimeProps } from "../../components/bind-props";

const createMockPoint = () => {
  const point = {
    x: 0,
    y: 0,
    set(x: number, y?: number) {
      if (typeof y === "number") {
        point.x = x;
        point.y = y;
        return;
      }

      point.x = x;
      point.y = x;
    },
  };

  return point;
};

class MockContainer {
  x = 0;
  y = 0;
  alpha = 1;
  rotation = 0;
  visible = true;
  name = "";
  position = createMockPoint();
  scale = createMockPoint();
  skew = createMockPoint();
  pivot = createMockPoint();
  addEventListener() {
    // no-op for benchmark
  }
  removeEventListener() {
    // no-op for benchmark
  }
}

const createBenchmarkState = () => {
  let dispose: () => void = () => undefined;
  const state = createRoot((disposeRoot) => {
    dispose = disposeRoot;
    const instance = new MockContainer();
    const [x, setX] = createSignal(0);
    const [y, setY] = createSignal(0);
    const [alpha, setAlpha] = createSignal(1);
    const [rotation, setRotation] = createSignal(0);
    const [visible, setVisible] = createSignal(true);
    const [name, setName] = createSignal("init");
    const [position, setPosition] = createSignal({ x: 0, y: 0 });
    const [scale, setScale] = createSignal({ x: 1, y: 1 });
    const [skewX, setSkewX] = createSignal(0);
    const [pivotY, setPivotY] = createSignal(0);
    const [onclick, setOnclick] = createSignal<(() => void) | undefined>(undefined);

    const props = {
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
      get name() {
        return name();
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
    };

    bindRuntimeProps(instance as any, props as any);

    return {
      setX,
      setY,
      setAlpha,
      setRotation,
      setVisible,
      setName,
      setPosition,
      setScale,
      setSkewX,
      setPivotY,
      setOnclick,
    };
  });

  return { ...state, dispose };
};

const handlers = {
  a: () => undefined,
  b: () => undefined,
};

const benchState = createBenchmarkState();
let iteration = 0;

describe("container prop updates - mixed props", () => {
  bench("update mixed props on container", () => {
    iteration += 1;
    const i = iteration;
    const toggle = i % 2 === 0;

    batch(() => {
      benchState.setX(i);
      benchState.setY(i + 1);
      benchState.setAlpha((i % 100) / 100);
      benchState.setRotation(i * 0.01);
      benchState.setVisible(toggle);
      benchState.setName(toggle ? "alpha" : "beta");
      benchState.setPosition({ x: i, y: i + 2 });
      benchState.setScale({ x: 1 + i * 0.001, y: 1 + i * 0.002 });
      benchState.setSkewX(i * 0.0001);
      benchState.setPivotY(i * 0.0002);
      benchState.setOnclick(toggle ? handlers.a : handlers.b);
    });
  });
});
