import type { JSX } from "@solidjs/web";

import snippet1 from "../../code-examples/components-pixi-application-provider-1.tsx?raw";
import { Article, Aside, CodeBlock, Searchable } from "../../components";
import { href } from "../../href";

export const route = {
  info: {
    label: "PixiApplicationProvider",
    description:
      "A Solid.js component that creates and provides a PixiJS Application instance to child components.",
    order: 3,
    sections: [
      { id: "usage", title: "Usage" },
      { id: "props", title: "Props" },
      { id: "available-context", title: "Available Context" },
      { id: "when-to-use-pixiapplicationprovider", title: "When to use PixiApplicationProvider" },
      { id: "when-to-use-pixicanvas-instead", title: "When to use PixiCanvas instead" },
      { id: "when-to-use-tickerprovider-instead", title: "When to use TickerProvider instead" },
      { id: "related-components", title: "Related Components" },
      { id: "further-reading", title: "Further reading" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <Article>
      <Searchable>
        <h1>PixiApplicationProvider</h1>
        <p>
          The <code>PixiApplicationProvider</code> component creates a <code>Pixi.Application</code>{" "}
          instance and provides it through context to descendant components. Unlike{" "}
          <code>PixiCanvas</code>, it does not mount the canvas to the DOM—you must use{" "}
          <code>PixiCanvas</code> as a child component to render the canvas.
        </p>
        <p>This component is useful for scenarios where you need to:</p>
        <ul>
          <li>
            <p>Use pixi-solid hooks in HTML components outside the canvas</p>
          </li>
          <li>
            <p>Manually control application creation and initialization</p>
          </li>
        </ul>
        <h2 id="usage">Usage</h2>
        <h3 id="basic-setup-with-pixicanvas">Basic Setup with PixiCanvas</h3>
        <p>
          In most use cases, you would wrap <code>PixiCanvas</code> with{" "}
          <code>PixiApplicationProvider</code> to allow HTML components to access pixi-solid hooks
          or application state:
        </p>
        <CodeBlock code={snippet1} title="tsx" />
        <h3 id="using-an-existing-application">Using an Existing Application</h3>
        <p>
          You can pass an already-created <code>Pixi.Application</code> instance using the{" "}
          <code>existingApp</code> prop, but you must initialize it with{" "}
          <code>await app.init()</code> before the provider renders. Create the app in an async{" "}
          <code>createMemo</code> and read it inside a{" "}
          <code>
            {"<"}Loading{">"}
          </code>{" "}
          boundary:
        </p>
        <CodeBlock
          code={`import { PixiApplicationProvider, PixiCanvas } from "pixi-solid";
import { Application } from "pixi.js";
import { createMemo, Loading } from "solid-js";

export const App = () => {
  const pixiApp = createMemo(async () => {
    const app = new Application();
    await app.init({
      width: 800,
      height: 600,
      background: "#1099bb",
    });
    return app;
  });

  return (
    <Loading fallback={<p>Loading...</p>}>
      <PixiApplicationProvider existingApp={pixiApp()}>
        <PixiCanvas style={{ width: "100%", height: "100%" }}>
          <YourContent />
        </PixiCanvas>
      </PixiApplicationProvider>
    </Loading>
  );
};`}
          title="tsx"
        />
        <Aside tone="warning">
          <p>
            When using <code>existingApp</code>, you are responsible for:
          </p>
          <ul>
            <li>Ensuring the application is initialized before rendering the provider</li>
            <li>
              Managing the application lifecycle and cleanup, the provider will not destroy the
              application when unmounting
            </li>
          </ul>
        </Aside>
        <h2 id="props">Props</h2>
        <CodeBlock code={`import type { PixiApplicationProps } from "pixi-solid";`} title="tsx" />
        <ul>
          <li>
            <p>
              <code>children: JSX.Element</code> - Child components that will have access to the
              application context (required)
            </p>
          </li>
          <li>
            <p>
              <code>existingApp?: Pixi.Application</code> - An optional initialized Pixi application
              to reuse instead of creating a new one.
            </p>
          </li>
          <li>
            <p>
              <code>Pixi.ApplicationOptions</code> properties except <code>children</code> and{" "}
              <code>resizeTo</code>. They are used only when this provider creates the app.
            </p>
          </li>
        </ul>
        <p>
          If an existing app is reused, any passed application options are ignored; pixi-solid warns
          about this in development. The supported rendering setup is to mount{" "}
          <code>PixiCanvas</code> as a child; it owns the resize target.
        </p>
        <p>
          See the{" "}
          <a href="https://pixijs.com/8.x/guides/components/application">
            PixiJS ApplicationOptions
          </a>{" "}
          documentation for the complete list of options.
        </p>
        <h2 id="available-context">Available Context</h2>
        <p>
          Components inside <code>PixiApplicationProvider</code> have access to:
        </p>
        <ul>
          <li>
            <p>
              <code>getPixiApp()</code> - Access the <code>Pixi.Application</code> instance
            </p>
          </li>
          <li>
            <p>
              <code>getRenderer()</code> - Access the <code>Pixi.Renderer</code> instance
            </p>
          </li>
          <li>
            <p>
              <code>getTicker()</code> - Access the <code>Pixi.Ticker</code> instance
            </p>
          </li>
          <li>
            <p>
              <code>usePixiScreen()</code> - Get reactive screen dimensions
            </p>
          </li>
          <li>
            <p>
              <code>onTick()</code> - Subscribe to ticker updates
            </p>
          </li>
          <li>
            <p>
              <code>onResize()</code> - Subscribe to resize events
            </p>
          </li>
          <li>
            <p>
              <code>createDelay()</code> - Create ticker-synced callback delays
            </p>
          </li>
          <li>
            <p>
              <code>createAsyncDelay()</code> - Create async ticker-synced delays
            </p>
          </li>
        </ul>
        <h2 id="when-to-use-pixiapplicationprovider">When to use PixiApplicationProvider</h2>
        <ul>
          <li>
            <p>When you need HTML components outside the canvas to use pixi-solid hooks</p>
          </li>
          <li>
            <p>When you need manual control over application initialization</p>
          </li>
          <li>
            <p>When you want to provide an existing Pixi Application instance</p>
          </li>
        </ul>
        <h2 id="when-to-use-pixicanvas-instead">When to use PixiCanvas instead</h2>
        <ul>
          <li>
            <p>For simple applications without external HTML components</p>
          </li>
          <li>
            <p>When you do not need to share the application across multiple contexts</p>
          </li>
          <li>
            <p>For the most straightforward and least verbose setup</p>
          </li>
        </ul>
        <h2 id="when-to-use-tickerprovider-instead">When to use TickerProvider instead</h2>
        <ul>
          <li>
            <p>When you only need ticker functionality without a full application</p>
          </li>
          <li>
            <p>When you do not need the full PixiJS rendering context</p>
          </li>
          <li>
            <p>For lightweight ticker-based utilities only</p>
          </li>
        </ul>
        <h2 id="related-components">Related Components</h2>
        <ul>
          <li>
            <p>
              <a href={href("/components/pixi-canvas")}>
                <code>PixiCanvas</code>
              </a>{" "}
              - For rendering the actual canvas to the DOM
            </p>
          </li>
          <li>
            <p>
              <a href={href("/components/ticker-provider")}>
                <code>TickerProvider</code>
              </a>{" "}
              - For ticker functionality without a full application
            </p>
          </li>
        </ul>
        <h2 id="further-reading">Further reading</h2>
        <ul>
          <li>
            <p>
              <a href={href("/getting-started/application-instantiation")}>
                Getting started with PixiApplicationProvider
              </a>
            </p>
          </li>
          <li>
            <p>
              <a href="https://pixijs.com/8.x/guides/components/application">
                PixiJS Application documentation
              </a>
            </p>
          </li>
        </ul>
      </Searchable>
    </Article>
  );
}
