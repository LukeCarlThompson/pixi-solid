import{p as S,o as P,z as f,E as b,I as c,J as T}from"./pixi-canvas.BeOqN5Wc.js";import{F as m}from"./Filter.CsS_V1La.js";const x={5:[.153388,.221461,.250301],7:[.071303,.131514,.189879,.214607],9:[.028532,.067234,.124009,.179044,.20236],11:[.0093,.028002,.065984,.121703,.175713,.198596],13:[.002406,.009255,.027867,.065666,.121117,.174868,.197641],15:[489e-6,.002403,.009246,.02784,.065602,.120999,.174697,.197448]},z=["in vec2 vBlurTexCoords[%size%];","uniform sampler2D uTexture;","out vec4 finalColor;","void main(void)","{","    %blur%","}"].join(`
`);function B(o){const t=x[o],e=t.length;let r="";const s="finalColor = ",l="    + ",n="texture(uTexture, vBlurTexCoords[%index%]) * %value%";for(let i=0;i<o;i++){const p=i===0?s:l,h=i<e?i:o-i-1,a=n.replace("%index%",i.toString()).replace("%value%",t[h].toString());r+=`${p}${a}
`}return z.replace("%blur%",`${r};`).replace("%size%",o.toString())}const O=`
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
    }`;function _(o,t){const e=Math.ceil(o/2);let r=O,s="",l;t?l="vBlurTexCoords[%index%] =  textureCoord + vec2(%sampleIndex% * pixelStrength, 0.0);":l="vBlurTexCoords[%index%] =  textureCoord + vec2(0.0, %sampleIndex% * pixelStrength);";for(let n=0;n<o;n++){let i=l.replace("%index%",n.toString());i=i.replace("%sampleIndex%",`${n-(e-1)}.0`),s+=i,s+=`
`}return r=r.replace("%blur%",s),r=r.replace("%size%",o.toString()),r=r.replace("%dimension%",t?"z":"w"),r}function X(o,t){const e=_(t,o),r=B(t);return S.from({vertex:e,fragment:r,name:`blur-${o?"horizontal":"vertical"}-pass-filter`})}var Y=`

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
}
`;function C(o,t){const e=x[t],r=e.length,s=[],l=[],n=[];for(let u=0;u<t;u++){s[u]=`@location(${u}) offset${u}: vec2<f32>,`,o?l[u]=`filteredCord + vec2(${u-r+1} * pixelStrength, 0.0),`:l[u]=`filteredCord + vec2(0.0, ${u-r+1} * pixelStrength),`;const g=u<r?u:t-u-1,y=e[g].toString();n[u]=`finalColor += textureSample(uTexture, uSampler, offset${u}) * ${y};`}const i=s.join(`
`),p=l.join(`
`),h=n.join(`
`),a=Y.replace("%blur-struct%",i).replace("%blur-vertex-out%",p).replace("%blur-fragment-in%",i).replace("%blur-sampling%",h).replace("%dimension%",o?"z":"w");return P.from({vertex:{source:a,entryPoint:"mainVertex"},fragment:{source:a,entryPoint:"mainFragment"}})}const v=class F extends m{constructor(t){t={...F.defaultOptions,...t};const e=X(t.horizontal,t.kernelSize),r=C(t.horizontal,t.kernelSize);super({glProgram:e,gpuProgram:r,resources:{blurUniforms:{uStrength:{value:0,type:"f32"}}},...t}),this.horizontal=t.horizontal,this.legacy=t.legacy??!1,this._quality=0,this.quality=t.quality,this.blur=t.strength,this._blurUniforms=this.resources.blurUniforms,this._uniforms=this._blurUniforms.uniforms}apply(t,e,r,s){this.legacy?this._applyLegacy(t,e,r,s):this._applyOptimized(t,e,r,s)}_applyLegacy(t,e,r,s){if(this._uniforms.uStrength=this.strength/this.passes,this.passes===1)t.applyFilter(this,e,r,s);else{const l=f.getSameSizeTexture(e);let n=e,i=l;this._state.blend=!1;const p=t.renderer.type===b.WEBGPU;for(let h=0;h<this.passes-1;h++){t.applyFilter(this,n,i,h===0?!0:p);const a=i;i=n,n=a}this._state.blend=!0,t.applyFilter(this,n,r,s),f.returnTexture(l)}}_applyOptimized(t,e,r,s){if(this._uniforms.uStrength=this._calculateInitialStrength(),this.passes===1)t.applyFilter(this,e,r,s);else{const l=f.getSameSizeTexture(e);let n=e,i=l;this._state.blend=!1;const p=t.renderer,h=p.type===b.WEBGPU,a=h?p.renderPipes.uniformBatch:null;for(let u=0;u<this.passes-1;u++){a&&this.groups[1].setResource(a.getUboResource(this._blurUniforms),0),t.applyFilter(this,n,i,h);const g=i;i=n,n=g,this._uniforms.uStrength*=.5}a&&this.groups[1].setResource(a.getUboResource(this._blurUniforms),0),this._state.blend=!0,t.applyFilter(this,n,r,s),f.returnTexture(l)}}_calculateInitialStrength(){let t=1,e=.5;for(let r=1;r<this.passes;r++)t+=e*e,e*=.5;return this.strength/Math.sqrt(t)}get blur(){return this.strength}set blur(t){this.padding=1+Math.abs(t)*2,this.strength=t}get quality(){return this._quality}set quality(t){this._quality=t,this.passes=t}};v.defaultOptions={strength:8,quality:4,kernelSize:5,legacy:!1};let d=v;class q extends m{constructor(...t){let e=t[0]??{};typeof e=="number"&&(c(T,"BlurFilter constructor params are now options object. See params: { strength, quality, resolution, kernelSize }"),e={strength:e},t[1]!==void 0&&(e.quality=t[1]),t[2]!==void 0&&(e.resolution=t[2]||"inherit"),t[3]!==void 0&&(e.kernelSize=t[3])),e={...d.defaultOptions,...e};const{strength:r,strengthX:s,strengthY:l,quality:n,...i}=e;super({...i,compatibleRenderers:b.BOTH,resources:{}}),this._repeatEdgePixels=!1,this.blurXFilter=new d({horizontal:!0,...e}),this.blurYFilter=new d({horizontal:!1,...e}),this.quality=n,this.strengthX=s??r,this.strengthY=l??r,this.repeatEdgePixels=!1}apply(t,e,r,s){const l=Math.abs(this.blurXFilter.strength),n=Math.abs(this.blurYFilter.strength);if(l&&n){const i=f.getSameSizeTexture(e);this.blurXFilter.blendMode="normal",this.blurXFilter.apply(t,e,i,!0),this.blurYFilter.blendMode=this.blendMode,this.blurYFilter.apply(t,i,r,s),f.returnTexture(i)}else n?(this.blurYFilter.blendMode=this.blendMode,this.blurYFilter.apply(t,e,r,s)):(this.blurXFilter.blendMode=this.blendMode,this.blurXFilter.apply(t,e,r,s))}updatePadding(){this._repeatEdgePixels?this.padding=0:this.padding=Math.max(Math.abs(this.blurXFilter.blur),Math.abs(this.blurYFilter.blur))*2}get strength(){if(this.strengthX!==this.strengthY)throw new Error("BlurFilter's strengthX and strengthY are different");return this.strengthX}set strength(t){this.blurXFilter.blur=this.blurYFilter.blur=t,this.updatePadding()}get quality(){return this.blurXFilter.quality}set quality(t){this.blurXFilter.quality=this.blurYFilter.quality=t}get strengthX(){return this.blurXFilter.blur}set strengthX(t){this.blurXFilter.blur=t,this.updatePadding()}get strengthY(){return this.blurYFilter.blur}set strengthY(t){this.blurYFilter.blur=t,this.updatePadding()}get blur(){return c("8.3.0","BlurFilter.blur is deprecated, please use BlurFilter.strength instead."),this.strength}set blur(t){c("8.3.0","BlurFilter.blur is deprecated, please use BlurFilter.strength instead."),this.strength=t}get blurX(){return c("8.3.0","BlurFilter.blurX is deprecated, please use BlurFilter.strengthX instead."),this.strengthX}set blurX(t){c("8.3.0","BlurFilter.blurX is deprecated, please use BlurFilter.strengthX instead."),this.strengthX=t}get blurY(){return c("8.3.0","BlurFilter.blurY is deprecated, please use BlurFilter.strengthY instead."),this.strengthY}set blurY(t){c("8.3.0","BlurFilter.blurY is deprecated, please use BlurFilter.strengthY instead."),this.strengthY=t}get repeatEdgePixels(){return this._repeatEdgePixels}set repeatEdgePixels(t){this._repeatEdgePixels=t,this.updatePadding()}}q.defaultOptions={strength:8,quality:4,kernelSize:5,legacy:!1};export{q as B};
