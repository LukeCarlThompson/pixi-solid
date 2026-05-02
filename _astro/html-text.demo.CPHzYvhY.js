import{u as s}from"./use-pixi-screen.BqjAPQtE.js";import{P as l,H as e}from"./pixi-canvas.CDfQJEOS.js";import{a as t}from"./solid.CQt0tiR7.js";const r=()=>{const i=s();return[t(e,{text:"<p>HTML Text</p><p>This is a <strong>bold</strong> and <em>italic</em> text.</p>",style:{fontFamily:"Arial",fontSize:24,fill:"#e24f4fff",align:"right",padding:20},anchor:.5,get x(){return i.width*.5},get y(){return i.height*.5}}),t(e,{text:`<div class="outer">
<p>This text supports:</p>
<ul class="list">
    <li class="list__item">✨ Emojis</li>
    <li class="list__item">🎨 Custom CSS</li>
    <li class="list__item">📏 Custom word wrap sizing</li>
</ul>
</div>`,style:{fontSize:24,align:"left",fill:"#334455",cssOverrides:[".outer { line-height: 1.2; }",".list { margin: 0; padding: 0; }"],wordWrap:!0,wordWrapWidth:300}}),t(e,{text:'<div style="padding: 10px">Scale mode nearest</div>',style:{fontSize:24,fill:"#04ff00ff"},textureStyle:{scaleMode:"nearest"}})]},p=()=>t(l,{style:{"aspect-ratio":"2/1.5"},get children(){return t(r,{})}});export{p as Demo};
