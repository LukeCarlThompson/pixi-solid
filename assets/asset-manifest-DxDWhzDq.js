import{J as e,L as t,M as n,a as r,d as i,ht as a,p as o}from"./web-BTd9NawZ.js";import{c as s,i as c,o as l,u}from"./components-BiYutFnA.js";var d=`{
  "bundles": [
    {
      "name": "game-assets",
      "assets": [
        {
          "alias": "background",
          "src": "/assets/background.png"
        },
        {
          "alias": "player_idle",
          "src": "/assets/player_idle.png"
        },
        {
          "alias": "coin",
          "src": "/assets/coin.png"
        }
      ]
    },
    {
      "name": "ui-assets",
      "assets": [
        {
          "alias": "button_play",
          "src": "/assets/button_play.png"
        },
        {
          "alias": "font_pixel",
          "src": "/assets/pixel_font.fnt"
        }
      ]
    }
  ]
}
`,f=`import { PixiCanvas, Sprite, Text } from "pixi-solid";
import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";
import { createMemo, Loading, Show } from "solid-js";

export const AssetManifestLoadingDemo = () => {
  const assetsReady = createMemo(async () => {
    // 1. Register the manifest
    await Assets.init({
      manifest: "/assets-manifest.json",
    });

    // 2. Load the bundles this scene needs
    await Assets.loadBundle("game-assets");
    await Assets.loadBundle("ui-assets");

    // \`Assets.init\` and \`loadBundle\` resolve to void, so return true to open the gate.
    return true;
  });

  return (
    // The fallback is a DOM element, so the boundary sits outside the canvas. A \`<Loading>\`
    // inside \`PixiCanvas\` would add its fallback as a Pixi child.
    <Loading fallback={<p>Loading...</p>}>
      {/* \`Show\` supplies the read the boundary waits on, then renders once the assets are ready */}
      <Show when={assetsReady()}>
        <PixiCanvas>
          {/* Read assets by the alias the manifest defines */}
          <Sprite
            texture={Assets.get<Pixi.Texture>("background")}
            anchor={0.5}
            position={{ x: 400, y: 300 }}
            scale={0.8}
          />
          <Sprite
            texture={Assets.get<Pixi.Texture>("player_idle")}
            anchor={0.5}
            position={{ x: 400, y: 300 }}
          />
          <Sprite
            texture={Assets.get<Pixi.Texture>("coin")}
            anchor={0.5}
            position={{ x: 450, y: 250 }}
          />
          <Sprite
            texture={Assets.get<Pixi.Texture>("button_play")}
            anchor={0.5}
            position={{ x: 400, y: 450 }}
          />
          <Text
            text="Game Loaded!"
            style={{ fontFamily: "font_pixel", fontSize: 32, fill: 0xffffff }}
            position={{ x: 200, y: 50 }}
          />
        </PixiCanvas>
      </Show>
    </Loading>
  );
};
`,p=t(`<h1>Loading an Asset Manifest`),m=t(`<p>For applications with many assets, managing individual asset loading can become cumbersome. PixiJS provides an <strong>Asset Manifest</strong> system that lets you define all your assets, their paths, and groups in a single JSON file.`),h=t(`<p>Use PixiJS <a href=https://pixijs.io/assetpack/>AssetPack</a> to generate the manifest for you.`),g=t(`<p>This guide demonstrates how to load an entire asset manifest and then access the loaded assets within your <code>pixi-solid</code> application.`),_=t(`<h2 id=what-is-an-asset-manifest>What is an Asset Manifest?`),v=t(`<p>An asset manifest is a JSON file that describes your application's assets. It typically includes:`),y=t(`<ul><li><p><strong><code>bundles</code></strong>: Groups of assets that can be loaded together. This is extremely useful for loading assets required for a specific scene or component.</p></li><li><p><strong><code>assets</code></strong>: Individual assets with their unique <code>alias</code> (how you refer to them in code) and <code>src</code> (their file path).`),b=t(`<h3 id=example-assets-manifestjson>Example <code>assets-manifest.json`),x=t(`<p>Let's assume you have an <code>assets-manifest.json</code> file in your <code>public</code> folder like this:`),S=t(`<p>Loading a manifest resolves to <code>void</code>, so the memo reports when the bundles are ready rather than returning the assets. Components then read each asset by its alias as they need it.`),C=t(`<h3 id=example-loading-assets-from-a-manifest>Example: Loading Assets from a Manifest`),w=t(`<p>The boundary renders its <code>fallback</code> while the bundles load, so the page can show a DOM loading indicator before any Pixi object exists.`),T=t(`<p>When a scene needs only a few known assets, return them from the memo and read them directly instead. See <a>loading individual assets</a>.`),E=t(`<h2 id=further-reading>Further reading`),D=t(`<ul><li><p>Read more about <a href=https://pixijs.com/8.x/guides/components/assets>PixiJS Assets Management and Manifests</a> in the official PixiJS documentation.`);function O(){return e(s,{get children(){return e(c,{get children(){return[o(p),o(m),(()=>{var e=o(h),t=e.firstChild.nextSibling;return r(t),e})(),o(g),o(_),o(v),o(y),o(b),o(x),e(l,{code:d,lang:`json`,title:`json`}),o(S),o(C),e(l,{code:f,title:`tsx`}),o(w),(()=>{var e=o(T),t=e.firstChild.nextSibling,s=a();return i(()=>u(`/asset-loading/individual-assets`),e=>{n(t,`href`,e),r(t,s)}),e})(),o(E),(()=>{var e=o(D),t=e.firstChild.firstChild.firstChild.nextSibling;return r(t),e})()]}})}})}export{O as default};