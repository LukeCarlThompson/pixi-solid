import{aL as Ee,aM as Fe,aN as $,aO as Y,a5 as T,aP as X,aQ as Ge,aR as Z,f as F,a as M,aa as G,aS as Le,aH as xe,aT as Oe,aU as ze,aV as Ue,a8 as ke,aW as $e,g as ye,aX as Xe,aY as K,aZ as Q,a_ as qe,a$ as R,aF as J,b0 as He,b1 as je,b2 as We,ay as Ye,aB as Ze,b3 as we,b4 as Ke,ag as Qe,ah as Je,b5 as et,b6 as ee,b7 as tt,b8 as rt,aC as st}from"./view-3d.CbSxVUmV.js";import{X as at,g as A,W as S,w as nt,ab as ot,H,h as ve,o as Se,ac as q,R as it,N as Ce,f as te,u as lt,a3 as ct,G as ut}from"./pixi-canvas.DUqT5F9V.js";import{B as Be}from"./BufferResource.BALqOo0E.js";import{i as dt}from"./EventSystem.BP1QZt1K.js";import{i as ft}from"./isSafari.BRMAhrsc.js";import{R as ht,c as De}from"./RenderTexture.CW9ltFoO.js";import{G as mt}from"./GCManagedHash.C53wrcNP.js";const _t=(e,t,r,s,a)=>{const{center:n,radius:o}=e.boundsSphere;if(t[a]=n.x,t[a+1]=n.y,t[a+2]=n.z,t[a+3]=e.dynamic?-1:o+e._morphBoundsExpansion,e.morphTargetCount>0){const i=e._morphDeltaBase>=0;r[a+4]=i?e._morphDeltaBase:0,r[a+5]=i?e.morphTargetCount:0,r[a+6]=i&&e._geometryAtlasAllocation?.baseVertex||0}};var Br=class extends Ee{constructor(e=100){super({stride:8,indexKey:"_geometryDataIndex",copier:_t,initialSize:e})}set(e){const t=e._geometryDataStore;return t!==this&&(t?.remove(e),e._geometryDataStore=this),super.set(e)}},bt=class extends Be{constructor(e){super(e),this.buffer.off("change",this.onBufferChange,this)}};const pt=1024,U=16;function gt(e,t){let r=e,s=t;for(;s;)[r,s]=[s,r%s];return e/r*t}var Dr=class{data;_retiredTextures=[];texture;_buffer=null;_retiredBuffers=[];_alignment=0;_texelsPerUnit=0;_end=0;_freePlaces=new Map;_dirtyQueue=[];_dirtyCount=0;_ranges=new Uint32Array(64);bufferVersion=0;_bufferCallBytes=0;constructor(e){const{alignment:t,rendererType:r}=e;if(!(t>0))throw new Error(`MaterialDataStoreBuffer: renderer.limits.minUniformBufferOffsetAlignment is ${t}; the limits system fills it in after the renderer has a context`);this._alignment=gt(t,U),this._texelsPerUnit=this._alignment/U,this._bufferCallBytes=r===at.WEBGPU?Fe:1/0,this.data=new Float32Array($(pt*4)),this.texture=new A({source:Y(this.data)})}enqueueDirty(e){!this.data||e._storeQueued||(e._storeQueued=!0,this._dirtyQueue[this._dirtyCount++]=e)}register(e){const t=e._uploadQueue;t===this&&e._materialIndex!==-1||(t&&t!==this&&t.remove(e),e._uploadQueue=this,e._storeQueued=!1,this._allocate(e),this.enqueueDirty(e))}remove(e){const t=e._materialIndex;if(t<0||(e._materialIndex=-1,!this.data))return;const r=this._units(e);let s=this._freePlaces.get(r);s||this._freePlaces.set(r,s=[]),s.push(t)}uniformResource(e){const t=this._buffer??=new T({data:this.data,usage:S.UNIFORM|S.COPY_DST,label:"MaterialStore"}),r=e._materialIndex*U;let s=e._uniformResource;return s&&s.buffer===t&&s.offset===r||(s?.destroy(!1),s=e._uniformResource=new bt({buffer:t,offset:r,size:this._units(e)*this._alignment})),s}update(){const e=this._dirtyQueue,t=this._dirtyCount;if(t===0)return;this._dirtyCount=0;const r=this.data;let s=0,a=0,n=1/0,o=-1/0;for(let f=0;f<t;f++){const h=e[f];if(e[f]=null,h._uploadQueue!==this)continue;h._storeQueued=!1;const p=h.data._f32,_=h._materialIndex*4,m=_+p.length;if(r.set(p,_),s*2+2>this._ranges.length){const b=new Uint32Array(this._ranges.length*2);b.set(this._ranges),this._ranges=b}this._ranges[s*2]=_,this._ranges[s*2+1]=m,s++,a+=m-_,_<n&&(n=_),m>o&&(o=m)}if(s===0)return;const i=this._ranges,l=(o-n)*4,c=a*4,d=this.texture.source;if(s*16384+c<l)for(let f=0;f<s;f++)X(d,i[f*2],i[f*2+1]);else X(d,n,o);const u=this._buffer;if(u)if(l>=Ge&&s*this._bufferCallBytes+c<l)for(let f=0;f<s;f++){const h=i[f*2];u.update((i[f*2+1]-h)*4,h*4)}else u.update(l,n*4)}destroy(){if(this.data){this._buffer?.destroy();for(let e=0;e<this._retiredBuffers.length;e++)this._retiredBuffers[e].destroy();for(let e=0;e<this._retiredTextures.length;e++)this._retiredTextures[e].destroy(!0);this.texture.destroy(!0),this.data=null,this._buffer=null,this._retiredBuffers=null,this._retiredTextures=null,this.texture=null,this._freePlaces=null,this._dirtyQueue=null,this._dirtyCount=0,this._ranges=null}}_units(e){return Math.ceil(e.data._f32.byteLength/this._alignment)}_allocate(e){if(e._materialIndex>=0)return;const t=this._units(e);let r=this._freePlaces.get(t)?.pop();if(r===void 0){const s=(this._end+t)*this._alignment;s>this.data.byteLength&&this._expand(s/4),r=this._end*this._texelsPerUnit,this._end+=t}e._materialIndex=r}_expand(e){let t=this.data.length*2;t<e&&(t=e),t=$(t);const r=new Float32Array(t);r.set(this.data),this.data=r,this._retiredTextures.push(this.texture),this.texture=new A({source:Y(this.data)}),this._buffer&&(this._retiredBuffers.push(this._buffer),this._buffer=null),this.bufferVersion++}};const xt=4;var Vr=class{data;_buffer=null;_bufferResource=null;bufferVersion=0;_deltaCursor=0;_deltaCapacity=0;_weightCursor=0;_freeSlots=new Map;_freeDeltaBlocks=new Map;_minDirty=1/0;_maxDirty=-1/0;_retiredBuffers=[];_texture=null;_textureSource=null;constructor(e={}){this._deltaCapacity=e.deltaCapacity??4096;const t=se(this._deltaCapacity,e.weightCapacity??1024);this.data=new Float32Array(this._deltaCapacity+t)}get buffer(){return this._buffer??=new T({data:this.data,usage:S.STORAGE|S.COPY_DST|S.COPY_SRC,label:"MorphStoreBuffer",shrinkToFit:!1})}get bufferResource(){return this._bufferResource??=new Be({buffer:this.buffer})}get texture(){return this._texture||this._initTexture()}uploadDeltas(e){const t=e._morphStore;if(t===this)return;if(t){t.freeDeltas(e),nt(`MorphStoreBuffer: geometry #${e.uid} was packed by another renderer and draws unmorphed here`);return}const r=e._morphTargets;if(!r||r.length===0)return;const s=e.hasMorphNormals,a=s?8:xt,n=r.length,o=r[0].positions.length/3,i=o*n*a,l=this._freeDeltaBlocks.get(i);let c;l&&l.length>0?c=l.pop():(c=this._deltaCursor,c+i>this._deltaCapacity&&this._growArena(c+i),this._deltaCursor+=i);const d=new Float64Array(n),u=this.data;for(let h=0;h<o;h++){const p=h*3;for(let _=0;_<n;_++){const m=c+(h*n+_)*a,b=r[_].positions,g=b[p],w=b[p+1],x=b[p+2];u[m]=g,u[m+1]=w,u[m+2]=x,u[m+3]=0;const v=g*g+w*w+x*x;if(v>d[_]&&(d[_]=v),s){const y=r[_].normals;u[m+4]=y[p],u[m+5]=y[p+1],u[m+6]=y[p+2],u[m+7]=0}}}let f=0;for(let h=0;h<n;h++)f+=Math.sqrt(d[h]);e._morphBoundsExpansion=f,e._morphDeltaBase=c,e._morphDeltaFloats=i,e._morphStore=this,e._morphTargets=null,this._markDirty(c,c+i-1)}freeDeltas(e){const t=e._morphDeltaBase;if(t<0)return;const r=e._morphDeltaFloats;e._morphDeltaBase=-1,e._morphDeltaFloats=0,e._morphStore=null,this.data&&re(this._freeDeltaBlocks,r,t)}sync(e){for(let r=0;r<e.length;r++)this.uploadDeltas(e[r].geometry);const t=this._deltaCapacity;for(let r=0;r<e.length;r++){const s=e[r],a=s._morph;a._store!==this&&(a._store?.freeSlot(a),this.allocSlot(a));const n=t+a._slot;a._weightIndex!==n&&(a._weightIndex=n,s._markStoreDirty()),this.writeWeights(a)}this.update()}allocSlot(e){let t=1;for(;t<e.weights.length;)t<<=1;const r=this._freeSlots.get(t);let s;r&&r.length>0?s=r.pop():(s=this._weightCursor,this._deltaCapacity+s+t>this.data.length&&this._growWeights(s+t),this._weightCursor+=t),e._slot=s,e._slotSize=t,e._store=this}freeSlot(e){const t=e._slot;if(t<0)return;const r=e._slotSize;e._slot=-1,e._slotSize=0,e._store=null,this.data&&re(this._freeSlots,r,t)}writeWeights(e){const t=e.weights,r=this.data,s=this._deltaCapacity+e._slot,a=Math.min(t.length,e._slotSize);let n=!1;for(let o=0;o<a;o++){const i=t[o];r[s+o]!==i&&(r[s+o]=i,n=!0)}n&&this._markDirty(s,s+a-1)}update(){this._minDirty>this._maxDirty||(this._buffer?.update((this._maxDirty-this._minDirty+1)*4,this._minDirty*4),this._textureSource&&X(this._textureSource,this._minDirty,this._maxDirty+1),this._minDirty=1/0,this._maxDirty=-1/0)}_freeRetired(){for(let e=0;e<this._retiredBuffers.length;e++)this._retiredBuffers[e].destroy();this._retiredBuffers.length=0}destroy(){this.data&&(this._bufferResource?.destroy(!1),this._buffer?.destroy(),this._freeRetired(),this._texture?.destroy(!0),this._texture=null,this._textureSource=null,this.data=null,this._buffer=null,this._bufferResource=null)}_markDirty(e,t){e<this._minDirty&&(this._minDirty=e),t>this._maxDirty&&(this._maxDirty=t)}_growArena(e){let t=this._deltaCapacity;for(;t<e;)t*=2;this._reallocate(t,this.data.length-this._deltaCapacity)}_growWeights(e){let t=this.data.length-this._deltaCapacity;for(;t<e;)t*=2;this._reallocate(this._deltaCapacity,t)}_reallocate(e,t){t=se(e,t);const r=new Float32Array(e+t);if(r.set(this.data.subarray(0,this._deltaCursor),0),r.set(this.data.subarray(this._deltaCapacity,this._deltaCapacity+this._weightCursor),e),this.data=r,this._deltaCapacity=e,this._buffer&&(this._retiredBuffers.push(this._buffer),this._buffer=null,this._bufferResource=null),this.bufferVersion++,this._textureSource){const{width:s,height:a}=Z(this.data.length);this._textureSource.resource=this.data,(this._textureSource.width!==s||this._textureSource.height!==a)&&this._textureSource.resize(s,a),this._textureSource.update()}}_initTexture(){const{width:e,height:t}=Z(this.data.length);return this._textureSource=new ot({resource:this.data,width:e,height:t,format:"rgba32float",scaleMode:"nearest",alphaMode:"no-premultiply-alpha"}),this._texture=new A({source:this._textureSource}),this._texture}};function re(e,t,r){let s=e.get(t);s||(s=[],e.set(t,s)),s.push(r)}function se(e,t){const r=e+t;return t+($(r)-r)}function Tr(e,t){return e==="gpu"&&!t?"cpu":e}const yt={},wt={forward:5e4,shadow:2e4};let ae;function Mr(e){const t=yt[e];return t!==void 0?t:(ae??=dt.apple.device||ft(),ae?wt[e]:0)}const I=new Float32Array(24);function Ar(e,t){const r=t[0],s=t[1],a=t[2],n=t[4],o=t[5],i=t[6],l=t[8],c=t[9],d=t[10],u=t[12],f=t[13],h=t[14];if(r===1&&o===1&&d===1&&s===0&&a===0&&n===0&&i===0&&l===0&&c===0&&u===0&&f===0&&h===0)return e;for(let p=0;p<6;p++){const _=p*4,m=e[_],b=e[_+1],g=e[_+2],w=r*m+s*b+a*g,x=n*m+o*b+i*g,v=l*m+c*b+d*g,y=1/Math.sqrt(w*w+x*x+v*v);I[_]=w*y,I[_+1]=x*y,I[_+2]=v*y,I[_+3]=(u*m+f*b+h*g+e[_+3])*y}return I}function Ir(e,t,r,s,a){let n=!1;return r.lastAtlasBufferVersion!==e.bufferVersion&&(r.lastAtlasBufferVersion=e.bufferVersion,n=!0),r.lastMaterialStoreBufferVersion!==t.bufferVersion&&(r.lastMaterialStoreBufferVersion=t.bufferVersion,n=!0),r.lastMorphStoreBufferVersion!==s.bufferVersion&&(r.lastMorphStoreBufferVersion=s.bufferVersion,n=!0),a&&r.lastGeometryStoreBufferVersion!==a.bufferVersion&&(r.lastGeometryStoreBufferVersion=a.bufferVersion,n=!0),n}const Nr=.1,ne=new M,Ve=new M,D=new Float64Array(4);function vt(e,t,r,s,a){a.length=r;for(let n=1;n<=r;n++){const o=n/r,i=e*Math.pow(t/e,o),l=e+(t-e)*o;a[n-1]=s*i+(1-s)*l}return a}function St(e,t){ne.getInverse(e.viewProjection),Ve.multiplyMatrices(t,ne)}function Ct(e,t){const r=Ve.elements;let s=1/0,a=-1/0,n=0,o=0;for(let i=0;i<2;i++){const l=i===0?e:t;for(let c=-1;c<=1;c+=2)for(let d=-1;d<=1;d+=2){const u=r[0]*d+r[4]*c+r[8]*l+r[12],f=r[1]*d+r[5]*c+r[9]*l+r[13],h=r[2]*d+r[6]*c+r[10]*l+r[14],p=r[3]*d+r[7]*c+r[11]*l+r[15],_=h/p;n+=u/p,o+=f/p,_<s&&(s=_),_>a&&(a=_)}}D[0]=s,D[1]=a,D[2]=n*.125,D[3]=o*.125}function oe(e,t){const r=e.projection.elements;return(r[10]*-t+r[14])/(r[11]*-t+r[15])}function Te(e,t,r){const s=e.elements,a=1/(t-r);s[10]=a,s[14]=t*a}function L(e,t,r){const s=2*t/r;return Math.floor(e/s)*s}function Bt(e,t,r,s,a,n=!0){Ct(oe(e,t),oe(e,r));const o=e.projection.elements,i=e.mode==="orthographic"?1:r,l=i/o[5],c=i/o[0],d=(r-t)*.5,u=Math.sqrt(c*c+l*l+d*d),f=-D[1]-u*Me,h=-D[0],p=L(D[2],u,a),_=L(D[3],u,a);s.makeOrthographic(p-u,p+u,_+u,_-u,f,h),n&&Te(s,f,h)}const ie=new F,Me=4;function Dt(e,t,r,s,a=!0){e.applyMatrix4(t,ie);const{min:n,max:o}=ie,i=(o.x-n.x)*.5*1.1,l=(o.y-n.y)*.5*1.1,c=L((n.x+o.x)*.5,i,s),d=L((n.y+o.y)*.5,l,s),u=-o.z-Math.max(i,l)*Me,f=-n.z;r.makeOrthographic(c-i,c+i,d+l,d-l,u,f),a&&Te(r,u,f)}function Pr(e,t,r){return new H({uGlobalLightParams:{value:new Float32Array([0,0,0,0]),type:"vec4<f32>"},uTime:{value:0,type:"f32"},uFogColor:{value:new Float32Array([0,0,0]),type:"vec3<f32>"},uDisplayExposure:{value:1,type:"f32"},uFogParams:{value:new Float32Array([0,0,0]),type:"vec3<f32>"},uExposure:{value:1,type:"f32"},uHemisphereSky:{value:new Float32Array([0,0,0]),type:"vec3<f32>"},uHemisphereGround:{value:new Float32Array([0,0,0]),type:"vec3<f32>"},uHemisphereUp:{value:new Float32Array([0,1,0]),type:"vec3<f32>"},...r,uLightData:{value:e,type:"vec4<f32>",size:128},uShadowData:{value:t,type:"vec4<f32>",size:G*6}},{isStatic:!0,ubo:!0})}const Vt={gl:{vertex:`#version 300 es
      {{header}}
      void main() {
          gl_Position = vec4(aPosition, 0.0, 1.0);
          vUv = aPosition * 0.5 + 0.5;
      }
    `,fragment:`#version 300 es
      {{header}}

      float geometrySchlickGGX(float NdotV, float roughness) {
          float a = roughness;
          float k = (a * a) / 2.0;
          return NdotV / (NdotV * (1.0 - k) + k);
      }

      float geometrySmith(vec3 N, vec3 V, vec3 L, float roughness) {
          float NdotV = max(dot(N, V), 0.0);
          float NdotL = max(dot(N, L), 0.0);
          float ggx1 = geometrySchlickGGX(NdotV, roughness);
          float ggx2 = geometrySchlickGGX(NdotL, roughness);
          return ggx1 * ggx2;
      }

      vec2 integrateBRDF(float NdotV, float roughness, uint sampleCount) {
          vec3 V = vec3(sqrt(1.0 - NdotV * NdotV), 0.0, NdotV);
          vec3 N = vec3(0.0, 0.0, 1.0);

          float A = 0.0;
          float B = 0.0;

          for(uint i = 0u; i < sampleCount; i++) {
              vec2 Xi = hammersley(i, sampleCount);
              vec3 H = importanceSampleGGX(Xi, N, roughness);
              vec3 L = normalize(2.0 * dot(V, H) * H - V);

              float NdotL = max(L.z, 0.0);
              float NdotH = max(H.z, 0.0);
              float VdotH = max(dot(V, H), 0.0);

              if(NdotL > 0.0) {
                  float G = geometrySmith(N, V, L, roughness);
                  float G_Vis = (G * VdotH) / (NdotH * NdotV);
                  float Fc = pow(1.0 - VdotH, 5.0);

                  A += (1.0 - Fc) * G_Vis;
                  B += Fc * G_Vis;
              }
          }

          return vec2(A / float(sampleCount), B / float(sampleCount));
      }

      out vec4 fragColor;

      void main() {
          float NdotV = vUv.x;
          float roughness = vUv.y;
          float clampedNdotV = max(NdotV, 0.001);
          float clampedRoughness = max(roughness, 0.01);
          
          vec2 result = integrateBRDF(clampedNdotV, clampedRoughness, uint(sampleCount));
          fragColor = vec4(result.x, result.y, 0.0, 1.0);
      }
    `}},Tt={gpu:`
{{header}}

fn geometrySchlickGGX(NdotV: f32, roughness: f32) -> f32 {
   let a = roughness;
   let k = (a * a) / 2.0;
   
   return NdotV / (NdotV * (1.0 - k) + k);
}

fn geometrySmith(N: vec3<f32>, V: vec3<f32>, L: vec3<f32>, roughness: f32) -> f32 {
   let NdotV = max(dot(N, V), 0.0);
   let NdotL = max(dot(N, L), 0.0);
   let ggx1 = geometrySchlickGGX(NdotV, roughness);
   let ggx2 = geometrySchlickGGX(NdotL, roughness);
   
   return ggx1 * ggx2;
}

fn integrateBRDF(NdotV: f32, roughness: f32, sampleCount: u32) -> vec2<f32> {
   let V = vec3<f32>(sqrt(1.0 - NdotV * NdotV), 0.0, NdotV);
   let N = vec3<f32>(0.0, 0.0, 1.0);
   
   var A = 0.0;
   var B = 0.0;
   
   for (var i = 0u; i < sampleCount; i++) {
       let Xi = hammersley(i, sampleCount);
       let H = importanceSampleGGX(Xi, N, roughness);
       let L = normalize(2.0 * dot(V, H) * H - V);
       
       let NdotL = max(L.z, 0.0);
       let NdotH = max(H.z, 0.0);
       let VdotH = max(dot(V, H), 0.0);
       
       if NdotL > 0.0 {
           let G = geometrySmith(N, V, L, roughness);
           let G_Vis = (G * VdotH) / (NdotH * NdotV);
           let Fc = pow(1.0 - VdotH, 5.0);
           
           A += (1.0 - Fc) * G_Vis;
           B += Fc * G_Vis;
       }
   }
   
   A = A / f32(sampleCount);
   B = B / f32(sampleCount);
   
   return vec2<f32>(A, B);
}

@vertex
fn mainVertex(input: VertexInput) -> VertexOutput {
  var output: VertexOutput;
  output.position = vec4<f32>(input.aPosition, 0.0, 1.0);
  output.vUv = vec2<f32>(input.aPosition.x * 0.5 + 0.5, -input.aPosition.y * 0.5 + 0.5);
  return output;
}

@fragment
fn mainFragment(input: FragmentInput) -> @location(0) vec4<f32> {
   let NdotV = input.vUv.x;
   let roughness = input.vUv.y;
   
   let clampedNdotV = max(NdotV, 0.001);
   
   let clampedRoughness = max(roughness, 0.01);
   
   let result = integrateBRDF(clampedNdotV, clampedRoughness, u32(local.sampleCount));
   
   return vec4<f32>(result.x, result.y, 0.0, 1.0);
}
`},Mt={bindGroups:["local"],gpu:Tt.gpu,gl:Vt.gl};function Rr(e){const{renderer:t}=e,r=e.size??256,s=e.sampleCount??1024,a={name:"brdfLut",requires:[Le],attributes:{aPosition:"float32x2"},interStage:{vUv:"vec2<f32>"},bindings:{local:{sampleCount:"f32"}}},n=new ve({local:new H({sampleCount:{value:s,type:"f32"}})}),o=t.material3d.compileIsolatedShader([a],Mt,{0:n}),i=ht.create({width:r,height:r,format:"rg16float"}).source,l=new A({source:i}),c=xe(),d=t.renderTarget.renderTarget?t.renderTarget.getBindState():null;return t.renderTarget.bind({target:i,clear:!0}),t.encoder.draw({geometry:c,shader:o,state:Se.default2d}),d&&t.renderTarget.bind(d),n.destroy(),o.destroy(),l}const E={target:null,clear:q.NONE},At=new it,It={name:"colorOutputDraw",attributes:{aPosition:"float32x2"},bindings:{local:{uSource:"texture_2d<f32>",uOffset:"vec2<f32>"}}},Nt={bindGroups:["local"],gpu:`
{{header}}

@vertex
fn mainVertex(input: VertexInput) -> VertexOutput {
  var output: VertexOutput;
  output.position = vec4<f32>(input.aPosition, 0.0, 1.0);
  return output;
}

@fragment
fn mainFragment(input: FragmentInput) -> @location(0) vec4<f32> {
  let fxColor = textureLoad(uSource, vec2<i32>(input.position.xy + local.uOffset), 0);
  var finalColor = fxColor.rgb;
  {{fragmentEnd}}
  return vec4<f32>(finalColor, fxColor.a);
}
`,gl:{vertex:`#version 300 es

{{header}}

void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`,fragment:`#version 300 es

{{header}}

out vec4 fragColor;

void main() {
  vec4 fxColor = texelFetch(uSource, ivec2(gl_FragCoord.xy + uOffset), 0);
  vec3 finalColor = fxColor.rgb;
  {{end}}
  fragColor = vec4(finalColor, fxColor.a);
}
`}};var Er=class{_renderer;_uniforms=new H({uOffset:{value:new Float32Array(2),type:"vec2<f32>"}});_bindGroup;_shaders=new Map;_state;constructor(e){this._renderer=e,this._bindGroup=new ve({local:this._uniforms,uSource:A.WHITE.source});const t=new Se;t.blend=!1,t.depthTest=!1,t.depthMask=!1,t.culling=!1,this._state=t}draw(e,t,r,s){const a=this._renderer,{viewport:n}=t,o=r.frame,i=r.source.resolution,l=Math.round(o.x*i),c=Math.round(o.y*i),d=this._uniforms.uniforms.uOffset;d[0]=n.x-l,d[1]=n.y-c,this._uniforms.update();const u="uniformBatch"in a.renderPipes?a.renderPipes.uniformBatch.getUboResource(this._uniforms):this._uniforms;this._bindGroup.setResource(u,"local"),this._bindGroup.setResource(t.target.colorTexture,"uSource");let f=this._shaders.get(s);f||(f=a.material3d.compileIsolatedShader([It,...Oe(s)],Nt,{0:this._bindGroup}),this._shaders.set(s,f)),E.target=r,E.clear=r.noFrame?q.COLOR:q.NONE,a.renderTarget.bind(E),E.target=null,e.setViewport(At.set(l,c,n.width,n.height)),e.renderGeometry(xe(),f,this._state),this._bindGroup.setResource(A.WHITE.source,"uSource")}destroy(){for(const e of this._shaders.values())e.destroy();this._shaders=null,this._bindGroup.destroy()}};function Fr(e){return(e.cache??(e.sort==="key"?"auto":"never"))==="auto"}const le=new M,ce=new ye,Pt=new He,Rt=new F,Et=new ye,Ft=.001,Gt=.15,Lt=3,Ot=50,zt=.15,k=256,Ut="Shadow: shadow.bounds and shadow.cascades are both set — cascades take precedence and the bounds box is ignored. Use bounds for a fixed region or cascades for a camera-following shadow, not both.",kt="Shadow auto-fit box spans a large scene, so shadows may look soft. Raise view3d.shadowQuality, set light.shadow.bounds to the area that needs shadows, or, for a scene the camera roams across, enable cascades: light.shadow.cascades = 3.",$t=`Too many shadow maps for the shadow budget of ${G}: each shadow-casting light takes one, or one per cascade. Lights past the budget render without shadows.`;var Gr=class extends ze{_renderTarget=null;_layerCount=0;_quality="medium";_frameCount=0;_hasCastersValue=!1;_hasCastersFrame=-1;_sceneCasterBounds=new F;_sceneBoundsFrame=-1;_destroyed=!1;targetVersion=0;_view3d=null;shadowMapHandle;constructor(e){super(e),this.shadowMapHandle=e.shadowMapHandle}get renderTarget(){return this._renderTarget===null&&(this._renderTarget=Ue(this._quality,Math.max(this._layerCount,1))),this._renderTarget}_growAtlas(e){e<=this._layerCount||(this._layerCount=Math.min(e,G),this._releaseTarget())}set quality(e){e!==this._quality&&(this._quality=e,this._releaseTarget())}get quality(){return this._quality}beginFrame(e){this._view3d=e,this.quality=e.shadowQuality,this._frameCount++,e._shadowDataList.reset()}unload(){this._releaseTarget()}_releaseTarget(){const e=this._renderTarget;if(!e)return;this._renderTarget=null,this.targetVersion++,this._view3d&&this._bindShadowSource(this._view3d,ke.source);const t=e.depthStencilTexture;e.destroy(),t.destroy()}_bindShadowSource(e,t){const{group:r,slot:s}=e._graph.globalTextureBindings.shadowMap;r.getResource(s)!==t&&(r.setResource(t,s),e._invalidateBundleCaches())}setup(e){e.produce(this.shadowMapHandle)}condition(e){const t=e.lights;for(let r=0;r<t.length;r++)if(t[r].canCastShadow)return this._hasCasters(e.view3d);return!1}_hasCasters(e){if(this._hasCastersFrame===this._frameCount)return this._hasCastersValue;this._hasCastersFrame=this._frameCount;const t=e._meshBatches;let r=!1;for(let s=0;s<t.length&&!r;s++)r=(t[s].drawLists[this.bit]?.view.count??0)>0;return this._hasCastersValue=r,r}getShadowGPUData(e){return e._gpuShadowData??={inverseLightMatrix:new M,lightProjectionMatrix:new M,targetVersion:this.targetVersion}}_cascadeSlot(e,t){const r=this.getShadowGPUData(e).cascades??=[];return r[t]??={cameraData:new $e,bias:0,normalBias:0,mapSize:0,cascadeCount:0,splits:null,needsRender:!0}}_commitCascadeCamera(e,t,r){le.getInverse(t),le.extractPosition(ce);const s=e.cameraData;s.set(ce,t,r),s.frustum.setFromProjectionMatrix(s.viewProjection)}updateLightShadowData(e,t){if(!e.canCastShadow)return;const r=t.camera,s=this.getShadowGPUData(e),{inverseLightMatrix:a,lightProjectionMatrix:n}=s,o=s.targetVersion!==this.targetVersion,i=Xe[this._quality],l=e._shadowRefreshRequested,c=e.shadow.update,d=e.shadow.bias??Ft;if(e.type==="spot"||e.shadow.cascades===void 0){const m=this._cascadeSlot(e,0),b=K(Q(c,0),this._frameCount,l);if(!b)if(e.type==="spot")qe(e,a,n,this._applyZRangeFix),this._commitCascadeCamera(m,a,n),m.normalBias=e.shadow.normalBias??Gt;else{const g=e.shadow.bounds??this._resolveAutoShadowBounds(e,t,i);g!==void 0&&!g.isEmpty()&&(a.getInverse(e.worldTransform),Dt(g,a,n,i,this._applyZRangeFix),this._commitCascadeCamera(m,a,n),m.normalBias=this._resolveNormalBias(e,n,i))}m.bias=d,m.mapSize=i,m.cascadeCount=0,m.splits=null,m.needsRender=o||!b;return}e.shadow.bounds!==void 0&&R("pixijs-3d-shadow-bounds-cascades",Ut),a.getInverse(e.worldTransform);const u=J(e),f=e.shadow.lambda,h=Math.min(e.shadow.maxDistance??Ot,r.far),p=this._cascadeSlot(e,0),_=p.splits??=[];vt(r.near,h,u,f,_),St(r,a);for(let m=0;m<u;m++){const b=m===0?p:this._cascadeSlot(e,m),g=K(Q(c,m),this._frameCount,l);if(!g){const w=m===0?r.near:_[m-1];Bt(r,w,_[m],n,i,this._applyZRangeFix),this._commitCascadeCamera(b,a,n),b.normalBias=this._resolveNormalBias(e,n,i)}b.bias=d,b.mapSize=i,b.cascadeCount=m===0&&u>1?u:0,m>0&&(b.splits=null),b.needsRender=o||!g}}_completeShadowUpdate(e){e._gpuShadowData&&(e._gpuShadowData.targetVersion=this.targetVersion),e._shadowRefreshRequested=!1}_resolveAutoShadowBounds(e,t,r){const s=this._countSceneCasters(t),a=e._autoShadowBounds;if(s>k&&e._autoShadowBoundsFrozen)return a??void 0;const n=this._ensureSceneCasterBounds(t);if(n.isEmpty())return a??void 0;const o=a??(e._autoShadowBounds=new F);return o.copyFrom(n),s<=k?e._autoShadowBoundsFrozen=!1:(e._autoShadowBoundsFrozen=!0,R("pixijs-3d-shadow-autofit-cap",`Shadow auto-fit: ${s} shadow casters is over the auto-measure cap (${k}), so the shadow box was fitted once and frozen. If casters move or spawn outside it, set shadow.bounds, enable shadow.cascades, or call light.fitShadowBounds() after changes.`)),this._warnIfShadowBoxLarge(o,r),o}_countSceneCasters(e){let t=0;const r=e._meshBatches;for(let s=0;s<r.length;s++){const a=r[s];if(!a.renderData._worldVisible)continue;const n=a.drawLists[this.bit];n&&(t+=n.view.count)}return t}_ensureSceneCasterBounds(e){if(this._sceneBoundsFrame===this._frameCount)return this._sceneCasterBounds;this._sceneBoundsFrame=this._frameCount;const t=this._sceneCasterBounds.makeEmpty(),r=e._meshBatches;for(let s=0;s<r.length;s++){const a=r[s];if(!a.renderData._worldVisible)continue;const n=a.drawLists[this.bit];if(!n||n.view.count===0)continue;const o=s===0?null:a.renderData.worldTransform,i=n.view.items,l=n.view.renderableIndices;for(let c=0;c<n.view.count;c++){const d=i[l[c]];if(d._worldVisible===0)continue;const u=d.boundingSphere;if(u.radius<0)continue;const f=o?u.applyMatrix4(o,Pt):u;t.union(f.getBounds(Rt))}}return t}_warnIfShadowBoxLarge(e,t){if(e.isEmpty())return;const r=e.getSize(Et);Math.max(r.x,r.y,r.z)/t>zt&&R("pixijs-3d-shadow-autofit-large",kt)}_resolveNormalBias(e,t,r){if(e.shadow.normalBias!==void 0)return e.shadow.normalBias;const s=2/(t.elements[0]*r);return Lt*s}prepareShadow(e,t){const r=t._shadowDataList,s=this._claimShadowSlots(e,t,r.count);if(s===0)return;this._growAtlas(r.count+s),this.updateLightShadowData(e,t);const a=this.getShadowGPUData(e).cascades;for(let n=0;n<s;n++)r.add(a[n])}_claimShadowSlots(e,t,r){const s=e.canCastShadow&&this._hasCasters(t),a=J(e);return s&&r+a<=G?(e._shadowDataIndex=r,a):(s&&R("pixijs-3d-shadow-budget",$t),e._shadowDataIndex=-1,0)}destroy(){this._destroyed||(this._destroyed=!0,this._view3d=null,this._releaseTarget(),super.destroy())}};function Lr(e,t,r){const s=r.x,a=r.y,n=r.z,o=e.items,i=e.renderableIndices,l=e.count;for(let c=0;c<l;c++){const d=o[i[c]],u=d._storeIndex*24,f=t[u+12]-s,h=t[u+13]-a,p=t[u+14]-n;d._sortKey=-(f*f+h*h+p*p)}e.sortForced(c=>c._sortKey)}function Or(e,t){const r=t.x,s=t.y,a=t.z,n=e.items,o=e.renderableIndices,i=e.count;for(let l=0;l<i;l++){const c=n[o[l]],d=c.worldTransform.elements,u=d[12]-r,f=d[13]-s,h=d[14]-a;c._sortKey=-(u*u+f*f+h*h)}e.sortForced(l=>l._sortKey)}function zr(e,t,r,s){const a=t.x,n=t.y,o=t.z,i=s.elements,l=e.items,c=e.renderableIndices,d=e.count;for(let u=0;u<d;u++){const f=l[c[u]],h=f._storeIndex*24,p=r[h+12],_=r[h+13],m=r[h+14],b=i[0]*p+i[4]*_+i[8]*m+i[12],g=i[1]*p+i[5]*_+i[9]*m+i[13],w=i[2]*p+i[6]*_+i[10]*m+i[14],x=b-a,v=g-n,y=w-o;f._sortKey=-(x*x+v*v+y*y)}e.sortForced(u=>u._sortKey)}const Ur={name:"alphaOpaque",gpu:{fragment:{end:`
  alpha = 1.0;
`}},gl:{fragment:{end:`
  alpha = 1.0;
`}}},kr={name:"camera",bindings:{camera:{uCameraPosition:"vec3<f32>",uViewMatrix:"mat4x4<f32>",uProjectionMatrix:"mat4x4<f32>",uViewProjectionMatrix:"mat4x4<f32>",uPreviousViewProjectionMatrix:"mat4x4<f32>",uViewportUVScale:"vec2<f32>",uLightTileTransform:"vec4<f32>",uLightTiles:`array<vec4<i32>, ${We}>`,uLightDepthMasks:`array<vec4<i32>, ${je}>`,uLightDepthPlane:"vec4<f32>"}}};function j(e,t,r,s){const a=`
fn decodeColor(c: vec3<f32>) -> vec3<f32> { return ${t.replace("VEC3","vec3<f32>")}; }
fn inputTint(linearTint: vec4<f32>, displayTint: vec4<f32>) -> vec4<f32> { return ${r}Tint; }
fn inputExposure(linearExposure: f32, displayExposure: f32) -> f32 { return ${r}Exposure; }
fn decodeFrame(c: vec3<f32>) -> vec3<f32> { return ${s.replace("VEC3","vec3<f32>")}; }
`,n=`
vec3 decodeColor(vec3 c) { return ${t.replace("VEC3","vec3")}; }
vec4 inputTint(vec4 linearTint, vec4 displayTint) { return ${r}Tint; }
float inputExposure(float linearExposure, float displayExposure) { return ${r}Exposure; }
vec3 decodeFrame(vec3 c) { return ${s.replace("VEC3","vec3")}; }
`;return{name:e,gpu:{header:a},gl:{header:n}}}const Xt=j("colorSpaceLinear","pow(c, VEC3(2.2))","linear","pow(c, VEC3(2.2))"),qt=j("colorSpaceLinearFrames","pow(c, VEC3(2.2))","linear","c"),Ht=j("colorSpaceDisplay","c","display","c");function $r(e,t,r){if(!t)return qt;const s=e._skipsToneCurve||t===Ye;return e.colorSpace==="display"&&!e.lit&&s&&!r?Ht:Xt}const Xr={name:"doubleSidedNormal",gpu:{fragment:{material:`
  normal = select(-normal, normal, input.frontFacing);
`}},gl:{fragment:{material:`
  if (!gl_FrontFacing) {
    normal = -normal;
  }
`}}},qr={name:"flatShading",gpu:{fragment:{material:`
  let flatNormal = normalize(cross(dpdx(input.vPosition), dpdy(input.vPosition)));
  normal = select(-flatNormal, flatNormal, dot(flatNormal, normal) >= 0.0);
`}},gl:{fragment:{material:`
  vec3 flatNormal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
  normal = dot(flatNormal, normal) >= 0.0 ? flatNormal : -flatNormal;
`}}},ue=new Map;function Hr(e,t){const r=Ze(e).length,s=t==="direct"&&Object.keys(we(e)).length>0,a=`${r}|${t}|${s}`;let n=ue.get(a);if(n)return n;const o=Object.fromEntries(Array.from({length:r},(i,l)=>l).flatMap(i=>[[`uMaterialTexture${i}`,"texture_2d<f32>"],[`uMaterialSampler${i}`,"sampler"]]));return s&&(o.material="uniform<Material>"),n={name:`materialBindings:${r}:${t}${s?":material":""}`,bindings:{batch:o}},ue.set(a,n),n}const Ae=`
  worldNormal = bbRight * normal.x + bbUp * normal.y + bbNormal * normal.z;
`,Ie=`
  worldNormal = bbRight * normal.x + bbUp * normal.y + bbNormal * normal.z;
`;function jt(e){return`
  let bbRight = vec3<f32>(camera.uViewMatrix[0][0], camera.uViewMatrix[1][0], camera.uViewMatrix[2][0]);
  let bbUp    = vec3<f32>(camera.uViewMatrix[0][1], camera.uViewMatrix[1][1], camera.uViewMatrix[2][1]);
  let bbNormal = cross(bbRight, bbUp);

  let bbScaleX = length(modelMatrix[0].xyz);
  let bbScaleY = length(modelMatrix[1].xyz);
  let bbScaleZ = length(modelMatrix[2].xyz);

  worldPosition = vec4<f32>(
    modelMatrix[3].xyz
      + bbRight * (position.x * bbScaleX)
      + bbUp * (position.y * bbScaleY)
      + bbNormal * (position.z * bbScaleZ),
    1.0
  );
  clipPosition = camera.uViewProjectionMatrix * worldPosition;
${e?Ae:""}`}function Wt(e){return`
  vec3 bbRight = vec3(uViewMatrix[0][0], uViewMatrix[1][0], uViewMatrix[2][0]);
  vec3 bbUp    = vec3(uViewMatrix[0][1], uViewMatrix[1][1], uViewMatrix[2][1]);
  vec3 bbNormal = cross(bbRight, bbUp);

  float bbScaleX = length(modelMatrix[0].xyz);
  float bbScaleY = length(modelMatrix[1].xyz);
  float bbScaleZ = length(modelMatrix[2].xyz);

  worldPosition = vec4(
    modelMatrix[3].xyz
      + bbRight * (position.x * bbScaleX)
      + bbUp * (position.y * bbScaleY)
      + bbNormal * (position.z * bbScaleZ),
    1.0
  );
  gl_Position = uViewProjectionMatrix * worldPosition;
${e?Ie:""}`}function Yt(e){return`
  let bbColX = modelMatrix[0].xyz;
  let bbColY = modelMatrix[1].xyz;
  let bbScaleX = length(bbColX);
  let bbScaleY = length(bbColY);
  let bbScaleZ = length(modelMatrix[2].xyz);
  let bbCentre = modelMatrix[3].xyz;

  var bbUp = vec3<f32>(0.0, 1.0, 0.0);
  if (bbScaleY > 1e-8) { bbUp = bbColY / bbScaleY; }

  let bbToCam = camera.uCameraPosition - bbCentre;
  let bbFlat = bbToCam - bbUp * dot(bbToCam, bbUp);
  let bbFlatLenSq = dot(bbFlat, bbFlat);

  var bbRight = vec3<f32>(1.0, 0.0, 0.0);
  if (bbFlatLenSq > 1e-8) {
    bbRight = cross(bbUp, bbFlat) * inverseSqrt(bbFlatLenSq);
  } else if (bbScaleX > 1e-8) {
    bbRight = bbColX / bbScaleX;
  }

  let bbNormal = cross(bbRight, bbUp);

  worldPosition = vec4<f32>(
    bbCentre
      + bbRight * (position.x * bbScaleX)
      + bbUp * (position.y * bbScaleY)
      + bbNormal * (position.z * bbScaleZ),
    1.0
  );
  clipPosition = camera.uViewProjectionMatrix * worldPosition;
${e?Ae:""}`}function Zt(e){return`
  vec3 bbColX = modelMatrix[0].xyz;
  vec3 bbColY = modelMatrix[1].xyz;
  float bbScaleX = length(bbColX);
  float bbScaleY = length(bbColY);
  float bbScaleZ = length(modelMatrix[2].xyz);
  vec3 bbCentre = modelMatrix[3].xyz;

  vec3 bbUp = vec3(0.0, 1.0, 0.0);
  if (bbScaleY > 1e-8) { bbUp = bbColY / bbScaleY; }

  vec3 bbToCam = uCameraPosition - bbCentre;
  vec3 bbFlat = bbToCam - bbUp * dot(bbToCam, bbUp);
  float bbFlatLenSq = dot(bbFlat, bbFlat);

  vec3 bbRight = vec3(1.0, 0.0, 0.0);
  if (bbFlatLenSq > 1e-8) {
    bbRight = cross(bbUp, bbFlat) * inversesqrt(bbFlatLenSq);
  } else if (bbScaleX > 1e-8) {
    bbRight = bbColX / bbScaleX;
  }

  vec3 bbNormal = cross(bbRight, bbUp);

  worldPosition = vec4(
    bbCentre
      + bbRight * (position.x * bbScaleX)
      + bbUp * (position.y * bbScaleY)
      + bbNormal * (position.z * bbScaleZ),
    1.0
  );
  gl_Position = uViewProjectionMatrix * worldPosition;
${e?Ie:""}`}const de=Object.create(null);function jr(e,t){const r=`${e}:${t}`,s=de[r];if(s)return s;if(e==="none")throw new Error("[meshBillboardBits] billboardMode 'none' has no bit — the caller must skip injection.");const a=e==="spherical",n={name:`meshBillboard${a?"Spherical":"Cylindrical"}${t?"Lit":""}`,gpu:{vertex:{afterTransform:a?jt(t):Yt(t)}},gl:{vertex:{afterTransform:a?Wt(t):Zt(t)}}};return de[r]=n,n}const Wr={name:"normal",attributes:{aNormal:"float32x3"},gpu:{vertex:{input:"normal = input.aNormal;"}},gl:{vertex:{input:"normal = aNormal;"}}},Yr={name:"normalMapping",requires:[Ke],gpu:{fragment:{material:`
  let normalMapSample = sampleNormal(input.vUV).rgb;
  var tangentNormal = normalMapSample * 2.0 - 1.0;
  tangentNormal = vec3<f32>(tangentNormal.xy * material.normalScale, tangentNormal.z);
  let tbnMatrix = calculateTBN(normal, input.vPosition, input.vUV);
  normal = normalize(tbnMatrix * tangentNormal);
`}},gl:{fragment:{material:`
  {
  vec3 normalMapSample = sampleNormal(vUV).rgb;
  vec3 tangentNormal = normalMapSample * 2.0 - 1.0;
  tangentNormal.xy *= material.normalScale;
  mat3 tbnMatrix = calculateTBN(normal, vPosition, vUV);
  normal = normalize(tbnMatrix * tangentNormal);
  }
`}}},Zr={name:"no-shadow",gpu:{header:`
    fn calculateShadow(
      shadowDataIndex: f32,
      cascadeCount: f32,
      worldPos: vec3<f32>,
      normal: vec3<f32>,
      NdotL: f32
    ) -> f32 {
      return 1.0;
    }
    `},gl:{header:`
    float calculateShadow(
      Light light,
      vec3 worldPos,
      vec3 normal,
      float NdotL
    ) {
      return 1.0;
    }
    `}},fe=Object.create(null);function Kr(e){const t=fe[e];if(t)return t;if(Ce(e).size<3)throw new Error(`[positionBit] aPosition needs three components, got ${e}`);const r=e==="float32x3"?"aPosition":"aPosition.xyz",s={name:`position:${e}`,attributes:{aPosition:e},gpu:{vertex:{input:`position = vec4<f32>(vec3<f32>(input.${r}), 1.0);`}},gl:{vertex:{input:`position = vec4(vec3(${r}), 1.0);`}}};return fe[e]=s,s}const Qr={transform:"mat4x4<f32>",bonePitIndex:"u32",materialIndex:"u32",geometryDataIndex:"u32",visibility:"u32",morphWeightIndex:"u32"},Jr={boundsCenter:"vec3<f32>",boundsRadius:"f32",morphDeltaBase:"u32",morphTargetCount:"u32",baseVertex:"u32",_pad:"u32"},es={id:"u32"},ts={rows:"mat3x4<f32>"},rs={position:"vec3<f32>",kind:"f32",color:"vec3<f32>",rangeSq:"f32",direction:"vec3<f32>",coneCos:"f32",innerConeCos:"f32",shadowDataIndex:"f32",cascadeCount:"f32",radiusPow4:"f32"},ss={position:"vec3<f32>",type:"f32",color:"vec3<f32>",rangeSq:"f32",direction:"vec3<f32>",coneCos:"f32",innerConeCos:"f32",shadowDataIndex:"f32",radiusPow4:"f32"},as={lightSpaceMatrix:"mat4x4<f32>",shadowParams:"vec4<f32>",cascadeSplits:"vec4<f32>"},ns={hard:[[0,0]],pcf:[[-1,-1],[1,-1],[-1,1],[1,1]],"pcf-high":[[-2,-2],[0,-2],[2,-2],[-2,0],[0,0],[2,0],[-2,2],[0,2],[2,2]]},os={name:"tangentNormalMapping",attributes:{aTangent:"float32x4"},interStage:{vTangent:"vec3<f32>",vBitangent:"vec3<f32>"},gpu:{vertex:{input:`
    tangent = input.aTangent.xyz;
  `,end:`
  let worldTangent = normalize(modelMatrix3 * tangent);
  let worldBitangent = cross(worldNormal, worldTangent) * input.aTangent.w;
  output.vTangent = worldTangent;
  output.vBitangent = worldBitangent;
`},fragment:{material:`
  let normalMapSample = sampleNormal(input.vUV).rgb;
  var tangentNormal = normalMapSample * 2.0 - 1.0;
  tangentNormal = vec3<f32>(tangentNormal.xy * material.normalScale, tangentNormal.z);
  let tbnMatrix = mat3x3<f32>(
    normalize(input.vTangent),
    normalize(input.vBitangent),
    normal
  );
  normal = normalize(tbnMatrix * tangentNormal);
`}},gl:{vertex:{input:`
    tangent = aTangent.xyz;
  `,end:`
  vec3 worldTangent = normalize(modelMatrix3 * tangent);
  vec3 worldBitangent = cross(worldNormal, worldTangent) * aTangent.w;
  vTangent = worldTangent;
  vBitangent = worldBitangent;
`},fragment:{material:`
  vec3 normalMapSample = sampleNormal(vUV).rgb;
  vec3 tangentNormal = normalMapSample * 2.0 - 1.0;
  tangentNormal.xy *= material.normalScale;
  mat3 tbnMatrix = mat3(
    normalize(vTangent),
    normalize(vBitangent),
    normal
  );
  normal = normalize(tbnMatrix * tangentNormal);
`}}},he=Object.create(null);function is(e){const t=he[e];if(t)return t;const r={name:`uvs:${e}`,overrideDefs:{HAS_UVS:{type:"u32",required:!0}},attributes:{aUV:e},gpu:{vertex:{input:"uv = vec2<f32>(input.aUV);"}},gl:{vertex:{input:"uv = vec2(aUV);"}}};return he[e]=r,r}const ls={name:"vertexColor",attributes:{aColor:"float32x4"},interStage:{vColor:"vec4<f32>"},gpu:{vertex:{end:"output.vColor = input.aColor;"},fragment:{material:`albedo *= input.vColor.rgb;
  alpha *= input.vColor.a;`}},gl:{vertex:{end:"vColor = aColor;"},fragment:{material:`albedo *= vColor.rgb;
  alpha *= vColor.a;`}}};function cs(e,t,r){const s={};for(const a of e){const n=a[t]?.[r];if(n)for(const[o,i]of Object.entries(n))i&&(s[o]??=[],s[o].push(i))}return s}const me=/\{\{(.*?)\}\}/g,_e=8;function Kt(e,t){let r=e;for(let a=0;a<_e;a++){const n=r.replace(me,(o,i)=>{const l=t[i];return l?l.join(`
`):""});if(n===r)break;r=n}const s=r.match(me);if(s){const a=[...new Set(s)].join(", ");throw new Error(`[fillTemplateSlots] Slot markers still present after ${_e} substitution passes: ${a}. A slot's code reintroduces its own marker (directly or via another slot) — break the cycle.`)}return r}const Qt=/\{\{(.*?)\}\}/g;function Jt(e){const t={};return(e.match(Qt)?.map(r=>r.replace(/[{()}]/g,""))??[]).forEach(r=>{t[r]=[]}),t}const be=new Map;function us(e){let t=be.get(e);return t||(t=new Set(Object.keys(Jt(e))),be.set(e,t)),t}function ds(e){for(let t=0;t<e.length;t++)if(e[t].bindings?.instance)return!0;return!1}function fs(e){return`vInstance_${e}`}const er=/\binstance\b(?:\s*\.\s*([A-Za-z]\w*))?/g,tr=/\/\/[^\n]*|\/\*[\s\S]*?\*\//g;function pe(e,t,r,s,a){for(const n of e){const o=n[t]?.[r];if(o)for(const i in o){const l=o[i];if(l)for(const c of l.replace(tr,"").matchAll(er))if(c[1]===void 0)for(const d in s)a.add(d);else c[1]in s&&a.add(c[1])}}}function hs(e,t,r,s){if(!r){const l=e.find(c=>c.bindings?.instance);throw new Error(`[instanceData] Bit "${l?.name}" reads instance data, but the mesh it draws has none. Draw it as a BatchedMesh3D slot and declare the fields in the batch's instanceData option.`)}const a={};for(const l of e){const c=l.bindings?.instance;if(c)for(const{name:d,spec:u}of Qe(c,"instance")){const f=Je(u),h=r.struct[d];if(h!==f)throw new Error(`[instanceData] Bit "${l.name}" reads instance.${d} as ${f}, but the batch `+(h?`declares it as ${h}.`:`has no such field. Its instanceData is: ${r.key}.`));a[d]=h}}const n=new Set;pe(e,t,"fragment",a,n);const o=new Set(n);pe(e,t,"vertex",a,o);const i={layout:r,loaded:o,varyings:[...n]};return rr(s,t,i),i}function rr(e,t,r){const s=r.varyings.length>0;let a=null;if(t==="gpu"){const n=e.gpu??"";n.includes("{{vertexStoreAccess}}")?s&&!n.includes("{{fragmentStoreAccess}}")&&(a="{{fragmentStoreAccess}}"):a="{{vertexStoreAccess}}"}else e.gl?.vertex.includes("{{storeAccess}}")?s&&!e.gl.fragment.includes("{{storeAccess}}")&&(a="{{storeAccess}} in its fragment source"):a="{{storeAccess}} in its vertex source";if(a)throw new Error(`[instanceData] A bit reads instance data, but the shader template has no ${a}. Add the slot where the draw's store row is in scope, or use the material's own template.`)}const ms={preCompile(e){const t=e.data.structs;t?.Material&&(t.Material=we(e.bits))}};function sr(e){return e.includes("u32")?"u32":e.includes("i32")?"i32":"f32"}function _s(e,t){const r=et(e),s=new Map;for(const a of r.elements){if(t&&!t.has(a.name))continue;const n=a.offset/4,o=Math.floor(n/4),i=n%4,l=a.components===4?"":`.${"xyzw".slice(i,i+a.components)}`;let c=s.get(o);c||s.set(o,c=[]),c.push({name:a.name,type:a.type,scalar:sr(a.type),swizzle:l})}return s}function ar(e,t,r){const s=r;if(!s?.type)throw new Error(`[ShaderBit:${e}] overrideDefs.${t} missing 'type'.`);const a=Object.prototype.hasOwnProperty.call(s,"default"),n=s.required===!0;if(a&&n)throw new Error(`[ShaderBit:${e}] overrideDefs.${t} cannot specify both 'default' and 'required: true'.`);if(!a&&!n)throw new Error(`[ShaderBit:${e}] overrideDefs.${t} must specify either 'default' or 'required: true'.`);if(n)return{type:s.type,required:!0};if(typeof s.default!="number"||!Number.isFinite(s.default))throw new Error(`[ShaderBit:${e}] overrideDefs.${t}.default must be a finite number.`);return{type:s.type,default:s.default,required:!1}}function bs(e){const t=Object.create(null);for(const r of e)if(r.overrideDefs)for(const[s,a]of Object.entries(r.overrideDefs)){const n=ar(r.name,s,a),o=t[s];if(o&&(o.type!==n.type||o.required!==n.required||!o.required&&o.default!==n.default))throw new Error(`[ShaderBit overrides] Duplicate override '${s}' has conflicting definitions.
Existing: ${JSON.stringify(o)}
New (from '${r.name}'): ${JSON.stringify(n)}`);t[s]=o??n}return t}function nr(e,t){return e==="u32"?`${Math.trunc(t)}u`:e==="i32"?`${Math.trunc(t)}`:Number.isInteger(t)?`${t}.0`:`${t}`}function ps(e){const t=[];for(const r of Object.keys(e).sort()){const s=e[r];if(s.required)t.push(`override ${r}: ${s.type};`);else{const a=nr(s.type,s.default);t.push(`override ${r}: ${s.type} = ${a};`)}}return t.length?t.join(`
`):""}function or(e,t){return e==="u32"?`${Math.trunc(t)}`:e==="i32"?`${Math.trunc(t)}`:Number.isInteger(t)?`${t}.0`:`${t}`}function gs(e,t){const r=[];for(const s of Object.keys(e).sort()){const a=e[s],n=t[s],o=n!==void 0;if(a.required&&!o)throw new Error(`[glslOverrides] required override '${s}' has no value supplied via descriptor.overrides.`);const i=o?n:a.default;r.push(`#define ${s} ${or(a.type,i)}`)}return r.length?r.join(`
`):""}function xs(e,t){for(const s of t)s.collectData?.(e);for(const s of t)s.preCompile?.(e);const r={};for(const s of t){const a=s.injectCode?.(e);if(a)for(const[n,o]of Object.entries(a))!o||!/\S/.test(o)||(r[n]??=[],r[n].push(o))}return Kt(e.templateString,r)}function Ne(e,t,r){if(r.has(e))return;r.add(e);const s=e.requires;if(s)for(let a=0;a<s.length;a++)Ne(s[a],t,r);t.push(e)}function ys(e){const t=[],r=new Set;for(let s=0;s<e.length;s++)Ne(e[s],t,r);return t}function ir(e){const{camera:t}=e;if(t._view3d!==e)throw new Error("Camera3D is no longer in the View3D scene graph. Don't remove an assigned camera from its parent without reassigning view3d.camera.");if(t.renderTexture)throw new Error("The View3D's own camera draws the view, not a texture. Put the render texture on a second camera and draw from it with a pass that names that camera.");if(!t.visible||t._worldVisible===0)throw new Error("Camera3D is hidden (visible=false or an ancestor is hidden). Cannot render with a hidden camera.")}var ws=class{_managedViews;constructor(e){this._managedViews=new mt({renderer:e,type:"renderable",name:"view3d"}),te.on("evict",this._releasePooledTextures)}_releasePooledTextures=()=>{const e=this._managedViews.items;for(const t in e){const r=e[t];r&&r._releasePooledTextures()}};track(e){this._managedViews.add(e)}destroy(){te.off("evict",this._releasePooledTextures);const e=Object.values(this._managedViews.items);for(let t=0;t<e.length;t++)e[t]?.unload();this._managedViews.destroy()}};const lr=1024,cr=2048;var ur=class{uid=lt("geometryAtlas");attributeKey;vertexStride=0;_vertexBuffer;_indexBuffer;_retiredBuffers=[];_retiredGeometries=[];_vertexCount=0;_indexCount=0;_deadVertexCount=0;_deadIndexCount=0;_liveAllocations=[];_vertexDirtyMin=1/0;_vertexDirtyMax=-1/0;_indexDirtyMin=1/0;_indexDirtyMax=-1/0;_bufferVersion=0;geometry;_attributeInfo;rebaseIndices;constructor(e){const{referenceGeometry:t,initialVertexCapacity:r=lr,initialIndexCapacity:s=cr,rebaseIndices:a=!1}=e;this.rebaseIndices=a,this.attributeKey=t.attributeKey;const n=t.attributes,o=Object.keys(n).sort();if(!o.some(l=>!n[l].instance))throw new Error("GeometryAtlas: reference geometry has no vertex attributes");let i=0;this._attributeInfo=[];for(const l of o){const c=n[l];if(c.instance)continue;const d=c.format,u=Ce(d).stride;i=ee(i);const f=i;i+=u,this._attributeInfo.push({name:l,format:d,offset:f,byteSize:u})}this.vertexStride=ee(i),this._vertexBuffer=new T({data:new Uint8Array(r*this.vertexStride),usage:S.VERTEX|S.COPY_DST,label:"GeometryAtlas-vertex",shrinkToFit:!1}),this._indexBuffer=new T({data:new Uint32Array(s),usage:S.INDEX|S.COPY_DST,label:"GeometryAtlas-index",shrinkToFit:!1}),this.geometry=this._buildMergedGeometry()}add(e){const t=e._geometryAtlasAllocation;if(t&&t.atlas===this)return t;for(const b in e.attributes)if(e.attributes[b].instance)throw new Error(`GeometryAtlas: Cannot add geometry with instance attribute "${b}". The Atlas is for merging vertex data only; instance data would be lost.`);if(e.attributeKey!==this.attributeKey)throw new Error(`GeometryAtlas: attribute structure mismatch. Expected "${this.attributeKey}", got "${e.attributeKey}"`);const r=e.vertexCount,s=e.indexBuffer.data,a=s.length,n=this._vertexBuffer.data.byteLength/this.vertexStride,o=this._indexBuffer.data.length,i=this._vertexCount+r>n,l=this._indexCount+a>o;if(i||l){const b=this._vertexCount-this._deadVertexCount,g=this._indexCount-this._deadIndexCount,w=b+r<=n,x=g+a<=o;w&&x?this.defragment():((this._deadVertexCount>0||this._deadIndexCount>0)&&this.defragment(),this._ensureVertexCapacity(this._vertexCount+r),this._ensureIndexCapacity(this._indexCount+a))}const c=this._vertexCount,d=this._indexCount;this._vertexCount+=r,this._indexCount+=a;const u=this._vertexBuffer.data,f=this._indexBuffer.data,h=this.vertexStride,p=c*h,_=r*h;if(this._matchesAtlasLayout(e)){const b=e.attributes[this._attributeInfo[0].name].buffer.data;u.set(new Uint8Array(b.buffer,b.byteOffset,_),p)}else{const b=new Uint32Array(u.buffer);for(const{name:g,offset:w,byteSize:x}of this._attributeInfo){const v=e.attributes[g],y=v.buffer.data,O=v.stride??x,z=v.offset??0;if(((y.byteOffset|z|O|x)&3)===0){const V=new Uint32Array(y.buffer,y.byteOffset,y.byteLength>>2),N=O>>2,P=h>>2;let B=z>>2,C=p+w>>2;for(let W=0;W<r;W++)b[C]=V[B],x>4&&(b[C+1]=V[B+1]),x>8&&(b[C+2]=V[B+2]),x>12&&(b[C+3]=V[B+3]),B+=N,C+=P}else{const V=new Uint8Array(y.buffer,y.byteOffset,y.byteLength);let N=z,P=p+w;for(let B=0;B<r;B++){for(let C=0;C<x;C++)u[P+C]=V[N+C];N+=O,P+=h}}}}if(this._markVertexDirty(p,p+_),this.rebaseIndices)for(let b=0;b<a;b++)f[d+b]=s[b]+c;else f.set(s,d);this._markIndexDirty(d,d+a);const m={atlas:this,baseVertex:c,firstIndex:d,indexCount:a,vertexCount:r};return e._geometryAtlasAllocation=m,e._atlasVacated=!1,this._liveAllocations.push(m),m}remove(e){const t=e._geometryAtlasAllocation;if(!t||(e._geometryAtlasAllocation=null,e._atlasVacated=!0,this._vertexBuffer===null))return;this._deadVertexCount+=t.vertexCount,this._deadIndexCount+=t.indexCount;const r=this._liveAllocations.indexOf(t);r!==-1&&this._liveAllocations.splice(r,1)}update(){if(this._vertexDirtyMin<this._vertexDirtyMax){const e=this._vertexDirtyMax-this._vertexDirtyMin;this._vertexBuffer.update(e,this._vertexDirtyMin),this._vertexDirtyMin=1/0,this._vertexDirtyMax=-1/0}if(this._indexDirtyMin<this._indexDirtyMax){const e=this._indexDirtyMin*4,t=(this._indexDirtyMax-this._indexDirtyMin)*4;this._indexBuffer.update(t,e),this._indexDirtyMin=1/0,this._indexDirtyMax=-1/0}}_matchesAtlasLayout(e){const t=e.attributes,r=t[this._attributeInfo[0].name].buffer;for(const s of this._attributeInfo){const a=t[s.name];if(a.buffer!==r||a.stride!==this.vertexStride||(a.offset??0)!==s.offset)return!1}return!0}_buildMergedGeometry(){const e=new ct;for(const{name:t,format:r,offset:s}of this._attributeInfo)e.addAttribute(t,{buffer:this._vertexBuffer,format:r,stride:this.vertexStride,offset:s});return e.addIndex(this._indexBuffer),e}_markVertexDirty(e,t){e<this._vertexDirtyMin&&(this._vertexDirtyMin=e),t>this._vertexDirtyMax&&(this._vertexDirtyMax=t)}_markIndexDirty(e,t){e<this._indexDirtyMin&&(this._indexDirtyMin=e),t>this._indexDirtyMax&&(this._indexDirtyMax=t)}_retireCurrentGeometry(){this.geometry&&(this.geometry.indexBuffer=null,this._retiredGeometries.push(this.geometry))}_ensureVertexCapacity(e){const t=this._vertexBuffer.data;let r=t.byteLength/this.vertexStride;if(e<=r)return;for(;r<e;)r*=2;const s=new Uint8Array(r*this.vertexStride);s.set(t),this._retiredBuffers.push(this._vertexBuffer),this._vertexBuffer=new T({data:s,usage:S.VERTEX|S.COPY_DST,label:"GeometryAtlas-vertex",shrinkToFit:!1}),this._markVertexDirty(0,this._vertexCount*this.vertexStride),this._retireCurrentGeometry(),this.geometry=this._buildMergedGeometry(),this._bufferVersion++}_ensureIndexCapacity(e){const t=this._indexBuffer.data;let r=t.length;if(e<=r)return;for(;r<e;)r*=2;const s=new Uint32Array(r);s.set(t),this._retiredBuffers.push(this._indexBuffer),this._indexBuffer=new T({data:s,usage:S.INDEX|S.COPY_DST,label:"GeometryAtlas-index",shrinkToFit:!1}),this._markIndexDirty(0,this._indexCount),this._retireCurrentGeometry(),this.geometry=this._buildMergedGeometry(),this._bufferVersion++}destroy(){if(this._vertexBuffer!==null){this.geometry&&(this.geometry.indexBuffer=null),this.geometry?.destroy(!1),this.geometry=null,this._vertexBuffer.destroy(),this._indexBuffer.destroy();for(let e=0;e<this._retiredGeometries.length;e++)this._retiredGeometries[e].destroy(!1);this._retiredGeometries=null;for(let e=0;e<this._retiredBuffers.length;e++)this._retiredBuffers[e].destroy();this._retiredBuffers=null,this._vertexBuffer=null,this._indexBuffer=null,this._liveAllocations=null}}defragment(){if(this._deadVertexCount===0&&this._deadIndexCount===0)return;const e=this.vertexStride,t=this._vertexBuffer.data,r=this._indexBuffer.data;let s=0,a=0;const n=this.rebaseIndices;for(const o of this._liveAllocations){const i=o.baseVertex;if(i!==s){const l=i*e,c=s*e,d=o.vertexCount*e;t.copyWithin(c,l,l+d),o.baseVertex=s}if(s+=o.vertexCount,o.firstIndex!==a&&(r.copyWithin(a,o.firstIndex,o.firstIndex+o.indexCount),o.firstIndex=a),n&&i!==o.baseVertex){const l=o.baseVertex-i;for(let c=0;c<o.indexCount;c++)r[o.firstIndex+c]+=l}a+=o.indexCount}this._markVertexDirty(0,s*e),this._markIndexDirty(0,a),this._vertexCount=s,this._indexCount=a,this._deadVertexCount=0,this._deadIndexCount=0,this._bufferVersion++}};const ge=Object.create(null);var vs=class Pe{_atlases=Object.create(null);_rebaseIndices;_bufferVersion=0;constructor(t){this._rebaseIndices=t.rebaseIndices}static from(t){const r=t.rebaseIndices?"rebased":"geometryLocal";let s=ge[r];return s||(s=new Pe(t),ge[r]=s,ut.register(s)),s}get bufferVersion(){return this._bufferVersion}allocate(t){const r=t.attributeKey;let s=this._atlases[r];const a=t._geometryAtlasAllocation;if(a&&a.atlas===s)return a;s||(s=new ur({referenceGeometry:t,rebaseIndices:this._rebaseIndices}),this._atlases[r]=s);const n=s._bufferVersion,o=s.add(t);return s._bufferVersion!==n&&this._bufferVersion++,o}update(){for(const t in this._atlases)this._atlases[t].update()}clear(){for(const t in this._atlases)this._atlases[t].destroy();this._atlases=Object.create(null)}};const dr=(()=>{const e=new tt;return e._worldVisible=1,e})();function fr(e){const t=e._childrenToUpdate,r=e._updateTick++;for(const s in t){const a=Number(s),n=t[s],o=n.list,i=n.index;for(let l=0;l<i;l++){const c=o[l];c._view3d===e&&c._relativeSceneDepth===a&&Re(c,c.parent??dr,r,!1,!1)}De(o,i),n.index=0}}function Re(e,t,r,s,a){if(r===e._updateTick)return;e._updateTick=r,e.didChange=!1,s||=e._worldTransformDirty,a||=e._worldVisibleDirty,a&&(e._worldVisible=t._worldVisible*e._visible,e._storeWorldVisible()),e._worldVisible&&s&&(e._localTransformDirty&&(e.updateLocalTransform(),e._localTransformDirty=!1),M.multiplyAffine(e.worldTransform.elements,0,t.worldTransform.elements,0,e.localTransform.elements,0),e._worldTransformId++,e._storeWorldTransform()),e._worldVisibleDirty=!1,e._worldTransformDirty=e._worldVisible?!1:s;const n=e.children,o=n.length;for(let i=0;i<o;i++)Re(n[i],e,r,s,a)}function Ss(e,t,r){fr(e),ir(e),rt(e.camera,r);const s=st(e.camera).frame;if(s.width<=0||s.height<=0)return!1;e._syncShadowSampling(),hr(e),t._morphStoreBuffer.sync(e._morphedMeshes.items),mr(e,t),_r(e,t),br(e,t),pr(e);const a=e._meshBatches;for(let n=0;n<a.length;n++)a[n].applyEdits();return!0}function hr(e){e._bonePit.clear();const t=e._skinnedMeshes.items;for(let r=0;r<e._skinnedMeshes.items.length;r++){const s=t[r],a=s.skeleton;a.updateWorld();const n=e._bonePit.add(a);s._lastBonePitIndex!==n&&(s._lastBonePitIndex=n,s._markStoreDirty())}e._bonePit.update()}function mr(e,t){const r=t.geometryDataStoreBuffer,s=e._renderablesToUpdate,a=s.list,n=s.index;for(let i=0;i<n;i++){const l=a[i];if(l.didRenderableUpdate=!1,l._view3d!==e)continue;const c=l.material,d=l.renderPassMask;d!==l._lastRenderPass&&e._sceneBatch.setPassesAt(e._meshSlots.getIndex(l),d);let u=!1;if(l._lastDescriptorDirtyId!==c._descriptorDirtyId&&(u=l._lastDescriptorDirtyId!==-1,l._lastDescriptorDirtyId=c._descriptorDirtyId,l._batchDirty=!0),l._lastRenderPass===0)continue;const f=l.geometry,h=f._geometryAtlasAllocation===null&&!f.dynamic;if(l._batchDirty||h){l._batchDirty=!1,u||=h&&f._atlasVacated,t.renderer.material3d.ensureMaterial(l,e._sceneBatch,e),f.dynamic||(f._geometryAtlasAllocation=t.atlasPool.allocate(f)),r.set(f);let p=l.renderPassMask&e._dirtyHookBits;for(;p;){const _=p&-p;e.passByBit[_].onRenderableDirty(l,e._sceneBatch,u),p^=_}}l._storeDirty&&(l._storeDirty=!1,e._sceneBatch.storeBuffer.set(l))}const o=s.index-n;for(let i=0;i<o;i++)a[i]=a[n+i];De(a,o),s.index=o,e._sceneBatch.storeBuffer.update()}function _r(e,t){const r=t.geometryDataStoreBuffer;for(let s=1;s<e._meshBatches.length;s++){const a=e._meshBatches[s];a.writeBatchWorldMatrix(a.renderData.worldTransform);const n=a._dirtyIndices,o=a._dirtyCount;for(let i=0;i<o;i++){const l=a.items[n[i]];l._batchDirty=!1;const c=l._lastRenderPass;if(c===0)continue;const d=l.material;let u=l.geometry._geometryAtlasAllocation===null&&!l.geometry.dynamic&&l.geometry._atlasVacated;l._lastDescriptorDirtyId!==d._descriptorDirtyId&&(u||=l._lastDescriptorDirtyId!==-1,l._lastDescriptorDirtyId=d._descriptorDirtyId),t.renderer.material3d.ensureMaterial(l,a,e),l.geometry.dynamic||(l.geometry._geometryAtlasAllocation=t.atlasPool.allocate(l.geometry)),r.set(l.geometry),a.storeBuffer.u32Data[l._storeIndex*24+17]=d._materialIndex,a.storeBuffer.u32Data[l._storeIndex*24+18]=l.geometry._geometryDataIndex,a.storeBuffer.markDirty(l._storeIndex);let f=c&e._dirtyHookBits;for(;f;){const h=f&-f;e.passByBit[h].onRenderableDirty(l,a,u),f^=h}}a._dirtyCount=0,a.storeBuffer.update(),a.instanceStoreBuffer?.update()}}function br(e,t){const r=t.geometryDataStoreBuffer,s=t.atlasPool.bufferVersion;if(e._lastAtlasBufferVersion!==s){e._lastAtlasBufferVersion=s;const a=e._morphedMeshes.items;for(let n=0;n<a.length;n++)r.set(a[n].geometry)}}function pr(e){for(let r=0;r<e._meshBatches.length;r++){const s=e._meshBatches[r],a=s.storeBuffer.bufferVersion;s._lastStoreBufferVersion!==a&&(s._lastStoreBufferVersion=a,s.invalidateDrawCaches())}const t=e._bonePit.bufferVersion;e._lastBonePitBufferVersion!==t&&(e._lastBonePitBufferVersion=t,e._invalidateDrawCaches())}var Cs=class{globalUniformGroup;globalBindGroup;globalTextureBindings;lastMaterialStoreBufferVersion=-1;lastAtlasBufferVersion=-1;lastMorphStoreBufferVersion=-1;lastGeometryStoreBufferVersion=-1;_destroyed=!1;constructor(e,t,r){this.globalUniformGroup=e,this.globalBindGroup=t,this.globalTextureBindings=r}destroy(){this._destroyed||(this._destroyed=!0,this.globalBindGroup.destroy(),this.globalUniformGroup.buffer?.destroy())}};export{zr as $,Zr as A,ts as B,Nr as C,Wr as D,Ar as E,Mr as F,Jr as G,Tr as H,Gr as I,Lr as J,Br as K,rs as L,Vr as M,vs as N,ws as O,Dr as P,Fr as Q,es as R,ns as S,Er as T,Rr as U,Cs as V,Ss as W,Ir as X,as as Y,ss as Z,gs as _,Qr as a,Or as a0,hs as b,Pr as c,bs as d,ps as e,cs as f,us as g,ys as h,fs as i,xs as j,kr as k,_s as l,Hr as m,Kr as n,ms as o,is as p,Xr as q,ds as r,$r as s,qr as t,os as u,Yr as v,ls as w,jr as x,Ur as y,Ht as z};
