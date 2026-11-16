import{aJ as Me,aK as $e,af as ie,ag as le,ah as ue,ai as Ie,aj as ce,al as de,a6 as I,a8 as Ce,a9 as fe,aa as pe,R as A,ab as he,ac as Pe,ad as Le,j as $,ae as me,am as Oe,an as Re,ao as Ee,a as Ae,a4 as J,ar as X,as as Q,at as Fe,au as je,av as ke,aw as Ne,N as Ue,ax as ze,ay as Ve,az as We,aA as He,J as Ke,aC as Ye,aD as qe,aE as Je,aF as Xe,aI as Qe,L as Ze}from"./view-3d.CbSxVUmV.js";import{Y as ge,Z as et,c as tt,V as rt,S as at,C as ot,_ as st,d as nt,f as it,g as lt,l as ut,r as xe,b as ct,i as dt,h as ft,j as Z,E as pt,m as ht,k,n as mt,o as gt,s as xt,p as bt,q as vt,t as St,u as yt,v as wt,w as _t,x as Tt,y as Bt,z as Dt,A as Gt,D as Mt,I as $t,$ as It,a0 as Ct,M as Pt,K as Lt,N as Ot,O as Rt,P as Et,Q as At,T as Ft,U as jt,W as kt,X as Nt}from"./View3DGlobalData.DNnAoUh4.js";import{ab as Ut,g as C,h as zt,A as q,w as B,H as Vt,R as Wt,o as Ht,ac as ee,C as Kt,K as Yt}from"./pixi-canvas.DUqT5F9V.js";import{a as qt,i as Jt}from"./instanceFetchBitGl.BHsCL7dp.js";import{S as N}from"./Shader.C8jqO_v2.js";const Xt=1,Qt=4294967295;var Zt=class{data;_source;_texture;_capacity=0;constructor(e=256){this.ensureCapacity(e)}get texture(){return this._texture}get capacity(){return this._capacity}ensureCapacity(e){if(e<=this._capacity)return;let t=Math.max(256,this._capacity);for(;t<e;)t*=2;this._capacity=t;const r=Math.min(t,$e),a=Math.ceil(t/r);if(this.data=new Uint32Array(r*a*Xt).fill(Qt),!this._source){this._source=new Ut({resource:this.data,width:r,height:a,format:"r32uint",scaleMode:"nearest",alphaMode:"no-premultiply-alpha",label:"InstanceIndex"}),this._texture=new C({source:this._source});return}this._source.resource=this.data,(this._source.width!==r||this._source.height!==a)&&this._source.resize(r,a)}upload(e,t){e<t&&Me(this._source,e,t)}unload(){this._source?.unload()}destroy(){this._texture&&(this._texture.destroy(!0),this._texture=null,this._source=null,this.data=null)}};function er(e,t){const r=Object.create(null),a=ie(t);for(const{name:s}of a)r[s]={resources:Object.create(null),storages:Object.create(null),uniformBuffers:Object.create(null),uniformGroups:Object.create(null)};for(const s of e)if(s.bindings)for(const[l,i]of Object.entries(s.bindings)){const n=r[l];if(n)for(const{name:u,spec:c,uniformGroup:p}of le(i,l)){const f=ue(c);Ie.has(f)?n.resources[u]=!0:ce(f)?n.storages[u]=!0:de(f)?n.uniformBuffers[u]=!0:n.uniformGroups[p]=!0}}const o={};return a.forEach(({name:s},l)=>{const i=r[s],n={};let u=0;i.uniformGroups[s]&&(n[u++]=s);for(const c in i.resources)n[u++]=c;for(const c in i.storages)n[u++]=c;for(const c in i.uniformBuffers)n[u++]=c;for(const c in i.uniformGroups)c!==s&&(n[u++]=c);o[l]=n}),o}const L={name:"globalGl",structs:{Light:et,ShadowData:ge},bindings:{global:{uGlobalLightParams:"vec4<f32>",uTime:"f32",uFogColor:"vec3<f32>",uDisplayExposure:"f32",uFogParams:"vec3<f32>",uExposure:"f32",uHemisphereSky:"vec3<f32>",uHemisphereGround:"vec3<f32>",uHemisphereUp:"vec3<f32>",uEnvironmentMaxMipLevel:"f32",uLightData:"array<vec4<f32>, 128>",uShadowData:`array<vec4<f32>, ${pe*6}>`,uEnvironmentTexture:"texture_cube<f32>",uBrdfLutTexture:"texture_2d<f32>",uMaterialStorage:"texture_2d<u32>",uShadowMap:"texture_depth_2d_array",uBonePitTexture:"texture_2d<f32>",uOpaqueDepthTexture:"texture_2d<f32>",uOpaqueColorTexture:"texture_2d<f32>",uMorphTexture:"texture_2d<f32>",uGeometryTexture:"texture_2d<u32>"}},gl:{header:`
const float LIGHT_DIRECTIONAL = 0.0;
const float LIGHT_POINT = 1.0;
const float LIGHT_SPOT = 2.0;
`}};function tr(){return{uEnvironmentMaxMipLevel:{value:0,type:"f32"}}}function K(e,t){let r=e._gpuData[t.uid];if(!r){const a=tt(e._lightDataList.data,e._shadowDataList.data,tr()),o=new zt({global:a,uEnvironmentTexture:fe.source,uBrdfLutTexture:C.EMPTY.source,uMaterialStorage:I.source,uShadowMap:Ce.source,uBonePitTexture:C.EMPTY.source,uOpaqueDepthTexture:C.EMPTY.source,uOpaqueColorTexture:C.EMPTY.source,uMorphTexture:C.EMPTY.source,uGeometryTexture:I.source,uMeshStoreTexture:I.source,uRenderInstanceTexture:I.source,batchTransform:t.material3d.batcher.batchTransform,uInstanceStoreTexture:I.source});r=new rt(a,o,{opaqueColor:{group:o,slot:"uOpaqueColorTexture"},opaqueDepth:{group:o,slot:"uOpaqueDepthTexture"},shadowMap:{group:o,slot:"uShadowMap"}}),e._gpuData[t.uid]=r}return r}var rr=class{static extension={type:[q.WebGLSystem],name:"lighting3d"};_renderer;constructor(e){this._renderer=e}update(e,t){const r=e.passByBit[A.SHADOW];r?.beginFrame(e);const a=K(e,this._renderer).globalUniformGroup.uniforms,o=a.uGlobalLightParams;o[0]=0,o[1]=0,o[2]=0;const s=e.environment;s!==null&&!(s instanceof he)&&Pe(s,a.uHemisphereSky,a.uHemisphereGround,a.uHemisphereUp);const l=e._lightDataList;l.reset();for(let i=0;i<t.length;i++){const n=t[i];if(n._worldVisible){if(n.type==="ambient"){Le(o,0,n.color,n.intensity);continue}l.count>=32||(r?.prepareShadow(n,e),l.add(n))}}o[3]=l.count}};function be(e){const t=e?" * 2":"";return{name:e?"morphTargetNormalGl":"morphTargetGl",bindings:{global:{uMorphTexture:"texture_2d<f32>",uGeometryTexture:"texture_2d<u32>"}},gl:{vertex:{header:`
        vec4 fetchMorphTexel(int texel) {
          return texelFetch(uMorphTexture, ${$("texel")}, 0);
        }

        float fetchMorphWeight(int index) {
          return fetchMorphTexel(index >> 2)[index & 3];
        }

        uvec4 fetchGeometryMorphFacts(int geometryIndex) {
          int texel = geometryIndex * 2 + 1;
          return texelFetch(uGeometryTexture, ${$("texel")}, 0);
        }
      `,input:`
        if (morphData.x != 0.0) {
          uvec4 morphFacts = fetchGeometryMorphFacts(int(morphData.y));
          int morphTargetCount = int(morphFacts.y);
          int vidLocal = gl_VertexID - int(morphFacts.z);
          int morphDeltaTexel = int(morphFacts.x) / 4 + vidLocal * morphTargetCount${t};
          int morphWeightIndex = int(morphData.x);
          vec3 morphedPosition = position.xyz;${e?`
          vec3 morphedNormal = normal;`:""}
          for (int morphIndex = 0; morphIndex < morphTargetCount; morphIndex++) {
            float morphWeight = fetchMorphWeight(morphWeightIndex + morphIndex);
            if (morphWeight != 0.0) {
              morphedPosition += fetchMorphTexel(morphDeltaTexel + morphIndex${t}).xyz * morphWeight;${e?`
              morphedNormal += fetchMorphTexel(morphDeltaTexel + morphIndex * 2 + 1).xyz * morphWeight;`:""}
            }
          }
          position = vec4(morphedPosition, position.w);${e?`
          normal = normalize(morphedNormal);`:""}
        }
      `}}}}const ar=be(!1),or=be(!0);function R(e){return Number.isInteger(e)?`${e}.0`:`${e}`}function sr(e){const t=e.some(([o,s])=>o!==0||s!==0),r=([o,s])=>o===0&&s===0?"uv":`uv + vec2(${R(o)}, ${R(s)}) * texelSize`,a=["      float currentDepth = depth - params.x;"];if(t&&a.push("      float texelSize = 1.0 / params.z;"),a.push("      float fl = float(layer);",""),e.length===1)a.push(`      return texture(uShadowMap, vec4(${r(e[0])}, fl, currentDepth));`);else{const o=e.map(s=>`        texture(uShadowMap, vec4(${r(s)}, fl, currentDepth))`).join(` +
`);a.push(`      float shadow =
${o};`,"",`      return shadow / ${R(e.length)};`)}return a.join(`
`)}function U(e){return{name:`shadowGl:${e}`,structs:{ShadowData:ge},bindings:{global:{uShadowMap:"texture_depth_2d_array",uShadowData:`array<vec4<f32>, ${pe*6}>`}},gl:{header:`

    ShadowData getShadowData(int index) {
      int offset = index * 6;
      ShadowData sd;
      sd.lightSpaceMatrix = mat4(
        uShadowData[offset + 0],
        uShadowData[offset + 1],
        uShadowData[offset + 2],
        uShadowData[offset + 3]
      );
      sd.shadowParams = uShadowData[offset + 4];
      sd.cascadeSplits = uShadowData[offset + 5];
      return sd;
    }

    float sampleShadowLayer(int layer, mat4 lightSpaceMatrix, vec3 worldPos, vec3 normal, vec3 params, float NdotL) {
      vec3 biasedPos = worldPos + normal * (params.y * (1.0 - NdotL));
      vec4 lightSpacePos = lightSpaceMatrix * vec4(biasedPos, 1.0);
      vec3 projPos = lightSpacePos.xyz / lightSpacePos.w;

      vec2 uv = projPos.xy * 0.5 + 0.5;
      float depth = projPos.z * 0.5 + 0.5;

      vec3 uvd = vec3(uv, depth);
      if (any(notEqual(clamp(uvd, 0.0, 1.0), uvd))) {
        return 1.0;
      }

${sr(at[e])}
    }

    float calculateShadow(
      Light light,
      vec3 worldPos,
      vec3 normal,
      float NdotL
    ) {
      int baseIndex = int(light.shadowDataIndex);

      if (baseIndex == -1) {
        return 1.0;
      }

      ShadowData base = getShadowData(baseIndex);
      int last = int(base.shadowParams.w) - 1;

      if (last < 1) {
        return sampleShadowLayer(baseIndex, base.lightSpaceMatrix, worldPos, normal, base.shadowParams.xyz, NdotL);
      }

      float viewDepth = -(uViewMatrix * vec4(worldPos, 1.0)).z;
      vec3 splits = base.cascadeSplits.xyz;

      vec3 crossed = step(splits, vec3(viewDepth));
      int cascadeIndex = int(min(dot(crossed, vec3(1.0)), float(last)));

      int idx = baseIndex + cascadeIndex;
      ShadowData sd = getShadowData(idx);
      float shadow = sampleShadowLayer(idx, sd.lightSpaceMatrix, worldPos, normal, sd.shadowParams.xyz, NdotL);

      if (cascadeIndex == last) {
        return shadow;
      }

      vec3 hot = vec3(float(cascadeIndex == 0), float(cascadeIndex == 1), float(cascadeIndex == 2));
      float splitFar = dot(splits, hot);
      float splitNear = dot(splits, vec3(hot.y, hot.z, 0.0));

      float band = max((splitFar - splitNear) * ${R(ot)}, 1e-4);
      float blend = clamp((viewDepth - splitFar + band) / band, 0.0, 1.0);

      if (blend <= 0.0) {
        return shadow;
      }

      ShadowData nd = getShadowData(idx + 1);
      float next = sampleShadowLayer(idx + 1, nd.lightSpaceMatrix, worldPos, normal, nd.shadowParams.xyz, NdotL);

      return mix(shadow, next, blend);
    }
  `}}}const nr={hard:U("hard"),pcf:U("pcf"),"pcf-high":U("pcf-high")},z={name:"skinningGl",attributes:{aJoints:"uint8x4",aWeights:"float32x4"},bindings:{global:{uBonePitTexture:"texture_2d<f32>"}},gl:{vertex:{header:`
        void getBoneRows(uint jointIndex, uint bonePitIndex, out vec4 r0, out vec4 r1, out vec4 r2) {
          int baseTexel = int(bonePitIndex + jointIndex) * 3;

          r0 = texelFetch(uBonePitTexture, ${$("baseTexel")}, 0);
          r1 = texelFetch(uBonePitTexture, ${$("baseTexel + 1")}, 0);
          r2 = texelFetch(uBonePitTexture, ${$("baseTexel + 2")}, 0);
        }
      `,input:`
        vec4 skinRow0, skinRow1, skinRow2;
        vec4 b0, b1, b2;

        getBoneRows(uint(aJoints.x), uint(bonePitIndex), b0, b1, b2);
        skinRow0 = b0 * aWeights.x;
        skinRow1 = b1 * aWeights.x;
        skinRow2 = b2 * aWeights.x;

        getBoneRows(uint(aJoints.y), uint(bonePitIndex), b0, b1, b2);
        skinRow0 += b0 * aWeights.y;
        skinRow1 += b1 * aWeights.y;
        skinRow2 += b2 * aWeights.y;

        getBoneRows(uint(aJoints.z), uint(bonePitIndex), b0, b1, b2);
        skinRow0 += b0 * aWeights.z;
        skinRow1 += b1 * aWeights.z;
        skinRow2 += b2 * aWeights.z;

        getBoneRows(uint(aJoints.w), uint(bonePitIndex), b0, b1, b2);
        skinRow0 += b0 * aWeights.w;
        skinRow1 += b1 * aWeights.w;
        skinRow2 += b2 * aWeights.w;

        position = vec4(dot(skinRow0, position), dot(skinRow1, position), dot(skinRow2, position), position.w);
        normal = vec3(dot(skinRow0.xyz, normal), dot(skinRow1.xyz, normal), dot(skinRow2.xyz, normal));
        tangent = vec3(dot(skinRow0.xyz, tangent), dot(skinRow1.xyz, tangent), dot(skinRow2.xyz, tangent));
      `}}},ir={float32:"float",float32x2:"vec2",float32x3:"vec3",float32x4:"vec4",sint32:"int",sint32x2:"ivec2",sint32x3:"ivec3",sint32x4:"ivec4",uint32:"uint",uint32x2:"uvec2",uint32x3:"uvec3",uint32x4:"uvec4",float16x2:"vec2",float16x4:"vec4",unorm8x2:"vec2",unorm8x4:"vec4",snorm8x2:"vec2",snorm8x4:"vec4",uint8x2:"uvec2",uint8x4:"uvec4",sint8x2:"ivec2",sint8x4:"ivec4",unorm16x2:"vec2",unorm16x4:"vec4",snorm16x2:"vec2",snorm16x4:"vec4",uint16x2:"uvec2",uint16x4:"uvec4",sint16x2:"ivec2",sint16x4:"ivec4"};function lr(e){const t=ir[e];return t||(B(`[compileAttributesGlsl] Unknown vertex format: "${e}"`),"vec4")}function ur(e,t,r){B(`[compileAttributesGlsl] Attribute "${e}" redefined with different format: "${r}" → "${t}". Keeping original.`)}function cr(e,t={}){const{useLocations:r=!0}=t,a=new Map;for(const l of e)if(l.attributes)for(const[i,n]of Object.entries(l.attributes))a.has(i)?a.get(i)!==n&&ur(i,n,a.get(i)):a.set(i,n);const o=[];let s=0;for(const[l,i]of a){const n=lr(i);r?o.push(`layout(location = ${s++}) in ${n} ${l};`):o.push(`in ${n} ${l};`)}return o.join(`
`)}const dr={collectData(e){if(e.stage==="vertex"){const t=e.data.glsl??={};t.attributes??=cr(e.bits,{useLocations:e.glslOptions?.useLocations})}},injectCode(e){return e.stage==="vertex"?{header:e.data.glsl.attributes}:{}}},P={f32:"float",i32:"int",u32:"uint","vec2<f32>":"vec2","vec3<f32>":"vec3","vec4<f32>":"vec4","vec2<i32>":"ivec2","vec3<i32>":"ivec3","vec4<i32>":"ivec4","vec2<u32>":"uvec2","vec3<u32>":"uvec3","vec4<u32>":"uvec4"},Y={...P,bool:"bool","mat2x2<f32>":"mat2","mat3x3<f32>":"mat3","mat4x4<f32>":"mat4","mat2x3<f32>":"mat2x3","mat2x4<f32>":"mat2x4","mat3x2<f32>":"mat3x2","mat3x4<f32>":"mat3x4","mat4x2<f32>":"mat4x2","mat4x3<f32>":"mat4x3","texture_2d<f32>":"sampler2D","texture_2d<u32>":"usampler2D","texture_2d<i32>":"isampler2D","texture_2d_array<f32>":"sampler2DArray","texture_3d<f32>":"sampler3D","texture_cube<f32>":"samplerCube",texture_depth_2d:"sampler2DShadow",texture_depth_2d_array:"sampler2DArrayShadow",texture_depth_cube:"samplerCubeShadow",texture_depth_cube_array:"samplerCubeArrayShadow",sampler:"",sampler_comparison:""};function ve(e){const t=e.match(/^array<(.+),\s*(\d+)>$/);return t?{baseType:t[1],size:t[2]}:null}function Se(e){const t=ve(e);if(t){const a=Y[t.baseType]??t.baseType;return a?{glslType:a,arraySize:t.size}:null}const r=Y[e];return r!==void 0?r||null:e}const fr=new Set(["sampler2D","usampler2D","isampler2D","sampler2DArray","sampler3D","samplerCube","sampler2DShadow","sampler2DArrayShadow","samplerCubeShadow","samplerCubeArrayShadow"]);function ye(e){return`u${me(e)}`}function F(e,t){return`${e}_${t}`}function pr(e){const t=ve(e),r=t?t.baseType:e;return/^mat[234]x2</.test(r)?!t&&r==="mat2x2<f32>":!t||r.startsWith("vec4")||r.startsWith("mat")}function hr(e){const t=Y[e];return t!==void 0&&t||e}function V(e,t,r){B(`[collectBindingsGlsl] Binding "${e}" redefined with different type: "${r}" → "${t}". Keeping original.`)}function mr(e,t){const r=ie(t),a=Object.create(null);for(const{name:s}of r)a[s]={uniformGroups:Object.create(null),resources:Object.create(null),uniformBuffers:Object.create(null)};const o=Object.create(null);for(const s of e)if(s.structs)for(const[l,i]of Object.entries(s.structs))l in o||(o[l]=i);for(const s of e)if(s.bindings)for(const[l,i]of Object.entries(s.bindings)){if(!i)continue;const n=me(l),u=l in a;for(const{name:c,spec:p,uniformGroup:f}of le(i,l)){const d=ue(p);if(ce(d))continue;if(de(d)){if(!u)continue;const b=Oe(d);if(!b){B(`[collectBindingsGlsl] Bit "${s.name}" binding "${c}" has invalid uniform buffer type: "${d}". Expected format: uniform<StructName>`);continue}const x=a[l].uniformBuffers;c in x?x[c]!==b&&V(c,b,x[c]):(x[c]=b,o[b]??={});continue}const g=Se(d);if(!g)continue;const m=typeof g=="object",h=m?g.glslType:g,v=m?g.arraySize:void 0;if(fr.has(h)){if(u){const b=a[l].resources;c in b?b[c]!==h&&V(c,h,b[c]):b[c]=h}}else{const b=u?f:l;if(u){const S=a[l].uniformGroups[b]??=Object.create(null);c in S||(S[c]={glslType:h,arraySize:v})}if(b!==l)continue;n in o||(o[n]={});const x=o[n];x[c]&&x[c]!==d?V(c,d,x[c]):x[c]=d}}}return{groups:r,bindGroups:a,structs:o}}function gr(e,t,r){if(!pr(r))throw new Error(`[emitBindingsGlsl] Field "${t}" of uniform block "${e}" is "${r}", which std140 lays out differently from WGSL. A buffer-backed block takes scalars, vectors, mat2x2<f32>, matrices of vec3 or vec4 columns, and arrays of 16-byte elements.`);if(r==="mat2x2<f32>")return[`  vec2 ${F(t,0)};`,`  vec2 ${F(t,1)};`];const a=Se(r);return[`  ${E(t,typeof a=="object"?a:{glslType:a})};`]}function E(e,t){return t.arraySize?`${t.glslType} ${e}[${t.arraySize}]`:`${t.glslType} ${e}`}function xr(e,t){const{groups:r,bindGroups:a}=e;for(const s in a){const{uniformBuffers:l}=a[s];for(const i in l){const n=l[i];if(Object.keys(t[n]??{}).length===0)throw new Error(`[emitBindingsGlsl] Binding "${i}" is "uniform<${n}>", but no bit declares fields for a "${n}" struct.`)}}const o=[];for(const s in t){const l=s.charAt(0).toLowerCase()+s.slice(1);if(a[l]?.uniformGroups[l])continue;const i=t[s];o.push(`struct ${s} {`);for(const[n,u]of Object.entries(i))o.push(`  ${hr(u)} ${n};`);o.push("};")}for(const{name:s,ubo:l}of r){const i=a[s],n=i.uniformGroups[s];if(n&&l){o.push(`layout(std140) uniform ${s} {`);for(const u in n)o.push(`  ${E(u,n[u])};`);o.push("};")}else if(n)for(const u in n)o.push(`uniform ${E(u,n[u])};`);for(const u in i.resources)o.push(`uniform ${i.resources[u]} ${u};`);for(const u in i.uniformBuffers){const c=t[i.uniformBuffers[u]];o.push(`layout(std140) uniform ${u} {`);for(const p in c)o.push(...gr(u,p,c[p]));o.push(`} ${ye(u)};`)}for(const u in i.uniformGroups){if(u===s)continue;const c=i.uniformGroups[u];for(const p in c)o.push(`uniform ${E(p,c[p])};`)}}return o.join(`
`)}const br={collectData(e){const t=e.data.glsl??={};t.bindingGroups===void 0&&(t.bindingGroups=mr(e.bits,e.template),e.data.structs=t.bindingGroups.structs)},injectCode(e){const t=e.data.glsl;return t.bindings??=xr(t.bindingGroups,e.data.structs),{header:t.bindings}}},vr="{{writeOutputs}}";function we(e){return`frag${e[0].toUpperCase()}${e.slice(1)}`}function Sr(e,t){const r=["struct Outputs {"];for(const a in e)r.push(`  ${P[e[a]]} ${a};`);r.push("};","");for(let a=0;a<t.length;a++)e[t[a]]&&r.push(`layout(location = ${a}) out ${P[e[t[a]]]} ${we(t[a])};`);return r.join(`
`)}const yr={collectData(e){e.templateString.includes(vr)&&(e.data.outputs=Re(e.bits))},injectCode(e){const t=e.data.outputs;if(!t)return{};const r=e.outputLocations,a=[],o=[];for(const s in t)a.push(`${P[t[s]]}(0)`);for(let s=0;s<r.length;s++)t[r[s]]&&o.push(`${we(r[s])} = outputs.${r[s]};`);return{header:Sr(t,r),declareOutputs:`Outputs outputs = Outputs(${a.join(", ")});`,writeOutputs:o.join(`
`)}}},wr={collectData(e){e.data.groupMap||(e.data.groupMap=er(e.bits,e.template))}},_r={collectData(e){e.data.headers||(e.data.headers=e.bits.map(t=>t.gl?.header).filter(t=>!!(t&&/\S/.test(t))))},injectCode(e){return{header:e.data.headers.join(`
`)}}},Tr=new Set(["position","frontFacing","sampleIndex","sampleMask"]);function te(e){return e==="i32"||e==="u32"||e.includes("<i32>")||e.includes("<u32>")}function re(e){const t=P[e];return t||(B(`[compileInterStageGlsl] Unknown inter-stage type: "${e}"`),"vec4")}function Br(e,t,r){B(`[compileInterStageGlsl] Inter-stage variable "${e}" redefined with different type: "${r}" → "${t}". Keeping original.`)}function Dr(e,t={}){const{useLocations:r=!0}=t,a=new Map;for(const i of e)if(i.interStage)for(const[n,u]of Object.entries(i.interStage))Tr.has(n)||(a.has(n)?a.get(n)!==u&&Br(n,u,a.get(n)):a.set(n,u));const o=[];let s=0;for(const[i,n]of a){const u=re(n),c=te(n)?"flat ":"";r?o.push(`layout(location = ${s++}) ${c}out ${u} ${i};`):o.push(`${c}out ${u} ${i};`)}const l=[];s=0;for(const[i,n]of a){const u=re(n),c=te(n)?"flat ":"";r?l.push(`layout(location = ${s++}) ${c}in ${u} ${i};`):l.push(`${c}in ${u} ${i};`)}return{vertex:o.join(`
`),fragment:l.join(`
`)}}const Gr={collectData(e){const t=e.data.glsl??={};t.interStage??=Dr(e.bits,{useLocations:e.glslOptions?.useLocations})},injectCode(e){const t=e.data.glsl.interStage;return{header:e.stage==="vertex"?t.vertex:t.fragment}}},Mr={collectData(e){e.data.overrides=nt(e.bits)},injectCode(e){const t=e.glslOptions?.overrides??{};return{header:st(e.data.overrides,t)}}},O="#version 300 es",$r=`precision highp float;
precision highp int;
precision highp sampler2D;
precision highp usampler2D;
precision highp isampler2D;
precision highp sampler3D;
precision highp samplerCube;
precision highp sampler2DArray;
precision highp sampler2DShadow;
precision highp samplerCubeShadow;
precision highp sampler2DArrayShadow;`,Ir={preCompile(e){const{templateString:t}=e;if(!t.includes(O)){B(`[compileShader] ${e.stage==="vertex"?"Vertex":"Fragment"} template has no '${O}' line - highp precision will not be declared.`);return}e.templateString=t.replace(O,`${O}
${$r}`)}},Cr=/\{\{(.*?)\}\}/g;function Pr(e){const t=new Set;for(const r of Object.values(e))for(const a of r)if(a)for(const o of a.matchAll(Cr))t.add(o[1]);return t}function Lr(e,t,r){const a=lt(e),o=Pr(t);for(const[s,l]of Object.entries(t))l.some(i=>i&&/\S/.test(i))&&!a.has(s)&&!o.has(s)&&B(`[compileShader] ${r==="vertex"?"Vertex":"Fragment"} generated code for slot {{${s}}} but template doesn't have it.`)}const Or={injectCode(e){if(!e.stage)return{};const t=it(e.bits,"gl",e.stage),r={};for(const[o,s]of Object.entries(t))r[o]=s.join(`
`);const a={};for(const[o,s]of Object.entries(r))a[o]=[s];return Lr(e.templateString,a,e.stage),r}};function Rr(e,t){if(e.type==="mat2x2<f32>")return`mat2(uintBitsToFloat(${t}.xy), uintBitsToFloat(${t}.zw))`;const r=`${t}${e.swizzle}`;return e.scalar==="u32"?r:e.scalar==="i32"?`${e.type==="vec4<i32>"?"ivec4":"int"}(${r})`:`uintBitsToFloat(${r})`}function _e(e){const t=[];t.push(`${e.struct} ${e.name}(uint index) {`),t.push(`  int base = ${e.base};`),t.push(`  ${e.struct} m;`);for(const[r,a]of ut(e.fields,e.read)){t.push(`  uvec4 t${r} = ${e.load(`base + ${r}`)};`);for(const o of a)t.push(`  m.${o.name} = ${Rr(o,`t${r}`)};`)}return t.push("  return m;"),t.push("}"),t.join(`
`)}function Er(e){const{layout:t,loaded:r,varyings:a}=e,o={},s=["Instance instance = getInstance(renderInstance.x);"],l=["Instance instance;"];for(const i of a){const n=t.struct[i],u=dt(i),c=n==="vec4<f32>"?`floatBitsToUint(instance.${i})`:n==="vec4<i32>"?`uvec4(instance.${i})`:`instance.${i}`,p=n==="vec4<f32>"?`uintBitsToFloat(${u})`:n==="vec4<i32>"?`ivec4(${u})`:u;o[u]="vec4<u32>",s.push(`${u} = ${c};`),l.push(`instance.${i} = ${p};`)}return{name:`instanceAccess:${t.key}`,interStage:o,bindings:{global:{uInstanceStoreTexture:"texture_2d<u32>"}},gl:{vertex:{header:_e({name:"getInstance",struct:"Instance",fields:t.struct,read:r,base:`int(index) * ${t.stride/4}`,load:i=>`texelFetch(uInstanceStoreTexture, ${$(i)}, 0)`}),storeAccess:s.join(`
  `)},fragment:a.length?{storeAccess:l.join(`
  `)}:void 0}}}const Ar={collectData(e){if(!xe(e.bits))return;const t=ct(e.bits,"gl",e.instanceLayout,e.template);e.bits=[...e.bits,Er(t)]}};function ae(e,t,r){t&&/\S/.test(t)&&!e.includes("{{header}}")&&B(`[compileShader] ${r==="vertex"?"Vertex":"Fragment"} template missing {{header}} slot - bindings, attributes, and inter-stage variables will not be injected.`)}function W(e){const{bits:t,template:r,extraPlugins:a,instanceLayout:o,outputLocations:s=Ee,...l}=e,i=ft(t),n=[Ar,Ir,wr,Mr,br,Gr,yr,dr,_r,Or],u=a?[...a,...n]:n,c={bits:i,template:r,templateString:r.gl.vertex,data:{},stage:"vertex",glslOptions:l,instanceLayout:o,outputLocations:s},p=Z(c,u);ae(r.gl.vertex,c.data.headers.join(""),"vertex");const f={bits:i,template:r,templateString:r.gl.fragment,data:c.data,stage:"fragment",glslOptions:l,instanceLayout:o,outputLocations:s},d=Z(f,u);return ae(r.gl.fragment,f.data.headers.join(""),"fragment"),{vertex:p,fragment:d,structs:f.data.structs??{},groupMap:f.data.groupMap,bits:f.bits}}function Fr(e){return _e({name:"getMaterial",struct:"Material",fields:e,base:"int(index)",load:t=>`texelFetch(uMaterialStorage, ${$(t)}, 0)`})}const jr={injectCode(e){const t=e.data.structs?.Material;return t?{textureGetters:Fr(t),storeAccess:"Material material = getMaterial(vMaterialIndex);"}:{}}},H=ye("material");function kr(e){const t=["Material getMaterial() {","  Material m;"];for(const r in e){const a=e[r]==="mat2x2<f32>"?`mat2(${H}.${F(r,0)}, ${H}.${F(r,1)})`:`${H}.${r}`;t.push(`  m.${r} = ${a};`)}return t.push("  return m;","}"),t.join(`
`)}const ha={injectCode(e){const t=e.data.structs?.Material;return t?{textureGetters:kr(t),storeAccess:"Material material = getMaterial();"}:{}}},oe={atlas:null,indexCount:void 0,firstIndex:void 0},Nr=new Float32Array(24);var Ur=class{batchTransform=new Vt({uBatchWorldMatrix:{value:new Ae,type:"mat4x4<f32>"}},{isStatic:!0,ubo:!1});build(e){const{renderables:t,list:r,globalBindGroup:a,passBit:o,bindsMaterial:s}=e,l=t.count,i=r.commandList;if(l===0)return 0;i.clear(),this._ensureCapacity(r,l);const n=t.indices,u=t.items,c=r.glData,p=c.indexStaging;let f=u[n[0]],d=f._passCache[o],g=d.shader,m=d.batchKey,h=f.geometry,v=J(m,d.state),b=d.topology,x=f.material,S=h._geometryAtlasAllocation||oe,D=S.atlas?S.atlas.geometry:h,G=S.firstIndex,T=S.indexCount,w=0,_=x;s&&i.captureMaterialTextures(x),p[0]=f._storeIndex;for(let y=1;y<l;y++){f=u[n[y]],d=f._passCache[o],p[y]=f._storeIndex;const M=f.material,j=d.batchKey!==m;if(!j&&(!s||M===x))continue;if(!j&&x._textureSetId===M._textureSetId){x=M;continue}this._recordCommand(i,r.drawData,a,s?_._getMergedBindGroup():void 0,g,v,D,G,T,w,y-w,b,m,s?_._textureSetId:0,s),w=y;const Ge=M!==x;x=M,j&&(m=d.batchKey,h=f.geometry,g=d.shader,v=J(m,d.state),b=d.topology,S=h._geometryAtlasAllocation||oe,D=S.atlas?S.atlas.geometry:h,G=S.firstIndex,T=S.indexCount),_=M,s&&Ge&&i.captureMaterialTextures(M)}return this._recordCommand(i,r.drawData,a,s?_._getMergedBindGroup():void 0,g,v,D,G,T,w,l-w,b,m,s?_._textureSetId:0,s),i.endBuild(),c.lastVisibilityDirtyId=-1,l}draw(e,t,r,a,o){const s=t.glData.indexTexture;if(!s)return;const l=a!==null&&r.cull!=="off";(l||t.glData.lastVisibilityDirtyId!==r._visibilityDirtyId)&&this._compact(t,r,l?a:null,s),this.batchTransform.uniforms.uBatchWorldMatrix=r.renderData.worldTransform,this.batchTransform.update();const i=e.gl,n=e.shader,u=e.geometry,c=e.state,p=t.commandList,f=p.count,d=t.drawData.drawCalls;for(let g=0;g<f;g++){const m=g*5;if(d[m+1]===0||d[m]===0)continue;const h=p.commands[g];h.shader.groups[0]=h.globalBindGroup,h.shader.groups[1]=o.bindGroup,h.batchBindGroup&&(h.shader.groups[2]=h.batchBindGroup),n.bind(h.shader),u.bind(h.geometry,n._activeProgram),h.state&&c.set(h.state);const v=n._getProgramData(n._activeProgram).uniformData.uInstanceBase?.location;v!==void 0&&i.uniform1i(v,d[m+4]),u.draw(h.topology,d[m],d[m+2],d[m+1])}}_compact(e,t,r,a){const o=e.glData,s=e.commandList.count,l=e.drawData.drawCalls,i=e.view.count,n=t.storeBuffer.visible;r!==null&&t._ensureSpheres();const u=t.storeBuffer.boundingSpheres,c=o.indexStaging,p=a.data,f=r!==null?pt(r.planesData,t.storeBuffer.data):null,d=f??Nr;let g=i,m=0;for(let h=0;h<s;h++){const v=l[h*5+4],b=h+1<s?l[(h+1)*5+4]:i;let x=v;for(let S=v;S<b;S++){const D=c[S];if(n[D]!==0){if(f!==null){const G=D*4,T=u[G+3];if(T>=0){const w=u[G],_=u[G+1],y=u[G+2];if(d[0]*w+d[1]*_+d[2]*y+d[3]<-T||d[4]*w+d[5]*_+d[6]*y+d[7]<-T||d[8]*w+d[9]*_+d[10]*y+d[11]<-T||d[12]*w+d[13]*_+d[14]*y+d[15]<-T||d[16]*w+d[17]*_+d[18]*y+d[19]<-T||d[20]*w+d[21]*_+d[22]*y+d[23]<-T)continue}}p[x]!==D&&(p[x]=D,x<g&&(g=x),m=x+1),x++}}l[h*5+1]=x-v}a.upload(g,m),e.glData.lastVisibilityDirtyId=t._visibilityDirtyId}_ensureCapacity(e,t){const r=e.glData,a=r.indexTexture??=new Zt(Math.max(256,t));a.ensureCapacity(t),(!r.indexStaging||r.indexStaging.length<a.data.length)&&(r.indexStaging=new Uint32Array(a.data.length))}_recordCommand(e,t,r,a,o,s,l,i,n,u,c,p,f,d,g){const m=e.next();m.geometry=l,m.shader=o,m.globalBindGroup=r,m.batchBindGroup=a,m.state=s,m.topology=p,m.batchKey=f,m.textureSetId=d,m.merged=g,e.captureGeometry(l);const h=(e.count-1)*5,v=t.ensureCapacity(e.count);v[h]=n??(l.indexCount||l.indexBuffer.data.length),v[h+1]=c,v[h+2]=i??0,v[h+3]=0,v[h+4]=u}};const Te=256,Be=8,De=32,zr=256*De*Be*Te,Vr={"point-list":0,"line-list":1,"line-strip":2,"triangle-list":3,"triangle-strip":4},se=new Map;let Wr=0;function Hr(e){let t=se.get(e);return t===void 0&&(t=Wr++,se.set(e,t)),t}function Kr(e,t,r){const a=((t.data*De+t._blendModeId)*Be+Vr[r])*Te+Hr(t.polygonOffset);return e*zr+a}function Yr(e,t,r){const a=[`vec4 ${e}Direct(vec2 uv) {`,`  return textureLod(uMaterialTexture${t}, uv, 0.0);`,"}"];return r&&a.push(`vec4 ${e}(vec2 uv) {`,`  return texture(uMaterialTexture${t}, uv);`,"}"),a}function qr(e){return{collectData(t){t.bits.some(r=>r.name.startsWith("materialBindings:"))||t.bits.unshift(ht(t.bits,e))},injectCode(t){let r=0;const a=[],o=t.stage==="fragment";for(const s of t.bits)if(s.textures)for(const l of s.textures){const i=`sample${l[0].toUpperCase()}${l.slice(1)}`;a.push(...Yr(i,r,o)),r++}return{textureGetters:a.join(`
`)}}}}const Jr=new Ke({}),Xr={merged:[gt,jr,qr("merged")]},Qr=`#version 300 es

{{header}}
{{textureGetters}}

void main() {
  mat4 modelMatrix;

  vec4 position;
  vec3 normal = vec3(0.0, 0.0, 1.0);
  vec3 tangent = vec3(0.0);
  vec2 uv = vec2(0.0);

  {{input}}

  {{storeAccess}}

  {{beforeTransform}}

  vec4 worldPosition = modelMatrix * position;
  mat3 modelMatrix3 = mat3(modelMatrix);

  vec3 normalScale = 1.0 / vec3(
    dot(modelMatrix3[0], modelMatrix3[0]),
    dot(modelMatrix3[1], modelMatrix3[1]),
    dot(modelMatrix3[2], modelMatrix3[2])
  );
  vec3 worldNormal = modelMatrix3 * (normal * normalScale);
  gl_Position = uViewProjectionMatrix * worldPosition;

  {{afterTransform}}

  {{end}}

  vPosition = worldPosition.xyz;
  vNormal   = worldNormal;
  vUV       = uv;
}`,Zr=`#version 300 es

{{header}}

{{textureGetters}}

void main() {
  {{declareOutputs}}
  vec3 normal = normalize(vNormal);
  vec3 albedo = vec3(1.0);
  vec3 finalColor;
  float alpha = 1.0;

  {{storeAccess}}

  {{material}}

  finalColor = albedo;

  {{lighting}}

  finalColor *= inputExposure(uExposure, uDisplayExposure);

  {{end}}

  outputs.color = vec4(finalColor * alpha, alpha);

  {{writeOutputs}}
}`,ea={name:"layout",overrideDefs:{HAS_UVS:{type:"u32",required:!0}},outputs:{color:"vec4<f32>"},interStage:{vNormal:"vec3<f32>",vUV:"vec2<f32>",vPosition:"vec3<f32>",vMaterialIndex:"u32"}},ta={bindGroups:[{name:"global",ubo:!0},"camera","batch"],gl:{vertex:Qr,fragment:Zr}};var ra=class{static extension={type:[q.WebGLSystem],name:"material3d"};batcher=new Ur;_destroyed=!1;_renderer;_shaderCache=new Map;constructor(e){this._renderer=e}computeBatchKey(e,t){const r=e._passCache[t];return Kr(r.shader.uid,r.state,r.topology)}compilePassShader(e,t){const r=W({bits:[L,k,...e],template:t,useLocations:!1});return X(r.bits,t),N.from({gl:r,groups:{},groupMap:r.groupMap})}compileIsolatedShader(e,t,r){const a=W({bits:e,template:t,useLocations:!1});return N.from({gl:a,groups:r,groupMap:a.groupMap})}compileShader(e,t,r,a,o=!1,s={useLocations:!1},l="direct"){const i=[];let n="";(e.includeGlobal??!0)&&(i.push(L),n+=`${L.name}|`),(e.includeCamera??!0)&&(i.push(k),n+=`${k.name}|`),i.push(...e.bitsGl),n+=e.keyGl;const u=mt(t.geometry.attributes.aPosition.format);Q(u),i.push(u),n+=`|${u.name}`,t._morph&&(t.geometry.hasMorphNormals?(i.push(or),n+="|morphN"):(i.push(ar),n+="|morph")),t.skeleton&&(Q(z),i.push(z),n+=`|${z.name}`),r.instanceStoreBuffer&&xe(i)&&(n+=`|inst:${r.instanceStoreBuffer.layout.key}`),n+=`|${l}`;let c=this._shaderCache.get(n);if(!c){const p=W({bits:i,template:e.template,extraPlugins:a,instanceLayout:r.instanceStoreBuffer?.layout,...s,overrides:e.overrides,outputLocations:e.outputLocations});X(p.bits,e.template),c={shader:N.from({gl:p,groups:{},overrides:e.overrides,groupMap:p.groupMap}),layout:Fe(p.bits)},this._shaderCache.set(n,c)}return o&&(je(c.layout,t.material),ke(c.layout,t.material)),c.shader}ensureMaterial(e,t,r){const a=e.material;this._renderer.renderPipes.view3d.materialStoreBuffer.register(a);const o=this.compileShader(this._materialDescriptor(e,r),e,t,Xr.merged,!0,{useLocations:!1},"merged"),s=a._passBit&A.MATERIAL_PASS_MASK,l=a._passes[s],i=l&&l.state||a.state,n=l&&l.topology||a.topology||e.geometry.topology,u=e._passCache[s];return u?(u.shader=o,u.state=i,u.topology=n,u.lastGeometryUid=-1):e._passCache[s]=new Ne(o,i,n),o}_materialDescriptor(e,t){const r=e.geometry,a=e.material,o=a.fog?t._fogBit:null,s=t._toneMappingBit,l=!!r.attributes.aColor&&a.vertexColors,i=xt(a,s,!!o||l),n=a.getPrimaryDescriptor(t),u=[L,ea,qt,i];r.attributes.aNormal&&u.push(Mt),r.attributes.aUV&&u.push(bt(r.attributes.aUV.format)),a.doubleSided&&u.push(vt),a.flatShading&&u.push(St);const c=a.textures.normal;c&&c!==Ue&&r.attributes.aUV&&u.push(r.attributes.aTangent?yt:wt),l&&u.push(_t);const p=e.material.lit;e.billboardMode!=="none"&&u.push(Tt(e.billboardMode,p));const f=!!r.attributes.aTangent;for(let m=0;m<n.bitsGl.length;m++){const h=n.bitsGl[m];u.push(f?ze(h):h)}a.alphaMode==="opaque"&&u.push(Bt),o&&u.push(o),i!==Dt&&s&&u.push(a._skipsToneCurve?Ve:s),p&&u.push(e.receiveShadow&&t._hasShadows?nr[t.shadowFilter]:Gt,We(s!==null));const d=t.passByBit[a._passBit&A.MATERIAL_PASS_MASK],g=He(u,d,!!n.template);return Jr.update({bitsGl:u,template:n.template??ta,overrides:{HAS_UVS:r.attributes.aUV?1:0,...n.overrides},outputLocations:g,includeGlobal:!1})}destroy(){if(!this._destroyed){this._destroyed=!0;for(const{shader:e}of this._shaderCache.values())e.destroy();this._shaderCache=null}}};function aa(e){const{pipe:t,bit:r,bindsMaterial:a,session:o,alwaysRebuild:s,sortBatch:l}=e,{view3d:i}=o,n=t.renderer.material3d.batcher,u=e.camera??i.camera,c=Ye(u),p=u.cullFrustum;c.setViewport(o.activeViewport);for(const f of i._meshBatches){if(!f.renderData._worldVisible)continue;const d=f.drawLists[r];if(!d)continue;const g=d.view;if(g.count===0)continue;let m;l?(l(g,f,c.position),m=d.isDrawStale()||d.isOrderStale()):m=d.nextBuild(i._updateTick,s),m&&(d.claimDrawBuilt(),n.build({renderables:g,list:d,globalBindGroup:o.globalBindGroup,passBit:r,bindsMaterial:a})),o.globalBindGroup.setResource(f.storeBuffer.texture.source,"uMeshStoreTexture"),d.glData.indexTexture&&o.globalBindGroup.setResource(d.glData.indexTexture.texture.source,"uRenderInstanceTexture"),o.globalBindGroup.setResource(f.instanceStoreBuffer?.texture.source??I.source,"uInstanceStoreTexture"),n.draw(t.renderer,d,f,p,c)}}const oa={name:"shadowGlobalGl",bindings:{global:{uBonePitTexture:"texture_2d<f32>",uMorphTexture:"texture_2d<f32>",uGeometryTexture:"texture_2d<u32>"}}},sa={bindGroups:[{name:"global",ubo:!0},"camera"],gl:{vertex:`#version 300 es

{{header}}

void main() {
  mat4 modelMatrix;

  vec4 position;
  vec3 normal = vec3(0.0);
  vec3 tangent = vec3(0.0);

  {{input}}

  vec4 worldPosition = modelMatrix * position;
  gl_Position = uViewProjectionMatrix * worldPosition;

  {{end}}
}`,fragment:`#version 300 es
out vec4 fragColor;

{{header}}

void main() {
    fragColor = vec4(0.);
}`}};var na=class extends $t{constructor(e){const t=qe();t.depthTest=!0,t.culling=!0,t.clockwiseFrontFace=!0,t.blend=!1,super({renderer:e.renderer,name:"shadow",description:"Renders shadow-casting scene geometry into each light shadow map.",bit:A.SHADOW,shadowMapHandle:e.shadowMapHandle,descriptor:{shaderDescriptor:{bitsGl:[oa,Jt],template:sa,includeGlobal:!1},state:t}})}_applyZRangeFix=!1;render(e){const{view3d:t,lights:r}=e;if(!r.find(l=>l.canCastShadow))return;this._bindShadowSource(t,this.renderTarget.depthStencilTexture),this.pipe.renderer.colorMask.setMask(0);const a=this.pipe.renderer.material3d.batcher,o=e.globalBindGroup,s=r.some(l=>l.castShadow&&l._gpuShadowData&&l._shadowDataIndex>=0);for(const l of t._meshBatches){if(!l.renderData._worldVisible)continue;const i=l.drawLists[this.bit];if(!i)continue;const n=i.view;n.count===0||!s||i.nextBuild(t._updateTick)&&(i.claimDrawBuilt(),a.build({renderables:n,list:i,globalBindGroup:o,passBit:this.bit,bindsMaterial:!1}))}for(const l of r){if(!Je(l))continue;const i=Xe(l);for(let n=0;n<i;n++){const u=this._cascadeSlot(l,n);if(!u.needsRender)continue;const c=u.cameraData.frustum;this.pipe.renderer.renderTarget.bind({target:this.renderTarget,clear:!0,layer:l._shadowDataIndex+n});for(const p of t._meshBatches){if(!p.renderData._worldVisible)continue;const f=p.drawLists[this.bit];!f||f.view.count===0||(o.setResource(p.storeBuffer.texture.source,"uMeshStoreTexture"),f.glData.indexTexture&&o.setResource(f.glData.indexTexture.texture.source,"uRenderInstanceTexture"),a.draw(this.pipe.renderer,f,p,c,u.cameraData))}}this._completeShadowUpdate(l)}this.pipe.renderer.colorMask.setMask(15),e.activeTarget=null}};const ia=13421772,ne=new Kt;var la=class{static extension={type:[q.WebGLPipes],name:"view3d"};renderer;_brdfLutTexture;_destroyed=!1;_colorOutputDraw=null;_iblEnvironmentMap=new Map;_onEnvironmentDestroy=e=>{this._iblEnvironmentMap.get(e)?.source.unload(),this._iblEnvironmentMap.delete(e)};_viewport=new Wt;_sortForwardByDistance=(e,t,r)=>{t.isUserBatch?It(e,r,t.storeBuffer.data,t.renderData.worldTransform):Ct(e,r)};_forwardOptions={pipe:this,bit:0,bindsMaterial:!1,camera:null,session:null,alwaysRebuild:!0,sortBatch:void 0};materialStoreBuffer;_morphStoreBuffer=new Pt;geometryDataStoreBuffer=new Lt;atlasPool=Ot.from({rebaseIndices:!0});_managedViews;constructor(e){this.renderer=e,this._managedViews=new Rt(e),e.runners.contextChange.add(this)}contextChange(){this.materialStoreBuffer??=new Et({alignment:this.renderer.limits.minUniformBufferOffsetAlignment,rendererType:this.renderer.type})}createShadowPass(e){return new na({renderer:this.renderer,shadowMapHandle:e.shadowMapHandle})}prepareForward(e,t){}renderForward(e,t){const r=this._forwardOptions;r.bit=e.bit,r.bindsMaterial=e.bindsMaterial,r.camera=e.camera,r.session=t,r.alwaysRebuild=!At(e),r.sortBatch=e.sort==="distance"?this._sortForwardByDistance:void 0,aa(r),r.camera=null,r.session=null}renderGeometry(e,t,r){this.renderer.encoder.draw({geometry:e,shader:t,state:r})}setViewport(e){this.renderer.gl.viewport(e.x,e.y,e.width,e.height)}_depthClearState=null;clearDepth(e){if(!this._depthClearState){const a=new Ht;a.depthMask=!0,a.depthTest=!1,a.culling=!1,a.blend=!1,this._depthClearState=a}const t=this.renderer.gl,r=e.activeViewport;this.renderer.state.set(this._depthClearState),t.enable(t.SCISSOR_TEST),t.scissor(r.x,r.y,r.width,r.height),this.renderer.renderTarget.clear(this.renderer.renderTarget.renderTarget,ee.DEPTH),t.disable(t.SCISSOR_TEST)}copyColor(e,t,r){const{target:a,viewport:o}=e;if(!a.colorTexture)return;const s=t.frame,l=t.source.resolution;this.renderer.renderTarget.copyToTexture(a,t,{x:o.x,y:o.y},{width:o.width,height:o.height},{x:Math.round(s.x*l),y:Math.round(s.y*l)}),r.activeTarget=null}outputColor(e,t,r,a){const{target:o}=e;if(!o.colorTexture)return;const s=this.renderer.renderTarget;(this._colorOutputDraw??=new Ft(this.renderer)).draw(this,e,t,a),s.finishRenderPass(),r.activeTarget=null}generateMips(e,t){const r=t.view3d._graph.getTexture(e,t).source;this.renderer.renderTarget.bind({target:t.defaultTarget,clear:ee.NONE}),t.activeTarget=null,r.updateMipmaps()}resolveColor(){this.renderer.renderTarget.finishRenderPass()}copyDepth(e,t,r){const{target:a,viewport:o}=e;a.depthStencilTexture&&(this.renderer.renderTarget.copyDepthTexture(a,t,{x:o.x,y:o.y},{width:o.width,height:o.height},{x:0,y:0}),r.activeTarget=null)}validateRenderable(){return!1}addRenderable(e,t){this.renderer.renderPipes.batch.break(t),t.add(e)}updateRenderable(){}execute(e){if(!e.isRenderable)return;const t=K(e,this.renderer),r=this.renderer.renderTarget.renderTarget;e._ensureInitialized(this.renderer,t,r.colorTexture.source.resolution),this._managedViews.track(e);const a=e.environment;a&&(this._brdfLutTexture||=jt({renderer:this.renderer}),t.globalBindGroup.setResource(this._brdfLutTexture.source,"uBrdfLutTexture"));const o=this._prefilteredEnvironment(a);t.globalBindGroup.setResource(o,"uEnvironmentTexture"),t.globalUniformGroup.uniforms.uEnvironmentMaxMipLevel=o.mipLevelCount-1;const s=e.lights;if(e._meshSlots.count===0&&e._meshBatches.length===1)return;const l={view3d:e,lights:s,defaultTarget:r,defaultFrontFaceInverted:!1,activeTarget:null,needsDepthClear:!0,viewport:this._viewport,activeViewport:this._viewport,globalBindGroup:t.globalBindGroup,globalUniformGroup:t.globalUniformGroup,renderer:this.renderer};kt(e,this,l)&&(t.globalBindGroup.setResource(e._bonePit.texture.source,"uBonePitTexture"),t.globalBindGroup.setResource(this._morphStoreBuffer.texture.source,"uMorphTexture"),t.globalBindGroup.setResource(this.geometryDataStoreBuffer.texture.source,"uGeometryTexture"),this.atlasPool.update(),this.materialStoreBuffer.update(),this.geometryDataStoreBuffer.update(),Nt(this.atlasPool,this.materialStoreBuffer,t,this._morphStoreBuffer)&&e._invalidateDrawCaches(),t.globalBindGroup.setResource(this.materialStoreBuffer.texture.source,"uMaterialStorage"),this.prepareView(l),e._graph.run(l))}destroy(){if(!this._destroyed){this._destroyed=!0,this._managedViews.destroy(),this._colorOutputDraw?.destroy(),this._colorOutputDraw=null,this._brdfLutTexture?.destroy(!0),this._brdfLutTexture=void 0;for(const[e,t]of this._iblEnvironmentMap)e.off("destroy",this._onEnvironmentDestroy),t.destroy(!0);this._iblEnvironmentMap=null,this.renderer.runners.contextChange.remove(this),this.materialStoreBuffer.destroy(),this.materialStoreBuffer=null,this._morphStoreBuffer.destroy(),this.geometryDataStoreBuffer.destroy(),this._depthClearState=null}}_prefilteredEnvironment(e){if(!(e instanceof he)||e.source.destroyed)return fe.source;let t=this._iblEnvironmentMap.get(e.source);return t||(t=Qe({renderer:this.renderer,sourceTexture:e}),this._iblEnvironmentMap.set(e.source,t),e.source.once("destroy",this._onEnvironmentDestroy)),t.source}prepareView(e){const{view3d:t,lights:r}=e;this.renderer.lighting3d.update(t,r),this._updateGlobalUniforms(t)}_updateGlobalUniforms(e){const{fog:t}=e,r=K(e,this.renderer),a=r.globalUniformGroup.uniforms;if(a.uTime=performance.now()/1e3,a.uExposure=e.exposure,a.uDisplayExposure=Math.pow(e.exposure,1/2.2),t){ne.setValue(t.color??ia),Ze(a.uFogColor,0,ne,e.exposure);const o=a.uFogParams;o[0]=t.near||0,o[1]=t.far||99999999,o[2]=t.density||0}r.globalUniformGroup.update()}};Yt.add(rr,ra,la);export{zr as GL_STATE_KEY_RANGE,rr as LightingSystemGl,ra as MaterialSystemGl,Ur as Mesh3DBatcherGl,na as ShadowRenderPassGl,la as View3DPipeGl,Y as WGSL_TO_GLSL_BINDING_TYPE,P as WGSL_TO_GLSL_TYPE,W as compileGlslSource,qr as createTexturesPluginGl,_e as generateGlslStructAccessor,K as getGlobalGlData,L as globalBitGl,dr as glslAttributesPlugin,br as glslBindingsPlugin,yr as glslFragmentOutputsPlugin,wr as glslGroupMapPlugin,_r as glslHeadersPlugin,Gr as glslInterStagePlugin,Mr as glslOverridesPlugin,Ir as glslPrecisionPlugin,Or as glslStageSlotsPlugin,Ar as instanceAccessPluginGl,F as mat2ColumnMember,jr as materialTextureAccessPluginGl,ha as materialUniformAccessPluginGl,ar as morphTargetBitGl,or as morphTargetNormalBitGl,Kr as packGlBatchKey,aa as renderForwardBatchesGl,nr as shadowBitsGl,oa as shadowGlobalBitGl,z as skinningBitGl,ye as uniformBlockInstanceName};
