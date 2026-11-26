import type { JSX } from "@solidjs/web";

import { CodeBlock } from "../../components/molecules/CodeBlock";
import { href } from "../../href";

export const route = {
  info: {
    label: "Overview",
    description: "Utilities for testing pixi-solid components and hooks without a live canvas.",
    order: 1,
    sections: [
      { id: "api-quick-reference", title: "API quick reference" },
      { id: "when-to-use-which", title: "When to use which" },
      { id: "jsdom-renderer-caveats", title: "jsdom / renderer caveats" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <article class="ps-prose">
      <h1>Overview</h1>
      <p>
        The <code>pixi-solid/testing</code> module provides utilities for testing pixi-solid
        components and hooks without a live canvas:
      </p>
      <CodeBlock
        code={`import {
  mountScene,
  renderHook,
  createTestContext,
  createManualTicker,
  getByLabel,
  queryByLabel,
  getAllByLabel,
  cleanup,
} from "pixi-solid/testing";`}
        title="tsx"
      />
      <hr />
      <h2 id="api-quick-reference">API quick reference</h2>
      <CodeBlock
        code={`// Component tests — renders a Pixi display object
mountScene(() => <Container>...</Container>);
// => { container, getByLabel, queryByLabel, getAllByLabel, dispose }

// Hook/store tests — no scene rendering
renderHook(() => usePixiScreen(), { wrapper: ctx.Provider });
// => { result: Accessor<Screen>, dispose: () => void }

// Mock contexts
createTestContext();
// => { Provider, ticker, renderer, app, mount, renderHook }

// Manual frame advancement (both drivers are async)
createManualTicker();
// => { ticker: Pixi.Ticker, fastForwardFrames(), fastForwardTime() }

// Scene graph queries, bound to the mounted root
getByLabel("label"); // throws if not found
queryByLabel("label"); // returns undefined if not found
getAllByLabel("label"); // returns Pixi.Container[]

// Teardown (wire in afterEach)
cleanup();`}
        title="tsx"
      />
      <hr />
      <h2 id="when-to-use-which">When to use which</h2>
      <table>
        <thead>
          <tr>
            <th>Task</th>
            <th>Function</th>
            <th>Page</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Render a component scene graph</td>
            <td>
              <code>mountScene</code>
            </td>
            <td>
              <a href={href("/testing/mount-scene")}>mount-scene</a>
            </td>
          </tr>
          <tr>
            <td>Test a hook or store (no scene needed)</td>
            <td>
              <code>renderHook</code>
            </td>
            <td>
              <a href={href("/testing/render-hook")}>render-hook</a>
            </td>
          </tr>
          <tr>
            <td>Get mock contexts</td>
            <td>
              <code>createTestContext</code>
            </td>
            <td>
              <a href={href("/testing/create-test-context")}>create-test-context</a>
            </td>
          </tr>
          <tr>
            <td>Advance frames manually</td>
            <td>
              <code>createManualTicker</code>
            </td>
            <td>
              <a href={href("/testing/create-manual-ticker")}>create-manual-ticker</a>
            </td>
          </tr>
          <tr>
            <td>Find a node by label</td>
            <td>
              <code>getByLabel</code> / <code>queryByLabel</code> / <code>getAllByLabel</code>
            </td>
            <td>
              <a href={href("/testing/scene-queries")}>scene-queries</a>
            </td>
          </tr>
          <tr>
            <td>Run all disposers</td>
            <td>
              <code>cleanup</code>
            </td>
            <td>
              <a href={href("/testing/cleanup")}>cleanup</a>
            </td>
          </tr>
        </tbody>
      </table>
      <hr />
      <h2 id="jsdom-renderer-caveats">jsdom / renderer caveats</h2>
      <ul>
        <li>
          <p>
            <strong>Pixel-level rendering is not tested</strong> — use a real canvas for integration
            tests.
          </p>
        </li>
        <li>
          <p>
            <strong>
              <code>getContext()</code> is not available
            </strong>{" "}
            — you will see <code>Not implemented: HTMLCanvasElement's getContext()</code> warnings
            in test output. These warnings are normal and safe.
          </p>
        </li>
        <li>
          <p>
            <strong>
              The mock <code>app</code> is a minimal stub
            </strong>{" "}
            — it implements only the parts that pixi-solid hooks use.
          </p>
        </li>
      </ul>
    </article>
  );
}
