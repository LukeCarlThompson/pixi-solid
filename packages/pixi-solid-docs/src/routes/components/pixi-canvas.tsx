import type { JSX } from "@solidjs/web";

import snippet1 from "../../code-examples/components-pixi-canvas-1.tsx?raw";
import { Article, CodeBlock, Searchable } from "../../components";
import { href } from "../../href";

export const route = {
  info: {
    label: "PixiCanvas",
    description: "A Solid.js component that renders a PixiJS application canvas.",
    order: 2,
    sections: [
      { id: "features", title: "Features" },
      { id: "usage", title: "Usage" },
      { id: "props", title: "Props" },
      { id: "examples", title: "Examples" },
      { id: "how-it-works", title: "How It Works" },
      { id: "when-to-use-it", title: "When to use it" },
      { id: "related-components", title: "Related Components" },
      { id: "further-reading", title: "Further reading" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <Article>
      <Searchable>
        <h1>PixiCanvas</h1>
        <p>
          The <code>PixiCanvas</code> component is the primary way to create a PixiJS application in
          a <code>pixi-solid</code> application. It handles creating and managing the HTML canvas
          element, the PixiJS Application instance, and provides context to child components for
          accessing the application and ticker.
        </p>
        <h2 id="features">Features</h2>
        <ul>
          <li>
            <p>
              Automatically creates and manages a <code>Pixi.Application</code> instance
            </p>
          </li>
          <li>
            <p>Wraps the canvas in a responsive container that automatically resizes</p>
          </li>
          <li>
            <p>
              Provides context for ticker-based utilities (<code>onTick</code>,{" "}
              <code>getTicker</code>, etc.)
            </p>
          </li>
          <li>
            <p>Accepts all standard PixiJS Application options as props</p>
          </li>
          <li>
            <p>
              Can be used standalone or with <code>PixiApplicationProvider</code> for more control
            </p>
          </li>
          <li>
            <p>
              Allows one <code>PixiCanvas</code> per <code>Pixi.Application</code> at a time; it can
              be unmounted and remounted
            </p>
          </li>
        </ul>
        <h2 id="usage">Usage</h2>
        <h3 id="simple-standalone-usage">Simple Standalone Usage</h3>
        <p>
          The simplest way to use <code>PixiCanvas</code> is standalone. It will automatically
          create and manage the Pixi Application for you:
        </p>
        <CodeBlock code={snippet1} title="tsx" />
        <h2 id="props">Props</h2>
        <p>
          <code>PixiCanvas</code> accepts Pixi application initialization options and a small set of
          wrapper props:
        </p>
        <ul>
          <li>
            <p>
              <code>style</code> — CSS styles for the wrapper <code>div</code>. Accepts a CSS object
              or a CSS string.
            </p>
          </li>
          <li>
            <p>
              <code>class</code> — Classes for the wrapper. Accepts a <code>JSX.ClassValue</code>,
              which can be a string, number, array, or object. Pass an object such as{" "}
              <code>
                class={"{"}
                {"{"} active: isActive() {"}"}
                {"}"}
              </code>{" "}
              for a reactive class map.
            </p>
          </li>
          <li>
            <p>
              <code>ref</code> — A{" "}
              <code>
                Ref{"<"}HTMLDivElement{">"}
              </code>{" "}
              that receives the wrapper <code>div</code>.
            </p>
          </li>
        </ul>
        <h3 id="pixijs-application-options">PixiJS Application Options</h3>
        <p>
          Application options initialize an app created by <code>PixiCanvas</code>. If it uses an
          app from a surrounding <code>PixiApplicationProvider</code>, these options are ignored and
          pixi-solid warns in development. Put initialization options on the app-owning provider.
        </p>
        <p>
          Any valid <code>Pixi.ApplicationOptions</code> property except <code>children</code> and{" "}
          <code>resizeTo</code> (managed by pixi-solid):
        </p>
        <ul>
          <li>
            <p>
              <code>background</code> - Background color (hex or CSS color)
            </p>
          </li>
          <li>
            <p>
              <code>antialias</code> - Enable antialiasing
            </p>
          </li>
          <li>
            <p>
              <code>resolution</code> - Canvas resolution
            </p>
          </li>
          <li>
            <p>
              <code>width</code> / <code>height</code> - Canvas dimensions (if not using CSS)
            </p>
          </li>
          <li>
            <p>
              <code>preserveDrawingBuffer</code> - Preserve the drawing buffer
            </p>
          </li>
          <li>
            <p>And many more...</p>
          </li>
        </ul>
        <p>
          See the <a href="https://pixijs.com/8.x/guides/components/application">PixiJS docs</a> for
          the complete list of options.
        </p>
        <h3 id="special-props">Special Props</h3>
        <ul>
          <li>
            <p>
              <code>children</code> - The pixi-solid components to render inside the canvas
              (required)
            </p>
          </li>
        </ul>
        <h2 id="examples">Examples</h2>
        <h3 id="responsive-canvas-with-background">Responsive Canvas with Background</h3>
        <CodeBlock
          code={`<PixiCanvas style={{ width: "100%", height: "100vh" }} background="#1099bb" antialias={true}>
  <MyContent />
</PixiCanvas>;`}
          title="tsx"
        />
        <h3 id="canvas-with-custom-resolution">Canvas with Custom Resolution</h3>
        <CodeBlock
          code={`<PixiCanvas style={{ width: "800px", height: "600px" }} resolution={2}>
  <MyContent />
</PixiCanvas>;`}
          title="tsx"
        />
        <p>
          Other DOM attributes and event handlers belong on a caller-owned parent element;{" "}
          <code>PixiCanvas</code> does not forward them.
        </p>
        <h2 id="how-it-works">How It Works</h2>
        <ol>
          <li>
            <p>
              Creates an internal wrapper{" "}
              <code>
                {"<"}div{">"}
              </code>{" "}
              element with the provided <code>class</code>, <code>style</code>, and <code>ref</code>
            </p>
          </li>
          <li>
            <p>
              Automatically creates a <code>Pixi.Application</code> instance with the provided
              options
            </p>
          </li>
          <li>
            <p>Mounts the Pixi canvas into the internal wrapper div</p>
          </li>
          <li>
            <p>
              Sets up automatic resizing based on the internal wrapper div's size (not only the
              window size)
            </p>
          </li>
          <li>
            <p>Provides context to child components for accessing the application and ticker</p>
          </li>
          <li>
            <p>Cleans up the application when the component unmounts</p>
          </li>
        </ol>
        <h2 id="when-to-use-it">When to use it</h2>
        <ul>
          <li>
            <p>For all basic PixiJS applications in Pixi Solid</p>
          </li>
          <li>
            <p>When you want the simplest possible setup</p>
          </li>
          <li>
            <p>When you do not need to share the application with external HTML components</p>
          </li>
        </ul>
        <h2 id="related-components">Related Components</h2>
        <ul>
          <li>
            <p>
              <a href={href("/components/pixi-application-provider")}>
                <code>PixiApplicationProvider</code>
              </a>{" "}
              - When you need HTML components outside the canvas to access pixi-solid hooks
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
                Getting started with PixiCanvas
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
