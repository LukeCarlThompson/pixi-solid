import{J as e,L as t,p as n}from"./web-BTd9NawZ.js";import{c as r,i,o as a}from"./components-BiYutFnA.js";var o=`import { onTick, PixiCanvas, Sprite } from "pixi-solid";
import { Texture } from "pixi.js";
import type * as Pixi from "pixi.js";
import { createSignal } from "solid-js";

const RotatingSpriteBySignal = (props: { texture: Pixi.Texture }) => {
  const [rotation, setRotation] = createSignal(0);

  onTick((ticker) => {
    // Set a signal every frame
    setRotation((r) => r + 0.01 * ticker.deltaTime);
  });

  return <Sprite texture={props.texture} anchor={0.5} rotation={rotation()} />;
};

const RotatingSprite = (props: { texture: Pixi.Texture }) => {
  return (
    <Sprite
      texture={props.texture}
      anchor={0.5}
      ref={(sprite) => {
        onTick((ticker) => {
          // Update rotation directly every frame
          // Slightly more efficient but limited in scope
          sprite.rotation = sprite.rotation + 0.01 * ticker.deltaTime;
        });
      }}
    />
  );
};

export const DemoApp = () => {
  return (
    <PixiCanvas>
      <RotatingSpriteBySignal texture={Texture.WHITE} />
    </PixiCanvas>
  );
};
`,s=t(`<h1>onTick`),c=t(`<p>The <code>onTick</code> hook registers a callback function that runs on every frame of the PixiJS ticker.<code>onTick</code> automatically adds the callback to the ticker when it first runs and removes it when the hook's owning scope is cleaned up.`),l=t(`<p>Call <code>onTick</code> within a SolidJS tracking scope. This scope must be a descendant of <code>&lt;PixiApplicationProvider /></code>, <code>&lt;PixiCanvas /></code>, or <code>&lt;TickerProvider /></code>.`),u=t(`<h2 id=usage>Usage`),d=t(`<h2 id=when-to-use-it>When to use it`),f=t(`<ul><li><p>To subscribe to the ticker for the lifetime of a SolidJS tracking scope (component or <code>createEffect</code>).</p></li><li><p>To run code on each ticker update without managing <code>ticker.add</code> and <code>ticker.remove</code> directly.</p></li><li><p>To create continuous animations, movement, or other frame-by-frame updates within a component.`);function p(){return e(r,{get children(){return e(i,{get children(){return[n(s),n(c),n(l),n(u),e(a,{code:o,title:`tsx`}),n(d),n(f)]}})}})}export{p as default};