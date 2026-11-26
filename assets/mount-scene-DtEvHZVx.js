import{J as e,L as t,M as n,a as r,d as i,ht as a,p as o}from"./web-BTd9NawZ.js";import{c as s,i as c,o as l,u}from"./components-BiYutFnA.js";var d=`import { Container, Sprite } from "pixi-solid";
import { mountScene } from "pixi-solid/testing";
import { expect } from "vitest";

const { container, getByLabel, dispose } = mountScene(() => (
  <Container label="scene">
    <Sprite label="player" x={100} />
  </Container>
));

// Container is Pixi.Container — directly accessible
expect(container.label).toBe("scene");

// The bound query helper searches from the current root
expect(getByLabel("player").x).toBe(100);

dispose();
`,f=`import { Container, onTick, Sprite } from "pixi-solid";
import { createTestContext } from "pixi-solid/testing";
import { expect } from "vitest";

const ctx = createTestContext();
let calls = 0;

const TickerCounter = () => {
  onTick(() => {
    calls++;
  });
  return <Sprite x={100} />;
};

ctx.mount(() => (
  <Container>
    <TickerCounter />
  </Container>
));

// The driver methods are async, so always await them
await ctx.ticker.fastForwardFrames(5);
expect(calls).toBe(5);
`,p=t(`<h1>mountScene`),m=t(`<p><code>mountScene()</code> is for testing <strong>view components</strong> that render a Pixi display object (Sprite, Container, Text, etc.). It mounts JSX in a temporary Solid root, resolves it to a real Pixi node, and returns the root Container with query helpers bound to it.`),h=t(`<p>The returned <code>container</code> is the root PixiJS node, so no ref callback is needed to access it. It is a snapshot of the root taken right after mounting. If the scene's root node can be replaced (a <code>&lt;Loading></code> boundary or a <code>&lt;Show></code> at the top level), prefer the bound query helpers, which always read the current root.`),g=t(`<h2 id=basic-usage>Basic usage`),_=t(`<h2 id=non-container-roots>Non-Container roots`),v=t(`<p>For component types other than <code>Pixi.Container</code>, specify the type via the generic parameter:`),y=t(`<h2 id=providing-context>Providing context`),b=t(`<p>Pass the provider as <code>options.wrapper</code>, or use <code>ctx.mount</code>, which applies <code>ctx.Provider</code> for you. The provider supplies a mock ticker (stopped, manually controlled), renderer, and app:`),x=t(`<h2 id=when-to-use>When to use`),S=t(`<ul><li><p>Testing view components that render a Pixi display object</p></li><li><p>You need to inspect the rendered scene graph</p></li><li><p>You want to query children by label with <code>getByLabel</code> / <code>queryByLabel`),C=t(`<p>For testing stores or hooks that do not render a scene, use <a><code>renderHook</code></a> instead.`);function w(){return e(s,{get children(){return e(c,{get children(){return[o(p),o(m),e(l,{code:`type MountSceneResult<TRoot = Pixi.Container> = {
  container: TRoot;
  getByLabel: (label: string) => Pixi.Container;
  queryByLabel: (label: string) => Pixi.Container | undefined;
  getAllByLabel: (label: string) => Pixi.Container[];
  dispose: () => void;
};`,title:`tsx`}),o(h),o(g),e(l,{code:d,title:`tsx`}),o(_),o(v),e(l,{code:`const { container } = mountScene<Pixi.AnimatedSprite>(() => (
  <AnimatedSprite textures={textures} playing />
));
container.playing; // typed as Pixi.AnimatedSprite`,title:`tsx`}),o(y),o(b),e(l,{code:f,title:`tsx`}),o(x),o(S),(()=>{var e=o(C),t=e.firstChild.nextSibling,s=a();return i(()=>u(`/testing/render-hook`),e=>{n(t,`href`,e),r(t,s)}),e})()]}})}})}export{w as default};