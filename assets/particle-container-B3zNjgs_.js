const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/particle-container.demo-BZO07g9U.js","assets/web-BTd9NawZ.js","assets/CanvasPool-DtqSaXnh.js","assets/rolldown-runtime-hePW80VL.js","assets/dist-BWyuAgmK.js","assets/Filter-tmaoo_H6.js","assets/canvasUtils-BmkL-0m_.js","assets/Cache-DjsX-fAq.js","assets/RenderTargetSystem-CXGlBGSL.js","assets/GCManagedHash-iaZqB6Fm.js","assets/GraphicsContext-oKSnaaQD.js","assets/getTextureBatchBindGroup-CPqe_4fB.js","assets/getTexelRangeRects-7j664Y_P.js","assets/Assets-D-FVVTjl.js","assets/checkExtension-BGvys2BB.js"])))=>i.map(i=>d[i]);
import{J as e,L as t,a as n,c as r,p as i,z as a}from"./web-BTd9NawZ.js";import{c as o,i as s,o as c,t as l}from"./components-BiYutFnA.js";var u=`import { onTick, ParticleContainer, PixiCanvas, usePixiScreen } from "pixi-solid";
import type * as Pixi from "pixi.js";
import { Assets, Particle } from "pixi.js";
import { createMemo, Loading, onSettled } from "solid-js";

import assetUrl from "@/assets/food-icons/fried-egg.png";

type ParticleContainerProps = Omit<Pixi.ParticleContainerOptions, "children"> & {
  particleTexture: Pixi.Texture;
};

const MyParticleContainer = (props: ParticleContainerProps) => {
  const pixiScreen = usePixiScreen();
  // Get a ref to the ParticleContainer
  let particleContainerRef: Pixi.ParticleContainer | undefined;

  // Create an array to hold Pixi.Particle instances
  const particles: Pixi.Particle[] = [];
  // Create an array of random offset values for each particle
  const offsets: number[] = [];

  // Initialize particles with base properties
  for (let i = 0; i < 500; i++) {
    particles.push(
      new Particle({
        texture: props.particleTexture,
        rotation: 0,
        anchorX: 0.5,
        anchorY: 0.5,
        scaleX: 0.5,
        scaleY: 0.5,
      }),
    );
    offsets.push(Math.random());
  }

  let cumulativeTime = 0; // Track time passed to move particles smoothly
  const baseOrbitRadius = 150; // Average distance from the center
  const orbitAmplitude = 150; // How much the radius pulsates
  const orbitSpeed = 0.003; // Speed of the circular motion
  const scalePulsateSpeed = 0.02; // Speed of scale changes
  const baseRotationSpeed = 0.05; // Base rotation speed
  const minScale = 0.25;
  const maxScale = 1;
  const scaleRange = maxScale - minScale;

  // Update the particles imperatively in a onTick hook
  onTick((ticker) => {
    cumulativeTime += ticker.deltaTime;

    particles.forEach((particle, i) => {
      const indexFactor = offsets[i] * 100;

      // Smooth circular motion with pulsating radius
      const currentRadius =
        baseOrbitRadius +
        Math.sin(cumulativeTime * orbitSpeed * (1 + indexFactor * 0.1) + indexFactor) *
          orbitAmplitude;
      const currentAngle =
        cumulativeTime * orbitSpeed * (1 + indexFactor * 0.05) + indexFactor * Math.PI;

      particle.x = pixiScreen.width * 0.5 + currentRadius * Math.cos(currentAngle);
      particle.y = pixiScreen.height * 0.5 + currentRadius * Math.sin(currentAngle);

      // Calculate pulsating scale directly within the desired range
      const scaleValue =
        minScale +
        scaleRange *
          0.5 *
          (1 +
            Math.sin(
              cumulativeTime * scalePulsateSpeed * (1 + indexFactor * 0.02) + indexFactor * 0.5,
            ));
      particle.scaleX = scaleValue;
      particle.scaleY = scaleValue;

      particle.rotation += baseRotationSpeed * Math.sin(indexFactor) * ticker.deltaTime;
    });
  });

  onSettled(() => {
    if (!particleContainerRef) return;
    // Add the particle to our container on mount
    particleContainerRef.addParticle(...particles);
  });

  return (
    <ParticleContainer
      // Set the dynamic properties we want to animate
      dynamicProperties={{
        position: true,
        rotation: true,
        vertex: true,
      }}
      ref={(particleContainer) => {
        particleContainerRef = particleContainer;
      }}
    />
  );
};

const DemoComponent = () => {
  const texture = createMemo(() => Assets.load<Pixi.Texture>(assetUrl));

  return <MyParticleContainer particleTexture={texture()} />;
};

export const Demo = () => (
  <Loading fallback={<div>Loading...</div>}>
    <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
      <DemoComponent />
    </PixiCanvas>
  </Loading>
);
`,d=t(`<h1>Particle Container`),f=t(`<p>A SolidJS component that renders a PixiJS <code>ParticleContainer</code>.`),p=t(`<p>Please see the <a href=https://pixijs.download/release/docs/scene.ParticleContainer.html>PixiJS docs</a> for detailed information.`),m=t(`<h2 id=demo>Demo`),h=t(`<p>Food icons by <a href=https://darinagrant.itch.io/pixel-art-food-icon-pack-32x32>Darina Grant</a>.`),g=t(`<h2 id=code-example>Code example`),_=t(`<span>`),v=r(()=>a(()=>import(`./particle-container.demo-BZO07g9U.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14])),{export:`Demo`},`src/demos/particle-container.demo.tsx`);function y(){return e(o,{get children(){return e(s,{get children(){return[i(d),i(f),(()=>{var e=i(p),t=e.firstChild.nextSibling;return n(t),e})(),i(m),e(l,{title:`particle-container`,get children(){return e(v,{get fallback(){return i(_)}})}}),(()=>{var e=i(h),t=e.firstChild.nextSibling;return n(t),e})(),i(g),e(c,{code:u,title:`particle-container-demo.tsx`})]}})}})}export{y as default};