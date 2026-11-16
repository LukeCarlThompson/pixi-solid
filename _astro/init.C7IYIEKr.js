import{a4 as we,a5 as Ee,a6 as at,a7 as nt,a8 as st,a9 as Ae,aa as Ve,R as j,ab as Fe,ac as ot,ad as it,a0 as ut,ae as fe,af as Ne,ag as Ue,ah as ct,ai as lt,aj as dt,ak as pt,al as ft,am as mt,an as gt,ao as ht,ap as bt,aq as xt,ar as _e,as as Be,at as vt,au as St,av as yt,aw as wt,N as _t,ax as Bt,ay as Dt,az as Ct,aA as Gt,J as Mt,aB as It,aC as ze,aD as Pt,aE as De,aF as Ce,aG as Tt,aH as Rt,aI as $t,L as Lt}from"./view-3d.CbSxVUmV.js";import{W as k,A as W,T as ie,h as Ot,g as Ge,w as O,G as Et,R as je,o as At,C as Vt,K as Ft}from"./pixi-canvas.DUqT5F9V.js";import{B as Nt}from"./BufferResource.BALqOo0E.js";import{L as Ut,G as ge,B as he,R as ke,a as We,c as zt,V as jt,S as kt,C as Wt,l as Ht,r as He,b as qt,i as Kt,g as qe,e as Yt,d as Jt,f as Me,h as Xt,j as Zt,m as Qt,k as ue,n as er,o as Ie,s as tr,p as rr,q as ar,t as nr,u as sr,v as or,w as ir,x as ur,y as cr,z as lr,A as dr,D as pr,E as te,F as be,H as xe,I as fr,J as mr,M as gr,K as hr,N as br,O as xr,P as vr,Q as Pe,T as Sr,U as yr,W as wr,X as _r}from"./View3DGlobalData.DNnAoUh4.js";import{e as Br,b as Dr,c as Q,d as Cr,S as J}from"./Shader.C8jqO_v2.js";const Te={atlas:null,indexCount:void 0,firstIndex:void 0,baseVertex:void 0};var Gr=class{_materialSystem;constructor(e){this._materialSystem=e}render(e){const{renderables:t,globalBindGroup:r,commandList:a,drawData:n,passBit:i,bindsMaterial:s,batch:u,view3d:o}=e,c=t.count;if(c===0)return;a.clear();const l=t.indices,p=t.items,m=this._materialSystem;let d=p[l[0]],f=d._passCache[i],h=d.geometry._geometryAtlasAllocation||Te,y=f.batchKey,x=h.atlas?h.atlas.geometry:d.geometry,v=f.shader,b=we(y,f.state),_=f.topology,g=d.material,S=0,D=0,C=0,P=g,G=!1;s&&a.captureMaterialTextures(g);for(let w=1;w<c;w++){d=p[l[w]],f=d._passCache[i];const M=f.batchKey,B=d.material,U=M!==y;if(!U&&(!s||B===g))continue;const z=!U&&g._textureSetId===B._textureSetId;if(z){if(G){g=B;continue}if(a.count-C+2>16){a.count=C,S=D,G=!0,v=m.ensureMergedShader(p[l[D]],u,o),g=B;continue}}const I=a.next();I.geometry=x,I.shader=v,I.globalBindGroup=r,I.batchBindGroup=s?G?P._getMergedBindGroup():g._getBindGroup():void 0,I.state=b,I.topology=_,I.batchKey=y,I.textureSetId=s?P._textureSetId:0,I.merged=s&&G,a.captureGeometry(x);const T=(a.count-1)*5,R=n.ensureCapacity(a.count);R[T]=h.indexCount??(x.indexCount||x.indexBuffer.data.length),R[T+1]=w-S,R[T+2]=h.firstIndex||0,R[T+3]=h.baseVertex||0,R[T+4]=S,S=w;const ae=B!==g;g=B,z||(U&&(h=d.geometry._geometryAtlasAllocation||Te,y=M,x=h.atlas?h.atlas.geometry:d.geometry,b=we(M,f.state),_=f.topology),v=f.shader,D=w,C=a.count,P=B,G=!1),s&&ae&&(z?a.refreshMaterialBindings(B):a.captureMaterialTextures(B))}{const w=a.next();w.geometry=x,w.shader=v,w.globalBindGroup=r,w.batchBindGroup=s?G?P._getMergedBindGroup():g._getBindGroup():void 0,w.state=b,w.topology=_,w.batchKey=y,w.textureSetId=s?P._textureSetId:0,w.merged=s&&G,a.captureGeometry(x);const M=(a.count-1)*5,B=n.ensureCapacity(a.count);B[M]=h.indexCount??(x.indexCount||x.indexBuffer.data.length),B[M+1]=c-S,B[M+2]=h.firstIndex||0,B[M+3]=h.baseVertex||0,B[M+4]=S}a.endBuild()}};const N=new Nt({buffer:new Ee({data:new Int32Array(1),usage:k.STORAGE|k.COPY_DST|k.COPY_SRC,label:"EmptyBufferResource",shrinkToFit:!1})}),Ke=`
struct DrawArgs {
  indexCount: u32,
  instanceCount: atomic<u32>,
  firstIndex: u32,
  baseVertex: u32,
  firstInstance: u32,
};
`,Mr=`
${Ke}
@group(0) @binding(0) var<storage, read_write> drawCalls: array<DrawArgs>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let k = gid.x;
  if (k >= arrayLength(&drawCalls)) { return; }
  atomicStore(&drawCalls[k].instanceCount, 0u);
}
`,Ir=`
${Ke}
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
`;var Pr=class{static extension={type:[W.WebGPUSystem],name:"compute3d"};_renderer;_zeroPipeline=null;_compactPipeline=null;_zeroBinds=new WeakMap;_compactBinds=new WeakMap;_jobs=[];_jobCount=0;_destroyed=!1;constructor(e){this._renderer=e}renderStart(){this._jobCount=0}dispatch(e,t,r,a,n,i,s,u){if(s===0||u===0)return;let o=this._jobs[this._jobCount];if(!o){const c=new Float32Array(24);o=this._jobs[this._jobCount]={drawCalls:null,src:null,dst:null,store:null,bounds:null,params:new Ee({data:c,usage:k.UNIFORM|k.COPY_DST,label:"mesh3d_cull_frustum",shrinkToFit:!1}),paramsF32:c,commandCount:0,instanceCount:0}}o.drawCalls=e,o.src=t,o.dst=r,o.store=a,o.bounds=n,o.paramsF32.set(i),o.params.update(),o.commandCount=s,o.instanceCount=u,this._jobCount++}renderEnd(){const e=this._jobCount;if(this._jobCount=0,e===0)return;const t=this._renderer.gpu.device,r=this._renderer.buffer,a=this._zeroPipeline||this._buildPipeline(t,Mr,"_zeroPipeline"),n=this._compactPipeline||this._buildPipeline(t,Ir,"_compactPipeline"),i=t.createCommandEncoder(),s=this._jobs,u=i.beginComputePass();u.setPipeline(a);for(let c=0;c<e;c++){const l=s[c],p=r.getGPUBuffer(l.drawCalls);u.setBindGroup(0,this._zeroBindGroup(t,a,p,l.commandCount)),u.dispatchWorkgroups(Math.ceil(l.commandCount/64))}u.end();const o=i.beginComputePass();o.setPipeline(n);for(let c=0;c<e;c++){const l=s[c];o.setBindGroup(0,this._compactBindGroup(t,n,l,r)),o.dispatchWorkgroups(Math.ceil(l.instanceCount/64))}o.end(),t.queue.submit([i.finish()]);for(let c=0;c<e;c++)s[c].drawCalls=null,s[c].src=null,s[c].dst=null,s[c].store=null,s[c].bounds=null}_zeroBindGroup(e,t,r,a){const n=this._zeroBinds.get(r);if(n&&n.commandCount===a)return n.bindGroup;const i=e.createBindGroup({layout:t.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:r,offset:0,size:a*20}}]});return this._zeroBinds.set(r,{bindGroup:i,commandCount:a}),i}_compactBindGroup(e,t,r,a){const n=a.getGPUBuffer(r.src),i=a.getGPUBuffer(r.dst),s=a.getGPUBuffer(r.drawCalls),u=a.getGPUBuffer(r.store),o=a.getGPUBuffer(r.bounds),c=a.getGPUBuffer(r.params),l=this._compactBinds.get(s);if(l&&l.src===n&&l.dst===i&&l.drawCalls===s&&l.store===u&&l.bounds===o&&l.params===c&&l.commandCount===r.commandCount&&l.instanceCount===r.instanceCount)return l.bindGroup;const p=e.createBindGroup({layout:t.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:n,offset:0,size:r.instanceCount*4}},{binding:1,resource:{buffer:i,offset:0,size:r.instanceCount*4}},{binding:2,resource:{buffer:s,offset:0,size:r.commandCount*20}},{binding:3,resource:{buffer:u}},{binding:4,resource:{buffer:o}},{binding:5,resource:{buffer:c}}]});return this._compactBinds.set(s,{bindGroup:p,src:n,dst:i,drawCalls:s,store:u,bounds:o,params:c,commandCount:r.commandCount,instanceCount:r.instanceCount}),p}_buildPipeline(e,t,r){const a=e.createShaderModule({code:t}),n=e.createComputePipeline({layout:"auto",compute:{module:a,entryPoint:"main"}});return this[r]=n,n}destroy(){if(!this._destroyed){this._destroyed=!0;for(const e of this._jobs)e.params?.destroy();this._jobs=null,this._zeroPipeline=null,this._compactPipeline=null,this._zeroBinds=new WeakMap,this._compactBinds=new WeakMap,this._jobCount=0}}};const q={name:"global",structs:{Renderable:We,RenderableInstance:ke,BoneMatrix:he,GeometryData:ge,Light:Ut},bindings:{global:{uGlobalLightParams:"vec4<f32>",uTime:"f32",uFogColor:"vec3<f32>",uDisplayExposure:"f32",uFogParams:"vec3<f32>",uExposure:"f32",uHemisphereSky:"vec3<f32>",uHemisphereGround:"vec3<f32>",uHemisphereUp:"vec3<f32>",uLightData:"array<vec4<f32>, 128>",uShadowData:`array<vec4<f32>, ${Ve*6}>`,uSampler:"sampler",uEnvironmentTexture:"texture_cube<f32>",uBrdfLutTexture:"texture_2d<f32>",uBrdfLutSampler:"sampler",uShadowMap:"texture_depth_2d_array",uShadowSampler:"sampler_comparison",uOpaqueDepthTexture:"texture_depth_2d",uOpaqueColorTexture:"texture_2d<f32>",uMaterialStorage:"texture_2d<u32>",uRenderableStorage:{type:"storage<Renderable>",visibility:"vertex"},uRenderableInstanceStorage:{type:"storage<RenderableInstance>",visibility:"vertex"},uBonePitStorage:{type:"storage<BoneMatrix>",visibility:"vertex"},uMorphStorage:{type:"storage<f32>",visibility:"vertex"},uGeometryStorage:{type:"storage<GeometryData>",visibility:"vertex"}}},gpu:{header:`
const LIGHT_DIRECTIONAL: f32 = 0.0;
const LIGHT_POINT: f32 = 1.0;
const LIGHT_SPOT: f32 = 2.0;
`}};function me(e,t){let r=e._gpuData[t.uid];if(!r){const a=zt(e._lightDataList.data,e._shadowDataList.data);t.ubo.ensureUniformGroup(a),a.buffer.autoGarbageCollect=!1;const n=new ie;n.addressMode="repeat";const i=new ie;i.compare="less";const s=new ie;s.addressMode="clamp-to-edge";const u=new Ot({global:a,uSampler:n,uEnvironmentTexture:Ae.source,uBrdfLutTexture:Ge.EMPTY.source,uBrdfLutSampler:s,uShadowMap:st.source,uShadowSampler:i,uOpaqueDepthTexture:nt,uOpaqueColorTexture:Ge.EMPTY.source,uMaterialStorage:at.source,uRenderableStorage:N,uRenderableInstanceStorage:N,uBonePitStorage:e._bonePit.bufferResource,uMorphStorage:N,uGeometryStorage:N,uInstanceStorage:N});r=new jt(a,u,{opaqueColor:{group:u,slot:"uOpaqueColorTexture"},opaqueDepth:{group:u,slot:"uOpaqueDepthTexture"},shadowMap:{group:u,slot:"uShadowMap"}}),e._gpuData[t.uid]=r}return r}var Tr=class{static extension={type:[W.WebGPUSystem],name:"lighting3d"};_renderer;constructor(e){this._renderer=e}update(e,t){const r=e.passByBit[j.SHADOW];r?.beginFrame(e);const{_lightDataList:a,environment:n}=e;a.reset();const i=me(e,this._renderer).globalUniformGroup.uniforms,s=i.uGlobalLightParams;s[0]=0,s[1]=0,s[2]=0,n!==null&&!(n instanceof Fe)&&ot(n,i.uHemisphereSky,i.uHemisphereGround,i.uHemisphereUp);for(let u=0;u<t.length;u++){const o=t[u];if(o._worldVisible){if(o.type==="ambient"){const c=o,l=c.color,p=c.intensity;it(s,0,l,p);continue}a.count>=32||(r?.prepareShadow(o,e),a.add(o))}}s[3]=a.count}};const Rr=`
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
`;var $r=class{static extension={type:[W.WebGPUSystem],name:"mipChain3d"};_renderer;_shaderModule=null;_sampler=null;_pipelines=Object.create(null);_cache=Object.create(null);constructor(e){this._renderer=e}generate(e){if(e.mipLevelCount<=1)return;const t=this._renderer.gpu.device,r=this._renderer.encoder.commandEncoder,a=this._pipeline(t,e.format),{bindGroups:n,dstViews:i}=this._cache[e.uid]||this._buildCacheEntry(e);for(let s=0;s<i.length;s++){const u=r.beginRenderPass({colorAttachments:[{view:i[s],loadOp:"clear",storeOp:"store",clearValue:{r:0,g:0,b:0,a:0}}]});u.setPipeline(a),u.setBindGroup(0,n[s]),u.draw(3),u.end()}}_buildCacheEntry(e){const t=this._renderer.gpu.device,r=this._pipeline(t,e.format),a=this._renderer.texture.getGpuSource(e),n=[],i=[],s=r.getBindGroupLayout(0);for(let o=1;o<e.mipLevelCount;o++)i.push(a.createView({baseMipLevel:o,mipLevelCount:1,dimension:"2d"})),n.push(t.createBindGroup({layout:s,entries:[{binding:0,resource:this._sampler},{binding:1,resource:a.createView({baseMipLevel:o-1,mipLevelCount:1,dimension:"2d"})}]}));const u={bindGroups:n,dstViews:i};return this._cache[e.uid]=u,u}_pipeline(e,t){const r=this._pipelines[t];if(r)return r;this._shaderModule||=e.createShaderModule({code:Rr}),this._sampler||=e.createSampler({minFilter:"linear"});const a=e.createRenderPipeline({layout:"auto",vertex:{module:this._shaderModule,entryPoint:"vertexMain"},fragment:{module:this._shaderModule,entryPoint:"fragmentMain",targets:[{format:t}]}});return this._pipelines[t]=a,a}destroy(){this._shaderModule=null,this._sampler=null,this._pipelines=Object.create(null),this._cache=Object.create(null)}};function Ye(e){const t=e?8:4;return{name:e?"morphTargetNormal":"morphTarget",structs:{GeometryData:ge},bindings:{global:{uMorphStorage:"storage<f32>",uGeometryStorage:"storage<GeometryData>"}},gpu:{vertex:{input:`
        if (renderable.morphWeightIndex != 0u) {
          let geometryData = uGeometryStorage[renderable.geometryDataIndex];
          let vidLocal = vid - geometryData.baseVertex;
          let morphDeltaBase = geometryData.morphDeltaBase + vidLocal * geometryData.morphTargetCount * ${t}u;
          var morphedPosition = position.xyz;${e?`
          var morphedNormal = normal;`:""}
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
              ) * weight;`:""}
            }
          }
          position = vec4<f32>(morphedPosition, position.w);${e?`
          normal = normalize(morphedNormal);`:""}
        }
      `}}}}const Lr=Ye(!1),Or=Ye(!0);function X(e){return Number.isInteger(e)?`${e}.0`:`${e}`}function Er(e){const t=e.some(([a,n])=>a!==0||n!==0),r=[];return t&&r.push("      let texel = 1.0 / sp.z;"),e.forEach(([a,n],i)=>{const s=a===0&&n===0?"uv":`uv + vec2<f32>(${X(a)}, ${X(n)}) * texel`;r.push(`      ${i===0?"var s = ":"s += "}textureSampleCompareLevel(uShadowMap, uShadowSampler, ${s}, idx, d);`)}),r.push(e.length===1?"      return s;":`      return s / ${X(e.length)};`),r.join(`
