import{J as e,L as t,p as n}from"./web-BTd9NawZ.js";import{c as r,i,o as a,r as o,s}from"./components-BiYutFnA.js";var c=t(`<h1>useScreenToWorld`),l=t(`<p><code>useScreenToWorld</code> is a reactive SolidJS hook that takes a 2D screen coordinate (such as mouse cursor or touch point) and unprojects it into 3D world space against a given 3D <code>Plane</code> (like a floor or wall) or along the camera ray.`),u=t(`<h2 id=usage>Usage`),d=t(`<h2 id=parameters>Parameters`),f=t(`<thead><tr><th>Parameter</th><th>Type</th><th>Description`),p=t(`<tbody><tr><td><code>screenPoint</code></td><td><code>PointData | Accessor&lt;PointData></code></td><td>The 2D screen position to unproject</td></tr><tr><td><code>target</code></td><td><code>Plane | number | Accessor&lt;...></code></td><td>A 3D <code>Plane</code> to intersect with, or a number representing distance along the ray`),m=t(`<h2 id=context-requirement>Context requirement`),h=t(`<p><code>useScreenToWorld</code> reads the ambient <code>View3DContext</code>. Call it inside <code>&lt;View3D></code>, or anywhere within a <code>&lt;View3DProvider></code> (including sibling 2D overlays). Calling it outside both throws:`),g=t(`<p><code>useScreenToWorld must be used within a &lt;View3D>, a &lt;View3DProvider>, or a component mounted inside one.`),_=t(`<p><code>&lt;View3DProvider></code> creates the <code>View3D</code> up front, so the hook always has an instance to unproject through. The result becomes meaningful once the scene is built and the camera is in the graph, which happens during the first tick after mount.`),v=t(`<h2 id=return-value>Return Value`),y=t(`<p>Returns an Accessor to <code>{ x: number, y: number, z: number } | null</code>. Returns <code>null</code> if the ray misses or is parallel to the target plane.`);function b(){return e(r,{get children(){return e(i,{get children(){return[n(c),n(l),n(u),e(a,{code:`import { Plane, Vector3 } from "@pixi/3d";
import { useScreenToWorld, Mesh3D } from "pixi-solid-3d";
import { createSignal, Show } from "solid-js";

export const GroundReticle = () => {
  const [screenPos, setScreenPos] = createSignal({ x: 400, y: 300 });
  const groundPlane = new Plane(new Vector3(0, 1, 0), 0); // y = 0

  // Reactively unprojects screen coordinates onto the 3D ground plane
  const worldPos = useScreenToWorld(screenPos, groundPlane);

  return (
    <Show when={worldPos()}>
      {(pos) => (
        <Mesh3D
          x={pos().x}
          y={pos().y}
          z={pos().z}
          geometry={circleGeometry}
          material={reticleMaterial}
        />
      )}
    </Show>
  );
};`,title:`tsx`}),n(d),e(o,{get children(){return[n(f),n(p)]}}),n(m),n(h),e(s,{tone:`warning`,get children(){return n(g)}}),n(_),n(v),n(y)]}})}})}export{b as default};