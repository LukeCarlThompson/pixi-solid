import type { JSX } from "@solidjs/web";

import { CodeBlock } from "../../components/molecules/CodeBlock";

export const route = {
  info: {
    label: "cleanup",
    description: "Run all registered disposers for test teardown.",
    order: 7,
    sections: [],
  },
};

export default function Page(): JSX.Element {
  return (
    <article class="ps-prose">
      <h1>cleanup</h1>
      <p>
        All disposers created by <code>mountScene</code> and <code>renderHook</code> are registered
        with a global registry. Wire <code>cleanup()</code> into your test framework's lifecycle to
        run them automatically:
      </p>
      <CodeBlock
        code={`import { cleanup } from "pixi-solid/testing";
import { afterEach } from "vitest";

afterEach(() => cleanup());`}
        title="tsx"
      />
      <p>
        <code>cleanup()</code> disposes every registered root{" "}
        <strong>and clears Solid's error halt</strong>. Solid stops the whole reactive system after
        an uncaught error. Without the reset, one test that throws on purpose would break every
        later test in the file.
      </p>
      <p>
        Once wired, you no longer need to track <code>dispose</code>:
      </p>
      <CodeBlock
        code={`it("some test", () => {
  mountScene(() => <Container label="root" />);
  // cleanup runs automatically in afterEach
});`}
        title="tsx"
      />
      <p>
        To unmount before the end of a test, call <code>dispose()</code> directly. It unregisters
        that root, so later global cleanup will not dispose it twice:
      </p>
      <CodeBlock
        code={`const { dispose } = mountScene(() => <Container />);
// ... test logic ...
dispose();`}
        title="tsx"
      />
    </article>
  );
}
