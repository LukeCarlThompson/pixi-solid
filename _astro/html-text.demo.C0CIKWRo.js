import{o as e,t}from"./pixi-canvas.DW7IbBT1.js";import{b as n}from"./DemoMount.astro_astro_type_script_index_0_lang.GK8QDboE.js";import{t as r}from"./use-pixi-screen.OK781cbn.js";var i=()=>{let t=r();return[n(e,{text:`<p>HTML Text</p><p>This is a <strong>bold</strong> and <em>italic</em> text.</p>`,style:{fontFamily:`Arial`,fontSize:24,fill:`#e24f4fff`,align:`right`,padding:20},anchor:.5,get x(){return t.width*.5},get y(){return t.height*.5}}),n(e,{text:`<div class="outer">
<p>This text supports:</p>
<ul class="list">
    <li class="list__item">✨ Emojis</li>
    <li class="list__item">🎨 Custom CSS</li>
    <li class="list__item">📏 Custom word wrap sizing</li>
</ul>
</div>`,style:{fontSize:24,align:`left`,fill:`#334455`,cssOverrides:[`.outer { line-height: 1.2; }`,`.list { margin: 0; padding: 0; }`],wordWrap:!0,wordWrapWidth:300}}),n(e,{text:`<div style="padding: 10px">Scale mode nearest</div>`,style:{fontSize:24,fill:`#04ff00ff`},textureStyle:{scaleMode:`nearest`}})]},a=()=>n(t,{style:{"aspect-ratio":`2/1.5`},get children(){return n(i,{})}});export{a as Demo};