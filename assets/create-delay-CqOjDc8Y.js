import{J as e,L as t,p as n}from"./web-BTd9NawZ.js";import{c as r,i,o as a}from"./components-BiYutFnA.js";var o=`import { Text } from "pixi-solid";
import { createDelay } from "pixi-solid/utils";

const DelayedCallbackComponent = () => {
  const delay = createDelay();

  const handlePointerDown = () => {
    console.log("Pointer down");
    delay(1000, () => {
      console.log("1 second has passed on the ticker");

      delay(500, () => {
        console.log("Nested delay complete");
      });
    });
  };

  return <Text text="Click me" onpointerdown={handlePointerDown} />;
};
`,s=t(`<h1>createDelay`),c=t(`<p>The <code>createDelay</code> function creates a callback-based delay function synchronized with the nearest ticker context.`),l=t(`<p>Call <code>createDelay</code> synchronously inside a descendant of <code>PixiApplicationProvider</code>, <code>PixiCanvas</code>, or <code>TickerProvider</code>. The returned function captures that ticker and can be called later from event handlers, ticker callbacks, async continuations, or nested delay callbacks.`),u=t(`<h2 id=usage>Usage`),d=t(`<h2 id=when-to-use-it>When to use it`),f=t(`<ul><li><p>When you need callback-based execution synchronized with ticker time.</p></li><li><p>When you need nested callback delays from event handlers or async continuations.</p></li><li><p>For animations or other operations that depend on ticker timing.</p></li><li><p>To replace external time measurements such as <code>setTimeout</code> in ticker-dependent contexts.`);function p(){return e(r,{get children(){return e(i,{get children(){return[n(s),n(c),n(l),n(u),e(a,{code:o,title:`tsx`}),n(d),n(f)]}})}})}export{p as default};