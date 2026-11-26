const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/event-names.demo-TgZcBbw1.js","assets/web-BTd9NawZ.js"])))=>i.map(i=>d[i]);
import{J as e,L as t,a as n,c as r,p as i,z as a}from"./web-BTd9NawZ.js";import{c as o,i as s,o as c,t as l}from"./components-BiYutFnA.js";var u=t(`<h1>Overview`),d=t(`<h2 id=event-handlers>Event handlers`),f=t(`<p>Pixi Solid components support all PixiJS event handlers for various user interactions and events. These event handlers can be added as props to the components, similar to how event handlers are added in SolidJS.`),p=t(`<p>The event handler names are the same as in PixiJS, but prefixed with <code>on</code>.<code>mouseover</code> becomes <code>onmouseover</code>. Refer to the <a href=https://pixijs.com/8.x/guides/components/events>PixiJS events docs</a> for more details on each event and when they are triggered and how event modes work. The usage is exactly the same as in PixiJS but we access them via SolidJS props instead of adding and removing listeners imperatively.`),m=t(`<h3 id=full-event-list>Full event list`),h=t(`<span>`),g=r(()=>a(()=>import(`./event-names.demo-TgZcBbw1.js`),__vite__mapDeps([0,1])),{export:`Demo`},`src/demos/event-names.demo.tsx`);function _(){return e(o,{get children(){return e(s,{get children(){return[i(u),i(d),i(f),(()=>{var e=i(p),t=e.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling;return n(t),e})(),e(c,{code:`//...
<Sprite
  //...
  eventMode="static"
  onpointertap={(event) => {
    console.log("Sprite clicked!", event);
  }}
  onpointerover={(event) => {
    console.log("Pointer moved over Sprite!", event);
  }}
/>;
//...`,title:`tsx`}),i(m),e(l,{title:`event-names`,get children(){return e(g,{get fallback(){return i(h)}})}})]}})}})}export{_ as default};