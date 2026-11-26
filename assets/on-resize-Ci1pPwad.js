import{J as e,L as t,p as n}from"./web-BTd9NawZ.js";import{c as r,i,o as a,s as o}from"./components-BiYutFnA.js";var s=`import { onResize, PixiCanvas, Text } from "pixi-solid";
import type * as Pixi from "pixi.js";
import { createSignal } from "solid-js";

const MyResponsiveComponent = () => {
  const [rendererWidth, setRendererWidth] = createSignal(0);
  const [rendererHeight, setRendererHeight] = createSignal(0);

  onResize((screen: Pixi.Rectangle) => {
    setRendererWidth(screen.width);
    setRendererHeight(screen.height);
    console.log("Renderer resized to:", screen.width, "x", screen.height);
  });

  return (
    // You can use the signals to dynamically adjust your PixiJS components
    <Text
      text={\`Renderer Dimensions: \${rendererWidth()}x\${rendererHeight()}\`}
      position={{ x: rendererWidth() * 0.5, y: rendererHeight() * 0.5 }}
      style={{
        fill: "#ffffff",
        fontSize: 24,
      }}
    />
  );
};

export const DemoApp = () => {
  return (
    <PixiCanvas background="#1099bb">
      <MyResponsiveComponent />
    </PixiCanvas>
  );
};
`,c=t(`<h1>onResize`),l=t(`<p><code>onResize</code> runs a callback whenever the PixiJS renderer's screen size changes, which happens when the browser window resizes or when the element containing <code>PixiCanvas</code> changes size.`),u=t(`<p>Call this hook from a descendant of <code>&lt;PixiApplicationProvider /></code> or <code>&lt;PixiCanvas /></code>. Outside that context it throws.`),d=t(`<h2 id=usage>Usage`),f=t(`<p><code>onResize</code> takes one argument: a <code>resizeCallback</code> function. It receives a <code>Pixi.Rectangle</code> with the current <code>width</code>, <code>height</code>, <code>x</code>, and <code>y</code> of the renderer's screen. The callback runs immediately on hook initialization, then on every resize event.`),p=t(`<h2 id=when-to-use-it>When to use it`),m=t(`<ul><li><p>To dynamically adjust the layout or scale of your PixiJS scene in response to screen size changes.</p></li><li><p>When implementing responsive design principles for your PixiJS application.</p></li><li><p>To recenter elements or reposition UI components when the available rendering area changes.</p></li><li><p>To re-render or update certain graphics based on the new dimensions.`);function h(){return e(r,{get children(){return e(i,{get children(){return[n(c),n(l),n(u),n(d),n(f),e(o,{tone:`tip`,title:`Compatibility with usePixiScreen`,children:`The callback is scheduled via , which means it fires shortly after the renderer's resize event — not synchronously during it. This makes sure that store listeners have synchronized their reactive values before your callback runs, which avoids stale reads when you use both hooks together.`}),e(a,{code:s,title:`tsx`}),n(p),n(m)]}})}})}export{h as default};