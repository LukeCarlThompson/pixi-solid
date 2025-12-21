import{t as d,u as c,v as h,w as f}from"./pixi-stage.CTHuR8Oo.js";const u=class a extends d{constructor(e){e={...a.defaultOptions,...e},super(e),this.enabled=!0,this._state=c.for2d(),this.blendMode=e.blendMode,this.padding=e.padding,typeof e.antialias=="boolean"?this.antialias=e.antialias?"on":"off":this.antialias=e.antialias,this.resolution=e.resolution,this.blendRequired=e.blendRequired,this.clipToViewport=e.clipToViewport,this.addResource("uTexture",0,1),e.blendRequired&&this.addResource("uBackTexture",0,3)}apply(e,t,r,l){e.applyFilter(this,t,r,l)}get blendMode(){return this._state.blendMode}set blendMode(e){this._state.blendMode=e}static from(e){const{gpu:t,gl:r,...l}=e;let n,s;return t&&(n=h.from(t)),r&&(s=f.from(r)),new a({gpuProgram:n,glProgram:s,...l})}};u.defaultOptions={blendMode:"normal",resolution:1,padding:0,antialias:"off",blendRequired:!1,clipToViewport:!0};let b=u;const o={name:"local-uniform-bit",vertex:{header:`

            struct LocalUniforms {
                uTransformMatrix:mat3x3<f32>,
                uColor:vec4<f32>,
                uRound:f32,
            }

            @group(1) @binding(0) var<uniform> localUniforms : LocalUniforms;
        `,main:`
            vColor *= localUniforms.uColor;
            modelMatrix *= localUniforms.uTransformMatrix;
        `,end:`
            if(localUniforms.uRound == 1)
            {
                vPosition = vec4(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
            }
        `}},x={...o,vertex:{...o.vertex,header:o.vertex.header.replace("group(1)","group(2)")}},p={name:"local-uniform-bit",vertex:{header:`

            uniform mat3 uTransformMatrix;
            uniform vec4 uColor;
            uniform float uRound;
        `,main:`
            vColor *= uColor;
            modelMatrix = uTransformMatrix;
        `,end:`
            if(uRound == 1.)
            {
                gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
            }
        `}};class g{constructor(){this.batcherName="default",this.topology="triangle-list",this.attributeSize=4,this.indexSize=6,this.packAsQuad=!0,this.roundPixels=0,this._attributeStart=0,this._batcher=null,this._batch=null}get blendMode(){return this.renderable.groupBlendMode}get color(){return this.renderable.groupColorAlpha}reset(){this.renderable=null,this.texture=null,this._batcher=null,this._batch=null,this.bounds=null}destroy(){}}function v(i,e,t){const r=(i>>24&255)/255;e[t++]=(i&255)/255*r,e[t++]=(i>>8&255)/255*r,e[t++]=(i>>16&255)/255*r,e[t++]=r}export{g as B,b as F,o as a,p as b,v as c,x as l};
