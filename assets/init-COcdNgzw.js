import{C as e,D as t,H as n,T as r,X as i,Y as a,a as o,c as s,d as c,f as l,i as u,j as d,o as f,p,w as m}from"./CanvasPool-DtqSaXnh.js";import"./dist-BWyuAgmK.js";import{r as h}from"./Filter-tmaoo_H6.js";import{G as g,K as _}from"./dist-BacaWkv9.js";import{n as v}from"./getTexelRangeRects-7j664Y_P.js";import{$t as y,At as b,Ct as x,Dt as ee,F as S,G as C,H as w,J as T,Jt as E,Lt as D,M as O,Mt as k,Nt as A,O as j,Ot as te,Pt as ne,Q as re,St as M,T as ie,U as ae,X as N,Xt as oe,Y as se,Yt as ce,Z as le,Zt as ue,_t as de,dt as fe,en as pe,ft as me,gt as he,ht as ge,j as _e,jt as ve,kt as ye,mt as P,pt as be,q as xe,st as Se,ut as Ce,vt as we,x as Te,zt as Ee}from"./Container3D-6nYjydl4.js";import{A as De,B as Oe,C as ke,D as Ae,E as je,F as Me,G as Ne,H as Pe,I as Fe,J as F,K as Ie,L as Le,M as I,N as L,O as R,P as Re,Q as ze,R as Be,S as Ve,T as He,V as Ue,W as We,X as Ge,Z as Ke,_ as qe,b as Je,c as Ye,d as Xe,et as Ze,f as Qe,g as $e,h as et,j as z,k as tt,l as nt,m as rt,n as it,o as at,p as ot,q as B,r as st,s as ct,t as lt,tt as ut,u as dt,v as ft,w as pt,x as mt,y as ht,z as gt}from"./updateView3DScene-BIfgm9px.js";var _t=`
struct DrawArgs {
  indexCount: u32,
  instanceCount: atomic<u32>,
  firstIndex: u32,
  baseVertex: u32,
  firstInstance: u32,
};
`,vt=`
${_t}
@group(0) @binding(0) var<storage, read_write> drawCalls: array<DrawArgs>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let k = gid.x;
  if (k >= arrayLength(&drawCalls)) { return; }
  atomicStore(&drawCalls[k].instanceCount, 0u);
}
`,yt=`
${_t}
struct Frustum { planes: array<vec4<f32>, 6> };

@group(0) @binding(0) var<storage, read>       srcInstances: array<u32>;
@group(0) @binding(1) var<storage, read_write> dstInstances: array<u32>;
@group(0) @binding(2) var<storage, read_write> drawCalls:    array<DrawArgs>;
@group(0) @binding(3) var<storage, read>       store:        array<u32>;
@group(0) @binding(4) var<storage, read>       geomBounds:   array<vec4<f32>>;
@group(0) @binding(5) var<uniform>             frustum:      Frustum;

const STRIDE: u32 = 24u;
const GEOM_LANE: u32 = 18u;
const VIS_LANE: u32 = 19u;
const NO_BOUNDS: u32 = 0xffffffffu;

fn loadMatrix(base: u32) -> mat4x4<f32> {
  return mat4x4<f32>(
    bitcast<f32>(store[base + 0u]),  bitcast<f32>(store[base + 1u]),  bitcast<f32>(store[base + 2u]),  bitcast<f32>(store[base + 3u]),
    bitcast<f32>(store[base + 4u]),  bitcast<f32>(store[base + 5u]),  bitcast<f32>(store[base + 6u]),  bitcast<f32>(store[base + 7u]),
    bitcast<f32>(store[base + 8u]),  bitcast<f32>(store[base + 9u]),  bitcast<f32>(store[base + 10u]), bitcast<f32>(store[base + 11u]),
    bitcast<f32>(store[base + 12u]), bitcast<f32>(store[base + 13u]), bitcast<f32>(store[base + 14u]), bitcast<f32>(store[base + 15u]),
  );
}

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  let instanceCount = arrayLength(&srcInstances);
  if (i >= instanceCount) { return; }

  let id = srcInstances[i];
  if (store[id * STRIDE + VIS_LANE] == 0u) { return; }

  var lo = 0u;
  var hi = arrayLength(&drawCalls) - 1u;
  while (lo < hi) {
    let mid = (lo + hi + 1u) >> 1u;
    if (drawCalls[mid].firstInstance <= i) { lo = mid; } else { hi = mid - 1u; }
  }

  let boundsSlot = store[id * STRIDE + GEOM_LANE];
  if (boundsSlot != NO_BOUNDS) {
    let sphere = geomBounds[boundsSlot * 2u];
    if (sphere.w >= 0.0) {
      let local = loadMatrix(id * STRIDE);
      let center = local * vec4<f32>(sphere.xyz, 1.0);
      let sx = dot(local[0].xyz, local[0].xyz);
      let sy = dot(local[1].xyz, local[1].xyz);
      let sz = dot(local[2].xyz, local[2].xyz);
      let radius = sphere.w * sqrt(max(sx, max(sy, sz)));
      for (var p = 0u; p < 6u; p = p + 1u) {
        let plane = frustum.planes[p];
        if (dot(plane.xyz, center.xyz) + plane.w < -radius) { return; }
      }
    }
  }

  let slot = atomicAdd(&drawCalls[lo].instanceCount, 1u);
  dstInstances[drawCalls[lo].firstInstance + slot] = id;
}
`,bt=class{static extension={type:[a.WebGPUSystem],name:`compute3d`};_renderer;_zeroPipeline=null;_compactPipeline=null;_zeroBinds=new WeakMap;_compactBinds=new WeakMap;_jobs=[];_jobCount=0;_destroyed=!1;constructor(e){this._renderer=e}renderStart(){this._jobCount=0}dispatch(e,t,n,r,i,a,o,s){if(o===0||s===0)return;let c=this._jobs[this._jobCount];if(!c){let e=new Float32Array(24);c=this._jobs[this._jobCount]={drawCalls:null,src:null,dst:null,store:null,bounds:null,params:new w({data:e,usage:u.UNIFORM|u.COPY_DST,label:`mesh3d_cull_frustum`,shrinkToFit:!1}),paramsF32:e,commandCount:0,instanceCount:0}}c.drawCalls=e,c.src=t,c.dst=n,c.store=r,c.bounds=i,c.paramsF32.set(a),c.params.update(),c.commandCount=o,c.instanceCount=s,this._jobCount++}renderEnd(){let e=this._jobCount;if(this._jobCount=0,e===0)return;let t=this._renderer.gpu.device,n=this._renderer.buffer,r=this._zeroPipeline||this._buildPipeline(t,vt,`_zeroPipeline`),i=this._compactPipeline||this._buildPipeline(t,yt,`_compactPipeline`),a=t.createCommandEncoder(),o=this._jobs,s=a.beginComputePass();s.setPipeline(r);for(let i=0;i<e;i++){let e=o[i],a=n.getGPUBuffer(e.drawCalls);s.setBindGroup(0,this._zeroBindGroup(t,r,a,e.commandCount)),s.dispatchWorkgroups(Math.ceil(e.commandCount/64))}s.end();let c=a.beginComputePass();c.setPipeline(i);for(let r=0;r<e;r++){let e=o[r];c.setBindGroup(0,this._compactBindGroup(t,i,e,n)),c.dispatchWorkgroups(Math.ceil(e.instanceCount/64))}c.end(),t.queue.submit([a.finish()]);for(let t=0;t<e;t++)o[t].drawCalls=null,o[t].src=null,o[t].dst=null,o[t].store=null,o[t].bounds=null}_zeroBindGroup(e,t,n,r){let i=this._zeroBinds.get(n);if(i&&i.commandCount===r)return i.bindGroup;let a=e.createBindGroup({layout:t.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:n,offset:0,size:r*20}}]});return this._zeroBinds.set(n,{bindGroup:a,commandCount:r}),a}_compactBindGroup(e,t,n,r){let i=r.getGPUBuffer(n.src),a=r.getGPUBuffer(n.dst),o=r.getGPUBuffer(n.drawCalls),s=r.getGPUBuffer(n.store),c=r.getGPUBuffer(n.bounds),l=r.getGPUBuffer(n.params),u=this._compactBinds.get(o);if(u&&u.src===i&&u.dst===a&&u.drawCalls===o&&u.store===s&&u.bounds===c&&u.params===l&&u.commandCount===n.commandCount&&u.instanceCount===n.instanceCount)return u.bindGroup;let d=e.createBindGroup({layout:t.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:i,offset:0,size:n.instanceCount*4}},{binding:1,resource:{buffer:a,offset:0,size:n.instanceCount*4}},{binding:2,resource:{buffer:o,offset:0,size:n.commandCount*20}},{binding:3,resource:{buffer:s}},{binding:4,resource:{buffer:c}},{binding:5,resource:{buffer:l}}]});return this._compactBinds.set(o,{bindGroup:d,src:i,dst:a,drawCalls:o,store:s,bounds:c,params:l,commandCount:n.commandCount,instanceCount:n.instanceCount}),d}_buildPipeline(e,t,n){let r=e.createShaderModule({code:t}),i=e.createComputePipeline({layout:`auto`,compute:{module:r,entryPoint:`main`}});return this[n]=i,i}destroy(){if(!this._destroyed){this._destroyed=!0;for(let e of this._jobs)e.params?.destroy();this._jobs=null,this._zeroPipeline=null,this._compactPipeline=null,this._zeroBinds=new WeakMap,this._compactBinds=new WeakMap,this._jobCount=0}}},V=new v({buffer:new w({data:new Int32Array(1),usage:u.STORAGE|u.COPY_DST|u.COPY_SRC,label:`EmptyBufferResource`,shrinkToFit:!1})}),H={name:`global`,structs:{Renderable:ze,RenderableInstance:Ke,BoneMatrix:B,GeometryData:F,Light:Ge},bindings:{global:{uGlobalLightParams:`vec4<f32>`,uTime:`f32`,uFogColor:`vec3<f32>`,uDisplayExposure:`f32`,uFogParams:`vec3<f32>`,uExposure:`f32`,uHemisphereSky:`vec3<f32>`,uHemisphereGround:`vec3<f32>`,uHemisphereUp:`vec3<f32>`,uLightData:`array<vec4<f32>, 128>`,uShadowData:`array<vec4<f32>, 96>`,uSampler:`sampler`,uEnvironmentTexture:`texture_cube<f32>`,uBrdfLutTexture:`texture_2d<f32>`,uBrdfLutSampler:`sampler`,uShadowMap:`texture_depth_2d_array`,uShadowSampler:`sampler_comparison`,uOpaqueDepthTexture:`texture_depth_2d`,uOpaqueColorTexture:`texture_2d<f32>`,uMaterialStorage:`texture_2d<u32>`,uRenderableStorage:{type:`storage<Renderable>`,visibility:`vertex`},uRenderableInstanceStorage:{type:`storage<RenderableInstance>`,visibility:`vertex`},uBonePitStorage:{type:`storage<BoneMatrix>`,visibility:`vertex`},uMorphStorage:{type:`storage<f32>`,visibility:`vertex`},uGeometryStorage:{type:`storage<GeometryData>`,visibility:`vertex`}}},gpu:{header:`
const LIGHT_DIRECTIONAL: f32 = 0.0;
const LIGHT_POINT: f32 = 1.0;
const LIGHT_SPOT: f32 = 2.0;
`}};function U(e,n){let r=e._gpuData[n.uid];if(!r){let i=Ze(e._lightDataList.data,e._shadowDataList.data);n.ubo.ensureUniformGroup(i),i.buffer.autoGarbageCollect=!1;let a=new d;a.addressMode=`repeat`;let o=new d;o.compare=`less`;let c=new d;c.addressMode=`clamp-to-edge`;let l=new s({global:i,uSampler:a,uEnvironmentTexture:E.source,uBrdfLutTexture:t.EMPTY.source,uBrdfLutSampler:c,uShadowMap:ce.source,uShadowSampler:o,uOpaqueDepthTexture:oe,uOpaqueColorTexture:t.EMPTY.source,uMaterialStorage:y.source,uRenderableStorage:V,uRenderableInstanceStorage:V,uBonePitStorage:e._bonePit.bufferResource,uMorphStorage:V,uGeometryStorage:V,uInstanceStorage:V});r=new Ie(i,l,{opaqueColor:{group:l,slot:`uOpaqueColorTexture`},opaqueDepth:{group:l,slot:`uOpaqueDepthTexture`},shadowMap:{group:l,slot:`uShadowMap`}}),e._gpuData[n.uid]=r}return r}var xt=class{static extension={type:[a.WebGPUSystem],name:`lighting3d`};_renderer;constructor(e){this._renderer=e}update(e,t){let n=e.passByBit[M.SHADOW];n?.beginFrame(e);let{_lightDataList:r,environment:i}=e;r.reset();let a=U(e,this._renderer).globalUniformGroup.uniforms,o=a.uGlobalLightParams;o[0]=0,o[1]=0,o[2]=0,i!==null&&!(i instanceof pe)&&ae(i,a.uHemisphereSky,a.uHemisphereGround,a.uHemisphereUp);for(let i=0;i<t.length;i++){let a=t[i];if(a._worldVisible){if(a.type===`ambient`){let e=a,t=e.color,n=e.intensity;C(o,0,t,n);continue}r.count>=32||(n?.prepareShadow(a,e),r.add(a))}}o[3]=r.count}},St=`
  var<private> pos: array<vec2<f32>, 3> = array<vec2<f32>, 3>(
    vec2<f32>(-1.0, -1.0), vec2<f32>(-1.0, 3.0), vec2<f32>(3.0, -1.0));

  struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
  };

  @vertex
  fn vertexMain(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
    var output: VertexOutput;
    output.texCoord = pos[vertexIndex] * vec2<f32>(0.5, -0.5) + vec2<f32>(0.5);
    output.position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);
    return output;
  }

  @group(0) @binding(0) var imgSampler: sampler;
  @group(0) @binding(1) var img: texture_2d<f32>;

  @fragment
  fn fragmentMain(@location(0) texCoord: vec2<f32>) -> @location(0) vec4<f32> {
    return textureSample(img, imgSampler, texCoord);
  }
`,Ct=class{static extension={type:[a.WebGPUSystem],name:`mipChain3d`};_renderer;_shaderModule=null;_sampler=null;_pipelines=Object.create(null);_cache=Object.create(null);constructor(e){this._renderer=e}generate(e){if(e.mipLevelCount<=1)return;let t=this._renderer.gpu.device,n=this._renderer.encoder.commandEncoder,r=this._pipeline(t,e.format),{bindGroups:i,dstViews:a}=this._cache[e.uid]||this._buildCacheEntry(e);for(let e=0;e<a.length;e++){let t=n.beginRenderPass({colorAttachments:[{view:a[e],loadOp:`clear`,storeOp:`store`,clearValue:{r:0,g:0,b:0,a:0}}]});t.setPipeline(r),t.setBindGroup(0,i[e]),t.draw(3),t.end()}}_buildCacheEntry(e){let t=this._renderer.gpu.device,n=this._pipeline(t,e.format),r=this._renderer.texture.getGpuSource(e),i=[],a=[],o=n.getBindGroupLayout(0);for(let n=1;n<e.mipLevelCount;n++)a.push(r.createView({baseMipLevel:n,mipLevelCount:1,dimension:`2d`})),i.push(t.createBindGroup({layout:o,entries:[{binding:0,resource:this._sampler},{binding:1,resource:r.createView({baseMipLevel:n-1,mipLevelCount:1,dimension:`2d`})}]}));let s={bindGroups:i,dstViews:a};return this._cache[e.uid]=s,s}_pipeline(e,t){let n=this._pipelines[t];if(n)return n;this._shaderModule||=e.createShaderModule({code:St}),this._sampler||=e.createSampler({minFilter:`linear`});let r=e.createRenderPipeline({layout:`auto`,vertex:{module:this._shaderModule,entryPoint:`vertexMain`},fragment:{module:this._shaderModule,entryPoint:`fragmentMain`,targets:[{format:t}]}});return this._pipelines[t]=r,r}destroy(){this._shaderModule=null,this._sampler=null,this._pipelines=Object.create(null),this._cache=Object.create(null)}};function wt(e){let t=e?8:4;return{name:e?`morphTargetNormal`:`morphTarget`,structs:{GeometryData:F},bindings:{global:{uMorphStorage:`storage<f32>`,uGeometryStorage:`storage<GeometryData>`}},gpu:{vertex:{input:`
        if (renderable.morphWeightIndex != 0u) {
          let geometryData = uGeometryStorage[renderable.geometryDataIndex];
          let vidLocal = vid - geometryData.baseVertex;
          let morphDeltaBase = geometryData.morphDeltaBase + vidLocal * geometryData.morphTargetCount * ${t}u;
          var morphedPosition = position.xyz;${e?`
          var morphedNormal = normal;`:``}
          for (var morphIndex = 0u; morphIndex < geometryData.morphTargetCount; morphIndex = morphIndex + 1u) {
            let weight = uMorphStorage[renderable.morphWeightIndex + morphIndex];
            if (weight != 0.0) {
              let deltaOffset = morphDeltaBase + morphIndex * ${t}u;
              morphedPosition += vec3<f32>(
                uMorphStorage[deltaOffset],
                uMorphStorage[deltaOffset + 1u],
                uMorphStorage[deltaOffset + 2u],
              ) * weight;${e?`
              morphedNormal += vec3<f32>(
                uMorphStorage[deltaOffset + 4u],
                uMorphStorage[deltaOffset + 5u],
                uMorphStorage[deltaOffset + 6u],
              ) * weight;`:``}
            }
          }
          position = vec4<f32>(morphedPosition, position.w);${e?`
          normal = normalize(morphedNormal);`:``}
        }
      `}}}}var Tt=wt(!1),Et=wt(!0);function W(e){return Number.isInteger(e)?`${e}.0`:`${e}`}function Dt(e){let t=e.some(([e,t])=>e!==0||t!==0),n=[];return t&&n.push(`      let texel = 1.0 / sp.z;`),e.forEach(([e,t],r)=>{let i=e===0&&t===0?`uv`:`uv + vec2<f32>(${W(e)}, ${W(t)}) * texel`;n.push(`      ${r===0?`var s = `:`s += `}textureSampleCompareLevel(uShadowMap, uShadowSampler, ${i}, idx, d);`)}),n.push(e.length===1?`      return s;`:`      return s / ${W(e.length)};`),n.join(`
`)}function G(e){return{name:`shadow:${e}`,bindings:{global:{uShadowMap:`texture_depth_2d_array`,uShadowSampler:`sampler_comparison`,uShadowData:`array<vec4<f32>, 96>`}},gpu:{header:`
    fn sampleShadowAtIndex(
      idx: i32,
      worldPos: vec3<f32>,
      normal: vec3<f32>,
      NdotL: f32,
    ) -> f32 {
      let slot = idx * 6;
      let lightSpaceMatrix = mat4x4<f32>(
        global.uShadowData[slot],
        global.uShadowData[slot + 1],
        global.uShadowData[slot + 2],
        global.uShadowData[slot + 3],
      );
      let sp = global.uShadowData[slot + 4];

      let biasedPos = worldPos + normal * (sp.y * (1.0 - NdotL));
      let lsp = lightSpaceMatrix * vec4<f32>(biasedPos, 1.0);
      let proj = lsp.xyz / lsp.w;

      let uv = proj.xy * vec2<f32>(0.5, -0.5) + vec2<f32>(0.5);

      if (any(uv < vec2<f32>(0.0)) || any(uv > vec2<f32>(1.0)) || proj.z < 0.0 || proj.z > 1.0) {
        return 1.0;
      }

      let d = proj.z - sp.x;

${Dt(Ne[e])}
    }

    fn calculateShadow(
      shadowDataIndex: f32,
      cascadeCount: f32,
      worldPos: vec3<f32>,
      normal: vec3<f32>,
      NdotL: f32
    ) -> f32 {
      let baseIndex = i32(shadowDataIndex);

      if (baseIndex == -1) {
        return 1.0;
      }

      let last = i32(cascadeCount) - 1;

      if (last < 1) {
        return sampleShadowAtIndex(baseIndex, worldPos, normal, NdotL);
      }

      let viewDepth = -(camera.uViewMatrix * vec4<f32>(worldPos, 1.0)).z;
      let splits = global.uShadowData[baseIndex * 6 + 5].xyz;

      let crossed = step(splits, vec3<f32>(viewDepth));
      let cascadeIndex = i32(min(dot(crossed, vec3<f32>(1.0)), f32(last)));

      let shadow = sampleShadowAtIndex(baseIndex + cascadeIndex, worldPos, normal, NdotL);

      if (cascadeIndex == last) {
        return shadow;
      }

      let hot = vec3<f32>(f32(cascadeIndex == 0), f32(cascadeIndex == 1), f32(cascadeIndex == 2));
      let splitFar = dot(splits, hot);
      let splitNear = dot(splits, vec3<f32>(hot.y, hot.z, 0.0));

      let band = max((splitFar - splitNear) * ${W(ut)}, 1e-4);
      let blend = saturate((viewDepth - splitFar + band) / band);

      if (blend <= 0.0) {
        return shadow;
      }

      let next = sampleShadowAtIndex(baseIndex + cascadeIndex + 1, worldPos, normal, NdotL);

      return mix(shadow, next, blend);
    }
  `}}}var Ot={hard:G(`hard`),pcf:G(`pcf`),"pcf-high":G(`pcf-high`)},K={name:`skinning`,attributes:{aJoints:`uint8x4`,aWeights:`float32x4`},structs:{BoneMatrix:B},bindings:{global:{uBonePitStorage:`storage<BoneMatrix>`}},gpu:{vertex:{header:`
        fn getBoneRows(idx: u32, bonePitIndex: u32) -> mat3x4<f32> {
            return uBonePitStorage[(bonePitIndex) + idx].rows;
        }
      `,input:`
        var skinRows =
            getBoneRows(input.aJoints.x, renderable.bonePitIndex) * input.aWeights.x +
            getBoneRows(input.aJoints.y, renderable.bonePitIndex) * input.aWeights.y +
            getBoneRows(input.aJoints.z, renderable.bonePitIndex) * input.aWeights.z +
            getBoneRows(input.aJoints.w, renderable.bonePitIndex) * input.aWeights.w;

        position = vec4<f32>(dot(skinRows[0], position), dot(skinRows[1], position), dot(skinRows[2], position), position.w);
        normal = vec3<f32>(dot(skinRows[0].xyz, normal), dot(skinRows[1].xyz, normal), dot(skinRows[2].xyz, normal));
        tangent = vec3<f32>(dot(skinRows[0].xyz, tangent), dot(skinRows[1].xyz, tangent), dot(skinRows[2].xyz, tangent));
      `}}};function kt(e,t){if(e.type===`mat2x2<f32>`)return`mat2x2<f32>(bitcast<vec2<f32>>(${t}.xy), bitcast<vec2<f32>>(${t}.zw))`;let n=`${t}${e.swizzle}`;return e.scalar===`u32`?n:`bitcast<${e.type}>(${n})`}function At(e){let t=[];t.push(`fn ${e.name}(index: u32) -> ${e.struct} {`),t.push(`  let base = ${e.base};`),t.push(`  var m: ${e.struct};`);for(let[n,r]of gt(e.fields,e.read)){t.push(`  let t${n} = ${e.load(`base + ${n}`)};`);for(let e of r)t.push(`  m.${e.name} = ${kt(e,`t${n}`)};`)}return t.push(`  return m;`),t.push(`}`),t.join(`
`)}function jt(e){let{layout:t,loaded:n,varyings:r}=e,i={},a=[`let instance = getInstance(inst.id);`],o=[`var instance: Instance;`];for(let e of r){let n=t.struct[e],r=Fe(e),s=n===`vec4<u32>`?`instance.${e}`:`bitcast<vec4<u32>>(instance.${e})`,c=n===`vec4<u32>`?`input.${r}`:`bitcast<${n}>(input.${r})`;i[r]=`vec4<u32>`,a.push(`output.${r} = ${s};`),o.push(`instance.${e} = ${c};`)}return{name:`instanceAccess:${t.key}`,interStage:i,bindings:{global:{uInstanceStorage:{type:`storage<vec4<u32>>`,visibility:`vertex`}}},gpu:{vertex:{header:At({name:`getInstance`,struct:`Instance`,fields:t.struct,read:n,base:`index * ${t.stride/4}u`,load:e=>`uInstanceStorage[${e}]`}),storeAccess:a.join(`
  `)},fragment:r.length?{storeAccess:o.join(`
  `)}:void 0}}}var Mt={collectData(e){if(!Le(e.bits))return;let t=Be(e.bits,`gpu`,e.instanceLayout,e.template);e.bits=[...e.bits,jt(t)]}},Nt={float32:`f32`,float32x2:`vec2<f32>`,float32x3:`vec3<f32>`,float32x4:`vec4<f32>`,sint32:`i32`,sint32x2:`vec2<i32>`,sint32x3:`vec3<i32>`,sint32x4:`vec4<i32>`,uint32:`u32`,uint32x2:`vec2<u32>`,uint32x3:`vec3<u32>`,uint32x4:`vec4<u32>`,float16x2:`vec2<f32>`,float16x4:`vec4<f32>`,unorm8x2:`vec2<f32>`,unorm8x4:`vec4<f32>`,snorm8x2:`vec2<f32>`,snorm8x4:`vec4<f32>`,uint8x2:`vec2<u32>`,uint8x4:`vec4<u32>`,sint8x2:`vec2<i32>`,sint8x4:`vec4<i32>`,unorm16x2:`vec2<f32>`,unorm16x4:`vec4<f32>`,snorm16x2:`vec2<f32>`,snorm16x4:`vec4<f32>`,uint16x2:`vec2<u32>`,uint16x4:`vec4<u32>`,sint16x2:`vec2<i32>`,sint16x4:`vec4<i32>`};function Pt(e){return Nt[e]||(m(`[compileAttributesWgsl] Unknown vertex format: "${e}"`),`vec4<f32>`)}function Ft(e){let t=Object.keys(e);if(t.length===0)return``;let n=[];n.push(`struct VertexInput {`);let r=0;for(let i of t){let t=Pt(e[i]);n.push(`  @location(${r++}) ${i}: ${t},`)}return n.push(`}`),n.join(`
`)}var It={collectData(e){e.data.attributes=_(e.bits)},injectCode(e){return{header:Ft(e.data.attributes)}}};function Lt(e){return{groupIndex:e,bindingIndex:0,resources:Object.create(null),storages:Object.create(null),uniformBuffers:Object.create(null),uniformGroups:Object.create(null)}}function Rt(e,t,n){m(`[collectBindings] Binding "${e}" redefined with different type: "${n}" → "${t}". Keeping original.`)}function zt(e,t,n){m(`[collectBindings] Bit "${e}" binding "${t}" has invalid storage type: "${n}". Expected format: storage<StructName>`)}function Bt(e,t,n){m(`[collectBindings] Bit "${e}" binding "${t}" has invalid uniform buffer type: "${n}". Expected format: uniform<StructName>`)}function Vt(e,t){let n=Object.create(null);k(t).forEach(({name:e},t)=>{n[e]=Lt(t)});let r=Object.create(null);for(let t of e)if(t.structs)for(let[e,n]of Object.entries(t.structs))e in r||(r[e]=n);for(let t of e)if(t.bindings)for(let[e,i]of Object.entries(t.bindings)){if(!i)continue;let a=e in n;for(let{name:o,spec:s,uniformGroup:c}of fe(i,e)){let i=me(s);if(Ce.has(i)){if(a){let t=n[e].resources;o in t?t[o]!==i&&Rt(o,i,t[o]):t[o]=i}}else if(ge(i)){if(a){let r=de(i);if(!r){zt(t.name,o,i);continue}let a=n[e].storages;o in a||(a[o]=r)}}else if(he(i)){if(a){let a=we(i);if(!a){Bt(t.name,o,i);continue}let s=n[e].uniformBuffers;o in s?s[o]!==a&&Rt(o,a,s[o]):(s[o]=a,r[a]??={})}}else{let t=a?c:e,s=P(t);s in r||(r[s]={});let l=r[s];l[o]&&l[o]!==i?Rt(o,i,l[o]):l[o]=i,a&&(n[e].uniformGroups[t]=!0)}}}return{structs:r,bindGroups:n}}function Ht(e){let{bindGroups:t}=e,n=Object.create(null);for(let e in t){let r=t[e],i=[],a=r.bindingIndex;r.uniformGroups[e]&&i.push({name:e,binding:a++,kind:`uniform`,type:P(e)});for(let e in r.resources)i.push({name:e,binding:a++,kind:`resource`,type:r.resources[e]});for(let e in r.storages)i.push({name:e,binding:a++,kind:`storage`,type:r.storages[e]});for(let e in r.uniformBuffers)i.push({name:e,binding:a++,kind:`uniform`,type:r.uniformBuffers[e]});for(let t in r.uniformGroups)t!==e&&i.push({name:t,binding:a++,kind:`uniform`,type:P(t)});n[e]={groupIndex:r.groupIndex,entries:i}}return n}function Ut(e){let{structs:t,bindGroups:n}=e;for(let e in n){let{uniformBuffers:r}=n[e];for(let e in r){let n=r[e];if(Object.keys(t[n]??{}).length===0)throw Error(`[emitBindingsWgsl] Binding "${e}" is "uniform<${n}>", but no bit declares fields for a "${n}" struct.`)}}let r=[];for(let e in t){let n=t[e];r.push(`struct ${e} {`);for(let[e,t]of Object.entries(n))r.push(`  ${e}: ${t},`);r.push(`}`)}let i=Ht(e);for(let e in i){let{groupIndex:t,entries:n}=i[e];for(let e of n){let n=`@group(${t}) @binding(${e.binding})`;e.kind===`uniform`?r.push(`${n} var<uniform> ${e.name}: ${e.type};`):e.kind===`resource`?r.push(`${n} var ${e.name}: ${e.type};`):r.push(`${n} var<storage, read> ${e.name}: array<${e.type}>;`)}}return r.join(`
`)}var Wt={collectData(e){e.data.bindings=Vt(e.bits,e.template),e.data.structs=e.data.bindings.structs},injectCode(e){return{header:Ut(e.data.bindings)}}},Gt=`{{fragmentWriteOutputs}}`;function Kt(e,t){let n=[`struct Outputs {`];for(let t in e)n.push(`  ${t}: ${e[t]},`);n.push(`}`,``,`struct FragmentOutput {`);for(let r=0;r<t.length;r++)e[t[r]]&&n.push(`  @location(${r}) ${t[r]}: ${e[t[r]]},`);return n.push(`}`),n.join(`
`)}var qt={collectData(e){e.templateString.includes(Gt)&&(e.data.outputs=ne(e.bits))},injectCode(e){let t=e.data.outputs;if(!t)return{};let n=e.outputLocations;return{header:Kt(t,n),fragmentDeclareOutputs:`var outputs: Outputs;`,fragmentWriteOutputs:`return FragmentOutput(${n.filter(e=>t[e]).map(e=>`outputs.${e}`).join(`, `)});`}}};function Jt(e){return e.charAt(0).toUpperCase()+e.slice(1)}function q(e,t){return`${e}${Jt(t)}`}function Yt(e){let t=Oe(e);for(let e of t)if(!(e===`header`||e===`textureGetters`||e.startsWith(`vertex`)||e.startsWith(`fragment`))){let t=q(`vertex`,e),n=q(`fragment`,e);m(`[compileShader] Template slot {{${e}}} is not prefixed with "vertex" or "fragment". Did you mean {{${t}}} or {{${n}}}?`)}}var Xt={collectData(e){Yt(e.templateString),e.data.headers=e.bits.map(e=>e.gpu?.header).filter(e=>!!e?.trim())},injectCode(e){return{header:e.data.headers.join(`

`)}}},Zt=new Set([`position`,`frontFacing`,`sampleIndex`,`sampleMask`]);function Qt(e){return e===`i32`||e===`u32`||e.includes(`<i32>`)||e.includes(`<u32>`)}function $t(e,t,n){m(`[compileInterStageWgsl] Inter-stage variable "${e}" redefined with different type: "${n}" → "${t}". Keeping original.`)}function en(e){let t=Object.create(null);for(let n of e)if(n.interStage)for(let[e,r]of Object.entries(n.interStage))Zt.has(e)||(e in t?t[e]!==r&&$t(e,r,t[e]):t[e]=r);return t}function tn(e){let t=[],n=Object.keys(e);t.push(`struct VertexOutput {`),t.push(`  @builtin(position) position: vec4<f32>,`);let r=0;for(let i of n){let n=e[i],a=Qt(n)?` @interpolate(flat)`:``;t.push(`  @location(${r++})${a} ${i}: ${n},`)}t.push(`}`),t.push(``),t.push(`struct FragmentInput {`),t.push(`  @builtin(position) position: vec4<f32>,`),t.push(`  @builtin(front_facing) frontFacing: bool,`),r=0;for(let i of n){let n=e[i],a=Qt(n)?` @interpolate(flat)`:``;t.push(`  @location(${r++})${a} ${i}: ${n},`)}return t.push(`}`),t.join(`
`)}var nn={collectData(e){e.data.interStage=en(e.bits)},injectCode(e){return{header:tn(e.data.interStage)}}},rn={collectData(e){e.data.overrides=Pe(e.bits)},injectCode(e){return{header:We(e.data.overrides)}}},an=/\{\{(.*?)\}\}/g;function on(e){let t=new Set;for(let n of e)if(n)for(let e of n.matchAll(an))t.add(e[1]);return t}function sn(e,t){let n=Oe(e),r=on(Object.values(t));for(let[e,i]of Object.entries(t))i&&/\S/.test(i)&&!n.has(e)&&!r.has(e)&&m(`[compileShader] Generated code for slot {{${e}}} but template doesn't have it. Slot names are prefixed with stage: vertex.input → {{vertexInput}}, fragment.end → {{fragmentEnd}}.`)}var cn={collectData(e){e.data.vertexSlots=Ue(e.bits,`gpu`,`vertex`),e.data.fragmentSlots=Ue(e.bits,`gpu`,`fragment`)},injectCode(e){let t={};for(let[n,r]of Object.entries(e.data.vertexSlots))t[q(`vertex`,n)]=r.join(`
`);for(let[n,r]of Object.entries(e.data.fragmentSlots))t[q(`fragment`,n)]=r.join(`
`);return sn(e.templateString,t),t}};function ln(e,t){let n=p(e),r=c(n),i=Object.create(null);for(let e of t)if(e.bindings){for(let[t,n]of Object.entries(e.bindings))if(n)for(let{name:e,spec:r}of fe(n,t))e in i||(i[e]=be(r))}for(let e of n.groups){let t=i[e.name];if(!t||t===`both`)continue;let n=r[e.group]?.find(t=>t.binding===e.binding);n&&(n.visibility=t===`vertex`?l.VERTEX:l.FRAGMENT)}return r}var un=`diagnostic(off, derivative_uniformity);
`;function J(e){let{bits:t,template:n,extraPlugins:r,instanceLayout:i,outputLocations:a=A}=e,o=[Mt,rn,Wt,It,nn,qt,Xt,cn],s=r?[...r,...o]:o,c={bits:Re(t),template:n,templateString:n.gpu,data:{},instanceLayout:i,outputLocations:a},l=`${un}${Me(c,s)}`;return{vertex:{source:l,entryPoint:`mainVertex`},fragment:{source:l,entryPoint:`mainFragment`},structs:c.data.structs||{},gpuLayout:ln(l,c.bits),bits:c.bits}}function dn(e){return At({name:`getMaterial`,struct:`Material`,fields:e,base:`i32(index)`,load:e=>`textureLoad(uMaterialStorage, ${Se(e)}, 0)`})}var fn={injectCode(e){let t=e.data.structs?.Material;if(!t)return{};let n=`var material = getMaterial(vMaterialIndex);`;return{textureGetters:dn(t),vertexStoreAccess:n,fragmentStoreAccess:n}}};function pn(e,t){let n=`uMaterialTexture${t}, uMaterialSampler${t}`;return[`fn ${e}Direct(uv: vec2<f32>) -> vec4<f32> {`,`  return textureSampleGrad(${n}, uv, vec2<f32>(0.0), vec2<f32>(0.0));`,`}`,`fn ${e}(uv: vec2<f32>) -> vec4<f32> {`,`  return textureSample(${n}, uv);`,`}`]}function mn(e){return{collectData(t){t.bits.some(e=>e.name.startsWith(`materialBindings:`))||t.bits.unshift(De(t.bits,e))},injectCode(e){let t=0,n=[];for(let r of e.bits)if(r.textures)for(let e of r.textures){let r=`sample${e[0].toUpperCase()}${e.slice(1)}`;n.push(...pn(r,t)),t++}return{textureGetters:n.join(`
`)}}}}var hn={atlas:null,indexCount:void 0,firstIndex:void 0,baseVertex:void 0},gn=class{_materialSystem;constructor(e){this._materialSystem=e}render(e){let{renderables:t,globalBindGroup:n,commandList:r,drawData:i,passBit:a,bindsMaterial:o,batch:s,view3d:c}=e,l=t.count;if(l===0)return;r.clear();let u=t.indices,d=t.items,f=this._materialSystem,p=d[u[0]],m=p._passCache[a],h=p.geometry._geometryAtlasAllocation||hn,g=m.batchKey,_=h.atlas?h.atlas.geometry:p.geometry,v=m.shader,y=ee(g,m.state),b=m.topology,x=p.material,S=0,C=0,w=0,T=x,E=!1;o&&r.captureMaterialTextures(x);for(let e=1;e<l;e++){p=d[u[e]],m=p._passCache[a];let t=m.batchKey,l=p.material,D=t!==g;if(!D&&(!o||l===x))continue;let O=!D&&x._textureSetId===l._textureSetId;if(O){if(E){x=l;continue}if(r.count-w+2>16){r.count=w,S=C,E=!0,v=f.ensureMergedShader(d[u[C]],s,c),x=l;continue}}let k=r.next();k.geometry=_,k.shader=v,k.globalBindGroup=n,k.batchBindGroup=o?E?T._getMergedBindGroup():x._getBindGroup():void 0,k.state=y,k.topology=b,k.batchKey=g,k.textureSetId=o?T._textureSetId:0,k.merged=o&&E,r.captureGeometry(_);let A=(r.count-1)*5,j=i.ensureCapacity(r.count);j[A]=h.indexCount??(_.indexCount||_.indexBuffer.data.length),j[A+1]=e-S,j[A+2]=h.firstIndex||0,j[A+3]=h.baseVertex||0,j[A+4]=S,S=e;let te=l!==x;x=l,O||(D&&(h=p.geometry._geometryAtlasAllocation||hn,g=t,_=h.atlas?h.atlas.geometry:p.geometry,y=ee(t,m.state),b=m.topology),v=m.shader,C=e,w=r.count,T=l,E=!1),o&&te&&(O?r.refreshMaterialBindings(l):r.captureMaterialTextures(l))}{let e=r.next();e.geometry=_,e.shader=v,e.globalBindGroup=n,e.batchBindGroup=o?E?T._getMergedBindGroup():x._getBindGroup():void 0,e.state=y,e.topology=b,e.batchKey=g,e.textureSetId=o?T._textureSetId:0,e.merged=o&&E,r.captureGeometry(_);let t=(r.count-1)*5,a=i.ensureCapacity(r.count);a[t]=h.indexCount??(_.indexCount||_.indexBuffer.data.length),a[t+1]=l-S,a[t+2]=h.firstIndex||0,a[t+3]=h.baseVertex||0,a[t+4]=S}r.endBuild()}},_n=new ye({}),vn=new f({}),yn={direct:[et,mn(`direct`)],merged:[et,fn,mn(`merged`)]},bn=`


{{header}}
{{textureGetters}}
{{vertexHeader}}

@vertex
fn mainVertex(input: VertexInput,
  @builtin(instance_index) ii: u32,
  @builtin(vertex_index) vid: u32
) -> VertexOutput {
  var output: VertexOutput;

  var position: vec4<f32>;
  var normal = vec3<f32>(0.0, 0.0, 1.0);
  var tangent = vec3<f32>(0.0);
  var uv = vec2<f32>(0.0);
  
  let inst = uRenderableInstanceStorage[ii];
  let renderable = uRenderableStorage[inst.id];
  let vMaterialIndex = renderable.materialIndex;
  {{vertexStoreAccess}}

  let batchWorldMatrix = uRenderableStorage[0].transform;
  var modelMatrix = batchWorldMatrix * renderable.transform;

  {{vertexInput}}

  {{vertexBeforeTransform}}

  var worldPosition = modelMatrix * position;
  let modelMatrix3 = mat3x3<f32>(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz);

  let normalScale = 1.0 / vec3<f32>(
    dot(modelMatrix3[0], modelMatrix3[0]),
    dot(modelMatrix3[1], modelMatrix3[1]),
    dot(modelMatrix3[2], modelMatrix3[2])
  );
  var worldNormal = modelMatrix3 * (normal * normalScale);
  var clipPosition = camera.uViewProjectionMatrix * worldPosition;

  {{vertexAfterTransform}}

  {{vertexEnd}}

  output.position       = clipPosition;
  output.vPosition      = worldPosition.xyz;
  output.vNormal        = worldNormal;
  output.vUV            = uv;
  output.vMaterialIndex = renderable.materialIndex;

  return output;
}

@fragment
fn mainFragment(input: FragmentInput) -> FragmentOutput {
  {{fragmentDeclareOutputs}}
  var normal = normalize(input.vNormal);
  var albedo: vec3<f32> = vec3<f32>(1.0);
  var finalColor: vec3<f32>;
  var alpha: f32 = 1.0;

  let vMaterialIndex = input.vMaterialIndex;
  {{fragmentStoreAccess}}

  {{fragmentMaterial}}

  finalColor = albedo;

  {{fragmentLighting}}

  finalColor *= inputExposure(global.uExposure, global.uDisplayExposure);

  {{fragmentEnd}}

  outputs.color = vec4<f32>(finalColor * alpha, alpha);

  {{fragmentWriteOutputs}}
}
`,xn={name:`layout`,overrideDefs:{HAS_UVS:{type:`u32`,required:!0}},outputs:{color:`vec4<f32>`},interStage:{vNormal:`vec3<f32>`,vUV:`vec2<f32>`,vPosition:`vec3<f32>`,vMaterialIndex:`u32`}},Sn={bindGroups:[{name:`global`,ubo:!0},`camera`,`batch`],gpu:bn},Cn=[[l.VERTEX,`vertex`],[l.FRAGMENT,`fragment`]];function wn(e,t,n,r,i){let{maxSamplersPerShaderStage:a,maxSampledTexturesPerShaderStage:o}=n;for(let[n,s]of Cn){let c=0,l=0,u=0,d=0;for(let r=0;r<e.length;r++){let i=e[r];if(i)for(let e of i)e.visibility&n&&(e.texture&&(c++,r===t&&u++),e.sampler&&(l++,r===t&&d++))}let f=l>a;if(!f&&c<=o)continue;let p=`${l} samplers`,m=`${a} (maxSamplersPerShaderStage)`,h=`${c} sampled textures`,g=`${o} (maxSampledTexturesPerShaderStage)`,[_,v,y]=f?[p,m,`Sampled textures: ${c} of ${g}`]:[h,g,`Samplers: ${l} of ${m}`],b=se(i);throw Error(`[MaterialSystemGpu] ${r.material.constructor.name}'s shader binds ${_} in the ${s} stage, but this device allows ${v}. ${y}. The engine's globals take ${l-d} samplers and ${c-u} sampled textures, and the material's ${b.length} texture slots take ${d} samplers and ${u} sampled textures: ${b.join(`, `)}. Turn off a feature group or remove a texture slot.`)}}var Tn=class{static extension={type:[a.WebGPUSystem],name:`material3d`};batcher=new gn(this);_destroyed=!1;_renderer;_shaderCache=new Map;constructor(e){this._renderer=e}computeBatchKey(e,t){let n=e._passCache[t];return this._renderer.pipeline.getPipelineKey(e.geometry,n.shader.gpuProgram,n.state,n.topology,n.shader._overrides??vn)}compilePassShader(e,t){let n=J({bits:[H,R,...e],template:t});return b(n.bits,t),o.from({gpu:n})}compileIsolatedShader(e,t,n){return o.from({gpu:J({bits:e,template:t}),groups:n})}compileShader(e,t,n,r,i,a=`direct`){let s=[],c=``;(e.includeGlobal??!0)&&(s.push(H),c+=`${H.name}|`),(e.includeCamera??!0)&&(s.push(R),c+=`${R.name}|`),s.push(...e.bitsGpu),c+=e.keyGpu;let l=ht(t.geometry.attributes.aPosition.format);ve(l),s.push(l),c+=`|${l.name}`,t._morph&&(t.geometry.hasMorphNormals?(s.push(Et),c+=`|morphN`):(s.push(Tt),c+=`|morph`)),t.skeleton&&(ve(K),s.push(K),c+=`|${K.name}`),n.instanceStoreBuffer&&Le(s)&&(c+=`|inst:${n.instanceStoreBuffer.layout.key}`),c+=`|${a}`;let u=this._shaderCache.get(c);if(!u){let i=J({bits:s,template:e.template,extraPlugins:r,instanceLayout:n.instanceStoreBuffer?.layout,outputLocations:e.outputLocations});b(i.bits,e.template),wn(i.gpuLayout,k(e.template).findIndex(e=>e.name===`batch`),this._renderer.gpu.device.limits,t,i.bits),u={shader:o.from({gpu:i,overrides:e.overrides}),layout:N(i.bits)},this._shaderCache.set(c,u)}return i&&(re(u.layout,t.material),le(u.layout,t.material)),u.shader}ensureMaterial(e,t,n){let r=e.material;this._renderer.renderPipes.view3d.materialStoreBuffer.register(r);let i=this.compileShader(this._materialDescriptor(e,n),e,t,yn.direct,!0),a=r._passBit&M.MATERIAL_PASS_MASK,o=r._passes[a],s=o&&o.state||r.state,c=o&&o.topology||r.topology||e.geometry.topology,l=e._passCache[a];return l?(l.shader=i,l.mergedShader=null,l.state=s,l.topology=c,l.lastGeometryUid=-1):e._passCache[a]=new te(i,s,c),i}ensureMergedShader(e,t,n){let r=e._passCache[e.material._passBit&M.MATERIAL_PASS_MASK];if(r.mergedShader)return r.mergedShader;let i=this._materialDescriptor(e,n);return r.mergedShader=this.compileShader(i,e,t,yn.merged,!0,`merged`),r.mergedShader}_materialDescriptor(e,t){let n=e.geometry,r=e.material,i=r.fog?t._fogBit:null,a=t._toneMappingBit,o=!!n.attributes.aColor&&r.vertexColors,s=Ae(r,a,!!i||o),c=r.getPrimaryDescriptor(t),l=[H,xn,s];n.attributes.aNormal&&l.push(Ve),n.attributes.aUV&&l.push(qe(n.attributes.aUV.format)),r.doubleSided&&l.push(He),r.flatShading&&l.push(pt);let u=r.textures.normal;u&&u!==ue&&n.attributes.aUV&&l.push(n.attributes.aTangent?ft:mt),o&&l.push($e);let d=e.material.lit;e.billboardMode!==`none`&&l.push(ke(e.billboardMode,d));let f=!!n.attributes.aTangent;for(let e=0;e<c.bitsGpu.length;e++){let t=c.bitsGpu[e];l.push(f?S(t):t)}r.alphaMode===`opaque`&&l.push(tt),i&&l.push(i),s!==je&&a&&l.push(r._skipsToneCurve?_e:a),d&&l.push(e.receiveShadow&&t._hasShadows?Ot[t.shadowFilter]:Je,O(a!==null));let p=t.passByBit[r._passBit&M.MATERIAL_PASS_MASK],m=x(l,p,!!c.template);return _n.update({bitsGpu:l,template:c.template??Sn,overrides:{HAS_UVS:+!!n.attributes.aUV,...c.overrides},outputLocations:m,includeGlobal:!1})}destroy(){if(!this._destroyed){this._destroyed=!0;for(let{shader:e}of this._shaderCache.values())e.destroy();this._shaderCache=null}}},En=new Float32Array(24),Dn=4e3;function On(e,t,n,r,i){if(i.lastVisibilityDirtyId!==n._visibilityDirtyId){if(i.lastVisibilityDirtyId=n._visibilityDirtyId,i.direct||t.view.count<4e3){Y(t,n,null,i);return}e.dispatch(i.indirectDrawData.drawCallsBuffer,t.gpuData.instanceBuffer.buffer,i.survivors.buffer,n.storeBuffer.buffer,r,En,t.commandList.count,t.view.count)}}function Y(e,t,n,r){let i=e.gpuData.instanceBuffer.data,a=r.survivors,o=r.indirectDrawData,s=a.data,c=o.drawCalls,l=e.commandList.count,u=e.view.count,d=t.storeBuffer.visible;n!==null&&t._ensureSpheres();let f=t.storeBuffer.boundingSpheres,p=n!==null,m=p?L(n,t.storeBuffer.data):En,h=m[0],g=m[1],_=m[2],v=m[3],y=m[4],b=m[5],x=m[6],ee=m[7],S=m[8],C=m[9],w=m[10],T=m[11],E=m[12],D=m[13],O=m[14],k=m[15],A=m[16],j=m[17],te=m[18],ne=m[19],re=m[20],M=m[21],ie=m[22],ae=m[23],N=!1;for(let e=0;e<l;e++){let t=c[e*5+4],n=e+1<l?c[(e+1)*5+4]:u,r=t;for(let e=t;e<n;e++){let t=i[e];if(d[t]!==0){if(p){let e=t*4,n=f[e+3];if(n>=0){let t=f[e],r=f[e+1],i=f[e+2];if(h*t+g*r+_*i+v<-n||y*t+b*r+x*i+ee<-n||S*t+C*r+w*i+T<-n||E*t+D*r+O*i+k<-n||A*t+j*r+te*i+ne<-n||re*t+M*r+ie*i+ae<-n)continue}}s[r++]=t}}let a=r-t;c[e*5+1]!==a&&(c[e*5+1]=a,N=!0)}N&&r.countsDirtyId++,a.upload(u),r.direct||o.upload(l)}function kn(e){let{pipe:t,bit:n,bindsMaterial:r,session:i,useBundles:a,sortBatch:o}=e;if(!a)return;let{view3d:s}=i,c=t.renderer.material3d.batcher,l=j(e.camera??s.camera).position;for(let e of s._meshBatches){if(!e.renderData._worldVisible)continue;let t=e.drawLists[n];if(!t)continue;let a=t.view;if(a.count===0||!(o?t.isDrawStale():t.nextBuild(s._updateTick)))continue;o&&o(a,e,l);let u=t.gpuData;u.instanceBuffer.populateIds(a),c.render({renderables:a,globalBindGroup:i.globalBindGroup,commandList:t.commandList,drawData:t.drawData,passBit:n,bindsMaterial:r,batch:e,view3d:s}),u.instanceBuffer.upload(a.count)}}function An(e){let{pipe:t,bit:n,cullResults:r,session:i,useBundles:a}=e;if(!a)return;let{view3d:o}=i,s=z(`forward`),c=t.geometryDataStoreBuffer.buffer,l=(e.camera??o.camera).cullFrustum.planesData;r.removeDetached(o);for(let e of o._meshBatches){if(!e.renderData._worldVisible)continue;let i=e.drawLists[n];if(!i||i.view.count===0)continue;i.claimDrawBuilt();let a=i.view.count<=s,o=r.ensure(e);o.sync(i,a);let u=I(e.cull,!a);if(u===`off`){On(t.renderer.compute3d,i,e,c,o);continue}if(u===`cpu`){Y(i,e,l,o);continue}let d=L(l,e.storeBuffer.data);t.renderer.compute3d.dispatch(o.indirectDrawData.drawCallsBuffer,i.gpuData.instanceBuffer.buffer,o.survivors.buffer,e.storeBuffer.buffer,c,d,i.commandList.count,i.view.count)}}function jn(e){let{pipe:t,bit:n,bindsMaterial:r,cullResults:i,session:a,useBundles:o,sortBatch:s}=e,{view3d:c}=a,l=t.renderer.encoder,u=t.renderer.material3d.batcher,d=t.renderer.gc.now,f=e.camera??c.camera,p=j(f),m=f.cullFrustum.planesData,h=t.geometryDataStoreBuffer.buffer,g=z(`forward`);o||i.removeDetached(c);let _=0;for(let e of c._meshBatches){if(!e.renderData._worldVisible)continue;let f=e.drawLists[n];if(!f)continue;let v=f.view;if(v.count===0){if(f.claimDrawEmpty(),o){let t=i.get(e);t&&(t.bundle=null,t.claimBundleRecorded(f,p.bindGroup))}continue}let y=i.ensure(e);if(o&&y.direct&&e.cull!==`off`){y.bundle=null,X(a,e,y),f.claimDrawBuilt(),f.commandList.replayDirect(l,y.indirectDrawData,p);continue}if(o){let r=y.bundle;(!r||y.isBundleStale(f,p.bindGroup)||!l.isBundleValid(r))&&(X(a,e,y),l.beginBundle(`view3d pass ${n} batch ${e.uid}`),y.direct?f.commandList.replayDirect(l,y.indirectDrawData,p):f.commandList.replay(l,t.renderer.buffer,y.indirectDrawData,p,0,f.commandList.bodyCount),y.bundle=l.endBundle(),y.claimBundleRecorded(f,p.bindGroup))}else{let i=!0;s?(s(v,e,p.position),i=f.isDrawStale()||f.isOrderStale()):f.nextBuild(c._updateTick,!0);let o=f.gpuData;i&&(o.instanceBuffer.populateIds(v),u.render({renderables:v,globalBindGroup:a.globalBindGroup,commandList:f.commandList,drawData:f.drawData,passBit:n,bindsMaterial:r,batch:e,view3d:c}),o.instanceBuffer.upload(v.count));let l=v.count<=g;y.sync(f,l),X(a,e,y);let d=I(e.cull,!s&&!l);if(d===`gpu`){let n=L(m,e.storeBuffer.data);t.renderer.compute3d.dispatch(y.indirectDrawData.drawCallsBuffer,o.instanceBuffer.buffer,y.survivors.buffer,e.storeBuffer.buffer,h,n,f.commandList.count,f.view.count)}else Y(f,e,d===`cpu`?m:null,y)}if(f.claimDrawBuilt(),o){let n=f.commandList;n.touch(d),Z[_++]=y.bundle,!y.direct&&n.count>n.bodyCount&&(X(a,e,y),n.replay(l,t.renderer.buffer,y.indirectDrawData,p,n.bodyCount))}else y.direct?f.commandList.replayDirect(l,y.indirectDrawData,p):f.commandList.replay(l,t.renderer.buffer,y.indirectDrawData,p)}_>0&&(l.executeBundle(Z),Z.length=0)}function X(e,t,n){e.globalBindGroup.setResource(t.storeBuffer.bufferResource,`uRenderableStorage`),e.globalBindGroup.setResource(n.survivors.bufferResource,`uRenderableInstanceStorage`),e.globalBindGroup.setResource(t.instanceStoreBuffer?.bufferResource??V,`uInstanceStorage`)}var Z=[];e.register({clear:()=>{Z.length=0}});var Mn={name:`shadowGlobal`,structs:{Renderable:ze,RenderableInstance:Ke,BoneMatrix:B,GeometryData:F},bindings:{global:{uRenderableStorage:{type:`storage<Renderable>`,visibility:`vertex`},uRenderableInstanceStorage:{type:`storage<RenderableInstance>`,visibility:`vertex`},uBonePitStorage:{type:`storage<BoneMatrix>`,visibility:`vertex`},uMorphStorage:{type:`storage<f32>`,visibility:`vertex`},uGeometryStorage:{type:`storage<GeometryData>`,visibility:`vertex`}}}},Nn={bindGroups:[{name:`global`,ubo:!0},`camera`,`local`],gpu:`

{{header}}
{{vertexHeader}}

@vertex
fn mainVertex(
  input: VertexInput,
  @builtin(instance_index) ii: u32,
  @builtin(vertex_index) vid: u32
) -> VertexOutput {
  var output: VertexOutput;

  var position: vec4<f32>;

  let renderable = uRenderableStorage[uRenderableInstanceStorage[ii].id];
  let batchWorldMatrix = uRenderableStorage[0].transform;

  var normal = vec3<f32>(0.0);
  var tangent = vec3<f32>(0.0);

  {{vertexInput}}

  let worldPosition = batchWorldMatrix * renderable.transform * position;
  let clipPosition = camera.uViewProjectionMatrix * worldPosition;

  output.position = clipPosition;

  {{vertexEnd}}

  return output;
}

@fragment
fn mainFragment(input: FragmentInput){
}
`},Pn=class extends rt{_bundleRun=[];constructor(e){let t=xe();t.depthTest=!0,t.depthMask=!0,t.culling=!0,t.clockwiseFrontFace=!1,t.blend=!1,super({renderer:e.renderer,name:`shadow`,description:`Renders shadow-casting scene geometry into each light shadow map.`,bit:M.SHADOW,shadowMapHandle:e.shadowMapHandle,descriptor:{shaderDescriptor:{bitsGpu:[Mn],template:Nn,includeGlobal:!1},state:t}})}_applyZRangeFix=!0;prepare(e){let{view3d:t,lights:n}=e;this._bindShadowSource(t,this.renderTarget.depthStencilTexture);let r=this.pipe.renderer.material3d.batcher,i=this.pipe.renderer.compute3d,a=this.pipe.geometryDataStoreBuffer.buffer;for(let n of t._meshBatches){if(!n.renderData._worldVisible)continue;let i=n.drawLists[this.bit];if(!i)continue;let a=i.gpuData,o=i.view;if(o.count===0){i.claimDrawEmpty();continue}i.nextBuild(t._updateTick)&&(i.claimDrawBuilt(),a.instanceBuffer.populateIds(o),r.render({renderables:o,globalBindGroup:e.globalBindGroup,commandList:i.commandList,drawData:i.drawData,passBit:this.bit,bindsMaterial:!1,batch:n,view3d:t}),a.instanceBuffer.upload(o.count))}for(let e=0;e<n.length;e++){let r=n[e],o=r._gpuShadowData;if(!o||(o.cullResults?.removeDetached(t),!Ee(r)))continue;let s=D(r),c=o.cascades,l=o.cullResults??=new g,u=z(`shadow`);for(let e=0;e<s;e++){let n=c?.[e];if(!n||!n.needsRender)continue;let r=n.cameraData.frustum;for(let n of t._meshBatches){if(!n.renderData._worldVisible)continue;let t=n.drawLists[this.bit];if(!t||t.view.count===0)continue;if(e===0)for(let e=s;e<4;e++)l.remove(n,e);let o=t.view.count<=u,c=l.ensure(n,e);c.sync(t,o);let d=I(n.cull,!o);if(d===`off`)On(i,t,n,a,c);else if(d===`cpu`)Y(t,n,r.planesData,c);else{let e=L(r.planesData,n.storeBuffer.data);i.dispatch(c.indirectDrawData.drawCallsBuffer,t.gpuData.instanceBuffer.buffer,c.survivors.buffer,n.storeBuffer.buffer,a,e,t.commandList.count,t.view.count)}}}}}render(e){let{view3d:t,lights:n}=e,r=this.pipe.renderer,i=r.encoder,a=r.pipeline;a.setColorMask(0);for(let a of n){if(!Ee(a))continue;let n=this.getShadowGPUData(a).cullResults;if(!n)continue;let o=D(a);for(let s=0;s<o;s++){let o=this._cascadeSlot(a,s);if(!o.needsRender)continue;let c=a._shadowDataIndex+s,l=o.cameraData.bindGroup;r.renderTarget.bind({target:this.renderTarget,clear:!0,layer:c}),r.ubo.updateUniformGroup(o.cameraData.uniformGroup),o.cameraData.uniformGroup.buffer.autoGarbageCollect=!1;for(let a of t._meshBatches){if(!a.renderData._worldVisible)continue;let t=a.drawLists[this.bit];if(!t||t.view.count===0)continue;let c=n.get(a,s);if(!c)continue;if(c.direct&&a.cull!==`off`){c.bundle=null,e.globalBindGroup.setResource(a.storeBuffer.bufferResource,`uRenderableStorage`),e.globalBindGroup.setResource(c.survivors.bufferResource,`uRenderableInstanceStorage`),t.commandList.replayDirect(i,c.indirectDrawData,o.cameraData);continue}let u=c.bundle;if(!u||c.isBundleStale(t,l)||!i.isBundleValid(u)){let{globalBindGroup:n}=e;n.setResource(a.storeBuffer.bufferResource,`uRenderableStorage`),n.setResource(c.survivors.bufferResource,`uRenderableInstanceStorage`),i.beginBundle(`shadow cascade ${s} batch ${a.uid}`),c.direct?t.commandList.replayDirect(i,c.indirectDrawData,o.cameraData):t.commandList.replay(i,r.buffer,c.indirectDrawData,o.cameraData,0,t.commandList.bodyCount),c.bundle=i.endBundle(),c.claimBundleRecorded(t,l)}let d=t.commandList;d.touch(r.gc.now),this._bundleRun.push(c.bundle),!c.direct&&d.count>d.bodyCount&&(e.globalBindGroup.setResource(a.storeBuffer.bufferResource,`uRenderableStorage`),e.globalBindGroup.setResource(c.survivors.bufferResource,`uRenderableInstanceStorage`),d.replay(i,r.buffer,c.indirectDrawData,o.cameraData,d.bodyCount))}this._bundleRun.length>0&&(i.executeBundle(this._bundleRun),this._bundleRun.length=0)}this._completeShadowUpdate(a)}a.setColorMask(15),e.activeTarget=null}},Fn=13421772,In=new r,Q=new n,$={x:0,y:0},Ln=class{static extension={type:[a.WebGPUPipes],name:`view3d`};renderer;_brdfLutTexture;_iblEnvironmentMap=new Map;_onEnvironmentDestroy=e=>{this._iblEnvironmentMap.get(e)?.source.unload(),this._iblEnvironmentMap.delete(e)};_viewport=new n;_sortForwardByDistance=(e,t,n)=>{at(e,t.storeBuffer.data,n)};_forwardOptions={pipe:this,bit:0,bindsMaterial:!1,cullResults:null,camera:null,session:null,useBundles:!1,sortBatch:void 0};materialStoreBuffer;_morphStoreBuffer=new Xe;geometryDataStoreBuffer=new ot;atlasPool=it.from({rebaseIndices:!1});_managedViews;_destroyed=!1;_colorOutputDraw=null;constructor(e){this.renderer=e,this._managedViews=new st(this.renderer),this.renderer.runners.contextChange.add(this)}contextChange(e){if(!e.device.features.has(`indirect-first-instance`))throw Error(`@pixi/3d requires the WebGPU 'indirect-first-instance' feature (used by the batched indirect draw path).`);this.materialStoreBuffer??=new Qe({alignment:this.renderer.limits.minUniformBufferOffsetAlignment,rendererType:this.renderer.type})}createShadowPass(e){return new Pn({renderer:this.renderer,shadowMapHandle:e.shadowMapHandle})}renderForward(e,t){jn(this._fillForwardOptions(e,t,e.sort===`distance`)),this._releaseForwardOptions()}prepareForward(e,t){if(!ct(e))return;let n=this._fillForwardOptions(e,t,!1);kn(n),An(n),this._releaseForwardOptions()}_fillForwardOptions(e,t,n){let r=this._forwardOptions;return r.useBundles=ct(e),r.bit=e.bit,r.bindsMaterial=e.bindsMaterial,r.cullResults=e.cullResults,r.camera=e.camera,r.session=t,r.sortBatch=n?this._sortForwardByDistance:void 0,r}_releaseForwardOptions(){this._forwardOptions.cullResults=null,this._forwardOptions.camera=null,this._forwardOptions.session=null}renderGeometry(e,t,n){this.renderer.encoder.draw({geometry:e,shader:t,state:n})}setViewport(e){this.renderer.encoder.setViewport(e)}_depthClearShader=null;_depthClearState=null;clearDepth(e){this._depthClearShader||this._buildDepthClear();let{encoder:t,pipeline:n}=this.renderer;n.setColorMask(0),t.draw({geometry:ie(),shader:this._depthClearShader,state:this._depthClearState}),n.setColorMask(15)}_buildDepthClear(){let e=new h;e.depthTest=!1,e.depthMask=!0,e.culling=!1,e.blend=!1,this._depthClearState=e,this._depthClearShader=o.from({gpu:{vertex:{entryPoint:`mainVertex`,source:`
            struct VertexOutput { @builtin(position) position: vec4<f32> };

            @vertex
            fn mainVertex(@location(0) aPosition: vec2<f32>) -> VertexOutput {
              var output: VertexOutput;
              output.position = vec4<f32>(aPosition, 1.0, 1.0);
              return output;
            }
          `},fragment:{entryPoint:`mainFragment`,source:`
            @fragment
            fn mainFragment() -> @location(0) vec4<f32> {
              return vec4<f32>(0.0, 0.0, 0.0, 1.0);
            }
          `}}})}copyColor(e,t,n){let{target:r,viewport:i}=e;if(!r.colorTexture)return;this.renderer.renderTarget.finishRenderPass();let a=t.frame,o=t.source.resolution;$.x=Math.round(a.x*o),$.y=Math.round(a.y*o),this.renderer.renderTarget.copyToTexture(r,t,Q.copyFrom(i),Q,$),n.activeTarget=null}outputColor(e,t,n,r){e.target.colorTexture&&(this.renderer.renderTarget.finishRenderPass(),(this._colorOutputDraw??=new Ye(this.renderer)).draw(this,e,t,r),n.activeTarget=null)}generateMips(e,t){let n=t.view3d._graph.getTexture(e,t).source;this.renderer.renderTarget.finishRenderPass(),t.activeTarget=null,this.renderer.mipChain3d.generate(n)}resolveColor(){}copyDepth(e,t,n){let{target:r,viewport:i}=e;r.depthStencilTexture&&(this.renderer.renderTarget.finishRenderPass(),$.x=0,$.y=0,this.renderer.renderTarget.copyDepthTexture(r,t,Q.copyFrom(i),Q,$),n.activeTarget=null)}validateRenderable(){return!1}addRenderable(e,t){this.renderer.renderPipes.batch.break(t),t.add(e)}updateRenderable(){}execute(e){if(!e.isRenderable)return;let t=U(e,this.renderer),n=this.renderer.renderTarget.renderTarget;e._ensureInitialized(this.renderer,t,n.colorTexture.source.resolution),this._managedViews.track(e);let r=e.environment;r&&(this._brdfLutTexture||=nt({renderer:this.renderer}),t.globalBindGroup.setResource(this._brdfLutTexture.source,`uBrdfLutTexture`));let i=this._prefilteredEnvironment(r);t.globalBindGroup.getResource(`uEnvironmentTexture`)!==i&&(t.globalBindGroup.setResource(i,`uEnvironmentTexture`),e._invalidateBundleCaches());let a=e.lights;if(e._meshSlots.count===0&&e._meshBatches.length===1)return;let o={view3d:e,lights:a,defaultTarget:n,defaultFrontFaceInverted:!1,activeTarget:null,needsDepthClear:!0,viewport:this._viewport,activeViewport:this._viewport,globalBindGroup:t.globalBindGroup,renderer:this.renderer};lt(e,this,o)&&(t.globalBindGroup.setResource(this.materialStoreBuffer.texture.source,`uMaterialStorage`),t.globalBindGroup.setResource(e._bonePit.bufferResource,`uBonePitStorage`),t.globalBindGroup.setResource(this._morphStoreBuffer.bufferResource,`uMorphStorage`),t.globalBindGroup.setResource(this.geometryDataStoreBuffer.bufferResource,`uGeometryStorage`),this.materialStoreBuffer.update(),this.geometryDataStoreBuffer.update(),this.atlasPool.update(),dt(this.atlasPool,this.materialStoreBuffer,t,this._morphStoreBuffer,this.geometryDataStoreBuffer)&&e._invalidateDrawCaches(),this.prepareView(o),e._graph.run(o))}destroy(){if(!this._destroyed){this._destroyed=!0,this._managedViews.destroy(),this._colorOutputDraw?.destroy(),this._colorOutputDraw=null,this._brdfLutTexture?.destroy(!0),this._brdfLutTexture=void 0;for(let[e,t]of this._iblEnvironmentMap)e.off(`destroy`,this._onEnvironmentDestroy),t.destroy(!0);this._iblEnvironmentMap=null,this.renderer.runners.contextChange.remove(this),this.materialStoreBuffer.destroy(),this.materialStoreBuffer=null,this._morphStoreBuffer.destroy(),this.geometryDataStoreBuffer.destroy(),this._depthClearShader?.destroy(),this._depthClearShader=null,this._depthClearState=null}}_prefilteredEnvironment(e){if(!(e instanceof pe)||e.source.destroyed)return E.source;let t=this._iblEnvironmentMap.get(e.source);return t||(t=Te({renderer:this.renderer,sourceTexture:e}),this._iblEnvironmentMap.set(e.source,t),e.source.once(`destroy`,this._onEnvironmentDestroy)),t.source}prepareView(e){let{view3d:t,lights:n}=e;this.renderer.lighting3d.update(t,n),this._updateGlobalUniforms(t)}_updateGlobalUniforms(e){let{fog:t}=e,n=U(e,this.renderer).globalUniformGroup,r=n.uniforms;if(r.uTime=performance.now()/1e3,r.uExposure=e.exposure,r.uDisplayExposure=e.exposure**(1/2.2),t){In.setValue(t.color??Fn),T(r.uFogColor,0,In,e.exposure);let n=r.uFogParams;n[0]=t.near||0,n[1]=t.far||99999999,n[2]=t.density||0}n.update(),this.renderer.ubo.updateUniformGroup(n)}};i.add(bt,xt,Ct,Tn,Ln);export{bt as ComputeSystemGpu,Dn as GPU_VISIBILITY_MIN,xt as LightingSystemGpu,Tn as MaterialSystemGpu,Ct as MipChainSystemGpu,Pn as ShadowRenderPassGpu,Ln as View3DPipeGpu,Ht as buildWgslBindingMap,Vt as collectBindings,J as compileWgslSource,An as computeForwardBatchesGpu,mn as createTexturesPluginGpu,Ut as emitBindingsWgsl,At as generateWgslStructAccessor,U as getGlobalGpuData,H as globalBitGpu,Mt as instanceAccessPlugin,fn as materialTextureAccessPlugin,Tt as morphTargetBitGpu,Et as morphTargetNormalBitGpu,q as prefixSlotName,kn as prepareForwardBatchesGpu,Y as produceCpuCompaction,On as produceVisibilityCompaction,jn as renderForwardBatchesGpu,Ot as shadowBitsGpu,Mn as shadowGlobalBitGpu,K as skinningBitGpu,It as wgslAttributesPlugin,Wt as wgslBindingsPlugin,qt as wgslFragmentOutputsPlugin,Xt as wgslHeadersPlugin,nn as wgslInterStagePlugin,rn as wgslOverridesPlugin,cn as wgslStageSlotsPlugin};