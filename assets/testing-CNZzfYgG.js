import{J as e,L as t,p as n}from"./web-BTd9NawZ.js";import{c as r,i,o as a,r as o}from"./components-BiYutFnA.js";var s=`import { Container } from "pixi-solid";
import { Container3D, Mesh3D, View3D } from "pixi-solid-3d";
import { getByLabel3D } from "pixi-solid-3d/testing";
import { cleanup, mountScene } from "pixi-solid/testing";
import { expect } from "vitest";

const { container } = mountScene(() => (
  <Container label="hud">
    <Container label="score" />
    <View3D>
      <Container3D label="group">
        <Mesh3D label="crate" />
      </Container3D>
    </View3D>
  </Container>
));

expect(getByLabel3D(container, "score")).toBeDefined(); // 2D, beside the view
expect(getByLabel3D(container, "crate")).toBeDefined(); // 3D, inside the view

cleanup();
`,c=`import { ParticleSystem3D, View3D } from "pixi-solid-3d";
import { createTestContext, mountScene } from "pixi-solid/testing";
const ctx = createTestContext();

mountScene(() => (
  <ctx.Provider>
    <View3D>
      <ParticleSystem3D capacity={64} emitRate={20} />
    </View3D>
  </ctx.Provider>
));

await ctx.ticker.fastForwardFrames(2);
`,l=t(`<h1>Testing 3D Scenes`),u=t(`<p>A 3D scene tests like a 2D one: <code>&lt;View3D></code> needs no canvas, renderer or WebGL context. Mount with<code>mountScene</code> from <code>pixi-solid/testing</code>, query with the 3D helpers from <code>pixi-solid-3d/testing</code>, and assert on the nodes themselves.`),d=t(`<h2 id=scene-queries>Scene queries`),f=t(`<p><code>pixi-solid-3d/testing</code> exports three queries. They walk the whole scene in one pass: 2D containers, into every <code>&lt;View3D></code> (whose 3D nodes hang off <code>view.root</code>), and on through its 3D nodes.`),p=t(`<thead><tr><th>Helper</th><th>Returns`),m=t(`<tbody><tr><td><code>getByLabel3D(root, …)</code></td><td>The first match; throws when there is none</td></tr><tr><td><code>queryByLabel3D(root, …)</code></td><td>The first match, or <code>undefined</code></td></tr><tr><td><code>getAllByLabel3D(root, …)</code></td><td>Every match, in depth-first order`),h=t(`<p>Any of them accepts a 2D container, a <code>&lt;View3D></code>, or a <code>&lt;Container3D></code> as the root, and the root itself is a candidate, so <code>getByLabel3D(view, "main-view")</code> finds a labelled <code>&lt;View3D></code>.`),g=t(`<p>The returned node type is what you say it is — the walk cannot know which class a label belongs to:`),_=t(`<h2 id=ticker-driven-components>Ticker-driven components`),v=t(`<p><code>&lt;Model3D></code>, <code>&lt;ParticleSystem3D></code>, <code>&lt;OrbitCamera></code> and <code>&lt;FPSCamera></code> advance on the ticker from context rather than <code>Ticker.shared</code>. Wrap the scene in <code>ctx.Provider</code> from <code>createTestContext()</code> and step frames on <code>ctx.ticker</code>:`),y=t(`<h2 id=what-to-assert>What to assert`),b=t(`<p>Nodes expose the same properties the components write, so assert those directly: <code>mesh.position.x</code>,<code>node.children</code>, <code>view.camera</code> for the active camera, and <code>instance.destroyed</code> after unmount.`),x=t(`<p><code>cleanup()</code> disposes every mounted scene, including the <code>&lt;View3D></code> that owns its view. A view passed in through <code>as</code> is adopted, never destroyed.`);function S(){return e(r,{get children(){return e(i,{get children(){return[n(l),n(u),e(a,{code:s,title:`tsx`}),n(d),n(f),e(o,{get children(){return[n(p),n(m)]}}),n(h),n(g),e(a,{code:`import type * as Pixi3D from "@pixi/3d";

const crate = getByLabel3D<Pixi3D.Mesh3D>(container, "crate");
expect(crate?.geometry).toBeInstanceOf(Pixi3D.CubeGeometry);`,title:`tsx`}),n(_),n(v),e(a,{code:c,title:`tsx`}),n(y),n(b),n(x)]}})}})}export{S as default};