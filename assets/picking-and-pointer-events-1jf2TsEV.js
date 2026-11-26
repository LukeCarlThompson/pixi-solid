const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/picking.demo-DJD22peZ.js","assets/web-BTd9NawZ.js","assets/dist-BWyuAgmK.js","assets/rolldown-runtime-hePW80VL.js","assets/CanvasPool-DtqSaXnh.js","assets/Filter-tmaoo_H6.js","assets/canvasUtils-BmkL-0m_.js","assets/Cache-DjsX-fAq.js","assets/RenderTargetSystem-CXGlBGSL.js","assets/GCManagedHash-iaZqB6Fm.js","assets/GraphicsContext-oKSnaaQD.js","assets/getTextureBatchBindGroup-CPqe_4fB.js","assets/getTexelRangeRects-7j664Y_P.js","assets/dist-BacaWkv9.js","assets/EventSystem-C-891Yha.js","assets/checkExtension-BGvys2BB.js","assets/Container3D-6nYjydl4.js","assets/resources-DPHE43kQ.js","assets/CubeGeometry-BthFmsAf.js","assets/orbit-camera-BY0abxTi.js"])))=>i.map(i=>d[i]);
import{J as e,L as t,M as n,a as r,c as i,d as a,ht as o,p as s,z as c}from"./web-BTd9NawZ.js";import{c as l,i as u,o as d,r as f,s as p,t as m,u as h}from"./components-BiYutFnA.js";var g=`import { PixiCanvas, usePixiScreen } from "pixi-solid";
import {
  AmbientLight,
  Camera3D,
  CubeGeometry,
  DirectionalLight,
  Material3D,
  Mesh3D,
  OrbitCamera,
  View3D,
} from "pixi-solid-3d";
import { For, createSignal } from "solid-js";

const CUBES = [
  { id: 0, x: -2.2 },
  { id: 1, x: 0 },
  { id: 2, x: 2.2 },
];

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5", "background-color": "#09090b" }}>
    <DemoContent />
  </PixiCanvas>
);

const DemoContent = () => {
  const pixiScreen = usePixiScreen();
  const [hovered, setHovered] = createSignal<number | null>(null);
  const [selected, setSelected] = createSignal<number | null>(null);

  return (
    <View3D
      width={pixiScreen.width}
      height={pixiScreen.height}
      toneMapping="aces"
      environment={{ skyColor: "#101828", groundColor: "#020617", intensity: 0.4 }}
    >
      <Camera3D x={0} y={3} z={7} lookAt={{ x: 0, y: 0, z: 0 }} />
      <OrbitCamera enableDamping={true} minDistance={4} maxDistance={20} />

      <AmbientLight intensity={0.4} />
      <DirectionalLight intensity={2.2} x={4} y={6} z={4} />

      <For each={CUBES}>
        {(cube) => (
          <Mesh3D
            label={\`cube-\${cube.id}\`}
            x={cube.x}
            scale={hovered() === cube.id ? 1.15 : 1}
            eventMode="static"
            hitVolume="geometry"
            cursor={hovered() === cube.id ? "pointer" : "default"}
            onpointerenter={() => setHovered(cube.id)}
            onpointerleave={() => setHovered((current) => (current === cube.id ? null : current))}
            onclick={() => setSelected((current) => (current === cube.id ? null : cube.id))}
          >
            <CubeGeometry width={1.4} height={1.4} depth={1.4} />
            <Material3D
              baseColor={selected() === cube.id ? 0xf97316 : 0x38bdf8}
              roughness={0.35}
              metallic={0.1}
            />
          </Mesh3D>
        )}
      </For>
    </View3D>
  );
};
`,_=t(`<h1>Picking and Pointer Events`),v=t(`<p>3D nodes take the same federated pointer events as 2D ones, plus the surface point the ray hit. A<code>View3D</code> casts a ray from the pointer into the scene and dispatches to whatever it strikes.`),y=t(`<h2 id=demo>Demo`),b=t(`<p>Move the pointer over a cube, then click it. Drag to orbit the camera.`),x=t(`<h2 id=code-example>Code example`),S=t(`<h2 id=making-a-node-pickable>Making a node pickable`),C=t(`<p><code>eventMode</code> decides whether a node takes part. The default, <code>'passive'</code>, is inert on its own:`),w=t(`<thead><tr><th><code>eventMode</code></th><th>Behaviour`),T=t(`<tbody><tr><td><code>'none'</code></td><td>Ignored entirely</td></tr><tr><td><code>'passive'</code> (default)</td><td>Not a target, but still picked under an interactive ancestor, which receives the hit with this node's surface data</td></tr><tr><td><code>'auto'</code></td><td>Picked even with no interactive ancestor, finds no target. Costs time; prefer <code>'passive'</code></td></tr><tr><td><code>'static'</code></td><td>Picked against its <code>hitVolume</code> and fires its own listeners</td></tr><tr><td><code>'dynamic'</code></td><td>As <code>'static'</code>, and picked again while the pointer is still, so a node that moves under it still gets enter and leave`),E=t(`<p>One <code>'static'</code> ancestor makes its whole subtree pickable, and the ancestor is the target, which is cheaper than marking every mesh.`),D=t(`<h2 id=what-the-pointer-hit>What the pointer hit`),O=t(`<p>Two fields carry the 3D information:`),k=t(`<p><code>event.hit3D</code> holds <code>target</code>, <code>point</code>, <code>localPoint</code>, <code>distance</code>, <code>normal</code>, <code>uv</code> and <code>triangleIndex</code>, or <code>null</code> when the ray strikes nothing. <code>event.target3D</code> names the 3D node the event is about, and is<code>null</code> when it belongs to the view, such as a click on empty space.`),A=t(`<p><code>normal</code>, <code>uv</code> and <code>triangleIndex</code> need a per-triangle hit volume:`),j=t(`<thead><tr><th><code>hitVolume</code></th><th>Picked as`),M=t(`<tbody><tr><td>default</td><td>The geometry's bounding box. Fast, no surface data</td></tr><tr><td><code>'geometry'</code></td><td>Every triangle, so hits carry <code>normal</code>, <code>uv</code> and <code>triangleIndex</code></td></tr><tr><td><code>'box'</code></td><td>A box sized from the node's width, height and depth</td></tr><tr><td><code>Box</code>, <code>Sphere</code>, <code>Geometry3D</code></td><td>That shape</td></tr><tr><td><code>null</code></td><td>Not pickable`),N=t(`<p>A plain <code>&lt;Container3D></code> has no shape of its own, so it only hears events through its children.`),P=t(`<code>event.hit3D`),F=t(`<code>lastHit.copyFrom(event.hit3D.point)`),I=t(`<h2 id=handler-names>Handler names`),L=t(`<p>Event props are lowercase, matching <code>pixi-solid</code>: <code>onclick</code>, <code>ontap</code>, <code>onpointertap</code>, <code>onpointerdown</code>,<code>onpointerenter</code>, <code>onwheel</code>, <code>oncontextmenu</code>. Capture-phase variants add <code>capture</code>, as in<code>onpointerdowncapture</code>, and pointer moves that are delivered wherever the pointer is use the global names, as in <code>onglobalpointermove</code>. See <a>Events</a> for the 2D names; 3D supports the same set plus the capture forms.`),R=t(`<p>Each event is available two ways, and both work:`),z=t(`<p>A handler prop runs before the node's <code>on()</code> listeners in every phase, so an ancestor's handler prop runs twice per event: once in the capture pass and again in the bubble pass. 2D behaves the same.`),B=t(`<p><code>pointerupoutside</code> and <code>pointerout</code> still report where the pointer is through <code>hit3D</code>, so a pressed node can tell when the release landed on a drop target.`),V=t(`<h2 id=picking-without-an-event>Picking without an event`),H=t(`<p><code>view.raycast()</code> runs the same test and dispatches nothing, which is useful for a custom cursor or a tool that highlights whatever is under the pointer:`),U=t(`<h2 id=turning-picking-off>Turning picking off`),W=t(`<p>The view starts with <code>eventMode</code> <code>'static'</code>, so it catches the pointer anywhere in its rectangle. Set the view to <code>'none'</code> or <code>'passive'</code> to switch 3D pointer events off for the whole scene. Picking costs time for every node that takes part, so leave <code>'passive'</code> everywhere you do not need events.`),G=t(`<span>`),K=i(()=>c(()=>import(`./picking.demo-DJD22peZ.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19])),{export:`Demo`},`src/demos/picking.demo.tsx`);function q(){return e(l,{get children(){return e(u,{get children(){return[s(_),s(v),s(y),s(b),e(m,{title:`picking`,get children(){return e(K,{get fallback(){return s(G)}})}}),s(x),e(d,{code:g,title:`picking.demo.tsx`}),s(S),s(C),e(f,{get children(){return[s(w),s(T)]}}),e(d,{code:`<Mesh3D eventMode="static" onclick={() => select()} />;`,title:`tsx`}),s(E),s(D),s(O),e(d,{code:`<Mesh3D
  eventMode="static"
  hitVolume="geometry"
  onpointertap={(event) => {
    const hit = event.hit3D;
    if (!hit) return;

    marker.position.copyFrom(hit.point); // where the ray landed, in world space
    console.log(hit.normal.y > 0.9 ? "floor" : "wall");
  }}
/>;`,title:`tsx`}),s(k),s(A),e(f,{get children(){return[s(j),s(M)]}}),s(N),e(p,{tone:`warning`,get children(){return[`Pixi reuses event objects. Read `,s(P),` inside the handler, and copy anything you keep —`,s(F),` — or the next event overwrites it.`]}}),s(I),(()=>{var e=s(L),t=e.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling,i=o();return a(()=>h(`/events/overview`),e=>{n(t,`href`,e),r(t,i)}),e})(),s(R),e(d,{code:`<Mesh3D onpointerenter={() => grow()} />; // handler prop
mesh.on("pointerenter", () => grow()); // emitter, via a ref`,title:`tsx`}),s(z),s(B),s(V),s(H),e(d,{code:`const view = useView3D();
const hit = view.raycast({ x: 400, y: 300 });`,title:`tsx`}),s(U),s(W)]}})}})}export{q as default};