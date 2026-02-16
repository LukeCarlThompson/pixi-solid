import{p as y,o as P,E as c,I as d,J as p,K as T}from"./components.AACKt2qg.js";import{F as b}from"./Filter.Bdsog-ap.js";const m={5:[.153388,.221461,.250301],7:[.071303,.131514,.189879,.214607],9:[.028532,.067234,.124009,.179044,.20236],11:[.0093,.028002,.065984,.121703,.175713,.198596],13:[.002406,.009255,.027867,.065666,.121117,.174868,.197641],15:[489e-6,.002403,.009246,.02784,.065602,.120999,.174697,.197448]},B=["in vec2 vBlurTexCoords[%size%];","uniform sampler2D uTexture;","out vec4 finalColor;","void main(void)","{","    finalColor = vec4(0.0);","    %blur%","}"].join(`
`);function z(s){const t=m[s],e=t.length;let r=B,u="";const l="finalColor += texture(uTexture, vBlurTexCoords[%index%]) * %value%;";let i;for(let n=0;n<s;n++){let a=l.replace("%index%",n.toString());i=n,n>=e&&(i=s-n-1),a=a.replace("%value%",t[i].toString()),u+=a,u+=`
`}return r=r.replace("%blur%",u),r=r.replace("%size%",s.toString()),r}const O=`
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
    }`;function X(s,t){const e=Math.ceil(s/2);let r=O,u="",l;t?l="vBlurTexCoords[%index%] =  textureCoord + vec2(%sampleIndex% * pixelStrength, 0.0);":l="vBlurTexCoords[%index%] =  textureCoord + vec2(0.0, %sampleIndex% * pixelStrength);";for(let i=0;i<s;i++){let n=l.replace("%index%",i.toString());n=n.replace("%sampleIndex%",`${i-(e-1)}.0`),u+=n,u+=`
`}return r=r.replace("%blur%",u),r=r.replace("%size%",s.toString()),r=r.replace("%dimension%",t?"z":"w"),r}function Y(s,t){const e=X(t,s),r=z(t);return y.from({vertex:e,fragment:r,name:`blur-${s?"horizontal":"vertical"}-pass-filter`})}var C=`

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
}`;function q(s,t){const e=m[t],r=e.length,u=[],l=[],i=[];for(let o=0;o<t;o++){u[o]=`@location(${o}) offset${o}: vec2<f32>,`,s?l[o]=`filteredCord + vec2(${o-r+1} * pixelStrength, 0.0),`:l[o]=`filteredCord + vec2(0.0, ${o-r+1} * pixelStrength),`;const F=o<r?o:t-o-1,S=e[F].toString();i[o]=`finalColor += textureSample(uTexture, uSampler, offset${o}) * ${S};`}const n=u.join(`
`),a=l.join(`
`),h=i.join(`
`),g=C.replace("%blur-struct%",n).replace("%blur-vertex-out%",a).replace("%blur-fragment-in%",n).replace("%blur-sampling%",h).replace("%dimension%",s?"z":"w");return P.from({vertex:{source:g,entryPoint:"mainVertex"},fragment:{source:g,entryPoint:"mainFragment"}})}const x=class v extends b{constructor(t){t={...v.defaultOptions,...t};const e=Y(t.horizontal,t.kernelSize),r=q(t.horizontal,t.kernelSize);super({glProgram:e,gpuProgram:r,resources:{blurUniforms:{uStrength:{value:0,type:"f32"}}},...t}),this.horizontal=t.horizontal,this._quality=0,this.quality=t.quality,this.blur=t.strength,this._uniforms=this.resources.blurUniforms.uniforms}apply(t,e,r,u){if(this._uniforms.uStrength=this.strength/this.passes,this.passes===1)t.applyFilter(this,e,r,u);else{const l=c.getSameSizeTexture(e);let i=e,n=l;this._state.blend=!1;const a=t.renderer.type===d.WEBGPU;for(let h=0;h<this.passes-1;h++){t.applyFilter(this,i,n,h===0?!0:a);const g=n;n=i,i=g}this._state.blend=!0,t.applyFilter(this,i,r,u),c.returnTexture(l)}}get blur(){return this.strength}set blur(t){this.padding=1+Math.abs(t)*2,this.strength=t}get quality(){return this._quality}set quality(t){this._quality=t,this.passes=t}};x.defaultOptions={strength:8,quality:4,kernelSize:5};let f=x;class _ extends b{constructor(...t){let e=t[0]??{};typeof e=="number"&&(p(T,"BlurFilter constructor params are now options object. See params: { strength, quality, resolution, kernelSize }"),e={strength:e},t[1]!==void 0&&(e.quality=t[1]),t[2]!==void 0&&(e.resolution=t[2]||"inherit"),t[3]!==void 0&&(e.kernelSize=t[3])),e={...f.defaultOptions,...e};const{strength:r,strengthX:u,strengthY:l,quality:i,...n}=e;super({...n,compatibleRenderers:d.BOTH,resources:{}}),this._repeatEdgePixels=!1,this.blurXFilter=new f({horizontal:!0,...e}),this.blurYFilter=new f({horizontal:!1,...e}),this.quality=i,this.strengthX=u??r,this.strengthY=l??r,this.repeatEdgePixels=!1}apply(t,e,r,u){const l=Math.abs(this.blurXFilter.strength),i=Math.abs(this.blurYFilter.strength);if(l&&i){const n=c.getSameSizeTexture(e);this.blurXFilter.blendMode="normal",this.blurXFilter.apply(t,e,n,!0),this.blurYFilter.blendMode=this.blendMode,this.blurYFilter.apply(t,n,r,u),c.returnTexture(n)}else i?(this.blurYFilter.blendMode=this.blendMode,this.blurYFilter.apply(t,e,r,u)):(this.blurXFilter.blendMode=this.blendMode,this.blurXFilter.apply(t,e,r,u))}updatePadding(){this._repeatEdgePixels?this.padding=0:this.padding=Math.max(Math.abs(this.blurXFilter.blur),Math.abs(this.blurYFilter.blur))*2}get strength(){if(this.strengthX!==this.strengthY)throw new Error("BlurFilter's strengthX and strengthY are different");return this.strengthX}set strength(t){this.blurXFilter.blur=this.blurYFilter.blur=t,this.updatePadding()}get quality(){return this.blurXFilter.quality}set quality(t){this.blurXFilter.quality=this.blurYFilter.quality=t}get strengthX(){return this.blurXFilter.blur}set strengthX(t){this.blurXFilter.blur=t,this.updatePadding()}get strengthY(){return this.blurYFilter.blur}set strengthY(t){this.blurYFilter.blur=t,this.updatePadding()}get blur(){return p("8.3.0","BlurFilter.blur is deprecated, please use BlurFilter.strength instead."),this.strength}set blur(t){p("8.3.0","BlurFilter.blur is deprecated, please use BlurFilter.strength instead."),this.strength=t}get blurX(){return p("8.3.0","BlurFilter.blurX is deprecated, please use BlurFilter.strengthX instead."),this.strengthX}set blurX(t){p("8.3.0","BlurFilter.blurX is deprecated, please use BlurFilter.strengthX instead."),this.strengthX=t}get blurY(){return p("8.3.0","BlurFilter.blurY is deprecated, please use BlurFilter.strengthY instead."),this.strengthY}set blurY(t){p("8.3.0","BlurFilter.blurY is deprecated, please use BlurFilter.strengthY instead."),this.strengthY=t}get repeatEdgePixels(){return this._repeatEdgePixels}set repeatEdgePixels(t){this._repeatEdgePixels=t,this.updatePadding()}}_.defaultOptions={strength:8,quality:4,kernelSize:5};export{_ as B};
