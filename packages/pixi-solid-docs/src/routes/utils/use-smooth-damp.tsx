import type { JSX } from "@solidjs/web";
import { clientOnly } from "@solidjs/web";

import { CodeBlock, DemoSection } from "../../components";
import demoCode from "../../demos/use-smooth-damp.demo.tsx?raw";

const UseSmoothDampDemo = clientOnly(() => import("../../demos/use-smooth-damp.demo"), {
  export: "Demo",
});

export const route = {
  info: {
    label: "useSmoothDamp",
    description:
      "Solid.js function for smoothly dampening a numeric value towards a target over time, synchronized with the PixiJS ticker.",
    order: 1,
    sections: [
      { id: "return-value", title: "Return Value" },
      { id: "behavior", title: "Behavior" },
      { id: "demo", title: "Demo" },
      { id: "code-example", title: "Code example" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <article class="ps-prose">
      <h1>useSmoothDamp</h1>
      <p>
        The <code>useSmoothDamp</code> function provides a reactive SolidJS signal that smoothly
        interpolates a numeric value towards a target value over time.
      </p>
      <h2 id="return-value">Return Value</h2>
      <p>The function returns an object with the following properties:</p>
      <ul>
        <li>
          <p>
            <strong>
              <code>value</code>
            </strong>{" "}
            - An accessor signal containing the current damped value
          </p>
        </li>
        <li>
          <p>
            <strong>
              <code>velocity</code>
            </strong>{" "}
            - An accessor signal containing the current velocity
          </p>
        </li>
        <li>
          <p>
            <strong>
              <code>setValue</code>
            </strong>{" "}
            - A function to set the current value directly, bypassing damping calculations for that
            frame. This allows you to "teleport" the value to a specific point. The velocity will
            continue to be calculated normally on the next frame.
          </p>
        </li>
      </ul>
      <h2 id="behavior">Behavior</h2>
      <p>
        It internally manages the damping physics and keeps its updates synchronized with the PixiJS
        application's ticker, ensuring smooth animations that sync with your application's frame
        rate.
      </p>
      <p>
        This function is similar in functionality to Unity's <code>Mathf.SmoothDamp</code> which is
        based on Game Programming Gems 4, Chapter 1.10.
      </p>
      <p>
        It must be called within a SolidJS tracking scope, such as a component or another function,
        that is a descendant of <code>PixiApplicationProvider</code>, <code>PixiCanvas</code>, or{" "}
        <code>TickerProvider</code>.
      </p>
      <h2 id="demo">Demo</h2>
      <p>
        Taking our earlier dragging demo and applying <code>useSmoothDamp</code> to the dragging
        motion.
      </p>
      <DemoSection title="use-smooth-damp">
        <UseSmoothDampDemo fallback={<span />} />
      </DemoSection>
      <h2 id="code-example">Code example</h2>
      <CodeBlock code={demoCode} title="demo-app.tsx" />
    </article>
  );
}
