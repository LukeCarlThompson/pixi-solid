import{C as e,D as t,H as n,V as r,c as i,i as a,k as o,l as s,m as c,n as l,s as u,w as d}from"./CanvasPool-DtqSaXnh.js";import{P as f}from"./dist-BWyuAgmK.js";import{f as p,r as m}from"./Filter-tmaoo_H6.js";import{r as h}from"./EventSystem-C-891Yha.js";import{_ as g,a as _,o as v}from"./RenderTargetSystem-CXGlBGSL.js";import{t as y}from"./GCManagedHash-iaZqB6Fm.js";import{n as b}from"./getTexelRangeRects-7j664Y_P.js";import{$ as x,B as ee,Bt as te,D as ne,E as re,Gt as S,H as C,Ht as w,It as ie,Kt as T,Lt as ae,O as oe,R as se,Rt as ce,T as E,Ut as le,V as ue,Wt as D,Y as de,Yt as fe,at as O,ct as k,dt as pe,ft as me,j as he,lt as ge,nt as _e,rt as ve,s as ye,t as be,tt as A,u as xe,w as Se,xt as Ce,y as we,z as Te}from"./Container3D-6nYjydl4.js";var Ee=.1,j=new S,M=new S,N=new Float64Array(4);function De(e,t,n,r,i){i.length=n;for(let a=1;a<=n;a++){let o=a/n,s=e*(t/e)**+o,c=e+(t-e)*o;i[a-1]=r*s+(1-r)*c}return i}function Oe(e,t){j.getInverse(e.viewProjection),M.multiplyMatrices(t,j)}function ke(e,t){let n=M.elements,r=1/0,i=-1/0,a=0,o=0;for(let s=0;s<2;s++){let c=s===0?e:t;for(let e=-1;e<=1;e+=2)for(let t=-1;t<=1;t+=2){let s=n[0]*t+n[4]*e+n[8]*c+n[12],l=n[1]*t+n[5]*e+n[9]*c+n[13],u=n[2]*t+n[6]*e+n[10]*c+n[14],d=n[3]*t+n[7]*e+n[11]*c+n[15],f=u/d;a+=s/d,o+=l/d,f<r&&(r=f),f>i&&(i=f)}}N[0]=r,N[1]=i,N[2]=a*.125,N[3]=o*.125}function P(e,t){let n=e.projection.elements;return(n[10]*-t+n[14])/(n[11]*-t+n[15])}function F(e,t,n){let r=e.elements,i=1/(t-n);r[10]=i,r[14]=t*i}function I(e,t,n){let r=2*t/n;return Math.floor(e/r)*r}function Ae(e,t,n,r,i,a=!0){ke(P(e,t),P(e,n));let o=e.projection.elements,s=e.mode===`orthographic`?1:n,c=s/o[5],l=s/o[0],u=(n-t)*.5,d=Math.sqrt(l*l+c*c+u*u),f=-N[1]-d*R,p=-N[0],m=I(N[2],d,i),h=I(N[3],d,i);r.makeOrthographic(m-d,m+d,h+d,h-d,f,p),a&&F(r,f,p)}var L=new D,R=4;function je(e,t,n,r,i=!0){e.applyMatrix4(t,L);let{min:a,max:o}=L,s=(o.x-a.x)*.5*1.1,c=(o.y-a.y)*.5*1.1,l=I((a.x+o.x)*.5,s,r),u=I((a.y+o.y)*.5,c,r),d=-o.z-Math.max(s,c)*R,f=-a.z;n.makeOrthographic(l-s,l+s,u+c,u-c,d,f),i&&F(n,d,f)}function Me(e,t,n){return new s({uGlobalLightParams:{value:new Float32Array([0,0,0,0]),type:`vec4<f32>`},uTime:{value:0,type:`f32`},uFogColor:{value:new Float32Array([0,0,0]),type:`vec3<f32>`},uDisplayExposure:{value:1,type:`f32`},uFogParams:{value:new Float32Array([0,0,0]),type:`vec3<f32>`},uExposure:{value:1,type:`f32`},uHemisphereSky:{value:new Float32Array([0,0,0]),type:`vec3<f32>`},uHemisphereGround:{value:new Float32Array([0,0,0]),type:`vec3<f32>`},uHemisphereUp:{value:new Float32Array([0,1,0]),type:`vec3<f32>`},...n,uLightData:{value:e,type:`vec4<f32>`,size:128},uShadowData:{value:t,type:`vec4<f32>`,size:96}},{isStatic:!0,ubo:!0})}var Ne={transform:`mat4x4<f32>`,bonePitIndex:`u32`,materialIndex:`u32`,geometryDataIndex:`u32`,visibility:`u32`,morphWeightIndex:`u32`},Pe={boundsCenter:`vec3<f32>`,boundsRadius:`f32`,morphDeltaBase:`u32`,morphTargetCount:`u32`,baseVertex:`u32`,_pad:`u32`},Fe={id:`u32`},Ie={rows:`mat3x4<f32>`},Le={position:`vec3<f32>`,kind:`f32`,color:`vec3<f32>`,rangeSq:`f32`,direction:`vec3<f32>`,coneCos:`f32`,innerConeCos:`f32`,shadowDataIndex:`f32`,cascadeCount:`f32`,radiusPow4:`f32`},Re={position:`vec3<f32>`,type:`f32`,color:`vec3<f32>`,rangeSq:`f32`,direction:`vec3<f32>`,coneCos:`f32`,innerConeCos:`f32`,shadowDataIndex:`f32`,radiusPow4:`f32`},ze={lightSpaceMatrix:`mat4x4<f32>`,shadowParams:`vec4<f32>`,cascadeSplits:`vec4<f32>`},Be=class{globalUniformGroup;globalBindGroup;globalTextureBindings;lastMaterialStoreBufferVersion=-1;lastAtlasBufferVersion=-1;lastMorphStoreBufferVersion=-1;lastGeometryStoreBufferVersion=-1;_destroyed=!1;constructor(e,t,n){this.globalUniformGroup=e,this.globalBindGroup=t,this.globalTextureBindings=n}destroy(){this._destroyed||(this._destroyed=!0,this.globalBindGroup.destroy(),this.globalUniformGroup.buffer?.destroy())}},Ve={hard:[[0,0]],pcf:[[-1,-1],[1,-1],[-1,1],[1,1]],"pcf-high":[[-2,-2],[0,-2],[2,-2],[-2,0],[0,0],[2,0],[-2,2],[0,2],[2,2]]};function He(e,t,n){let r=n;if(!r?.type)throw Error(`[ShaderBit:${e}] overrideDefs.${t} missing 'type'.`);let i=Object.prototype.hasOwnProperty.call(r,`default`),a=r.required===!0;if(i&&a)throw Error(`[ShaderBit:${e}] overrideDefs.${t} cannot specify both 'default' and 'required: true'.`);if(!i&&!a)throw Error(`[ShaderBit:${e}] overrideDefs.${t} must specify either 'default' or 'required: true'.`);if(a)return{type:r.type,required:!0};if(typeof r.default!=`number`||!Number.isFinite(r.default))throw Error(`[ShaderBit:${e}] overrideDefs.${t}.default must be a finite number.`);return{type:r.type,default:r.default,required:!1}}function Ue(e){let t=Object.create(null);for(let n of e)if(n.overrideDefs)for(let[e,r]of Object.entries(n.overrideDefs)){let i=He(n.name,e,r),a=t[e];if(a&&(a.type!==i.type||a.required!==i.required||!a.required&&a.default!==i.default))throw Error(`[ShaderBit overrides] Duplicate override '${e}' has conflicting definitions.\nExisting: ${JSON.stringify(a)}\nNew (from '${n.name}'): ${JSON.stringify(i)}`);t[e]=a??i}return t}function We(e,t){return e===`u32`?`${Math.trunc(t)}u`:e===`i32`?`${Math.trunc(t)}`:Number.isInteger(t)?`${t}.0`:`${t}`}function Ge(e){let t=[];for(let n of Object.keys(e).sort()){let r=e[n];if(r.required)t.push(`override ${n}: ${r.type};`);else{let e=We(r.type,r.default);t.push(`override ${n}: ${r.type} = ${e};`)}}return t.length?t.join(`
`):``}function Ke(e,t){return e===`u32`||e===`i32`?`${Math.trunc(t)}`:Number.isInteger(t)?`${t}.0`:`${t}`}function qe(e,t){let n=[];for(let r of Object.keys(e).sort()){let i=e[r],a=t[r],o=a!==void 0;if(i.required&&!o)throw Error(`[glslOverrides] required override '${r}' has no value supplied via descriptor.overrides.`);let s=o?a:i.default;n.push(`#define ${r} ${Ke(i.type,s)}`)}return n.length?n.join(`
`):``}function Je(e,t,n){let r={};for(let i of e){let e=i[t]?.[n];if(e)for(let[t,n]of Object.entries(e))n&&(r[t]??=[],r[t].push(n))}return r}var Ye=/\{\{(.*?)\}\}/g;function Xe(e){let t={};return(e.match(Ye)?.map(e=>e.replace(/[{()}]/g,``))??[]).forEach(e=>{t[e]=[]}),t}var z=new Map;function Ze(e){let t=z.get(e);return t||(t=new Set(Object.keys(Xe(e))),z.set(e,t)),t}function Qe(e){return e.includes(`u32`)?`u32`:e.includes(`i32`)?`i32`:`f32`}function $e(e,t){let n=x(e),r=new Map;for(let e of n.elements){if(t&&!t.has(e.name))continue;let n=e.offset/4,i=Math.floor(n/4),a=n%4,o=e.components===4?``:`.${`xyzw`.slice(a,a+e.components)}`,s=r.get(i);s||r.set(i,s=[]),s.push({name:e.name,type:e.type,scalar:Qe(e.type),swizzle:o})}return r}function et(e){for(let t=0;t<e.length;t++)if(e[t].bindings?.instance)return!0;return!1}function tt(e){return`vInstance_${e}`}var nt=/\binstance\b(?:\s*\.\s*([A-Za-z]\w*))?/g,rt=/\/\/[^\n]*|\/\*[\s\S]*?\*\//g;function B(e,t,n,r,i){for(let a of e){let e=a[t]?.[n];if(e)for(let t in e){let n=e[t];if(n)for(let e of n.replace(rt,``).matchAll(nt))if(e[1]===void 0)for(let e in r)i.add(e);else e[1]in r&&i.add(e[1])}}}function it(e,t,n,r){if(!n){let t=e.find(e=>e.bindings?.instance);throw Error(`[instanceData] Bit "${t?.name}" reads instance data, but the mesh it draws has none. Draw it as a BatchedMesh3D slot and declare the fields in the batch's instanceData option.`)}let i={};for(let t of e){let e=t.bindings?.instance;if(e)for(let{name:r,spec:a}of pe(e,`instance`)){let e=me(a),o=n.struct[r];if(o!==e)throw Error(`[instanceData] Bit "${t.name}" reads instance.${r} as ${e}, but the batch `+(o?`declares it as ${o}.`:`has no such field. Its instanceData is: ${n.key}.`));i[r]=o}}let a=new Set;B(e,t,`fragment`,i,a);let o=new Set(a);B(e,t,`vertex`,i,o);let s={layout:n,loaded:o,varyings:[...a]};return at(r,t,s),s}function at(e,t,n){let r=n.varyings.length>0,i=null;if(t===`gpu`){let t=e.gpu??``;t.includes(`{{vertexStoreAccess}}`)?r&&!t.includes(`{{fragmentStoreAccess}}`)&&(i=`{{fragmentStoreAccess}}`):i=`{{vertexStoreAccess}}`}else e.gl?.vertex.includes(`{{storeAccess}}`)?r&&!e.gl.fragment.includes(`{{storeAccess}}`)&&(i=`{{storeAccess}} in its fragment source`):i=`{{storeAccess}} in its vertex source`;if(i)throw Error(`[instanceData] A bit reads instance data, but the shader template has no ${i}. Add the slot where the draw's store row is in scope, or use the material's own template.`)}var V=/\{\{(.*?)\}\}/g,H=8;function ot(e,t){let n=e;for(let e=0;e<H;e++){let e=n.replace(V,(e,n)=>{let r=t[n];return r?r.join(`
`):``});if(e===n)break;n=e}let r=n.match(V);if(r){let e=[...new Set(r)].join(`, `);throw Error(`[fillTemplateSlots] Slot markers still present after ${H} substitution passes: ${e}. A slot's code reintroduces its own marker (directly or via another slot) — break the cycle.`)}return n}function st(e,t){for(let n of t)n.collectData?.(e);for(let n of t)n.preCompile?.(e);let n={};for(let r of t){let t=r.injectCode?.(e);if(t)for(let[e,r]of Object.entries(t))r&&/\S/.test(r)&&(n[e]??=[],n[e].push(r))}return ot(e.templateString,n)}function U(e,t,n){if(n.has(e))return;n.add(e);let r=e.requires;if(r)for(let e=0;e<r.length;e++)U(r[e],t,n);t.push(e)}function ct(e){let t=[],n=new Set;for(let r=0;r<e.length;r++)U(e[r],t,n);return t}function lt(e,t){return e===`gpu`&&!t?`cpu`:e}var ut={},dt={forward:5e4,shadow:2e4},W;function ft(e){let t=ut[e];return t===void 0?(W??=h.apple.device||f(),W?dt[e]:0):t}var G=new Float32Array(24);function pt(e,t){let n=t[0],r=t[1],i=t[2],a=t[4],o=t[5],s=t[6],c=t[8],l=t[9],u=t[10],d=t[12],f=t[13],p=t[14];if(n===1&&o===1&&u===1&&r===0&&i===0&&a===0&&s===0&&c===0&&l===0&&d===0&&f===0&&p===0)return e;for(let t=0;t<6;t++){let m=t*4,h=e[m],g=e[m+1],_=e[m+2],v=n*h+r*g+i*_,y=a*h+o*g+s*_,b=c*h+l*g+u*_,x=1/Math.sqrt(v*v+y*y+b*b);G[m]=v*x,G[m+1]=y*x,G[m+2]=b*x,G[m+3]=(d*h+f*g+p*_+e[m+3])*x}return G}var K=new Map;function mt(e,t){let n=de(e).length,r=t===`direct`&&Object.keys(ge(e)).length>0,i=`${n}|${t}|${r}`,a=K.get(i);if(a)return a;let o=Object.fromEntries(Array.from({length:n},(e,t)=>t).flatMap(e=>[[`uMaterialTexture${e}`,`texture_2d<f32>`],[`uMaterialSampler${e}`,`sampler`]]));return r&&(o.material=`uniform<Material>`),a={name:`materialBindings:${n}:${t}${r?`:material`:``}`,bindings:{batch:o}},K.set(i,a),a}var ht={name:`alphaOpaque`,gpu:{fragment:{end:`
  alpha = 1.0;
