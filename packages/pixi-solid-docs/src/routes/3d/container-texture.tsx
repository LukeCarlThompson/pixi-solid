import type { JSX } from "@solidjs/web";
import { clientOnly } from "@solidjs/web";

import snippet1 from "../../code-examples/3d-container-texture-1.tsx?raw";
import snippet3 from "../../code-examples/3d-container-texture-3.tsx?raw";
import { Article, CodeBlock, DemoSection, Searchable, Table } from "../../components";
import demoCode from "../../demos/container-texture.demo.tsx?raw";

const ContainerTextureDemo = clientOnly(() => import("../../demos/container-texture.demo"), {
  export: "Demo",
});

export const route = {
  info: {
    label: "2D Content on a 3D Surface",
    description:
      "Rendering pixi-solid 2D scenes into 3D materials with createContainerTexture in pixi-solid-3d.",
    order: 100,
    sections: [
      { id: "building-a-texture", title: "Building a texture" },
      { id: "options", title: "Options" },
      { id: "reactivity", title: "Reactivity" },
      { id: "rendering-only-when-it-changes", title: "Rendering only when it changes" },
      { id: "orientation", title: "Orientation" },
      { id: "cleanup", title: "Cleanup" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <Article>
      <Searchable>
        <h1>2D Content on a 3D Surface</h1>
        <p>
          A 3D material can sample any texture, including one showing live 2D content. Use it for
          in-world screens, signs, labels, scoreboards, or UI panels attached to a model.
        </p>
        <p>
          <code>@pixi/3d</code> ships <code>ContainerTexture</code> for this, but using it directly
          has three sharp edges. Pose the renderer, remember that its <code>autoUpdate</code> runs
          on <code>Ticker.shared</code> rather than the ticker your app runs, and free the render
          target yourself. <code>createContainerTexture</code> handles all three.
        </p>
        <p>A live 2D panel on a 3D surface. The uptime and draw-call lines update every frame:</p>
        <DemoSection title="container-texture">
          <ContainerTextureDemo fallback={<span />} />
        </DemoSection>
        <CodeBlock code={demoCode} title="container-texture.demo.tsx" />
        <h2 id="building-a-texture">Building a texture</h2>
        <p>
          The hook takes pixi-solid JSX and returns a texture. The JSX arrives already filled with
          its children, because the parent component binds them:
        </p>
        <CodeBlock code={snippet1} title="tsx" />
        <p>
          The hook must run inside a{" "}
          <code>
            {"<"}PixiCanvas{">"}
          </code>{" "}
          or{" "}
          <code>
            {"<"}PixiApplicationProvider{">"}
          </code>
          , because it reads the renderer and the ticker from context. It throws a clear error if
          neither is present.
        </p>
        <p>
          Two constraints come from <code>ContainerTexture</code> itself:
        </p>
        <ul>
          <li>
            <p>
              It draws <strong>one</strong> container, so wrap several roots in a{" "}
              <code>
                {"<"}Container{">"}
              </code>
              .
            </p>
          </li>
          <li>
            <p>
              The container is built once. Structure inside it (
              <code>
                {"<"}Show{">"}
              </code>
              ,{" "}
              <code>
                {"<"}For{">"}
              </code>
              ) stays reactive; replacing the whole tree needs a new texture.
            </p>
          </li>
        </ul>
        <h2 id="options">Options</h2>
        <Table>
          <thead>
            <tr>
              <th>Option</th>
              <th>Default</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>width</code> / <code>height</code>
              </td>
              <td>content bounds</td>
              <td>Pass both for text, whose bounds settle after its first layout</td>
            </tr>
            <tr>
              <td>
                <code>resolution</code>
              </td>
              <td>
                <code>1</code>
              </td>
              <td>Raise it for content shown close to the camera</td>
            </tr>
            <tr>
              <td>
                <code>antialias</code>
              </td>
              <td>
                <code>false</code>
              </td>
              <td>Smooths scaled content</td>
            </tr>
            <tr>
              <td>
                <code>clearColor</code>
              </td>
              <td>transparent</td>
              <td>What shows where the content does not cover</td>
            </tr>
            <tr>
              <td>
                <code>autoUpdate</code>
              </td>
              <td>
                <code>true</code>
              </td>
              <td>Re-render every frame from the ticker in scope</td>
            </tr>
          </tbody>
        </Table>
        <h2 id="reactivity">Reactivity</h2>
        <p>
          <strong>
            You do not call <code>render()</code>.
          </strong>{" "}
          Content updates are drawn on the next frame, because <code>autoUpdate</code>
          defaults to <code>true</code>.
        </p>
        <p>
          The content is mounted once, like any JSX tree, so internal structure stays reactive while
          the top-level tree does not rebuild:
        </p>
        <CodeBlock
          code={`const [score, setScore] = createSignal(0);

const board = createContainerTexture(<Text text={\`Score: \${score()}\`} />, {
  width: 256,
  height: 64,
});`}
          title="tsx"
        />
        <p>
          <code>score()</code> changing updates the text, and the next frame draws it. Swapping the
          entire tree needs a new texture.
        </p>
        <h2 id="rendering-only-when-it-changes">Rendering only when it changes</h2>
        <p>
          Re-rendering costs one pass over the content every frame. For a texture that changes once
          a minute, such as a clock or a scoreboard nobody is looking at, turn the loop off and
          render on demand:
        </p>
        <CodeBlock code={snippet3} title="tsx" />
        <p>
          <code>defer: true</code> skips the initial run, since the texture was drawn when it was
          built. This is an optimisation, not the normal path: leave <code>autoUpdate</code> on
          until a profile suggests otherwise.
        </p>
        <h2 id="orientation">Orientation</h2>
        <p>
          The image is stored the other way up from an image texture. It shows upright on a default
          <code>PlaneGeometry</code> or the sides of a <code>CubeGeometry</code>, and upside down
          where an image would be upright: a<code>SphereGeometry</code>, a plane with{" "}
          <code>flipV</code>, a loaded model, or a 2D <code>Sprite</code>. On those, flip the object
          that shows it:
        </p>
        <CodeBlock
          code={`sprite.scale.y = -1;
sprite.anchor.y = 1;`}
          title="tsx"
        />
        <h2 id="cleanup">Cleanup</h2>
        <p>
          The hook destroys the render target when its component unmounts, and leaves your content
          alone, since those components clean up after themselves. If you need the texture to
          outlive the component, use
          <code>new ContainerTexture(...)</code> directly and drive it yourself.
        </p>
      </Searchable>
    </Article>
  );
}
