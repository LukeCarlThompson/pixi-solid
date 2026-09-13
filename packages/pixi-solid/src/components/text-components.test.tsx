import type * as Pixi from "pixi.js";
import { createSignal } from "solid-js";
import { describe, expect, it, vi } from "vitest";

import { mountScene } from "../testing";

import { BitmapText, SplitBitmapText, SplitText, Text } from "./components";

const splitStyle: Pixi.TextStyleOptions = {
  fontSize: 24,
  fill: 0xffffff,
};

const acceptsSplitTextProps = (props: Parameters<typeof SplitText>[0]) => props;
const acceptsSplitBitmapTextProps = (props: Parameters<typeof SplitBitmapText>[0]) => props;

acceptsSplitTextProps({ text: "hello", style: {} });
acceptsSplitBitmapTextProps({ text: "hello", style: {} });

// @ts-expect-error SplitText is a Container and does not have sprite anchor props.
acceptsSplitTextProps({ text: "hello", style: {}, anchorX: 0.5 });
// @ts-expect-error SplitBitmapText is a Container and does not have sprite anchor props.
acceptsSplitBitmapTextProps({ text: "hello", style: {}, anchorX: 0.5 });

describe("BitmapText style prop updates", () => {
  it("GIVEN a BitmapText without a style prop WHEN mounted THEN it constructs with default styling", () => {
    let bitmapTextRef: Pixi.BitmapText | undefined;

    const { dispose } = mountScene(() => (
      <BitmapText
        text="hello"
        ref={(el) => {
          bitmapTextRef = el;
        }}
      />
    ));

    expect(bitmapTextRef).toBeDefined();
    expect(bitmapTextRef?.text).toBe("hello");
    expect(bitmapTextRef?.style).toBeDefined();

    dispose();
  });

  it("GIVEN a BitmapText with a signal-driven style WHEN the style signal changes THEN the instance style reflects the new values", () => {
    // GIVEN: A style signal with initial values
    const [style, setStyle] = createSignal<Pixi.TextStyleOptions>({
      fontSize: 24,
      fill: 0xff0000,
    });

    let bitmapTextRef: Pixi.BitmapText | undefined;

    // WHEN: Render a BitmapText with the signal style
    const { dispose } = mountScene(() => (
      <BitmapText
        text="hello"
        ref={(el) => {
          bitmapTextRef = el;
        }}
        style={style()}
      />
    ));

    if (!bitmapTextRef) {
      throw new Error("BitmapText ref was not set");
    }

    // THEN: The initial style is applied
    expect(bitmapTextRef.text).toBe("hello");
    expect(bitmapTextRef.style.fontSize).toBe(24);
    expect(bitmapTextRef.style.fill).toBe(0xff0000);

    // WHEN: The style signal changes to a new object
    setStyle({ fontSize: 48, fill: 0x00ff00 });

    // THEN: The instance style reflects the new values
    expect(bitmapTextRef.style.fontSize).toBe(48);
    expect(bitmapTextRef.style.fill).toBe(0x00ff00);

    dispose();
  });

  it("GIVEN a BitmapText with a signal-driven text WHEN the text signal changes THEN the instance text updates", () => {
    // GIVEN: A text signal with an initial value
    const [text, setText] = createSignal("hello");

    let bitmapTextRef: Pixi.BitmapText | undefined;

    // WHEN: Render a BitmapText with the signal text
    const { dispose } = mountScene(() => (
      <BitmapText
        ref={(el) => {
          bitmapTextRef = el;
        }}
        text={text()}
        style={{ fontSize: 24 }}
      />
    ));

    if (!bitmapTextRef) {
      throw new Error("BitmapText ref was not set");
    }

    expect(bitmapTextRef.text).toBe("hello");

    // WHEN: The text signal changes
    setText("world");

    // THEN: The instance text updates
    expect(bitmapTextRef.text).toBe("world");

    dispose();
  });

  it("GIVEN a BitmapText with spread signal props WHEN the style in the signal changes THEN the instance style updates", () => {
    // GIVEN: A props signal containing text and style
    const [propsSignal, setPropsSignal] = createSignal<Pixi.TextOptions>({
      text: "spread",
      style: { fontSize: 16, fill: 0x0000ff },
    });

    let bitmapTextRef: Pixi.BitmapText | undefined;

    // WHEN: Render a BitmapText with spread props from the signal
    const { dispose } = mountScene(() => (
      <BitmapText
        ref={(el) => {
          bitmapTextRef = el;
        }}
        {...propsSignal()}
      />
    ));

    if (!bitmapTextRef) {
      throw new Error("BitmapText ref was not set");
    }

    expect(bitmapTextRef.text).toBe("spread");
    expect(bitmapTextRef.style.fontSize).toBe(16);

    // WHEN: Update the style (and text) in the signal object
    setPropsSignal({
      text: "updated",
      style: { fontSize: 32, fill: 0xffffff },
    });

    // THEN: The instance reflects the new values
    expect(bitmapTextRef.text).toBe("updated");
    expect(bitmapTextRef.style.fontSize).toBe(32);
    expect(bitmapTextRef.style.fill).toBe(0xffffff);

    dispose();
  });

  it("GIVEN a BitmapText with an inline style object using a signal property WHEN the signal changes THEN the instance style updates", () => {
    // GIVEN: A fontSize signal used inside an inline style object
    const [fontSize, setFontSize] = createSignal(24);

    let bitmapTextRef: Pixi.BitmapText | undefined;

    // WHEN: Render a BitmapText with an inline style object referencing the signal
    const { dispose } = mountScene(() => (
      <BitmapText
        text="hello"
        ref={(el) => {
          bitmapTextRef = el;
        }}
        style={{ fontSize: fontSize(), fill: 0xff0000 }}
      />
    ));

    if (!bitmapTextRef) {
      throw new Error("BitmapText ref was not set");
    }

    expect(bitmapTextRef.style.fontSize).toBe(24);

    // WHEN: The fontSize signal changes
    setFontSize(48);

    // THEN: The instance style reflects the new value
    expect(bitmapTextRef.style.fontSize).toBe(48);
    expect(bitmapTextRef.style.fill).toBe(0xff0000);

    dispose();
  });

  it("GIVEN a Text component with a signal-driven style WHEN the style signal changes THEN the instance style reflects the new values", () => {
    // GIVEN: A style signal with initial values
    const [style, setStyle] = createSignal<Pixi.TextStyleOptions>({
      fontSize: 24,
      fill: 0xff0000,
    });

    let textRef: Pixi.Text | undefined;

    // WHEN: Render a Text with the signal style
    const { dispose } = mountScene(() => (
      <Text
        text="hello"
        ref={(el) => {
          textRef = el;
        }}
        style={style()}
      />
    ));

    if (!textRef) {
      throw new Error("Text ref was not set");
    }

    expect(textRef.style.fontSize).toBe(24);

    // WHEN: The style signal changes to a new object
    setStyle({ fontSize: 48, fill: 0x00ff00 });

    // THEN: The instance style reflects the new values
    expect(textRef.style.fontSize).toBe(48);
    expect(textRef.style.fill).toBe(0x00ff00);

    dispose();
  });
});

