import{J as e,L as t,p as n}from"./web-BTd9NawZ.js";import{c as r,i,o as a}from"./components-BiYutFnA.js";var o=t(`<h1>Scene queries`),s=t(`<p>Find display objects by their <code>label</code> property, decoupling tests from scene graph hierarchy.`),c=t(`<p><code>mountScene</code> returns these helpers bound to the current root. The standalone form takes a root as its first argument, so it also works on any Pixi container you already hold.`),l=t(`<h2 id=getbylabellabel>getByLabel(label)`),u=t(`<p>Throws when the label is not found.`),d=t(`<p>The standalone form takes the root explicitly:`),f=t(`<h2 id=querybylabellabel>queryByLabel(label)`),p=t(`<p>Same as <code>getByLabel</code>, but returns <code>undefined</code> instead of throwing.`),m=t(`<h2 id=getallbylabellabel>getAllByLabel(label)`),h=t(`<p>Find every display object with the given label, which is useful when a scene repeats one:`);function g(){return e(r,{get children(){return e(i,{get children(){return[n(o),n(s),n(c),n(l),n(u),e(a,{code:`const { getByLabel } = mountScene(() => (
  <Container label="scene">
    <Sprite label="player" x={100} />
  </Container>
));

expect(getByLabel("player").x).toBe(100);`,title:`tsx`}),n(d),e(a,{code:`const player = getByLabel(container, "player");`,title:`tsx`}),n(f),n(p),e(a,{code:`const maybe = queryByLabel("missing-label"); // undefined`,title:`tsx`}),n(m),n(h),e(a,{code:`const { getAllByLabel } = mountScene(() => (
  <Container label="scene">
    <Sprite label="enemy" />
    <Sprite label="enemy" />
  </Container>
));

expect(getAllByLabel("enemy")).toHaveLength(2);`,title:`tsx`})]}})}})}export{g as default};