`)}function ce(e){return{name:`shadow:${e}`,bindings:{global:{uShadowMap:"texture_depth_2d_array",uShadowSampler:"sampler_comparison",uShadowData:`array<vec4<f32>, ${Ve*6}>`}},gpu:{header:`
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

${Er(kt[e])}
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

      let band = max((splitFar - splitNear) * ${X(Wt)}, 1e-4);
      let blend = saturate((viewDepth - splitFar + band) / band);

      if (blend <= 0.0) {
        return shadow;
      }

      let next = sampleShadowAtIndex(baseIndex + cascadeIndex + 1, worldPos, normal, NdotL);

      return mix(shadow, next, blend);
    }
  `}}}const Ar={hard:ce("hard"),pcf:ce("pcf"),"pcf-high":ce("pcf-high")},le={name:"skinning",attributes:{aJoints:"uint8x4",aWeights:"float32x4"},structs:{BoneMatrix:he},bindings:{global:{uBonePitStorage:"storage<BoneMatrix>"}},gpu:{vertex:{header:`
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
      `}}};function Vr(e,t){if(e.type==="mat2x2<f32>")return`mat2x2<f32>(bitcast<vec2<f32>>(${t}.xy), bitcast<vec2<f32>>(${t}.zw))`;const r=`${t}${e.swizzle}`;return e.scalar==="u32"?r:`bitcast<${e.type}>(${r})`}function Je(e){const t=[];t.push(`fn ${e.name}(index: u32) -> ${e.struct} {`),t.push(`  let base = ${e.base};`),t.push(`  var m: ${e.struct};`);for(const[r,a]of Ht(e.fields,e.read)){t.push(`  let t${r} = ${e.load(`base + ${r}`)};`);for(const n of a)t.push(`  m.${n.name} = ${Vr(n,`t${r}`)};`)}return t.push("  return m;"),t.push("}"),t.join(`
`)}function Fr(e){const{layout:t,loaded:r,varyings:a}=e,n={},i=["let instance = getInstance(inst.id);"],s=["var instance: Instance;"];for(const u of a){const o=t.struct[u],c=Kt(u),l=o==="vec4<u32>"?`instance.${u}`:`bitcast<vec4<u32>>(instance.${u})`,p=o==="vec4<u32>"?`input.${c}`:`bitcast<${o}>(input.${c})`;n[c]="vec4<u32>",i.push(`output.${c} = ${l};`),s.push(`instance.${u} = ${p};`)}return{name:`instanceAccess:${t.key}`,interStage:n,bindings:{global:{uInstanceStorage:{type:"storage<vec4<u32>>",visibility:"vertex"}}},gpu:{vertex:{header:Je({name:"getInstance",struct:"Instance",fields:t.struct,read:r,base:`index * ${t.stride/4}u`,load:u=>`uInstanceStorage[${u}]`}),storeAccess:i.join(`
  `)},fragment:a.length?{storeAccess:s.join(`
  `)}:void 0}}}const Nr={collectData(e){if(!He(e.bits))return;const t=qt(e.bits,"gpu",e.instanceLayout,e.template);e.bits=[...e.bits,Fr(t)]}},Ur={float32:"f32",float32x2:"vec2<f32>",float32x3:"vec3<f32>",float32x4:"vec4<f32>",sint32:"i32",sint32x2:"vec2<i32>",sint32x3:"vec3<i32>",sint32x4:"vec4<i32>",uint32:"u32",uint32x2:"vec2<u32>",uint32x3:"vec3<u32>",uint32x4:"vec4<u32>",float16x2:"vec2<f32>",float16x4:"vec4<f32>",unorm8x2:"vec2<f32>",unorm8x4:"vec4<f32>",snorm8x2:"vec2<f32>",snorm8x4:"vec4<f32>",uint8x2:"vec2<u32>",uint8x4:"vec4<u32>",sint8x2:"vec2<i32>",sint8x4:"vec4<i32>",unorm16x2:"vec2<f32>",unorm16x4:"vec4<f32>",snorm16x2:"vec2<f32>",snorm16x4:"vec4<f32>",uint16x2:"vec2<u32>",uint16x4:"vec4<u32>",sint16x2:"vec2<i32>",sint16x4:"vec4<i32>"};function zr(e){const t=Ur[e];return t||(O(`[compileAttributesWgsl] Unknown vertex format: "${e}"`),"vec4<f32>")}function jr(e){const t=Object.keys(e);if(t.length===0)return"";const r=[];r.push("struct VertexInput {");let a=0;for(const n of t){const i=zr(e[n]);r.push(`  @location(${a++}) ${n}: ${i},`)}return r.push("}"),r.join(`
`)}const kr={collectData(e){e.data.attributes=ut(e.bits)},injectCode(e){return{header:jr(e.data.attributes)}}};function Wr(e){return{groupIndex:e,bindingIndex:0,resources:Object.create(null),storages:Object.create(null),uniformBuffers:Object.create(null),uniformGroups:Object.create(null)}}function de(e,t,r){O(`[collectBindings] Binding "${e}" redefined with different type: "${r}" → "${t}". Keeping original.`)}function Hr(e,t,r){O(`[collectBindings] Bit "${e}" binding "${t}" has invalid storage type: "${r}". Expected format: storage<StructName>`)}function qr(e,t,r){O(`[collectBindings] Bit "${e}" binding "${t}" has invalid uniform buffer type: "${r}". Expected format: uniform<StructName>`)}function Kr(e,t){const r=Object.create(null);Ne(t).forEach(({name:n},i)=>{r[n]=Wr(i)});const a=Object.create(null);for(const n of e)if(n.structs)for(const[i,s]of Object.entries(n.structs))i in a||(a[i]=s);for(const n of e)if(n.bindings)for(const[i,s]of Object.entries(n.bindings)){if(!s)continue;const u=i in r;for(const{name:o,spec:c,uniformGroup:l}of Ue(s,i)){const p=ct(c);if(lt.has(p)){if(u){const m=r[i].resources;o in m?m[o]!==p&&de(o,p,m[o]):m[o]=p}}else if(dt(p)){if(u){const m=pt(p);if(!m){Hr(n.name,o,p);continue}const d=r[i].storages;o in d||(d[o]=m)}}else if(ft(p)){if(u){const m=mt(p);if(!m){qr(n.name,o,p);continue}const d=r[i].uniformBuffers;o in d?d[o]!==m&&de(o,m,d[o]):(d[o]=m,a[m]??={})}}else{const m=u?l:i,d=fe(m);d in a||(a[d]={});const f=a[d];f[o]&&f[o]!==p?de(o,p,f[o]):f[o]=p,u&&(r[i].uniformGroups[m]=!0)}}}return{structs:a,bindGroups:r}}function Yr(e){const{bindGroups:t}=e,r=Object.create(null);for(const a in t){const n=t[a],i=[];let s=n.bindingIndex;n.uniformGroups[a]&&i.push({name:a,binding:s++,kind:"uniform",type:fe(a)});for(const u in n.resources)i.push({name:u,binding:s++,kind:"resource",type:n.resources[u]});for(const u in n.storages)i.push({name:u,binding:s++,kind:"storage",type:n.storages[u]});for(const u in n.uniformBuffers)i.push({name:u,binding:s++,kind:"uniform",type:n.uniformBuffers[u]});for(const u in n.uniformGroups)u!==a&&i.push({name:u,binding:s++,kind:"uniform",type:fe(u)});r[a]={groupIndex:n.groupIndex,entries:i}}return r}function Jr(e){const{structs:t,bindGroups:r}=e;for(const i in r){const{uniformBuffers:s}=r[i];for(const u in s){const o=s[u];if(Object.keys(t[o]??{}).length===0)throw new Error(`[emitBindingsWgsl] Binding "${u}" is "uniform<${o}>", but no bit declares fields for a "${o}" struct.`)}}const a=[];for(const i in t){const s=t[i];a.push(`struct ${i} {`);for(const[u,o]of Object.entries(s))a.push(`  ${u}: ${o},`);a.push("}")}const n=Yr(e);for(const i in n){const{groupIndex:s,entries:u}=n[i];for(const o of u){const c=`@group(${s}) @binding(${o.binding})`;o.kind==="uniform"?a.push(`${c} var<uniform> ${o.name}: ${o.type};`):o.kind==="resource"?a.push(`${c} var ${o.name}: ${o.type};`):a.push(`${c} var<storage, read> ${o.name}: array<${o.type}>;`)}}return a.join(`
`)}const Xr={collectData(e){e.data.bindings=Kr(e.bits,e.template),e.data.structs=e.data.bindings.structs},injectCode(e){return{header:Jr(e.data.bindings)}}},Zr="{{fragmentWriteOutputs}}";function Qr(e,t){const r=["struct Outputs {"];for(const a in e)r.push(`  ${a}: ${e[a]},`);r.push("}","","struct FragmentOutput {");for(let a=0;a<t.length;a++)e[t[a]]&&r.push(`  @location(${a}) ${t[a]}: ${e[t[a]]},`);return r.push("}"),r.join(`
`)}const ea={collectData(e){e.templateString.includes(Zr)&&(e.data.outputs=gt(e.bits))},injectCode(e){const t=e.data.outputs;if(!t)return{};const r=e.outputLocations;return{header:Qr(t,r),fragmentDeclareOutputs:"var outputs: Outputs;",fragmentWriteOutputs:`return FragmentOutput(${r.filter(a=>t[a]).map(a=>`outputs.${a}`).join(", ")});`}}};function ta(e){return e.charAt(0).toUpperCase()+e.slice(1)}function ee(e,t){return`${e}${ta(t)}`}function ra(e){const t=qe(e);for(const r of t)if(!(r==="header"||r==="textureGetters"||r.startsWith("vertex")||r.startsWith("fragment"))){const a=ee("vertex",r),n=ee("fragment",r);O(`[compileShader] Template slot {{${r}}} is not prefixed with "vertex" or "fragment". Did you mean {{${a}}} or {{${n}}}?`)}}const aa={collectData(e){ra(e.templateString),e.data.headers=e.bits.map(t=>t.gpu?.header).filter(t=>!!t?.trim())},injectCode(e){return{header:e.data.headers.join(`

`)}}},na=new Set(["position","frontFacing","sampleIndex","sampleMask"]);function Re(e){return e==="i32"||e==="u32"||e.includes("<i32>")||e.includes("<u32>")}function sa(e,t,r){O(`[compileInterStageWgsl] Inter-stage variable "${e}" redefined with different type: "${r}" → "${t}". Keeping original.`)}function oa(e){const t=Object.create(null);for(const r of e)if(r.interStage)for(const[a,n]of Object.entries(r.interStage))na.has(a)||(a in t?t[a]!==n&&sa(a,n,t[a]):t[a]=n);return t}function ia(e){const t=[],r=Object.keys(e);t.push("struct VertexOutput {"),t.push("  @builtin(position) position: vec4<f32>,");let a=0;for(const n of r){const i=e[n],s=Re(i)?" @interpolate(flat)":"";t.push(`  @location(${a++})${s} ${n}: ${i},`)}t.push("}"),t.push(""),t.push("struct FragmentInput {"),t.push("  @builtin(position) position: vec4<f32>,"),t.push("  @builtin(front_facing) frontFacing: bool,"),a=0;for(const n of r){const i=e[n],s=Re(i)?" @interpolate(flat)":"";t.push(`  @location(${a++})${s} ${n}: ${i},`)}return t.push("}"),t.join(`
`)}const ua={collectData(e){e.data.interStage=oa(e.bits)},injectCode(e){return{header:ia(e.data.interStage)}}},ca={collectData(e){e.data.overrides=Jt(e.bits)},injectCode(e){return{header:Yt(e.data.overrides)}}},la=/\{\{(.*?)\}\}/g;function da(e){const t=new Set;for(const r of e)if(r)for(const a of r.matchAll(la))t.add(a[1]);return t}function pa(e,t){const r=qe(e),a=da(Object.values(t));for(const[n,i]of Object.entries(t))i&&/\S/.test(i)&&!r.has(n)&&!a.has(n)&&O(`[compileShader] Generated code for slot {{${n}}} but template doesn't have it. Slot names are prefixed with stage: vertex.input → {{vertexInput}}, fragment.end → {{fragmentEnd}}.`)}const fa={collectData(e){e.data.vertexSlots=Me(e.bits,"gpu","vertex"),e.data.fragmentSlots=Me(e.bits,"gpu","fragment")},injectCode(e){const t={};for(const[r,a]of Object.entries(e.data.vertexSlots))t[ee("vertex",r)]=a.join(`
`);for(const[r,a]of Object.entries(e.data.fragmentSlots))t[ee("fragment",r)]=a.join(`
`);return pa(e.templateString,t),t}};function ma(e,t){const r=Br(e),a=Dr(r),n=Object.create(null);for(const i of t)if(i.bindings){for(const[s,u]of Object.entries(i.bindings))if(u)for(const{name:o,spec:c}of Ue(u,s))o in n||(n[o]=bt(c))}for(const i of r.groups){const s=n[i.name];if(!s||s==="both")continue;const u=a[i.group]?.find(o=>o.binding===i.binding);u&&(u.visibility=s==="vertex"?Q.VERTEX:Q.FRAGMENT)}return a}const ga=`diagnostic(off, derivative_uniformity);
`;function pe(e){const{bits:t,template:r,extraPlugins:a,instanceLayout:n,outputLocations:i=ht}=e,s=[Nr,ca,Xr,kr,ua,ea,aa,fa],u=a?[...a,...s]:s,o={bits:Xt(t),template:r,templateString:r.gpu,data:{},instanceLayout:n,outputLocations:i},c=`${ga}${Zt(o,u)}`;return{vertex:{source:c,entryPoint:"mainVertex"},fragment:{source:c,entryPoint:"mainFragment"},structs:o.data.structs||{},gpuLayout:ma(c,o.bits),bits:o.bits}}function ha(e){return Je({name:"getMaterial",struct:"Material",fields:e,base:"i32(index)",load:t=>`textureLoad(uMaterialStorage, ${xt(t)}, 0)`})}const ba={injectCode(e){const t=e.data.structs?.Material;if(!t)return{};const r="var material = getMaterial(vMaterialIndex);";return{textureGetters:ha(t),vertexStoreAccess:r,fragmentStoreAccess:r}}};function xa(e,t){const r=`uMaterialTexture${t}, uMaterialSampler${t}`;return[`fn ${e}Direct(uv: vec2<f32>) -> vec4<f32> {`,`  return textureSampleGrad(${r}, uv, vec2<f32>(0.0), vec2<f32>(0.0));`,"}",`fn ${e}(uv: vec2<f32>) -> vec4<f32> {`,`  return textureSample(${r}, uv);`,"}"]}function $e(e){return{collectData(t){t.bits.some(r=>r.name.startsWith("materialBindings:"))||t.bits.unshift(Qt(t.bits,e))},injectCode(t){let r=0;const a=[];for(const n of t.bits)if(n.textures)for(const i of n.textures){const s=`sample${i[0].toUpperCase()}${i.slice(1)}`;a.push(...xa(s,r)),r++}return{textureGetters:a.join(`
`)}}}}const va=new Mt({}),Sa=new Cr({}),Le={direct:[Ie,$e("direct")],merged:[Ie,ba,$e("merged")]},ya=`


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
`,wa={name:"layout",overrideDefs:{HAS_UVS:{type:"u32",required:!0}},outputs:{color:"vec4<f32>"},interStage:{vNormal:"vec3<f32>",vUV:"vec2<f32>",vPosition:"vec3<f32>",vMaterialIndex:"u32"}},_a={bindGroups:[{name:"global",ubo:!0},"camera","batch"],gpu:ya},Ba=[[Q.VERTEX,"vertex"],[Q.FRAGMENT,"fragment"]];function Da(e,t,r,a,n){const{maxSamplersPerShaderStage:i,maxSampledTexturesPerShaderStage:s}=r;for(const[u,o]of Ba){let c=0,l=0,p=0,m=0;for(let S=0;S<e.length;S++){const D=e[S];if(D)for(const C of D)C.visibility&u&&(C.texture&&(c++,S===t&&p++),C.sampler&&(l++,S===t&&m++))}const d=l>i;if(!d&&c<=s)continue;const f=`${l} samplers`,h=`${i} (maxSamplersPerShaderStage)`,y=`${c} sampled textures`,x=`${s} (maxSampledTexturesPerShaderStage)`,[v,b,_]=d?[f,h,`Sampled textures: ${c} of ${x}`]:[y,x,`Samplers: ${l} of ${h}`],g=It(n);throw new Error(`[MaterialSystemGpu] ${a.material.constructor.name}'s shader binds ${v} in the ${o} stage, but this device allows ${b}. ${_}. The engine's globals take ${l-m} samplers and ${c-p} sampled textures, and the material's ${g.length} texture slots take ${m} samplers and ${p} sampled textures: ${g.join(", ")}. Turn off a feature group or remove a texture slot.`)}}var Ca=class{static extension={type:[W.WebGPUSystem],name:"material3d"};batcher=new Gr(this);_destroyed=!1;_renderer;_shaderCache=new Map;constructor(e){this._renderer=e}computeBatchKey(e,t){const r=e._passCache[t];return this._renderer.pipeline.getPipelineKey(e.geometry,r.shader.gpuProgram,r.state,r.topology,r.shader._overrides??Sa)}compilePassShader(e,t){const r=pe({bits:[q,ue,...e],template:t});return _e(r.bits,t),J.from({gpu:r})}compileIsolatedShader(e,t,r){return J.from({gpu:pe({bits:e,template:t}),groups:r})}compileShader(e,t,r,a,n,i="direct"){const s=[];let u="";(e.includeGlobal??!0)&&(s.push(q),u+=`${q.name}|`),(e.includeCamera??!0)&&(s.push(ue),u+=`${ue.name}|`),s.push(...e.bitsGpu),u+=e.keyGpu;const o=er(t.geometry.attributes.aPosition.format);Be(o),s.push(o),u+=`|${o.name}`,t._morph&&(t.geometry.hasMorphNormals?(s.push(Or),u+="|morphN"):(s.push(Lr),u+="|morph")),t.skeleton&&(Be(le),s.push(le),u+=`|${le.name}`),r.instanceStoreBuffer&&He(s)&&(u+=`|inst:${r.instanceStoreBuffer.layout.key}`),u+=`|${i}`;let c=this._shaderCache.get(u);if(!c){const l=pe({bits:s,template:e.template,extraPlugins:a,instanceLayout:r.instanceStoreBuffer?.layout,outputLocations:e.outputLocations});_e(l.bits,e.template),Da(l.gpuLayout,Ne(e.template).findIndex(p=>p.name==="batch"),this._renderer.gpu.device.limits,t,l.bits),c={shader:J.from({gpu:l,overrides:e.overrides}),layout:vt(l.bits)},this._shaderCache.set(u,c)}return n&&(St(c.layout,t.material),yt(c.layout,t.material)),c.shader}ensureMaterial(e,t,r){const a=e.material;this._renderer.renderPipes.view3d.materialStoreBuffer.register(a);const n=this.compileShader(this._materialDescriptor(e,r),e,t,Le.direct,!0),i=a._passBit&j.MATERIAL_PASS_MASK,s=a._passes[i],u=s&&s.state||a.state,o=s&&s.topology||a.topology||e.geometry.topology,c=e._passCache[i];return c?(c.shader=n,c.mergedShader=null,c.state=u,c.topology=o,c.lastGeometryUid=-1):e._passCache[i]=new wt(n,u,o),n}ensureMergedShader(e,t,r){const a=e._passCache[e.material._passBit&j.MATERIAL_PASS_MASK];if(a.mergedShader)return a.mergedShader;const n=this._materialDescriptor(e,r);return a.mergedShader=this.compileShader(n,e,t,Le.merged,!0,"merged"),a.mergedShader}_materialDescriptor(e,t){const r=e.geometry,a=e.material,n=a.fog?t._fogBit:null,i=t._toneMappingBit,s=!!r.attributes.aColor&&a.vertexColors,u=tr(a,i,!!n||s),o=a.getPrimaryDescriptor(t),c=[q,wa,u];r.attributes.aNormal&&c.push(pr),r.attributes.aUV&&c.push(rr(r.attributes.aUV.format)),a.doubleSided&&c.push(ar),a.flatShading&&c.push(nr);const l=a.textures.normal;l&&l!==_t&&r.attributes.aUV&&c.push(r.attributes.aTangent?sr:or),s&&c.push(ir);const p=e.material.lit;e.billboardMode!=="none"&&c.push(ur(e.billboardMode,p));const m=!!r.attributes.aTangent;for(let h=0;h<o.bitsGpu.length;h++){const y=o.bitsGpu[h];c.push(m?Bt(y):y)}a.alphaMode==="opaque"&&c.push(cr),n&&c.push(n),u!==lr&&i&&c.push(a._skipsToneCurve?Dt:i),p&&c.push(e.receiveShadow&&t._hasShadows?Ar[t.shadowFilter]:dr,Ct(i!==null));const d=t.passByBit[a._passBit&j.MATERIAL_PASS_MASK],f=Gt(c,d,!!o.template);return va.update({bitsGpu:c,template:o.template??_a,overrides:{HAS_UVS:r.attributes.aUV?1:0,...o.overrides},outputLocations:f,includeGlobal:!1})}destroy(){if(!this._destroyed){this._destroyed=!0;for(const{shader:e}of this._shaderCache.values())e.destroy();this._shaderCache=null}}};const Xe=new Float32Array(24),Na=4e3;function Ze(e,t,r,a,n){if(n.lastVisibilityDirtyId!==r._visibilityDirtyId){if(n.lastVisibilityDirtyId=r._visibilityDirtyId,n.direct||t.view.count<4e3){re(t,r,null,n);return}e.dispatch(n.indirectDrawData.drawCallsBuffer,t.gpuData.instanceBuffer.buffer,n.survivors.buffer,r.storeBuffer.buffer,a,Xe,t.commandList.count,t.view.count)}}function re(e,t,r,a){const n=e.gpuData.instanceBuffer.data,i=a.survivors,s=a.indirectDrawData,u=i.data,o=s.drawCalls,c=e.commandList.count,l=e.view.count,p=t.storeBuffer.visible;r!==null&&t._ensureSpheres();const m=t.storeBuffer.boundingSpheres,d=r!==null,f=d?te(r,t.storeBuffer.data):Xe,h=f[0],y=f[1],x=f[2],v=f[3],b=f[4],_=f[5],g=f[6],S=f[7],D=f[8],C=f[9],P=f[10],G=f[11],w=f[12],M=f[13],B=f[14],U=f[15],z=f[16],I=f[17],T=f[18],R=f[19],ae=f[20],Qe=f[21],et=f[22],tt=f[23];let ve=!1;for(let $=0;$<c;$++){const ne=o[$*5+4],rt=$+1<c?o[($+1)*5+4]:l;let Se=ne;for(let se=ne;se<rt;se++){const oe=n[se];if(p[oe]!==0){if(d){const H=oe*4,L=m[H+3];if(L>=0){const E=m[H],A=m[H+1],V=m[H+2];if(h*E+y*A+x*V+v<-L||b*E+_*A+g*V+S<-L||D*E+C*A+P*V+G<-L||w*E+M*A+B*V+U<-L||z*E+I*A+T*V+R<-L||ae*E+Qe*A+et*V+tt<-L)continue}}u[Se++]=oe}}const ye=Se-ne;o[$*5+1]!==ye&&(o[$*5+1]=ye,ve=!0)}ve&&a.countsDirtyId++,i.upload(l),a.direct||s.upload(c)}function Ga(e){const{pipe:t,bit:r,bindsMaterial:a,session:n,useBundles:i,sortBatch:s}=e;if(!i)return;const{view3d:u}=n,o=t.renderer.material3d.batcher,c=ze(e.camera??u.camera).position;for(const l of u._meshBatches){if(!l.renderData._worldVisible)continue;const p=l.drawLists[r];if(!p)continue;const m=p.view;if(m.count===0||!(s?p.isDrawStale():p.nextBuild(u._updateTick)))continue;s&&s(m,l,c);const d=p.gpuData;d.instanceBuffer.populateIds(m),o.render({renderables:m,globalBindGroup:n.globalBindGroup,commandList:p.commandList,drawData:p.drawData,passBit:r,bindsMaterial:a,batch:l,view3d:u}),d.instanceBuffer.upload(m.count)}}function Ma(e){const{pipe:t,bit:r,cullResults:a,session:n,useBundles:i}=e;if(!i)return;const{view3d:s}=n,u=be("forward"),o=t.geometryDataStoreBuffer.buffer,c=(e.camera??s.camera).cullFrustum.planesData;a.removeDetached(s);for(const l of s._meshBatches){if(!l.renderData._worldVisible)continue;const p=l.drawLists[r];if(!p||p.view.count===0)continue;p.claimDrawBuilt();const m=p.view.count<=u,d=a.ensure(l);d.sync(p,m);const f=xe(l.cull,!m);if(f==="off"){Ze(t.renderer.compute3d,p,l,o,d);continue}if(f==="cpu"){re(p,l,c,d);continue}const h=te(c,l.storeBuffer.data);t.renderer.compute3d.dispatch(d.indirectDrawData.drawCallsBuffer,p.gpuData.instanceBuffer.buffer,d.survivors.buffer,l.storeBuffer.buffer,o,h,p.commandList.count,p.view.count)}}function Ia(e){const{pipe:t,bit:r,bindsMaterial:a,cullResults:n,session:i,useBundles:s,sortBatch:u}=e,{view3d:o}=i,c=t.renderer.encoder,l=t.renderer.material3d.batcher,p=t.renderer.gc.now,m=e.camera??o.camera,d=ze(m),f=m.cullFrustum.planesData,h=t.geometryDataStoreBuffer.buffer,y=be("forward");s||n.removeDetached(o);let x=0;for(const v of o._meshBatches){if(!v.renderData._worldVisible)continue;const b=v.drawLists[r];if(!b)continue;const _=b.view;if(_.count===0){if(b.claimDrawEmpty(),s){const S=n.get(v);S&&(S.bundle=null,S.claimBundleRecorded(b,d.bindGroup))}continue}const g=n.ensure(v);if(s&&g.direct&&v.cull!=="off"){g.bundle=null,K(i,v,g),b.claimDrawBuilt(),b.commandList.replayDirect(c,g.indirectDrawData,d);continue}if(s){const S=g.bundle;(!S||g.isBundleStale(b,d.bindGroup)||!c.isBundleValid(S))&&(K(i,v,g),c.beginBundle(`view3d pass ${r} batch ${v.uid}`),g.direct?b.commandList.replayDirect(c,g.indirectDrawData,d):b.commandList.replay(c,t.renderer.buffer,g.indirectDrawData,d,0,b.commandList.bodyCount),g.bundle=c.endBundle(),g.claimBundleRecorded(b,d.bindGroup))}else{let S=!0;u?(u(_,v,d.position),S=b.isDrawStale()||b.isOrderStale()):b.nextBuild(o._updateTick,!0);const D=b.gpuData;S&&(D.instanceBuffer.populateIds(_),l.render({renderables:_,globalBindGroup:i.globalBindGroup,commandList:b.commandList,drawData:b.drawData,passBit:r,bindsMaterial:a,batch:v,view3d:o}),D.instanceBuffer.upload(_.count));const C=_.count<=y;g.sync(b,C),K(i,v,g);const P=xe(v.cull,!u&&!C);if(P==="gpu"){const G=te(f,v.storeBuffer.data);t.renderer.compute3d.dispatch(g.indirectDrawData.drawCallsBuffer,D.instanceBuffer.buffer,g.survivors.buffer,v.storeBuffer.buffer,h,G,b.commandList.count,b.view.count)}else re(b,v,P==="cpu"?f:null,g)}if(b.claimDrawBuilt(),s){const S=b.commandList;S.touch(p),Z[x++]=g.bundle,!g.direct&&S.count>S.bodyCount&&(K(i,v,g),S.replay(c,t.renderer.buffer,g.indirectDrawData,d,S.bodyCount))}else g.direct?b.commandList.replayDirect(c,g.indirectDrawData,d):b.commandList.replay(c,t.renderer.buffer,g.indirectDrawData,d)}x>0&&(c.executeBundle(Z),Z.length=0)}function K(e,t,r){e.globalBindGroup.setResource(t.storeBuffer.bufferResource,"uRenderableStorage"),e.globalBindGroup.setResource(r.survivors.bufferResource,"uRenderableInstanceStorage"),e.globalBindGroup.setResource(t.instanceStoreBuffer?.bufferResource??N,"uInstanceStorage")}const Z=[];Et.register({clear:()=>{Z.length=0}});const Pa={name:"shadowGlobal",structs:{Renderable:We,RenderableInstance:ke,BoneMatrix:he,GeometryData:ge},bindings:{global:{uRenderableStorage:{type:"storage<Renderable>",visibility:"vertex"},uRenderableInstanceStorage:{type:"storage<RenderableInstance>",visibility:"vertex"},uBonePitStorage:{type:"storage<BoneMatrix>",visibility:"vertex"},uMorphStorage:{type:"storage<f32>",visibility:"vertex"},uGeometryStorage:{type:"storage<GeometryData>",visibility:"vertex"}}}},Ta={bindGroups:[{name:"global",ubo:!0},"camera","local"],gpu:`

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
`};var Ra=class extends fr{_bundleRun=[];constructor(e){const t=Pt();t.depthTest=!0,t.depthMask=!0,t.culling=!0,t.clockwiseFrontFace=!1,t.blend=!1,super({renderer:e.renderer,name:"shadow",description:"Renders shadow-casting scene geometry into each light shadow map.",bit:j.SHADOW,shadowMapHandle:e.shadowMapHandle,descriptor:{shaderDescriptor:{bitsGpu:[Pa],template:Ta,includeGlobal:!1},state:t}})}_applyZRangeFix=!0;prepare(e){const{view3d:t,lights:r}=e;this._bindShadowSource(t,this.renderTarget.depthStencilTexture);const a=this.pipe.renderer.material3d.batcher,n=this.pipe.renderer.compute3d,i=this.pipe.geometryDataStoreBuffer.buffer;for(const s of t._meshBatches){if(!s.renderData._worldVisible)continue;const u=s.drawLists[this.bit];if(!u)continue;const o=u.gpuData,c=u.view;if(c.count===0){u.claimDrawEmpty();continue}u.nextBuild(t._updateTick)&&(u.claimDrawBuilt(),o.instanceBuffer.populateIds(c),a.render({renderables:c,globalBindGroup:e.globalBindGroup,commandList:u.commandList,drawData:u.drawData,passBit:this.bit,bindsMaterial:!1,batch:s,view3d:t}),o.instanceBuffer.upload(c.count))}for(let s=0;s<r.length;s++){const u=r[s],o=u._gpuShadowData;if(!o||(o.cullResults?.removeDetached(t),!De(u)))continue;const c=Ce(u),l=o.cascades,p=o.cullResults??=new Tt,m=be("shadow");for(let d=0;d<c;d++){const f=l?.[d];if(!f||!f.needsRender)continue;const h=f.cameraData.frustum;for(const y of t._meshBatches){if(!y.renderData._worldVisible)continue;const x=y.drawLists[this.bit];if(!x||x.view.count===0)continue;if(d===0)for(let g=c;g<4;g++)p.remove(y,g);const v=x.view.count<=m,b=p.ensure(y,d);b.sync(x,v);const _=xe(y.cull,!v);if(_==="off")Ze(n,x,y,i,b);else if(_==="cpu")re(x,y,h.planesData,b);else{const g=te(h.planesData,y.storeBuffer.data);n.dispatch(b.indirectDrawData.drawCallsBuffer,x.gpuData.instanceBuffer.buffer,b.survivors.buffer,y.storeBuffer.buffer,i,g,x.commandList.count,x.view.count)}}}}}render(e){const{view3d:t,lights:r}=e,a=this.pipe.renderer,n=a.encoder,i=a.pipeline;i.setColorMask(0);for(const s of r){if(!De(s))continue;const u=this.getShadowGPUData(s).cullResults;if(!u)continue;const o=Ce(s);for(let c=0;c<o;c++){const l=this._cascadeSlot(s,c);if(!l.needsRender)continue;const p=s._shadowDataIndex+c,m=l.cameraData.bindGroup;a.renderTarget.bind({target:this.renderTarget,clear:!0,layer:p}),a.ubo.updateUniformGroup(l.cameraData.uniformGroup),l.cameraData.uniformGroup.buffer.autoGarbageCollect=!1;for(const d of t._meshBatches){if(!d.renderData._worldVisible)continue;const f=d.drawLists[this.bit];if(!f||f.view.count===0)continue;const h=u.get(d,c);if(!h)continue;if(h.direct&&d.cull!=="off"){h.bundle=null,e.globalBindGroup.setResource(d.storeBuffer.bufferResource,"uRenderableStorage"),e.globalBindGroup.setResource(h.survivors.bufferResource,"uRenderableInstanceStorage"),f.commandList.replayDirect(n,h.indirectDrawData,l.cameraData);continue}const y=h.bundle;if(!y||h.isBundleStale(f,m)||!n.isBundleValid(y)){const{globalBindGroup:v}=e;v.setResource(d.storeBuffer.bufferResource,"uRenderableStorage"),v.setResource(h.survivors.bufferResource,"uRenderableInstanceStorage"),n.beginBundle(`shadow cascade ${c} batch ${d.uid}`),h.direct?f.commandList.replayDirect(n,h.indirectDrawData,l.cameraData):f.commandList.replay(n,a.buffer,h.indirectDrawData,l.cameraData,0,f.commandList.bodyCount),h.bundle=n.endBundle(),h.claimBundleRecorded(f,m)}const x=f.commandList;x.touch(a.gc.now),this._bundleRun.push(h.bundle),!h.direct&&x.count>x.bodyCount&&(e.globalBindGroup.setResource(d.storeBuffer.bufferResource,"uRenderableStorage"),e.globalBindGroup.setResource(h.survivors.bufferResource,"uRenderableInstanceStorage"),x.replay(n,a.buffer,h.indirectDrawData,l.cameraData,x.bodyCount))}this._bundleRun.length>0&&(n.executeBundle(this._bundleRun),this._bundleRun.length=0)}this._completeShadowUpdate(s)}i.setColorMask(15),e.activeTarget=null}};const $a=13421772,Oe=new Vt,Y=new je,F={x:0,y:0};var La=class{static extension={type:[W.WebGPUPipes],name:"view3d"};renderer;_brdfLutTexture;_iblEnvironmentMap=new Map;_onEnvironmentDestroy=e=>{this._iblEnvironmentMap.get(e)?.source.unload(),this._iblEnvironmentMap.delete(e)};_viewport=new je;_sortForwardByDistance=(e,t,r)=>{mr(e,t.storeBuffer.data,r)};_forwardOptions={pipe:this,bit:0,bindsMaterial:!1,cullResults:null,camera:null,session:null,useBundles:!1,sortBatch:void 0};materialStoreBuffer;_morphStoreBuffer=new gr;geometryDataStoreBuffer=new hr;atlasPool=br.from({rebaseIndices:!1});_managedViews;_destroyed=!1;_colorOutputDraw=null;constructor(e){this.renderer=e,this._managedViews=new xr(this.renderer),this.renderer.runners.contextChange.add(this)}contextChange(e){if(!e.device.features.has("indirect-first-instance"))throw new Error("@pixi/3d requires the WebGPU 'indirect-first-instance' feature (used by the batched indirect draw path).");this.materialStoreBuffer??=new vr({alignment:this.renderer.limits.minUniformBufferOffsetAlignment,rendererType:this.renderer.type})}createShadowPass(e){return new Ra({renderer:this.renderer,shadowMapHandle:e.shadowMapHandle})}renderForward(e,t){Ia(this._fillForwardOptions(e,t,e.sort==="distance")),this._releaseForwardOptions()}prepareForward(e,t){if(!Pe(e))return;const r=this._fillForwardOptions(e,t,!1);Ga(r),Ma(r),this._releaseForwardOptions()}_fillForwardOptions(e,t,r){const a=this._forwardOptions;return a.useBundles=Pe(e),a.bit=e.bit,a.bindsMaterial=e.bindsMaterial,a.cullResults=e.cullResults,a.camera=e.camera,a.session=t,a.sortBatch=r?this._sortForwardByDistance:void 0,a}_releaseForwardOptions(){this._forwardOptions.cullResults=null,this._forwardOptions.camera=null,this._forwardOptions.session=null}renderGeometry(e,t,r){this.renderer.encoder.draw({geometry:e,shader:t,state:r})}setViewport(e){this.renderer.encoder.setViewport(e)}_depthClearShader=null;_depthClearState=null;clearDepth(e){this._depthClearShader||this._buildDepthClear();const{encoder:t,pipeline:r}=this.renderer;r.setColorMask(0),t.draw({geometry:Rt(),shader:this._depthClearShader,state:this._depthClearState}),r.setColorMask(15)}_buildDepthClear(){const e=new At;e.depthTest=!1,e.depthMask=!0,e.culling=!1,e.blend=!1,this._depthClearState=e,this._depthClearShader=J.from({gpu:{vertex:{entryPoint:"mainVertex",source:`
            struct VertexOutput { @builtin(position) position: vec4<f32> };

            @vertex
            fn mainVertex(@location(0) aPosition: vec2<f32>) -> VertexOutput {
              var output: VertexOutput;
              output.position = vec4<f32>(aPosition, 1.0, 1.0);
              return output;
            }
          `},fragment:{entryPoint:"mainFragment",source:`
            @fragment
            fn mainFragment() -> @location(0) vec4<f32> {
              return vec4<f32>(0.0, 0.0, 0.0, 1.0);
            }
          `}}})}copyColor(e,t,r){const{target:a,viewport:n}=e;if(!a.colorTexture)return;this.renderer.renderTarget.finishRenderPass();const i=t.frame,s=t.source.resolution;F.x=Math.round(i.x*s),F.y=Math.round(i.y*s),this.renderer.renderTarget.copyToTexture(a,t,Y.copyFrom(n),Y,F),r.activeTarget=null}outputColor(e,t,r,a){e.target.colorTexture&&(this.renderer.renderTarget.finishRenderPass(),(this._colorOutputDraw??=new Sr(this.renderer)).draw(this,e,t,a),r.activeTarget=null)}generateMips(e,t){const r=t.view3d._graph.getTexture(e,t).source;this.renderer.renderTarget.finishRenderPass(),t.activeTarget=null,this.renderer.mipChain3d.generate(r)}resolveColor(){}copyDepth(e,t,r){const{target:a,viewport:n}=e;a.depthStencilTexture&&(this.renderer.renderTarget.finishRenderPass(),F.x=0,F.y=0,this.renderer.renderTarget.copyDepthTexture(a,t,Y.copyFrom(n),Y,F),r.activeTarget=null)}validateRenderable(){return!1}addRenderable(e,t){this.renderer.renderPipes.batch.break(t),t.add(e)}updateRenderable(){}execute(e){if(!e.isRenderable)return;const t=me(e,this.renderer),r=this.renderer.renderTarget.renderTarget;e._ensureInitialized(this.renderer,t,r.colorTexture.source.resolution),this._managedViews.track(e);const a=e.environment;a&&(this._brdfLutTexture||=yr({renderer:this.renderer}),t.globalBindGroup.setResource(this._brdfLutTexture.source,"uBrdfLutTexture"));const n=this._prefilteredEnvironment(a);t.globalBindGroup.getResource("uEnvironmentTexture")!==n&&(t.globalBindGroup.setResource(n,"uEnvironmentTexture"),e._invalidateBundleCaches());const i=e.lights;if(e._meshSlots.count===0&&e._meshBatches.length===1)return;const s={view3d:e,lights:i,defaultTarget:r,defaultFrontFaceInverted:!1,activeTarget:null,needsDepthClear:!0,viewport:this._viewport,activeViewport:this._viewport,globalBindGroup:t.globalBindGroup,renderer:this.renderer};wr(e,this,s)&&(t.globalBindGroup.setResource(this.materialStoreBuffer.texture.source,"uMaterialStorage"),t.globalBindGroup.setResource(e._bonePit.bufferResource,"uBonePitStorage"),t.globalBindGroup.setResource(this._morphStoreBuffer.bufferResource,"uMorphStorage"),t.globalBindGroup.setResource(this.geometryDataStoreBuffer.bufferResource,"uGeometryStorage"),this.materialStoreBuffer.update(),this.geometryDataStoreBuffer.update(),this.atlasPool.update(),_r(this.atlasPool,this.materialStoreBuffer,t,this._morphStoreBuffer,this.geometryDataStoreBuffer)&&e._invalidateDrawCaches(),this.prepareView(s),e._graph.run(s))}destroy(){if(!this._destroyed){this._destroyed=!0,this._managedViews.destroy(),this._colorOutputDraw?.destroy(),this._colorOutputDraw=null,this._brdfLutTexture?.destroy(!0),this._brdfLutTexture=void 0;for(const[e,t]of this._iblEnvironmentMap)e.off("destroy",this._onEnvironmentDestroy),t.destroy(!0);this._iblEnvironmentMap=null,this.renderer.runners.contextChange.remove(this),this.materialStoreBuffer.destroy(),this.materialStoreBuffer=null,this._morphStoreBuffer.destroy(),this.geometryDataStoreBuffer.destroy(),this._depthClearShader?.destroy(),this._depthClearShader=null,this._depthClearState=null}}_prefilteredEnvironment(e){if(!(e instanceof Fe)||e.source.destroyed)return Ae.source;let t=this._iblEnvironmentMap.get(e.source);return t||(t=$t({renderer:this.renderer,sourceTexture:e}),this._iblEnvironmentMap.set(e.source,t),e.source.once("destroy",this._onEnvironmentDestroy)),t.source}prepareView(e){const{view3d:t,lights:r}=e;this.renderer.lighting3d.update(t,r),this._updateGlobalUniforms(t)}_updateGlobalUniforms(e){const{fog:t}=e,r=me(e,this.renderer).globalUniformGroup,a=r.uniforms;if(a.uTime=performance.now()/1e3,a.uExposure=e.exposure,a.uDisplayExposure=Math.pow(e.exposure,1/2.2),t){Oe.setValue(t.color??$a),Lt(a.uFogColor,0,Oe,e.exposure);const n=a.uFogParams;n[0]=t.near||0,n[1]=t.far||99999999,n[2]=t.density||0}r.update(),this.renderer.ubo.updateUniformGroup(r)}};Ft.add(Pr,Tr,$r,Ca,La);export{Pr as ComputeSystemGpu,Na as GPU_VISIBILITY_MIN,Tr as LightingSystemGpu,Ca as MaterialSystemGpu,$r as MipChainSystemGpu,Ra as ShadowRenderPassGpu,La as View3DPipeGpu,Yr as buildWgslBindingMap,Kr as collectBindings,pe as compileWgslSource,Ma as computeForwardBatchesGpu,$e as createTexturesPluginGpu,Jr as emitBindingsWgsl,Je as generateWgslStructAccessor,me as getGlobalGpuData,q as globalBitGpu,Nr as instanceAccessPlugin,ba as materialTextureAccessPlugin,Lr as morphTargetBitGpu,Or as morphTargetNormalBitGpu,ee as prefixSlotName,Ga as prepareForwardBatchesGpu,re as produceCpuCompaction,Ze as produceVisibilityCompaction,Ia as renderForwardBatchesGpu,Ar as shadowBitsGpu,Pa as shadowGlobalBitGpu,le as skinningBitGpu,kr as wgslAttributesPlugin,Xr as wgslBindingsPlugin,ea as wgslFragmentOutputsPlugin,aa as wgslHeadersPlugin,ua as wgslInterStagePlugin,ca as wgslOverridesPlugin,fa as wgslStageSlotsPlugin};
