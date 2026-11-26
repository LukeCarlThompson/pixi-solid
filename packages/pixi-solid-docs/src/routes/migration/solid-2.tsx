import type { JSX } from "@solidjs/web";

import { Aside, CodeBlock } from "../../components";
import { href } from "../../href";

export const route = {
  info: {
    label: "Migrating to Solid 2",
    description: "Upgrade a pixi-solid 1 project to pixi-solid 2 and SolidJS 2.",
    order: 1,
    sections: [
      { id: "upgrade-the-packages", title: "Upgrade the packages" },
      { id: "update-the-import-paths", title: "Update the import paths" },
      { id: "renamed-and-removed-apis", title: "Renamed and removed APIs" },
      { id: "effects-are-split", title: "Effects are split" },
      { id: "async-work-and-loading", title: "Async work and <Loading>" },
      { id: "reactive-writes-are-batched", title: "Reactive writes are batched" },
      { id: "pixi-solid-api-changes", title: "pixi-solid API changes" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <article class="ps-prose">
      <h1>Migrating to Solid 2</h1>
      <p>
        <code>pixi-solid</code> 2 requires SolidJS 2. Component, hook, and utility names stay the
        same. Almost all of the work is in the SolidJS APIs around them.
      </p>
      <p>
        SolidJS publishes a{" "}
        <a href="https://github.com/solidjs/solid/blob/next/documentation/solid-2.0/MIGRATION.md">
          complete migration guide
        </a>
        . Read that for the full list. This page covers the parts that meet a pixi-solid project,
        and the changes to <code>pixi-solid</code> itself.
      </p>
      <h2 id="upgrade-the-packages">Upgrade the packages</h2>
      <p>Install SolidJS 2 and its web renderer, then add the compiler plugin:</p>
      <CodeBlock
        code={`npm i solid-js@2.0.1 @solidjs/web@2.0.1
npm i -D @solidjs/vite-plugin@3.0.0-next.35`}
        title="bash"
      />
      <p>
        <code>pixi-solid</code> declares all three as peers. The supported range for{" "}
        <code>solid-js</code> and <code>@solidjs/web</code> is{" "}
        <code>
          {">"}=2.0.0 {"<"}3
        </code>
        .
      </p>
      <p>
        The compiler must use <code>@solidjs/web</code> as the JSX renderer. See{" "}
        <a href={href("/getting-started/project-setup")}>Project setup</a> for the{" "}
        <code>tsconfig.json</code> and Vite settings.
      </p>
      <h2 id="update-the-import-paths">Update the import paths</h2>
      <p>
        <code>solid-js</code> no longer owns the JSX types or the store helpers.
      </p>
      <table>
        <thead>
          <tr>
            <th>Import</th>
            <th>Solid 1 path</th>
            <th>Solid 2 path</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>render</code>, <code>hydrate</code>, and the DOM helpers
            </td>
            <td>
              <code>solid-js/web</code>
            </td>
            <td>
              <code>@solidjs/web</code>
            </td>
          </tr>
          <tr>
            <td>
              The <code>JSX</code> types
            </td>
            <td>
              <code>solid-js</code>
            </td>
            <td>
              <code>@solidjs/web</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>createStore</code> and the store helpers
            </td>
            <td>
              <code>solid-js/store</code>
            </td>
            <td>
              <code>solid-js</code>
            </td>
          </tr>
        </tbody>
      </table>
      <h2 id="renamed-and-removed-apis">Renamed and removed APIs</h2>
      <p>
        These are the ones that turn up in a pixi-solid scene. The SolidJS guide covers the rest.
      </p>
      <table>
        <thead>
          <tr>
            <th>Solid 1</th>
            <th>Solid 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>onMount</code>
            </td>
            <td>
              <code>onSettled</code>, which can return a cleanup function
            </td>
          </tr>
          <tr>
            <td>
              <code>splitProps</code>
            </td>
            <td>
              <code>omit</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>mergeProps</code>
            </td>
            <td>
              <code>merge</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>classList</code>
            </td>
            <td>
              <code>class</code> with an object or array value
            </td>
          </tr>
          <tr>
            <td>
              <code>Suspense</code>
            </td>
            <td>
              <code>Loading</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>ErrorBoundary</code>
            </td>
            <td>
              <code>Errored</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>Index</code>
            </td>
            <td>
              <code>
                {"<"}For keyed={"{"}false{"}"}
                {">"}
              </code>
            </td>
          </tr>
          <tr>
            <td>
              <code>createMutable</code>
            </td>
            <td>
              <code>createStore</code> with draft setters
            </td>
          </tr>
          <tr>
            <td>
              <code>createSelector</code>
            </td>
            <td>
              <code>createProjection</code>, or <code>createStore(fn)</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>batch</code>
            </td>
            <td>
              Writes batch on their own. Call <code>flush()</code> to apply them
            </td>
          </tr>
          <tr>
            <td>
              <code>createResource</code>
            </td>
            <td>
              An async computation read inside{" "}
              <code>
                {"<"}Loading{">"}
              </code>
            </td>
          </tr>
          <tr>
            <td>
              <code>startTransition</code>, <code>useTransition</code>
            </td>
            <td>
              Built-in transitions with <code>isPending</code> and{" "}
              <code>
                {"<"}Loading{">"}
              </code>
            </td>
          </tr>
          <tr>
            <td>
              <code>Context.Provider</code>
            </td>
            <td>Use the context directly as the provider</td>
          </tr>
        </tbody>
      </table>
      <p>
        <code>createDeferred</code> is removed with no replacement.
      </p>
      <h2 id="effects-are-split">Effects are split</h2>
      <p>
        <code>createEffect</code> and <code>createRenderEffect</code> take a compute function and an
        effect function. The compute returns the value that the effect receives, and it is the only
        part that tracks. This is the pattern for binding a signal to a PixiJS class property:
      </p>
      <CodeBlock
        code={`// Solid 1
createEffect(() => {
  blurFilter.strength = blurAmount();
});

// Solid 2
createEffect(
  () => blurAmount(),
  (amount) => {
    blurFilter.strength = amount;
  },
);`}
        title="tsx"
      />
      <h2 id="async-work-and-loading">
        Async work and{" "}
        <code>
          {"<"}Loading{">"}
        </code>
      </h2>
      <p>
        Async work is a computation that returns a Promise. Create it with <code>createMemo</code>{" "}
        and read it inside a{" "}
        <code>
          {"<"}Loading{">"}
        </code>{" "}
        boundary:
      </p>
      <CodeBlock
        code={`const texture = createMemo(async () => Assets.load<Pixi.Texture>("/sprite.png"));

<PixiCanvas>
  <Loading>
    <Sprite texture={texture()} />
  </Loading>
</PixiCanvas>;`}
        title="tsx"
      />
      <Aside tone="warning">
        <p>
          A{" "}
          <code>
            {"<"}Loading{">"}
          </code>{" "}
          boundary covers its whole subtree and catches a pending read from any descendant. Place it
          around the smallest group that should wait.
        </p>
        <p>
          The <code>fallback</code> is optional and replaces the children, so it sits wherever the
          boundary sits. Inside a Pixi tree the fallback must be a Pixi element, and a DOM element
          in that position throws <code>InvalidChildTypeError</code>. Put the boundary above the
          canvas to use a DOM fallback.
        </p>
      </Aside>
      <p>
        See <a href={href("/asset-loading/individual-assets")}>Asset loading</a> and{" "}
        <a href={href("/asset-loading/asset-manifest")}>Asset manifests</a> for the two loading
        patterns.
      </p>
      <h2 id="reactive-writes-are-batched">Reactive writes are batched</h2>
      <p>
        A signal write does not change what a read returns until the batch flushes. Call{" "}
        <code>flush()</code> before you assert:
      </p>
      <CodeBlock
        code={`setCount(1);
flush();

expect(count()).toBe(1);`}
        title="tsx"
      />
      <p>
        The testing helpers rely on this behavior. See{" "}
        <a href={href("/testing/overview")}>Testing</a>.
      </p>
      <h2 id="pixi-solid-api-changes">pixi-solid API changes</h2>
      <table>
        <thead>
          <tr>
            <th>Solid 1</th>
            <th>Solid 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>
                {"<"}PixiCanvas classList={"{"}
                {"{"} active: true {"}"}
                {"}"}
                {">"}
              </code>
            </td>
            <td>
              <code>
                {"<"}PixiCanvas class={"{"}
                {"{"} active: true {"}"}
                {"}"}
                {">"}
              </code>
            </td>
          </tr>
        </tbody>
      </table>
      <ul>
        <li>
          <p>
            <code>class</code> accepts a <code>JSX.ClassValue</code>, so an object or array replaces
            the removed <code>classList</code> prop.
          </p>
        </li>
        <li>
          <p>
            <code>ref</code> accepts a Solid{" "}
            <code>
              Ref{"<"}HTMLDivElement{">"}
            </code>
            . The callback form still works. A variable and an array of callbacks also typecheck
            now. The Solid compiler turns a variable into a callback that assigns to it, so the
            runtime only ever receives callbacks.
          </p>
        </li>
        <li>
          <p>
            <code>createTestContext</code> returns a <code>mount</code> helper that applies the test
            providers.
          </p>
        </li>
        <li>
          <p>
            <code>mountScene</code> and <code>renderHook</code> accept an options object with an
            optional <code>wrapper</code>.
          </p>
        </li>
        <li>
          <p>
            <code>renderHook</code> calls its callback once. <code>result()</code> returns the value
            from that call.
          </p>
        </li>
        <li>
          <p>
            <code>cleanup</code> resets the Solid error halt in addition to unmounting.
          </p>
        </li>
        <li>
          <p>
            <code>PIXI_SOLID_EVENT_HANDLER_NAMES</code> is available from the root exports.
          </p>
        </li>
      </ul>
      <h3 id="ref-callbacks">Ref callbacks</h3>
      <p>
        A ref callback is no longer a place for reactive work. In <code>pixi-solid</code> 1 it ran
        inside the component's owner, and it re-ran whenever a prop it read changed. It now runs
        without an owner, and it runs once.
      </p>
      <p>
        <strong>It has no owner.</strong> <code>onCleanup</code> inside a ref callback never runs,
        an effect created inside one never disposes, and <code>useContext</code> inside one throws,
        because a context read needs an owner. Move that work into <code>onSettled</code> in the
        component body, which runs after the ref has been assigned, and return a cleanup function:
      </p>
      <CodeBlock
        code={`let sprite: Pixi.Sprite | undefined;

onSettled(() => {
  const onDown = () => {
    // handle the press
  };

  sprite?.on("pointerdown", onDown);

  return () => sprite?.off("pointerdown", onDown);
});

return <Sprite ref={sprite} texture={texture} />;`}
        title="tsx"
      />
      <p>
        The <code>PixiCanvas</code> <code>ref</code> receives a DOM element, and SolidJS clears the
        owner for DOM refs for the same reason, so the same rule applies there.
      </p>
      <p>
        <strong>It runs once.</strong> In <code>pixi-solid</code> 1 a ref callback re-ran whenever a
        prop it read changed, so a drawing command followed a signal. Use the <code>draw</code> prop
        instead:
      </p>
      <CodeBlock
        code={`// pixi-solid 1 — redraws whenever \`size\` changes
<Graphics
  ref={(g) => {
    g.rect(50, 50, size(), size()).fill(0xff0000);
  }}
/>;

// pixi-solid 2 — \`draw\` clears and redraws whenever its reads change
<Graphics draw={(g) => g.rect(50, 50, size(), size()).fill(0xff0000)} />;`}
        title="tsx"
      />
      <p>
        For any other component, move the read into a split effect: the compute function tracks the
        read, and the apply function calls into the instance. Reach for this when the value has no
        matching prop, such as <code>AnimatedSprite</code>'s <code>playing</code>, which is a getter
        with no setter. Passing it as a prop throws.
      </p>
      <CodeBlock
        code={`// pixi-solid 1 — the ref re-ran and started or stopped playback
<AnimatedSprite
  ref={(sprite) => {
    if (isPlaying()) sprite.play();
    else sprite.stop();
  }}
  textures={textures}
/>;

// pixi-solid 2 — capture the instance, and drive it from a split effect
let animation: Pixi.AnimatedSprite | undefined;

createEffect(
  () => isPlaying(),
  (playing) => {
    if (playing) animation?.play();
    else animation?.stop();
  },
);

return <AnimatedSprite ref={animation} textures={textures} />;`}
        title="tsx"
      />
      <p>
        Most PixiJS state does have a prop, and pixi-solid binds those props reactively.{" "}
        <code>
          {"<"}Sprite tint={"{"}tint(){"}"} /{">"}
        </code>{" "}
        needs no effect at all. A read left inside a ref callback also reports{" "}
        <code>[STRICT_READ_UNTRACKED]</code> in development.
      </p>
    </article>
  );
}
