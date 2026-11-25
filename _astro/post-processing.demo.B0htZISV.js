import{M as e,T as t,l as n}from"./CanvasPool.IN5fI3JC.js";import{t as r}from"./pixi-canvas.CjyKCql-.js";import{b as i}from"./DemoMount.astro_astro_type_script_index_0_lang.BSIN7oNQ.js";import"./lib.J5WdxiT7.js";import{r as a}from"./Filter.4sZeBhwB.js";import{D as o,O as s,P as c,i as l,k as u,n as d,o as f,s as p,t as m}from"./dist.B6ct--nN.js";import{C as h}from"./Container3D.4-tQT7-L.js";import{t as g}from"./instanceFetchBitGl.kFvfgMgW.js";import{t as _}from"./on-tick.CrdChtQl.js";import{t as v}from"./use-pixi-screen.D0afJkZ9.js";import{i as y,n as b,s as x}from"./resources.CZHu7hwc.js";import{t as S}from"./orbit-camera.DihV5Rpb.js";var C=class extends s{name;_options;constructor(e){super(e),this.name=e.name,this._options=e}get stage(){return this._options.stage??(this._options.camera?.renderTexture?`beforeOpaque`:`afterOpaque`)}build(e,t){let n=this._options;e.addPass(new c({renderer:t.renderer,name:n.name,description:n.description,descriptor:n.descriptor,sort:n.sort??`key`,camera:n.camera}))}},w={gpu:`
fn effect(uv: vec2<f32>) -> vec4<f32> {
  let t = inputTexel();
  let c = 0.25 * (sampleColor(uv + vec2<f32>(-t.x, -t.y)) + sampleColor(uv + vec2<f32>(t.x, -t.y))
    + sampleColor(uv + vec2<f32>(-t.x, t.y)) + sampleColor(uv + vec2<f32>(t.x, t.y)));
  let threshold = fx.uBloom.x;
  let knee = fx.uBloom.y;
  let brightness = max(c.r, max(c.g, c.b));
  var soft = clamp(brightness - threshold + knee, 0.0, 2.0 * knee);
  soft = soft * soft / (4.0 * knee + 0.00001);
  let contribution = max(soft, brightness - threshold) / max(brightness, 0.00001);
  return vec4<f32>(c.rgb * contribution, 1.0);
}
`,gl:`
vec4 effect(vec2 uv) {
  vec2 t = inputTexel();
  vec4 c = 0.25 * (sampleColor(uv + vec2(-t.x, -t.y)) + sampleColor(uv + vec2(t.x, -t.y))
    + sampleColor(uv + vec2(-t.x, t.y)) + sampleColor(uv + vec2(t.x, t.y)));
  float threshold = uBloom.x;
  float knee = uBloom.y;
  float brightness = max(c.r, max(c.g, c.b));
  float soft = clamp(brightness - threshold + knee, 0.0, 2.0 * knee);
  soft = soft * soft / (4.0 * knee + 0.00001);
  float contribution = max(soft, brightness - threshold) / max(brightness, 0.00001);
  return vec4(c.rgb * contribution, 1.0);
}
`},T={gpu:`
fn effect(uv: vec2<f32>) -> vec4<f32> {
  let t = inputTexel();
  let a = sampleColor(uv + vec2<f32>(-2.0, 2.0) * t).rgb;
  let b = sampleColor(uv + vec2<f32>(0.0, 2.0) * t).rgb;
  let c = sampleColor(uv + vec2<f32>(2.0, 2.0) * t).rgb;
  let d = sampleColor(uv + vec2<f32>(-2.0, 0.0) * t).rgb;
  let e = sampleColor(uv).rgb;
  let f = sampleColor(uv + vec2<f32>(2.0, 0.0) * t).rgb;
  let g = sampleColor(uv + vec2<f32>(-2.0, -2.0) * t).rgb;
  let h = sampleColor(uv + vec2<f32>(0.0, -2.0) * t).rgb;
  let i = sampleColor(uv + vec2<f32>(2.0, -2.0) * t).rgb;
  let j = sampleColor(uv + vec2<f32>(-1.0, 1.0) * t).rgb;
  let k = sampleColor(uv + vec2<f32>(1.0, 1.0) * t).rgb;
  let l = sampleColor(uv + vec2<f32>(-1.0, -1.0) * t).rgb;
  let m = sampleColor(uv + vec2<f32>(1.0, -1.0) * t).rgb;
  let color = e * 0.125 + (a + c + g + i) * 0.03125 + (b + d + f + h) * 0.0625 + (j + k + l + m) * 0.125;
  return vec4<f32>(color, 1.0);
}
`,gl:`
vec4 effect(vec2 uv) {
  vec2 t = inputTexel();
  vec3 a = sampleColor(uv + vec2(-2.0, 2.0) * t).rgb;
  vec3 b = sampleColor(uv + vec2(0.0, 2.0) * t).rgb;
  vec3 c = sampleColor(uv + vec2(2.0, 2.0) * t).rgb;
  vec3 d = sampleColor(uv + vec2(-2.0, 0.0) * t).rgb;
  vec3 e = sampleColor(uv).rgb;
  vec3 f = sampleColor(uv + vec2(2.0, 0.0) * t).rgb;
  vec3 g = sampleColor(uv + vec2(-2.0, -2.0) * t).rgb;
  vec3 h = sampleColor(uv + vec2(0.0, -2.0) * t).rgb;
  vec3 i = sampleColor(uv + vec2(2.0, -2.0) * t).rgb;
  vec3 j = sampleColor(uv + vec2(-1.0, 1.0) * t).rgb;
  vec3 k = sampleColor(uv + vec2(1.0, 1.0) * t).rgb;
  vec3 l = sampleColor(uv + vec2(-1.0, -1.0) * t).rgb;
  vec3 m = sampleColor(uv + vec2(1.0, -1.0) * t).rgb;
  vec3 color = e * 0.125 + (a + c + g + i) * 0.03125 + (b + d + f + h) * 0.0625 + (j + k + l + m) * 0.125;
  return vec4(color, 1.0);
}
`},E={gpu:`
fn effect(uv: vec2<f32>) -> vec4<f32> {
  let o = 0.5 * inputTexel();
  let tent = 0.25 * (sampleColor(uv + vec2<f32>(-o.x, -o.y)) + sampleColor(uv + vec2<f32>(o.x, -o.y))
    + sampleColor(uv + vec2<f32>(-o.x, o.y)) + sampleColor(uv + vec2<f32>(o.x, o.y)));
  let radius = fx.uBloomUp.x;
  return vec4<f32>(tent.rgb * radius, radius);
}
`,gl:`
vec4 effect(vec2 uv) {
  vec2 o = 0.5 * inputTexel();
  vec4 tent = 0.25 * (sampleColor(uv + vec2(-o.x, -o.y)) + sampleColor(uv + vec2(o.x, -o.y))
    + sampleColor(uv + vec2(-o.x, o.y)) + sampleColor(uv + vec2(o.x, o.y)));
  float radius = uBloomUp.x;
  return vec4(tent.rgb * radius, radius);
}
`},D={gpu:`
fn effect(uv: vec2<f32>) -> vec4<f32> {
  let base = sampleColor(uv);
  return vec4<f32>(base.rgb + sampleColor2(uv).rgb * fx.uBloomCombine.x, base.a);
}
`,gl:`
vec4 effect(vec2 uv) {
  vec4 base = sampleColor(uv);
  return vec4(base.rgb + sampleColor2(uv).rgb * uBloomCombine.x, base.a);
}
`},O=class t extends o{static defaultOptions={threshold:1,intensity:1,radius:.6,levels:5,resolution:.5};levels=0;resolution=0;_brightUniforms=new n({uBloom:{value:new Float32Array(4),type:`vec4<f32>`}});_upUniforms=new n({uBloomUp:{value:new Float32Array(4),type:`vec4<f32>`}});_combineUniforms=new n({uBloomCombine:{value:new Float32Array(4),type:`vec4<f32>`}});constructor(n={}){let{threshold:r,intensity:i,radius:a,levels:o,resolution:s,...c}={...t.defaultOptions,...e(n)};super(c),this.levels=Math.max(1,Math.round(o)),this.resolution=s,this.threshold=r,this.intensity=i,this.radius=a}build(e,t){let n=e.sceneIsLinear?h(t.renderer):void 0,r=[];for(let t=0;t<this.levels;t++)r.push(e.createColor({resolution:this.resolution/2**t,format:n,label:`bloomLevel${t}`}));e.addPass(new u({renderer:t.renderer,label:`bloom:bright`,fragment:w,uniforms:this._brightUniforms,reads:{color:t.input},writes:r[0]}));for(let n=1;n<this.levels;n++)e.addPass(new u({renderer:t.renderer,label:`bloom:down${n}`,fragment:T,reads:{color:r[n-1]},writes:r[n]}));for(let n=this.levels-2;n>=0;n--)e.addPass(new u({renderer:t.renderer,label:`bloom:up${n}`,fragment:E,uniforms:this._upUniforms,reads:{color:r[n+1]},writes:r[n],blendMode:`normal`}));e.addPass(new u({renderer:t.renderer,label:`bloom:combine`,fragment:D,uniforms:this._combineUniforms,reads:{color:t.input,color2:r[0]},writes:t.output}))}get threshold(){return this._brightUniforms.uniforms.uBloom[0]}set threshold(e){this.writeLane(this._brightUniforms,`uBloom`,0,e),this.writeLane(this._brightUniforms,`uBloom`,1,e*.5)}get intensity(){return this._combineUniforms.uniforms.uBloomCombine[0]}set intensity(e){this.writeLane(this._combineUniforms,`uBloomCombine`,0,e)}get radius(){return this._upUniforms.uniforms.uBloomUp[0]}set radius(e){this.writeLane(this._upUniforms,`uBloomUp`,0,e)}},k={bindGroups:[{name:`global`,ubo:!0},`camera`],gpu:`
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
  var normal = input.aNormal;
  var tangent = vec3<f32>(0.0);

  let renderable = uRenderableStorage[uRenderableInstanceStorage[ii].id];
  let batchWorldMatrix = uRenderableStorage[0].transform;
  var modelMatrix = batchWorldMatrix * renderable.transform;

  {{vertexInput}}

  position = vec4<f32>(position.xyz + normalize(normal) * SOLID_EXTRUDE, 1.0);

  let worldPosition = modelMatrix * position;
  output.position = camera.uViewProjectionMatrix * worldPosition;

  {{vertexEnd}}

  return output;
}

@fragment
fn mainFragment(input: FragmentInput) -> @location(0) vec4<f32> {
  return vec4<f32>(SOLID_R, SOLID_G, SOLID_B, 1.0);
}
`,gl:{vertex:`#version 300 es

{{header}}

void main() {
  mat4 modelMatrix;
  vec4 position;
  vec3 normal = aNormal;
  vec3 tangent = vec3(0.0);

  {{input}}

  position.xyz += normalize(normal) * SOLID_EXTRUDE;

  vec4 worldPosition = modelMatrix * position;
  gl_Position = uViewProjectionMatrix * worldPosition;

  {{end}}
}`,fragment:`#version 300 es
out vec4 fragColor;

{{header}}

void main() {
  fragColor = vec4(SOLID_R, SOLID_G, SOLID_B, 1.0);
}`}},A={name:`solidMesh`,attributes:{aNormal:`float32x3`},overrideDefs:{SOLID_EXTRUDE:{type:`f32`,default:0},SOLID_R:{type:`f32`,default:0},SOLID_G:{type:`f32`,default:0},SOLID_B:{type:`f32`,default:0}}};function j(e={}){let n=t.shared.setValue(e.color??0);return{bitsGpu:[A],bitsGl:[g,A],template:k,overrides:{SOLID_EXTRUDE:e.extrude??0,SOLID_R:n.red,SOLID_G:n.green,SOLID_B:n.blue}}}var M=class t extends C{static defaultOptions={width:.03,color:0,stage:`afterOpaque`,description:`Draws expanded back faces around opted-in meshes as an ink outline.`};constructor(n={}){let{width:r,color:i,...o}={...t.defaultOptions,...e(n)},s=new a;s.depthTest=!0,s.culling=!0,s.clockwiseFrontFace=!0,s.blend=!1,super({...o,name:`outline`,descriptor:{shaderDescriptor:j({color:i,extrude:r}),state:s}})}},N=new O({intensity:1.6,threshold:.35,radius:.7}),P=new M({width:.02,color:959977}),F=()=>i(r,{style:{"aspect-ratio":`2/1.5`,"background-color":`#05070d`},get children(){return i(I,{})}}),I=()=>{let e=v(),t=0,n;return _(e=>{t+=e.deltaMS/1e3,n&&(n.position.x=Math.cos(t*.7)*2.4,n.position.z=Math.sin(t*.7)*2.4)}),i(m,{get width(){return e.width},get height(){return e.height},toneMapping:`aces`,passes:[P,N],environment:{skyColor:`#0b1220`,groundColor:`#020409`,intensity:.3},get children(){return[i(l,{x:0,y:2.5,z:8,lookAt:{x:0,y:.4,z:0}}),i(S,{enableDamping:!0,minDistance:5,maxDistance:18}),i(d,{intensity:.2}),i(f,{intensity:1.6,x:3,y:6,z:4,lookAt:{x:0,y:0,z:0}}),i(p,{x:-1.8,y:.5,get children(){return[i(x,{radius:.8}),i(y,{baseColor:1120295,emissive:{color:3718648,strength:3}})]}}),i(p,{x:1.8,y:.5,get children(){return[i(b,{width:1.2,height:1.2,depth:1.2}),i(y,{baseColor:1120295,emissive:{color:16347926,strength:2.6}})]}}),i(p,{ref:e=>n=e,y:.4,get children(){return[i(x,{radius:.35}),i(y,{baseColor:1120295,emissive:{color:16020150,strength:4}})]}})]}})};export{F as Demo};