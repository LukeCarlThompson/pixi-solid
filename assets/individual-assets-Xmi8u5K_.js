import{J as e,L as t,M as n,a as r,d as i,ht as a,p as o}from"./web-BTd9NawZ.js";import{c as s,i as c,o as l,u}from"./components-BiYutFnA.js";var d=`import { PixiCanvas, Sprite } from "pixi-solid";
import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";
import { createMemo, Loading } from "solid-js";

export const IndividualAssetLoadingDemo = () => {
  // Load the texture once. Reading the memo suspends, so the boundary below holds the scene
  // until the texture arrives.
  const backgroundImage = createMemo(async () => {
    const texture = await Assets.load<Pixi.Texture>("/background.png");
    return texture;
  });

  return (
    <PixiCanvas>
      <Loading>
        <Sprite
          texture={backgroundImage()}
          anchor={0.5}
          position={{ x: 400, y: 300 }}
          scale={0.5}
        />
      </Loading>
    </PixiCanvas>
  );
};
`,f=t(`<h1>Loading Individual Assets`),p=t(`<p>Async work is a computation that returns a Promise. Return one from <code>createMemo</code> and read it inside a <code>&lt;Loading></code> boundary. Pair it with the PixiJS <code>Assets</code> class to load assets.`),m=t(`<h2 id=example-loading-a-single-image>Example: Loading a Single Image`),h=t(`<p>This example loads a single background image for a scene.`),g=t(`<p>Because the memo returns the texture, reading it both waits for the load and supplies the value, and no <code>&lt;Show></code> is needed. When a load produces many assets that the scene reads individually, gate it with a boolean instead. See <a>asset manifests</a>.`),_=t(`<h2 id=further-reading>Further reading`),v=t(`<ul><li><p>See <a>asset manifests</a> for loading several assets together.</p></li><li><p>See the <a href=https://pixijs.com/8.x/guides/components/assets>PixiJS Assets guide</a> for details.`);function y(){return e(s,{get children(){return e(c,{get children(){return[o(f),o(p),o(m),o(h),e(l,{code:d,title:`tsx`}),(()=>{var e=o(g),t=e.firstChild.nextSibling.nextSibling.nextSibling,s=a();return i(()=>u(`/asset-loading/asset-manifest`),e=>{n(t,`href`,e),r(t,s)}),e})(),o(_),(()=>{var e=o(v),t=e.firstChild,s=t.firstChild.firstChild.nextSibling,c=t.nextSibling.firstChild.firstChild.nextSibling,l=a();return r(c),i(()=>u(`/asset-loading/asset-manifest`),e=>{n(s,`href`,e),r(s,l)}),e})()]}})}})}export{y as default};