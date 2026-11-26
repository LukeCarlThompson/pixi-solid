import type { JSX } from "@solidjs/web";

import { Aside } from "../../components/molecules/Aside";
import { CodeBlock } from "../../components/molecules/CodeBlock";
import { href } from "../../href";

export const route = {
  info: {
    label: "createManualTicker",
    description: "Create a stopped ticker with step-based frame advancement for testing.",
    order: 5,
    sections: [
      { id: "fastforwardframes", title: "fastForwardFrames()" },
      { id: "fastforwardtime", title: "fastForwardTime()" },
      { id: "related", title: "Related" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <article class="ps-prose">
      <h1>createManualTicker</h1>
      <p>Creates a stopped PixiJS ticker with step-based frame advancement methods.</p>
      <CodeBlock
        code={`type ManualTicker = {
  ticker: Ticker;
  fastForwardFrames(frames: number, deltaTime?: number): Promise<void>;
  fastForwardTime(totalTimeMS: number, stepSizeMS?: number): Promise<void>;
};`}
        title="tsx"
      />
      <p>
        The driver methods are <strong>async</strong> — always <code>await</code> them. They own a
        monotonic absolute clock, so successive calls are exactly additive (no dropped first frame),
        and they flush microtasks after every tick so promise-based continuations (awaited{" "}
        <code>createAsyncDelay</code>, animation <code>onEnded</code> chains) receive subsequent
        ticks.
      </p>
      <h2 id="fastforwardframes">fastForwardFrames()</h2>
      <p>
        Advance a specific number of frames, each with an optional delta time (defaults to 16ms).
      </p>
      <CodeBlock
        code={`const manual = createManualTicker();
let calls = 0;
manual.ticker.add(() => {
  calls++;
});

await manual.fastForwardFrames(10); // 10 frames at 16ms each
await manual.fastForwardFrames(5, 33); // 5 frames at 33ms each (~30fps)
expect(calls).toBe(15);`}
        title="tsx"
      />
      <h2 id="fastforwardtime">fastForwardTime()</h2>
      <p>
        Advance frames to simulate a total elapsed time, splitting it into steps of a given size
        (defaults to ~16ms).
      </p>
      <CodeBlock
        code={`await manual.fastForwardTime(1000); // 1 second in ~16ms steps
await manual.fastForwardTime(500, 50); // 500ms in 50ms steps`}
        title="tsx"
      />
      <Aside tone="note">
        The returned <code>ticker</code> wraps a real PixiJS <code>Ticker</code>, so the same
        defaults apply (e.g. per-step deltas are capped at 100ms via the default{" "}
        <code>minFPS = 10</code>) and can be overridden on the instance after creation — e.g.{" "}
        <code>ticker.ticker.minFPS = 4</code> to allow larger step deltas.
      </Aside>
      <Aside tone="note">
        Step-based advancement avoids the footgun of large single-frame deltas that can break
        spring, smooth-damp, or sequenced animations.
      </Aside>
      <h2 id="related">Related</h2>
      <ul>
        <li>
          <p>
            <a href={href("/testing/create-test-context")}>
              <code>createTestContext</code>
            </a>{" "}
            — creates mock context that includes a <code>ManualTicker</code>
          </p>
        </li>
      </ul>
    </article>
  );
}
