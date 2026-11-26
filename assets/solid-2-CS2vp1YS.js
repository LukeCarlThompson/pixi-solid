import{J as e,L as t,M as n,a as r,d as i,ht as a,p as o}from"./web-BTd9NawZ.js";import{c as s,i as c,o as l,r as u,s as d,u as f}from"./components-BiYutFnA.js";var p=t(`<h1>Migrating to Solid 2`),m=t(`<p><code>pixi-solid</code> 2 requires SolidJS 2. Component, hook, and utility names stay the same. Almost all of the work is in the SolidJS APIs around them.`),h=t(`<p>SolidJS publishes a <a href=https://github.com/solidjs/solid/blob/next/documentation/solid-2.0/MIGRATION.md>complete migration guide</a>. Read that for the full list. This page covers the parts that meet a pixi-solid project, and the changes to <code>pixi-solid</code> itself.`),g=t(`<h2 id=upgrade-the-packages>Upgrade the packages`),_=t(`<p>Install SolidJS 2 and its web renderer, then add the compiler plugin:`),v=t(`<p><code>pixi-solid</code> declares all three as peers. The supported range for <code>solid-js</code> and <code>@solidjs/web</code> is <code>>=2.0.0 &lt;3</code>.`),y=t(`<p>The compiler must use <code>@solidjs/web</code> as the JSX renderer. See <a>Project setup</a> for the <code>tsconfig.json</code> and Vite settings.`),b=t(`<h2 id=update-the-import-paths>Update the import paths`),x=t(`<p><code>solid-js</code> no longer owns the JSX types or the store helpers.`),S=t(`<thead><tr><th>Import</th><th>Solid 1 path</th><th>Solid 2 path`),C=t(`<tbody><tr><td><code>render</code>, <code>hydrate</code>, and the DOM helpers</td><td><code>solid-js/web</code></td><td><code>@solidjs/web</code></td></tr><tr><td>The <code>JSX</code> types</td><td><code>solid-js</code></td><td><code>@solidjs/web</code></td></tr><tr><td><code>createStore</code> and the store helpers</td><td><code>solid-js/store</code></td><td><code>solid-js`),w=t(`<h2 id=renamed-and-removed-apis>Renamed and removed APIs`),T=t(`<p>These are the ones that turn up in a pixi-solid scene. The SolidJS guide covers the rest.`),E=t(`<thead><tr><th>Solid 1</th><th>Solid 2`),D=t(`<tbody><tr><td><code>onMount</code></td><td><code>onSettled</code>, which can return a cleanup function</td></tr><tr><td><code>splitProps</code></td><td><code>omit</code></td></tr><tr><td><code>mergeProps</code></td><td><code>merge</code></td></tr><tr><td><code>classList</code></td><td><code>class</code> with an object or array value</td></tr><tr><td><code>Suspense</code></td><td><code>Loading</code></td></tr><tr><td><code>ErrorBoundary</code></td><td><code>Errored</code></td></tr><tr><td><code>Index</code></td><td><code>&lt;For keyed={false}></code></td></tr><tr><td><code>createMutable</code></td><td><code>createStore</code> with draft setters</td></tr><tr><td><code>createSelector</code></td><td><code>createProjection</code>, or <code>createStore(fn)</code></td></tr><tr><td><code>batch</code></td><td>Writes batch on their own. Call <code>flush()</code> to apply them</td></tr><tr><td><code>createResource</code></td><td>An async computation read inside <code>&lt;Loading></code></td></tr><tr><td><code>startTransition</code>, <code>useTransition</code></td><td>Built-in transitions with <code>isPending</code> and <code>&lt;Loading></code></td></tr><tr><td><code>Context.Provider</code></td><td>Use the context directly as the provider`),O=t(`<p><code>createDeferred</code> is removed with no replacement.`),k=t(`<h2 id=effects-are-split>Effects are split`),A=t(`<p><code>createEffect</code> and <code>createRenderEffect</code> take a compute function and an effect function. The compute returns the value that the effect receives, and it is the only part that tracks. This is the pattern for binding a signal to a PixiJS class property:`),j=t(`<h2 id=async-work-and-loading>Async work and <code>&lt;Loading>`),M=t(`<p>Async work is a computation that returns a Promise. Create it with <code>createMemo</code> and read it inside a <code>&lt;Loading></code> boundary:`),N=t(`<p>A <code>&lt;Loading></code> boundary covers its whole subtree and catches a pending read from any descendant. Place it around the smallest group that should wait.`),P=t(`<p>The <code>fallback</code> is optional and replaces the children, so it sits wherever the boundary sits. Inside a Pixi tree the fallback must be a Pixi element, and a DOM element in that position throws <code>InvalidChildTypeError</code>. Put the boundary above the canvas to use a DOM fallback.`),F=t(`<p>See <a>Asset loading</a> and <a>Asset manifests</a> for the two loading patterns.`),I=t(`<h2 id=reactive-writes-are-batched>Reactive writes are batched`),L=t(`<p>A signal write does not change what a read returns until the batch flushes. Call <code>flush()</code> before you assert:`),R=t(`<p>The testing helpers rely on this behavior. See <a>Testing</a>.`),z=t(`<h2 id=pixi-solid-api-changes>pixi-solid API changes`),B=t(`<tbody><tr><td><code>&lt;PixiCanvas classList={{ active: true }}></code></td><td><code>&lt;PixiCanvas class={{ active: true }}>`),V=t(`<ul><li><p><code>class</code> accepts a <code>JSX.ClassValue</code>, so an object or array replaces the removed <code>classList</code> prop.</p></li><li><p><code>ref</code> accepts a Solid <code>Ref&lt;HTMLDivElement></code>. The callback form still works. A variable and an array of callbacks also typecheck now. The Solid compiler turns a variable into a callback that assigns to it, so the runtime only ever receives callbacks.</p></li><li><p><code>createTestContext</code> returns a <code>mount</code> helper that applies the test providers.</p></li><li><p><code>mountScene</code> and <code>renderHook</code> accept an options object with an optional <code>wrapper</code>.</p></li><li><p><code>renderHook</code> calls its callback once. <code>result()</code> returns the value from that call.</p></li><li><p><code>cleanup</code> resets the Solid error halt in addition to unmounting.</p></li><li><p><code>PIXI_SOLID_EVENT_HANDLER_NAMES</code> is available from the root exports.`),H=t(`<h3 id=ref-callbacks>Ref callbacks`),U=t(`<p>A ref callback is no longer a place for reactive work. In <code>pixi-solid</code> 1 it ran inside the component's owner, and it re-ran whenever a prop it read changed. It now runs without an owner, and it runs once.`),W=t(`<p><strong>It has no owner.</strong> <code>onCleanup</code> inside a ref callback never runs, an effect created inside one never disposes, and <code>useContext</code> inside one throws, because a context read needs an owner. Move that work into <code>onSettled</code> in the component body, which runs after the ref has been assigned, and return a cleanup function:`),G=t(`<p>The <code>PixiCanvas</code> <code>ref</code> receives a DOM element, and SolidJS clears the owner for DOM refs for the same reason, so the same rule applies there.`),K=t(`<p><strong>It runs once.</strong> In <code>pixi-solid</code> 1 a ref callback re-ran whenever a prop it read changed, so a drawing command followed a signal. Use the <code>draw</code> prop instead:`),q=t(`<p>For any other component, move the read into a split effect: the compute function tracks the read, and the apply function calls into the instance. Reach for this when the value has no matching prop, such as <code>AnimatedSprite</code>'s <code>playing</code>, which is a getter with no setter. Passing it as a prop throws.`),J=t(`<p>Most PixiJS state does have a prop, and pixi-solid binds those props reactively. <code>&lt;Sprite tint={tint()} /></code> needs no effect at all. A read left inside a ref callback also reports <code>[STRICT_READ_UNTRACKED]</code> in development.`);function Y(){return e(s,{get children(){return e(c,{get children(){return[o(p),o(m),(()=>{var e=o(h),t=e.firstChild.nextSibling;return r(t),e})(),o(g),o(_),e(l,{code:`npm i solid-js@2.0.1 @solidjs/web@2.0.1
npm i -D @solidjs/vite-plugin@3.0.0-next.35`,title:`bash`}),o(v),(()=>{var e=o(y),t=e.firstChild.nextSibling.nextSibling.nextSibling,s=a();return i(()=>f(`/getting-started/project-setup`),e=>{n(t,`href`,e),r(t,s)}),e})(),o(b),o(x),e(u,{get children(){return[o(S),o(C)]}}),o(w),o(T),e(u,{get children(){return[o(E),o(D)]}}),o(O),o(k),o(A),e(l,{code:`// Solid 1
createEffect(() => {
  blurFilter.strength = blurAmount();
});

// Solid 2
createEffect(
  () => blurAmount(),
  (amount) => {
    blurFilter.strength = amount;
  },
);`,title:`tsx`}),o(j),o(M),e(l,{code:`const texture = createMemo(async () => Assets.load<Pixi.Texture>("/sprite.png"));

<PixiCanvas>
  <Loading>
    <Sprite texture={texture()} />
  </Loading>
</PixiCanvas>;`,title:`tsx`}),e(d,{tone:`warning`,get children(){return[o(N),o(P)]}}),(()=>{var e=o(F),t=e.firstChild.nextSibling,s=t.nextSibling.nextSibling,c=a();return i(()=>({e:f(`/asset-loading/individual-assets`),t:f(`/asset-loading/asset-manifest`)}),({e,t:i},a)=>{e!==a?.e&&n(t,`href`,e),i!==a?.t&&n(s,`href`,i),r(t,c),r(s,c)}),e})(),o(I),o(L),e(l,{code:`setCount(1);
flush();

expect(count()).toBe(1);`,title:`tsx`}),(()=>{var e=o(R),t=e.firstChild.nextSibling,s=a();return i(()=>f(`/testing/overview`),e=>{n(t,`href`,e),r(t,s)}),e})(),o(z),e(u,{get children(){return[o(E),o(B)]}}),o(V),o(H),o(U),o(W),e(l,{code:`let sprite: Pixi.Sprite | undefined;

onSettled(() => {
  const onDown = () => {
    // handle the press
  };

  sprite?.on("pointerdown", onDown);

  return () => sprite?.off("pointerdown", onDown);
});

return <Sprite ref={sprite} texture={texture} />;`,title:`tsx`}),o(G),o(K),e(l,{code:`// pixi-solid 1 — redraws whenever \`size\` changes
<Graphics
  ref={(g) => {
    g.rect(50, 50, size(), size()).fill(0xff0000);
  }}
/>;

// pixi-solid 2 — \`draw\` clears and redraws whenever its reads change
<Graphics draw={(g) => g.rect(50, 50, size(), size()).fill(0xff0000)} />;`,title:`tsx`}),o(q),e(l,{code:`// pixi-solid 1 — the ref re-ran and started or stopped playback
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

return <AnimatedSprite ref={animation} textures={textures} />;`,title:`tsx`}),o(J)]}})}})}export{Y as default};