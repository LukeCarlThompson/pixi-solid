import type { JSX } from "@solidjs/web";

import { CodeBlock } from "../../components";
import { href } from "../../href";

export const route = {
  info: {
    label: "createTestContext",
    description: "Create mock PixiJS instances and a context provider for testing.",
    order: 4,
    sections: [
      { id: "simulating-resize", title: "Simulating resize" },
      { id: "spying-on-mocks", title: "Spying on mocks" },
      { id: "override-defaults", title: "Override defaults" },
      { id: "related", title: "Related" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <article class="ps-prose">
      <h1>createTestContext</h1>
      <p>
        Creates mock PixiJS instances and a context provider. Returns{" "}
        <code>
          {"{"} Provider, ticker, renderer, app, mount, renderHook {"}"}
        </code>
        .
      </p>
      <table>
        <thead>
          <tr>
            <th>Property</th>
            <th>Type</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>Provider</code>
            </td>
            <td>Component</td>
            <td>
              Wraps children in mock <code>PixiAppContext</code>, <code>TickerContext</code>,{" "}
              <code>ScreenStoreContext</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>ticker</code>
            </td>
            <td>
              <code>ManualTicker</code>
            </td>
            <td>
              Advance frames with <code>await fastForwardFrames()</code> or{" "}
              <code>await fastForwardTime()</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>renderer</code>
            </td>
            <td>
              <code>TestRenderer</code>
            </td>
            <td>
              Simulate resize events with <code>emitResize()</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>app</code>
            </td>
            <td>
              <code>Pixi.Application</code>
            </td>
            <td>
              Minimal stub for hooks that call <code>getPixiApp()</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>mount</code>
            </td>
            <td>
              <code>(setup) ={">"} MountSceneResult</code>
            </td>
            <td>
              <code>
                mountScene(setup, {"{"} wrapper: Provider {"}"})
              </code>{" "}
              — mounts a scene inside the mock contexts
            </td>
          </tr>
          <tr>
            <td>
              <code>renderHook</code>
            </td>
            <td>
              <code>(callback) ={">"} RenderHookResult</code>
            </td>
            <td>
              <code>
                renderHook(callback, {"{"} wrapper: Provider {"}"})
              </code>{" "}
              — runs hooks inside the mock contexts
            </td>
          </tr>
        </tbody>
      </table>
      <h2 id="simulating-resize">Simulating resize</h2>
      <p>
        <code>emitResize()</code> updates the mock screen and fires the renderer's listeners. Solid
        batches the resulting reactive writes, so call <code>flush()</code> before asserting:
      </p>
      <CodeBlock
        code={`import { flush } from "solid-js";

ctx.renderer.emitResize({ width: 1024 });
flush();

ctx.renderer.emitResize();`}
        title="tsx"
      />
      <h2 id="spying-on-mocks">Spying on mocks</h2>
      <CodeBlock
        code={`const addSpy = vi.spyOn(ctx.ticker.ticker, "add");
const resizeSpy = vi.spyOn(ctx.renderer, "addListener");`}
        title="tsx"
      />
      <h2 id="override-defaults">Override defaults</h2>
      <CodeBlock
        code={`const customTicker = createManualTicker();
vi.spyOn(customTicker.ticker, "add");
const ctx = createTestContext({ ticker: customTicker });`}
        title="tsx"
      />
      <h2 id="related">Related</h2>
      <ul>
        <li>
          <p>
            <a href={href("/testing/create-manual-ticker")}>
              <code>createManualTicker</code>
            </a>{" "}
            — create a stopped ticker with step-based advancement
          </p>
        </li>
        <li>
          <p>
            <a href={href("/testing/render-hook")}>
              <code>renderHook</code>
            </a>{" "}
            — run a hook or store in a temporary Solid root using this context
          </p>
        </li>
        <li>
          <p>
            <a href={href("/testing/mount-scene")}>
              <code>mountScene</code>
            </a>{" "}
            — render components in a temporary Solid root using this context
          </p>
        </li>
      </ul>
    </article>
  );
}