`}},gl:{fragment:{end:`
  alpha = 1.0;
`}}},gt={name:`camera`,bindings:{camera:{uCameraPosition:`vec3<f32>`,uViewMatrix:`mat4x4<f32>`,uProjectionMatrix:`mat4x4<f32>`,uViewProjectionMatrix:`mat4x4<f32>`,uPreviousViewProjectionMatrix:`mat4x4<f32>`,uViewportUVScale:`vec2<f32>`,uLightTileTransform:`vec4<f32>`,uLightTiles:`array<vec4<i32>, 36>`,uLightDepthMasks:`array<vec4<i32>, 8>`,uLightDepthPlane:`vec4<f32>`}}};function q(e,t,n,r){let i=`
fn decodeColor(c: vec3<f32>) -> vec3<f32> { return ${t.replace(`VEC3`,`vec3<f32>`)}; }
fn inputTint(linearTint: vec4<f32>, displayTint: vec4<f32>) -> vec4<f32> { return ${n}Tint; }
fn inputExposure(linearExposure: f32, displayExposure: f32) -> f32 { return ${n}Exposure; }
fn decodeFrame(c: vec3<f32>) -> vec3<f32> { return ${r.replace(`VEC3`,`vec3<f32>`)}; }
`,a=`
vec3 decodeColor(vec3 c) { return ${t.replace(`VEC3`,`vec3`)}; }
vec4 inputTint(vec4 linearTint, vec4 displayTint) { return ${n}Tint; }
float inputExposure(float linearExposure, float displayExposure) { return ${n}Exposure; }
vec3 decodeFrame(vec3 c) { return ${r.replace(`VEC3`,`vec3`)}; }
`;return{name:e,gpu:{header:i},gl:{header:a}}}var _t=q(`colorSpaceLinear`,`pow(c, VEC3(2.2))`,`linear`,`pow(c, VEC3(2.2))`),vt=q(`colorSpaceLinearFrames`,`pow(c, VEC3(2.2))`,`linear`,`c`),J=q(`colorSpaceDisplay`,`c`,`display`,`c`);function yt(e,t,n){if(!t)return vt;let r=e._skipsToneCurve||t===he;return e.colorSpace===`display`&&!e.lit&&r&&!n?J:_t}var bt={name:`doubleSidedNormal`,gpu:{fragment:{material:`
  normal = select(-normal, normal, input.frontFacing);
