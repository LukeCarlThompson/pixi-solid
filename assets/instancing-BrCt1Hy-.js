const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/instancing.demo-TDH82wHy.js","assets/web-BTd9NawZ.js","assets/dist-BWyuAgmK.js","assets/rolldown-runtime-hePW80VL.js","assets/CanvasPool-DtqSaXnh.js","assets/Filter-tmaoo_H6.js","assets/canvasUtils-BmkL-0m_.js","assets/Cache-DjsX-fAq.js","assets/RenderTargetSystem-CXGlBGSL.js","assets/GCManagedHash-iaZqB6Fm.js","assets/GraphicsContext-oKSnaaQD.js","assets/getTextureBatchBindGroup-CPqe_4fB.js","assets/getTexelRangeRects-7j664Y_P.js","assets/dist-BacaWkv9.js","assets/EventSystem-C-891Yha.js","assets/checkExtension-BGvys2BB.js","assets/Container3D-6nYjydl4.js","assets/CubeGeometry-BthFmsAf.js","assets/orbit-camera-BY0abxTi.js"])))=>i.map(i=>d[i]);
import{J as e,L as t,c as n,p as r,z as i}from"./web-BTd9NawZ.js";import{c as a,i as o,o as s,t as c}from"./components-BiYutFnA.js";var l=`import type * as Pixi3D from "@pixi/3d";
import { CubeGeometry, Material3D, Matrix4, RenderPassBit } from "@pixi/3d";
import { onTick, PixiCanvas, usePixiScreen } from "pixi-solid";
import {
  AmbientLight,
  BatchedMesh3D,
  Camera3D,
  DirectionalLight,
  OrbitCamera,
  View3D,
} from "pixi-solid-3d";

const COLUMNS = 40;
const ROWS = 40;
const COUNT = COLUMNS * ROWS;

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5", "background-color": "#09090b" }}>
    <DemoContent />
  </PixiCanvas>
);

const fillBatch = (batch: Pixi3D.BatchedMesh3D) => {
  const geometry = new CubeGeometry({ width: 0.35, height: 0.35, depth: 0.35 });
  const material = new Material3D({ baseColor: 0x38bdf8, roughness: 0.4 });
  const matrix = new Matrix4();

  for (let i = 0; i < COUNT; i++) {
    const column = i % COLUMNS;
    const row = Math.floor(i / COLUMNS);

    // One matrix reused: \`setMatrixAt\` copies the values into the batch.
    matrix.identity().setPosition({
      x: (column - COLUMNS / 2) * 0.5,
      y: 0,
      z: (row - ROWS / 2) * 0.5,
    });

    batch.setGeometryAt(i, geometry);
    batch.setMaterialAt(i, material);
    batch.setMatrixAt(i, matrix);
    batch.setPassesAt(i, RenderPassBit.OPAQUE | RenderPassBit.SHADOW);
  }
};

const DemoContent = () => {
  const pixiScreen = usePixiScreen();

  let batch: Pixi3D.BatchedMesh3D | undefined;
  let elapsed = 0;

  onTick((ticker) => {
    elapsed += ticker.deltaMS / 1000;
    // Moving the whole batch is one node update, not one per instance.
    if (batch) batch.rotation.y = elapsed * 0.15;
  });

  return (
    <View3D
      width={pixiScreen.width}
      height={pixiScreen.height}
      toneMapping="aces"
      shadowQuality="medium"
      environment={{ skyColor: "#1e293b", groundColor: "#020617", intensity: 0.6 }}
    >
      <Camera3D x={0} y={6} z={12} lookAt={{ x: 0, y: 0, z: 0 }} />
      <OrbitCamera enableDamping={true} minDistance={6} maxDistance={40} />

      <AmbientLight intensity={0.35} />
      <DirectionalLight
        intensity={2.2}
        x={5}
        y={8}
        z={5}
        lookAt={{ x: 0, y: 0, z: 0 }}
        castShadow={true}
      />

      <BatchedMesh3D
        label="grid"
        size={COUNT}
        ref={(created) => {
          batch = created;
          fillBatch(created);
        }}
      />
    </View3D>
  );
};
`,u=t(`<h1>Instancing`),d=t(`<p><code>&lt;BatchedMesh3D></code> draws many copies of a geometry from one GPU batch, with no scene node per copy. Reach for it when a scene has thousands of identical objects: grass, trees, bullets, crowd members, voxel tiles.`),f=t(`<p>Past a few thousand meshes, a node each costs more to update and draw than the batch saves. Below that, plain <code>&lt;Mesh3D></code> is simpler and fast enough.`),p=t(`<p>1,600 cubes in one draw batch. Drag to orbit; the whole grid turns as a single node:`),m=t(`<h2 id=declaring-a-batch>Declaring a batch`),h=t(`<p><code>size</code> is required and fixed for the batch's lifetime. Slots stay allocated whether they draw or not, so size the batch to the most you will draw at once.`),g=t(`<p>A slot needs a geometry and a material only while it is in a pass, so spare slots can stay empty.`),_=t(`<h2 id=showing-and-hiding-slots>Showing and hiding slots`),v=t(`<p>To spawn and despawn, show and hide slots instead of adding and removing nodes:`),y=t(`<p>Moving a slot is a matrix write, cheap enough for every frame:`),b=t(`<h2 id=per-slot-shader-values>Per-slot shader values`),x=t(`<p><code>Mesh3D</code> notices when its material's shader changes; a batch slot does not. After swapping a material on a slot, call <code>batch.invalidate(index)</code>.`),S=t(`<p>For a value that differs per slot, such as a tint or a fade, declare <code>instanceData</code> and write it. A field can hold up to four numbers per slot:`),C=t(`<p>To rewrite many slots in one pass, write into <code>batch.instanceData.data</code> and call<code>batch.instanceData.update()</code>.`),w=t(`<h2 id=reactivity>Reactivity`),T=t(`<p><code>&lt;BatchedMesh3D></code> binds the same 3D transform and event props as every other scene node, so <code>x</code>,<code>scaleZ</code> and <code>onclick</code> work as usual. Slot contents are imperative, because the batch holds one buffer for all of them.`),E=t(`<span>`),D=n(()=>i(()=>import(`./instancing.demo-TDH82wHy.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18])),{export:`Demo`},`src/demos/instancing.demo.tsx`);function O(){return e(a,{get children(){return e(o,{get children(){return[r(u),r(d),r(f),r(p),e(c,{title:`instancing`,get children(){return e(D,{get fallback(){return r(E)}})}}),e(s,{code:l,title:`instancing.demo.tsx`}),r(m),r(h),e(s,{code:`import type { BaseMaterial3D, Geometry3D } from "@pixi/3d";
import { RenderPassBit } from "@pixi/3d";
import { BatchedMesh3D } from "pixi-solid-3d";

export const Forest = (props: {
  count: number;
  geometry: Geometry3D;
  material: BaseMaterial3D;
}) => (
  <BatchedMesh3D
    size={props.count}
    ref={(batch) => {
      for (let i = 0; i < props.count; i++) {
        batch.setGeometryAt(i, props.geometry);
        batch.setMaterialAt(i, props.material);
        batch.setMatrixAt(i, treeMatrix(i));
        batch.setPassesAt(i, RenderPassBit.OPAQUE | RenderPassBit.SHADOW);
      }
    }}
  />
);`,title:`tsx`}),r(g),r(_),r(v),e(s,{code:`batch.setVisibleAt(index, false); // despawn
batch.setVisibleAt(index, true); // respawn`,title:`tsx`}),r(y),e(s,{code:`batch.setMatrixAt(index, nextMatrix);`,title:`tsx`}),r(b),r(x),r(S),e(s,{code:`<BatchedMesh3D
  size={count}
  instanceData={{ tint: { value: [1, 1, 1, 1], type: "vec4<f32>" } }}
  ref={(batch) => {
    for (let i = 0; i < count; i++) {
      batch.setInstanceDataAt(i, "tint", 1, 0.2, 0.2, 1);
    }
  }}
/>;`,title:`tsx`}),r(C),r(w),r(T)]}})}})}export{O as default};