import{L as e,R as t,h as n,s as r,u as i}from"./CanvasPool-DtqSaXnh.js";import{f as a,t as o}from"./Filter-tmaoo_H6.js";var s={5:[.153388,.221461,.250301],7:[.071303,.131514,.189879,.214607],9:[.028532,.067234,.124009,.179044,.20236],11:[.0093,.028002,.065984,.121703,.175713,.198596],13:[.002406,.009255,.027867,.065666,.121117,.174868,.197641],15:[489e-6,.002403,.009246,.02784,.065602,.120999,.174697,.197448]},c=[`in vec2 vBlurTexCoords[%size%];`,`uniform sampler2D uTexture;`,`uniform vec4 uInputClamp;`,`out vec4 finalColor;`,`void main(void)`,`{`,`    %blur%`,`}`].join(`
`);function l(e){let t=s[e],n=t.length,r=``;for(let i=0;i<e;i++){let a=i===0?`finalColor = `:`    + `,o=i<n?i:e-i-1,s=`texture(uTexture, clamp(vBlurTexCoords[%index%], uInputClamp.xy, uInputClamp.zw)) * %value%`.replace(`%index%`,i.toString()).replace(`%value%`,t[o].toString());r+=`${a}${s}
`}return c.replace(`%blur%`,`${r};`).replace(`%size%`,e.toString())}var u=`
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
    }`;function d(e,t){let n=Math.ceil(e/2),r=u,i=``,a;a=t?`vBlurTexCoords[%index%] =  textureCoord + vec2(%sampleIndex% * pixelStrength, 0.0);`:`vBlurTexCoords[%index%] =  textureCoord + vec2(0.0, %sampleIndex% * pixelStrength);`;for(let t=0;t<e;t++){let e=a.replace(`%index%`,t.toString());e=e.replace(`%sampleIndex%`,`${t-(n-1)}.0`),i+=e,i+=`
`}return r=r.replace(`%blur%`,i),r=r.replace(`%size%`,e.toString()),r=r.replace(`%dimension%`,t?`z`:`w`),r}function f(e,t){let r=d(t,e),i=l(t);return n.from({vertex:r,fragment:i,name:`blur-${e?`horizontal`:`vertical`}-pass-filter`})}var p=`

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
`;function m(e,t){let n=s[t],r=n.length,a=[],o=[],c=[];for(let i=0;i<t;i++){a[i]=`@location(${i}) offset${i}: vec2<f32>,`,e?o[i]=`filteredCord + vec2(${i-r+1} * pixelStrength, 0.0),`:o[i]=`filteredCord + vec2(0.0, ${i-r+1} * pixelStrength),`;let s=n[i<r?i:t-i-1].toString();c[i]=`finalColor += textureSample(uTexture, uSampler,
            clamp(offset${i}, gfu.uInputClamp.xy, gfu.uInputClamp.zw)) * ${s};`}let l=a.join(`
`),u=o.join(`
`),d=c.join(`
`),f=p.replace(`%blur-struct%`,l).replace(`%blur-vertex-out%`,u).replace(`%blur-fragment-in%`,l).replace(`%blur-sampling%`,d).replace(`%dimension%`,e?`z`:`w`);return i.from({vertex:{source:f,entryPoint:`mainVertex`},fragment:{source:f,entryPoint:`mainFragment`}})}var h=class e extends o{constructor(t){t={...e.defaultOptions,...t};let n=f(t.horizontal,t.kernelSize),r=m(t.horizontal,t.kernelSize);super({glProgram:n,gpuProgram:r,resources:{blurUniforms:{uStrength:{value:0,type:`f32`}}},...t}),this.horizontal=t.horizontal,this.legacy=t.legacy??!1,this._quality=0,this.quality=t.quality,this.blur=t.strength,this._blurUniforms=this.resources.blurUniforms,this._uniforms=this._blurUniforms.uniforms}apply(e,t,n,r){this.legacy?this._applyLegacy(e,t,n,r):this._applyOptimized(e,t,n,r)}_applyLegacy(e,t,n,i){if(this._uniforms.uStrength=this.strength/this.passes,this.passes===1)e.applyFilter(this,t,n,i);else{let o=a.getSameSizeTexture(t),s=t,c=o;this._state.blend=!1;let l=e.renderer.type===r.WEBGPU;for(let t=0;t<this.passes-1;t++){e.applyFilter(this,s,c,t===0||l);let n=c;c=s,s=n}this._state.blend=!0,e.applyFilter(this,s,n,i),a.returnTexture(o)}}_applyOptimized(e,t,n,i){if(this._uniforms.uStrength=this._calculateInitialStrength(),this.passes===1)e.applyFilter(this,t,n,i);else{let o=a.getSameSizeTexture(t),s=t,c=o;this._state.blend=!1;let l=e.renderer,u=l.type===r.WEBGPU,d=u?l.renderPipes.uniformBatch:null;for(let t=0;t<this.passes-1;t++){d&&this.groups[1].setResource(d.getUboResource(this._blurUniforms),0),e.applyFilter(this,s,c,u);let t=c;c=s,s=t,this._uniforms.uStrength*=.5}d&&this.groups[1].setResource(d.getUboResource(this._blurUniforms),0),this._state.blend=!0,e.applyFilter(this,s,n,i),a.returnTexture(o)}}_calculateInitialStrength(){let e=1,t=.5;for(let n=1;n<this.passes;n++)e+=t*t,t*=.5;return this.strength/Math.sqrt(e)}get blur(){return this.strength}set blur(e){this.padding=1+Math.abs(e)*2,this.strength=e}get quality(){return this._quality}set quality(e){this._quality=e,this.passes=e}};h.defaultOptions={strength:8,quality:4,kernelSize:5,legacy:!1};var g=h,_=class extends o{constructor(...n){let i=n[0]??{};typeof i==`number`&&(e(t,`BlurFilter constructor params are now options object. See params: { strength, quality, resolution, kernelSize }`),i={strength:i},n[1]!==void 0&&(i.quality=n[1]),n[2]!==void 0&&(i.resolution=n[2]||`inherit`),n[3]!==void 0&&(i.kernelSize=n[3])),i={...g.defaultOptions,...i};let{strength:a,strengthX:o,strengthY:s,quality:c,...l}=i;super({...l,compatibleRenderers:r.BOTH,resources:{}}),this._repeatEdgePixels=!1,this.blurXFilter=new g({horizontal:!0,...i}),this.blurYFilter=new g({horizontal:!1,...i}),this.quality=c,this.strengthX=o??a,this.strengthY=s??a,this.repeatEdgePixels=!1}apply(e,t,n,r){let i=Math.abs(this.blurXFilter.strength),o=Math.abs(this.blurYFilter.strength);if(i&&o){let i=a.getSameSizeTexture(t);this.blurXFilter.blendMode=`normal`,this.blurXFilter.apply(e,t,i,!0),this.blurYFilter.blendMode=this.blendMode,this.blurYFilter.apply(e,i,n,r),a.returnTexture(i)}else o?(this.blurYFilter.blendMode=this.blendMode,this.blurYFilter.apply(e,t,n,r)):(this.blurXFilter.blendMode=this.blendMode,this.blurXFilter.apply(e,t,n,r))}updatePadding(){this.padding=this._repeatEdgePixels?0:Math.max(Math.abs(this.blurXFilter.blur),Math.abs(this.blurYFilter.blur))*2}get strength(){if(this.strengthX!==this.strengthY)throw Error(`BlurFilter's strengthX and strengthY are different`);return this.strengthX}set strength(e){this.blurXFilter.blur=this.blurYFilter.blur=e,this.updatePadding()}get quality(){return this.blurXFilter.quality}set quality(e){this.blurXFilter.quality=this.blurYFilter.quality=e}get strengthX(){return this.blurXFilter.blur}set strengthX(e){this.blurXFilter.blur=e,this.updatePadding()}get strengthY(){return this.blurYFilter.blur}set strengthY(e){this.blurYFilter.blur=e,this.updatePadding()}get blur(){return e(`8.3.0`,`BlurFilter.blur is deprecated, please use BlurFilter.strength instead.`),this.strength}set blur(t){e(`8.3.0`,`BlurFilter.blur is deprecated, please use BlurFilter.strength instead.`),this.strength=t}get blurX(){return e(`8.3.0`,`BlurFilter.blurX is deprecated, please use BlurFilter.strengthX instead.`),this.strengthX}set blurX(t){e(`8.3.0`,`BlurFilter.blurX is deprecated, please use BlurFilter.strengthX instead.`),this.strengthX=t}get blurY(){return e(`8.3.0`,`BlurFilter.blurY is deprecated, please use BlurFilter.strengthY instead.`),this.strengthY}set blurY(t){e(`8.3.0`,`BlurFilter.blurY is deprecated, please use BlurFilter.strengthY instead.`),this.strengthY=t}get repeatEdgePixels(){return this._repeatEdgePixels}set repeatEdgePixels(e){this._repeatEdgePixels=e,this.updatePadding()}};_.defaultOptions={strength:8,quality:4,kernelSize:5,legacy:!1};export{_ as t};