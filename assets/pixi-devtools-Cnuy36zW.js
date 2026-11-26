import{J as e,L as t,a as n,p as r}from"./web-BTd9NawZ.js";import{c as i,i as a,o}from"./components-BiYutFnA.js";var s=`import { PixiCanvas, getPixiApp, Container } from "pixi-solid";
import { onCleanup } from "solid-js";

const DemoComponent = () => {
  // We have access to the Pixi Application instance using the \`getPixiApp\` function.
  const pixiApp = getPixiApp();
  // @ts-ignore — __PIXI_DEVTOOLS__ is not in the type definitions
  globalThis.__PIXI_DEVTOOLS__ = {
    app: pixiApp,
  };
  onCleanup(() => {
    // @ts-ignore — __PIXI_DEVTOOLS__ is not in the type definitions
    globalThis.__PIXI_DEVTOOLS__ = undefined;
  });

  return <Container>{/* Your pixi-solid content goes here */}</Container>;
};

/**
 * The DemoApp component sets up the Pixi Application
 * and can be mounted anywhere in your SolidJS app.
 * It will render a Canvas element with a Pixi Stage inside it.
 */
export const DemoApp = () => {
  return (
    <PixiCanvas>
      <DemoComponent />
    </PixiCanvas>
  );
};
`,c=t(`<h1>Pixi Devtools`),l=t(`<h2 id=attach-to-the-window>Attach to the window`),u=t(`<p>The <a href=https://pixijs.io/devtools/>PixiJS Devtools</a> are very useful for debugging and inspecting your PixiJS applications. For the tools to find your application all you need to do it attach it to the window.`);function d(){return e(i,{get children(){return e(a,{get children(){return[r(c),r(l),(()=>{var e=r(u),t=e.firstChild.nextSibling;return n(t),e})(),e(o,{code:s,title:`tsx`})]}})}})}export{d as default};