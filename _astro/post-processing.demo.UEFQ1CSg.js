import{r as g,F as x,s as C,t as y,v as a,C as w,A as _,D,b as i,V as O}from"./view-3d.CbSxVUmV.js";import{H as c,s as f,C as B,o as M,P as S}from"./pixi-canvas.DUqT5F9V.js";import{i as k}from"./instanceFetchBitGl.BHsCL7dp.js";import{o as L}from"./on-tick.CmBPWrSX.js";import{u as P}from"./use-pixi-screen.Ch4eYWzs.js";import{S as m,M as u,C as U}from"./resources.DubASOu2.js";import{O as I}from"./orbit-camera.CSap3zI8.js";import{a as r}from"./solid.cm6h0zV4.js";var T=class extends g{name;_options;constructor(s){super(s),this.name=s.name,this._options=s}get stage(){return this._options.stage??(this._options.camera?.renderTexture?"beforeOpaque":"afterOpaque")}build(s,e){const o=this._options;s.addPass(new x({renderer:e.renderer,name:o.name,description:o.description,descriptor:o.descriptor,sort:o.sort??"key",camera:o.camera}))}};const R={gpu:`
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
`},E={gpu:`
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
`},F={gpu:`
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
`},G={gpu:`
fn effect(uv: vec2<f32>) -> vec4<f32> {
  let base = sampleColor(uv);
  return vec4<f32>(base.rgb + sampleColor2(uv).rgb * fx.uBloomCombine.x, base.a);
}
`,gl:`
vec4 effect(vec2 uv) {
  vec4 base = sampleColor(uv);
  return vec4(base.rgb + sampleColor2(uv).rgb * uBloomCombine.x, base.a);
}
`};var $=class d extends C{static defaultOptions={threshold:1,intensity:1,radius:.6,levels:5,resolution:.5};levels=0;resolution=0;_brightUniforms=new c({uBloom:{value:new Float32Array(4),type:"vec4<f32>"}});_upUniforms=new c({uBloomUp:{value:new Float32Array(4),type:"vec4<f32>"}});_combineUniforms=new c({uBloomCombine:{value:new Float32Array(4),type:"vec4<f32>"}});constructor(e={}){const{threshold:o,intensity:n,radius:l,levels:t,resolution:b,...h}={...d.defaultOptions,...f(e)};super(h),this.levels=Math.max(1,Math.round(t)),this.resolution=b,this.threshold=o,this.intensity=n,this.radius=l}build(e,o){const n=e.sceneIsLinear?y(o.renderer):void 0,l=[];for(let t=0;t<this.levels;t++)l.push(e.createColor({resolution:this.resolution/2**t,format:n,label:`bloomLevel${t}`}));e.addPass(new a({renderer:o.renderer,label:"bloom:bright",fragment:R,uniforms:this._brightUniforms,reads:{color:o.input},writes:l[0]}));for(let t=1;t<this.levels;t++)e.addPass(new a({renderer:o.renderer,label:`bloom:down${t}`,fragment:E,reads:{color:l[t-1]},writes:l[t]}));for(let t=this.levels-2;t>=0;t--)e.addPass(new a({renderer:o.renderer,label:`bloom:up${t}`,fragment:F,uniforms:this._upUniforms,reads:{color:l[t+1]},writes:l[t],blendMode:"normal"}));e.addPass(new a({renderer:o.renderer,label:"bloom:combine",fragment:G,uniforms:this._combineUniforms,reads:{color:o.input,color2:l[0]},writes:o.output}))}get threshold(){return this._brightUniforms.uniforms.uBloom[0]}set threshold(e){this.writeLane(this._brightUniforms,"uBloom",0,e),this.writeLane(this._brightUniforms,"uBloom",1,e*.5)}get intensity(){return this._combineUniforms.uniforms.uBloomCombine[0]}set intensity(e){this.writeLane(this._combineUniforms,"uBloomCombine",0,e)}get radius(){return this._upUniforms.uniforms.uBloomUp[0]}set radius(e){this.writeLane(this._upUniforms,"uBloomUp",0,e)}};const A={bindGroups:[{name:"global",ubo:!0},"camera"],gpu:`
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
}`}},v={name:"solidMesh",attributes:{aNormal:"float32x3"},overrideDefs:{SOLID_EXTRUDE:{type:"f32",default:0},SOLID_R:{type:"f32",default:0},SOLID_G:{type:"f32",default:0},SOLID_B:{type:"f32",default:0}}};function z(s={}){const e=B.shared.setValue(s.color??0);return{bitsGpu:[v],bitsGl:[k,v],template:A,overrides:{SOLID_EXTRUDE:s.extrude??0,SOLID_R:e.red,SOLID_G:e.green,SOLID_B:e.blue}}}var N=class p extends T{static defaultOptions={width:.03,color:0,stage:"afterOpaque",description:"Draws expanded back faces around opted-in meshes as an ink outline."};constructor(e={}){const{width:o,color:n,...l}={...p.defaultOptions,...f(e)},t=new M;t.depthTest=!0,t.culling=!0,t.clockwiseFrontFace=!0,t.blend=!1,super({...l,name:"outline",descriptor:{shaderDescriptor:z({color:n,extrude:o}),state:t}})}};const V=new $({intensity:1.6,threshold:.35,radius:.7}),j=new N({width:.02,color:959977}),ee=()=>r(S,{style:{"aspect-ratio":"2/1.5","background-color":"#05070d"},get children(){return r(X,{})}}),X=()=>{const s=P();let e=0,o;return L(n=>{e+=n.deltaMS/1e3,o&&(o.position.x=Math.cos(e*.7)*2.4,o.position.z=Math.sin(e*.7)*2.4)}),r(O,{get width(){return s.width},get height(){return s.height},toneMapping:"aces",passes:[j,V],environment:{skyColor:"#0b1220",groundColor:"#020409",intensity:.3},get children(){return[r(w,{x:0,y:2.5,z:8,lookAt:{x:0,y:.4,z:0}}),r(I,{enableDamping:!0,minDistance:5,maxDistance:18}),r(_,{intensity:.2}),r(D,{intensity:1.6,x:3,y:6,z:4,lookAt:{x:0,y:0,z:0}}),r(i,{x:-1.8,y:.5,get children(){return[r(m,{radius:.8}),r(u,{baseColor:1120295,emissive:{color:3718648,strength:3}})]}}),r(i,{x:1.8,y:.5,get children(){return[r(U,{width:1.2,height:1.2,depth:1.2}),r(u,{baseColor:1120295,emissive:{color:16347926,strength:2.6}})]}}),r(i,{ref:n=>o=n,y:.4,get children(){return[r(m,{radius:.35}),r(u,{baseColor:1120295,emissive:{color:16020150,strength:4}})]}})]}})};export{ee as Demo};
