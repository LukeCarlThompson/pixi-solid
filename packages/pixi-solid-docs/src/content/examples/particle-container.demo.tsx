import type * as Pixi from "pixi.js";
import { Assets, Particle } from "pixi.js";
import { onResize, onTick, ParticleContainer, PixiApplication, PixiCanvas, PixiStage } from "pixi-solid";
import { createResource, onMount, Show, Suspense } from "solid-js";

export type ParticleContainerProps = Omit<Pixi.ParticleContainerOptions, "children"> & {
  particleTexture: Pixi.Texture;
  ref: (instance: Pixi.ParticleContainer) => void;
};

export const MyParticleContainerComponent = (props: ParticleContainerProps) => {
  // Get a ref to the ParticleContainer
  let particleContainerRef: Pixi.ParticleContainer | undefined;

  // Create an array to hold Pixi.Particle instances
  const particles: Pixi.Particle[] = [];

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
      })
    );
  }

  let cumulativeTime = 0; // Track time passed to move particles smoothly
  const baseOrbitRadius = 100; // Average distance from the center
  const orbitAmplitude = 200; // How much the radius pulsates
  const orbitSpeed = 0.005; // Speed of the circular motion
  const scalePulsateSpeed = 0.05; // Speed of scale changes
  const baseRotationSpeed = 0.05; // Base rotation speed
  const minScale = 0.25;
  const maxScale = 1.0;
  const scaleRange = maxScale - minScale;

  // Update the particles imperatively in a onTick hook
  onTick((ticker) => {
    cumulativeTime += ticker.deltaTime;

    particles.forEach((particle, i) => {
      const indexFactor = i * 0.1;

      // Smooth circular motion with pulsating radius
      const currentRadius =
        baseOrbitRadius +
        Math.sin(cumulativeTime * orbitSpeed * (1 + indexFactor * 0.1) + indexFactor) * orbitAmplitude;
      const currentAngle = cumulativeTime * orbitSpeed * (1 + indexFactor * 0.05) + indexFactor * Math.PI;

      particle.x = currentRadius * Math.cos(currentAngle);
      particle.y = currentRadius * Math.sin(currentAngle);

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
        // Bind the ref in this component and forward the ref to our propr.ref as well
        particleContainerRef = particleContainer;
        props.ref(particleContainer);
      }}
    />
  );
};

export const DemoApp = () => {
  // Create a resource to load the sky texture
  const [textureResource] = createResource(() => Assets.load<Pixi.Texture>("/spark.webp"));
  return (
    <PixiApplication>
      <Suspense fallback={<div>Loading...</div>}>
        <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
          {/* Show our Stage when the assets are loaded */}
          <Show when={textureResource()}>
            {(texture) => (
              <PixiStage>
                <MyParticleContainerComponent
                  particleTexture={texture()}
                  ref={(particleContainer) => {
                    onResize((screen) => {
                      particleContainer.position.x = screen.width * 0.5;
                      particleContainer.position.y = screen.height * 0.5;
                    });
                  }}
                />
              </PixiStage>
            )}
          </Show>
        </PixiCanvas>
      </Suspense>
    </PixiApplication>
  );
};
