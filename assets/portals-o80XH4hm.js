import{J as e,L as t,M as n,a as r,d as i,ht as a,p as o}from"./web-BTd9NawZ.js";import{c as s,i as c,o as l,s as u,u as d}from"./components-BiYutFnA.js";var f=`import { FlatMaterial, Mesh3D as Mesh3DClass, PlaneGeometry } from "@pixi/3d";
import { PortalPass, PortalMaterial as PortalMaterialClass } from "@pixi/3d/extras";
import { Mesh3D, PortalMaterial, View3D } from "pixi-solid-3d";
import { RenderTexture } from "pixi.js";

const WIDTH = 800;
const HEIGHT = 600;

// 1. The feed, sized to the view.
const feed = RenderTexture.create({ width: WIDTH, height: HEIGHT, format: "rgba16float" });

// 2. Both quads. They must share a scale.
const geometry = new PlaneGeometry({ width: 3, height: 4 });
const entry = new Mesh3DClass({ geometry, material: new PortalMaterialClass({ texture: feed }) });
const exit = new Mesh3DClass({ geometry, material: new FlatMaterial() });
exit.position.set(60, 1, 0);

// 3. The pass, which needs both quads and the feed.
const portal = new PortalPass({ entry, exit, texture: feed });

<View3D width={WIDTH} height={HEIGHT} passes={[portal]}>
  <Mesh3D as={entry} />
  <Mesh3D as={exit} />
</View3D>;
`,p=t(`<h1>Portals and Render Textures`),m=t(`<p><code>&lt;PortalMaterial></code> shows a render texture on a surface. That covers two jobs:`),h=t(`<ul><li><p><strong>A window onto another view</strong> — a security monitor, a picture frame, a teleporter face. You supply a render texture from anywhere, such as a second camera.</p></li><li><p><strong>A real portal</strong> — a doorway that leads somewhere else in the same scene. This needs the pass below as well.`),g=t(`<p>The render texture is always yours: you create it, size it, and destroy it.`),_=t(`<h2 id=showing-a-render-texture>Showing a render texture`),v=t(`<p><code>texture</code> is a shortcut for the material's <code>portal</code> slot, and <code>baseColor</code> tints it. Leave <code>texture</code> out and the surface shows plain <code>baseColor</code> until you assign <code>material.textures.portal</code>.`),y=t(`<p><code>&lt;PortalMaterial></code> is written as a child of <code>&lt;Mesh3D></code>, so it is created, updated and destroyed with the mesh. See <a>Meshes and Materials</a> for the ownership rules the other materials follow.`),b=t(`<h2 id=a-real-portal>A real portal`),x=t(`<p>A portal is two quads facing their local <code>+Z</code>:`),S=t(`<ul><li><p><strong>entry</strong> — the surface the viewer looks through, drawn with <code>&lt;PortalMaterial></code>.</p></li><li><p><strong>exit</strong> — the quad on the far side. The room the portal shows sits in front of it.`),C=t(`<p>Each frame, <code>PortalPass</code> puts a camera behind the exit where the viewer is in front of the entry, renders the scene through it into the feed, and the entry shows the result. Because the entry shows that image at the viewer's own screen position, it reads as an opening rather than a picture.`),w=t(`<p>The meshes are built as instances because the pass needs them at construction. <code>as</code> adopts them, so the components add them to the view and leave destroying them to you. Note the two imports: <code>Mesh3DClass</code> is <code>@pixi/3d</code>'s class, while <code>&lt;Mesh3D></code> is the component.`),T=t(`<p>Three rules decide whether it looks right:`),E=t(`<ul><li><p><strong>Size the feed to the view, and resize it with the view.</strong> Another aspect ratio stretches the far side, and too few pixels blur it.</p></li><li><p><strong>Give both quads the same <code>scale</code>.</strong> A scale only one of them has carries into the portal camera and distorts the far side.</p></li><li><p><strong>Use a perspective camera and an unrotated view.</strong> With an orthographic camera the far side does not show, and in a rotated view the image does not line up with the opening.`),D=t(`<p><code>PortalPass</code> runs at the <code>'beforeOpaque'</code> stage, so its position in <code>passes</code> does not matter; it always finishes before the scene draws the entry.`),O=t(`<code>portal.camera`),k=t(`<code>PortalFeedPass`),A=t(`<code>PortalPass`),j=t(`<h2 id=disposing>Disposing`),M=t(`<p><code>PortalPass</code> frees its own resources when the view is destroyed. The feed render texture is yours, so destroy it when the scene unloads:`);function N(){return e(s,{get children(){return e(c,{get children(){return[o(p),o(m),o(h),o(g),o(_),e(l,{code:`import { FlatMaterial, PlaneGeometry } from "@pixi/3d";
import { Mesh3D } from "pixi-solid-3d";
import { PortalMaterial } from "pixi-solid-3d";

const feed = RenderTexture.create({ width: 512, height: 512 });

<Mesh3D geometry={geometry}>
  <PortalMaterial texture={feed} baseColor={0xbfdcff} />
</Mesh3D>;`,title:`tsx`}),o(v),(()=>{var e=o(y),t=e.firstChild.nextSibling.nextSibling.nextSibling.nextSibling,s=a();return i(()=>d(`/3d/meshes-and-materials`),e=>{n(t,`href`,e),r(t,s)}),e})(),o(b),o(x),o(S),o(C),e(l,{code:f,title:`tsx`}),o(w),o(T),o(E),o(D),e(u,{tone:`note`,get children(){return[`The far side draws only opaque and transparent meshes, with no sky. Enclose the far room, or add a background pass to `,o(O),`. The pass also skips frames where the entry is hidden, off screen or seen from behind, and a portal that can see itself updates one frame late per level.`,o(k),` is internal — `,o(A),` builds it for you.`]}}),o(j),o(M),e(l,{code:`onCleanup(() => feed.destroy(true));`,title:`tsx`})]}})}})}export{N as default};