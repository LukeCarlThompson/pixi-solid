import{g as C,t as S,c as p,i as g,e as m,b as N,d as O,a as _}from"./web.CBhlHwoF.js";import{o as T}from"./on-tick.CZKssWc-.js";import{o as V,p as k,C as b,A as x,q as I,T as G,S as $,i as Q,r as E,P as B}from"./components.CE1DgLyK.js";import{o as h}from"./object-fit.kC0KDLeo.js";import{p as P,a as o,q as U,r as W,M as y,e as X,f as j,c as M,o as q,S as H}from"./solid.C2J2oolu.js";import{A as n}from"./Assets.BsyO2wR4.js";import{s as v}from"./style_module.8fa29688.BaNfQHzu.js";import{c as Y}from"./store.BHou93ol.js";import{a as Z}from"./ground-tile.DXTzhqe8.js";import{r as J,a as K,b as ee,c as ne,d as te}from"./run_06.Sl0tLnNM.js";import{r as ie}from"./run_03.BKcLI_q7.js";import{s as re}from"./sky.BD98hg8R.js";import{B as oe}from"./BlurFilter.a_eCqaBK.js";import{F as ue}from"./Filter.CBZTTkX9.js";import"./preload-helper.BXH4tTM1.js";import"./BitmapFont.B1EEQA3H.js";var se=`in vec2 aPosition;
out vec2 vTextureCoord;

uniform vec4 uInputSize;
uniform vec4 uOutputFrame;
uniform vec4 uOutputTexture;

vec4 filterVertexPosition( void )
{
    vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;
    
    position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0*uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

vec2 filterTextureCoord( void )
{
    return aPosition * (uOutputFrame.zw * uInputSize.zw);
}

void main(void)
{
    gl_Position = filterVertexPosition();
    vTextureCoord = filterTextureCoord();
}
`,le=`struct GlobalFilterUniforms {
  uInputSize:vec4<f32>,
  uInputPixel:vec4<f32>,
  uInputClamp:vec4<f32>,
  uOutputFrame:vec4<f32>,
  uGlobalFrame:vec4<f32>,
  uOutputTexture:vec4<f32>,
};

@group(0) @binding(0) var<uniform> gfu: GlobalFilterUniforms;

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
}`,ae=`precision highp float;
in vec2 vTextureCoord;
out vec4 finalColor;

uniform sampler2D uTexture;
uniform vec4 uLine;
uniform vec2 uNoise;
uniform vec3 uVignette;
uniform float uSeed;
uniform float uTime;
uniform vec2 uDimensions;

uniform vec4 uInputSize;

const float SQRT_2 = 1.414213;

float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

float vignette(vec3 co, vec2 coord)
{
    float outter = SQRT_2 - uVignette[0] * SQRT_2;
    vec2 dir = vec2(0.5) - coord;
    dir.y *= uDimensions.y / uDimensions.x;
    float darker = clamp((outter - length(dir) * SQRT_2) / ( 0.00001 + uVignette[2] * SQRT_2), 0.0, 1.0);
    return darker + (1.0 - darker) * (1.0 - uVignette[1]);
}

float noise(vec2 coord)
{
    vec2 pixelCoord = coord * uInputSize.xy;
    pixelCoord.x = floor(pixelCoord.x / uNoise[1]);
    pixelCoord.y = floor(pixelCoord.y / uNoise[1]);
    return (rand(pixelCoord * uNoise[1] * uSeed) - 0.5) * uNoise[0];
}

vec3 interlaceLines(vec3 co, vec2 coord)
{
    vec3 color = co;

    float curvature = uLine[0];
    float lineWidth = uLine[1];
    float lineContrast = uLine[2];
    float verticalLine = uLine[3];

    vec2 dir = vec2(coord * uInputSize.xy / uDimensions - 0.5);

    float _c = curvature > 0. ? curvature : 1.;
    float k = curvature > 0. ? (length(dir * dir) * 0.25 * _c * _c + 0.935 * _c) : 1.;
    vec2 uv = dir * k;
    float v = verticalLine > 0.5 ? uv.x * uDimensions.x : uv.y * uDimensions.y;
    v *= min(1.0, 2.0 / lineWidth ) / _c;
    float j = 1. + cos(v * 1.2 - uTime) * 0.5 * lineContrast;
    color *= j;

    float segment = verticalLine > 0.5 ? mod((dir.x + .5) * uDimensions.x, 4.) : mod((dir.y + .5) * uDimensions.y, 4.);
    color *= 0.99 + ceil(segment) * 0.015;

    return color;
}

void main(void)
{
    finalColor = texture(uTexture, vTextureCoord);
    vec2 coord = vTextureCoord * uInputSize.xy / uDimensions;

    if (uNoise[0] > 0.0 && uNoise[1] > 0.0)
    {
        float n = noise(vTextureCoord);
        finalColor += vec4(n, n, n, finalColor.a);
    }

    if (uVignette[0] > 0.)
    {
        float v = vignette(finalColor.rgb, coord);
        finalColor *= vec4(v, v, v, finalColor.a);
    }

    if (uLine[1] > 0.0)
    {
        finalColor = vec4(interlaceLines(finalColor.rgb, vTextureCoord), finalColor.a);  
    }
}
`,ce=`struct CRTUniforms {
    uLine: vec4<f32>,
    uNoise: vec2<f32>,
    uVignette: vec3<f32>,
    uSeed: f32,
    uTime: f32,
    uDimensions: vec2<f32>,
};

struct GlobalFilterUniforms {
  uInputSize:vec4<f32>,
  uInputPixel:vec4<f32>,
  uInputClamp:vec4<f32>,
  uOutputFrame:vec4<f32>,
  uGlobalFrame:vec4<f32>,
  uOutputTexture:vec4<f32>,
};

@group(0) @binding(0) var<uniform> gfu: GlobalFilterUniforms;

@group(0) @binding(1) var uTexture: texture_2d<f32>; 
@group(0) @binding(2) var uSampler: sampler;
@group(1) @binding(0) var<uniform> crtUniforms : CRTUniforms;

@fragment
fn mainFragment(
  @builtin(position) position: vec4<f32>,
  @location(0) uv : vec2<f32>
) -> @location(0) vec4<f32> {
    
  var color: vec4<f32> = textureSample(uTexture, uSampler, uv);
  let coord: vec2<f32> = uv * gfu.uInputSize.xy / crtUniforms.uDimensions;

  let uNoise = crtUniforms.uNoise;

  if (uNoise[0] > 0.0 && uNoise[1] > 0.0)
  {
    color += vec4<f32>(vec3<f32>(noise(uv)), color.a);
  }

  if (crtUniforms.uVignette[0] > 0.)
  {
    color *= vec4<f32>(vec3<f32>(vignette(color.rgb, coord)), color.a);
  }

  if (crtUniforms.uLine[1] > 0.0)
  {
    color = vec4<f32>(vec3<f32>(interlaceLines(color.rgb, uv)), color.a);  
  }

  return color;
}

const SQRT_2: f32 = 1.414213;

fn modulo(x: f32, y: f32) -> f32
{
  return x - y * floor(x/y);
}

fn rand(co: vec2<f32>) -> f32
{
  return fract(sin(dot(co, vec2<f32>(12.9898, 78.233))) * 43758.5453);
}

fn vignette(co: vec3<f32>, coord: vec2<f32>) -> f32
{
  let uVignette = crtUniforms.uVignette;
  let uDimensions = crtUniforms.uDimensions;
  
  let outter: f32 = SQRT_2 - uVignette[0] * SQRT_2;
  var dir: vec2<f32> = vec2<f32>(0.5) - coord;
  dir.y *= uDimensions.y / uDimensions.x;
  let darker: f32 = clamp((outter - length(dir) * SQRT_2) / ( 0.00001 + uVignette[2] * SQRT_2), 0.0, 1.0);
  return darker + (1.0 - darker) * (1.0 - uVignette[1]);
}

fn noise(coord: vec2<f32>) -> f32
{
  let uNoise = crtUniforms.uNoise;
  let uSeed = crtUniforms.uSeed;

  var pixelCoord: vec2<f32> = coord * gfu.uInputSize.xy;
  pixelCoord.x = floor(pixelCoord.x / uNoise[1]);
  pixelCoord.y = floor(pixelCoord.y / uNoise[1]);
  return (rand(pixelCoord * uNoise[1] * uSeed) - 0.5) * uNoise[0];
}

fn interlaceLines(co: vec3<f32>, coord: vec2<f32>) -> vec3<f32>
{
  var color = co;

  let uDimensions = crtUniforms.uDimensions;

  let curvature: f32 = crtUniforms.uLine[0];
  let lineWidth: f32 = crtUniforms.uLine[1];
  let lineContrast: f32 = crtUniforms.uLine[2];
  let verticalLine: f32 = crtUniforms.uLine[3];

  let dir: vec2<f32> = vec2<f32>(coord * gfu.uInputSize.xy / uDimensions - 0.5);

  let _c: f32 = select(1., curvature, curvature > 0.);
  let k: f32 = select(1., (length(dir * dir) * 0.25 * _c * _c + 0.935 * _c), curvature > 0.);
  let uv: vec2<f32> = dir * k;
  let v: f32 = select(uv.y * uDimensions.y, uv.x * uDimensions.x, verticalLine > 0.5) * min(1.0, 2.0 / lineWidth ) / _c;
  let j: f32 = 1. + cos(v * 1.2 - crtUniforms.uTime) * 0.5 * lineContrast;
  color *= j;

  let segment: f32 = select(modulo((dir.y + .5) * uDimensions.y, 4.), modulo((dir.x + .5) * uDimensions.x, 4.), verticalLine > 0.5);
  color *= 0.99 + ceil(segment) * 0.015;

  return color;
}`,fe=Object.defineProperty,ge=(t,e,i)=>e in t?fe(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,f=(t,e,i)=>(ge(t,typeof e!="symbol"?e+"":e,i),i);const L=class R extends ue{constructor(e){e={...R.DEFAULT_OPTIONS,...e};const i=V.from({vertex:{source:le,entryPoint:"mainVertex"},fragment:{source:ce,entryPoint:"mainFragment"}}),s=k.from({vertex:se,fragment:ae,name:"crt-filter"});super({gpuProgram:i,glProgram:s,resources:{crtUniforms:{uLine:{value:new Float32Array(4),type:"vec4<f32>"},uNoise:{value:new Float32Array(2),type:"vec2<f32>"},uVignette:{value:new Float32Array(3),type:"vec3<f32>"},uSeed:{value:e.seed,type:"f32"},uTime:{value:e.time,type:"f32"},uDimensions:{value:new Float32Array(2),type:"vec2<f32>"}}}}),f(this,"uniforms"),f(this,"seed"),f(this,"time"),this.uniforms=this.resources.crtUniforms.uniforms,Object.assign(this,e)}apply(e,i,s,r){this.uniforms.uDimensions[0]=i.frame.width,this.uniforms.uDimensions[1]=i.frame.height,this.uniforms.uSeed=this.seed,this.uniforms.uTime=this.time,e.applyFilter(this,i,s,r)}get curvature(){return this.uniforms.uLine[0]}set curvature(e){this.uniforms.uLine[0]=e}get lineWidth(){return this.uniforms.uLine[1]}set lineWidth(e){this.uniforms.uLine[1]=e}get lineContrast(){return this.uniforms.uLine[2]}set lineContrast(e){this.uniforms.uLine[2]=e}get verticalLine(){return this.uniforms.uLine[3]>.5}set verticalLine(e){this.uniforms.uLine[3]=e?1:0}get noise(){return this.uniforms.uNoise[0]}set noise(e){this.uniforms.uNoise[0]=e}get noiseSize(){return this.uniforms.uNoise[1]}set noiseSize(e){this.uniforms.uNoise[1]=e}get vignetting(){return this.uniforms.uVignette[0]}set vignetting(e){this.uniforms.uVignette[0]=e}get vignettingAlpha(){return this.uniforms.uVignette[1]}set vignettingAlpha(e){this.uniforms.uVignette[1]=e}get vignettingBlur(){return this.uniforms.uVignette[2]}set vignettingBlur(e){this.uniforms.uVignette[2]=e}};f(L,"DEFAULT_OPTIONS",{curvature:1,lineWidth:1,lineContrast:.25,verticalLine:!1,noise:0,noiseSize:1,vignetting:.3,vignettingAlpha:1,vignettingBlur:.3,time:0,seed:0});let de=L;const me=()=>[n.get("run_01"),n.get("run_02"),n.get("run_03"),n.get("run_04"),n.get("run_05"),n.get("run_06")],ve=()=>[n.get("idle_01"),n.get("idle_02"),n.get("idle_03"),n.get("idle_03"),n.get("idle_04"),n.get("idle_04"),n.get("idle_04"),n.get("idle_04"),n.get("idle_04"),n.get("idle_04"),n.get("idle_04"),n.get("idle_04"),n.get("idle_04"),n.get("idle_04"),n.get("idle_04"),n.get("idle_04"),n.get("idle_05"),n.get("idle_06"),n.get("idle_07"),n.get("idle_07"),n.get("idle_08"),n.get("idle_08"),n.get("idle_08"),n.get("idle_08"),n.get("idle_08"),n.get("idle_08"),n.get("idle_08"),n.get("idle_08"),n.get("idle_08"),n.get("idle_08"),n.get("idle_08"),n.get("idle_08"),n.get("idle_08")],pe=t=>{const[,e]=P(t,["isRunning","direction"]);return o(b,U(e,{label:"Character",get children(){return o(W,{get children(){return[o(y,{get when(){return t.isRunning},get children(){return o(x,{get autoPlay(){return t.isRunning},ref:i=>{X(()=>{t.isRunning?i.play():i.stop()})},get textures(){return me()},get scaleX(){return t.direction==="left"?-1:1},animationSpeed:.25,anchorX:.5,anchorY:.92})}}),o(y,{get when(){return!t.isRunning},get children(){return o(x,{autoPlay:!0,get textures(){return ve()},get scaleX(){return t.direction==="left"?-1:1},animationSpeed:.25,anchorX:.5,anchorY:.92})}})]}})}}))};var _e=S("<div><button type=button></button><br><button type=button>");const xe=t=>(()=>{var e=C(_e),i=e.firstChild,s=i.nextSibling,r=s.nextSibling;return p(i,"click",t.onToggleRunningClicked,!0),g(i,()=>t.isRunning?"Click to stop":"Click to run"),p(r,"click",t.onToggleDirectionClicked,!0),g(r,()=>t.direction==="left"?"Click to face right":"Click to face left"),j(u=>{var a=v["controls-wrap"],l=v["controls-button"],c=v["controls-button"];return a!==u.e&&m(e,u.e=a),l!==u.t&&m(i,u.t=l),c!==u.a&&m(r,u.a=c),u},{e:void 0,t:void 0,a:void 0}),N(),e})();O(["click"]);const he=()=>{const[t,e]=Y({isRunning:!0,direction:"right"});return{state:t,toggleRunning:()=>{e("isRunning",r=>!r)},toggleDirection:()=>{e("direction",r=>r==="left"?"right":"left")}}},ye=t=>{const[,e]=P(t,["movementSpeed","direction"]);return o(I,U(e,{label:"Ground",ref:i=>{T(s=>{i.tilePosition.x+=t.movementSpeed*s.deltaTime*(t.direction==="left"?1:-1)})},get texture(){return n.get("ground")}}))},Ce={src:"/pixi-solid/_astro/idle_01.DijLQ-U_.png",width:64,height:64,format:"png"},Se={src:"/pixi-solid/_astro/idle_02.BbEhfQTR.png",width:64,height:64,format:"png"},Te={src:"/pixi-solid/_astro/idle_03.BqCSbSHE.png",width:64,height:64,format:"png"},be={src:"/pixi-solid/_astro/idle_04.D-9XgaNX.png",width:64,height:64,format:"png"},Pe={src:"/pixi-solid/_astro/idle_05.LR3sHq5T.png",width:64,height:64,format:"png"},Ue={src:"/pixi-solid/_astro/idle_06.CXN3QG6z.png",width:64,height:64,format:"png"},Le={src:"/pixi-solid/_astro/idle_07.nuP8PMQl.png",width:64,height:64,format:"png"},Re={src:"/pixi-solid/_astro/idle_08.BfLcLgqZ.png",width:64,height:64,format:"png"},we=async()=>{G.defaultOptions.scaleMode="nearest";try{return await n.load([{alias:"sky",src:re},{alias:"ground",src:Z},{alias:"run_01",src:J},{alias:"run_02",src:K},{alias:"run_03",src:ie},{alias:"run_04",src:ee},{alias:"run_05",src:ne},{alias:"run_06",src:te},{alias:"idle_01",src:Ce},{alias:"idle_02",src:Se},{alias:"idle_03",src:Te},{alias:"idle_04",src:be},{alias:"idle_05",src:Pe},{alias:"idle_06",src:Ue},{alias:"idle_07",src:Le},{alias:"idle_08",src:Re}]),!0}catch{return!1}};var Fe=S("<div style=position:relative><!$><!/><!$><!/>");const Me=()=>{const t=he(),[e]=M(we),i=new Q(0,0,400,266),s=new oe({strength:8}),r=new de({curvature:3,lineContrast:.1,vignetting:.1,noise:.04,noiseSize:2});return q(()=>{s.destroy(),r.destroy()}),(()=>{var u=C(Fe),a=u.firstChild,[l,c]=_(a.nextSibling),w=l.nextSibling,[F,D]=_(w.nextSibling);return g(u,o(xe,{get isRunning(){return t.state.isRunning},get direction(){return t.state.direction},get onToggleDirectionClicked(){return t.toggleDirection},get onToggleRunningClicked(){return t.toggleRunning}}),l,c),g(u,o(B,{get style(){return{"aspect-ratio":`${i.width}/${i.height}`,overflow:"hidden","border-radius":"10px"}},get children(){return o(H,{get when(){return e()},get children(){return o(b,{filters:r,ref:d=>{const A=E();T(z=>{h(d,A.renderer,"cover"),r.seed=Math.random()*10,r.time+=z.deltaTime*.3})},get children(){return[o($,{label:"Sky",get texture(){return n.get("sky")},filters:s,ref:d=>{h(d,i,"cover")}}),o(ye,{get movementSpeed(){return t.state.isRunning?1.3:0},get direction(){return t.state.direction},get width(){return i.width},get height(){return i.height*.3},get position(){return{x:0,y:i.height*.7}}}),o(pe,{get direction(){return t.state.direction},get isRunning(){return t.state.isRunning},get position(){return{x:i.width*.5,y:i.height*.7}}})]}})}})}}),F,D),u})()};export{Me as DemoApp};
