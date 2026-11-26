const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/particle-system-3d.demo-CH7jJkfJ.js","assets/web-BTd9NawZ.js","assets/CanvasPool-DtqSaXnh.js","assets/rolldown-runtime-hePW80VL.js","assets/dist-BWyuAgmK.js","assets/Filter-tmaoo_H6.js","assets/canvasUtils-BmkL-0m_.js","assets/Cache-DjsX-fAq.js","assets/RenderTargetSystem-CXGlBGSL.js","assets/GCManagedHash-iaZqB6Fm.js","assets/GraphicsContext-oKSnaaQD.js","assets/getTextureBatchBindGroup-CPqe_4fB.js","assets/getTexelRangeRects-7j664Y_P.js","assets/dist-BacaWkv9.js","assets/EventSystem-C-891Yha.js","assets/checkExtension-BGvys2BB.js","assets/Container3D-6nYjydl4.js","assets/orbit-camera-BY0abxTi.js","assets/particle-container-3d.demo-D2UzFAFT.js"])))=>i.map(i=>d[i]);
import{J as e,L as t,a as n,c as r,p as i,z as a}from"./web-BTd9NawZ.js";import{c as o,i as s,o as c,r as l,t as u}from"./components-BiYutFnA.js";var d=`import type { ParticleContainer3D as ParticleContainer3DInstance } from "@pixi/3d";
import { onTick, PixiCanvas, usePixiScreen } from "pixi-solid";
import { Camera3D, OrbitCamera, ParticleContainer3D, View3D } from "pixi-solid-3d";
import { Texture } from "pixi.js";

const COUNT = 1200;

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5", "background-color": "#09090b" }}>
    <DemoContent />
  </PixiCanvas>
);

const DemoContent = () => {
  const pixiScreen = usePixiScreen();

  let swarm: ParticleContainer3DInstance | undefined;
  let elapsed = 0;

  // A \`ParticleContainer3D\` has no simulation, so the frame loop drives every slot and uploads
  // once at the end. \`setParticleAt\` packs each write, so this allocates nothing.
  onTick((ticker) => {
    if (!swarm) return;

    elapsed += ticker.deltaMS / 1000;

    for (let i = 0; i < COUNT; i++) {
      const angle = (i / COUNT) * Math.PI * 2 + elapsed * 0.4;
      const radius = 1.6 + Math.sin(angle * 3 + elapsed) * 0.35;

      swarm.setParticleAt(
        i,
        Math.cos(angle) * radius,
        Math.sin(angle * 4 + elapsed * 1.5) * 0.6 + 1.8,
        Math.sin(angle) * radius,
        0.07,
        angle,
        0x66ccff,
        0.9,
      );
    }

    swarm.upload();
  });

  return (
    <View3D
      width={pixiScreen.width}
      height={pixiScreen.height}
      toneMapping="aces"
      environment={{ skyColor: "#050510", groundColor: "#100502", intensity: 0.2 }}
    >
      <Camera3D x={0} y={3.5} z={7} lookAt={{ x: 0, y: 1.8, z: 0 }} />
      <OrbitCamera
        enableDamping={true}
        minDistance={3}
        maxDistance={25}
        target={{ x: 0, y: 1.8, z: 0 }}
      />

      <ParticleContainer3D
        ref={(container) => (swarm = container)}
        capacity={COUNT}
        texture={Texture.WHITE}
        blendMode="add"
      />
    </View3D>
  );
};
`,f=`import { ConeShape } from "@pixi/3d/extras";
import { PixiCanvas, usePixiScreen } from "pixi-solid";
import { Camera3D, OrbitCamera, ParticleSystem3D, View3D } from "pixi-solid-3d";
import { createSignal } from "solid-js";

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5", "background-color": "#09090b" }}>
    <DemoContent />
  </PixiCanvas>
);

const DemoContent = () => {
  const pixiScreen = usePixiScreen();
  const [rate] = createSignal(120);

  // Cone emitter spraying glowing embers upward in +Y direction
  const fireCone = new ConeShape({ angle: 22, radius: 0.3 });

  return (
    <View3D
      width={pixiScreen.width}
      height={pixiScreen.height}
      toneMapping="aces"
      environment={{ skyColor: "#050510", groundColor: "#100502", intensity: 0.2 }}
    >
      <Camera3D x={0} y={3} z={7} lookAt={{ x: 0, y: 1.5, z: 0 }} />
      <OrbitCamera
        enableDamping={true}
        minDistance={3}
        maxDistance={25}
        target={{ x: 0, y: 1.5, z: 0 }}
      />

      {/* 3D GPU Particle Fountain */}
      <ParticleSystem3D
        y={0}
        capacity={1500}
        emitRate={rate()}
        shape={fireCone}
        speed={[2.5, 5]}
        life={[1.2, 2.2]}
        size={[0.2, 0.4]}
        sizeEnd={[0.02, 0.08]}
        color={0xff7700}
        colorEnd={0xff1100}
        alpha={[0.9, 1]}
        alphaEnd={0}
        gravity={-1.5}
        drag={0.3}
        blendMode="add"
      />
    </View3D>
  );
};

export default Demo;
`,p=t(`<h1>Particles`),m=t(`<p><code>pixi-solid-3d</code> exposes both particle classes from <code>@pixi/3d</code>, and they do different jobs.`),h=t(`<thead><tr><th></th><th><code>&lt;ParticleSystem3D></code></th><th><code>&lt;ParticleContainer3D>`),g=t(`<tbody><tr><td>Simulation</td><td>built in</td><td>none</td></tr><tr><td>You write</td><td>nothing per frame</td><td>every slot, every frame</td></tr><tr><td>Good for</td><td>fire, smoke, sparks, rain, dust</td><td>particles a physics or gameplay system owns</td></tr><tr><td>Import</td><td><code>@pixi/3d/extras</code></td><td><code>@pixi/3d`),_=t(`<p><code>ParticleSystem3D</code> <strong>extends</strong> <code>ParticleContainer3D</code>, so it is the container plus an emitter. If you are not computing particle positions yourself, use <code>&lt;ParticleSystem3D></code> and skip the rest of the container section.`),v=t(`<h2 id=simulated-particles>Simulated particles`),y=t(`<p><code>&lt;ParticleSystem3D></code> emits particles from a shape, moves them under gravity and drag, and animates their size, colour and opacity over their life. Everything is driven by props.`),b=t(`<h3 id=why-a-component>Why a component?`),x=t(`<p>In <code>@pixi/3d</code>, <code>ParticleSystem3D</code> steps itself from Pixi's global <code>Ticker.shared</code>. A default<code>Application</code> runs that separately from <code>app.ticker</code>, so a new particle can show a frame late.`),S=t(`<p><code>&lt;ParticleSystem3D></code>:`),C=t(`<ol><li><p><strong>Follows your ticker</strong>: steps from the nearest contextual ticker (from <code>&lt;PixiCanvas></code>,<code>&lt;PixiApplicationProvider></code> or <code>&lt;TickerProvider></code>) instead of a global timer.</p></li><li><p><strong>Updates live</strong>: <code>emitRate</code>, <code>gravity</code>, <code>drag</code>, <code>playing</code> and <code>frameRate</code> are reactive, so a signal changes the running emitter without rebuilding its GPU buffers.</p></li><li><p><strong>Cleans up</strong>: on unmount it frees the buffers and the ticker callback.`),w=t(`<h3 id=interactive-demo>Interactive demo`),T=t(`<p>Rotate and zoom the camera with your mouse or touch to inspect the 3D ember fountain:`),E=t(`<h3 id=code-example>Code example`),D=t(`<h3 id=emitter-shapes>Emitter shapes`),O=t(`<p>Shapes come from <code>@pixi/3d/extras</code>:`),k=t(`<ul><li><p><code>ConeShape({ angle, radius })</code> spawns on an XZ disc and shoots upward in a cone. Fire plumes, exhaust, fountains, torches.</p></li><li><p><code>SphereShape({ radius, surfaceOnly })</code> spawns inside or on a sphere, radiating outward. Magic orbs, explosions, bursts.</p></li><li><p><code>BoxShape({ width, height, depth })</code> spawns across a volume. Ambient dust, snow, rain.</p></li><li><p><code>PointShape()</code> spawns everything from one origin.`),A=t(`<h3 id=spreads-ranges-versus-fixed-numbers>Spreads: ranges versus fixed numbers`),j=t(`<p><code>speed</code>, <code>life</code>, <code>size</code>, <code>sizeEnd</code>, <code>alpha</code>, <code>alphaEnd</code> and <code>startRotation</code> accept <strong>spreads</strong>:`),M=t(`<ul><li><p><strong>Fixed scalar</strong>: <code>speed={4}</code> gives every particle speed 4.</p></li><li><p><strong>Range</strong>: <code>speed={[2, 5]}</code> randomises between 2 and 5 per particle.`),N=t(`<h3 id=additive-versus-normal-blending>Additive versus normal blending`),P=t(`<ul><li><p><code>blendMode="add"</code> brightens what is behind: fire, glowing sparks, laser exhaust, magic.</p></li><li><p><code>blendMode="normal"</code> composites normally: smoke, dust, leaves, debris.`),F=t(`<h2 id=hand-driven-particles>Hand-driven particles`),I=t(`<p><code>&lt;ParticleContainer3D></code> is a pool of quads and nothing more. It never moves a particle, so your frame loop writes every slot and then calls <code>upload()</code> once.`),L=t(`<h3 id=writing-slots>Writing slots`),R=t(`<p>Three ways, all of which allocate nothing per particle:`),z=t(`<p>Call <code>upload()</code> once, after all writes for the frame. Nothing appears until you do. A slot with size<code>0</code> draws nothing, and <code>clear()</code> empties the pool.`),B=t(`<p><code>setParticle(index, values)</code> also exists but takes an object literal, so reserve it for spawning.`),V=t(`<h3 id=letting-the-gpu-animate>Letting the GPU animate`),H=t(`<p>Writing every particle every frame is only necessary when <em>you</em> own the simulation. When the motion is predictable, <code>extraBits</code> moves the work into the vertex shader: a bit declares per-particle attributes and uniforms, so you write each particle once and a frame only advances a uniform.`),U=t(`<p>Then the frame loop is one line:`),W=t(`<p>An unknown attribute throws at spawn time and lists the attributes the bits declare.`),G=t(`<p><code>&lt;ParticleSystem3D></code> derives the bits it needs from its own props, so you never name one there.<code>extraBits</code> on a system only adds a bit you wrote yourself, which is an advanced case.`),K=t(`<p>See the <a href=https://pixijs.download/3d/release/docs/llms.txt><code>@pixi/3d</code> particle bits guide</a> for writing your own.`),q=t(`<span>`),J=r(()=>a(()=>import(`./particle-system-3d.demo-CH7jJkfJ.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17])),{export:`Demo`},`src/demos/particle-system-3d.demo.tsx`),Y=r(()=>a(()=>import(`./particle-container-3d.demo-D2UzFAFT.js`),__vite__mapDeps([18,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17])),{export:`Demo`},`src/demos/particle-container-3d.demo.tsx`);function X(){return e(o,{get children(){return e(s,{get children(){return[i(p),i(m),e(l,{get children(){return[i(h),i(g)]}}),i(_),i(v),i(y),i(b),i(x),i(S),i(C),i(w),i(T),e(u,{title:`particle-system-3d`,get children(){return e(J,{get fallback(){return i(q)}})}}),i(E),e(c,{code:f,title:`particle-system-3d.demo.tsx`}),i(D),i(O),i(k),i(A),i(j),i(M),e(c,{code:`<ParticleSystem3D
  capacity={2000}
  emitRate={80}
  shape={new ConeShape({ angle: 25, radius: 0.2 })}
  speed={[3, 6]}
  life={[1.0, 2.0]}
  size={[0.3, 0.6]}
  sizeEnd={0.05}
  color={0xff6600}
  colorEnd={0x220000}
  alphaEnd={0}
  blendMode="add"
/>;`,title:`tsx`}),i(N),i(P),i(F),i(I),e(u,{title:`particle-container-3d`,get children(){return e(Y,{get fallback(){return i(q)}})}}),e(c,{code:d,title:`particle-container-3d.demo.tsx`}),i(L),i(R),e(c,{code:`// Packs the colour on every call.
container.setParticleAt(i, x, y, z, size, rotation, 0x66ccff, 0.9);

// A fixed tint, packed once — cheapest per slot.
const tint = packParticleColor(0x66ccff, 0.9);
container.writePacked(i, x, y, z, size, rotation, tint);

// Straight into the shared buffer, for code that already has typed arrays.
const { f32, floatStride, offsets } = container.data;
const position = offsets.aPosition / 4;

for (let i = 0; i < count; i++) {
  const vertex = i * 4 * floatStride; // four vertices per particle
  f32[vertex + position] = x[i];
  f32[vertex + position + 1] = y[i];
  f32[vertex + position + 2] = z[i];
}

container.markDirty(0, count - 1);
container.upload();`,title:`tsx`}),i(z),i(B),i(V),i(H),e(c,{code:`const BITS = [particleLifetimeBit, particleMotionBit, particleSizeOverLifeBit] as const;

<ParticleContainer3D
  capacity={2000}
  texture={Texture.WHITE}
  extraBits={BITS}
  ref={(particles) => {
    for (let i = 0; i < 2000; i++) {
      particles.setParticle(i, {
        aPosition: { x: 0, y: 0, z: 0 },
        aBirth: 0,
        aLife: 1.5,
        aVel: { x: 0, y: 2, z: 0 },
        aSizeEnd: 0,
      });
    }

    particles.upload();
  }}
/>;`,title:`tsx`}),i(U),e(c,{code:`onTick((ticker) => {
  elapsed += ticker.deltaMS / 1000;
  particles.uniforms.uParticleTime = elapsed;
});`,title:`tsx`}),i(W),i(G),(()=>{var e=i(K),t=e.firstChild.nextSibling;return n(t),e})()]}})}})}export{X as default};