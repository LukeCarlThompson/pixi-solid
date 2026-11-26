const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/world-to-screen.demo-C4mBLMqX.js","assets/web-BTd9NawZ.js","assets/dist-BWyuAgmK.js","assets/rolldown-runtime-hePW80VL.js","assets/CanvasPool-DtqSaXnh.js","assets/Filter-tmaoo_H6.js","assets/canvasUtils-BmkL-0m_.js","assets/Cache-DjsX-fAq.js","assets/RenderTargetSystem-CXGlBGSL.js","assets/GCManagedHash-iaZqB6Fm.js","assets/GraphicsContext-oKSnaaQD.js","assets/getTextureBatchBindGroup-CPqe_4fB.js","assets/getTexelRangeRects-7j664Y_P.js","assets/dist-BacaWkv9.js","assets/EventSystem-C-891Yha.js","assets/checkExtension-BGvys2BB.js","assets/Container3D-6nYjydl4.js","assets/resources-DPHE43kQ.js","assets/CubeGeometry-BthFmsAf.js"])))=>i.map(i=>d[i]);
import{J as e,L as t,c as n,p as r,z as i}from"./web-BTd9NawZ.js";import{c as a,i as o,o as s,r as c,s as l,t as u}from"./components-BiYutFnA.js";var d=`import { Container, Graphics, onTick, PixiCanvas, Text, usePixiScreen } from "pixi-solid";
import {
  Camera3D,
  Container3D,
  CubeGeometry,
  DirectionalLight,
  Material3D,
  Mesh3D,
  useWorldToScreen,
  View3D,
  View3DProvider,
} from "pixi-solid-3d";
import { TextStyle } from "pixi.js";
import { createStore, Show } from "solid-js";

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5", "background-color": "#121214" }}>
    <Scene />
  </PixiCanvas>
);

/**
 * The provider owns the View3D, so the viewport configuration lives here rather than on the
 * <View3D> that mounts it into the 2D scene graph.
 */
const Scene = () => {
  const pixiScreen = usePixiScreen();

  return (
    <View3DProvider
      width={pixiScreen.width}
      height={pixiScreen.height}
      toneMapping="aces"
      environment={{ skyColor: 0x88ccff, groundColor: 0x553311 }}
    >
      <SceneContent />
    </View3DProvider>
  );
};

const SceneContent = () => {
  // The cube's transform is the source of truth. Nothing is mutated imperatively: the 3D node
  // renders from this state, and the 2D overlay projects the very same position.
  const [cube, setCube] = createStore({
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
  });

  // Phase for the oscillating \`x\`, kept out of the state we render from.
  let elapsed = 0;
  onTick((ticker) => {
    elapsed += 0.02 * ticker.deltaTime;
    setCube((state) => {
      state.position.x = Math.sin(elapsed) * 2;
      state.position.y = 0;
      state.position.z = 0;
      state.rotation.x += 0.005 * ticker.deltaTime;
      state.rotation.y += 0.01 * ticker.deltaTime;
    });
  });

  // No refs or imperative reads: the overlay reads the same store the 3D node renders from.
  const screenPos = useWorldToScreen(() => cube.position);

  return (
    <>
      <View3D>
        <Camera3D x={0} y={3} z={6} lookAt={{ x: 0, y: 0, z: 0 }} />

        <DirectionalLight
          intensity={2.5}
          color={0xffffff}
          x={5}
          y={8}
          z={5}
          lookAt={{ x: 0, y: 0, z: 0 }}
        />

        <Container3D
          x={cube.position.x}
          y={cube.position.y}
          z={cube.position.z}
          rotationX={cube.rotation.x}
          rotationY={cube.rotation.y}
          rotationZ={cube.rotation.z}
        >
          <Mesh3D>
            <CubeGeometry width={1.5} height={1.5} depth={1.5} />
            <Material3D baseColor={0x38bdf8} roughness={0.2} />
          </Mesh3D>
        </Container3D>
      </View3D>

      {/* Sibling 2D overlay — same provider, so it resolves the same View3D */}
      <Show when={screenPos().visible}>
        <Container x={screenPos().x} y={screenPos().y - 60}>
          <Graphics
            ref={(g) => {
              g.roundRect(-50, -16, 100, 32, 8).fill({ color: 0x000000, alpha: 0.7 });
            }}
          />
          <Text
            text="3D Cube"
            anchor={0.5}
            style={
              new TextStyle({
                fill: "#ffffff",
                fontSize: 14,
                fontWeight: "bold",
              })
            }
          />
        </Container>
      </Show>
    </>
  );
};

export default Demo;
`,f=t(`<h1>useWorldToScreen`),p=t(`<p><code>useWorldToScreen</code> is a reactive SolidJS hook that takes a 3D object or coordinate and returns a reactive 2D screen position <code>{ x, y, visible }</code> synchronized to the contextual Pixi ticker.`),m=t(`<p>This makes attaching 2D HUD elements (health bars, name tags, targeting reticles, indicators) over 3D scene objects effortless and fully declarative.`),h=t(`<h2 id=interactive-demo>Interactive Demo`),g=t(`<p>Notice how the 2D label tag stays locked above the rotating and oscillating 3D cube, even as you rotate and zoom the scene with <code>&lt;OrbitCamera></code>:`),_=t(`<h2 id=code-example>Code Example`),v=t(`<h2 id=usage-with-view3dprovider>Usage with View3DProvider`),y=t(`<p>When rendering 2D overlays alongside a <code>&lt;View3D></code> viewport, wrap both the 3D viewport and your 2D HUD components in a <code>&lt;View3DProvider></code>.`),b=t(`<p>The provider <strong>creates and owns</strong> the <code>View3D</code>; the <code>&lt;View3D></code> beneath it just mounts that instance into the 2D scene graph. Viewport configuration therefore belongs on the provider, not on <code>&lt;View3D></code>.`),x=t(`<h2 id=parameters>Parameters`),S=t(`<thead><tr><th>Parameter</th><th>Type</th><th>Description`),C=t(`<tbody><tr><td><code>target</code></td><td><code>Container3D | PointData3D | Accessor&lt;...></code></td><td>The 3D container or coordinate to project`),w=t(`<h2 id=context-requirement>Context requirement`),T=t(`<p><code>useWorldToScreen</code> reads the ambient <code>View3DContext</code>. Call it inside <code>&lt;View3D></code>, or anywhere within a <code>&lt;View3DProvider></code> (including sibling 2D overlays). Calling it outside both throws:`),E=t(`<p><code>useWorldToScreen must be used within a &lt;View3D>, a &lt;View3DProvider>, or a component mounted inside one.`),D=t(`<p><code>&lt;View3DProvider></code> creates the <code>View3D</code> up front, so the hook always has an instance to project through. The projected value becomes meaningful once the scene is built and the camera is in the graph, which happens during the first tick after mount.`),O=t(`<h2 id=return-value>Return Value`),k=t(`<p>Returns an Accessor to an object with:`),A=t(`<ul><li><p><code>x: number</code> — 2D screen horizontal coordinate.</p></li><li><p><code>y: number</code> — 2D screen vertical coordinate.</p></li><li><p><code>visible: boolean</code> — <code>false</code> if the 3D position is behind the camera frustum, <code>true</code> when in front.`),j=t(`<span>`),M=n(()=>i(()=>import(`./world-to-screen.demo-C4mBLMqX.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18])),{export:`Demo`},`src/demos/world-to-screen.demo.tsx`);function N(){return e(a,{get children(){return e(o,{get children(){return[r(f),r(p),r(m),r(h),r(g),e(u,{title:`world-to-screen`,get children(){return e(M,{get fallback(){return r(j)}})}}),r(_),e(s,{code:d,title:`world-to-screen.demo.tsx`}),r(v),r(y),r(b),e(s,{code:`import { useWorldToScreen, View3D, View3DProvider, Mesh3D } from "pixi-solid-3d";
import { createSignal, Show } from "solid-js";
import { Container, onTick, Text } from "pixi-solid";

// The character's transform is the source of truth — the 3D node and the HUD both render it.
const [position, setPosition] = createSignal({ x: 0, y: 0, z: 0 });

let elapsed = 0;
onTick((ticker) => {
  elapsed += 0.02 * ticker.deltaTime;
  setPosition({ x: Math.sin(elapsed) * 2, y: 0, z: 0 });
});

export const GameScene = () => (
  <View3DProvider width={800} height={600} toneMapping="aces">
    {/* Mounts the provider-owned View3D */}
    <View3D>
      <Mesh3D x={position().x} y={position().y} z={position().z} ... />
    </View3D>

    {/* Sibling 2D Overlay HUD */}
    <PlayerHUD />
  </View3DProvider>
);

const PlayerHUD = () => {
  // Resolves the View3D from the parent <View3DProvider>, and the position from the same signal.
  // No refs, no imperative reads.
  const screenPos = useWorldToScreen(position);

  return (
    <Show when={screenPos().visible}>
      <Container x={screenPos().x} y={screenPos().y - 40}>
        <Text text="Player Name" />
      </Container>
    </Show>
  );
};`,title:`tsx`}),r(x),e(c,{get children(){return[r(S),r(C)]}}),r(w),r(T),e(l,{tone:`warning`,get children(){return r(E)}}),r(D),r(O),r(k),r(A)]}})}})}export{N as default};