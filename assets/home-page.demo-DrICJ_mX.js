import{A as e,C as t,E as n,J as r,K as i,L as a,U as o,W as s,Z as ee,ct as c,l,lt as u,m as d,p as f,r as p,st as m,tt as h}from"./web-BTd9NawZ.js";import{H as g,h as _,j as v,u as y}from"./CanvasPool-DtqSaXnh.js";import{_ as b,a as x,n as S,r as C,t as w,x as T,y as E}from"./dist-BWyuAgmK.js";import{t as D}from"./Filter-tmaoo_H6.js";import{t as O}from"./Assets-D-FVVTjl.js";import{t as k}from"./BlurFilter-BMdnZ5a3.js";import{a as A,i as j,n as M,r as N,t as P}from"./run_06-CTyTGqHK.js";import{t as F}from"./run_03-BMWUeCLM.js";import{t as I}from"./object-fit-B53WMoQZ.js";import{t as L}from"./sky-kt9IjSui.js";import{t as R}from"./ground-tile-Cp0xO0Yu.js";var z=`in vec2 aPosition;
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
`,B=`struct GlobalFilterUniforms {
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
}`,V=`precision highp float;
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
`,te=`struct CRTUniforms {
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
}`,H=Object.defineProperty,U=(e,t,n)=>t in e?H(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,W=(e,t,n)=>(U(e,typeof t==`symbol`?t:t+``,n),n),G=class e extends D{constructor(t){t={...e.DEFAULT_OPTIONS,...t};let n=y.from({vertex:{source:B,entryPoint:`mainVertex`},fragment:{source:te,entryPoint:`mainFragment`}}),r=_.from({vertex:z,fragment:V,name:`crt-filter`});super({gpuProgram:n,glProgram:r,resources:{crtUniforms:{uLine:{value:new Float32Array(4),type:`vec4<f32>`},uNoise:{value:new Float32Array(2),type:`vec2<f32>`},uVignette:{value:new Float32Array(3),type:`vec3<f32>`},uSeed:{value:t.seed,type:`f32`},uTime:{value:t.time,type:`f32`},uDimensions:{value:new Float32Array(2),type:`vec2<f32>`}}}}),W(this,`uniforms`),W(this,`seed`),W(this,`time`),this.uniforms=this.resources.crtUniforms.uniforms,Object.assign(this,t)}apply(e,t,n,r){this.uniforms.uDimensions[0]=t.frame.width,this.uniforms.uDimensions[1]=t.frame.height,this.uniforms.uSeed=this.seed,this.uniforms.uTime=this.time,e.applyFilter(this,t,n,r)}get curvature(){return this.uniforms.uLine[0]}set curvature(e){this.uniforms.uLine[0]=e}get lineWidth(){return this.uniforms.uLine[1]}set lineWidth(e){this.uniforms.uLine[1]=e}get lineContrast(){return this.uniforms.uLine[2]}set lineContrast(e){this.uniforms.uLine[2]=e}get verticalLine(){return this.uniforms.uLine[3]>.5}set verticalLine(e){this.uniforms.uLine[3]=+!!e}get noise(){return this.uniforms.uNoise[0]}set noise(e){this.uniforms.uNoise[0]=e}get noiseSize(){return this.uniforms.uNoise[1]}set noiseSize(e){this.uniforms.uNoise[1]=e}get vignetting(){return this.uniforms.uVignette[0]}set vignetting(e){this.uniforms.uVignette[0]=e}get vignettingAlpha(){return this.uniforms.uVignette[1]}set vignettingAlpha(e){this.uniforms.uVignette[1]=e}get vignettingBlur(){return this.uniforms.uVignette[2]}set vignettingBlur(e){this.uniforms.uVignette[2]=e}};W(G,`DEFAULT_OPTIONS`,{curvature:1,lineWidth:1,lineContrast:.25,verticalLine:!1,noise:0,noiseSize:1,vignetting:.3,vignettingAlpha:1,vignettingBlur:.3,time:0,seed:0});var K=G,q=()=>[O.get(`run_01`),O.get(`run_02`),O.get(`run_03`),O.get(`run_04`),O.get(`run_05`),O.get(`run_06`)],J=()=>[O.get(`idle_01`),O.get(`idle_02`),O.get(`idle_03`),O.get(`idle_03`),O.get(`idle_04`),O.get(`idle_04`),O.get(`idle_04`),O.get(`idle_04`),O.get(`idle_04`),O.get(`idle_04`),O.get(`idle_04`),O.get(`idle_04`),O.get(`idle_04`),O.get(`idle_04`),O.get(`idle_04`),O.get(`idle_04`),O.get(`idle_05`),O.get(`idle_06`),O.get(`idle_07`),O.get(`idle_07`),O.get(`idle_08`),O.get(`idle_08`),O.get(`idle_08`),O.get(`idle_08`),O.get(`idle_08`),O.get(`idle_08`),O.get(`idle_08`),O.get(`idle_08`),O.get(`idle_08`),O.get(`idle_08`),O.get(`idle_08`),O.get(`idle_08`),O.get(`idle_08`)],Y=e=>{let t=c(e,`isRunning`,`direction`);return r(x,m(t,{label:`Character`,get children(){return r(i,{get children(){return[r(s,{get when(){return e.isRunning},get children(){return r(C,{autoPlay:!0,get textures(){return q()},get scaleX(){return e.direction===`left`?-1:1},animationSpeed:.25,anchorX:.5,anchorY:.92})}}),r(s,{get when(){return!e.isRunning},get children(){return r(C,{autoPlay:!0,get textures(){return J()},get scaleX(){return e.direction===`left`?-1:1},animationSpeed:.25,anchorX:.5,anchorY:.92})}})]}})}}))},X=a(`<div class=_controls-wrap_1x72i_1><button type=button class=_controls-button_1x72i_10></button><br><button type=button class=_controls-button_1x72i_10>`),Z=n=>{var r=f(X),i=r.firstChild,a=i.nextSibling.nextSibling;return p(i,`click`,n.onToggleRunningClicked,!0),t(i,()=>n.isRunning?`Click to stop`:`Click to run`),p(a,`click`,n.onToggleDirectionClicked,!0),t(a,()=>n.direction===`left`?`Click to face right`:`Click to face left`),e(),r};l([`click`]);var Q=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAnUExURQAAAJRXO281MdegYgAAAEMpPpquucra+4R+ie/Cmd5zKq4wMCYgMqazXq0AAAABdFJOUwBA5thmAAAAAWJLR0QAiAUdSAAAAAd0SU1FB+kMFgYEOAX+BIAAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjUtMTItMjJUMDY6MDQ6NDUrMDA6MDB6JkfbAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI1LTEyLTIyVDA2OjA0OjQ1KzAwOjAwC3v/ZwAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyNS0xMi0yMlQwNjowNDo1NiswMDowMKEsxLsAAAJJSURBVEjH7dO/ixNBFAfwvZADCwvfZoWLlfOyoGdlMmcRbTbhJUST4pSsBM5KQi5wV4oLZ6OyhAWvibGZ0jPVltoI21iIpNg/yrfx/AF5k7/AKVLkffjOvHmzjvN/ba4dAHABrlkBFKsGsB24dWtE6Rew76F+A8seZfgD5Ig2VzrhY1BhGIgBCOB1o6jtT6axGMCAoih60Z1M4kAKQLg+ugTjQApAr1OAsQw4wKfO6Dh6GdNM2qLMdepwbYp+L5EAEbdJvMwH/pFA0cUF4r4xiCgeUsHyTvrJGDOvCIAPqW6QR1Q1hkgCfYTlQ+SNdAP9J5tgN0M4MC64Nc3zEkB/iNAwpmm0bi4awrT6R3+BuTfcbKKfoaozWOgH2hzIAC/BF9MILKBpAEyW+e8FwF1gpTqHqslOPi8E4BwVgK/R9E8yEfBV1qpaG+PRo7kFqIrGmnFpXwQOz7Cl0wsipT0R8JsjrfX9VNfJClq6WL4MSoizsUrTjx7JgE9JZzzu4nGKwOGn2H2XpumyLNf56/a6r7I0/WopOzsu5cf85Uy/WUDbH+Q/GJzawO3kPMecktwCdpMkoRbcijC48loCo+Qt9wHuczV4eiqD4sNTgPBsJYOY67MW7IFP+bkAekMGkxa4yqdBIl01URTzKfeURwMpga96wofkBI86h5ZZcMA6YSVOg2YxwTqhJ4NyAVzlqsHquwiKPYBfph/YLpsbgTAMLc9lDdouo9CxA0SnHG4BJbzJ4HAL0Hf5VThbQIXBmy3gKveX5/m/f/0EjU68AmK5jBMAAAAASUVORK5CYII=`,ne=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAnUExURQAAAJRXO281MdegYgAAAEMpPpquucra+4R+ie/Cmd5zKq4wMCYgMqazXq0AAAABdFJOUwBA5thmAAAAAWJLR0QAiAUdSAAAAAd0SU1FB+kMFgYEOAX+BIAAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjUtMTItMjJUMDY6MDQ6NDUrMDA6MDB6JkfbAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI1LTEyLTIyVDA2OjA0OjQ1KzAwOjAwC3v/ZwAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyNS0xMi0yMlQwNjowNDo1NiswMDowMKEsxLsAAAJLSURBVEjH7dM/ixNREADwvZADCwvnZYWLlW+yoGdl8s5Cr0nCJEST4pSsBM4qhFzgrhQXtFFZwoLXRG1e6ZlqS22EbSxEUuyHcjb+Qci8+AV8RYrMj3kzb2Y97//ZPDsAoACuOAEUpwawHai6M0XpJ3DfoX8Dxx1l+APkFG2OdMKHoMOwKSZAAL8bRe1gOovFBAwoiqKn3ek0bkoJEK6OfoFJU0qAfqcAExlwgoA6o5PoWUxz6Yoyx6nDsRkGvUQCRNwm8bHv+UcCRRcXiPvWIqJYpIblrfSjtXZREQAXqa+RT1S1lkgCfYTlfeSLTAODR5tgN0M4sApUzfC8BNAfIjSsVdqYum4I0+ofr0EwZjC+M9xsop+hrnN9sTmsxwcywAKQOfxMjaYD3GVgsyx4KwDuAivVBVRtdvrpnQC84wLwM9r+aSYCfspa1RhrfXqwcABdMVizivZF4PEMWya9INLGFwHvHBlj7qWmTk7QMsUJZFBCnE90mn7wSQZcJT3ncRfLKQKPV7H7Jk3TZVmO89ftd19kafrFEfZ2FOUn/OXMvjpAOxjk3xmcucDN5DzHnJLcAXaTJKEW3IiweemlBEbJa+4D1FgPHp/JoPjwNCA8Wckg5vi8BXsQUH4ugN6QwbQFSgc0SKSnJopirnJP+zSQMvBTT7lIzuBT58gxC06wzrASp0HzmGCdoSeDcgGUVnqw+iaC4g7gzQyarsfmRiAMQ8e6rEFbMQo9N0D0yuGRG5Tw+j+Auc1b4W0BFQavtoDL3F+e53//9QOHzboLcZSmiAAAAABJRU5ErkJggg==`,re=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAnUExURQAAAJRXO281MdegYgAAAEMpPpquucra+4R+ie/Cmd5zKq4wMCYgMqazXq0AAAABdFJOUwBA5thmAAAAAWJLR0QAiAUdSAAAAAd0SU1FB+kMFgYEOAX+BIAAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjUtMTItMjJUMDY6MDQ6NDUrMDA6MDB6JkfbAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI1LTEyLTIyVDA2OjA0OjQ1KzAwOjAwC3v/ZwAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyNS0xMi0yMlQwNjowNDo1NiswMDowMKEsxLsAAAJFSURBVEjH7dQxixNREADgvZADCwvn7Qp3Vr7Jgp5YmLyzOK/ZxEmIJMUpWQlcG3IBrzrkFrTRYwkL2ujZvFJJta0WwjZWkmJ/lLNRRMi83B/wFVvsfMx7MztvPe//Wl9bAKAA3ACq1XCL2gqoJtzYDMCZQl8B6vAXyHt0ONKNn4KO40hMgABBL0k64XSWigkYUJIkL3vTaRpJCRBujv+ASSQlwKBbgYkMOEFI3fFJcp7SXNqiznHqcmyGYT+TABGXSbzsJ35IoKriC+KetYgoHlLDAsA/sLbpC4APqW9VOzy2lkgCA4TFE06OpoXhs3WwXSDsW+W3GgZ8JYDBCKFlrdLGNHVL+FqD4xUIzxicPRytFzEoUDf5fKk5bKb7MsAKkDn8Sq3IAQ4Y2KL49lEAXAX6u5ewa4sXxaUAvOMKWO7joJABt7KxawwXQvc+OID2DRqrcE8EHne5bYwi0iYQAc8cGWMe5aZJTsApeIUyqCHOJzrPPwckAz4lveK5qoZTBB5PS+9dnueLuhzn2x30Xhd5/t0V31JUnvDNmf1wgE44LH8yOHWBu9n9EkvKSgfYzrKM2nAnwejaGwmMswsuENSFHj4/lUF1LdqAUC5lkHJ81oYdCKl8L4D+iMG0DUoHNMykVlP/vNpixwU86k94GFYZukeOb8EJVhmWYp00T6n6keqgn4mg3ptwG7TSw6X0G/y9B/BkhpGr2VwIxHHsGJcV6ChGsecGeNurx0duULsSmAc8Fd4G4DN4uwFc5/rKsvz31S9/mrdrK9Nb9wAAAABJRU5ErkJggg==`,ie=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAnUExURQAAAJRXO281MdegYgAAAEMpPpquucra+4R+ie/Cmd5zKq4wMCYgMqazXq0AAAABdFJOUwBA5thmAAAAAWJLR0QAiAUdSAAAAAd0SU1FB+kMFgYEOAX+BIAAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjUtMTItMjJUMDY6MDQ6NDUrMDA6MDB6JkfbAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI1LTEyLTIyVDA2OjA0OjQ1KzAwOjAwC3v/ZwAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyNS0xMi0yMlQwNjowNDo1NiswMDowMKEsxLsAAAJASURBVEjH7dQxb9NAFAdwN0olBgaeY6SmE/diiRZ1wLkyFBYnvFhByVBQjCJ1jdIMnSqEK7pAFFWWmKAsNxJl8goDkhcmlMEfiudQIaG8S78AN2R5P/3v3t1zHOf/Wl9bAOAC2AGUq2EXlRVwA7i3GYA1Qt0CqvAXyHu0udKJX4KK41AMQAAvSpLp3ngyEwMYUJIkb6LxeBZKAQj3hzdgFEoB6HVKMJIBB/jUGZ4mb2d0JW1R5Tp1uDZBv5tKgIjbJF7mC/9IoOxijrhvDCKKh1SwyKB2ZExQEwAfUu2WOzw3hkgCPYTFCw5H3UT/1TrYzhEOjbs7b2iouQLoDRCaxrhK60A1hdfqnayAf87g/MlgvYlejiooz6efBXQoA7wB36gZWsARA5Pn3z8LgLvAWv0a6ia/zK8F4JyUwGhjerkM+Cobdc3Ao0efLEDVNDaMi/sicPiWW1rPiZT2RMAzR1rrp5kOyAo4gpcvgwri1Uhl2VePZMCnpHc8V+VwisDhaYk+Zlm2qMp1/rq96DLPsh+2+pZLxSl/OZOfFtD2+8UvBmc2sJceFFhQWljAdpqm1IKHCYZ33ktgmE65QXCnqv/6TAblZ9EChIOlDGZcT1uwAz4VqQC6AwbjFrjKo74EqhRdlFvslKAQrzqa8DCsEjrHlrfggFXCUuyTxtwllAndVATVErjKVf2l9Df4Zw/gyfRD22VzIxDHsWVcVqDtMoodO8AHTjU+toPKrUA/5qlwNoAagw8bwF3uryj+eYff7qO4G4N+6REAAAAASUVORK5CYII=`,ae=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAnUExURQAAAJRXO281MdegYgAAAEMpPpquucra+4R+ie/Cmd5zKq4wMCYgMqazXq0AAAABdFJOUwBA5thmAAAAAWJLR0QAiAUdSAAAAAd0SU1FB+kMFgYEOAX+BIAAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjUtMTItMjJUMDY6MDQ6NDUrMDA6MDB6JkfbAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI1LTEyLTIyVDA2OjA0OjQ1KzAwOjAwC3v/ZwAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyNS0xMi0yMlQwNjowNDo1NiswMDowMKEsxLsAAAJHSURBVEjH7dQxixNREADgvZADCwvn7Qp3Vr7Jgp5YmLyzOK/ZxEmIJMUpWQlcG3IBrzrkFs5GjyUsaKNn80ol1bZaCNtYSYr9Uc7GQ4TMu/sDPkiKnY95b2bnref9X+trAwAU3HIDqFbDLWoroJpOcQn45wD6GlCHv0Deo8ORbvwcdBxHYgIECHpJ0gmns1RMwICSJHndm07TSEqAcHt8CSaRlACDbgUmMuAEIXXHR8lpSnNpizrHqcuxGYb9TAJEXCbxsp/5TwJVFV8Rd6xFRPGQGhYA/p61TV8AfEh9p9rhqbVEEhggLJ5xcjQtDF+sg80CYdcqv9Uw4CsBDEYILWuVNqapW8LbGhyuQHjC4OTxaL2IQYG6yedLzX4z3ZUBVoDM/jdqRQ6wx8AWxfdPAuAq0N++gG1bvCouBOAdVsByHweFDLiVjW1juBB68NEBtG/QWIU7IvC4y21jFJE2gQh45sgY8yQ3TXICTsErlEENcT7Ref4lIBnwKemM56oaThF4PC2993meL+pynG930HtT5PkPV3xDUXnEN2f20wE64bD8xeDYBe5nD0ssKSsdYDPLMmrDvQSjG28lMM7OuUBQ53r48lgG1bVoA0K5lEHK8VkbtiCk8oMA+iMG0zYoHdAwk1pN/dNqiy0X8Kg/4WFYZegeON4FJ1hlWIp10jyl6kOqg34mgnpvwm3QSg+X0mfwzx7AkxlGrmZzIRDHsWNcVqCjGMWeG+Bdrx4fuEHtWmAe8VR4VwCfwbsrwE2uryzLfx/9BnF0t2nxcqnwAAAAAElFTkSuQmCC`,oe=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAnUExURQAAAJRXO281MdegYgAAAEMpPpquucra+4R+ie/Cmd5zKq4wMCYgMqazXq0AAAABdFJOUwBA5thmAAAAAWJLR0QAiAUdSAAAAAd0SU1FB+kMFgYEOAX+BIAAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjUtMTItMjJUMDY6MDQ6NDUrMDA6MDB6JkfbAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI1LTEyLTIyVDA2OjA0OjQ1KzAwOjAwC3v/ZwAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyNS0xMi0yMlQwNjowNDo1NiswMDowMKEsxLsAAAJMSURBVEjH7dM/ixNREADwvZADCwvnZYWLlW+yoGdl8s5Cr0nCJEST4pSsBM4qhFzgrhQXtFFZwoLXRG1e6ZlqS22EbSxEUuyHcjb+Qci8+AV8RYrMj3kzb2Y97//ZPDsAoADcAIpT2yLWQNXhiiNe+gnACfRv4LijDH+AnKLNkU74EHQYNsUECOB3o6gdTGexmIABRVH0tDudxk0pAcLV0S8waUoJ0O8UYCIDThBQZ3QSPYtpLl1R5jh1ODbDoJdIgIjbJD72Pf9IoOjiAnHfWkQUi9SwvJV+tNYuKgLgIvU18omq1hJJoI+wvI98kWlg8GgT7GYIB1aBqhmelwD6Q4SGtUobU9cNYVr94zUIxgzGd4abTfQz1HWuLzaH9fhABlgAMoefqdF0gLsMbJYFbwXAXWCluoCqzU4/vROAd1wAfkbbP81EwE9ZqxpjrU8PFg6gKwZrVtG+CDyeYcukF0Ta+CLgnSNjzL3U1MkJWqY4gQxKiPOJTtMPPsmAq6TnPO5iOUXg8Sp236RpuizLcf66/e6LLE2/OMLejqL8hL+c2VcHaAeD/DuDMxe4mZznmFOSO8BukiTUghsRNi+9lMAoec19gBrrweMzGRQfngaEJysZxByft2APAsrPBdAbMpi2QOmABon01ERRzFXuaZ8GUgZ+6ikXyRl86hw5ZsEJ1hlW4jRoHhOsM/RkUC6A0koPVt9EUNwBvJlB0/XY3AiEYehYlzVoK0ah5waIXjk8coMSXv8HMLd5K7wtoMLg1RZwmfvL8/zvv34AFZ25+9YhnlAAAAAASUVORK5CYII=`,$=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAnUExURQAAAJRXO281MdegYgAAAEMpPpquucra+4R+ie/Cmd5zKq4wMCYgMqazXq0AAAABdFJOUwBA5thmAAAAAWJLR0QAiAUdSAAAAAd0SU1FB+kMFgYEOAX+BIAAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjUtMTItMjJUMDY6MDQ6NDUrMDA6MDB6JkfbAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI1LTEyLTIyVDA2OjA0OjQ1KzAwOjAwC3v/ZwAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyNS0xMi0yMlQwNjowNDo1NiswMDowMKEsxLsAAAJHSURBVEjH7dS/b9NAFAdwt0olBgbexUiEiXuxBN1ILgylixO9REHOUFCMKpUJRaESHRFG7QJRCJboEmC5kSqTVxiQvDCgqoP/KJ7DDyH1nf8CbvCQ++h79+7dxfP+D2EAgAJwz28wgCZcqwrgiJYzYvMXAGeE/gMcETX4C+SIHs/044eg4zgUAxDAHyQve8H0cC4GMKAkSV4MptN5KAUgXN//DSahFIB+vwJwQEBrMCcHCIj69C55hcFA2kONiMskHvYTfyRQVnGGuG0tIoqb1LBqmh1r7bIuAN6kvkk+UcNanyQQIaweIC9kWkSPLoOtHKFjFaim4X4JIBojtK1V2piWbgvdig7WIJgxmN0bXy4iylG3rKWJ2W1NOjLAEpDZ/ULt0AF2GNg8pw8C4Cqw3lhCw+bPv34UgHdQAj5GG53kIuCjbDaMKc8xcgFdN9i0iraXEvC4h12TnRFp0xEB3zkyxtzPjCEn6Jpy+DLYRFxMdJZ99kkGvEs65naXl1MEHl/Fwfssy1Y1eZ5ftz84ybPsm2Pa21BUPOOHcfjdAXrBqDhncOQCd9LTAgtKCwfYStOUunA7wfDKawnspzOuA9RTPXp8JIPy4WlAeHIugznPL7pwAwIqpDWGYwbTLigd0PCtdNRE/N/ACdqn4al81FPeJCf41N9z9IID1gkXYjdoMSdYJwxlUCuB0kqPLn6IoFwD+GYGoeuwuRCI49hxXdagpxjFnhsgerW4AmziLQZ7FcDc5VvhVYA6gzcV4CrXVxTFvz/9BPU+uROxNTElAAAAAElFTkSuQmCC`,se=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAnUExURQAAAJRXO281MdegYgAAAIR+icra+5quuUMpPu/Cmd5zKq4wMCYgMi+S/sMAAAABdFJOUwBA5thmAAAAAWJLR0QAiAUdSAAAAAd0SU1FB+kMFgYEOAX+BIAAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjUtMTItMjJUMDY6MDQ6NDUrMDA6MDB6JkfbAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI1LTEyLTIyVDA2OjA0OjQ1KzAwOjAwC3v/ZwAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyNS0xMi0yMlQwNjowNDo1NiswMDowMKEsxLsAAAIsSURBVEjH7dQxb9NAFABgt/KQgYHnuBJh4l4MUjeSywBisZMXOVWyICWIoRMKZsiaNkuHCCWqpbJEsNyeKStlwQtL1cU/inepKiH1nfsHeKPv07t7z+/O8/6HEAAQwFP3+gEDaFYIuw5BC1zrh3cAnCnUPXCk8OER0OUVogQUUSwmQICwn33BaHFGYgIGdJ5l83SxGMdSAoRn6yzLpgzmsZQAw0EF4AQR7cGYHCAiGtCH7DNRKp3BJ+raKonMD5Lq9MlWsSU6MYateEgF2542NjSKh1TPKaTkrTEdkgAhbE94957d4utDUCsQOgY5dBtRAMMVQtsEut3UoNu5AK4sMGGidSt5s3pYxLBA1eLtpwymHRmgBaTftagdV4KfIqjdA1MU1xsBeFeI9cYGGqaYFd8lwK1sNmyfh4UTqLrmfxHS8cYBMNF4bFpQ70jAzhxxE4iUJifoaRuhEyyu6/t118VBmvFc2eEUgcfDkBa73W7rixeLQ4Xp7Pdu98ux7B0EVPLVy87+OEA3GpW3DC5c4OXktMSSqHSA2mQy4dfhVYZxbSmB9WTMdUDwSY0uL2RgLx4AwrfbUxHYBIuE36iVfIz+6g4cqYjSj1Kric7HvEXAoC8BbvXCnuFIhTRYysA+gpwhpBvxb1E65wQ2Q38tAt+CQAVqdDMWgd0DeDKj2NVsLgTyPHeMyx50A0a55waInp9XgEN8wWBZAfRrngrvEfC+Ajzh+sqy/PfTXysoui61Ogi+AAAAAElFTkSuQmCC`,ce=async()=>{v.defaultOptions.scaleMode=`nearest`;try{return await O.load([{alias:`sky`,src:L},{alias:`ground`,src:R},{alias:`run_01`,src:A},{alias:`run_02`,src:j},{alias:`run_03`,src:F},{alias:`run_04`,src:N},{alias:`run_05`,src:M},{alias:`run_06`,src:P},{alias:`idle_01`,src:Q},{alias:`idle_02`,src:ne},{alias:`idle_03`,src:re},{alias:`idle_04`,src:ie},{alias:`idle_05`,src:ae},{alias:`idle_06`,src:oe},{alias:`idle_07`,src:$},{alias:`idle_08`,src:se}]),!0}catch{return!1}},le=()=>{let[e,t]=h({isRunning:!0,direction:`right`});return{state:e,toggleRunning:()=>{t(e=>{e.isRunning=!e.isRunning})},toggleDirection:()=>{t(e=>{e.direction=e.direction===`left`?`right`:`left`})}}},ue=a(`<div style=position:relative><!$><!/><!$><!/>`),de=a(`<div>Loading...`),fe=e=>{let t=w(),n=new g(0,0,400,400),i=new k({strength:8}),a=new K({curvature:3,lineContrast:.1,vignetting:.1,noise:.04,noiseSize:2});T(({deltaTime:e})=>{a.seed=Math.random()*10,a.time+=e*.3});let o;return T(({deltaTime:t})=>{if(!o)return;let n=e.isRunning?1.3:0,r=e.direction===`left`?1:-1;o.tilePosition.x+=n*r*t}),u(()=>{i.destroy(),a.destroy()}),r(I,{get width(){return t.width},get height(){return t.height},fitMode:`cover`,get children(){return r(x,{filters:a,boundsArea:n,get children(){return[r(I,{get width(){return n.width},get height(){return n.height},fitMode:`cover`,get children(){return r(b,{label:`Sky`,get texture(){return O.get(`sky`)},filters:i})}}),r(E,{label:`Ground`,get width(){return n.width},get height(){return n.height*.3},get position(){return{x:0,y:n.height*.7}},ref:e=>o=e,get texture(){return O.get(`ground`)}}),r(Y,{get direction(){return e.direction},get isRunning(){return e.isRunning},get position(){return{x:n.width*.5,y:n.height*.7}}})]}})}})},pe=()=>{let e=le(),i=ee(()=>ce());var a=f(ue),s=a.firstChild,[c,l]=d(s.nextSibling),u=c.nextSibling,[p,m]=d(u.nextSibling);return t(a,r(Z,{get isRunning(){return e.state.isRunning},get direction(){return e.state.direction},get onToggleDirectionClicked(){return e.toggleDirection},get onToggleRunningClicked(){return e.toggleRunning}}),c,l),t(a,r(o,{get fallback(){return f(de)},get children(){return n(()=>n(()=>!!i())()?r(S,{style:{"aspect-ratio":`16/9`,overflow:`hidden`,"border-radius":`10px`},get children(){return r(fe,{get isRunning(){return e.state.isRunning},get direction(){return e.state.direction}})}}):void 0)}}),p,m),a};export{pe as Demo};