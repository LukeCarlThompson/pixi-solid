import{J as e,L as t,a as n,p as r}from"./web-BTd9NawZ.js";import{c as i,i as a,o}from"./components-BiYutFnA.js";var s=`import { getPixiApp, Container, PixiCanvas } from "pixi-solid";

const MyComponent = () => {
  const app = getPixiApp();

  // You can now safely use the PixiJS Application instance
  console.log("PixiJS Application instance:", app);

  return <Container>{/* Your components here*/}</Container>;
};

export const DemoApp = () => {
  return (
    <PixiCanvas>
      <MyComponent />
    </PixiCanvas>
  );
};
`,c=t(`<h1>getPixiApp`),l=t(`<p>The <code>getPixiApp</code> hook accesses the root <code>PIXI.Application</code> instance from the nearest <code>PixiApplicationProvider</code> or <code>PixiCanvas</code> component. Use it when you need to interact directly with the PixiJS application, for example to access the renderer.`),u=t(`<h2 id=usage>Usage`),d=t(`<p>Call this hook from a component that is a descendant of <code>&lt;PixiApplicationProvider /></code> or <code>&lt;PixiCanvas /></code>. If you call it outside this context, it throws an error.`),f=t(`<h2 id=when-to-use-it>When to use it`),p=t(`<ul><li><p>To access the <code>PIXI.Application</code> instance for operations that <code>pixi-solid</code> components do not cover.</p></li><li><p>To get information about the PixiJS renderer, such as its dimensions, resolution, or view.`),m=t(`<h2 id=further-reading>Further reading`),h=t(`<ul><li><p>See the <a href=https://pixijs.com/8.x/guides/components/application><code>PIXI.Application</code> docs</a>.`);function g(){return e(i,{get children(){return e(a,{get children(){return[r(c),r(l),r(u),r(d),e(o,{code:s,title:`tsx`}),r(f),r(p),r(m),(()=>{var e=r(h),t=e.firstChild.firstChild.firstChild.nextSibling;return n(t),e})()]}})}})}export{g as default};