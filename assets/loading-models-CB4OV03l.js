const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/model-3d.demo-DRG3z3BJ.js","assets/web-BTd9NawZ.js","assets/dist-BWyuAgmK.js","assets/rolldown-runtime-hePW80VL.js","assets/CanvasPool-DtqSaXnh.js","assets/Filter-tmaoo_H6.js","assets/canvasUtils-BmkL-0m_.js","assets/Cache-DjsX-fAq.js","assets/RenderTargetSystem-CXGlBGSL.js","assets/GCManagedHash-iaZqB6Fm.js","assets/GraphicsContext-oKSnaaQD.js","assets/getTextureBatchBindGroup-CPqe_4fB.js","assets/getTexelRangeRects-7j664Y_P.js","assets/Assets-D-FVVTjl.js","assets/checkExtension-BGvys2BB.js","assets/dist-BacaWkv9.js","assets/EventSystem-C-891Yha.js","assets/Container3D-6nYjydl4.js","assets/smooth-damp-D4ZU0jAr.js"])))=>i.map(i=>d[i]);
import{J as e,L as t,c as n,p as r,z as i}from"./web-BTd9NawZ.js";import{c as a,i as o,o as s,t as c}from"./components-BiYutFnA.js";var l=`import { Material3D, type Scene3DSource } from "@pixi/3d";
import { PixiCanvas, usePixiScreen } from "pixi-solid";
import { Camera3D, Model3D, SpotLight, View3D, Sprite3D } from "pixi-solid-3d";
import { useSmoothDamp } from "pixi-solid/utils";
import type { FederatedPointerEvent } from "pixi.js";
import { Assets } from "pixi.js";
import { createSignal, onSettled, Show } from "solid-js";

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5", "background-color": "#18181b" }}>
    <DemoContent />
  </PixiCanvas>
);

const DemoContent = () => {
  const pixiScreen = usePixiScreen();

  // Start the load once the render settles.
  const [knightSource, setKnightSource] = createSignal<Scene3DSource>();

  onSettled(() => {
    void Assets.load<Scene3DSource>("/pixi-solid/3d-models/Knight.glb").then((source) => {
      setKnightSource(source);
    });
  });

  const [targetAngle, setTargetAngle] = createSignal(0);
  let isDragging = false;
  let lastPointerX = 0;

  const smoothAngle = useSmoothDamp({
    to: () => targetAngle(),
    smoothTimeMs: () => 140,
  });

  const handlePointerDown = (e: FederatedPointerEvent) => {
    isDragging = true;
    lastPointerX = e.global.x;
  };

  const handlePointerMove = (e: FederatedPointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.global.x - lastPointerX;
    lastPointerX = e.global.x;

    // Rotate character by the horizontal drag delta (0.5 degrees per pixel)
    setTargetAngle((prev) => prev + deltaX * 0.5);
  };

  const handlePointerUp = () => {
    isDragging = false;
  };

  return (
    <View3D
      width={pixiScreen.width}
      height={pixiScreen.height}
      toneMapping="aces"
      environment={{ skyColor: "#fff1b9", groundColor: "#2c3679", intensity: 0.05 }}
    >
      <Sprite3D
        eventMode="static"
        cursor="grab"
        onpointerdown={handlePointerDown}
        onglobalpointermove={handlePointerMove}
        onpointerup={handlePointerUp}
        onpointerupoutside={handlePointerUp}
        material={new Material3D()}
        castShadow={false}
        billboardMode={"spherical"}
        z={pixiScreen.height * -0.5}
        alphaMode="mask"
        width={pixiScreen.width}
        height={pixiScreen.height}
      />
      <Sprite3D
        eventMode="static"
        cursor="grab"
        onpointerdown={handlePointerDown}
        onglobalpointermove={handlePointerMove}
        onpointerup={handlePointerUp}
        onpointerupoutside={handlePointerUp}
        material={new Material3D()}
        castShadow={false}
        billboardMode={"none"}
        y={0}
        angleX={-90}
        alphaMode="mask"
        width={pixiScreen.width}
        height={pixiScreen.height}
      />
      <Camera3D x={0} y={2} z={4.5} lookAt={{ x: 0, y: 1.5, z: 0 }} />
      <SpotLight
        intensity={100}
        color={"#b7f1ff"}
        x={4}
        y={3}
        z={3}
        castShadow={true}
        lookAt={{ x: 0, y: 1.8, z: 0 }}
        coneAngle={10}
        penumbra={1}
      />
      <SpotLight
        intensity={1000}
        color={"#ff4f4c"}
        x={-10}
        y={14}
        z={-9}
        castShadow={true}
        lookAt={{ x: 0, y: 1.5, z: 0 }}
        coneAngle={20}
        penumbra={1}
      />
      <SpotLight
        intensity={500}
        color={"#ffa04c"}
        x={14}
        y={14}
        z={-9}
        castShadow={true}
        lookAt={{ x: 0, y: 1.5, z: 0 }}
        coneAngle={60}
        penumbra={1}
      />
      <Show when={knightSource()}>
        {(source) => (
          <Model3D
            source={source()}
            castShadow={true}
            receiveShadow={true}
            angleY={smoothAngle.value()}
          />
        )}
      </Show>
    </View3D>
  );
};

export default Demo;
`,u=t(`<h1>Loading 3D Models`),d=t(`<p><code>pixi-solid-3d</code> provides the <code>&lt;Model3D></code> component to instantiate and render 3D scenes loaded from standard <strong>glTF</strong> and <strong>GLB</strong> files.`),f=t(`<h2 id=how-model-loading-works>How Model Loading Works`),p=t(`<ol><li><p>Load your <code>.gltf</code> or <code>.glb</code> file using PixiJS's <code>Assets.load&lt;Scene3DSource>()</code>.</p></li><li><p>Wrap the loader with SolidJS's <code>createResource</code> to handle the asynchronous loading state reactively.</p></li><li><p>Pass the resulting <code>source</code> to <code>&lt;Model3D source={source()} /></code>.`),m=t(`<p>Multiple <code>&lt;Model3D></code> instances can share the exact same <code>Scene3DSource</code> without duplicating GPU textures or geometry buffers.`),h=t(`<h2 id=interactive-demo>Interactive Demo`),g=t(`<p>Here is a 3D Knight model loaded from a <code>.glb</code> file, rendered with directional and spot lighting. Click and drag across the canvas to smoothly rotate the character to face your pointer:`),_=t(`<h2 id=code-example>Code Example`),v=t(`<h2 id=instantiating-named-scenes>Instantiating Named Scenes`),y=t(`<p>If your glTF file contains multiple scenes, specify which one to instantiate using the <code>scene</code> prop:`),b=t(`<h2 id=shadows-and-transforms>Shadows and Transforms`),x=t(`<p><code>&lt;Model3D></code> supports the full set of 3D transform props (<code>x</code>, <code>y</code>, <code>z</code>, <code>scale</code>, <code>rotation</code>, etc.) and shadow options:`),S=t(`<h2 id=customizing-model-materials-traverse>Customizing Model Materials (<code>traverse</code>)`),C=t(`<p>When a 3D model loads, <code>@pixi/3d</code> builds an internal hierarchy of <code>Mesh3D</code> nodes from the glTF file. To inspect or customize individual meshes (such as swapping materials, adjusting roughness, or setting shadow properties), use the <code>traverse</code> prop:`),w=t(`<p>Every <code>Container3D</code> has <code>traverse(callback)</code>, which visits the node and every descendant depth first. Call it imperatively on a node when the <code>traverse</code> prop is not enough:`),T=t(`<h2 id=per-model-material-overrides>Per-model material overrides`),E=t(`<p>Every <code>&lt;Model3D></code> built from the same <code>Scene3DSource</code> draws the <strong>same</strong> material instances. Changing a property on one writes through to every model built from that source:`),D=t(`<p>When a model needs materials of its own, pass <code>materials</code>. <code>@pixi/3d</code> calls it once per source material, so meshes that shared a material still share its replacement:`),O=t(`<p><code>materials</code> is a setter on <code>Model3D</code>, so you can swap overrides from a signal, for example when a model takes damage. Assigning <code>undefined</code> gives the model the source's materials back.`),k=t(`<p><code>&lt;Model3D></code> never destroys the materials you pass in. Destroy the ones you created when you are done with them, or pass <code>destroy({ material: true })</code> yourself.`),A=t(`<span>`),j=n(()=>i(()=>import(`./model-3d.demo-DRG3z3BJ.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18])),{export:`Demo`},`src/demos/model-3d.demo.tsx`);function M(){return e(a,{get children(){return e(o,{get children(){return[r(u),r(d),r(f),r(p),r(m),r(h),r(g),e(c,{title:`model-3d`,get children(){return e(j,{get fallback(){return r(A)}})}}),r(_),e(s,{code:l,title:`model-3d.demo.tsx`}),r(v),r(y),e(s,{code:`<Model3D source={source()} scene="Showroom" />;`,title:`tsx`}),r(b),r(x),e(s,{code:`<Model3D source={source()} x={0} y={0} z={-5} scale={1.5} castShadow={true} receiveShadow={true} />;`,title:`tsx`}),r(S),r(C),e(s,{code:`import { Mesh3D } from "@pixi/3d";
import { Model3D, ToonMaterial } from "pixi-solid-3d";

export const CustomKnight = (props: { source: any }) => {
  return (
    <Model3D
      source={props.source}
      traverse={(node) => {
        if (node instanceof Mesh3D) {
          // Customize all meshes or target specific parts by name
          if (node.label === "Sword") {
            node.material = new ToonMaterial({ bands: 4 });
          }
        }
      }}
    />
  );
};`,title:`tsx`}),r(w),e(s,{code:`const model = new Model3D({ source });

model.traverse((node) => {
  if (node instanceof Mesh3D) node.castShadow = true;
});`,title:`tsx`}),r(T),r(E),e(s,{code:`// Affects every model made from this source
armorMesh.material.roughness = 0.9;`,title:`tsx`}),r(D),e(s,{code:`import { Material3D } from "@pixi/3d";
import { Model3D } from "pixi-solid-3d";

// By material label, using the names in the glTF file
<Model3D source={source()} materials={{ Paint: new Material3D({ baseColor: 0xff2222 }) }} />;

// By source material index; leave an entry out to keep the source's material
<Model3D source={source()} materials={[undefined, glowMaterial]} />;

// Build a private copy of every material
<Model3D source={source()} materials={(material) => material.clone()} />;`,title:`tsx`}),r(O),r(k)]}})}})}export{M as default};