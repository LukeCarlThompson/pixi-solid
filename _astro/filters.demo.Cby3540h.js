import{p as v,q as x,U as b,P as h,a as y,S as l,o as P,b as S}from"./pixi-stage.DpA0Rhvt.js";import{onResize as f}from"./index.DZrteDK2.js";import{o as F}from"./object-fit.kC0KDLeo.js";import{c as T,f as U,n as C,o as w,a as r,S as O}from"./solid.CYKOjIt2.js";import{b as z}from"./bird_03.DFMVqLYT.js";import{s as N}from"./sky.BD98hg8R.js";import{A as u}from"./Assets.Cvj9dnn9.js";import{F as V}from"./Filter.QaxDQ2CO.js";import{v as G}from"./defaultFilter.vert.Dw338EcB.js";import{B as A}from"./BlurFilter.DvzsQZwL.js";import"./web.BJe-SJLw.js";import"./preload-helper.BXH4tTM1.js";import"./BitmapFont.S9p9fnvj.js";var M=`
in vec2 vTextureCoord;
in vec4 vColor;

out vec4 finalColor;

uniform float uNoise;
uniform float uSeed;
uniform sampler2D uTexture;

float rand(vec2 co)
{
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main()
{
    vec4 color = texture(uTexture, vTextureCoord);
    float randomValue = rand(gl_FragCoord.xy * uSeed);
    float diff = (randomValue - 0.5) *  uNoise;

    // Un-premultiply alpha before applying the color matrix. See issue #3539.
    if (color.a > 0.0) {
        color.rgb /= color.a;
    }

    color.r += diff;
    color.g += diff;
    color.b += diff;

    // Premultiply alpha again.
    color.rgb *= color.a;

    finalColor = color;
}
`,m=`

struct GlobalFilterUniforms {
  uInputSize:vec4<f32>,
  uInputPixel:vec4<f32>,
  uInputClamp:vec4<f32>,
  uOutputFrame:vec4<f32>,
  uGlobalFrame:vec4<f32>,
  uOutputTexture:vec4<f32>,
};

struct NoiseUniforms {
  uNoise:f32,
  uSeed:f32,
};

@group(0) @binding(0) var<uniform> gfu: GlobalFilterUniforms;
@group(0) @binding(1) var uTexture: texture_2d<f32>;
@group(0) @binding(2) var uSampler : sampler;

@group(1) @binding(0) var<uniform> noiseUniforms : NoiseUniforms;

struct VSOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv : vec2<f32>
  };

fn filterVertexPosition(aPosition:vec2<f32>) -> vec4<f32>
{
    var position = aPosition * gfu.uOutputFrame.zw + gfu.uOutputFrame.xy;

    position.x = position.x * (2.0 / gfu.uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0*gfu.uOutputTexture.z / gfu.uOutputTexture.y) - gfu.uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

fn filterTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>
{
    return aPosition * (gfu.uOutputFrame.zw * gfu.uInputSize.zw);
}

fn globalTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>
{
  return  (aPosition.xy / gfu.uGlobalFrame.zw) + (gfu.uGlobalFrame.xy / gfu.uGlobalFrame.zw);  
}

fn getSize() -> vec2<f32>
{
  return gfu.uGlobalFrame.zw;
}
  
@vertex
fn mainVertex(
  @location(0) aPosition : vec2<f32>, 
) -> VSOutput {
  return VSOutput(
   filterVertexPosition(aPosition),
   filterTextureCoord(aPosition)
  );
}

fn rand(co:vec2<f32>) -> f32
{
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}



@fragment
fn mainFragment(
  @location(0) uv: vec2<f32>,
  @builtin(position) position: vec4<f32>
) -> @location(0) vec4<f32> {

    var pixelPosition =  globalTextureCoord(position.xy);// / (getSize());//-  gfu.uOutputFrame.xy);
  
    
    var sample = textureSample(uTexture, uSampler, uv);
    var randomValue =  rand(pixelPosition.xy * noiseUniforms.uSeed);
    var diff = (randomValue - 0.5) * noiseUniforms.uNoise;
  
    // Un-premultiply alpha before applying the color matrix. See issue #3539.
    if (sample.a > 0.0) {
      sample.r /= sample.a;
      sample.g /= sample.a;
      sample.b /= sample.a;
    }

    sample.r += diff;
    sample.g += diff;
    sample.b += diff;

    // Premultiply alpha again.
    sample.r *= sample.a;
    sample.g *= sample.a;
    sample.b *= sample.a;
    
    return sample;
}`;const p=class c extends V{constructor(n={}){n={...c.defaultOptions,...n};const o=v.from({vertex:{source:m,entryPoint:"mainVertex"},fragment:{source:m,entryPoint:"mainFragment"}}),i=x.from({vertex:G,fragment:M,name:"noise-filter"}),{noise:a,seed:s,...e}=n;super({...e,gpuProgram:o,glProgram:i,resources:{noiseUniforms:new b({uNoise:{value:1,type:"f32"},uSeed:{value:1,type:"f32"}})}}),this.noise=a,this.seed=s??Math.random()}get noise(){return this.resources.noiseUniforms.uniforms.uNoise}set noise(n){this.resources.noiseUniforms.uniforms.uNoise=n}get seed(){return this.resources.noiseUniforms.uniforms.uSeed}set seed(n){this.resources.noiseUniforms.uniforms.uSeed=n}};p.defaultOptions={noise:.5};let I=p;const W=()=>{const[g]=T(()=>u.load([{alias:"sky",src:N},{alias:"bird",src:z}])),n=new I({noise:.1,blendMode:"overlay"}),o=new A({strength:0}),[i,a]=U(1);C(()=>{o.strength=i()}),w(()=>{n.destroy(),o.destroy()});const s=e=>{if(e.global.x<0||e.global.x>e.currentTarget.width||e.global.y<0||e.global.y>e.currentTarget.height)return;const d=Math.min(Math.max(e.global.x/e.currentTarget.width*10,0),10);a(d)};return r(S,{get children(){return r(h,{style:{"aspect-ratio":"2/1.5"},get children(){return r(O,{get when(){return g()},get children(){return r(y,{onglobalpointermove:s,eventMode:"static",filters:n,ref:()=>{P(()=>{n.seed=Math.random()})},get children(){return[r(l,{label:"sky",get texture(){return u.get("sky")},filters:o,ref:e=>{f(t=>{F(e,t,"cover")})}}),r(l,{label:"bird",get texture(){return u.get("bird")},scale:2,anchor:.5,ref:e=>{f(t=>{e.x=t.width*.5,e.y=t.height*.5})}})]}})}})}})}})};export{W as DemoApp};
