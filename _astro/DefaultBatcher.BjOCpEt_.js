import{u as O,d as tt,G as et,a3 as rt,Q as V,W as z,w as it,H as nt,A as at}from"./pixi-canvas.DUqT5F9V.js";import{g as ot,a as st,G as ut,S as ct}from"./Shader.C8jqO_v2.js";class G{constructor(t){typeof t=="number"?this.rawBinaryData=new ArrayBuffer(t):t instanceof Uint8Array?this.rawBinaryData=t.buffer:this.rawBinaryData=t,this.uint32View=new Uint32Array(this.rawBinaryData),this.float32View=new Float32Array(this.rawBinaryData),this.size=this.rawBinaryData.byteLength}get int8View(){return this._int8View||(this._int8View=new Int8Array(this.rawBinaryData)),this._int8View}get uint8View(){return this._uint8View||(this._uint8View=new Uint8Array(this.rawBinaryData)),this._uint8View}get int16View(){return this._int16View||(this._int16View=new Int16Array(this.rawBinaryData)),this._int16View}get int32View(){return this._int32View||(this._int32View=new Int32Array(this.rawBinaryData)),this._int32View}get float64View(){return this._float64Array||(this._float64Array=new Float64Array(this.rawBinaryData)),this._float64Array}get bigUint64View(){return this._bigUint64Array||(this._bigUint64Array=new BigUint64Array(this.rawBinaryData)),this._bigUint64Array}view(t){return this[`${t}View`]}destroy(){this.rawBinaryData=null,this.uint32View=null,this.float32View=null,this.uint16View=null,this._int8View=null,this._uint8View=null,this._int16View=null,this._int32View=null,this._float64Array=null,this._bigUint64Array=null}static sizeOf(t){switch(t){case"int8":case"uint8":return 1;case"int16":case"uint16":return 2;case"int32":case"uint32":case"float32":return 4;default:throw new Error(`${t} isn't a valid view type`)}}}function D(r,t,e,i){if(e??(e=0),i??(i=Math.min(r.byteLength-e,t.byteLength)),!(e&7)&&!(i&7)){const n=i/8;new Float64Array(t,0,n).set(new Float64Array(r,e,n))}else if(!(e&3)&&!(i&3)){const n=i/4;new Float32Array(t,0,n).set(new Float32Array(r,e,n))}else new Uint8Array(t).set(new Uint8Array(r,e,i))}const lt={normal:"normal-npm",add:"add-npm",screen:"screen-npm"};var ht=(r=>(r[r.DISABLED=0]="DISABLED",r[r.RENDERING_MASK_ADD=1]="RENDERING_MASK_ADD",r[r.MASK_ACTIVE=2]="MASK_ACTIVE",r[r.INVERSE_MASK_ACTIVE=3]="INVERSE_MASK_ACTIVE",r[r.RENDERING_MASK_REMOVE=4]="RENDERING_MASK_REMOVE",r[r.NONE=5]="NONE",r))(ht||{});function E(r,t){return t.alphaMode==="no-premultiply-alpha"&&lt[r]||r}const ft=["precision mediump float;","void main(void){","float test = 0.1;","%forloop%","gl_FragColor = vec4(0.0);","}"].join(`
`);function dt(r){let t="";for(let e=0;e<r;++e)e>0&&(t+=`
else `),e<r-1&&(t+=`if(test == ${e}.0){}`);return t}function xt(r,t){if(r===0)throw new Error("Invalid value of `0` passed to `checkMaxIfStatementsInShader`");const e=t.createShader(t.FRAGMENT_SHADER);try{for(;;){const i=ft.replace(/%forloop%/gi,dt(r));if(t.shaderSource(e,i),t.compileShader(e),!t.getShaderParameter(e,t.COMPILE_STATUS))r=r/2|0;else break}}finally{t.deleteShader(e)}return r}let B=null;function pt(){if(B)return B;const r=ot();return B=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),B=xt(B,r),r.getExtension("WEBGL_lose_context")?.loseContext(),B}class mt{constructor(){this.ids=Object.create(null),this.textures=[],this.count=0}clear(){for(let t=0;t<this.count;t++){const e=this.textures[t];this.textures[t]=null,this.ids[e.uid]=null}this.count=0}}class vt{constructor(){this.renderPipeId="batch",this.action="startBatch",this.start=0,this.size=0,this.textures=new mt,this.blendMode="normal",this.topology="triangle-strip",this.canBundle=!0}destroy(){this.textures=null,this.gpuBindGroup=null,this.bindGroup=null,this.batcher=null,this.elements=null}}const I=[];let P=0;et.register({clear:()=>{if(I.length>0)for(const r of I)r&&r.destroy();I.length=0,P=0}});function R(){return P>0?I[--P]:new vt}function $(r){r.elements=null,I[P++]=r}let w=0;const X=class Y{constructor(t){this.uid=O("batcher"),this.dirty=!0,this.batchIndex=0,this.batches=[],this._elements=[],t={...Y.defaultOptions,...t},t.maxTextures||(tt("v8.8.0","maxTextures is a required option for Batcher now, please pass it in the options"),t.maxTextures=pt());const{maxTextures:e,attributesInitialSize:i,indicesInitialSize:n}=t;this.attributeBuffer=new G(i*4),this.indexBuffer=new Uint16Array(n),this.maxTextures=e}begin(){this.elementSize=0,this.elementStart=0,this.indexSize=0,this.attributeSize=0;for(let t=0;t<this.batchIndex;t++)$(this.batches[t]);this.batchIndex=0,this._batchIndexStart=0,this._batchIndexSize=0,this.dirty=!0}add(t){this._elements[this.elementSize++]=t,t._indexStart=this.indexSize,t._attributeStart=this.attributeSize,t._batcher=this,this.indexSize+=t.indexSize,this.attributeSize+=t.attributeSize*this.vertexSize}checkAndUpdateTexture(t,e){const i=t._batch.textures.ids[e._source.uid];return!i&&i!==0?!1:(t._textureId=i,t.texture=e,!0)}updateElement(t){this.dirty=!0;const e=this.attributeBuffer;t.packAsQuad?this.packQuadAttributes(t,e.float32View,e.uint32View,t._attributeStart,t._textureId):this.packAttributes(t,e.float32View,e.uint32View,t._attributeStart,t._textureId)}break(t){const e=this._elements;if(!e[this.elementStart])return;let i=R(),n=i.textures;n.clear();const s=e[this.elementStart];let u=E(s.blendMode,s.texture._source),o=s.topology;this.attributeSize*4>this.attributeBuffer.size&&this._resizeAttributeBuffer(this.attributeSize*4),this.indexSize>this.indexBuffer.length&&this._resizeIndexBuffer(this.indexSize);const c=this.attributeBuffer.float32View,h=this.attributeBuffer.uint32View,m=this.indexBuffer;let f=this._batchIndexSize,d=this._batchIndexStart,g="startBatch",x=[];const _=this.maxTextures;for(let v=this.elementStart;v<this.elementSize;++v){const a=e[v];e[v]=null;const l=a.texture._source,p=E(a.blendMode,l),S=u!==p||o!==a.topology;if(l._batchTick===w&&!S){a._textureId=l._textureBindLocation,f+=a.indexSize,a.packAsQuad?(this.packQuadAttributes(a,c,h,a._attributeStart,a._textureId),this.packQuadIndex(m,a._indexStart,a._attributeStart/this.vertexSize)):(this.packAttributes(a,c,h,a._attributeStart,a._textureId),this.packIndex(a,m,a._indexStart,a._attributeStart/this.vertexSize)),a._batch=i,x.push(a);continue}(n.count>=_||S)&&(this._finishBatch(i,d,f-d,n,u,o,t,g,x),g="renderBatch",d=f,u=p,o=a.topology,i=R(),n=i.textures,n.clear(),x=[],++w),l._batchTick=w,a._textureId=l._textureBindLocation=n.count,n.ids[l.uid]=n.count,n.textures[n.count++]=l,a._batch=i,x.push(a),f+=a.indexSize,a.packAsQuad?(this.packQuadAttributes(a,c,h,a._attributeStart,a._textureId),this.packQuadIndex(m,a._indexStart,a._attributeStart/this.vertexSize)):(this.packAttributes(a,c,h,a._attributeStart,a._textureId),this.packIndex(a,m,a._indexStart,a._attributeStart/this.vertexSize))}n.count>0&&(this._finishBatch(i,d,f-d,n,u,o,t,g,x),d=f,++w),this.elementStart=this.elementSize,this._batchIndexStart=d,this._batchIndexSize=f}_finishBatch(t,e,i,n,s,u,o,c,h){t.gpuBindGroup=null,t.bindGroup=null,t.action=c,t.batcher=this,t.textures=n,t.blendMode=s,t.topology=u,t.start=e,t.size=i,t.elements=h,++w,this.batches[this.batchIndex++]=t,o.add(t)}finish(t){this.break(t)}ensureAttributeBuffer(t){t*4<=this.attributeBuffer.size||this._resizeAttributeBuffer(t*4)}ensureIndexBuffer(t){t<=this.indexBuffer.length||this._resizeIndexBuffer(t)}_resizeAttributeBuffer(t){const e=Math.max(t,this.attributeBuffer.size*2),i=new G(e);D(this.attributeBuffer.rawBinaryData,i.rawBinaryData),this.attributeBuffer=i}_resizeIndexBuffer(t){const e=this.indexBuffer;let i=Math.max(t,e.length*1.5);i+=i%2;const n=i>65535?new Uint32Array(i):new Uint16Array(i);if(n.BYTES_PER_ELEMENT!==e.BYTES_PER_ELEMENT)for(let s=0;s<e.length;s++)n[s]=e[s];else D(e.buffer,n.buffer);this.indexBuffer=n}packQuadIndex(t,e,i){t[e]=i+0,t[e+1]=i+1,t[e+2]=i+2,t[e+3]=i+0,t[e+4]=i+2,t[e+5]=i+3}packIndex(t,e,i,n){const s=t.indices,u=t.indexSize,o=t.indexOffset,c=t.attributeOffset;for(let h=0;h<u;h++)e[i++]=n+s[h+o]-c}destroy(t={}){if(this.batches!==null){for(let e=0;e<this.batchIndex;e++)$(this.batches[e]);this.batches=null,this.geometry.destroy(!0),this.geometry=null,t.shader&&(this.shader?.destroy(),this.shader=null);for(let e=0;e<this._elements.length;e++)this._elements[e]&&(this._elements[e]._batch=null);this._elements=null,this.indexBuffer=null,this.attributeBuffer.destroy(),this.attributeBuffer=null}}};X.defaultOptions={maxTextures:null,attributesInitialSize:4,indicesInitialSize:6};let gt=X;const St=new Float32Array(1),_t=new Uint32Array(1);class bt extends rt{constructor(){const e=new V({data:St,label:"attribute-batch-buffer",usage:z.VERTEX|z.COPY_DST,shrinkToFit:!1}),i=new V({data:_t,label:"index-batch-buffer",usage:z.INDEX|z.COPY_DST,shrinkToFit:!1}),n=24;super({attributes:{aPosition:{buffer:e,format:"float32x2",stride:n,offset:0},aUV:{buffer:e,format:"float32x2",stride:n,offset:8},aColor:{buffer:e,format:"unorm8x4",stride:n,offset:16},aTextureIdAndRound:{buffer:e,format:"uint16x2",stride:n,offset:20}},indexBuffer:i})}}function k(r,t,e){if(r)for(const i in r){const n=i.toLocaleLowerCase(),s=t[n];if(s){let u=r[i];i==="header"&&(u=u.replace(/@in\s+[^;]+;\s*/g,"").replace(/@out\s+[^;]+;\s*/g,"")),e&&s.push(`//----${e}----//`),s.push(u)}else it(`${i} placement hook does not exist in shader`)}}const yt=/\{\{(.*?)\}\}/g;function j(r){const t={};return(r.match(yt)?.map(i=>i.replace(/[{()}]/g,""))??[]).forEach(i=>{t[i]=[]}),t}function F(r,t){let e;const i=/@in\s+([^;]+);/g;for(;(e=i.exec(r))!==null;)t.push(e[1])}function H(r,t,e=!1){const i=[];F(t,i),r.forEach(o=>{o.header&&F(o.header,i)});const n=i;e&&n.sort();const s=n.map((o,c)=>`       @location(${c}) ${o},`).join(`
`);let u=t.replace(/@in\s+[^;]+;\s*/g,"");return u=u.replace("{{in}}",`
${s}
`),u}function N(r,t){let e;const i=/@out\s+([^;]+);/g;for(;(e=i.exec(r))!==null;)t.push(e[1])}function Bt(r){const e=/\b(\w+)\s*:/g.exec(r);return e?e[1]:""}function wt(r){const t=/@.*?\s+/g;return r.replace(t,"")}function At(r,t){const e=[];N(t,e),r.forEach(c=>{c.header&&N(c.header,e)});let i=0;const n=e.sort().map(c=>c.indexOf("builtin")>-1?c:`@location(${i++}) ${c}`).join(`,
`),s=e.sort().map(c=>`       var ${wt(c)};`).join(`
`),u=`return VSOutput(
            ${e.sort().map(c=>` ${Bt(c)}`).join(`,
`)});`;let o=t.replace(/@out\s+[^;]+;\s*/g,"");return o=o.replace("{{struct}}",`
${n}
`),o=o.replace("{{start}}",`
${s}
`),o=o.replace("{{return}}",`
${u}
`),o}function Q(r,t){let e=r;for(const i in t){const n=t[i];n.join(`
`).length?e=e.replace(`{{${i}}}`,`//-----${i} START-----//
${n.join(`
`)}
//----${i} FINISH----//`):e=e.replace(`{{${i}}}`,"")}return e}const b=Object.create(null),U=new Map;let It=0;function zt({template:r,bits:t}){const e=q(r,t);if(b[e])return b[e];const{vertex:i,fragment:n}=Ut(r,t);return b[e]=J(i,n,t),b[e]}function Pt({template:r,bits:t}){const e=q(r,t);return b[e]||(b[e]=J(r.vertex,r.fragment,t)),b[e]}function Ut(r,t){const e=t.map(u=>u.vertex).filter(u=>!!u),i=t.map(u=>u.fragment).filter(u=>!!u);let n=H(e,r.vertex,!0);n=At(e,n);const s=H(i,r.fragment,!0);return{vertex:n,fragment:s}}function q(r,t){return t.map(e=>(U.has(e)||U.set(e,It++),U.get(e))).sort((e,i)=>e-i).join("-")+r.vertex+r.fragment}function J(r,t,e){const i=j(r),n=j(t);return e.forEach(s=>{k(s.vertex,i,s.name),k(s.fragment,n,s.name)}),{vertex:Q(r,i),fragment:Q(t,n)}}const Tt=`
    @in aPosition: vec2<f32>;
    @in aUV: vec2<f32>;

    @out @builtin(position) vPosition: vec4<f32>;
    @out vUV : vec2<f32>;
    @out vColor : vec4<f32>;

    {{header}}

    struct VSOutput {
        {{struct}}
    };

    @vertex
    fn main( {{in}} ) -> VSOutput {

        var worldTransformMatrix = globalUniforms.uWorldTransformMatrix;
        var modelMatrix = mat3x3<f32>(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        var position = aPosition;
        var uv = aUV;

        {{start}}

        vColor = vec4<f32>(1., 1., 1., 1.);

        {{main}}

        vUV = uv;

        var modelViewProjectionMatrix = globalUniforms.uProjectionMatrix * worldTransformMatrix * modelMatrix;

        vPosition =  vec4<f32>((modelViewProjectionMatrix *  vec3<f32>(position, 1.0)).xy, 0.0, 1.0);

        vColor *= globalUniforms.uWorldColorAlpha;

        {{end}}

        {{return}}
    };
`,Ct=`
    @in vUV : vec2<f32>;
    @in vColor : vec4<f32>;

    {{header}}

    @fragment
    fn main(
        {{in}}
      ) -> @location(0) vec4<f32> {

        {{start}}

        var outColor:vec4<f32>;

        {{main}}

        var finalColor:vec4<f32> = outColor * vColor;

        {{end}}

        return finalColor;
      };
`,Mt=`
    in vec2 aPosition;
    in vec2 aUV;

    out vec4 vColor;
    out vec2 vUV;

    {{header}}

    void main(void){

        mat3 worldTransformMatrix = uWorldTransformMatrix;
        mat3 modelMatrix = mat3(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        vec2 position = aPosition;
        vec2 uv = aUV;

        {{start}}

        vColor = vec4(1.);

        {{main}}

        vUV = uv;

        mat3 modelViewProjectionMatrix = uProjectionMatrix * worldTransformMatrix * modelMatrix;

        gl_Position = vec4((modelViewProjectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);

        vColor *= uWorldColorAlpha;

        {{end}}
    }
`,Vt=`

    in vec4 vColor;
    in vec2 vUV;

    out vec4 finalColor;

    {{header}}

    void main(void) {

        {{start}}

        vec4 outColor;

        {{main}}

        finalColor = outColor * vColor;

        {{end}}
    }
`,Gt={name:"global-uniforms-bit",vertex:{header:`
        struct GlobalUniforms {
            uProjectionMatrix:mat3x3<f32>,
            uWorldTransformMatrix:mat3x3<f32>,
            uWorldColorAlpha: vec4<f32>,
            uResolution: vec2<f32>,
        }

        @group(0) @binding(0) var<uniform> globalUniforms : GlobalUniforms;
        `}},Dt={name:"global-uniforms-bit",vertex:{header:`
          uniform mat3 uProjectionMatrix;
          uniform mat3 uWorldTransformMatrix;
          uniform vec4 uWorldColorAlpha;
          uniform vec2 uResolution;
        `}};function Et({bits:r,name:t}){const e=zt({template:{fragment:Ct,vertex:Tt},bits:[Gt,...r]});return ut.from({name:t,vertex:{source:e.vertex,entryPoint:"main"},fragment:{source:e.fragment,entryPoint:"main"}})}function Rt({bits:r,name:t}){return new st({name:t,...Pt({template:{vertex:Mt,fragment:Vt},bits:[Dt,...r]})})}const $t={name:"color-bit",vertex:{header:`
            @in aColor: vec4<f32>;
        `,main:`
            vColor *= vec4<f32>(aColor.rgb * aColor.a, aColor.a);
        `}},kt={name:"color-bit",vertex:{header:`
            in vec4 aColor;
        `,main:`
            vColor *= vec4(aColor.rgb * aColor.a, aColor.a);
        `}},T={};function jt(r){const t=[];if(r===1)t.push("@group(1) @binding(0) var textureSource1: texture_2d<f32>;"),t.push("@group(1) @binding(1) var textureSampler1: sampler;");else{let e=0;for(let i=0;i<r;i++)t.push(`@group(1) @binding(${e++}) var textureSource${i+1}: texture_2d<f32>;`),t.push(`@group(1) @binding(${e++}) var textureSampler${i+1}: sampler;`)}return t.join(`
`)}function Ft(r){const t=[];if(r===1)t.push("outColor = textureSampleGrad(textureSource1, textureSampler1, vUV, uvDx, uvDy);");else{t.push("switch vTextureId {");for(let e=0;e<r;e++)e===r-1?t.push("  default:{"):t.push(`  case ${e}:{`),t.push(`      outColor = textureSampleGrad(textureSource${e+1}, textureSampler${e+1}, vUV, uvDx, uvDy);`),t.push("      break;}");t.push("}")}return t.join(`
`)}function Ht(r){return T[r]||(T[r]={name:"texture-batch-bit",vertex:{header:`
                @in aTextureIdAndRound: vec2<u32>;
                @out @interpolate(flat) vTextureId : u32;
            `,main:`
                vTextureId = aTextureIdAndRound.y;
            `,end:`
                if(aTextureIdAndRound.x == 1)
                {
                    vPosition = vec4<f32>(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
                }
            `},fragment:{header:`
                @in @interpolate(flat) vTextureId: u32;

                ${jt(r)}
            `,main:`
                var uvDx = dpdx(vUV);
                var uvDy = dpdy(vUV);

                ${Ft(r)}
            `}}),T[r]}const C={};function Nt(r){const t=[];for(let e=0;e<r;e++)e>0&&t.push("else"),e<r-1&&t.push(`if(vTextureId < ${e}.5)`),t.push("{"),t.push(`	outColor = texture(uTextures[${e}], vUV);`),t.push("}");return t.join(`
`)}function Qt(r){return C[r]||(C[r]={name:"texture-batch-bit",vertex:{header:`
                in vec2 aTextureIdAndRound;
                out float vTextureId;

            `,main:`
                vTextureId = aTextureIdAndRound.y;
            `,end:`
                if(aTextureIdAndRound.x == 1.)
                {
                    gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
                }
            `},fragment:{header:`
                in float vTextureId;

                uniform sampler2D uTextures[${r}];

            `,main:`

                ${Nt(r)}
            `}}),C[r]}const Wt={name:"round-pixels-bit",vertex:{header:`
            fn roundPixels(position: vec2<f32>, targetSize: vec2<f32>) -> vec2<f32>
            {
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `}},Kt={name:"round-pixels-bit",vertex:{header:`
            vec2 roundPixels(vec2 position, vec2 targetSize)
            {
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `}},W={};function Xt(r){let t=W[r];if(t)return t;const e=new Int32Array(r);for(let i=0;i<r;i++)e[i]=i;return t=W[r]=new nt({uTextures:{value:e,type:"i32",size:r}},{isStatic:!0}),t}class K extends ct{constructor(t){const e=Rt({name:"batch",bits:[kt,Qt(t),Kt]}),i=Et({name:"batch",bits:[$t,Ht(t),Wt]});super({glProgram:e,gpuProgram:i,resources:{batchSamplers:Xt(t)}}),this.maxTextures=t}}let A=null;const Z=class L extends gt{constructor(t){super(t),this.geometry=new bt,this.name=L.extension.name,this.vertexSize=6,A??(A=new K(t.maxTextures)),this.shader=A}packAttributes(t,e,i,n,s){const u=s<<16|t.roundPixels&65535,o=t.transform,c=o.a,h=o.b,m=o.c,f=o.d,d=o.tx,g=o.ty,{positions:x,uvs:_}=t,v=t.color,a=t.attributeOffset,y=a+t.attributeSize;for(let l=a;l<y;l++){const p=l*2,S=x[p],M=x[p+1];e[n++]=c*S+m*M+d,e[n++]=f*M+h*S+g,e[n++]=_[p],e[n++]=_[p+1],i[n++]=v,i[n++]=u}}packQuadAttributes(t,e,i,n,s){const u=t.texture,o=t.transform,c=o.a,h=o.b,m=o.c,f=o.d,d=o.tx,g=o.ty,x=t.bounds,_=x.maxX,v=x.minX,a=x.maxY,y=x.minY,l=u.uvs,p=t.color,S=s<<16|t.roundPixels&65535;e[n+0]=c*v+m*y+d,e[n+1]=f*y+h*v+g,e[n+2]=l.x0,e[n+3]=l.y0,i[n+4]=p,i[n+5]=S,e[n+6]=c*_+m*y+d,e[n+7]=f*y+h*_+g,e[n+8]=l.x1,e[n+9]=l.y1,i[n+10]=p,i[n+11]=S,e[n+12]=c*_+m*a+d,e[n+13]=f*a+h*_+g,e[n+14]=l.x2,e[n+15]=l.y2,i[n+16]=p,i[n+17]=S,e[n+18]=c*v+m*a+d,e[n+19]=f*a+h*v+g,e[n+20]=l.x3,e[n+21]=l.y3,i[n+22]=p,i[n+23]=S}_updateMaxTextures(t){this.shader.maxTextures!==t&&(A=new K(t),this.shader=A)}destroy(){this.shader=null,super.destroy()}};Z.extension={type:[at.Batcher],name:"default"};let Jt=Z;export{Jt as D,ht as S,G as V,$t as a,xt as b,Et as c,Rt as d,kt as e,D as f,Ht as g,Qt as h,Kt as i,Xt as j,E as k,Wt as r};
