import{J as e,L as t,M as n,a as r,d as i,ht as a,p as o}from"./web-BTd9NawZ.js";import{c as s,i as c,o as l,s as u,u as d}from"./components-BiYutFnA.js";var f=t(`<h1>createManualTicker`),p=t(`<p>Creates a stopped PixiJS ticker with step-based frame advancement methods.`),m=t(`<p>The driver methods are <strong>async</strong> — always <code>await</code> them. They own a monotonic absolute clock, so successive calls are exactly additive (no dropped first frame), and they flush microtasks after every tick so promise-based continuations (awaited <code>createAsyncDelay</code>, animation <code>onEnded</code> chains) receive subsequent ticks.`),h=t(`<h2 id=fastforwardframes>fastForwardFrames()`),g=t(`<p>Advance a specific number of frames, each with an optional delta time (defaults to 16ms).`),_=t(`<h2 id=fastforwardtime>fastForwardTime()`),v=t(`<p>Advance frames to simulate a total elapsed time, splitting it into steps of a given size (defaults to ~16ms).`),y=t(`<code>ticker`),b=t(`<code>Ticker`),x=t(`<code>minFPS = 10`),S=t(`<code>ticker.ticker.minFPS = 4`),C=t(`<h2 id=related>Related`),w=t(`<ul><li><p><a><code>createTestContext</code></a> — creates mock context that includes a <code>ManualTicker`);function T(){return e(s,{get children(){return e(c,{get children(){return[o(f),o(p),e(l,{code:`type ManualTicker = {
  ticker: Ticker;
  fastForwardFrames(frames: number, deltaTime?: number): Promise<void>;
  fastForwardTime(totalTimeMS: number, stepSizeMS?: number): Promise<void>;
};`,title:`tsx`}),o(m),o(h),o(g),e(l,{code:`const manual = createManualTicker();
let calls = 0;
manual.ticker.add(() => {
  calls++;
});

await manual.fastForwardFrames(10); // 10 frames at 16ms each
await manual.fastForwardFrames(5, 33); // 5 frames at 33ms each (~30fps)
expect(calls).toBe(15);`,title:`tsx`}),o(_),o(v),e(l,{code:`await manual.fastForwardTime(1000); // 1 second in ~16ms steps
await manual.fastForwardTime(500, 50); // 500ms in 50ms steps`,title:`tsx`}),e(u,{tone:`note`,get children(){return[`The returned `,o(y),` wraps a real PixiJS `,o(b),`, so the same defaults apply (e.g. per-step deltas are capped at 100ms via the default`,` `,o(x),`) and can be overridden on the instance after creation — e.g.`,` `,o(S),` to allow larger step deltas.`]}}),e(u,{tone:`note`,children:`Step-based advancement avoids the footgun of large single-frame deltas that can break spring, smooth-damp, or sequenced animations.`}),o(C),(()=>{var e=o(w),t=e.firstChild.firstChild.firstChild,s=a();return i(()=>d(`/testing/create-test-context`),e=>{n(t,`href`,e),r(t,s)}),e})()]}})}})}export{T as default};