const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/lighting-and-cameras.demo-OqrOPARy.js","assets/web-BTd9NawZ.js","assets/dist-BWyuAgmK.js","assets/rolldown-runtime-hePW80VL.js","assets/CanvasPool-DtqSaXnh.js","assets/Filter-tmaoo_H6.js","assets/canvasUtils-BmkL-0m_.js","assets/Cache-DjsX-fAq.js","assets/RenderTargetSystem-CXGlBGSL.js","assets/GCManagedHash-iaZqB6Fm.js","assets/GraphicsContext-oKSnaaQD.js","assets/getTextureBatchBindGroup-CPqe_4fB.js","assets/getTexelRangeRects-7j664Y_P.js","assets/dist-BacaWkv9.js","assets/EventSystem-C-891Yha.js","assets/checkExtension-BGvys2BB.js","assets/Container3D-6nYjydl4.js","assets/resources-DPHE43kQ.js","assets/CubeGeometry-BthFmsAf.js","assets/orbit-camera-BY0abxTi.js"])))=>i.map(i=>d[i]);
import{J as e,L as t,c as n,p as r,z as i}from"./web-BTd9NawZ.js";import{c as a,i as o,o as s,t as c}from"./components-BiYutFnA.js";var l=`import { View3D, OrbitCamera, AmbientLight, DirectionalLight } from "pixi-solid-3d";

export const SceneWithOrbit = () => {
  return (
    <View3D
      width={800}
      height={600}
      ref={(view) => {
        view.camera.position.set(0, 5, 10);
        view.camera.lookAt({ x: 0, y: 0, z: 0 });
      }}
    >
      <OrbitCamera
        enableDamping={true}
        minDistance={2}
        maxDistance={50}
        target={{ x: 0, y: 0, z: 0 }}
      />
      <AmbientLight intensity={0.3} />
      <DirectionalLight intensity={2} x={5} y={10} z={5} castShadow={true} />
    </View3D>
  );
};
`,u=`import { View3D, FPSCamera, Camera3D } from "pixi-solid-3d";

export const FirstPersonScene = () => {
  return (
    <View3D width={800} height={600}>
      <Camera3D x={0} y={1.8} z={0} />
      <FPSCamera moveSpeed={8} lookSpeed={0.003} pointerLock={true} keyboard={true} />
    </View3D>
  );
};
`,d=`import { onTick, PixiCanvas, usePixiScreen } from "pixi-solid";
import {
  AmbientLight,
  Camera3D,
  CubeGeometry,
  DirectionalLight,
  Material3D,
  Mesh3D,
  OrbitCamera,
  PlaneGeometry,
  PointLight,
  SphereGeometry,
  SpotLight,
  View3D,
} from "pixi-solid-3d";

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5", "background-color": "#09090b" }}>
    <DemoContent />
  </PixiCanvas>
);

const DemoContent = () => {
  const pixiScreen = usePixiScreen();

  let elapsed = 0;
  let cube: { rotation: { y: number } } | undefined;

  onTick((ticker) => {
    elapsed += ticker.deltaMS / 1000;
    if (cube) cube.rotation.y = elapsed * 0.6;
  });

  return (
    <View3D
      width={pixiScreen.width}
      height={pixiScreen.height}
      toneMapping="aces"
      shadowQuality="high"
      environment={{ skyColor: "#1e293b", groundColor: "#020617", intensity: 0.5 }}
    >
      <Camera3D x={0} y={4} z={9} lookAt={{ x: 0, y: 1, z: 0 }} />
      <OrbitCamera
        enableDamping={true}
        minDistance={5}
        maxDistance={22}
        target={{ x: 0, y: 1, z: 0 }}
      />

      {/* Fills the shadows so nothing goes fully black. */}
      <AmbientLight intensity={0.25} />

      {/* The key light. It faces its local -Z, so aim it at what it should light. */}
      <DirectionalLight
        intensity={2.6}
        color={0xfff2dc}
        x={5}
        y={8}
        z={4}
        lookAt={{ x: 0, y: 0, z: 0 }}
        castShadow={true}
      />

      {/* A warm bounce from the left. */}
      <PointLight intensity={6} color={0xff8a3d} x={-4} y={2} z={-2} />

      {/* A hard pool of light from above the stage. */}
      <SpotLight
        intensity={9}
        color={0x7dd3fc}
        x={0}
        y={7}
        z={0}
        lookAt={{ x: 0, y: 0, z: 0 }}
        coneAngle={0.55}
        penumbra={0.4}
      />

      {/* A floor. \`PlaneGeometry\` lies in XY, so a quarter turn puts it under our feet. */}
      <Mesh3D rotationX={-Math.PI / 2} receiveShadow={true}>
        <PlaneGeometry width={24} height={24} />
        <Material3D baseColor={0x1e293b} roughness={0.9} />
      </Mesh3D>

      <Mesh3D y={1} castShadow={true}>
        <SphereGeometry radius={1} />
        <Material3D baseColor={0x38bdf8} roughness={0.25} metallic={0.4} />
      </Mesh3D>

      <Mesh3D ref={(mesh) => (cube = mesh)} x={2.6} y={0.8} castShadow={true}>
        <CubeGeometry width={1.6} height={1.6} depth={1.6} />
        <Material3D baseColor={0xf97316} roughness={0.4} />
      </Mesh3D>
    </View3D>
  );
};
`,f=t(`<h1>Lighting and Cameras`),p=t(`<p>Four lights and an orbit camera over a shadowed floor. Drag to orbit.`),m=t(`<h2 id=lights>Lights`),h=t(`<p><code>pixi-solid-3d</code> exports reactive light components:`),g=t(`<ul><li><p><code>&lt;AmbientLight intensity={0.5} color={0xffffff} /></code></p></li><li><p><code>&lt;DirectionalLight intensity={2} color={0xffffff} castShadow={true} lookAt={{ x: 0, y: 0, z: 0 }} /></code></p></li><li><p><code>&lt;PointLight intensity={5} range={20} color={0xffaa00} /></code></p></li><li><p><code>&lt;SpotLight intensity={10} coneAngle={Math.PI / 4} penumbra={0.3} castShadow={true} lookAt={{ x: 0, y: 0, z: 0 }} />`),_=t(`<p><code>range</code> and <code>radius</code> bound how far a point or spot light reaches and how soft its falloff is. A spot light also takes <code>coneAngle</code> and <code>penumbra</code>.`),v=t(`<p>All lights and containers support the reactive <code>lookAt</code> prop as well as individual axis props (<code>lookAtX</code>, <code>lookAtY</code>, <code>lookAtZ</code>) to orient their forward axis toward a 3D coordinate target with fine-grained reactivity.`),y=t(`<h2 id=cameras-and-controls>Cameras and Controls`),b=t(`<p><code>&lt;View3D></code> creates a default <code>Camera3D</code> automatically. You can also customize or position it, or add <code>&lt;OrbitCamera></code> or <code>&lt;FPSCamera></code> to enable interactive camera controls:`),x=t(`<h3 id=first-person-camera>First-Person Camera (<code>&lt;FPSCamera></code>)`),S=t(`<p>For walkthroughs or first-person gameplay, use <code>&lt;FPSCamera></code> for WASD movement and mouse-look:`),C=t(`<span>`),w=n(()=>i(()=>import(`./lighting-and-cameras.demo-OqrOPARy.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19])),{export:`Demo`},`src/demos/lighting-and-cameras.demo.tsx`);function T(){return e(a,{get children(){return e(o,{get children(){return[r(f),r(p),e(c,{title:`lighting-and-cameras`,get children(){return e(w,{get fallback(){return r(C)}})}}),e(s,{code:d,title:`lighting-and-cameras.demo.tsx`}),r(m),r(h),r(g),r(_),r(v),r(y),r(b),e(s,{code:l,title:`tsx`}),r(x),r(S),e(s,{code:u,title:`tsx`})]}})}})}export{T as default};