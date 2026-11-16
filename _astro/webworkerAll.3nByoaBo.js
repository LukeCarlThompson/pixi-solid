import{M as w,B as k,A as v,H as B,h as M,f as g,g as _,a3 as O,X as A,w as E,K as P}from"./pixi-canvas.DUqT5F9V.js";import{c as U}from"./canvasUtils.BUQQU6Hq.js";import{C as z}from"./CanvasPool.Cs4NuNeE.js";import{g as V}from"./getPo2TextureFromSource.DVGw2xXn.js";import{G as Y,a as q}from"./Shader.C8jqO_v2.js";import{F as W}from"./Filter.hPQlQB4k.js";const b=new w;function G(x,e){e.clear();const t=e.matrix;for(let r=0;r<x.length;r++){const i=x[r];if(i.globalDisplayStatus<7)continue;const s=i.renderGroup??i.parentRenderGroup;s?.isCachedAsTexture?e.matrix=b.copyFrom(s.textureOffsetInverseTransform).append(i.worldTransform):s?._parentCacheAsTextureRenderGroup?e.matrix=b.copyFrom(s._parentCacheAsTextureRenderGroup.inverseWorldTransform).append(i.groupTransform):e.matrix=i.worldTransform,e.addBounds(i.bounds)}return e.matrix=t,e}function y(x){return typeof x.getCanvasFilterString=="function"}class L{constructor(){this.skip=!1,this.useClip=!1,this.filters=null,this.container=null,this.bounds=new k,this.cssFilterString=""}}class R{constructor(e){this._filterStack=[],this._filterStackIndex=0,this._savedStates=[],this._alphaMultiplier=1,this._warnedFilterTypes=new Set,this.renderer=e}push(e){const t=this._pushFilterFrame(),r=e.filterEffect.filters;if(t.skip=!1,t.useClip=!1,t.filters=r,t.container=e.container,t.cssFilterString="",r.every(a=>!a.enabled)){t.skip=!0;return}const i=[],s=1;for(const a of r){if(!a.enabled)continue;if(!y(a)){this._warnUnsupportedFilter(a);continue}const l=a.getCanvasFilterString();if(l===null){this._warnUnsupportedFilter(a);continue}l&&i.push(l)}if(i.length===0&&s===1){t.skip=!0;return}t.cssFilterString=i.join(" "),this._calculateFilterArea(e,t.bounds),t.useClip=!!e.filterEffect.filterArea;const n=this.renderer.canvasContext.activeContext,o=n.filter||"none";if(this._savedStates.push({filter:o,alphaMultiplier:this._alphaMultiplier}),t.useClip&&Number.isFinite(t.bounds.width)&&Number.isFinite(t.bounds.height)&&t.bounds.width>0&&t.bounds.height>0){const a=this.renderer.canvasContext.activeResolution||1;n.save(),n.setTransform(1,0,0,1,0,0),n.beginPath(),n.rect(t.bounds.x*a,t.bounds.y*a,t.bounds.width*a,t.bounds.height*a),n.clip()}else t.useClip=!1;t.cssFilterString&&(n.filter=o!=="none"?`${o} ${t.cssFilterString}`:t.cssFilterString)}pop(){const e=this._popFilterFrame();if(e.skip)return;const t=this._savedStates.pop();if(!t)return;const r=this.renderer.canvasContext.activeContext;e.useClip?r.restore():r.filter=t.filter,this._alphaMultiplier=t.alphaMultiplier}generateFilteredTexture({texture:e,filters:t}){if(!t?.length||t.every(p=>!p.enabled))return e;const r=[],i=1;for(const p of t){if(!p.enabled)continue;if(!y(p)){this._warnUnsupportedFilter(p);continue}const h=p.getCanvasFilterString();if(h===null){this._warnUnsupportedFilter(p);continue}h&&r.push(h)}if(r.length===0&&i===1)return e;const s=U.getCanvasSource(e);if(!s)return e;const n=e.frame,o=e.source._resolution??e.source.resolution??1,a=n.width,l=n.height,f=z.getOptimalCanvasAndContext(a,l,o),{canvas:c,context:u}=f;u.setTransform(1,0,0,1,0,0),u.clearRect(0,0,c.width,c.height),r.length&&(u.filter=r.join(" "));const d=n.x*o,T=n.y*o,m=a*o,F=l*o;return u.drawImage(s,d,T,m,F,0,0,m,F),u.filter="none",u.globalAlpha=1,V(c,a,l,o)}_calculateFilterArea(e,t){if(e.renderables?G(e.renderables,t):e.filterEffect.filterArea?(t.clear(),t.addRect(e.filterEffect.filterArea),t.applyMatrix(e.container.worldTransform)):e.container.getFastGlobalBounds(!0,t),e.container){const i=(e.container.renderGroup||e.container.parentRenderGroup)?.cacheToLocalTransform;i&&t.applyMatrix(i)}}_warnUnsupportedFilter(e){const t=e?.constructor?.name||"Filter";this._warnedFilterTypes.has(t)||(this._warnedFilterTypes.add(t),console.warn(`CanvasRenderer: filter "${t}" is not supported in Canvas2D and will be skipped.`))}get alphaMultiplier(){return this._alphaMultiplier}_pushFilterFrame(){let e=this._filterStack[this._filterStackIndex];return e||(e=this._filterStack[this._filterStackIndex]=new L),this._filterStackIndex++,e}_popFilterFrame(){return this._filterStackIndex<=0?this._filterStack[0]:(this._filterStackIndex--,this._filterStack[this._filterStackIndex])}destroy(){this._filterStack=null,this._savedStates=null,this._warnedFilterTypes=null,this._alphaMultiplier=1}}R.extension={type:[v.CanvasSystem],name:"filter"};var X=`in vec2 aPosition;
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
`,D=`in vec2 vTextureCoord;
out vec4 finalColor;
uniform sampler2D uTexture;
void main() {
    finalColor = texture(uTexture, vTextureCoord);
}
`,S=`struct GlobalFilterUniforms {
  uInputSize: vec4<f32>,
  uInputPixel: vec4<f32>,
  uInputClamp: vec4<f32>,
  uOutputFrame: vec4<f32>,
  uGlobalFrame: vec4<f32>,
  uOutputTexture: vec4<f32>,
};

@group(0) @binding(0) var <uniform> gfu: GlobalFilterUniforms;
@group(0) @binding(1) var uTexture: texture_2d<f32>;
@group(0) @binding(2) var uSampler: sampler;

struct VSOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>
};

fn filterVertexPosition(aPosition: vec2<f32>) -> vec4<f32>
{
    var position = aPosition * gfu.uOutputFrame.zw + gfu.uOutputFrame.xy;

    position.x = position.x * (2.0 / gfu.uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0 * gfu.uOutputTexture.z / gfu.uOutputTexture.y) - gfu.uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

fn filterTextureCoord(aPosition: vec2<f32>) -> vec2<f32>
{
    return aPosition * (gfu.uOutputFrame.zw * gfu.uInputSize.zw);
}

@vertex
fn mainVertex(
  @location(0) aPosition: vec2<f32>,
) -> VSOutput {
  return VSOutput(
   filterVertexPosition(aPosition),
   filterTextureCoord(aPosition)
  );
}

@fragment
fn mainFragment(
  @location(0) uv: vec2<f32>,
) -> @location(0) vec4<f32> {
    return textureSample(uTexture, uSampler, uv);
}
`;class j extends W{constructor(){const e=Y.from({vertex:{source:S,entryPoint:"mainVertex"},fragment:{source:S,entryPoint:"mainFragment"},name:"passthrough-filter"}),t=q.from({vertex:X,fragment:D,name:"passthrough-filter"});super({gpuProgram:e,glProgram:t})}}class C{constructor(e){this._renderer=e}push(e,t,r){this._renderer.renderPipes.batch.break(r),r.add({renderPipeId:"filter",canBundle:!1,action:"pushFilter",container:t,filterEffect:e})}pop(e,t,r){this._renderer.renderPipes.batch.break(r),r.add({renderPipeId:"filter",action:"popFilter",canBundle:!1})}execute(e){e.action==="pushFilter"?this._renderer.filter.push(e):e.action==="popFilter"&&this._renderer.filter.pop()}destroy(){this._renderer=null}}C.extension={type:[v.WebGLPipes,v.WebGPUPipes,v.CanvasPipes],name:"filter"};const H=new O({attributes:{aPosition:{buffer:new Float32Array([0,0,1,0,1,1,0,1]),format:"float32x2",stride:8,offset:0}},indexBuffer:new Uint32Array([0,1,2,0,2,3])});class N{constructor(){this.skip=!1,this.inputTexture=null,this.backTexture=null,this.filters=null,this.bounds=new k,this.container=null,this.blendRequired=!1,this.outputRenderSurface=null,this.firstEnabledIndex=-1,this.lastEnabledIndex=-1}}class I{constructor(e){this._filterStackIndex=0,this._filterStack=[],this._filterGlobalUniforms=new B({uInputSize:{value:new Float32Array(4),type:"vec4<f32>"},uInputPixel:{value:new Float32Array(4),type:"vec4<f32>"},uInputClamp:{value:new Float32Array(4),type:"vec4<f32>"},uOutputFrame:{value:new Float32Array(4),type:"vec4<f32>"},uGlobalFrame:{value:new Float32Array(4),type:"vec4<f32>"},uOutputTexture:{value:new Float32Array(4),type:"vec4<f32>"}}),this._globalFilterBindGroup=new M({}),this.renderer=e}init(){g.on("evict",this._unbindPassTextures,this)}get activeBackTexture(){return this._activeFilterData?.backTexture}push(e){const t=this.renderer,r=e.filterEffect.filters,i=this._pushFilterData();i.skip=!1,i.filters=r,i.container=e.container,i.outputRenderSurface=t.renderTarget.renderSurface;const s=t.renderTarget.renderTarget.colorTexture.source,n=s.resolution,o=s.antialias;if(r.every(f=>!f.enabled)){i.skip=!0;return}const a=i.bounds;if(this._calculateFilterArea(e,a),this._calculateFilterBounds(i,t.renderTarget.rootViewPort,o,n,1),i.skip)return;const l=this._getPreviousFilterData();this._setupFilterTextures(i,a,t,l)}generateFilteredTexture({texture:e,filters:t}){if(t.every(f=>!f.enabled))return e;const r=this._pushFilterData();this._activeFilterData=r,r.skip=!1,r.filters=t;const i=e.source,s=i.resolution,n=i.antialias,o=r.bounds;if(o.clear(),o.addRect(e.frame),this._calculateFilterBounds(r,o.rectangle,n,s,0),r.skip)return this._popFilterData(),e;r.outputRenderSurface=g.getOptimalTexture({width:o.width,height:o.height,resolution:r.resolution,antialias:r.antialias}),r.backTexture=_.EMPTY,r.inputTexture=e,this.renderer.renderTarget.finishRenderPass(),this._applyFiltersToTexture(r,!0);const l=r.outputRenderSurface;return l.source.alphaMode="premultiplied-alpha",this._popFilterData(),l}pop(){const e=this.renderer,t=this._popFilterData();t.skip||(e.globalUniforms.pop(),e.renderTarget.finishRenderPass(),this._activeFilterData=t,this._applyFiltersToTexture(t,!1),t.blendRequired&&g.returnTexture(t.backTexture),g.returnTexture(t.inputTexture))}getBackTexture(e,t,r){const{_resolution:i,format:s}=e.colorTexture.source,n=g.getOptimalTexture({width:t.width,height:t.height,resolution:i,format:s});return this._copyBackTexture(e,n,t,r)}_copyBackTexture(e,t,r,i){const s=t.source._resolution;let n=r.minX,o=r.minY;i&&(n-=i.minX,o-=i.minY),n=Math.floor(n*s+1e-6),o=Math.floor(o*s+1e-6);const a=Math.min(Math.ceil(r.width*s),t.source.pixelWidth),l=Math.min(Math.ceil(r.height*s),t.source.pixelHeight);return this.renderer.renderTarget.copyToTexture(e,t,{x:n,y:o},{width:a,height:l},{x:0,y:0}),t}applyFilter(e,t,r,i){const s=this.renderer,n=this._activeFilterData,a=n.outputRenderSurface===r,l=this._findClosestFilterData(),f=l?l.inputTexture.source._resolution:s.renderTarget.rootRenderTarget.colorTexture.source._resolution;let c=0,u=0;a&&l&&(c=l.bounds.minX,u=l.bounds.minY),this._updateFilterUniforms(t,r,n,c,u,f,a,i);const d=e.enabled?e:this._getPassthroughFilter();this._setupBindGroupsAndRender(d,t,s)}calculateSpriteMatrix(e,t){const r=this._activeFilterData,i=e.set(r.inputTexture._source.width,0,0,r.inputTexture._source.height,r.bounds.minX,r.bounds.minY),s=t.worldTransform.copyTo(w.shared),n=t.renderGroup||t.parentRenderGroup;return n&&n.cacheToLocalTransform&&s.prepend(n.cacheToLocalTransform),s.invert(),i.prepend(s),i.scale(1/t.texture.orig.width,1/t.texture.orig.height),i.translate(t.anchor.x,t.anchor.y),i}destroy(){this._passthroughFilter?.destroy(!0),this._passthroughFilter=null,g.off("evict",this._unbindPassTextures,this),this._globalFilterBindGroup.destroy()}_unbindPassTextures(){const e=this._globalFilterBindGroup;e.setResource(_.EMPTY.source,1),e.setResource(_.EMPTY.source.style,2),e.setResource(_.EMPTY.source,3)}_getPassthroughFilter(){return this._passthroughFilter??(this._passthroughFilter=new j),this._passthroughFilter}_setupBindGroupsAndRender(e,t,r){if(r.renderPipes.uniformBatch){const i=r.renderPipes.uniformBatch.getUboResource(this._filterGlobalUniforms);this._globalFilterBindGroup.setResource(i,0)}else this._globalFilterBindGroup.setResource(this._filterGlobalUniforms,0);this._globalFilterBindGroup.setResource(t.source,1),this._globalFilterBindGroup.setResource(t.source.style,2),e.groups[0]=this._globalFilterBindGroup,r.encoder.draw({geometry:H,shader:e,state:e._state,topology:"triangle-list"}),r.type===A.WEBGL&&r.renderTarget.finishRenderPass()}_setupFilterTextures(e,t,r,i){if(e.backTexture=_.EMPTY,e.inputTexture=g.getOptimalTexture({width:t.width,height:t.height,resolution:e.resolution,antialias:e.antialias}),e.blendRequired){r.renderTarget.finishRenderPass();const s=r.renderTarget.getRenderTarget(e.outputRenderSurface),n=s.colorTexture.source,o=g.getAlignedTexture(e.inputTexture,n._resolution,n.format);e.backTexture=this._copyBackTexture(s,o,t,i?.bounds)}r.renderTarget.bind({target:e.inputTexture,clear:!0}),r.globalUniforms.push({offset:t})}_updateFilterUniforms(e,t,r,i,s,n,o,a){const l=this._filterGlobalUniforms.uniforms,f=l.uOutputFrame,c=l.uInputSize,u=l.uInputPixel,d=l.uInputClamp,T=l.uGlobalFrame,m=l.uOutputTexture;o?(f[0]=r.bounds.minX-i,f[1]=r.bounds.minY-s):(f[0]=0,f[1]=0),f[2]=e.frame.width,f[3]=e.frame.height,c[0]=e.source.width,c[1]=e.source.height,c[2]=1/c[0],c[3]=1/c[1],u[0]=e.source.pixelWidth,u[1]=e.source.pixelHeight,u[2]=1/u[0],u[3]=1/u[1],d[0]=.5*u[2],d[1]=.5*u[3],d[2]=e.frame.width*c[2]-.5*u[2],d[3]=e.frame.height*c[3]-.5*u[3];const F=this.renderer.renderTarget.rootRenderTarget.colorTexture;T[0]=i*n,T[1]=s*n,T[2]=F.source.width*n,T[3]=F.source.height*n,t instanceof _&&(t.source.resource=null);const p=this.renderer.renderTarget.getRenderTarget(t);this.renderer.renderTarget.bind({target:t,clear:!!a}),t instanceof _?(m[0]=t.frame.width,m[1]=t.frame.height):(m[0]=p.width,m[1]=p.height),m[2]=p.isRoot?-1:1,this._filterGlobalUniforms.update()}_findClosestFilterData(){for(let e=this._filterStackIndex-1;e>=0;e--){const t=this._filterStack[e];if(!t.skip)return t}return null}_calculateFilterArea(e,t){if(e.renderables?G(e.renderables,t):e.filterEffect.filterArea?(t.clear(),t.addRect(e.filterEffect.filterArea),t.applyMatrix(e.container.worldTransform)):e.container.getFastGlobalBounds(!0,t),e.container){const i=(e.container.renderGroup||e.container.parentRenderGroup).cacheToLocalTransform;i&&t.applyMatrix(i)}}_applyFiltersToTexture(e,t){const r=e.inputTexture,i=e.bounds,s=e.filters,n=e.firstEnabledIndex,o=e.lastEnabledIndex;if(this._globalFilterBindGroup.setResource(r.source.style,2),this._globalFilterBindGroup.setResource(e.backTexture.source,3),n===o)s[n].apply(this,r,e.outputRenderSurface,t);else{let a=e.inputTexture;const l=g.getOptimalTexture({width:i.width,height:i.height,resolution:a.source._resolution});let f=l;for(let c=n;c<o;c++){const u=s[c];if(!u.enabled)continue;u.apply(this,a,f,!0);const d=a;a=f,f=d}s[o].apply(this,a,e.outputRenderSurface,t),g.returnTexture(l)}}_calculateFilterBounds(e,t,r,i,s){const n=this.renderer,o=e.bounds,a=e.filters;let l=1/0,f=0,c=!0,u=!1,d=!1,T=!0,m=-1,F=-1;for(let p=0;p<a.length;p++){const h=a[p];if(!h.enabled)continue;if(m===-1&&(m=p),F=p,l=Math.min(l,h.resolution==="inherit"?i:h.resolution),f+=h.padding,h.antialias==="off"?c=!1:h.antialias==="inherit"&&c&&(c=r),h.clipToViewport||(T=!1),!!!(h.compatibleRenderers&n.type)){d=!1;break}if(h.blendRequired&&!(n.backBuffer?.useBackBuffer??!0)){E("Blend filter requires backBuffer on WebGL renderer to be enabled. Set `useBackBuffer: true` in the renderer options."),d=!1;break}d=!0,u||(u=h.blendRequired)}if(!d){e.skip=!0;return}if(T&&o.fitBounds(0,t.width/i,0,t.height/i),o.scale(l).ceil().scale(1/l).pad((f|0)*s),!o.isPositive){e.skip=!0;return}e.antialias=c,e.resolution=l,e.blendRequired=u,e.firstEnabledIndex=m,e.lastEnabledIndex=F}_popFilterData(){return this._filterStackIndex--,this._filterStack[this._filterStackIndex]}_getPreviousFilterData(){for(let e=this._filterStackIndex-2;e>=0;e--){const t=this._filterStack[e];if(!t.skip)return t}return null}_pushFilterData(){let e=this._filterStack[this._filterStackIndex];return e||(e=this._filterStack[this._filterStackIndex]=new N),this._filterStackIndex++,e}}I.extension={type:[v.WebGLSystem,v.WebGPUSystem],name:"filter"};P.add(I,R);P.add(C);
