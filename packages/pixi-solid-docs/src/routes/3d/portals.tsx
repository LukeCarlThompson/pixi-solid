import type { JSX } from "@solidjs/web";

import snippet2 from "../../code-examples/3d-portals-2.tsx?raw";
import { Article, Aside, CodeBlock, Searchable } from "../../components";
import { href } from "../../href";

export const route = {
  info: {
    label: "Portals and Render Textures",
    description:
      "Showing a live render texture on a 3D surface, and building a real portal through a wall, with pixi-solid-3d.",
    order: 100,
    sections: [
      { id: "showing-a-render-texture", title: "Showing a render texture" },
      { id: "a-real-portal", title: "A real portal" },
      { id: "disposing", title: "Disposing" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <Article>
      <Searchable>
        <h1>Portals and Render Textures</h1>
        <p>
          <code>
            {"<"}PortalMaterial{">"}
          </code>{" "}
          shows a render texture on a surface. That covers two jobs:
        </p>
        <ul>
          <li>
            <p>
              <strong>A window onto another view</strong> — a security monitor, a picture frame, a
              teleporter face. You supply a render texture from anywhere, such as a second camera.
            </p>
          </li>
          <li>
            <p>
              <strong>A real portal</strong> — a doorway that leads somewhere else in the same
              scene. This needs the pass below as well.
            </p>
          </li>
        </ul>
        <p>The render texture is always yours: you create it, size it, and destroy it.</p>
        <h2 id="showing-a-render-texture">Showing a render texture</h2>
        <CodeBlock
          code={`import { FlatMaterial, PlaneGeometry } from "@pixi/3d";
import { Mesh3D } from "pixi-solid-3d";
import { PortalMaterial } from "pixi-solid-3d";

const feed = RenderTexture.create({ width: 512, height: 512 });

<Mesh3D geometry={geometry}>
  <PortalMaterial texture={feed} baseColor={0xbfdcff} />
</Mesh3D>;`}
          title="tsx"
        />
        <p>
          <code>texture</code> is a shortcut for the material's <code>portal</code> slot, and{" "}
          <code>baseColor</code> tints it. Leave <code>texture</code> out and the surface shows
          plain <code>baseColor</code> until you assign <code>material.textures.portal</code>.
        </p>
        <p>
          <code>
            {"<"}PortalMaterial{">"}
          </code>{" "}
          is written as a child of{" "}
          <code>
            {"<"}Mesh3D{">"}
          </code>
          , so it is created, updated and destroyed with the mesh. See{" "}
          <a href={href("/3d/meshes-and-materials")}>Meshes and Materials</a> for the ownership
          rules the other materials follow.
        </p>
        <h2 id="a-real-portal">A real portal</h2>
        <p>
          A portal is two quads facing their local <code>+Z</code>:
        </p>
        <ul>
          <li>
            <p>
              <strong>entry</strong> — the surface the viewer looks through, drawn with{" "}
              <code>
                {"<"}PortalMaterial{">"}
              </code>
              .
            </p>
          </li>
          <li>
            <p>
              <strong>exit</strong> — the quad on the far side. The room the portal shows sits in
              front of it.
            </p>
          </li>
        </ul>
        <p>
          Each frame, <code>PortalPass</code> puts a camera behind the exit where the viewer is in
          front of the entry, renders the scene through it into the feed, and the entry shows the
          result. Because the entry shows that image at the viewer's own screen position, it reads
          as an opening rather than a picture.
        </p>
        <CodeBlock code={snippet2} title="tsx" />
        <p>
          The meshes are built as instances because the pass needs them at construction.{" "}
          <code>as</code> adopts them, so the components add them to the view and leave destroying
          them to you. Note the two imports: <code>Mesh3DClass</code> is <code>@pixi/3d</code>'s
          class, while{" "}
          <code>
            {"<"}Mesh3D{">"}
          </code>{" "}
          is the component.
        </p>
        <p>Three rules decide whether it looks right:</p>
        <ul>
          <li>
            <p>
              <strong>Size the feed to the view, and resize it with the view.</strong> Another
              aspect ratio stretches the far side, and too few pixels blur it.
            </p>
          </li>
          <li>
            <p>
              <strong>
                Give both quads the same <code>scale</code>.
              </strong>{" "}
              A scale only one of them has carries into the portal camera and distorts the far side.
            </p>
          </li>
          <li>
            <p>
              <strong>Use a perspective camera and an unrotated view.</strong> With an orthographic
              camera the far side does not show, and in a rotated view the image does not line up
              with the opening.
            </p>
          </li>
        </ul>
        <p>
          <code>PortalPass</code> runs at the <code>'beforeOpaque'</code> stage, so its position in{" "}
          <code>passes</code> does not matter; it always finishes before the scene draws the entry.
        </p>
        <Aside tone="note">
          The far side draws only opaque and transparent meshes, with no sky. Enclose the far room,
          or add a background pass to <code>portal.camera</code>. The pass also skips frames where
          the entry is hidden, off screen or seen from behind, and a portal that can see itself
          updates one frame late per level.
          <code>PortalFeedPass</code> is internal — <code>PortalPass</code> builds it for you.
        </Aside>
        <h2 id="disposing">Disposing</h2>
        <p>
          <code>PortalPass</code> frees its own resources when the view is destroyed. The feed
          render texture is yours, so destroy it when the scene unloads:
        </p>
        <CodeBlock code={`onCleanup(() => feed.destroy(true));`} title="tsx" />
      </Searchable>
    </Article>
  );
}
