const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/container-texture.demo-CTT-BmdD.js","assets/web-BTd9NawZ.js","assets/CanvasPool-DtqSaXnh.js","assets/rolldown-runtime-hePW80VL.js","assets/dist-BWyuAgmK.js","assets/Filter-tmaoo_H6.js","assets/canvasUtils-BmkL-0m_.js","assets/Cache-DjsX-fAq.js","assets/RenderTargetSystem-CXGlBGSL.js","assets/GCManagedHash-iaZqB6Fm.js","assets/GraphicsContext-oKSnaaQD.js","assets/getTextureBatchBindGroup-CPqe_4fB.js","assets/getTexelRangeRects-7j664Y_P.js","assets/dist-BacaWkv9.js","assets/EventSystem-C-891Yha.js","assets/checkExtension-BGvys2BB.js","assets/Container3D-6nYjydl4.js","assets/resources-DPHE43kQ.js","assets/CubeGeometry-BthFmsAf.js","assets/orbit-camera-BY0abxTi.js"])))=>i.map(i=>d[i]);
import{J as e,L as t,c as n,p as r,z as i}from"./web-BTd9NawZ.js";import{c as a,i as o,o as s,r as c,t as l}from"./components-BiYutFnA.js";var u=`import { FlatMaterial, PlaneGeometry } from "@pixi/3d";
import { Container, Text } from "pixi-solid";
import { Mesh3D, createContainerTexture } from "pixi-solid-3d";

const label = createContainerTexture(
  <Container>
    <Text text="Now serving" style={{ fontSize: 48, fill: "#ffffff" }} />
  </Container>,
  { width: 512, height: 128 },
);

<Mesh3D
  geometry={new PlaneGeometry({ width: 4, height: 1 })}
  material={new FlatMaterial({ baseColorTexture: label })}
/>;
`,d=`import { Container, Text } from "pixi-solid";
import { createContainerTexture } from "pixi-solid-3d";
import { createEffect, createSignal } from "solid-js";
const [label, setLabel] = createSignal("Idle");

const panel = createContainerTexture(
  <Container>
    <Text text={label()} style={{ fontSize: 40 }} />
  </Container>,
  { width: 512, height: 128, autoUpdate: false },
);

// The first render already happened; redraw whenever the text changes.
createEffect(
  () => label(),
  () => panel.render(),
);
`,f=`import { Container, Sprite, Text } from "pixi-solid";
import { onTick, PixiCanvas, usePixiScreen } from "pixi-solid";
import {
  AmbientLight,
  Camera3D,
  createContainerTexture,
  DirectionalLight,
  FlatMaterial,
  Mesh3D,
  OrbitCamera,
  PlaneGeometry,
  View3D,
} from "pixi-solid-3d";
import { Texture } from "pixi.js";
import { createSignal } from "solid-js";

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5", "background-color": "#09090b" }}>
    <DemoContent />
  </PixiCanvas>
);

const DemoContent = () => {
  const pixiScreen = usePixiScreen();

  const [uptime, setUptime] = createSignal(0);
  const [calls, setCalls] = createSignal(128);

  // The 2D content is ordinary pixi-solid JSX. Everything inside stays reactive.
  const panel = createContainerTexture(
    <Container>
      <Sprite texture={Texture.WHITE} width={512} height={200} tint={0x0b1220} />
      <Sprite texture={Texture.WHITE} width={512} height={8} y={0} tint={0x38bdf8} />
      <Text
        text="RENDER NODE 04"
        x={28}
        y={34}
        style={{ fontFamily: "monospace", fontSize: 30, fill: "#7dd3fc", letterSpacing: 2 }}
      />
      <Text
        text={\`uptime \${uptime().toFixed(1)}s\`}
        x={28}
        y={92}
        style={{ fontFamily: "monospace", fontSize: 34, fill: "#e2e8f0" }}
      />
      <Text
        text={\`draw calls \${calls()}\`}
        x={28}
        y={140}
        style={{ fontFamily: "monospace", fontSize: 26, fill: "#94a3b8" }}
      />
    </Container>,
    { width: 512, height: 200 },
  );

  let elapsed = 0;
  let lastCallTick = 0;

  onTick((ticker) => {
    elapsed += ticker.deltaMS / 1000;
    setUptime(elapsed);

    // Something changing on the 2D side proves the texture is live, not a snapshot.
    if (elapsed - lastCallTick > 0.9) {
      lastCallTick = elapsed;
      setCalls((count) => count + 1);
    }
  });

  return (
    <View3D
      width={pixiScreen.width}
      height={pixiScreen.height}
      toneMapping="aces"
      environment={{ skyColor: "#1e293b", groundColor: "#020617", intensity: 0.6 }}
    >
      <Camera3D x={0} y={1.6} z={5} lookAt={{ x: 0, y: 1.3, z: 0 }} />
      <OrbitCamera
        enableDamping={true}
        minDistance={3}
        maxDistance={14}
        target={{ x: 0, y: 1.3, z: 0 }}
      />

      <AmbientLight intensity={0.4} />
      <DirectionalLight intensity={2} x={3} y={5} z={4} lookAt={{ x: 0, y: 1.3, z: 0 }} />

      {/* The texture is a \`Texture\`, so any material slot takes it. */}
      <Mesh3D y={1.3} scale={1.4}>
        <PlaneGeometry width={3} height={1.17} />
        <FlatMaterial baseColorTexture={panel} />
      </Mesh3D>
    </View3D>
  );
};
`,p=t(`<h1>2D Content on a 3D Surface`),m=t(`<p>A 3D material can sample any texture, including one showing live 2D content. Use it for in-world screens, signs, labels, scoreboards, or UI panels attached to a model.`),h=t(`<p><code>@pixi/3d</code> ships <code>ContainerTexture</code> for this, but using it directly has three sharp edges. Pose the renderer, remember that its <code>autoUpdate</code> runs on <code>Ticker.shared</code> rather than the ticker your app runs, and free the render target yourself. <code>createContainerTexture</code> handles all three.`),g=t(`<p>A live 2D panel on a 3D surface. The uptime and draw-call lines update every frame:`),_=t(`<h2 id=building-a-texture>Building a texture`),v=t(`<p>The hook takes pixi-solid JSX and returns a texture. The JSX arrives already filled with its children, because the parent component binds them:`),y=t(`<p>The hook must run inside a <code>&lt;PixiCanvas></code> or <code>&lt;PixiApplicationProvider></code>, because it reads the renderer and the ticker from context. It throws a clear error if neither is present.`),b=t(`<p>Two constraints come from <code>ContainerTexture</code> itself:`),x=t(`<ul><li><p>It draws <strong>one</strong> container, so wrap several roots in a <code>&lt;Container></code>.</p></li><li><p>The container is built once. Structure inside it (<code>&lt;Show></code>, <code>&lt;For></code>) stays reactive; replacing the whole tree needs a new texture.`),S=t(`<h2 id=options>Options`),C=t(`<thead><tr><th>Option</th><th>Default</th><th>Notes`),w=t(`<tbody><tr><td><code>width</code> / <code>height</code></td><td>content bounds</td><td>Pass both for text, whose bounds settle after its first layout</td></tr><tr><td><code>resolution</code></td><td><code>1</code></td><td>Raise it for content shown close to the camera</td></tr><tr><td><code>antialias</code></td><td><code>false</code></td><td>Smooths scaled content</td></tr><tr><td><code>clearColor</code></td><td>transparent</td><td>What shows where the content does not cover</td></tr><tr><td><code>autoUpdate</code></td><td><code>true</code></td><td>Re-render every frame from the ticker in scope`),T=t(`<h2 id=reactivity>Reactivity`),E=t(`<p><strong>You do not call <code>render()</code>.</strong> Content updates are drawn on the next frame, because <code>autoUpdate</code>defaults to <code>true</code>.`),D=t(`<p>The content is mounted once, like any JSX tree, so internal structure stays reactive while the top-level tree does not rebuild:`),O=t(`<p><code>score()</code> changing updates the text, and the next frame draws it. Swapping the entire tree needs a new texture.`),k=t(`<h2 id=rendering-only-when-it-changes>Rendering only when it changes`),A=t(`<p>Re-rendering costs one pass over the content every frame. For a texture that changes once a minute, such as a clock or a scoreboard nobody is looking at, turn the loop off and render on demand:`),j=t(`<p><code>defer: true</code> skips the initial run, since the texture was drawn when it was built. This is an optimisation, not the normal path: leave <code>autoUpdate</code> on until a profile suggests otherwise.`),M=t(`<h2 id=orientation>Orientation`),N=t(`<p>The image is stored the other way up from an image texture. It shows upright on a default<code>PlaneGeometry</code> or the sides of a <code>CubeGeometry</code>, and upside down where an image would be upright: a<code>SphereGeometry</code>, a plane with <code>flipV</code>, a loaded model, or a 2D <code>Sprite</code>. On those, flip the object that shows it:`),P=t(`<h2 id=cleanup>Cleanup`),F=t(`<p>The hook destroys the render target when its component unmounts, and leaves your content alone, since those components clean up after themselves. If you need the texture to outlive the component, use<code>new ContainerTexture(...)</code> directly and drive it yourself.`),I=t(`<span>`),L=n(()=>i(()=>import(`./container-texture.demo-CTT-BmdD.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19])),{export:`Demo`},`src/demos/container-texture.demo.tsx`);function R(){return e(a,{get children(){return e(o,{get children(){return[r(p),r(m),r(h),r(g),e(l,{title:`container-texture`,get children(){return e(L,{get fallback(){return r(I)}})}}),e(s,{code:f,title:`container-texture.demo.tsx`}),r(_),r(v),e(s,{code:u,title:`tsx`}),r(y),r(b),r(x),r(S),e(c,{get children(){return[r(C),r(w)]}}),r(T),r(E),r(D),e(s,{code:`const [score, setScore] = createSignal(0);

const board = createContainerTexture(<Text text={\`Score: \${score()}\`} />, {
  width: 256,
  height: 64,
});`,title:`tsx`}),r(O),r(k),r(A),e(s,{code:d,title:`tsx`}),r(j),r(M),r(N),e(s,{code:`sprite.scale.y = -1;
sprite.anchor.y = 1;`,title:`tsx`}),r(P),r(F)]}})}})}export{R as default};