import{J as e,L as t,a as n,p as r}from"./web-BTd9NawZ.js";import{c as i,i as a,o}from"./components-BiYutFnA.js";var s=`import { getRenderer, Container, PixiCanvas } from "pixi-solid";

const MyComponent = () => {
  const renderer = getRenderer();

  // You can now safely use the PixiJS Renderer instance
  console.log("Renderer resolution:", renderer.resolution);
  console.log("Renderer view size:", renderer.width, renderer.height);

  return <Container>{/* Your components here*/}</Container>;
};

export const DemoApp = () => {
  return (
    <PixiCanvas>
      <MyComponent />
    </PixiCanvas>
  );
};
`,c=t(`<h1>getRenderer`),l=t(`<p>The <code>getRenderer</code> hook provides a way to access the root <code>Pixi.Renderer</code> instance created by the <code>PixiApplicationProvider</code> or <code>PixiCanvas</code> component. This is useful when you need to interact directly with the PixiJS renderer, for example, to access renderer properties or perform low-level rendering operations.`),u=t(`<h2 id=usage>Usage`),d=t(`<p>This hook must be called from a component that is a descendant of the <code>&lt;PixiApplicationProvider /></code> or <code>&lt;PixiCanvas /></code> component. If used outside of this context, it will throw an error.`),f=t(`<h2 id=when-to-use-it>When to use it`),p=t(`<ul><li><p>When you need direct access to the <code>Pixi.Renderer</code> instance for advanced rendering operations.</p></li><li><p>To query renderer properties such as resolution, or rendering context.</p></li><li><p>When you need to perform operations that are specific to the renderer and not covered by other <code>pixi-solid</code> utilities.`),m=t(`<h2 id=relationship-to-other-hooks>Relationship to other hooks`),h=t(`<ul><li><p><code>getPixiApp</code> gives you access to the <code>Pixi.Application</code> instance, which contains the renderer as a property. You can access the renderer via <code>getPixiApp().renderer</code>.</p></li><li><p><code>getRenderer</code> is a convenience hook that directly accesses the renderer without needing to go through the application instance.`),g=t(`<h2 id=further-reading>Further reading`),_=t(`<ul><li><p>Read more about the <a href=https://pixijs.com/8.x/guides/components/renderers><code>Pixi.Renderer</code> class</a> in the PixiJS documentation.`);function v(){return e(i,{get children(){return e(a,{get children(){return[r(c),r(l),r(u),r(d),e(o,{code:s,title:`tsx`}),r(f),r(p),r(m),r(h),r(g),(()=>{var e=r(_),t=e.firstChild.firstChild.firstChild.nextSibling;return n(t),e})()]}})}})}export{v as default};