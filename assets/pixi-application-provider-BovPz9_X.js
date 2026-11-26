import{J as e,L as t,M as n,a as r,d as i,ht as a,p as o}from"./web-BTd9NawZ.js";import{c as s,i as c,o as l,s as u,u as d}from"./components-BiYutFnA.js";var f=`import { PixiApplicationProvider, PixiCanvas, usePixiScreen, onTick, Text } from "pixi-solid";
import { createSignal } from "solid-js";

export const App = () => {
  return (
    <PixiApplicationProvider background="#1099bb">
      {/* HTML components here can use pixi-solid hooks */}
      <HtmlComponent />
      <PixiCanvas style={{ width: "100%", height: "500px" }}>
        <CanvasContent />
      </PixiCanvas>
    </PixiApplicationProvider>
  );
};

const HtmlComponent = () => {
  const screen = usePixiScreen();
  return (
    <div style={{ padding: "20px" }}>
      <p>
        Canvas Size: {screen.width}x{screen.height}
      </p>
    </div>
  );
};

const CanvasContent = () => {
  const [rotation, setRotation] = createSignal(0);

  onTick((ticker) => {
    setRotation((r) => r + 0.01 * ticker.deltaTime);
  });

  return (
    <Text text="Hello from Pixi!" style={{ fill: "white", fontSize: 24 }} rotation={rotation()} />
  );
};
`,p=t(`<h1>PixiApplicationProvider`),m=t(`<p>The <code>PixiApplicationProvider</code> component creates a <code>Pixi.Application</code> instance and provides it through context to descendant components. Unlike <code>PixiCanvas</code>, it does not mount the canvas to the DOM—you must use <code>PixiCanvas</code> as a child component to render the canvas.`),h=t(`<p>This component is useful for scenarios where you need to:`),g=t(`<ul><li><p>Use pixi-solid hooks in HTML components outside the canvas</p></li><li><p>Manually control application creation and initialization`),_=t(`<h2 id=usage>Usage`),v=t(`<h3 id=basic-setup-with-pixicanvas>Basic Setup with PixiCanvas`),y=t(`<p>In most use cases, you would wrap <code>PixiCanvas</code> with <code>PixiApplicationProvider</code> to allow HTML components to access pixi-solid hooks or application state:`),b=t(`<h3 id=using-an-existing-application>Using an Existing Application`),x=t(`<p>You can pass an already-created <code>Pixi.Application</code> instance using the <code>existingApp</code> prop, but you must initialize it with <code>await app.init()</code> before the provider renders. Create the app in an async <code>createMemo</code> and read it inside a <code>&lt;Loading></code> boundary:`),S=t(`<p>When using <code>existingApp</code>, you are responsible for:`),C=t(`<ul><li>Ensuring the application is initialized before rendering the provider</li><li>Managing the application lifecycle and cleanup, the provider will not destroy the application when unmounting`),w=t(`<h2 id=props>Props`),T=t(`<ul><li><p><code>children: JSX.Element</code> - Child components that will have access to the application context (required)</p></li><li><p><code>existingApp?: Pixi.Application</code> - An optional initialized Pixi application to reuse instead of creating a new one.</p></li><li><p><code>Pixi.ApplicationOptions</code> properties except <code>children</code> and <code>resizeTo</code>. They are used only when this provider creates the app.`),E=t(`<p>If an existing app is reused, any passed application options are ignored; pixi-solid warns about this in development. The supported rendering setup is to mount <code>PixiCanvas</code> as a child; it owns the resize target.`),D=t(`<p>See the <a href=https://pixijs.com/8.x/guides/components/application>PixiJS ApplicationOptions</a> documentation for the complete list of options.`),O=t(`<h2 id=available-context>Available Context`),k=t(`<p>Components inside <code>PixiApplicationProvider</code> have access to:`),A=t(`<ul><li><p><code>getPixiApp()</code> - Access the <code>Pixi.Application</code> instance</p></li><li><p><code>getRenderer()</code> - Access the <code>Pixi.Renderer</code> instance</p></li><li><p><code>getTicker()</code> - Access the <code>Pixi.Ticker</code> instance</p></li><li><p><code>usePixiScreen()</code> - Get reactive screen dimensions</p></li><li><p><code>onTick()</code> - Subscribe to ticker updates</p></li><li><p><code>onResize()</code> - Subscribe to resize events</p></li><li><p><code>createDelay()</code> - Create ticker-synced callback delays</p></li><li><p><code>createAsyncDelay()</code> - Create async ticker-synced delays`),j=t(`<h2 id=when-to-use-pixiapplicationprovider>When to use PixiApplicationProvider`),M=t(`<ul><li><p>When you need HTML components outside the canvas to use pixi-solid hooks</p></li><li><p>When you need manual control over application initialization</p></li><li><p>When you want to provide an existing Pixi Application instance`),N=t(`<h2 id=when-to-use-pixicanvas-instead>When to use PixiCanvas instead`),P=t(`<ul><li><p>For simple applications without external HTML components</p></li><li><p>When you do not need to share the application across multiple contexts</p></li><li><p>For the most straightforward and least verbose setup`),F=t(`<h2 id=when-to-use-tickerprovider-instead>When to use TickerProvider instead`),I=t(`<ul><li><p>When you only need ticker functionality without a full application</p></li><li><p>When you do not need the full PixiJS rendering context</p></li><li><p>For lightweight ticker-based utilities only`),L=t(`<h2 id=related-components>Related Components`),R=t(`<ul><li><p><a><code>PixiCanvas</code></a> - For rendering the actual canvas to the DOM</p></li><li><p><a><code>TickerProvider</code></a> - For ticker functionality without a full application`),z=t(`<h2 id=further-reading>Further reading`),B=t(`<ul><li><p><a>Getting started with PixiApplicationProvider</a></p></li><li><p><a href=https://pixijs.com/8.x/guides/components/application>PixiJS Application documentation`);function V(){return e(s,{get children(){return e(c,{get children(){return[o(p),o(m),o(h),o(g),o(_),o(v),o(y),e(l,{code:f,title:`tsx`}),o(b),o(x),e(l,{code:`import { PixiApplicationProvider, PixiCanvas } from "pixi-solid";
import { Application } from "pixi.js";
import { createMemo, Loading } from "solid-js";

export const App = () => {
  const pixiApp = createMemo(async () => {
    const app = new Application();
    await app.init({
      width: 800,
      height: 600,
      background: "#1099bb",
    });
    return app;
  });

  return (
    <Loading fallback={<p>Loading...</p>}>
      <PixiApplicationProvider existingApp={pixiApp()}>
        <PixiCanvas style={{ width: "100%", height: "100%" }}>
          <YourContent />
        </PixiCanvas>
      </PixiApplicationProvider>
    </Loading>
  );
};`,title:`tsx`}),e(u,{tone:`warning`,get children(){return[o(S),o(C)]}}),o(w),e(l,{code:`import type { PixiApplicationProps } from "pixi-solid";`,title:`tsx`}),o(T),o(E),(()=>{var e=o(D),t=e.firstChild.nextSibling;return r(t),e})(),o(O),o(k),o(A),o(j),o(M),o(N),o(P),o(F),o(I),o(L),(()=>{var e=o(R),t=e.firstChild,s=t.firstChild.firstChild,c=t.nextSibling.firstChild.firstChild,l=a();return i(()=>({e:d(`/components/pixi-canvas`),t:d(`/components/ticker-provider`)}),({e,t},i)=>{e!==i?.e&&n(s,`href`,e),t!==i?.t&&n(c,`href`,t),r(s,l),r(c,l)}),e})(),o(z),(()=>{var e=o(B),t=e.firstChild,s=t.firstChild.firstChild,c=t.nextSibling.firstChild.firstChild,l=a();return r(c),i(()=>d(`/getting-started/application-instantiation`),e=>{n(s,`href`,e),r(s,l)}),e})()]}})}})}export{V as default};