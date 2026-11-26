import{J as e,L as t,p as n}from"./web-BTd9NawZ.js";import{c as r,i,o as a}from"./components-BiYutFnA.js";var o=t(`<h1>cleanup`),s=t(`<p>All disposers created by <code>mountScene</code> and <code>renderHook</code> are registered with a global registry. Wire <code>cleanup()</code> into your test framework's lifecycle to run them automatically:`),c=t(`<p><code>cleanup()</code> disposes every registered root <strong>and clears Solid's error halt</strong>. Solid stops the whole reactive system after an uncaught error. Without the reset, one test that throws on purpose would break every later test in the file.`),l=t(`<p>Once wired, you no longer need to track <code>dispose</code>:`),u=t(`<p>To unmount before the end of a test, call <code>dispose()</code> directly. It unregisters that root, so later global cleanup will not dispose it twice:`);function d(){return e(r,{get children(){return e(i,{get children(){return[n(o),n(s),e(a,{code:`import { cleanup } from "pixi-solid/testing";
import { afterEach } from "vitest";

afterEach(() => cleanup());`,title:`tsx`}),n(c),n(l),e(a,{code:`it("some test", () => {
  mountScene(() => <Container label="root" />);
  // cleanup runs automatically in afterEach
});`,title:`tsx`}),n(u),e(a,{code:`const { dispose } = mountScene(() => <Container />);
// ... test logic ...
dispose();`,title:`tsx`})]}})}})}export{d as default};