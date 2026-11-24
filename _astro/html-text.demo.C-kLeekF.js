import{t as e}from"./pixi-canvas.BSuupF8M.js";import{b as t}from"./DemoMount.astro_astro_type_script_index_0_lang.CPsol503.js";import{a as n}from"./components.D9VWMYtw.js";import{t as r}from"./use-pixi-screen.DHznOHlg.js";var i=()=>{let e=r();return[t(n,{text:`<p>HTML Text</p><p>This is a <strong>bold</strong> and <em>italic</em> text.</p>`,style:{fontFamily:`Arial`,fontSize:24,fill:`#e24f4fff`,align:`right`,padding:20},anchor:.5,get x(){return e.width*.5},get y(){return e.height*.5}}),t(n,{text:`<div class="outer">
<p>This text supports:</p>
<ul class="list">
    <li class="list__item">✨ Emojis</li>
    <li class="list__item">🎨 Custom CSS</li>
    <li class="list__item">📏 Custom word wrap sizing</li>
</ul>
</div>`,style:{fontSize:24,align:`left`,fill:`#334455`,cssOverrides:[`.outer { line-height: 1.2; }`,`.list { margin: 0; padding: 0; }`],wordWrap:!0,wordWrapWidth:300}}),t(n,{text:`<div style="padding: 10px">Scale mode nearest</div>`,style:{fontSize:24,fill:`#04ff00ff`},textureStyle:{scaleMode:`nearest`}})]},a=()=>t(e,{style:{"aspect-ratio":`2/1.5`},get children(){return t(i,{})}});export{a as Demo};