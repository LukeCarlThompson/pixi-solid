import{w as h,N as x,O as S,Q as I,W as p}from"./pixi-canvas.DUqT5F9V.js";import{S as v}from"./DefaultBatcher.BjOCpEt_.js";import{u as b}from"./BufferResource.BALqOo0E.js";const O={name:"texture-bit",vertex:{header:`

        struct TextureUniforms {
            uTextureMatrix:mat3x3<f32>,
        }

        @group(2) @binding(2) var<uniform> textureUniforms : TextureUniforms;
        `,main:`
            uv = (textureUniforms.uTextureMatrix * vec3(uv, 1.0)).xy;
        `},fragment:{header:`
            @group(2) @binding(0) var uTexture: texture_2d<f32>;
            @group(2) @binding(1) var uSampler: sampler;


        `,main:`
            outColor = textureSample(uTexture, uSampler, vUV);
        `}},D={name:"texture-bit",vertex:{header:`
            uniform mat3 uTextureMatrix;
        `,main:`
            uv = (uTextureMatrix * vec3(uv, 1.0)).xy;
        `},fragment:{header:`
        uniform sampler2D uTexture;


        `,main:`
            outColor = texture(uTexture, vUV);
        `}};function E(f,t){for(const e in f.attributes){const s=f.attributes[e],n=t[e];n?(s.format??(s.format=n.format),s.offset??(s.offset=n.offset),s.instance??(s.instance=n.instance)):s.format||h(`Attribute ${e} is not present in the shader, but is present in the geometry. Unable to infer attribute details.`)}y(f)}function y(f){const{buffers:t,attributes:e}=f,s={},n={};for(const r in t){const a=t[r];s[a.uid]=0,n[a.uid]=0}for(const r in e){const a=e[r];s[a.buffer.uid]+=x(a.format).stride}for(const r in e){const a=e[r];a.stride??(a.stride=s[a.buffer.uid]),a.start??(a.start=n[a.buffer.uid]),n[a.buffer.uid]+=x(a.format).stride}}const m=[];m[v.NONE]=void 0;m[v.DISABLED]={stencilWriteMask:0,stencilReadMask:0};m[v.RENDERING_MASK_ADD]={stencilFront:{compare:"equal",passOp:"increment-clamp"},stencilBack:{compare:"equal",passOp:"increment-clamp"}};m[v.RENDERING_MASK_REMOVE]={stencilFront:{compare:"equal",passOp:"decrement-clamp"},stencilBack:{compare:"equal",passOp:"decrement-clamp"}};m[v.MASK_ACTIVE]={stencilWriteMask:0,stencilFront:{compare:"equal",passOp:"keep"},stencilBack:{compare:"equal",passOp:"keep"}};m[v.INVERSE_MASK_ACTIVE]={stencilWriteMask:0,stencilFront:{compare:"not-equal",passOp:"keep"},stencilBack:{compare:"not-equal",passOp:"keep"}};class T{constructor(t){this._syncFunctionHash=Object.create(null),this._adaptor=t,this._systemCheck()}_systemCheck(){if(!S())throw new Error("Current environment does not allow unsafe-eval, please use pixi.js/unsafe-eval module to enable support.")}ensureUniformGroup(t){const e=this.getUniformGroupData(t);t.buffer||(t.buffer=new I({data:new Float32Array(e.layout.size/4),usage:p.UNIFORM|p.COPY_DST}))}getUniformGroupData(t){return this._syncFunctionHash[t._signature]||this._initUniformGroup(t)}_initUniformGroup(t){const e=t._signature;let s=this._syncFunctionHash[e];if(!s){const n=Object.keys(t.uniformStructures).map(o=>t.uniformStructures[o]),r=this._adaptor.createUboElements(n),a=this._generateUboSync(r.uboElements);s=this._syncFunctionHash[e]={layout:r,syncFunction:a}}return this._syncFunctionHash[e]}_generateUboSync(t){return this._adaptor.generateUboSync(t)}syncUniformGroup(t,e,s){const n=this.getUniformGroupData(t);t.buffer||(t.buffer=new I({data:new Float32Array(n.layout.size/4),usage:p.UNIFORM|p.COPY_DST}));let r=null;return e||(e=t.buffer.data,r=t.buffer.dataInt32),s||(s=0),n.syncFunction(t.uniforms,e,r,s),!0}updateUniformGroup(t){if(t.isStatic&&!t._dirtyId)return!1;t._dirtyId=0;const e=this.syncUniformGroup(t);return t.buffer.update(),e}destroy(){this._syncFunctionHash=null}}function k(f,t,e){const s=[`
        var v = null;
        var v2 = null;
        var t = 0;
        var index = 0;
        var name = null;
        var arrayOffset = null;
    `];let n=0;for(let a=0;a<f.length;a++){const o=f[a],c=o.data.name;let u=!1,i=0;for(let l=0;l<b.length;l++)if(b[l].test(o.data)){i=o.offset/4,s.push(`name = "${c}";`,`offset += ${i-n};`,b[l].ubo),u=!0;break}if(!u)if(o.data.size>1)i=o.offset/4,s.push(e(o,i-n));else{const l=t[o.data.type];i=o.offset/4,s.push(`
                    v = uv.${c};
                    offset += ${i-n};
                    ${l};
                `)}n=i}const r=s.join(`
`);return new Function("uv","data","dataInt32","offset",r)}function d(f,t){return`
        for (let i = 0; i < ${f*t}; i++) {
            data[offset + (((i / ${f})|0) * 4) + (i % ${f})] = v[i];
        }
    `}const _={f32:`
        data[offset] = v;`,i32:`
        dataInt32[offset] = v;`,u32:`
        dataInt32[offset] = v;`,"vec2<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];`,"vec3<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];`,"vec4<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 3] = v[3];`,"vec2<i32>":`
        dataInt32[offset] = v[0];
        dataInt32[offset + 1] = v[1];`,"vec3<i32>":`
        dataInt32[offset] = v[0];
        dataInt32[offset + 1] = v[1];
        dataInt32[offset + 2] = v[2];`,"vec4<i32>":`
        dataInt32[offset] = v[0];
        dataInt32[offset + 1] = v[1];
        dataInt32[offset + 2] = v[2];
        dataInt32[offset + 3] = v[3];`,"vec2<u32>":`
        dataInt32[offset] = v[0];
        dataInt32[offset + 1] = v[1];`,"vec3<u32>":`
        dataInt32[offset] = v[0];
        dataInt32[offset + 1] = v[1];
        dataInt32[offset + 2] = v[2];`,"vec4<u32>":`
        dataInt32[offset] = v[0];
        dataInt32[offset + 1] = v[1];
        dataInt32[offset + 2] = v[2];
        dataInt32[offset + 3] = v[3];`,"mat2x2<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 4] = v[2];
        data[offset + 5] = v[3];`,"mat3x3<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 4] = v[3];
        data[offset + 5] = v[4];
        data[offset + 6] = v[5];
        data[offset + 8] = v[6];
        data[offset + 9] = v[7];
        data[offset + 10] = v[8];`,"mat4x4<f32>":`
        for (let i = 0; i < 16; i++) {
            data[offset + i] = v[i];
        }`,"mat3x2<f32>":d(3,2),"mat4x2<f32>":d(4,2),"mat2x3<f32>":d(2,3),"mat4x3<f32>":d(4,3),"mat2x4<f32>":d(2,4),"mat3x4<f32>":d(3,4)},A={..._,"mat2x2<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 3] = v[3];
    `};function R(f,t,e,s,n){if(f=Math.max(0,f),t=Math.min(t,e*s),f>=t)return 0;const r=Math.floor(f/e),a=f-r*e,o=Math.floor(t/e),c=t-o*e;if(r===o)return n[0].set(a,r,c-a,1),1;let u=0,i=r;return a>0&&(n[u++].set(a,r,e-a,1),i++),o>i&&n[u++].set(0,i,e,o-i),c>0&&n[u++].set(0,o,c,1),u}export{m as G,T as U,_ as a,D as b,k as c,E as e,R as g,O as t,A as u};
