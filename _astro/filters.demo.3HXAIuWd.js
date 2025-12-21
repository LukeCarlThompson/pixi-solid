import{r as x,q as v,x as m,y as F,z as f,D as w,U,o as X,P as Y,a as V,S as q,b as G}from"./pixi-stage.CLjrGBfr.js";import{onResize as _}from"./index.CURiRi0G.js";import{o as I}from"./object-fit.kC0KDLeo.js";import{c as N,k as M,q as A,o as E,a as c,S as $}from"./solid.zTlXl3wW.js";import{s as j}from"./sky.BD98hg8R.js";import{A as L}from"./Assets.jQ89X2dT.js";import{F as h}from"./Filter.D7xSnb-v.js";import{v as k}from"./defaultFilter.vert.Dw338EcB.js";import"./web.B5Anau9R.js";import"./preload-helper.BXH4tTM1.js";import"./BitmapFont.CqF0DmGx.js";const S={5:[.153388,.221461,.250301],7:[.071303,.131514,.189879,.214607],9:[.028532,.067234,.124009,.179044,.20236],11:[.0093,.028002,.065984,.121703,.175713,.198596],13:[.002406,.009255,.027867,.065666,.121117,.174868,.197641],15:[489e-6,.002403,.009246,.02784,.065602,.120999,.174697,.197448]},R=["in vec2 vBlurTexCoords[%size%];","uniform sampler2D uTexture;","out vec4 finalColor;","void main(void)","{","    finalColor = vec4(0.0);","    %blur%","}"].join(`
`);function D(s){const e=S[s],t=e.length;let r=R,u="";const o="finalColor += texture(uTexture, vBlurTexCoords[%index%]) * %value%;";let n;for(let i=0;i<s;i++){let a=o.replace("%index%",i.toString());n=i,i>=t&&(n=s-i-1),a=a.replace("%value%",e[n].toString()),u+=a,u+=`
`}return r=r.replace("%blur%",u),r=r.replace("%size%",s.toString()),r}const H=`
    in vec2 aPosition;

    uniform float uStrength;

    out vec2 vBlurTexCoords[%size%];

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

        float pixelStrength = uInputSize.%dimension% * uStrength;

        vec2 textureCoord = filterTextureCoord();
        %blur%
    }`;function W(s,e){const t=Math.ceil(s/2);let r=H,u="",o;e?o="vBlurTexCoords[%index%] =  textureCoord + vec2(%sampleIndex% * pixelStrength, 0.0);":o="vBlurTexCoords[%index%] =  textureCoord + vec2(0.0, %sampleIndex% * pixelStrength);";for(let n=0;n<s;n++){let i=o.replace("%index%",n.toString());i=i.replace("%sampleIndex%",`${n-(t-1)}.0`),u+=i,u+=`
`}return r=r.replace("%blur%",u),r=r.replace("%size%",s.toString()),r=r.replace("%dimension%",e?"z":"w"),r}function J(s,e){const t=W(e,s),r=D(e);return x.from({vertex:t,fragment:r,name:`blur-${s?"horizontal":"vertical"}-pass-filter`})}var K=`

struct GlobalFilterUniforms {
  uInputSize:vec4<f32>,
  uInputPixel:vec4<f32>,
  uInputClamp:vec4<f32>,
  uOutputFrame:vec4<f32>,
  uGlobalFrame:vec4<f32>,
  uOutputTexture:vec4<f32>,
};

struct BlurUniforms {
  uStrength:f32,
};

@group(0) @binding(0) var<uniform> gfu: GlobalFilterUniforms;
@group(0) @binding(1) var uTexture: texture_2d<f32>;
@group(0) @binding(2) var uSampler : sampler;

@group(1) @binding(0) var<uniform> blurUniforms : BlurUniforms;


struct VSOutput {
    @builtin(position) position: vec4<f32>,
    %blur-struct%
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

  let filteredCord = filterTextureCoord(aPosition);

  let pixelStrength = gfu.uInputSize.%dimension% * blurUniforms.uStrength;

  return VSOutput(
   filterVertexPosition(aPosition),
    %blur-vertex-out%
  );
}

@fragment
fn mainFragment(
  @builtin(position) position: vec4<f32>,
  %blur-fragment-in%
) -> @location(0) vec4<f32> {

    var   finalColor = vec4(0.0);

    %blur-sampling%

    return finalColor;
}`;function Q(s,e){const t=S[e],r=t.length,u=[],o=[],n=[];for(let l=0;l<e;l++){u[l]=`@location(${l}) offset${l}: vec2<f32>,`,s?o[l]=`filteredCord + vec2(${l-r+1} * pixelStrength, 0.0),`:o[l]=`filteredCord + vec2(0.0, ${l-r+1} * pixelStrength),`;const C=l<r?l:e-l-1,B=t[C].toString();n[l]=`finalColor += textureSample(uTexture, uSampler, offset${l}) * ${B};`}const i=u.join(`
`),a=o.join(`
`),p=n.join(`
`),g=K.replace("%blur-struct%",i).replace("%blur-vertex-out%",a).replace("%blur-fragment-in%",i).replace("%blur-sampling%",p).replace("%dimension%",s?"z":"w");return v.from({vertex:{source:g,entryPoint:"mainVertex"},fragment:{source:g,entryPoint:"mainFragment"}})}const y=class P extends h{constructor(e){e={...P.defaultOptions,...e};const t=J(e.horizontal,e.kernelSize),r=Q(e.horizontal,e.kernelSize);super({glProgram:t,gpuProgram:r,resources:{blurUniforms:{uStrength:{value:0,type:"f32"}}},...e}),this.horizontal=e.horizontal,this._quality=0,this.quality=e.quality,this.blur=e.strength,this._uniforms=this.resources.blurUniforms.uniforms}apply(e,t,r,u){if(this._uniforms.uStrength=this.strength/this.passes,this.passes===1)e.applyFilter(this,t,r,u);else{const o=m.getSameSizeTexture(t);let n=t,i=o;this._state.blend=!1;const a=e.renderer.type===F.WEBGPU;for(let p=0;p<this.passes-1;p++){e.applyFilter(this,n,i,p===0?!0:a);const g=i;i=n,n=g}this._state.blend=!0,e.applyFilter(this,n,r,u),m.returnTexture(o)}}get blur(){return this.strength}set blur(e){this.padding=1+Math.abs(e)*2,this.strength=e}get quality(){return this._quality}set quality(e){this._quality=e,this.passes=e}};y.defaultOptions={strength:8,quality:4,kernelSize:5};let d=y;class T extends h{constructor(...e){let t=e[0]??{};typeof t=="number"&&(f(w,"BlurFilter constructor params are now options object. See params: { strength, quality, resolution, kernelSize }"),t={strength:t},e[1]!==void 0&&(t.quality=e[1]),e[2]!==void 0&&(t.resolution=e[2]||"inherit"),e[3]!==void 0&&(t.kernelSize=e[3])),t={...d.defaultOptions,...t};const{strength:r,strengthX:u,strengthY:o,quality:n,...i}=t;super({...i,compatibleRenderers:F.BOTH,resources:{}}),this._repeatEdgePixels=!1,this.blurXFilter=new d({horizontal:!0,...t}),this.blurYFilter=new d({horizontal:!1,...t}),this.quality=n,this.strengthX=u??r,this.strengthY=o??r,this.repeatEdgePixels=!1}apply(e,t,r,u){const o=Math.abs(this.blurXFilter.strength),n=Math.abs(this.blurYFilter.strength);if(o&&n){const i=m.getSameSizeTexture(t);this.blurXFilter.blendMode="normal",this.blurXFilter.apply(e,t,i,!0),this.blurYFilter.blendMode=this.blendMode,this.blurYFilter.apply(e,i,r,u),m.returnTexture(i)}else n?(this.blurYFilter.blendMode=this.blendMode,this.blurYFilter.apply(e,t,r,u)):(this.blurXFilter.blendMode=this.blendMode,this.blurXFilter.apply(e,t,r,u))}updatePadding(){this._repeatEdgePixels?this.padding=0:this.padding=Math.max(Math.abs(this.blurXFilter.blur),Math.abs(this.blurYFilter.blur))*2}get strength(){if(this.strengthX!==this.strengthY)throw new Error("BlurFilter's strengthX and strengthY are different");return this.strengthX}set strength(e){this.blurXFilter.blur=this.blurYFilter.blur=e,this.updatePadding()}get quality(){return this.blurXFilter.quality}set quality(e){this.blurXFilter.quality=this.blurYFilter.quality=e}get strengthX(){return this.blurXFilter.blur}set strengthX(e){this.blurXFilter.blur=e,this.updatePadding()}get strengthY(){return this.blurYFilter.blur}set strengthY(e){this.blurYFilter.blur=e,this.updatePadding()}get blur(){return f("8.3.0","BlurFilter.blur is deprecated, please use BlurFilter.strength instead."),this.strength}set blur(e){f("8.3.0","BlurFilter.blur is deprecated, please use BlurFilter.strength instead."),this.strength=e}get blurX(){return f("8.3.0","BlurFilter.blurX is deprecated, please use BlurFilter.strengthX instead."),this.strengthX}set blurX(e){f("8.3.0","BlurFilter.blurX is deprecated, please use BlurFilter.strengthX instead."),this.strengthX=e}get blurY(){return f("8.3.0","BlurFilter.blurY is deprecated, please use BlurFilter.strengthY instead."),this.strengthY}set blurY(e){f("8.3.0","BlurFilter.blurY is deprecated, please use BlurFilter.strengthY instead."),this.strengthY=e}get repeatEdgePixels(){return this._repeatEdgePixels}set repeatEdgePixels(e){this._repeatEdgePixels=e,this.updatePadding()}}T.defaultOptions={strength:8,quality:4,kernelSize:5};var Z=`
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
`,b=`

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
}`;const z=class O extends h{constructor(e={}){e={...O.defaultOptions,...e};const t=v.from({vertex:{source:b,entryPoint:"mainVertex"},fragment:{source:b,entryPoint:"mainFragment"}}),r=x.from({vertex:k,fragment:Z,name:"noise-filter"}),{noise:u,seed:o,...n}=e;super({...n,gpuProgram:t,glProgram:r,resources:{noiseUniforms:new U({uNoise:{value:1,type:"f32"},uSeed:{value:1,type:"f32"}})}}),this.noise=u,this.seed=o??Math.random()}get noise(){return this.resources.noiseUniforms.uniforms.uNoise}set noise(e){this.resources.noiseUniforms.uniforms.uNoise=e}get seed(){return this.resources.noiseUniforms.uniforms.uSeed}set seed(e){this.resources.noiseUniforms.uniforms.uSeed=e}};z.defaultOptions={noise:.5};let ee=z;const ce=()=>{const[s]=N(()=>L.load(j)),e=new ee({noise:.1,blendMode:"overlay"});X(()=>{e.seed=Math.random()});const t=new T({strength:0}),[r,u]=M(1);A(()=>{t.strength=r()}),E(()=>{e.destroy(),t.destroy()});const o=n=>{if(n.global.x<0||n.global.x>n.currentTarget.width||n.global.y<0||n.global.y>n.currentTarget.height)return;const a=Math.min(Math.max(n.global.x/n.currentTarget.width*10,0),10);u(a)};return c(G,{get children(){return c(Y,{style:{"aspect-ratio":"2/1.5"},get children(){return c($,{get when(){return s()},children:n=>c(V,{onglobalpointermove:o,eventMode:"static",get children(){return c(q,{get texture(){return n()},filters:[t,e],ref:i=>{_(a=>{I(i,a,"cover")})}})}})})}})}})};export{ce as DemoApp};
