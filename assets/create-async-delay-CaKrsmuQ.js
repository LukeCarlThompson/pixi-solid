import{J as e,L as t,p as n}from"./web-BTd9NawZ.js";import{c as r,i,o as a}from"./components-BiYutFnA.js";var o=`import { PixiCanvas, Text } from "pixi-solid";
import { createAsyncDelay } from "pixi-solid/utils";
import { createSignal } from "solid-js";

const DelayedActionComponent = () => {
  // Call this in a synchronous scope inside \`PixiApplicationProvider\`, \`PixiCanvas\`, or \`TickerProvider\`.
  const delay = createAsyncDelay();
  const [isWaiting, setIsWaiting] = createSignal(false);

  const handlePointerDown = async () => {
    setIsWaiting(true);
    console.log("Pointer down, waiting 2 seconds...");
    await delay(2000);
    setIsWaiting(false);
    console.log("2 seconds have passed on the ticker");
  };

  return <Text text={isWaiting() ? "Waiting..." : "Click me"} onpointerdown={handlePointerDown} />;
};
`,s=`import { PixiCanvas, Text } from "pixi-solid";
import { createAsyncDelay } from "pixi-solid/utils";
import { createSignal } from "solid-js";

const CancellableDelayComponent = () => {
  const delay = createAsyncDelay();
  const [isWaiting, setIsWaiting] = createSignal(false);
  let abortController: AbortController | undefined;

  const handlePointerDown = async () => {
    setIsWaiting(true);
    abortController = new AbortController();

    console.log("Starting 5 second delay...");
    await delay(5000, abortController.signal);
    setIsWaiting(false);
    console.log("Delay completed!");
  };

  const handleCancel = () => {
    if (abortController) {
      abortController.abort();
      console.log("Delay cancelled!");
    }
  };

  return (
    <Text
      text={isWaiting() ? "Waiting (click to cancel)..." : "Click me"}
      onpointerdown={isWaiting() ? handleCancel : handlePointerDown}
    />
  );
};
`,c=t(`<h1>createAsyncDelay`),l=t(`<p><code>createAsyncDelay()</code> returns an async function that delays for a number of milliseconds of ticker time.`),u=t(`<p>It keeps the delay in sync with the ticker from the nearest context provider, so animations and other actions share one clock.`),d=t(`<p>Pass an optional <code>AbortSignal</code> to cancel the delay early.`),f=t(`<p>Call this function in a SolidJS tracking scope, such as a component, that is a descendant of <code>PixiApplicationProvider</code>, <code>PixiCanvas</code>, or <code>TickerProvider</code>.`),p=t(`<p>The returned function can be called from an async context.`),m=t(`<h2 id=usage>Usage`),h=t(`<h3 id=with-abortsignal>With AbortSignal`),g=t(`<p>You can pass an <code>AbortSignal</code> to cancel the delay early:`),_=t(`<h2 id=when-to-use-it>When to use it`),v=t(`<ul><li><p>When you need to delay execution in a way that is synchronized with the ticker.</p></li><li><p>For animations or other operations that depend on the ticker's timing.</p></li><li><p>To avoid using external time measurements like <code>setTimeout</code> in ticker-dependent contexts.</p></li><li><p>When you need the ability to cancel a delay early using an <code>AbortSignal</code>.`);function y(){return e(r,{get children(){return e(i,{get children(){return[n(c),n(l),n(u),n(d),n(f),n(p),n(m),e(a,{code:o,title:`tsx`}),n(h),n(g),e(a,{code:s,title:`tsx`}),n(_),n(v)]}})}})}export{y as default};