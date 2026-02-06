import type * as Pixi from "pixi.js";
import { Assets, Particle } from "pixi.js";
import { onTick, ParticleContainer, PixiApplication, PixiCanvas, usePixiScreen } from "pixi-solid";
import { createResource, onMount, Show, Suspense } from "solid-js";
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
        Math.sin(cumulativeTime * orbitSpeed * (1 + indexFactor * 0.1) + indexFactor) * orbitAmplitude;
      const currentAngle = cumulativeTime * orbitSpeed * (1 + indexFactor * 0.05) + indexFactor * Math.PI;

      particle.x = pixiScreen.width * 0.5 + currentRadius * Math.cos(currentAngle);
      particle.y = pixiScreen.height * 0.5 + currentRadius * Math.sin(currentAngle);

      // Calculate pulsating scale directly within the desired range
      const scaleValue =
        minScale +
        scaleRange *
          0.5 *
          (1 + Math.sin(cumulativeTime * scalePulsateSpeed * (1 + indexFactor * 0.02) + indexFactor * 0.5));
      particle.scaleX = scaleValue;
      particle.scaleY = scaleValue;

      particle.rotation += baseRotationSpeed * Math.sin(indexFactor) * ticker.deltaTime;
    });
  });

  onMount(() => {
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
  // Create a resource to load the sky texture
  const [textureResource] = createResource(() => Assets.load<Pixi.Texture>(assetUrl));
  return <Show when={textureResource()}>{(texture) => <MyParticleContainer particleTexture={texture()} />}</Show>;
};

export const Demo = () => (
  <PixiApplication>
    <Suspense fallback={<div>Loading...</div>}>
      <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
        <DemoComponent />
      </PixiCanvas>
    </Suspense>
  </PixiApplication>
);
