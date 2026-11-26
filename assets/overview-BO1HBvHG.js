import{J as e,L as t,M as n,a as r,d as i,ht as a,p as o}from"./web-BTd9NawZ.js";import{c as s,i as c,o as l,r as u,u as d}from"./components-BiYutFnA.js";var f=t(`<h1>Overview`),p=t(`<p>The <code>pixi-solid/testing</code> module provides utilities for testing pixi-solid components and hooks without a live canvas:`),m=t(`<hr>`),h=t(`<h2 id=api-quick-reference>API quick reference`),g=t(`<h2 id=when-to-use-which>When to use which`),_=t(`<thead><tr><th>Task</th><th>Function</th><th>Page`),v=t(`<tbody><tr><td>Render a component scene graph</td><td><code>mountScene</code></td><td><a>mount-scene</a></td></tr><tr><td>Test a hook or store (no scene needed)</td><td><code>renderHook</code></td><td><a>render-hook</a></td></tr><tr><td>Get mock contexts</td><td><code>createTestContext</code></td><td><a>create-test-context</a></td></tr><tr><td>Advance frames manually</td><td><code>createManualTicker</code></td><td><a>create-manual-ticker</a></td></tr><tr><td>Find a node by label</td><td><code>getByLabel</code> / <code>queryByLabel</code> / <code>getAllByLabel</code></td><td><a>scene-queries</a></td></tr><tr><td>Run all disposers</td><td><code>cleanup</code></td><td><a>cleanup`),y=t(`<h2 id=jsdom-renderer-caveats>jsdom / renderer caveats`),b=t(`<ul><li><p><strong>Pixel-level rendering is not tested</strong> — use a real canvas for integration tests.</p></li><li><p><strong><code>getContext()</code> is not available</strong> — you will see <code>Not implemented: HTMLCanvasElement's getContext()</code> warnings in test output. These warnings are normal and safe.</p></li><li><p><strong>The mock <code>app</code> is a minimal stub</strong> — it implements only the parts that pixi-solid hooks use.`);function x(){return e(s,{get children(){return e(c,{get children(){return[o(f),o(p),e(l,{code:`import {
  mountScene,
  renderHook,
  createTestContext,
  createManualTicker,
  getByLabel,
  queryByLabel,
  getAllByLabel,
  cleanup,
} from "pixi-solid/testing";`,title:`tsx`}),o(m),o(h),e(l,{code:`// Component tests — renders a Pixi display object
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
cleanup();`,title:`tsx`}),o(m),o(g),e(u,{get children(){return[o(_),(()=>{var e=o(v),t=e.firstChild,s=t.firstChild.nextSibling.nextSibling.firstChild,c=t.nextSibling,l=c.firstChild.nextSibling.nextSibling.firstChild,u=c.nextSibling,f=u.firstChild.nextSibling.nextSibling.firstChild,p=u.nextSibling,m=p.firstChild.nextSibling.nextSibling.firstChild,h=p.nextSibling,g=h.firstChild.nextSibling.nextSibling.firstChild,_=h.nextSibling.firstChild.nextSibling.nextSibling.firstChild,y=a();return i(()=>({e:d(`/testing/mount-scene`),t:d(`/testing/render-hook`),a:d(`/testing/create-test-context`),o:d(`/testing/create-manual-ticker`),i:d(`/testing/scene-queries`),n:d(`/testing/cleanup`)}),({e,t,a:i,o:a,i:o,n:c},u)=>{e!==u?.e&&n(s,`href`,e),t!==u?.t&&n(l,`href`,t),i!==u?.a&&n(f,`href`,i),a!==u?.o&&n(m,`href`,a),o!==u?.i&&n(g,`href`,o),c!==u?.n&&n(_,`href`,c),r(s,y),r(l,y),r(f,y),r(m,y),r(g,y),r(_,y)}),e})()]}}),o(m),o(y),o(b)]}})}})}export{x as default};