/**
 * REGRESSION: constructing a BitmapText from spread signal props that lack a
 * `style` key (or have `style: undefined`) crashes.
 *
 * Root cause: PixiJS's `BitmapText` constructor mutates the options object it
 * receives (`options.style ?? (options.style = {})`, then
 * `options.style.fill ??= 0xffffff`). The pixi-solid factories pass Solid's
 * reactive props object (a `mergeProps` proxy) directly to the Pixi
 * constructor. Assigning to a missing key on that proxy silently fails, so
 * `options.style` stays `undefined` and the constructor throws
 * `Cannot read properties of undefined (reading 'fill')`.
 *
 * A plain (non-spread) `<BitmapText text="..." />` does not crash because the
 * plain JSX props object allows the assignment.
 */
describe("BitmapText spread construction without a style key (REGRESSION)", () => {
  it("GIVEN spread signal props WITHOUT a style key WHEN mounted THEN it constructs with default styling", () => {
    const [propsSignal] = createSignal<Pixi.TextOptions>({ text: "spread" });

    let bitmapTextRef: Pixi.BitmapText | undefined;

    const { dispose } = mountScene(() => (
      <BitmapText
        ref={(el) => {
          bitmapTextRef = el;
        }}
        {...propsSignal()}
      />
    ));

    expect(bitmapTextRef).toBeDefined();
    expect(bitmapTextRef?.text).toBe("spread");
    expect(bitmapTextRef?.style).toBeDefined();

    dispose();
  });

  it("GIVEN spread signal props WITH an explicit style: undefined WHEN mounted THEN it constructs with default styling", () => {
    const [propsSignal] = createSignal({
      text: "spread",
      style: undefined,
    });

    let bitmapTextRef: Pixi.BitmapText | undefined;

    const { dispose } = mountScene(() => (
      <BitmapText
        ref={(el) => {
          bitmapTextRef = el;
        }}
        {...propsSignal()}
      />
    ));

    expect(bitmapTextRef).toBeDefined();
    expect(bitmapTextRef?.style).toBeDefined();

    dispose();
  });
});

