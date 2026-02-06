import{P as s,a as r,u as l,H as e}from"./pixi-components.DWlrOv-o.js";import{a as t}from"./solid.CHRI_SBa.js";import"./web.DWeZmYXh.js";import"./store.BGJt8PVe.js";import"./preload-helper.BXH4tTM1.js";const o=()=>{const i=l();return[t(e,{text:"<p>HTML Text</p><p>This is a <strong>bold</strong> and <em>italic</em> text.</p>",style:{fontFamily:"Arial",fontSize:24,fill:"#e24f4fff",align:"right",padding:20},anchor:.5,get x(){return i.width*.5},get y(){return i.height*.5}}),t(e,{text:`<div class="outer">
<p>This text supports:</p>
<ul class="list">
    <li class="list__item">✨ Emojis</li>
    <li class="list__item">🎨 Custom CSS</li>
    <li class="list__item">📏 Custom word wrap sizing</li>
</ul>
</div>`,style:{fontSize:24,align:"left",fill:"#334455",cssOverrides:[".outer { line-height: 1.2; }",".list { margin: 0; padding: 0; }"],wordWrap:!0,wordWrapWidth:300}}),t(e,{text:'<div style="padding: 10px">Scale mode nearest</div>',style:{fontSize:24,fill:"#04ff00ff"},textureStyle:{scaleMode:"nearest"}})]},c=()=>t(r,{get children(){return t(s,{style:{"aspect-ratio":"2/1.5"},get children(){return t(o,{})}})}});export{c as Demo};
