import type { JSX } from "@solidjs/web";

import { Aside, CodeBlock } from "../../components";
import { href } from "../../href";

export const route = {
  info: {
    label: "renderHook",
    description:
      "Run a hook or store in a temporary Solid root — optionally inside a provider — for testing logic that needs context but does not render a scene.",
    order: 3,
    sections: [
      { id: "testing-hooks-with-context", title: "Testing hooks with context" },
      {
        id: "testing-stores-that-use-hooks-internally",
        title: "Testing stores that use hooks internally",
      },
      { id: "reactivity", title: "Reactivity" },
      { id: "error-testing", title: "Error testing" },
      { id: "when-to-use", title: "When to use" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <article class="ps-prose">
      <h1>renderHook</h1>
      <p>
        <code>renderHook()</code> is for testing <strong>stores, hooks, or any logic</strong> that
        has signals inside or requires context but does <strong>not</strong> render a scene. It runs
        the callback <strong>once</strong> in a temporary Solid root, optionally inside a{" "}
        <code>wrapper</code> component (e.g. <code>ctx.Provider</code>), and exposes the return
        value as an accessor.
      </p>
      <CodeBlock
        code={`type RenderHookResult<T> = {
  result: Accessor<T>; // call result() to read the current value
  dispose: () => void;
};`}
        title="tsx"
      />
      <p>
        The callback runs once inside the wrapper, and it does <strong>not</strong> re-run when
        reactive values change. Hooks that register side effects (<code>onTick</code>,{" "}
        <code>onResize</code>) are cleaned up on <code>dispose</code>. To observe updates, return a
        reactive value from the callback (an accessor or a store) and read it through{" "}
        <code>result()</code>.
      </p>
      <h2 id="testing-hooks-with-context">Testing hooks with context</h2>
      <p>
        Hooks like <code>usePixiScreen</code> require a provider. Pass <code>ctx.Provider</code> as
        the wrapper:
      </p>
      <CodeBlock
        code={`import { usePixiScreen } from "pixi-solid";
import { renderHook, createTestContext } from "pixi-solid/testing";

const ctx = createTestContext();

const { result } = renderHook(() => usePixiScreen(), {
  wrapper: ctx.Provider,
});

expect(result().width).toBe(800);
expect(result().height).toBe(600);`}
        title="tsx"
      />
      <p>
        Or use the <code>ctx.renderHook</code> convenience method — the mock <code>Provider</code>{" "}
        is applied automatically:
      </p>
      <CodeBlock
        code={`const ctx = createTestContext();

const { result } = ctx.renderHook(() => usePixiScreen());

expect(result().width).toBe(800);`}
        title="tsx"
      />
      <h2 id="testing-stores-that-use-hooks-internally">
        Testing stores that use hooks internally
      </h2>
      <p>
        Return a reactive store object, then read through <code>result()</code>:
      </p>
      <CodeBlock
        code={`const ctx = createTestContext();

const { result } = ctx.renderHook(() => createClockStore()); // uses onTick internally

expect(result().time).toBe(0);

// The driver methods are async, so always await them
await ctx.ticker.fastForwardFrames(3);
expect(result().time).toBe(48);`}
        title="tsx"
      />
      <h2 id="reactivity">Reactivity</h2>
      <p>
        The callback runs once, so <code>result</code> does not re-evaluate on its own. Return a
        reactive value from the callback and read it through <code>result()</code> to observe
        updates. Solid batches reactive writes and flushes them on a microtask, so call{" "}
        <code>flush()</code> before asserting:
      </p>
      <CodeBlock
        code={`import { flush } from "solid-js";

const ctx = createTestContext();

const { result } = ctx.renderHook(() => usePixiScreen());
expect(result().width).toBe(800);

ctx.renderer.emitResize({ width: 1024 });
flush();

expect(result().width).toBe(1024);`}
        title="tsx"
      />
      <Aside>
        <p>
          <strong>Tip:</strong> return stable reactive objects (stores, screen dimensions) rather
          than deriving primitives inside the callback. A derived primitive is read only once, so
          later changes would not be visible through <code>result()</code>.
        </p>
      </Aside>
      <h2 id="error-testing">Error testing</h2>
      <p>
        Errors surface eagerly at <code>renderHook()</code> call time, so missing-context tests read
        cleanly:
      </p>
      <CodeBlock code={`expect(() => renderHook(() => usePixiScreen())).toThrow();`} title="tsx" />
      <h2 id="when-to-use">When to use</h2>
      <ul>
        <li>
          <p>Testing stores or hooks that have signals inside</p>
        </li>
        <li>
          <p>
            Testing logic that requires context (<code>usePixiScreen</code>, <code>getPixiApp</code>
            , etc.) but does not render a scene
          </p>
        </li>
        <li>
          <p>Error testing for missing context</p>
        </li>
      </ul>
      <p>
        For testing view components that render a Pixi display object, use{" "}
        <a href={href("/testing/mount-scene")}>
          <code>mountScene</code>
        </a>{" "}
        instead.
      </p>
    </article>
  );
}