describe("BitmapText user style pattern", () => {
  it("GIVEN a BitmapText with a ternary style driven by a signal WHEN the signal flips THEN the instance style updates", () => {
    const [canAfford, setCanAfford] = createSignal(true);

    let ref: Pixi.BitmapText | undefined;

    const { dispose } = mountScene(() => (
      <BitmapText
        text={canAfford() ? "BUY" : "NEED MORE COINS"}
        ref={(el) => {
          ref = el;
        }}
        style={
          canAfford()
            ? {
                fontFamily: "Cormorant",
                fontSize: 26,
                letterSpacing: 1,
                align: "center",
              }
            : {
                fontFamily: "Cormorant",
                fontSize: 14,
                letterSpacing: 1,
                align: "center",
              }
        }
        anchorX={0.5}
        anchorY={0.52}
      />
    ));

    if (!ref) {
      throw new Error("BitmapText ref was not set");
    }

    expect(ref.text).toBe("BUY");
    expect(ref.style.fontSize).toBe(26);
    expect(ref.style.align).toBe("center");
    expect(ref.style.fontFamily).toBe("Cormorant");

    setCanAfford(false);

    expect(ref.text).toBe("NEED MORE COINS");
    expect(ref.style.fontSize).toBe(14);
    expect(ref.style.align).toBe("center");
    expect(ref.style.fontFamily).toBe("Cormorant");

    setCanAfford(true);

    expect(ref.text).toBe("BUY");
    expect(ref.style.fontSize).toBe(26);

    dispose();
  });
});