`}},gl:{fragment:{material:`
  if (!gl_FrontFacing) {
    normal = -normal;
  }
`}}},xt={name:`flatShading`,gpu:{fragment:{material:`
  let flatNormal = normalize(cross(dpdx(input.vPosition), dpdy(input.vPosition)));
  normal = select(-flatNormal, flatNormal, dot(flatNormal, normal) >= 0.0);
`}},gl:{fragment:{material:`
  vec3 flatNormal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
  normal = dot(flatNormal, normal) >= 0.0 ? flatNormal : -flatNormal;
`}}},Y=`
  worldNormal = bbRight * normal.x + bbUp * normal.y + bbNormal * normal.z;
`,St=`
  worldNormal = bbRight * normal.x + bbUp * normal.y + bbNormal * normal.z;
`;function Ct(e){return`
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
${e?Y:``}`}function wt(e){return`
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
${e?St:``}`}function Tt(e){return`
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
${e?Y:``}`}function Et(e){return`
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
${e?St:``}`}var Dt=Object.create(null);function Ot(e,t){let n=`${e}:${t}`,r=Dt[n];if(r)return r;if(e===`none`)throw Error(`[meshBillboardBits] billboardMode 'none' has no bit — the caller must skip injection.`);let i=e===`spherical`,a={name:`meshBillboard${i?`Spherical`:`Cylindrical`}${t?`Lit`:``}`,gpu:{vertex:{afterTransform:i?Ct(t):Tt(t)}},gl:{vertex:{afterTransform:i?wt(t):Et(t)}}};return Dt[n]=a,a}var kt={name:`normal`,attributes:{aNormal:`float32x3`},gpu:{vertex:{input:`normal = input.aNormal;`}},gl:{vertex:{input:`normal = aNormal;`}}},At={name:`normalMapping`,requires:[se],gpu:{fragment:{material:`
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
`}}},jt={name:`no-shadow`,gpu:{header:`
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
    `}},Mt=Object.create(null);function Nt(e){let t=Mt[e];if(t)return t;if(c(e).size<3)throw Error(`[positionBit] aPosition needs three components, got ${e}`);let n=e===`float32x3`?`aPosition`:`aPosition.xyz`,r={name:`position:${e}`,attributes:{aPosition:e},gpu:{vertex:{input:`position = vec4<f32>(vec3<f32>(input.${n}), 1.0);`}},gl:{vertex:{input:`position = vec4(vec3(${n}), 1.0);`}}};return Mt[e]=r,r}var Pt={name:`tangentNormalMapping`,attributes:{aTangent:`float32x4`},interStage:{vTangent:`vec3<f32>`,vBitangent:`vec3<f32>`},gpu:{vertex:{input:`
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
`}}},Ft=Object.create(null);function It(e){let t=Ft[e];if(t)return t;let n={name:`uvs:${e}`,overrideDefs:{HAS_UVS:{type:`u32`,required:!0}},attributes:{aUV:e},gpu:{vertex:{input:`uv = vec2<f32>(input.aUV);`}},gl:{vertex:{input:`uv = vec2(aUV);`}}};return Ft[e]=n,n}var Lt={name:`vertexColor`,attributes:{aColor:`float32x4`},interStage:{vColor:`vec4<f32>`},gpu:{vertex:{end:`output.vColor = input.aColor;`},fragment:{material:`albedo *= input.vColor.rgb;
  alpha *= input.vColor.a;`}},gl:{vertex:{end:`vColor = aColor;`},fragment:{material:`albedo *= vColor.rgb;
  alpha *= vColor.a;`}}},Rt={preCompile(e){let t=e.data.structs;t?.Material&&(t.Material=ge(e.bits))}},zt=new S,X=new T,Bt=new re,Vt=new D,Ht=new T,Ut=.001,Wt=.15,Gt=3,Kt=50,qt=.15,Z=256,Jt=`Shadow: shadow.bounds and shadow.cascades are both set — cascades take precedence and the bounds box is ignored. Use bounds for a fixed region or cascades for a camera-following shadow, not both.`,Yt=`Shadow auto-fit box spans a large scene, so shadows may look soft. Raise view3d.shadowQuality, set light.shadow.bounds to the area that needs shadows, or, for a scene the camera roams across, enable cascades: light.shadow.cascades = 3.`,Xt=`Too many shadow maps for the shadow budget of 16: each shadow-casting light takes one, or one per cascade. Lights past the budget render without shadows.`,Zt=class extends Ce{_renderTarget=null;_layerCount=0;_quality=`medium`;_frameCount=0;_hasCastersValue=!1;_hasCastersFrame=-1;_sceneCasterBounds=new D;_sceneBoundsFrame=-1;_destroyed=!1;targetVersion=0;_view3d=null;shadowMapHandle;constructor(e){super(e),this.shadowMapHandle=e.shadowMapHandle}get renderTarget(){return this._renderTarget===null&&(this._renderTarget=te(this._quality,Math.max(this._layerCount,1))),this._renderTarget}_growAtlas(e){e<=this._layerCount||(this._layerCount=Math.min(e,16),this._releaseTarget())}set quality(e){e!==this._quality&&(this._quality=e,this._releaseTarget())}get quality(){return this._quality}beginFrame(e){this._view3d=e,this.quality=e.shadowQuality,this._frameCount++,e._shadowDataList.reset()}unload(){this._releaseTarget()}_releaseTarget(){let e=this._renderTarget;if(!e)return;this._renderTarget=null,this.targetVersion++,this._view3d&&this._bindShadowSource(this._view3d,fe.source);let t=e.depthStencilTexture;e.destroy(),t.destroy()}_bindShadowSource(e,t){let{group:n,slot:r}=e._graph.globalTextureBindings.shadowMap;n.getResource(r)!==t&&(n.setResource(t,r),e._invalidateBundleCaches())}setup(e){e.produce(this.shadowMapHandle)}condition(e){let t=e.lights;for(let n=0;n<t.length;n++)if(t[n].canCastShadow)return this._hasCasters(e.view3d);return!1}_hasCasters(e){if(this._hasCastersFrame===this._frameCount)return this._hasCastersValue;this._hasCastersFrame=this._frameCount;let t=e._meshBatches,n=!1;for(let e=0;e<t.length&&!n;e++)n=(t[e].drawLists[this.bit]?.view.count??0)>0;return this._hasCastersValue=n,n}getShadowGPUData(e){return e._gpuShadowData??={inverseLightMatrix:new S,lightProjectionMatrix:new S,targetVersion:this.targetVersion}}_cascadeSlot(e,t){let n=this.getShadowGPUData(e).cascades??=[];return n[t]??={cameraData:new ne,bias:0,normalBias:0,mapSize:0,cascadeCount:0,splits:null,needsRender:!0}}_commitCascadeCamera(e,t,n){zt.getInverse(t),zt.extractPosition(X);let r=e.cameraData;r.set(X,t,n),r.frustum.setFromProjectionMatrix(r.viewProjection)}updateLightShadowData(e,t){if(!e.canCastShadow)return;let n=t.camera,r=this.getShadowGPUData(e),{inverseLightMatrix:i,lightProjectionMatrix:a}=r,o=r.targetVersion!==this.targetVersion,s=ie[this._quality],c=e._shadowRefreshRequested,l=e.shadow.update,u=e.shadow.bias??Ut;if(e.type===`spot`||e.shadow.cascades===void 0){let n=this._cascadeSlot(e,0),r=ce(w(l,0),this._frameCount,c);if(!r){if(e.type===`spot`)le(e,i,a,this._applyZRangeFix),this._commitCascadeCamera(n,i,a),n.normalBias=e.shadow.normalBias??Wt;else{let r=e.shadow.bounds??this._resolveAutoShadowBounds(e,t,s);r!==void 0&&!r.isEmpty()&&(i.getInverse(e.worldTransform),je(r,i,a,s,this._applyZRangeFix),this._commitCascadeCamera(n,i,a),n.normalBias=this._resolveNormalBias(e,a,s))}}n.bias=u,n.mapSize=s,n.cascadeCount=0,n.splits=null,n.needsRender=o||!r;return}e.shadow.bounds!==void 0&&k(`pixijs-3d-shadow-bounds-cascades`,Jt),i.getInverse(e.worldTransform);let d=ae(e),f=e.shadow.lambda,p=Math.min(e.shadow.maxDistance??Kt,n.far),m=this._cascadeSlot(e,0),h=m.splits??=[];De(n.near,p,d,f,h),Oe(n,i);for(let t=0;t<d;t++){let r=t===0?m:this._cascadeSlot(e,t),f=ce(w(l,t),this._frameCount,c);f||(Ae(n,t===0?n.near:h[t-1],h[t],a,s,this._applyZRangeFix),this._commitCascadeCamera(r,i,a),r.normalBias=this._resolveNormalBias(e,a,s)),r.bias=u,r.mapSize=s,r.cascadeCount=t===0&&d>1?d:0,t>0&&(r.splits=null),r.needsRender=o||!f}}_completeShadowUpdate(e){e._gpuShadowData&&(e._gpuShadowData.targetVersion=this.targetVersion),e._shadowRefreshRequested=!1}_resolveAutoShadowBounds(e,t,n){let r=this._countSceneCasters(t),i=e._autoShadowBounds;if(r>Z&&e._autoShadowBoundsFrozen)return i??void 0;let a=this._ensureSceneCasterBounds(t);if(a.isEmpty())return i??void 0;let o=i??(e._autoShadowBounds=new D);return o.copyFrom(a),r<=Z?e._autoShadowBoundsFrozen=!1:(e._autoShadowBoundsFrozen=!0,k(`pixijs-3d-shadow-autofit-cap`,`Shadow auto-fit: ${r} shadow casters is over the auto-measure cap (${Z}), so the shadow box was fitted once and frozen. If casters move or spawn outside it, set shadow.bounds, enable shadow.cascades, or call light.fitShadowBounds() after changes.`)),this._warnIfShadowBoxLarge(o,n),o}_countSceneCasters(e){let t=0,n=e._meshBatches;for(let e=0;e<n.length;e++){let r=n[e];if(!r.renderData._worldVisible)continue;let i=r.drawLists[this.bit];i&&(t+=i.view.count)}return t}_ensureSceneCasterBounds(e){if(this._sceneBoundsFrame===this._frameCount)return this._sceneCasterBounds;this._sceneBoundsFrame=this._frameCount;let t=this._sceneCasterBounds.makeEmpty(),n=e._meshBatches;for(let e=0;e<n.length;e++){let r=n[e];if(!r.renderData._worldVisible)continue;let i=r.drawLists[this.bit];if(!i||i.view.count===0)continue;let a=e===0?null:r.renderData.worldTransform,o=i.view.items,s=i.view.renderableIndices;for(let e=0;e<i.view.count;e++){let n=o[s[e]];if(n._worldVisible===0)continue;let r=n.boundingSphere;if(r.radius<0)continue;let i=a?r.applyMatrix4(a,Bt):r;t.union(i.getBounds(Vt))}}return t}_warnIfShadowBoxLarge(e,t){if(e.isEmpty())return;let n=e.getSize(Ht);Math.max(n.x,n.y,n.z)/t>qt&&k(`pixijs-3d-shadow-autofit-large`,Yt)}_resolveNormalBias(e,t,n){return e.shadow.normalBias===void 0?Gt*(2/(t.elements[0]*n)):e.shadow.normalBias}prepareShadow(e,t){let n=t._shadowDataList,r=this._claimShadowSlots(e,t,n.count);if(r===0)return;this._growAtlas(n.count+r),this.updateLightShadowData(e,t);let i=this.getShadowGPUData(e).cascades;for(let e=0;e<r;e++)n.add(i[e])}_claimShadowSlots(e,t,n){let r=e.canCastShadow&&this._hasCasters(t),i=ae(e);return r&&n+i<=16?(e._shadowDataIndex=n,i):(r&&k(`pixijs-3d-shadow-budget`,Xt),e._shadowDataIndex=-1,0)}destroy(){this._destroyed||(this._destroyed=!0,this._view3d=null,this._releaseTarget(),super.destroy())}},Qt=(e,t,n,r,i)=>{let{center:a,radius:o}=e.boundsSphere;if(t[i]=a.x,t[i+1]=a.y,t[i+2]=a.z,t[i+3]=e.dynamic?-1:o+e._morphBoundsExpansion,e.morphTargetCount>0){let t=e._morphDeltaBase>=0;n[i+4]=t?e._morphDeltaBase:0,n[i+5]=t?e.morphTargetCount:0,n[i+6]=t&&e._geometryAtlasAllocation?.baseVertex||0}},$t=class extends Te{constructor(e=100){super({stride:8,indexKey:`_geometryDataIndex`,copier:Qt,initialSize:e})}set(e){let t=e._geometryDataStore;return t!==this&&(t?.remove(e),e._geometryDataStore=this),super.set(e)}},en=class extends b{constructor(e){super(e),this.buffer.off(`change`,this.onBufferChange,this)}},tn=1024,Q=16;function nn(e,t){let n=e,r=t;for(;r;)[n,r]=[r,n%r];return e/n*t}var rn=class{data;_retiredTextures=[];texture;_buffer=null;_retiredBuffers=[];_alignment=0;_texelsPerUnit=0;_end=0;_freePlaces=new Map;_dirtyQueue=[];_dirtyCount=0;_ranges=new Uint32Array(64);bufferVersion=0;_bufferCallBytes=0;constructor(e){let{alignment:n,rendererType:r}=e;if(!(n>0))throw Error(`MaterialDataStoreBuffer: renderer.limits.minUniformBufferOffsetAlignment is ${n}; the limits system fills it in after the renderer has a context`);this._alignment=nn(n,Q),this._texelsPerUnit=this._alignment/Q,this._bufferCallBytes=r===u.WEBGPU?ee:1/0,this.data=new Float32Array(A(tn*4)),this.texture=new t({source:_e(this.data)})}enqueueDirty(e){this.data&&!e._storeQueued&&(e._storeQueued=!0,this._dirtyQueue[this._dirtyCount++]=e)}register(e){let t=e._uploadQueue;(t!==this||e._materialIndex===-1)&&(t&&t!==this&&t.remove(e),e._uploadQueue=this,e._storeQueued=!1,this._allocate(e),this.enqueueDirty(e))}remove(e){let t=e._materialIndex;if(t<0||(e._materialIndex=-1,!this.data))return;let n=this._units(e),r=this._freePlaces.get(n);r||this._freePlaces.set(n,r=[]),r.push(t)}uniformResource(e){let t=this._buffer??=new C({data:this.data,usage:a.UNIFORM|a.COPY_DST,label:`MaterialStore`}),n=e._materialIndex*Q,r=e._uniformResource;return r&&r.buffer===t&&r.offset===n?r:(r?.destroy(!1),r=e._uniformResource=new en({buffer:t,offset:n,size:this._units(e)*this._alignment}),r)}update(){let e=this._dirtyQueue,t=this._dirtyCount;if(t===0)return;this._dirtyCount=0;let n=this.data,r=0,i=0,a=1/0,o=-1/0;for(let s=0;s<t;s++){let t=e[s];if(e[s]=null,t._uploadQueue!==this)continue;t._storeQueued=!1;let c=t.data._f32,l=t._materialIndex*4,u=l+c.length;if(n.set(c,l),r*2+2>this._ranges.length){let e=new Uint32Array(this._ranges.length*2);e.set(this._ranges),this._ranges=e}this._ranges[r*2]=l,this._ranges[r*2+1]=u,r++,i+=u-l,l<a&&(a=l),u>o&&(o=u)}if(r===0)return;let s=this._ranges,c=(o-a)*4,l=i*4,u=this.texture.source;if(r*16384+l<c)for(let e=0;e<r;e++)O(u,s[e*2],s[e*2+1]);else O(u,a,o);let d=this._buffer;if(d){if(c>=ue&&r*this._bufferCallBytes+l<c)for(let e=0;e<r;e++){let t=s[e*2];d.update((s[e*2+1]-t)*4,t*4)}else d.update(c,a*4)}}destroy(){if(this.data){this._buffer?.destroy();for(let e=0;e<this._retiredBuffers.length;e++)this._retiredBuffers[e].destroy();for(let e=0;e<this._retiredTextures.length;e++)this._retiredTextures[e].destroy(!0);this.texture.destroy(!0),this.data=null,this._buffer=null,this._retiredBuffers=null,this._retiredTextures=null,this.texture=null,this._freePlaces=null,this._dirtyQueue=null,this._dirtyCount=0,this._ranges=null}}_units(e){return Math.ceil(e.data._f32.byteLength/this._alignment)}_allocate(e){if(e._materialIndex>=0)return;let t=this._units(e),n=this._freePlaces.get(t)?.pop();if(n===void 0){let e=(this._end+t)*this._alignment;e>this.data.byteLength&&this._expand(e/4),n=this._end*this._texelsPerUnit,this._end+=t}e._materialIndex=n}_expand(e){let n=this.data.length*2;n<e&&(n=e),n=A(n);let r=new Float32Array(n);r.set(this.data),this.data=r,this._retiredTextures.push(this.texture),this.texture=new t({source:_e(this.data)}),this._buffer&&=(this._retiredBuffers.push(this._buffer),null),this.bufferVersion++}},an=4,on=class{data;_buffer=null;_bufferResource=null;bufferVersion=0;_deltaCursor=0;_deltaCapacity=0;_weightCursor=0;_freeSlots=new Map;_freeDeltaBlocks=new Map;_minDirty=1/0;_maxDirty=-1/0;_retiredBuffers=[];_texture=null;_textureSource=null;constructor(e={}){this._deltaCapacity=e.deltaCapacity??4096;let t=cn(this._deltaCapacity,e.weightCapacity??1024);this.data=new Float32Array(this._deltaCapacity+t)}get buffer(){return this._buffer??=new C({data:this.data,usage:a.STORAGE|a.COPY_DST|a.COPY_SRC,label:`MorphStoreBuffer`,shrinkToFit:!1})}get bufferResource(){return this._bufferResource??=new b({buffer:this.buffer})}get texture(){return this._texture||this._initTexture()}uploadDeltas(e){let t=e._morphStore;if(t===this)return;if(t){t.freeDeltas(e),d(`MorphStoreBuffer: geometry #${e.uid} was packed by another renderer and draws unmorphed here`);return}let n=e._morphTargets;if(!n||n.length===0)return;let r=e.hasMorphNormals,i=r?8:an,a=n.length,o=n[0].positions.length/3,s=o*a*i,c=this._freeDeltaBlocks.get(s),l;c&&c.length>0?l=c.pop():(l=this._deltaCursor,l+s>this._deltaCapacity&&this._growArena(l+s),this._deltaCursor+=s);let u=new Float64Array(a),f=this.data;for(let e=0;e<o;e++){let t=e*3;for(let o=0;o<a;o++){let s=l+(e*a+o)*i,c=n[o].positions,d=c[t],p=c[t+1],m=c[t+2];f[s]=d,f[s+1]=p,f[s+2]=m,f[s+3]=0;let h=d*d+p*p+m*m;if(h>u[o]&&(u[o]=h),r){let e=n[o].normals;f[s+4]=e[t],f[s+5]=e[t+1],f[s+6]=e[t+2],f[s+7]=0}}}let p=0;for(let e=0;e<a;e++)p+=Math.sqrt(u[e]);e._morphBoundsExpansion=p,e._morphDeltaBase=l,e._morphDeltaFloats=s,e._morphStore=this,e._morphTargets=null,this._markDirty(l,l+s-1)}freeDeltas(e){let t=e._morphDeltaBase;if(t<0)return;let n=e._morphDeltaFloats;e._morphDeltaBase=-1,e._morphDeltaFloats=0,e._morphStore=null,this.data&&sn(this._freeDeltaBlocks,n,t)}sync(e){for(let t=0;t<e.length;t++)this.uploadDeltas(e[t].geometry);let t=this._deltaCapacity;for(let n=0;n<e.length;n++){let r=e[n],i=r._morph;i._store!==this&&(i._store?.freeSlot(i),this.allocSlot(i));let a=t+i._slot;i._weightIndex!==a&&(i._weightIndex=a,r._markStoreDirty()),this.writeWeights(i)}this.update()}allocSlot(e){let t=1;for(;t<e.weights.length;)t<<=1;let n=this._freeSlots.get(t),r;n&&n.length>0?r=n.pop():(r=this._weightCursor,this._deltaCapacity+r+t>this.data.length&&this._growWeights(r+t),this._weightCursor+=t),e._slot=r,e._slotSize=t,e._store=this}freeSlot(e){let t=e._slot;if(t<0)return;let n=e._slotSize;e._slot=-1,e._slotSize=0,e._store=null,this.data&&sn(this._freeSlots,n,t)}writeWeights(e){let t=e.weights,n=this.data,r=this._deltaCapacity+e._slot,i=Math.min(t.length,e._slotSize),a=!1;for(let e=0;e<i;e++){let i=t[e];n[r+e]!==i&&(n[r+e]=i,a=!0)}a&&this._markDirty(r,r+i-1)}update(){this._minDirty>this._maxDirty||(this._buffer?.update((this._maxDirty-this._minDirty+1)*4,this._minDirty*4),this._textureSource&&O(this._textureSource,this._minDirty,this._maxDirty+1),this._minDirty=1/0,this._maxDirty=-1/0)}_freeRetired(){for(let e=0;e<this._retiredBuffers.length;e++)this._retiredBuffers[e].destroy();this._retiredBuffers.length=0}destroy(){this.data&&(this._bufferResource?.destroy(!1),this._buffer?.destroy(),this._freeRetired(),this._texture?.destroy(!0),this._texture=null,this._textureSource=null,this.data=null,this._buffer=null,this._bufferResource=null)}_markDirty(e,t){e<this._minDirty&&(this._minDirty=e),t>this._maxDirty&&(this._maxDirty=t)}_growArena(e){let t=this._deltaCapacity;for(;t<e;)t*=2;this._reallocate(t,this.data.length-this._deltaCapacity)}_growWeights(e){let t=this.data.length-this._deltaCapacity;for(;t<e;)t*=2;this._reallocate(this._deltaCapacity,t)}_reallocate(e,t){t=cn(e,t);let n=new Float32Array(e+t);if(n.set(this.data.subarray(0,this._deltaCursor),0),n.set(this.data.subarray(this._deltaCapacity,this._deltaCapacity+this._weightCursor),e),this.data=n,this._deltaCapacity=e,this._buffer&&(this._retiredBuffers.push(this._buffer),this._buffer=null,this._bufferResource=null),this.bufferVersion++,this._textureSource){let{width:e,height:t}=ve(this.data.length);this._textureSource.resource=this.data,(this._textureSource.width!==e||this._textureSource.height!==t)&&this._textureSource.resize(e,t),this._textureSource.update()}}_initTexture(){let{width:e,height:n}=ve(this.data.length);return this._textureSource=new o({resource:this.data,width:e,height:n,format:`rgba32float`,scaleMode:`nearest`,alphaMode:`no-premultiply-alpha`}),this._texture=new t({source:this._textureSource}),this._texture}};function sn(e,t,n){let r=e.get(t);r||(r=[],e.set(t,r)),r.push(n)}function cn(e,t){let n=e+t;return t+(A(n)-n)}function ln(e,t,n,r,i){let a=!1;return n.lastAtlasBufferVersion!==e.bufferVersion&&(n.lastAtlasBufferVersion=e.bufferVersion,a=!0),n.lastMaterialStoreBufferVersion!==t.bufferVersion&&(n.lastMaterialStoreBufferVersion=t.bufferVersion,a=!0),n.lastMorphStoreBufferVersion!==r.bufferVersion&&(n.lastMorphStoreBufferVersion=r.bufferVersion,a=!0),i&&n.lastGeometryStoreBufferVersion!==i.bufferVersion&&(n.lastGeometryStoreBufferVersion=i.bufferVersion,a=!0),a}var un={bindGroups:[`local`],gpu:{bindGroups:[`local`],gpu:`
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
`}.gpu,gl:{bindGroups:[`local`],gl:{vertex:`#version 300 es
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
    `}}.gl};function dn(e){let{renderer:n}=e,r=e.size??256,a=e.sampleCount??1024,o={name:`brdfLut`,requires:[Se],attributes:{aPosition:`float32x2`},interStage:{vUv:`vec2<f32>`},bindings:{local:{sampleCount:`f32`}}},c=new i({local:new s({sampleCount:{value:a,type:`f32`}})}),l=n.material3d.compileIsolatedShader([o],un,{0:c}),u=_.create({width:r,height:r,format:`rg16float`}).source,d=new t({source:u}),f=E(),p=n.renderTarget.renderTarget?n.renderTarget.getBindState():null;return n.renderTarget.bind({target:u,clear:!0}),n.encoder.draw({geometry:f,shader:l,state:m.default2d}),p&&n.renderTarget.bind(p),c.destroy(),l.destroy(),d}var $={target:null,clear:g.NONE},fn=new n,pn={name:`colorOutputDraw`,attributes:{aPosition:`float32x2`},bindings:{local:{uSource:`texture_2d<f32>`,uOffset:`vec2<f32>`}}},mn={bindGroups:[`local`],gpu:`
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
`}},hn=class{_renderer;_uniforms=new s({uOffset:{value:new Float32Array(2),type:`vec2<f32>`}});_bindGroup;_shaders=new Map;_state;constructor(e){this._renderer=e,this._bindGroup=new i({local:this._uniforms,uSource:t.WHITE.source});let n=new m;n.blend=!1,n.depthTest=!1,n.depthMask=!1,n.culling=!1,this._state=n}draw(e,n,r,i){let a=this._renderer,{viewport:o}=n,s=r.frame,c=r.source.resolution,l=Math.round(s.x*c),u=Math.round(s.y*c),d=this._uniforms.uniforms.uOffset;d[0]=o.x-l,d[1]=o.y-u,this._uniforms.update();let f=`uniformBatch`in a.renderPipes?a.renderPipes.uniformBatch.getUboResource(this._uniforms):this._uniforms;this._bindGroup.setResource(f,`local`),this._bindGroup.setResource(n.target.colorTexture,`uSource`);let p=this._shaders.get(i);p||(p=a.material3d.compileIsolatedShader([pn,...we(i)],mn,{0:this._bindGroup}),this._shaders.set(i,p)),$.target=r,$.clear=r.noFrame?g.COLOR:g.NONE,a.renderTarget.bind($),$.target=null,e.setViewport(fn.set(l,u,o.width,o.height)),e.renderGeometry(E(),p,this._state),this._bindGroup.setResource(t.WHITE.source,`uSource`)}destroy(){for(let e of this._shaders.values())e.destroy();this._shaders=null,this._bindGroup.destroy()}};function gn(e){return(e.cache??(e.sort===`key`?`auto`:`never`))===`auto`}function _n(e,t,n){let r=n.x,i=n.y,a=n.z,o=e.items,s=e.renderableIndices,c=e.count;for(let e=0;e<c;e++){let n=o[s[e]],c=n._storeIndex*24,l=t[c+12]-r,u=t[c+13]-i,d=t[c+14]-a;n._sortKey=-(l*l+u*u+d*d)}e.sortForced(e=>e._sortKey)}function vn(e,t){let n=t.x,r=t.y,i=t.z,a=e.items,o=e.renderableIndices,s=e.count;for(let e=0;e<s;e++){let t=a[o[e]],s=t.worldTransform.elements,c=s[12]-n,l=s[13]-r,u=s[14]-i;t._sortKey=-(c*c+l*l+u*u)}e.sortForced(e=>e._sortKey)}function yn(e,t,n,r){let i=t.x,a=t.y,o=t.z,s=r.elements,c=e.items,l=e.renderableIndices,u=e.count;for(let e=0;e<u;e++){let t=c[l[e]],r=t._storeIndex*24,u=n[r+12],d=n[r+13],f=n[r+14],p=s[0]*u+s[4]*d+s[8]*f+s[12],m=s[1]*u+s[5]*d+s[9]*f+s[13],h=s[2]*u+s[6]*d+s[10]*f+s[14],g=p-i,_=m-a,v=h-o;t._sortKey=-(g*g+_*_+v*v)}e.sortForced(e=>e._sortKey)}var bn=class{_managedViews;constructor(e){this._managedViews=new y({renderer:e,type:`renderable`,name:`view3d`}),p.on(`evict`,this._releasePooledTextures)}_releasePooledTextures=()=>{let e=this._managedViews.items;for(let t in e){let n=e[t];n&&n._releasePooledTextures()}};track(e){this._managedViews.add(e)}destroy(){p.off(`evict`,this._releasePooledTextures);let e=Object.values(this._managedViews.items);for(let t=0;t<e.length;t++)e[t]?.unload();this._managedViews.destroy()}},xn=1024,Sn=2048,Cn=class{uid=r(`geometryAtlas`);attributeKey;vertexStride=0;_vertexBuffer;_indexBuffer;_retiredBuffers=[];_retiredGeometries=[];_vertexCount=0;_indexCount=0;_deadVertexCount=0;_deadIndexCount=0;_liveAllocations=[];_vertexDirtyMin=1/0;_vertexDirtyMax=-1/0;_indexDirtyMin=1/0;_indexDirtyMax=-1/0;_bufferVersion=0;geometry;_attributeInfo;rebaseIndices;constructor(e){let{referenceGeometry:t,initialVertexCapacity:n=xn,initialIndexCapacity:r=Sn,rebaseIndices:i=!1}=e;this.rebaseIndices=i,this.attributeKey=t.attributeKey;let o=t.attributes,s=Object.keys(o).sort();if(!s.some(e=>!o[e].instance))throw Error(`GeometryAtlas: reference geometry has no vertex attributes`);let l=0;this._attributeInfo=[];for(let e of s){let t=o[e];if(t.instance)continue;let n=t.format,r=c(n).stride;l=xe(l);let i=l;l+=r,this._attributeInfo.push({name:e,format:n,offset:i,byteSize:r})}this.vertexStride=xe(l),this._vertexBuffer=new C({data:new Uint8Array(n*this.vertexStride),usage:a.VERTEX|a.COPY_DST,label:`GeometryAtlas-vertex`,shrinkToFit:!1}),this._indexBuffer=new C({data:new Uint32Array(r),usage:a.INDEX|a.COPY_DST,label:`GeometryAtlas-index`,shrinkToFit:!1}),this.geometry=this._buildMergedGeometry()}add(e){let t=e._geometryAtlasAllocation;if(t&&t.atlas===this)return t;for(let t in e.attributes)if(e.attributes[t].instance)throw Error(`GeometryAtlas: Cannot add geometry with instance attribute "${t}". The Atlas is for merging vertex data only; instance data would be lost.`);if(e.attributeKey!==this.attributeKey)throw Error(`GeometryAtlas: attribute structure mismatch. Expected "${this.attributeKey}", got "${e.attributeKey}"`);let n=e.vertexCount,r=e.indexBuffer.data,i=r.length,a=this._vertexBuffer.data.byteLength/this.vertexStride,o=this._indexBuffer.data.length,s=this._vertexCount+n>a,c=this._indexCount+i>o;if(s||c){let e=this._vertexCount-this._deadVertexCount,t=this._indexCount-this._deadIndexCount,r=e+n<=a,s=t+i<=o;r&&s?this.defragment():((this._deadVertexCount>0||this._deadIndexCount>0)&&this.defragment(),this._ensureVertexCapacity(this._vertexCount+n),this._ensureIndexCapacity(this._indexCount+i))}let l=this._vertexCount,u=this._indexCount;this._vertexCount+=n,this._indexCount+=i;let d=this._vertexBuffer.data,f=this._indexBuffer.data,p=this.vertexStride,m=l*p,h=n*p;if(this._matchesAtlasLayout(e)){let t=e.attributes[this._attributeInfo[0].name].buffer.data;d.set(new Uint8Array(t.buffer,t.byteOffset,h),m)}else{let t=new Uint32Array(d.buffer);for(let{name:r,offset:i,byteSize:a}of this._attributeInfo){let o=e.attributes[r],s=o.buffer.data,c=o.stride??a,l=o.offset??0;if((s.byteOffset|l|c|a)&3){let e=new Uint8Array(s.buffer,s.byteOffset,s.byteLength),t=l,r=m+i;for(let i=0;i<n;i++){for(let n=0;n<a;n++)d[r+n]=e[t+n];t+=c,r+=p}}else{let e=new Uint32Array(s.buffer,s.byteOffset,s.byteLength>>2),r=c>>2,o=p>>2,u=l>>2,d=m+i>>2;for(let i=0;i<n;i++)t[d]=e[u],a>4&&(t[d+1]=e[u+1]),a>8&&(t[d+2]=e[u+2]),a>12&&(t[d+3]=e[u+3]),u+=r,d+=o}}}if(this._markVertexDirty(m,m+h),this.rebaseIndices)for(let e=0;e<i;e++)f[u+e]=r[e]+l;else f.set(r,u);this._markIndexDirty(u,u+i);let g={atlas:this,baseVertex:l,firstIndex:u,indexCount:i,vertexCount:n};return e._geometryAtlasAllocation=g,e._atlasVacated=!1,this._liveAllocations.push(g),g}remove(e){let t=e._geometryAtlasAllocation;if(!t||(e._geometryAtlasAllocation=null,e._atlasVacated=!0,this._vertexBuffer===null))return;this._deadVertexCount+=t.vertexCount,this._deadIndexCount+=t.indexCount;let n=this._liveAllocations.indexOf(t);n!==-1&&this._liveAllocations.splice(n,1)}update(){if(this._vertexDirtyMin<this._vertexDirtyMax){let e=this._vertexDirtyMax-this._vertexDirtyMin;this._vertexBuffer.update(e,this._vertexDirtyMin),this._vertexDirtyMin=1/0,this._vertexDirtyMax=-1/0}if(this._indexDirtyMin<this._indexDirtyMax){let e=this._indexDirtyMin*4,t=(this._indexDirtyMax-this._indexDirtyMin)*4;this._indexBuffer.update(t,e),this._indexDirtyMin=1/0,this._indexDirtyMax=-1/0}}_matchesAtlasLayout(e){let t=e.attributes,n=t[this._attributeInfo[0].name].buffer;for(let e of this._attributeInfo){let r=t[e.name];if(r.buffer!==n||r.stride!==this.vertexStride||(r.offset??0)!==e.offset)return!1}return!0}_buildMergedGeometry(){let e=new l;for(let{name:t,format:n,offset:r}of this._attributeInfo)e.addAttribute(t,{buffer:this._vertexBuffer,format:n,stride:this.vertexStride,offset:r});return e.addIndex(this._indexBuffer),e}_markVertexDirty(e,t){e<this._vertexDirtyMin&&(this._vertexDirtyMin=e),t>this._vertexDirtyMax&&(this._vertexDirtyMax=t)}_markIndexDirty(e,t){e<this._indexDirtyMin&&(this._indexDirtyMin=e),t>this._indexDirtyMax&&(this._indexDirtyMax=t)}_retireCurrentGeometry(){this.geometry&&(this.geometry.indexBuffer=null,this._retiredGeometries.push(this.geometry))}_ensureVertexCapacity(e){let t=this._vertexBuffer.data,n=t.byteLength/this.vertexStride;if(e<=n)return;for(;n<e;)n*=2;let r=new Uint8Array(n*this.vertexStride);r.set(t),this._retiredBuffers.push(this._vertexBuffer),this._vertexBuffer=new C({data:r,usage:a.VERTEX|a.COPY_DST,label:`GeometryAtlas-vertex`,shrinkToFit:!1}),this._markVertexDirty(0,this._vertexCount*this.vertexStride),this._retireCurrentGeometry(),this.geometry=this._buildMergedGeometry(),this._bufferVersion++}_ensureIndexCapacity(e){let t=this._indexBuffer.data,n=t.length;if(e<=n)return;for(;n<e;)n*=2;let r=new Uint32Array(n);r.set(t),this._retiredBuffers.push(this._indexBuffer),this._indexBuffer=new C({data:r,usage:a.INDEX|a.COPY_DST,label:`GeometryAtlas-index`,shrinkToFit:!1}),this._markIndexDirty(0,this._indexCount),this._retireCurrentGeometry(),this.geometry=this._buildMergedGeometry(),this._bufferVersion++}destroy(){if(this._vertexBuffer!==null){this.geometry&&(this.geometry.indexBuffer=null),this.geometry?.destroy(!1),this.geometry=null,this._vertexBuffer.destroy(),this._indexBuffer.destroy();for(let e=0;e<this._retiredGeometries.length;e++)this._retiredGeometries[e].destroy(!1);this._retiredGeometries=null;for(let e=0;e<this._retiredBuffers.length;e++)this._retiredBuffers[e].destroy();this._retiredBuffers=null,this._vertexBuffer=null,this._indexBuffer=null,this._liveAllocations=null}}defragment(){if(this._deadVertexCount===0&&this._deadIndexCount===0)return;let e=this.vertexStride,t=this._vertexBuffer.data,n=this._indexBuffer.data,r=0,i=0,a=this.rebaseIndices;for(let o of this._liveAllocations){let s=o.baseVertex;if(s!==r){let n=s*e,i=r*e,a=o.vertexCount*e;t.copyWithin(i,n,n+a),o.baseVertex=r}if(r+=o.vertexCount,o.firstIndex!==i&&(n.copyWithin(i,o.firstIndex,o.firstIndex+o.indexCount),o.firstIndex=i),a&&s!==o.baseVertex){let e=o.baseVertex-s;for(let t=0;t<o.indexCount;t++)n[o.firstIndex+t]+=e}i+=o.indexCount}this._markVertexDirty(0,r*e),this._markIndexDirty(0,i),this._vertexCount=r,this._indexCount=i,this._deadVertexCount=0,this._deadIndexCount=0,this._bufferVersion++}},wn=Object.create(null),Tn=class t{_atlases=Object.create(null);_rebaseIndices;_bufferVersion=0;constructor(e){this._rebaseIndices=e.rebaseIndices}static from(n){let r=n.rebaseIndices?`rebased`:`geometryLocal`,i=wn[r];return i||(i=new t(n),wn[r]=i,e.register(i)),i}get bufferVersion(){return this._bufferVersion}allocate(e){let t=e.attributeKey,n=this._atlases[t],r=e._geometryAtlasAllocation;if(r&&r.atlas===n)return r;n||(n=new Cn({referenceGeometry:e,rebaseIndices:this._rebaseIndices}),this._atlases[t]=n);let i=n._bufferVersion,a=n.add(e);return n._bufferVersion!==i&&this._bufferVersion++,a}update(){for(let e in this._atlases)this._atlases[e].update()}clear(){for(let e in this._atlases)this._atlases[e].destroy();this._atlases=Object.create(null)}};function En(e){let{camera:t}=e;if(t._view3d!==e)throw Error(`Camera3D is no longer in the View3D scene graph. Don't remove an assigned camera from its parent without reassigning view3d.camera.`);if(t.renderTexture)throw Error(`The View3D's own camera draws the view, not a texture. Put the render texture on a second camera and draw from it with a pass that names that camera.`);if(!t.visible||t._worldVisible===0)throw Error(`Camera3D is hidden (visible=false or an ancestor is hidden). Cannot render with a hidden camera.`)}var Dn=(()=>{let e=new be;return e._worldVisible=1,e})();function On(e){let t=e._childrenToUpdate,n=e._updateTick++;for(let r in t){let i=Number(r),a=t[r],o=a.list,s=a.index;for(let t=0;t<s;t++){let r=o[t];r._view3d===e&&r._relativeSceneDepth===i&&kn(r,r.parent??Dn,n,!1,!1)}v(o,s),a.index=0}}function kn(e,t,n,r,i){if(n===e._updateTick)return;e._updateTick=n,e.didChange=!1,r||=e._worldTransformDirty,i||=e._worldVisibleDirty,i&&(e._worldVisible=t._worldVisible*e._visible,e._storeWorldVisible()),e._worldVisible&&r&&(e._localTransformDirty&&=(e.updateLocalTransform(),!1),S.multiplyAffine(e.worldTransform.elements,0,t.worldTransform.elements,0,e.localTransform.elements,0),e._worldTransformId++,e._storeWorldTransform()),e._worldVisibleDirty=!1,e._worldTransformDirty=!e._worldVisible&&r;let a=e.children,o=a.length;for(let t=0;t<o;t++)kn(a[t],e,n,r,i)}function An(e,t,n){On(e),En(e),ye(e.camera,n);let r=oe(e.camera).frame;if(r.width<=0||r.height<=0)return!1;e._syncShadowSampling(),jn(e),t._morphStoreBuffer.sync(e._morphedMeshes.items),Mn(e,t),Nn(e,t),Pn(e,t),Fn(e);let i=e._meshBatches;for(let e=0;e<i.length;e++)i[e].applyEdits();return!0}function jn(e){e._bonePit.clear();let t=e._skinnedMeshes.items;for(let n=0;n<e._skinnedMeshes.items.length;n++){let r=t[n],i=r.skeleton;i.updateWorld();let a=e._bonePit.add(i);r._lastBonePitIndex!==a&&(r._lastBonePitIndex=a,r._markStoreDirty())}e._bonePit.update()}function Mn(e,t){let n=t.geometryDataStoreBuffer,r=e._renderablesToUpdate,i=r.list,a=r.index;for(let r=0;r<a;r++){let a=i[r];if(a.didRenderableUpdate=!1,a._view3d!==e)continue;let o=a.material,s=a.renderPassMask;s!==a._lastRenderPass&&e._sceneBatch.setPassesAt(e._meshSlots.getIndex(a),s);let c=!1;if(a._lastDescriptorDirtyId!==o._descriptorDirtyId&&(c=a._lastDescriptorDirtyId!==-1,a._lastDescriptorDirtyId=o._descriptorDirtyId,a._batchDirty=!0),a._lastRenderPass===0)continue;let l=a.geometry,u=l._geometryAtlasAllocation===null&&!l.dynamic;if(a._batchDirty||u){a._batchDirty=!1,c||=u&&l._atlasVacated,t.renderer.material3d.ensureMaterial(a,e._sceneBatch,e),l.dynamic||(l._geometryAtlasAllocation=t.atlasPool.allocate(l)),n.set(l);let r=a.renderPassMask&e._dirtyHookBits;for(;r;){let t=r&-r;e.passByBit[t].onRenderableDirty(a,e._sceneBatch,c),r^=t}}a._storeDirty&&(a._storeDirty=!1,e._sceneBatch.storeBuffer.set(a))}let o=r.index-a;for(let e=0;e<o;e++)i[e]=i[a+e];v(i,o),r.index=o,e._sceneBatch.storeBuffer.update()}function Nn(e,t){let n=t.geometryDataStoreBuffer;for(let r=1;r<e._meshBatches.length;r++){let i=e._meshBatches[r];i.writeBatchWorldMatrix(i.renderData.worldTransform);let a=i._dirtyIndices,o=i._dirtyCount;for(let r=0;r<o;r++){let o=i.items[a[r]];o._batchDirty=!1;let s=o._lastRenderPass;if(s===0)continue;let c=o.material,l=o.geometry._geometryAtlasAllocation===null&&!o.geometry.dynamic&&o.geometry._atlasVacated;o._lastDescriptorDirtyId!==c._descriptorDirtyId&&(l||=o._lastDescriptorDirtyId!==-1,o._lastDescriptorDirtyId=c._descriptorDirtyId),t.renderer.material3d.ensureMaterial(o,i,e),o.geometry.dynamic||(o.geometry._geometryAtlasAllocation=t.atlasPool.allocate(o.geometry)),n.set(o.geometry),i.storeBuffer.u32Data[o._storeIndex*24+17]=c._materialIndex,i.storeBuffer.u32Data[o._storeIndex*24+18]=o.geometry._geometryDataIndex,i.storeBuffer.markDirty(o._storeIndex);let u=s&e._dirtyHookBits;for(;u;){let t=u&-u;e.passByBit[t].onRenderableDirty(o,i,l),u^=t}}i._dirtyCount=0,i.storeBuffer.update(),i.instanceStoreBuffer?.update()}}function Pn(e,t){let n=t.geometryDataStoreBuffer,r=t.atlasPool.bufferVersion;if(e._lastAtlasBufferVersion!==r){e._lastAtlasBufferVersion=r;let t=e._morphedMeshes.items;for(let e=0;e<t.length;e++)n.set(t[e].geometry)}}function Fn(e){for(let t=0;t<e._meshBatches.length;t++){let n=e._meshBatches[t],r=n.storeBuffer.bufferVersion;n._lastStoreBufferVersion!==r&&(n._lastStoreBufferVersion=r,n.invalidateDrawCaches())}let t=e._bonePit.bufferVersion;e._lastBonePitBufferVersion!==t&&(e._lastBonePitBufferVersion=t,e._invalidateDrawCaches())}export{ze as $,mt as A,Ze as B,Ot as C,yt as D,J as E,st as F,Ve as G,Ue as H,tt as I,Pe as J,Be as K,et as L,lt as M,pt as N,gt as O,ct as P,Ne as Q,it as R,kt as S,bt as T,qe as U,Je as V,Ge as W,Le as X,Re as Y,Fe as Z,It as _,vn as a,jt as b,hn as c,on as d,Me as et,rn as f,Lt as g,Rt as h,yn as i,ft as j,ht as k,dn as l,Zt as m,Tn as n,_n as o,$t as p,Ie as q,bn as r,gn as s,An as t,Ee as tt,ln as u,Pt as v,xt as w,At as x,Nt as y,$e as z};