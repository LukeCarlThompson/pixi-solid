import type * as Pixi from "pixi.js";
import { Particle, Texture } from "pixi.js";
import { ParticleContainer, useTick } from "pixi-solid";
import { onMount } from "solid-js";

export const MyParticleContainerComponent = () => {
  // Get a ref to the ParticleContainer
  let particleContainer: Pixi.ParticleContainer | undefined;

  // Create the particle instances
  const particles = Array.from(
    { length: 100 },
    () =>
      new Particle({
        texture: Texture.from("path/to/your/particle.png"),
        x: Math.random() * 800,
        y: Math.random() * 600,
        anchorX: 0.5,
        anchorY: 0.5,
      }),
  );

  // Update the particles imperatively in a useTick hook
  useTick((ticker) => {
    particles.forEach((particle) => {
      particle.rotation += 0.01 * ticker.deltaTime;
      particle.x = Math.sin(particle.rotation) * 100 + 400;
      particle.y = Math.cos(particle.rotation) * 100 + 300;
    });
  });

  onMount(() => {
    if (!particleContainer) return;
    particleContainer.addParticle(...particles);
  });

  return <ParticleContainer ref={particleContainer} />;
};
