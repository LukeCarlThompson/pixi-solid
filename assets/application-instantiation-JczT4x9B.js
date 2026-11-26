import{J as e,L as t,M as n,a as r,d as i,ht as a,p as o}from"./web-BTd9NawZ.js";import{c as s,i as c,o as l,s as u,u as d}from"./components-BiYutFnA.js";var f=`import { PixiCanvas, Sprite } from "pixi-solid";
import { Texture } from "pixi.js";

export const DemoApp = () => {
  return (
    <PixiCanvas style={{ width: "100%", height: "100vh" }} background="#1099bb">
      <Sprite texture={Texture.WHITE} x={100} y={100} scale={50} tint="#ff0000" />
    </PixiCanvas>
  );
};
`,p=`import { PixiApplicationProvider, PixiCanvas, usePixiScreen, Text } from "pixi-solid";

export const DemoApp = () => {
  return (
    <PixiApplicationProvider background="#1099bb">
      <HtmlComponent />
      <PixiCanvas style={{ width: "100%", height: "500px" }}>
        <Text text="Hello from Pixi!" style={{ fill: "white", fontSize: 24 }} />
      </PixiCanvas>
    </PixiApplicationProvider>
  );
};

const HtmlComponent = () => {
  const screen = usePixiScreen();
  return (
    <div style={{ padding: "20px" }}>
      Canvas: {screen.width}x{screen.height}
    </div>
  );
};
`,m=t(`<h1>Creating a Pixi Application`),h=t(`<h2 id=pixicanvas>PixiCanvas`),g=t(`<p>The <code>PixiCanvas</code> component is the primary way to set up a PixiJS application in pixi-solid. It handles creating and managing the HTML canvas element, the Pixi Application instance, and provides context to child components.`),_=t(`<h3 id=simple-standalone-usage>Simple Standalone Usage`),v=t(`<p>The simplest way to get started is to use <code>PixiCanvas</code> directly:`),y=t(`<h3 id=with-html-components>With HTML Components`),b=t(`<p>For use cases where you need HTML components outside the canvas to access pixi-solid hooks, wrap with <code>PixiApplicationProvider</code>:`),x=t(`<code>PixiApplicationProvider`),S=t(`<p><strong>For complete API documentation and more examples</strong>, see the <a>PixiCanvas component reference</a>.`),C=t(`<code>pixi-solid`),w=t(`<code>lazy`),T=t(`<code>clientOnly`);function E(){return e(s,{get children(){return e(c,{get children(){return[o(m),o(h),o(g),o(_),o(v),e(l,{code:f,title:`tsx`}),o(y),o(b),e(l,{code:p,title:`tsx`}),e(u,{tone:`tip`,get children(){return[`When using `,o(x),`, HTML components placed between the provider and canvas can access pixi-solid hooks and the Pixi application context.`]}}),(()=>{var e=o(S),t=e.firstChild.nextSibling.nextSibling,s=a();return i(()=>d(`/components/pixi-canvas`),e=>{n(t,`href`,e),r(t,s)}),e})(),e(u,{tone:`warning`,get children(){return[`The `,o(C),` library only supports client side rendering. So you may need to use the `,o(w),`function to dynamically import only on the client or use the `,o(T),` `,`function if using Solid Start.`]}})]}})}})}export{E as default};