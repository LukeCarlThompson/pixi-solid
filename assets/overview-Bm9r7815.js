import{J as e,L as t,a as n,p as r}from"./web-BTd9NawZ.js";import{c as i,i as a,o,r as s}from"./components-BiYutFnA.js";var c=`import { Container, onTick } from "pixi-solid";
import type * as Pixi from "pixi.js";

export const ExampleComponent = () => {
  // Get a ref to the Container
  let containerRef: Pixi.Container | undefined;

  onTick((ticker) => {
    if (!containerRef) return;
    containerRef.rotation += ticker.deltaTime;
  });

  return <Container ref={containerRef}>{/* ...any children */}</Container>;
};
`,l=`import { Container, onTick } from "pixi-solid";
import type * as Pixi from "pixi.js";

export const ExampleComponent = () => {
  return (
    <Container
      ref={(instance) => {
        onTick((ticker) => {
          instance.rotation += ticker.deltaTime;
        });
      }}
    >
      {/* ...children */}
    </Container>
  );
};
`,u=t(`<h1>Overview`),d=t(`<h2 id=available-components>Available components`),f=t(`<p>Most of the PixiJS display components are available as Solid components in Pixi Solid.`),p=t(`<p>All components are named the same as their PixiJS counterparts and should be imported individually.`),m=t(`<p>This pattern also allows tree shaking, because each component imports only the parts of PixiJS that it needs.`),h=t(`<p>All of the components take the same props as their PixiJS counterparts, with the addition of event handlers.`),g=t(`<p>For the purpose, capabilities, and options of each component, see the <a href=https://pixijs.download/release/docs/scene.html>PixiJS docs</a>.`),_=t(`<p>These include:`),v=t(`<p>The names clash if you also import classes or types from <code>pixi.js</code> directly.`),y=t(`<p>Alias the <code>pixi.js</code> imports in that case:`),b=t(`<p>Or import all Pixi types under a namespace. Type-only imports are not bundled:`),x=t(`<h2 id=point-axis-props-by-component>Point-axis props by component`),S=t(`<p>All components support point-axis shorthand props for fine-grained reactivity. The specific axes available depend on the component type:`),C=t(`<thead><tr><th>Component</th><th>Point-axis props`),w=t(`<tbody><tr><td><code>Container</code>, <code>RenderContainer</code>, <code>RenderLayer</code>, <code>Graphics</code>, <code>MeshPlane</code>, <code>MeshRope</code>, <code>ParticleContainer</code>, <code>PerspectiveMesh</code>, <code>SplitText</code>, <code>SplitBitmapText</code></td><td><code>positionX/Y</code>, <code>scaleX/Y</code>, <code>pivotX/Y</code>, <code>skewX/Y</code></td></tr><tr><td><code>Sprite</code>, <code>Text</code>, <code>BitmapText</code>, <code>HTMLText</code>, <code>NineSliceSprite</code>, <code>AnimatedSprite</code></td><td><code>positionX/Y</code>, <code>scaleX/Y</code>, <code>pivotX/Y</code>, <code>skewX/Y</code>, <code>anchorX/Y</code></td></tr><tr><td><code>TilingSprite</code></td><td><code>positionX/Y</code>, <code>scaleX/Y</code>, <code>pivotX/Y</code>, <code>skewX/Y</code>, <code>anchorX/Y</code>, <code>tilePositionX/Y</code>, <code>tileScaleX/Y`),T=t(`<h3 id=why-axis-props>Why axis props?`),E=t(`<p>SolidJS tracks changes by reference. Passing <code>position={{ x: 100, y: 200 }}</code> allocates a new object on every update, which both triggers the entire point to rebind and creates GC pressure. Axis props like <code>positionX</code> and <code>positionY</code> are plain <code>number</code> values — no allocations, and only the changed axis triggers an update.`),D=t(`<h2 id=property-names>Property names`),O=t(`<p>All standard PixiJS properties available on a display object instance (e.g., x, y, rotation, alpha, width, height, scale, position, pivot, anchor, skew etc.) are directly available as props on the pixi-solid components.`),k=t(`<p>In addition to this, pixi-solid enhances these point-based properties (like position, scale, pivot, anchor, and skew) by providing individual axis props. This means you can control position.x independently using positionX, position.y with positionY, and similarly for scaleX, scaleY, pivotX, pivotY, anchorX, anchorY, skewX, and skewY. This allows for more granular control over these properties directly through JSX props without needing to create a new object for every update.`),A=t(`<h2 id=accessing-the-instance-with-refs>Accessing the instance with Refs`),j=t(`<p>As with SolidJS and the DOM, you can access the rendered object instance with a <code>ref</code>. In our case this is useful for calling methods on the PixiJS objects or interacting directly with PixiJS in an imperative way.`),M=t(`<p>We can use a variable or a callback function to access refs.`),N=t(`<p>Ref as a variable.`),P=t(`<p>Ref as a callback.`),F=t(`<h2 id=using-a-pre-existing-instance-with-the-as-prop>Using a pre-existing instance with the <code>as</code> prop`),I=t(`<p>All pixi-solid components accept an optional <code>as</code> prop to use a <strong>pre-existing PixiJS instance</strong>instead of creating a new one. This is useful for sharing a single instance across parts of the tree, providing pre-configured instances, or injecting mock instances in tests.`),L=t(`<h3 id=lifecycle-note>Lifecycle note`),R=t(`<p>When <code>as</code> is provided, pixi-solid assumes <strong>you own the instance's lifecycle</strong> and will not destroy it on unmount. You must destroy it manually when it is no longer needed.`),z=t(`<h2 id=omissions>Omissions`),B=t(`<p>Some PixiJS classes are deliberately omitted, because wrapping them in a SolidJS component does not add much value:`),V=t(`<ul><li><p><code>Particle</code> — Particles inside a <code>ParticleContainer</code> are designed for maximum-performance, high-volume imperative updates. A dedicated SolidJS component for individual particles contradicts that goal. Create and manage particle instances imperatively with a <code>&lt;ParticleContainer /></code> as the parent.</p></li><li><p><code>MeshGeometry</code>, <code>NineSliceGeometry</code>, <code>PerspectivePlaneGeometry</code>, <code>PlaneGeometry</code>, <code>RopeGeometry</code> — These are low-level geometry classes used when building custom meshes. Create them imperatively with PixiJS and wrap in a custom <code>pixi-solid</code> component when needed.</p></li><li><p><code>Culler</code> — May be added in the future; hasn't been evaluated enough to determine if a SolidJS component would be useful.`);function H(){return e(i,{get children(){return e(a,{get children(){return[r(u),r(d),r(f),r(p),r(m),r(h),(()=>{var e=r(g),t=e.firstChild.nextSibling;return n(t),e})(),r(_),e(o,{code:`import {
  AnimatedSprite,
  BitmapText,
  Container,
  Graphics,
  HTMLText,
  MeshPlane,
  MeshRope,
  NineSliceSprite,
  ParticleContainer,
  PerspectiveMesh,
  RenderContainer,
  RenderLayer,
  Sprite,
  SplitBitmapText,
  SplitText,
  Text,
  TilingSprite,
} from "pixi-solid";`,title:`ts`}),r(v),r(y),e(o,{code:`import { Sprite } from "pixi-solid";
//...
import { Sprite as PixiSprite } from "pixi.js";`,title:`ts`}),r(b),e(o,{code:`import { Sprite } from "pixi-solid";
import type * as Pixi from "pixi.js";

//...

let spriteRef: Pixi.Sprite | undefined;
//...`,title:`ts`}),r(x),r(S),e(s,{get children(){return[r(C),r(w)]}}),r(T),r(E),r(D),r(O),r(k),r(A),r(j),r(M),r(N),e(o,{code:c,title:`tsx`}),r(P),e(o,{code:l,title:`tsx`}),r(F),r(I),e(o,{code:`import { Container, Sprite } from "pixi-solid";
import { Container as PixiContainer } from "pixi.js";

const existingContainer = new PixiContainer();
existingContainer.label = "my-container";

const App = () => (
  <Container as={existingContainer}>
    <Sprite texture={Texture.WHITE} />
  </Container>
);`,title:`tsx`}),r(L),r(R),e(o,{code:`import { onCleanup } from "solid-js";

const App = () => {
  const existingContainer = new PixiContainer();

  onCleanup(() => {
    existingContainer.destroy({ children: true });
  });

  return (
    <Container as={existingContainer}>
      <Sprite texture={Texture.WHITE} />
    </Container>
  );
};`,title:`tsx`}),r(z),r(B),r(V)]}})}})}export{H as default};