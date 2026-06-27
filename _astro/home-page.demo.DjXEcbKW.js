import{g as y,t as C,c as v,i as g,e as d,b as R,d as w,a as p}from"./web.BxpcHPAl.js";import{o as _}from"./on-tick.BgfBch4a.js";import{m as P,n as U,A as x,C as S,T as L,P as F,R as D,S as A,q as O}from"./pixi-canvas.2_bC4CmQ.js";import{u as z}from"./use-pixi-screen.qTAa8cun.js";import{o as N,O as V}from"./object-fit.B-rVGPkA.js";import{m as k,a as u,q as I,v as $,M as h,e as G,f as Q,c as E,S as B,o as M}from"./solid.BuuK4dUg.js";import{A as n}from"./Assets.B64C-hBm.js";import{c as j}from"./store.DOoIrK3A.js";import{a as W}from"./ground-tile.DXTzhqe8.js";import{r as X,a as q,b as H,c as Y,d as Z}from"./run_06.Sl0tLnNM.js";import{r as J}from"./run_03.BKcLI_q7.js";import{s as K}from"./sky.BD98hg8R.js";import{B as ee}from"./BlurFilter.WA_L-wCs.js";import{F as ne}from"./Filter.BlGwQ5Px.js";var te=`in vec2 aPosition;
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
`,ie=`struct GlobalFilterUniforms {
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
}`,re=`precision highp float;
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
`,oe=`struct CRTUniforms {
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
}`,ue=Object.defineProperty,se=(i,e,t)=>e in i?ue(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,f=(i,e,t)=>(se(i,typeof e!="symbol"?e+"":e,t),t);const T=class b extends ne{constructor(e){e={...b.DEFAULT_OPTIONS,...e};const t=P.from({vertex:{source:ie,entryPoint:"mainVertex"},fragment:{source:oe,entryPoint:"mainFragment"}}),s=U.from({vertex:te,fragment:re,name:"crt-filter"});super({gpuProgram:t,glProgram:s,resources:{crtUniforms:{uLine:{value:new Float32Array(4),type:"vec4<f32>"},uNoise:{value:new Float32Array(2),type:"vec2<f32>"},uVignette:{value:new Float32Array(3),type:"vec3<f32>"},uSeed:{value:e.seed,type:"f32"},uTime:{value:e.time,type:"f32"},uDimensions:{value:new Float32Array(2),type:"vec2<f32>"}}}}),f(this,"uniforms"),f(this,"seed"),f(this,"time"),this.uniforms=this.resources.crtUniforms.uniforms,Object.assign(this,e)}apply(e,t,s,r){this.uniforms.uDimensions[0]=t.frame.width,this.uniforms.uDimensions[1]=t.frame.height,this.uniforms.uSeed=this.seed,this.uniforms.uTime=this.time,e.applyFilter(this,t,s,r)}get curvature(){return this.uniforms.uLine[0]}set curvature(e){this.uniforms.uLine[0]=e}get lineWidth(){return this.uniforms.uLine[1]}set lineWidth(e){this.uniforms.uLine[1]=e}get lineContrast(){return this.uniforms.uLine[2]}set lineContrast(e){this.uniforms.uLine[2]=e}get verticalLine(){return this.uniforms.uLine[3]>.5}set verticalLine(e){this.uniforms.uLine[3]=e?1:0}get noise(){return this.uniforms.uNoise[0]}set noise(e){this.uniforms.uNoise[0]=e}get noiseSize(){return this.uniforms.uNoise[1]}set noiseSize(e){this.uniforms.uNoise[1]=e}get vignetting(){return this.uniforms.uVignette[0]}set vignetting(e){this.uniforms.uVignette[0]=e}get vignettingAlpha(){return this.uniforms.uVignette[1]}set vignettingAlpha(e){this.uniforms.uVignette[1]=e}get vignettingBlur(){return this.uniforms.uVignette[2]}set vignettingBlur(e){this.uniforms.uVignette[2]=e}};f(T,"DEFAULT_OPTIONS",{curvature:1,lineWidth:1,lineContrast:.25,verticalLine:!1,noise:0,noiseSize:1,vignetting:.3,vignettingAlpha:1,vignettingBlur:.3,time:0,seed:0});let le=T;const ce=()=>[n.get("run_01"),n.get("run_02"),n.get("run_03"),n.get("run_04"),n.get("run_05"),n.get("run_06")],ae=()=>[n.get("idle_01"),n.get("idle_02"),n.get("idle_03"),n.get("idle_03"),n.get("idle_04"),n.get("idle_04"),n.get("idle_04"),n.get("idle_04"),n.get("idle_04"),n.get("idle_04"),n.get("idle_04"),n.get("idle_04"),n.get("idle_04"),n.get("idle_04"),n.get("idle_04"),n.get("idle_04"),n.get("idle_05"),n.get("idle_06"),n.get("idle_07"),n.get("idle_07"),n.get("idle_08"),n.get("idle_08"),n.get("idle_08"),n.get("idle_08"),n.get("idle_08"),n.get("idle_08"),n.get("idle_08"),n.get("idle_08"),n.get("idle_08"),n.get("idle_08"),n.get("idle_08"),n.get("idle_08"),n.get("idle_08")],fe=i=>{const[,e]=k(i,["isRunning","direction"]);return u(S,I(e,{label:"Character",get children(){return u($,{get children(){return[u(h,{get when(){return i.isRunning},get children(){return u(x,{get autoPlay(){return i.isRunning},ref:t=>{G(()=>{i.isRunning?t.play():t.stop()})},get textures(){return ce()},get scaleX(){return i.direction==="left"?-1:1},animationSpeed:.25,anchorX:.5,anchorY:.92})}}),u(h,{get when(){return!i.isRunning},get children(){return u(x,{autoPlay:!0,get textures(){return ae()},get scaleX(){return i.direction==="left"?-1:1},animationSpeed:.25,anchorX:.5,anchorY:.92})}})]}})}}))},m={"controls-wrap":"_controls-wrap_1x72i_1","controls-button":"_controls-button_1x72i_10"};var ge=C("<div><button type=button></button><br><button type=button>");const de=i=>(()=>{var e=y(ge),t=e.firstChild,s=t.nextSibling,r=s.nextSibling;return v(t,"click",i.onToggleRunningClicked,!0),g(t,()=>i.isRunning?"Click to stop":"Click to run"),v(r,"click",i.onToggleDirectionClicked,!0),g(r,()=>i.direction==="left"?"Click to face right":"Click to face left"),Q(o=>{var l=m["controls-wrap"],c=m["controls-button"],a=m["controls-button"];return l!==o.e&&d(e,o.e=l),c!==o.t&&d(t,o.t=c),a!==o.a&&d(r,o.a=a),o},{e:void 0,t:void 0,a:void 0}),R(),e})();w(["click"]);const me=()=>{const[i,e]=j({isRunning:!0,direction:"right"});return{state:i,toggleRunning:()=>{e("isRunning",r=>!r)},toggleDirection:()=>{e("direction",r=>r==="left"?"right":"left")}}},ve={src:"/pixi-solid/_astro/idle_01.DijLQ-U_.png",width:64,height:64,format:"png"},pe={src:"/pixi-solid/_astro/idle_02.BbEhfQTR.png",width:64,height:64,format:"png"},_e={src:"/pixi-solid/_astro/idle_03.BqCSbSHE.png",width:64,height:64,format:"png"},xe={src:"/pixi-solid/_astro/idle_04.D-9XgaNX.png",width:64,height:64,format:"png"},he={src:"/pixi-solid/_astro/idle_05.LR3sHq5T.png",width:64,height:64,format:"png"},ye={src:"/pixi-solid/_astro/idle_06.CXN3QG6z.png",width:64,height:64,format:"png"},Ce={src:"/pixi-solid/_astro/idle_07.nuP8PMQl.png",width:64,height:64,format:"png"},Se={src:"/pixi-solid/_astro/idle_08.BfLcLgqZ.png",width:64,height:64,format:"png"},Te=async()=>{L.defaultOptions.scaleMode="nearest";try{return await n.load([{alias:"sky",src:K},{alias:"ground",src:W},{alias:"run_01",src:X},{alias:"run_02",src:q},{alias:"run_03",src:J},{alias:"run_04",src:H},{alias:"run_05",src:Y},{alias:"run_06",src:Z},{alias:"idle_01",src:ve},{alias:"idle_02",src:pe},{alias:"idle_03",src:_e},{alias:"idle_04",src:xe},{alias:"idle_05",src:he},{alias:"idle_06",src:ye},{alias:"idle_07",src:Ce},{alias:"idle_08",src:Se}]),!0}catch{return!1}};var be=C("<div style=position:relative><!$><!/><!$><!/>");const Re=i=>{const e=z(),t=new D(0,0,400,400),s=new ee({strength:8}),r=new le({curvature:3,lineContrast:.1,vignetting:.1,noise:.04,noiseSize:2});return _(({deltaTime:o})=>{r.seed=Math.random()*10,r.time+=o*.3}),M(()=>{s.destroy(),r.destroy()}),u(V,{get width(){return e.width},get height(){return e.height},fitMode:"cover",get children(){return u(S,{filters:r,boundsArea:t,get children(){return[u(A,{label:"Sky",get texture(){return n.get("sky")},filters:s,ref:o=>{N(o,t,"cover")}}),u(O,{label:"Ground",get width(){return t.width},get height(){return t.height*.3},get position(){return{x:0,y:t.height*.7}},ref:o=>{_(({deltaTime:l})=>{const c=i.isRunning?1.3:0,a=i.direction==="left"?1:-1;o.tilePosition.x+=c*a*l})},get texture(){return n.get("ground")}}),u(fe,{get direction(){return i.direction},get isRunning(){return i.isRunning},get position(){return{x:t.width*.5,y:t.height*.7}}})]}})}})},Ge=()=>{const i=me(),[e]=E(Te);return(()=>{var t=y(be),s=t.firstChild,[r,o]=p(s.nextSibling),l=r.nextSibling,[c,a]=p(l.nextSibling);return g(t,u(de,{get isRunning(){return i.state.isRunning},get direction(){return i.state.direction},get onToggleDirectionClicked(){return i.toggleDirection},get onToggleRunningClicked(){return i.toggleRunning}}),r,o),g(t,u(F,{style:{"aspect-ratio":"16/9",overflow:"hidden","border-radius":"10px"},get children(){return u(B,{get when(){return e()},get children(){return u(Re,{get isRunning(){return i.state.isRunning},get direction(){return i.state.direction}})}})}}),c,a),t})()};export{Ge as DemoApp};
