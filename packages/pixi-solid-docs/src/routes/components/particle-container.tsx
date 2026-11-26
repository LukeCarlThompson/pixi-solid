import type { JSX } from "@solidjs/web";
import { clientOnly } from "@solidjs/web";

import { Article, CodeBlock, DemoSection, Searchable } from "../../components";
import demoCode from "../../demos/particle-container.demo.tsx?raw";

const ParticleContainerDemo = clientOnly(() => import("../../demos/particle-container.demo"), {
  export: "Demo",
});

export const route = {
  info: {
    label: "Particle Container",
    description: "A SolidJS component that renders a PixiJS ParticleContainer.",
    order: 100,
    sections: [
      { id: "demo", title: "Demo" },
      { id: "code-example", title: "Code example" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <Article>
      <Searchable>
        <h1>Particle Container</h1>
        <p>
          A SolidJS component that renders a PixiJS <code>ParticleContainer</code>.
        </p>
        <p>
          Please see the{" "}
          <a href="https://pixijs.download/release/docs/scene.ParticleContainer.html">
            PixiJS docs
          </a>{" "}
          for detailed information.
        </p>
        <h2 id="demo">Demo</h2>
        <DemoSection title="particle-container">
          <ParticleContainerDemo fallback={<span />} />
        </DemoSection>
        <p>
          Food icons by{" "}
          <a href="https://darinagrant.itch.io/pixel-art-food-icon-pack-32x32">Darina Grant</a>.
        </p>
        <h2 id="code-example">Code example</h2>
        <CodeBlock code={demoCode} title="particle-container-demo.tsx" />
      </Searchable>
    </Article>
  );
}
