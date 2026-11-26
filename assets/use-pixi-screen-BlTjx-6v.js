import{J as e,L as t,p as n}from"./web-BTd9NawZ.js";import{c as r,i,o as a,r as o}from"./components-BiYutFnA.js";var s=t(`<h1>usePixiScreen`),c=t(`<p>The <code>usePixiScreen</code> hook returns a reactive object containing the current dimensions of the Pixi application's screen. Its properties automatically update when the renderer's screen size changes, allowing you to build responsive PixiJS applications that react to resizing events.`),l=t(`<p>It must be called within a component or another hook that is a descendant of either<code>&lt;PixiApplicationProvider /></code> or <code>&lt;PixiCanvas /></code>.`),u=t(`<h2 id=reactive-properties>Reactive properties`),d=t(`<p>The returned object provides the following properties, all of which update automatically on resize:`),f=t(`<thead><tr><th>Property</th><th>Type</th><th>Description`),p=t(`<tbody><tr><td><code>width</code></td><td><code>number</code></td><td>Screen width in pixels</td></tr><tr><td><code>height</code></td><td><code>number</code></td><td>Screen height in pixels</td></tr><tr><td><code>x</code></td><td><code>number</code></td><td>Screen x-offset</td></tr><tr><td><code>y</code></td><td><code>number</code></td><td>Screen y-offset</td></tr><tr><td><code>left</code></td><td><code>number</code></td><td>Alias for <code>x</code></td></tr><tr><td><code>right</code></td><td><code>number</code></td><td><code>x + width</code></td></tr><tr><td><code>top</code></td><td><code>number</code></td><td>Alias for <code>y</code></td></tr><tr><td><code>bottom</code></td><td><code>number</code></td><td><code>y + height`),m=t(`<h2 id=usage>Usage`),h=t(`<h2 id=when-to-use-it>When to use it`),g=t(`<ul><li><p>When you need to get the current dimensions of the PixiJS renderer screen.</p></li><li><p>When you want to create components that automatically adapt to changes in the Pixi application's size.</p></li><li><p>For positioning elements relative to the screen dimensions.</p></li><li><p>As a reactive source for calculations based on the application's viewport.`);function _(){return e(r,{get children(){return e(i,{get children(){return[n(s),n(c),n(l),n(u),n(d),e(o,{get children(){return[n(f),n(p)]}}),n(m),e(a,{code:`import { PixiCanvas, Sprite, usePixiScreen } from "pixi-solid";
import type * as Pixi from "pixi.js";
import { createSignal } from "solid-js";

const ResponsiveSprite = (props: { texture: Pixi.Texture }) => {
  const screen = usePixiScreen();

  return (
    <Sprite
      texture={props.texture}
      anchor={0.5}
      x={screen.width / 2}
      y={screen.height / 2}
      scale={
        Math.min(screen.width / props.texture.width, screen.height / props.texture.height) * 0.5
      }
    />
  );
};

const App = () => (
  <PixiCanvas>
    <ResponsiveSprite texture={Pixi.Texture.WHITE} />
  </PixiCanvas>
);`,title:`tsx`}),n(h),n(g)]}})}})}export{_ as default};