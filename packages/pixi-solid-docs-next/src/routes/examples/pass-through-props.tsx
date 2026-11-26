import type { JSX } from "@solidjs/web";
import { clientOnly } from "@solidjs/web";

import { CodeBlock } from "../../components/molecules/CodeBlock";
import { Tabs } from "../../components/molecules/Tabs";
import { DemoSection } from "../../components/organisms/DemoSection";
import demoCode from "../../demos/pass-through-props.demo.tsx?raw";
import exampleCode from "../../demos/pass-through-props.tsx?raw";

const PassThroughPropsDemo = clientOnly(() => import("../../demos/pass-through-props.demo"), {
  export: "Demo",
});

export const route = {
  info: {
    label: "Pass through props",
    description: "An example of passing props through a component.",
    order: 100,
    sections: [
      { id: "demo", title: "Demo" },
      { id: "code-example", title: "Code example" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <article class="ps-prose">
      <h1>Pass through props</h1>
      <h2 id="demo">Demo</h2>
      <p>Move your mouse or touch across the canvas to change the flying speed of the bird.</p>
      <DemoSection title="pass-through-props">
        <PassThroughPropsDemo fallback={<span />} />
      </DemoSection>
      <h2 id="code-example">Code example</h2>
      <p>
        When you create custom components, it is often useful to pass props through to the
        underlying PixiJS components. This allows for greater flexibility by gaining access to
        properties such as position, scale or adding event listeners from the outside.
      </p>
      <p>
        Instead of writing them out one by one, you can use the utility type{" "}
        <code>PixiComponentProps</code> which contains props for the PixiJS <code>Container</code>{" "}
        but you can extend it by passing in the specific component type a generic{" "}
        <code>
          PixiComponentProps{"<"}Pixi.SpriteOptions{">"}
        </code>
        . It may be useful to combine with the built in <code>Omit</code> or <code>Pick</code>{" "}
        utility types to exclude or include specific props. Combine it with <code>omit</code> and
        the{" "}
        <code>
          {"{"}...props{"}"}
        </code>{" "}
        spread to pass all received props, or only a specific group, down to the underlying
        component. <code>omit</code> returns a reactive view of the remaining props.
      </p>
      <Tabs
        items={[
          {
            label: "pass-through-props-example.tsx",
            content: (
              <>
                <CodeBlock code={exampleCode} title="tsx" />
              </>
            ),
          },
          {
            label: "demo-app.tsx",
            content: (
              <>
                <CodeBlock code={demoCode} title="tsx" />
              </>
            ),
          },
        ]}
      />
    </article>
  );
}
