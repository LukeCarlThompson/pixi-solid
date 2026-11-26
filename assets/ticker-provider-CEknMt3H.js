import{J as e,L as t,M as n,a as r,d as i,ht as a,p as o}from"./web-BTd9NawZ.js";import{c as s,i as c,o as l,u}from"./components-BiYutFnA.js";var d=`import { PixiCanvas, Container, TickerProvider, onTick } from "pixi-solid";
import { Sprite } from "pixi-solid";
import { Texture, Ticker } from "pixi.js";
import { createSignal, onCleanup } from "solid-js";

// Component that rotates using the context ticker
const RotatingSprite = () => {
  const [rotation, setRotation] = createSignal(0);

  onTick((ticker) => {
    setRotation((r) => r + 0.01 * ticker.deltaTime);
  });

  return <Sprite texture={Texture.WHITE} rotation={rotation()} x={100} y={100} />;
};

export const DemoApp = () => {
  // Create a separate ticker for one scene graph branch.
  const slowTicker = new Ticker();
  slowTicker.speed = 0.5; // Half speed
  slowTicker.start();

  // The caller owns this externally-created ticker.
  onCleanup(() => {
    slowTicker.stop();
    slowTicker.destroy();
  });

  return (
    <PixiCanvas style={{ width: "100%", height: "100dvh" }}>
      <Container>
        {/* Uses the default canvas ticker */}
        <RotatingSprite />

        {/* Uses its own slower ticker */}
        <TickerProvider ticker={slowTicker}>
          <RotatingSprite />
        </TickerProvider>
      </Container>
    </PixiCanvas>
  );
};
`,f=t(`<h1>TickerProvider`),p=t(`<p><code>TickerProvider</code> supplies a <code>Pixi.Ticker</code> to descendants through context. It does not create or add anything to the Pixi scene graph.`),m=t(`<p><code>PixiCanvas</code> and <code>PixiApplicationProvider</code> already provide ticker context. Use <code>TickerProvider</code> when a scene graph branch needs a different ticker instance. Descendants can use <code>onTick</code>, <code>createDelay</code>, <code>createAsyncDelay</code>, and <code>getTicker</code> with that ticker.`),h=t(`<h2 id=example>Example`),g=t(`<p>This branch runs at half speed while the rest of the scene uses the canvas ticker.`),_=t(`<h3 id=props>Props`),v=t(`<ul><li><p><code>ticker: Pixi.Ticker</code> - The ticker instance to provide to child components (required)</p></li><li><p><code>children: JSX.Element</code> - The child components that will have access to the ticker context`),y=t(`<h3 id=when-to-use-it>When to use it`),b=t(`<p><code>TickerProvider</code> is an edge-case provider. Use it when:`),x=t(`<ul><li><p>A scene graph branch needs an independently managed ticker, such as a different rate or clock.</p></li><li><p>An existing ticker owned by another system must drive a branch.</p></li><li><p>A non-standard integration must populate ticker context outside the normal application provider tree.`),S=t(`<p>For normal scenes, use <code>PixiCanvas</code> or <code>PixiApplicationProvider</code>. For tests, use <code>createManualTicker</code> and <code>createTestContext</code> instead.`),C=t(`<p>The caller owns the ticker passed to <code>TickerProvider</code>. Create, start, stop, and destroy it outside the provider when appropriate.`),w=t(`<h2 id=further-reading>Further reading`),T=t(`<ul><li><p>Read more about the <a href=https://pixijs.com/8.x/guides/components/ticker><code>Pixi.Ticker</code> class</a> in the PixiJS documentation</p></li><li><p>See related hooks: <a><code>onTick</code></a>, <a><code>getTicker</code></a>, <a><code>createDelay</code></a>, <a><code>createAsyncDelay`);function E(){return e(s,{get children(){return e(c,{get children(){return[o(f),o(p),o(m),o(h),o(g),e(l,{code:d,title:`tsx`}),o(_),o(v),o(y),o(b),o(x),o(S),o(C),o(w),(()=>{var e=o(T),t=e.firstChild,s=t.firstChild.firstChild.nextSibling,c=t.nextSibling.firstChild.firstChild.nextSibling,l=c.nextSibling.nextSibling,d=l.nextSibling.nextSibling,f=d.nextSibling.nextSibling,p=a();return r(s),i(()=>({e:u(`/hooks/on-tick`),t:u(`/hooks/get-ticker`),a:u(`/utils/create-delay`),o:u(`/utils/create-async-delay`)}),({e,t,a:i,o:a},o)=>{e!==o?.e&&n(c,`href`,e),t!==o?.t&&n(l,`href`,t),i!==o?.a&&n(d,`href`,i),a!==o?.o&&n(f,`href`,a),r(c,p),r(l,p),r(d,p),r(f,p)}),e})()]}})}})}export{E as default};