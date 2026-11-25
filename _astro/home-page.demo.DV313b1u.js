import{H as e,h as t,j as n,u as r}from"./CanvasPool.IN5fI3JC.js";import{f as i,p as a,t as o}from"./pixi-canvas.CjyKCql-.js";import{C as s,E as c,b as l,f as u,g as d,h as f,i as ee,k as p,o as m,s as h,t as g,v as _}from"./DemoMount.astro_astro_type_script_index_0_lang.BSIN7oNQ.js";import"./lib.J5WdxiT7.js";import{t as v}from"./Filter.4sZeBhwB.js";import{t as y}from"./Assets.BFSm44L8.js";import{_ as b,h as x,r as S,t as C}from"./components.BgLzrcVv.js";import{t as w}from"./BlurFilter.C_1W4a0H.js";import{t as T}from"./on-tick.CrdChtQl.js";import{t as E}from"./use-pixi-screen.D0afJkZ9.js";import{a as D,i as O,n as k,r as A,t as j}from"./run_06.CJ8v1A5A.js";import{t as M}from"./run_03.BXbkaS1r.js";import{t as N}from"./object-fit.DjcID6Nh.js";import{t as P}from"./sky.BF5rYlfa.js";import{t as F}from"./ground-tile.CGdSgFEg.js";var I=`in vec2 aPosition;
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
`,L=`struct GlobalFilterUniforms {
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
}`,R=`precision highp float;
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
`,z=`struct CRTUniforms {
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
}`,te=Object.defineProperty,B=(e,t,n)=>t in e?te(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,V=(e,t,n)=>(B(e,typeof t==`symbol`?t:t+``,n),n),H=class e extends v{constructor(n){n={...e.DEFAULT_OPTIONS,...n};let i=r.from({vertex:{source:L,entryPoint:`mainVertex`},fragment:{source:z,entryPoint:`mainFragment`}}),a=t.from({vertex:I,fragment:R,name:`crt-filter`});super({gpuProgram:i,glProgram:a,resources:{crtUniforms:{uLine:{value:new Float32Array(4),type:`vec4<f32>`},uNoise:{value:new Float32Array(2),type:`vec2<f32>`},uVignette:{value:new Float32Array(3),type:`vec3<f32>`},uSeed:{value:n.seed,type:`f32`},uTime:{value:n.time,type:`f32`},uDimensions:{value:new Float32Array(2),type:`vec2<f32>`}}}}),V(this,`uniforms`),V(this,`seed`),V(this,`time`),this.uniforms=this.resources.crtUniforms.uniforms,Object.assign(this,n)}apply(e,t,n,r){this.uniforms.uDimensions[0]=t.frame.width,this.uniforms.uDimensions[1]=t.frame.height,this.uniforms.uSeed=this.seed,this.uniforms.uTime=this.time,e.applyFilter(this,t,n,r)}get curvature(){return this.uniforms.uLine[0]}set curvature(e){this.uniforms.uLine[0]=e}get lineWidth(){return this.uniforms.uLine[1]}set lineWidth(e){this.uniforms.uLine[1]=e}get lineContrast(){return this.uniforms.uLine[2]}set lineContrast(e){this.uniforms.uLine[2]=e}get verticalLine(){return this.uniforms.uLine[3]>.5}set verticalLine(e){this.uniforms.uLine[3]=+!!e}get noise(){return this.uniforms.uNoise[0]}set noise(e){this.uniforms.uNoise[0]=e}get noiseSize(){return this.uniforms.uNoise[1]}set noiseSize(e){this.uniforms.uNoise[1]=e}get vignetting(){return this.uniforms.uVignette[0]}set vignetting(e){this.uniforms.uVignette[0]=e}get vignettingAlpha(){return this.uniforms.uVignette[1]}set vignettingAlpha(e){this.uniforms.uVignette[1]=e}get vignettingBlur(){return this.uniforms.uVignette[2]}set vignettingBlur(e){this.uniforms.uVignette[2]=e}};V(H,`DEFAULT_OPTIONS`,{curvature:1,lineWidth:1,lineContrast:.25,verticalLine:!1,noise:0,noiseSize:1,vignetting:.3,vignettingAlpha:1,vignettingBlur:.3,time:0,seed:0});var U=H,W=()=>[y.get(`run_01`),y.get(`run_02`),y.get(`run_03`),y.get(`run_04`),y.get(`run_05`),y.get(`run_06`)],G=()=>[y.get(`idle_01`),y.get(`idle_02`),y.get(`idle_03`),y.get(`idle_03`),y.get(`idle_04`),y.get(`idle_04`),y.get(`idle_04`),y.get(`idle_04`),y.get(`idle_04`),y.get(`idle_04`),y.get(`idle_04`),y.get(`idle_04`),y.get(`idle_04`),y.get(`idle_04`),y.get(`idle_04`),y.get(`idle_04`),y.get(`idle_05`),y.get(`idle_06`),y.get(`idle_07`),y.get(`idle_07`),y.get(`idle_08`),y.get(`idle_08`),y.get(`idle_08`),y.get(`idle_08`),y.get(`idle_08`),y.get(`idle_08`),y.get(`idle_08`),y.get(`idle_08`),y.get(`idle_08`),y.get(`idle_08`),y.get(`idle_08`),y.get(`idle_08`),y.get(`idle_08`)],K=e=>{let t=a(e,`isRunning`,`direction`);return l(S,i(t,{label:`Character`,get children(){return l(_,{get children(){return[l(d,{get when(){return e.isRunning},get children(){return l(C,{autoPlay:!0,get textures(){return W()},get scaleX(){return e.direction===`left`?-1:1},animationSpeed:.25,anchorX:.5,anchorY:.92})}}),l(d,{get when(){return!e.isRunning},get children(){return l(C,{autoPlay:!0,get textures(){return G()},get scaleX(){return e.direction===`left`?-1:1},animationSpeed:.25,anchorX:.5,anchorY:.92})}})]}})}}))},q=u(`<div class=_controls-wrap_1x72i_1><button type=button class=_controls-button_1x72i_10></button><br><button type=button class=_controls-button_1x72i_10>`),J=e=>{var t=q(),n=t.firstChild,r=n.nextSibling.nextSibling;return g(n,`click`,e.onToggleRunningClicked,!0),m(n,()=>e.isRunning?`Click to stop`:`Click to run`),g(r,`click`,e.onToggleDirectionClicked,!0),m(r,()=>e.direction===`left`?`Click to face right`:`Click to face left`),t};ee([`click`]);var Y={src:`/pixi-solid/_astro/idle_01.DijLQ-U_.png`,width:64,height:64,format:`png`},X={src:`/pixi-solid/_astro/idle_02.BbEhfQTR.png`,width:64,height:64,format:`png`},Z={src:`/pixi-solid/_astro/idle_03.BqCSbSHE.png`,width:64,height:64,format:`png`},Q={src:`/pixi-solid/_astro/idle_04.D-9XgaNX.png`,width:64,height:64,format:`png`},ne={src:`/pixi-solid/_astro/idle_05.LR3sHq5T.png`,width:64,height:64,format:`png`},re={src:`/pixi-solid/_astro/idle_06.CXN3QG6z.png`,width:64,height:64,format:`png`},ie={src:`/pixi-solid/_astro/idle_07.nuP8PMQl.png`,width:64,height:64,format:`png`},ae={src:`/pixi-solid/_astro/idle_08.BfLcLgqZ.png`,width:64,height:64,format:`png`},oe=async()=>{n.defaultOptions.scaleMode=`nearest`;try{return await y.load([{alias:`sky`,src:P},{alias:`ground`,src:F},{alias:`run_01`,src:D},{alias:`run_02`,src:O},{alias:`run_03`,src:M},{alias:`run_04`,src:A},{alias:`run_05`,src:k},{alias:`run_06`,src:j},{alias:`idle_01`,src:Y},{alias:`idle_02`,src:X},{alias:`idle_03`,src:Z},{alias:`idle_04`,src:Q},{alias:`idle_05`,src:ne},{alias:`idle_06`,src:re},{alias:`idle_07`,src:ie},{alias:`idle_08`,src:ae}]),!0}catch{return!1}},$=()=>{let[e,t]=c({isRunning:!0,direction:`right`});return{state:e,toggleRunning:()=>{t(e=>{e.isRunning=!e.isRunning})},toggleDirection:()=>{t(e=>{e.direction=e.direction===`left`?`right`:`left`})}}},se=u(`<div style=position:relative><!><!>`),ce=u(`<div>Loading...`),le=t=>{let n=E(),r=new e(0,0,400,400),i=new w({strength:8}),a=new U({curvature:3,lineContrast:.1,vignetting:.1,noise:.04,noiseSize:2});T(({deltaTime:e})=>{a.seed=Math.random()*10,a.time+=e*.3});let o;return T(({deltaTime:e})=>{if(!o)return;let n=t.isRunning?1.3:0,r=t.direction===`left`?1:-1;o.tilePosition.x+=n*r*e}),p(()=>{i.destroy(),a.destroy()}),l(N,{get width(){return n.width},get height(){return n.height},fitMode:`cover`,get children(){return l(S,{filters:a,boundsArea:r,get children(){return[l(N,{get width(){return r.width},get height(){return r.height},fitMode:`cover`,get children(){return l(x,{label:`Sky`,get texture(){return y.get(`sky`)},filters:i})}}),l(b,{label:`Ground`,get width(){return r.width},get height(){return r.height*.3},get position(){return{x:0,y:r.height*.7}},ref:e=>o=e,get texture(){return y.get(`ground`)}}),l(K,{get direction(){return t.direction},get isRunning(){return t.isRunning},get position(){return{x:r.width*.5,y:r.height*.7}}})]}})}})},ue=()=>{let e=$(),t=s(()=>oe());var n=se(),r=n.firstChild,i=r.nextSibling;return m(n,l(J,{get isRunning(){return e.state.isRunning},get direction(){return e.state.direction},get onToggleDirectionClicked(){return e.toggleDirection},get onToggleRunningClicked(){return e.toggleRunning}}),r),m(n,l(f,{get fallback(){return ce()},get children(){return h(()=>h(()=>!!t())()?l(o,{style:{"aspect-ratio":`16/9`,overflow:`hidden`,"border-radius":`10px`},get children(){return l(le,{get isRunning(){return e.state.isRunning},get direction(){return e.state.direction}})}}):void 0)}}),i),n};export{ue as Demo};