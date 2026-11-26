import type { JSX } from "@solidjs/web";
import { clientOnly } from "@solidjs/web";

import { CodeBlock } from "../../components/molecules/CodeBlock";
import { DemoSection } from "../../components/organisms/DemoSection";
import demoCode from "../../demos/use-spring.demo.tsx?raw";

const UseSpringDemo = clientOnly(() => import("../../demos/use-spring.demo"), { export: "Demo" });

export const route = {
  info: {
    label: "useSpring",
    description:
      "Solid.js function for creating spring-based animations for numeric values, synchronized with the PixiJS ticker.",
    order: 2,
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
      <h1>useSpring</h1>
      <p>
        The <code>useSpring</code> function provides reactive SolidJS signals for creating
        physically-based spring animations for numeric values.
      </p>
      <h2 id="return-value">Return Value</h2>
      <p>The function returns an object with the following properties:</p>
      <ul>
        <li>
          <p>
            <strong>
              <code>value</code>
            </strong>{" "}
            - An accessor signal containing the current spring-animated value
          </p>
        </li>
        <li>
          <p>
            <strong>
              <code>velocity</code>
            </strong>{" "}
            - An accessor signal containing the current velocity of the spring
          </p>
        </li>
        <li>
          <p>
            <strong>
              <code>setValue</code>
            </strong>{" "}
            - A function to set the current value directly, bypassing physics calculations for that
            frame. This allows you to "teleport" the spring to a specific value. The velocity will
            continue to be calculated normally on the next frame.
          </p>
        </li>
      </ul>
      <h2 id="behavior">Behavior</h2>
      <p>
        The function internally manages the spring physics calculations and keeps its updates
        synchronized with the PixiJS application's ticker, ensuring smooth and responsive animations
        that align with your application's frame rate.
      </p>
      <p>
        It must be called within a SolidJS tracking scope, such as a component or another function,
        that is a descendant of <code>PixiApplicationProvider</code>, <code>PixiCanvas</code>, or{" "}
        <code>TickerProvider</code>.
      </p>
      <h2 id="demo">Demo</h2>
      <p>
        Taking our earlier <code>useSmoothDamp</code> demo and applying <code>useSpring</code> gives
        us an altogether different feeling motion.
      </p>
      <DemoSection title="use-spring">
        <UseSpringDemo fallback={<span />} />
      </DemoSection>
      <h2 id="code-example">Code example</h2>
      <CodeBlock code={demoCode} title="demo-app.tsx" />
    </article>
  );
}
