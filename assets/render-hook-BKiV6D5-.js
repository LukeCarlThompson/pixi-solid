import{J as e,L as t,M as n,a as r,d as i,ht as a,p as o}from"./web-BTd9NawZ.js";import{c as s,i as c,o as l,s as u,u as d}from"./components-BiYutFnA.js";var f=t(`<h1>renderHook`),p=t(`<p><code>renderHook()</code> is for testing <strong>stores, hooks, or any logic</strong> that has signals inside or requires context but does <strong>not</strong> render a scene. It runs the callback <strong>once</strong> in a temporary Solid root, optionally inside a <code>wrapper</code> component (e.g. <code>ctx.Provider</code>), and exposes the return value as an accessor.`),m=t(`<p>The callback runs once inside the wrapper, and it does <strong>not</strong> re-run when reactive values change. Hooks that register side effects (<code>onTick</code>, <code>onResize</code>) are cleaned up on <code>dispose</code>. To observe updates, return a reactive value from the callback (an accessor or a store) and read it through <code>result()</code>.`),h=t(`<h2 id=testing-hooks-with-context>Testing hooks with context`),g=t(`<p>Hooks like <code>usePixiScreen</code> require a provider. Pass <code>ctx.Provider</code> as the wrapper:`),_=t(`<p>Or use the <code>ctx.renderHook</code> convenience method — the mock <code>Provider</code> is applied automatically:`),v=t(`<h2 id=testing-stores-that-use-hooks-internally>Testing stores that use hooks internally`),y=t(`<p>Return a reactive store object, then read through <code>result()</code>:`),b=t(`<h2 id=reactivity>Reactivity`),x=t(`<p>The callback runs once, so <code>result</code> does not re-evaluate on its own. Return a reactive value from the callback and read it through <code>result()</code> to observe updates. Solid batches reactive writes and flushes them on a microtask, so call <code>flush()</code> before asserting:`),S=t(`<p><strong>Tip:</strong> return stable reactive objects (stores, screen dimensions) rather than deriving primitives inside the callback. A derived primitive is read only once, so later changes would not be visible through <code>result()</code>.`),C=t(`<h2 id=error-testing>Error testing`),w=t(`<p>Errors surface eagerly at <code>renderHook()</code> call time, so missing-context tests read cleanly:`),T=t(`<h2 id=when-to-use>When to use`),E=t(`<ul><li><p>Testing stores or hooks that have signals inside</p></li><li><p>Testing logic that requires context (<code>usePixiScreen</code>, <code>getPixiApp</code>, etc.) but does not render a scene</p></li><li><p>Error testing for missing context`),D=t(`<p>For testing view components that render a Pixi display object, use <a><code>mountScene</code></a> instead.`);function O(){return e(s,{get children(){return e(c,{get children(){return[o(f),o(p),e(l,{code:`type RenderHookResult<T> = {
  result: Accessor<T>; // call result() to read the current value
  dispose: () => void;
};`,title:`tsx`}),o(m),o(h),o(g),e(l,{code:`import { usePixiScreen } from "pixi-solid";
import { renderHook, createTestContext } from "pixi-solid/testing";

const ctx = createTestContext();

const { result } = renderHook(() => usePixiScreen(), {
  wrapper: ctx.Provider,
});

expect(result().width).toBe(800);
expect(result().height).toBe(600);`,title:`tsx`}),o(_),e(l,{code:`const ctx = createTestContext();

const { result } = ctx.renderHook(() => usePixiScreen());

expect(result().width).toBe(800);`,title:`tsx`}),o(v),o(y),e(l,{code:`const ctx = createTestContext();

const { result } = ctx.renderHook(() => createClockStore()); // uses onTick internally

expect(result().time).toBe(0);

// The driver methods are async, so always await them
await ctx.ticker.fastForwardFrames(3);
expect(result().time).toBe(48);`,title:`tsx`}),o(b),o(x),e(l,{code:`import { flush } from "solid-js";

const ctx = createTestContext();

const { result } = ctx.renderHook(() => usePixiScreen());
expect(result().width).toBe(800);

ctx.renderer.emitResize({ width: 1024 });
flush();

expect(result().width).toBe(1024);`,title:`tsx`}),e(u,{get children(){return o(S)}}),o(C),o(w),e(l,{code:`expect(() => renderHook(() => usePixiScreen())).toThrow();`,title:`tsx`}),o(T),o(E),(()=>{var e=o(D),t=e.firstChild.nextSibling,s=a();return i(()=>d(`/testing/mount-scene`),e=>{n(t,`href`,e),r(t,s)}),e})()]}})}})}export{O as default};