describe("SplitText", () => {
  it("GIVEN SplitText with autoSplit disabled WHEN mounted THEN it exposes its configured text and style", () => {
    let splitTextRef: Pixi.SplitText | undefined;

    const { dispose } = mountScene(() => (
      <SplitText
        text="Hello world"
        style={splitStyle}
        autoSplit={false}
        charAnchor={{ x: 0.25, y: 0.75 }}
        wordAnchor={{ x: 0, y: 0.5 }}
        lineAnchor={0.5}
        position={{ x: 10, y: 20 }}
        ref={(instance) => {
          splitTextRef = instance;
        }}
      />
    ));

    if (!splitTextRef) {
      throw new Error("SplitText ref was not set");
    }

    expect(splitTextRef.text).toBe("Hello world");
    expect(splitTextRef.style.fontSize).toBe(24);
    expect(splitTextRef.style.fill).toBe(0xffffff);
    expect(splitTextRef.charAnchor).toEqual({ x: 0.25, y: 0.75 });
    expect(splitTextRef.wordAnchor).toEqual({ x: 0, y: 0.5 });
    expect(splitTextRef.lineAnchor).toBe(0.5);
    expect(splitTextRef.position.x).toBe(10);
    expect(splitTextRef.position.y).toBe(20);
    expect(splitTextRef.chars).toHaveLength(0);
    expect(splitTextRef.words).toHaveLength(0);
    expect(splitTextRef.lines).toHaveLength(0);

    dispose();
  });

  it("GIVEN reactive SplitText props WHEN text and style change THEN the instance updates", () => {
    const [text, setText] = createSignal("Hello");
    const [style, setStyle] = createSignal<Pixi.TextStyleOptions>(splitStyle);
    let splitTextRef: Pixi.SplitText | undefined;

    const { dispose } = mountScene(() => (
      <SplitText
        text={text()}
        style={style()}
        autoSplit={false}
        ref={(instance) => {
          splitTextRef = instance;
        }}
      />
    ));

    if (!splitTextRef) {
      throw new Error("SplitText ref was not set");
    }

    setText("Updated");
    setStyle({ fontSize: 36, fill: 0xff0000 });

    expect(splitTextRef.text).toBe("Updated");
    expect(splitTextRef.style.fontSize).toBe(36);
    expect(splitTextRef.style.fill).toBe(0xff0000);

    dispose();
  });

  it("GIVEN a mounted SplitText WHEN disposed THEN it destroys the instance", () => {
    let splitTextRef: Pixi.SplitText | undefined;
    const { dispose } = mountScene(() => (
      <SplitText
        text="Hello"
        style={splitStyle}
        autoSplit={false}
        ref={(instance) => {
          splitTextRef = instance;
        }}
      />
    ));

    if (!splitTextRef) {
      throw new Error("SplitText ref was not set");
    }

    const destroySpy = vi.spyOn(splitTextRef, "destroy");

    dispose();

    expect(destroySpy).toHaveBeenCalledWith({ children: true });
  });
});

describe("SplitBitmapText", () => {
  it("GIVEN spread props with an empty style WHEN mounted THEN it creates default styling", () => {
    const [props] = createSignal({ text: "Hello world", style: {} });
    let splitBitmapTextRef: Pixi.SplitBitmapText | undefined;

    const { dispose } = mountScene(() => (
      <SplitBitmapText
        {...props()}
        autoSplit={false}
        ref={(instance) => {
          splitBitmapTextRef = instance;
        }}
      />
    ));

    if (!splitBitmapTextRef) {
      throw new Error("SplitBitmapText ref was not set");
    }

    expect(splitBitmapTextRef.text).toBe("Hello world");
    expect(splitBitmapTextRef.style.fill).toBe(0xffffff);
    expect(splitBitmapTextRef.chars).toHaveLength(0);

    dispose();
  });

  it("GIVEN reactive SplitBitmapText props WHEN text and style change THEN the instance updates", () => {
    const [text, setText] = createSignal("Hello");
    const [style, setStyle] = createSignal<Pixi.TextStyleOptions>(splitStyle);
    let splitBitmapTextRef: Pixi.SplitBitmapText | undefined;

    const { dispose } = mountScene(() => (
      <SplitBitmapText
        text={text()}
        style={style()}
        autoSplit={false}
        ref={(instance) => {
          splitBitmapTextRef = instance;
        }}
      />
    ));

    if (!splitBitmapTextRef) {
      throw new Error("SplitBitmapText ref was not set");
    }

    setText("Updated");
    setStyle({ fontSize: 36, fill: 0xff0000 });

    expect(splitBitmapTextRef.text).toBe("Updated");
    expect(splitBitmapTextRef.style.fontSize).toBe(36);
    expect(splitBitmapTextRef.style.fill).toBe(0xff0000);

    dispose();
  });
});
