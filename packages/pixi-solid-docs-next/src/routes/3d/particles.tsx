import type { JSX } from "@solidjs/web";
import { clientOnly } from "@solidjs/web";

import { CodeBlock } from "../../components/molecules/CodeBlock";
import { DemoSection } from "../../components/organisms/DemoSection";
import containerCode from "../../demos/particle-container-3d.demo.tsx?raw";
import demoCode from "../../demos/particle-system-3d.demo.tsx?raw";

const ParticleSystem3dDemo = clientOnly(() => import("../../demos/particle-system-3d.demo"), {
  export: "Demo",
});
const ParticleContainer3dDemo = clientOnly(() => import("../../demos/particle-container-3d.demo"), {
  export: "Demo",
});

export const route = {
  info: {
    label: "Particles",
    description:
      "GPU particle effects with ParticleSystem3D and hand-driven particles with ParticleContainer3D in pixi-solid-3d.",
    order: 100,
    sections: [
      { id: "simulated-particles", title: "Simulated particles" },
      { id: "why-a-component", title: "Why a component?" },
      { id: "interactive-demo", title: "Interactive demo" },
      { id: "code-example", title: "Code example" },
      { id: "emitter-shapes", title: "Emitter shapes" },
      { id: "spreads-ranges-versus-fixed-numbers", title: "Spreads: ranges versus fixed numbers" },
      { id: "additive-versus-normal-blending", title: "Additive versus normal blending" },
      { id: "hand-driven-particles", title: "Hand-driven particles" },
      { id: "writing-slots", title: "Writing slots" },
      { id: "letting-the-gpu-animate", title: "Letting the GPU animate" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <article class="ps-prose">
      <h1>Particles</h1>
      <p>
        <code>pixi-solid-3d</code> exposes both particle classes from <code>@pixi/3d</code>, and
        they do different jobs.
      </p>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>
              <code>
                {"<"}ParticleSystem3D{">"}
              </code>
            </th>
            <th>
              <code>
                {"<"}ParticleContainer3D{">"}
              </code>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Simulation</td>
            <td>built in</td>
            <td>none</td>
          </tr>
          <tr>
            <td>You write</td>
            <td>nothing per frame</td>
            <td>every slot, every frame</td>
          </tr>
          <tr>
            <td>Good for</td>
            <td>fire, smoke, sparks, rain, dust</td>
            <td>particles a physics or gameplay system owns</td>
          </tr>
          <tr>
            <td>Import</td>
            <td>
              <code>@pixi/3d/extras</code>
            </td>
            <td>
              <code>@pixi/3d</code>
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        <code>ParticleSystem3D</code> <strong>extends</strong> <code>ParticleContainer3D</code>, so
        it is the container plus an emitter. If you are not computing particle positions yourself,
        use{" "}
        <code>
          {"<"}ParticleSystem3D{">"}
        </code>{" "}
        and skip the rest of the container section.
      </p>
      <h2 id="simulated-particles">Simulated particles</h2>
      <p>
        <code>
          {"<"}ParticleSystem3D{">"}
        </code>{" "}
        emits particles from a shape, moves them under gravity and drag, and animates their size,
        colour and opacity over their life. Everything is driven by props.
      </p>
      <h3 id="why-a-component">Why a component?</h3>
      <p>
        In <code>@pixi/3d</code>, <code>ParticleSystem3D</code> steps itself from Pixi's global{" "}
        <code>Ticker.shared</code>. A default
        <code>Application</code> runs that separately from <code>app.ticker</code>, so a new
        particle can show a frame late.
      </p>
      <p>
        <code>
          {"<"}ParticleSystem3D{">"}
        </code>
        :
      </p>
      <ol>
        <li>
          <p>
            <strong>Follows your ticker</strong>: steps from the nearest contextual ticker (from{" "}
            <code>
              {"<"}PixiCanvas{">"}
            </code>
            ,
            <code>
              {"<"}PixiApplicationProvider{">"}
            </code>{" "}
            or{" "}
            <code>
              {"<"}TickerProvider{">"}
            </code>
            ) instead of a global timer.
          </p>
        </li>
        <li>
          <p>
            <strong>Updates live</strong>: <code>emitRate</code>, <code>gravity</code>,{" "}
            <code>drag</code>, <code>playing</code> and <code>frameRate</code> are reactive, so a
            signal changes the running emitter without rebuilding its GPU buffers.
          </p>
        </li>
        <li>
          <p>
            <strong>Cleans up</strong>: on unmount it frees the buffers and the ticker callback.
          </p>
        </li>
      </ol>
      <h3 id="interactive-demo">Interactive demo</h3>
      <p>Rotate and zoom the camera with your mouse or touch to inspect the 3D ember fountain:</p>
      <DemoSection title="particle-system-3d">
        <ParticleSystem3dDemo fallback={<span />} />
      </DemoSection>
      <h3 id="code-example">Code example</h3>
      <CodeBlock code={demoCode} title="particle-system-3d.demo.tsx" />
      <h3 id="emitter-shapes">Emitter shapes</h3>
      <p>
        Shapes come from <code>@pixi/3d/extras</code>:
      </p>
      <ul>
        <li>
          <p>
            <code>
              ConeShape({"{"} angle, radius {"}"})
            </code>{" "}
            spawns on an XZ disc and shoots upward in a cone. Fire plumes, exhaust, fountains,
            torches.
          </p>
        </li>
        <li>
          <p>
            <code>
              SphereShape({"{"} radius, surfaceOnly {"}"})
            </code>{" "}
            spawns inside or on a sphere, radiating outward. Magic orbs, explosions, bursts.
          </p>
        </li>
        <li>
          <p>
            <code>
              BoxShape({"{"} width, height, depth {"}"})
            </code>{" "}
            spawns across a volume. Ambient dust, snow, rain.
          </p>
        </li>
        <li>
          <p>
            <code>PointShape()</code> spawns everything from one origin.
          </p>
        </li>
      </ul>
      <h3 id="spreads-ranges-versus-fixed-numbers">Spreads: ranges versus fixed numbers</h3>
      <p>
        <code>speed</code>, <code>life</code>, <code>size</code>, <code>sizeEnd</code>,{" "}
        <code>alpha</code>, <code>alphaEnd</code> and <code>startRotation</code> accept{" "}
        <strong>spreads</strong>:
      </p>
      <ul>
        <li>
          <p>
            <strong>Fixed scalar</strong>:{" "}
            <code>
              speed={"{"}4{"}"}
            </code>{" "}
            gives every particle speed 4.
          </p>
        </li>
        <li>
          <p>
            <strong>Range</strong>:{" "}
            <code>
              speed={"{"}[2, 5]{"}"}
            </code>{" "}
            randomises between 2 and 5 per particle.
          </p>
        </li>
      </ul>
      <CodeBlock
        code={`<ParticleSystem3D
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
/>;`}
        title="tsx"
      />
      <h3 id="additive-versus-normal-blending">Additive versus normal blending</h3>
      <ul>
        <li>
          <p>
            <code>blendMode="add"</code> brightens what is behind: fire, glowing sparks, laser
            exhaust, magic.
          </p>
        </li>
        <li>
          <p>
            <code>blendMode="normal"</code> composites normally: smoke, dust, leaves, debris.
          </p>
        </li>
      </ul>
      <h2 id="hand-driven-particles">Hand-driven particles</h2>
      <p>
        <code>
          {"<"}ParticleContainer3D{">"}
        </code>{" "}
        is a pool of quads and nothing more. It never moves a particle, so your frame loop writes
        every slot and then calls <code>upload()</code> once.
      </p>
      <DemoSection title="particle-container-3d">
        <ParticleContainer3dDemo fallback={<span />} />
      </DemoSection>
      <CodeBlock code={containerCode} title="particle-container-3d.demo.tsx" />
      <h3 id="writing-slots">Writing slots</h3>
      <p>Three ways, all of which allocate nothing per particle:</p>
      <CodeBlock
        code={`// Packs the colour on every call.
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
container.upload();`}
        title="tsx"
      />
      <p>
        Call <code>upload()</code> once, after all writes for the frame. Nothing appears until you
        do. A slot with size
        <code>0</code> draws nothing, and <code>clear()</code> empties the pool.
      </p>
      <p>
        <code>setParticle(index, values)</code> also exists but takes an object literal, so reserve
        it for spawning.
      </p>
      <h3 id="letting-the-gpu-animate">Letting the GPU animate</h3>
      <p>
        Writing every particle every frame is only necessary when <em>you</em> own the simulation.
        When the motion is predictable, <code>extraBits</code> moves the work into the vertex
        shader: a bit declares per-particle attributes and uniforms, so you write each particle once
        and a frame only advances a uniform.
      </p>
      <CodeBlock
        code={`const BITS = [particleLifetimeBit, particleMotionBit, particleSizeOverLifeBit] as const;

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
/>;`}
        title="tsx"
      />
      <p>Then the frame loop is one line:</p>
      <CodeBlock
        code={`onTick((ticker) => {
  elapsed += ticker.deltaMS / 1000;
  particles.uniforms.uParticleTime = elapsed;
});`}
        title="tsx"
      />
      <p>An unknown attribute throws at spawn time and lists the attributes the bits declare.</p>
      <p>
        <code>
          {"<"}ParticleSystem3D{">"}
        </code>{" "}
        derives the bits it needs from its own props, so you never name one there.
        <code>extraBits</code> on a system only adds a bit you wrote yourself, which is an advanced
        case.
      </p>
      <p>
        See the{" "}
        <a href="https://pixijs.download/3d/release/docs/llms.txt">
          <code>@pixi/3d</code> particle bits guide
        </a>{" "}
        for writing your own.
      </p>
    </article>
  );
}
