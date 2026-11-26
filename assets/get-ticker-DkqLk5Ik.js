import{J as e,L as t,a as n,p as r}from"./web-BTd9NawZ.js";import{c as i,i as a,o}from"./components-BiYutFnA.js";var s=t(`<h1>getTicker`),c=t(`<p>The <code>pixi-solid</code> library provides two hooks, <code>getTicker</code> and <code>onTick</code>, to interact with the PixiJS <code>Ticker</code> instance.`),l=t(`<p>The <code>getTicker</code> hook provides direct access to the <code>PIXI.Ticker</code> instance from the current application context. This is useful when you need imperative control over the ticker, such as pausing, starting, or adjusting its speed globally. The hook must be called from a component that is a descendant of either <code>&lt;PixiApplicationProvider /></code> or <code>&lt;PixiCanvas /></code>.`),u=t(`<h2 id=usage>Usage`),d=t(`<h2 id=when-to-use-it>When to use it`),f=t(`<ul><li><p>When you need to globally control the animation loop (e.g., stopping or starting all animations).</p></li><li><p>To adjust the overall speed or framerate of the application.</p></li><li><p>To add or remove ticker callbacks dynamically based on complex logic.`),p=t(`<h2 id=further-reading>Further reading`),m=t(`<ul><li><p>Read more about the <a href=https://pixijs.com/8.x/guides/components/ticker><code>Pixi.Ticker</code> class</a> in the PixiJS documentation.`);function h(){return e(i,{get children(){return e(a,{get children(){return[r(s),r(c),r(l),r(u),e(o,{code:`import { getTicker, onTick, Container, PixiCanvas } from "pixi-solid";
import { createEffect, createSignal } from "solid-js";

const MyComponent = () => {
  const [tickerRunning, setTickerRunning] = createSignal(true);
  const ticker = getTicker();

  createEffect(() => {
    // You can now safely use the PixiJS Ticker instance
    console.log("PixiJS Ticker instance:", ticker);

    // Example: start and stop the ticker based on a signal
    if (tickerRunning()) {
      ticker.start();
    } else {
      ticker.stop();
    }
  });

  return <Container>{/* Your components here*/}</Container>;
};

export const DemoApp = () => {
  return (
    <PixiCanvas>
      <MyComponent />
    </PixiCanvas>
  );
};`,title:`tsx`}),r(d),r(f),r(p),(()=>{var e=r(m),t=e.firstChild.firstChild.firstChild.nextSibling;return n(t),e})()]}})}})}export{h as default};