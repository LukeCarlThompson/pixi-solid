import{h as q,G as $,w as ce,x as Se,y as ue,z as we,E as re,N as Pe,H as Te,I as ee,J as Le,K as De,L as Me,O as he,T as ze,U as Ie,M as Ae}from"./view-3d.CbSxVUmV.js";import{C as Oe}from"./CubeGeometry.cewMChAF.js";import{C as Be,s as Ve}from"./pixi-canvas.DUqT5F9V.js";import{m as pe,f as te,o as me,p as _e}from"./solid.cm6h0zV4.js";function Fe(r,o,s,e,t,i){const a=q(e,3),n=q(t,1),l=s*.5,v=(o-r)/s,F=1/Math.sqrt(1+v*v),C=v*F,G=1/a,N=1/n,g=a+1,E=new Float32Array(g),y=new Float32Array(g),I=Math.PI*2*G;for(let p=0;p<g;p++){const m=p*I;E[p]=Math.sin(m),y[p]=Math.cos(m)}const H=o===0,S=g*(n+1),c=a*n*6-(a*3+(H?a*3:0)),f=!i&&!H,x=0,h=f?g+1:0,u=0,A=f?a*3:0,D=S+x+h,O=c+u+A,d=new Float32Array(D*3),b=new Float32Array(D*3),B=new Float32Array(D*2),w=new(D>65536?Uint32Array:Uint16Array)(O);let P=0,T=0,V=0,L=0;for(let p=0;p<=n;p++){const m=p*N,_=m*(o-r)+r,z=l-m*s;for(let M=0;M<=a;M++){const K=M*G,U=E[M],R=y[M];d[P++]=_*R,d[P++]=z,d[P++]=_*U,b[T++]=R*F,b[T++]=C,b[T++]=U*F,B[V++]=K,B[V++]=m}}for(let p=0;p<n;p++){const m=p===0,_=H&&p===n-1;for(let z=0;z<a;z++){const M=p*g+z,K=M+1,U=M+g,R=U+1;m||(w[L++]=M,w[L++]=K,w[L++]=U),_||(w[L++]=K,w[L++]=R,w[L++]=U)}}if(f){const p=P/3;d[P++]=0,d[P++]=-l,d[P++]=0,b[T++]=0,b[T++]=-1,b[T++]=0,B[V++]=.5,B[V++]=.5;for(let m=0;m<=a;m++){const _=y[m],z=E[m];d[P++]=o*_,d[P++]=-l,d[P++]=o*z,b[T++]=0,b[T++]=-1,b[T++]=0,B[V++]=_*.5+.5,B[V++]=z*.5+.5}for(let m=0;m<a;m++)w[L++]=p,w[L++]=p+m+1,w[L++]=p+m+2}return{positions:d,normals:b,uvs:B,indices:w}}var Ge=class fe extends ${static defaultOptions={...$.defaultOptions,radius:1,height:2,radialSegments:32,heightSegments:1,openEnded:!1};constructor(o={}){const s={...fe.defaultOptions,...o},{radius:e,height:t,radialSegments:i,heightSegments:a,openEnded:n}=s,l=Fe(0,e,t,i,a,n);super({...s,...l})}},He=class de extends ${static defaultOptions={...$.defaultOptions,radius:1,widthSegments:32,heightSegments:16};constructor(o={}){const s={...de.defaultOptions,...o},{radius:e}=s,t=q(s.widthSegments,3),i=q(s.heightSegments,2),a=(t+1)*(i+1),n=(i-1)*t*2,l=new Float32Array(a*3),v=new Float32Array(a*3),F=new Float32Array(a*2),C=a<=65536?new Uint16Array(n*3):new Uint32Array(n*3),G=new Float64Array(i+1),N=new Float64Array(i+1);for(let c=0;c<=i;c++){const f=c/i*Math.PI;G[c]=Math.sin(f),N[c]=Math.cos(f)}const g=new Float64Array(t+1),E=new Float64Array(t+1);for(let c=0;c<=t;c++){const f=c/t*Math.PI*2;g[c]=Math.sin(f),E[c]=Math.cos(f)}let y=0,I=0;for(let c=0;c<=i;c++){const f=c/i,x=G[c],h=N[c];for(let u=0;u<=t;u++){const A=u/t,D=g[u],O=x*E[u],d=h,b=x*D;l[y]=O*e,l[y+1]=d*e,l[y+2]=b*e,v[y]=O,v[y+1]=d,v[y+2]=b,y+=3,F[I]=A,F[I+1]=f,I+=2}}const H=t+1;let S=0;for(let c=0;c<i;c++)for(let f=0;f<t;f++){const x=c*H+f,h=x+1,u=x+H,A=u+1;c!==0&&(C[S]=x,C[S+1]=h,C[S+2]=u,S+=3),c!==i-1&&(C[S]=h,C[S+1]=A,C[S+2]=u,S+=3)}super({...s,positions:l,normals:v,uvs:F,indices:C})}},Ue=class ge extends ${static defaultOptions={...$.defaultOptions,radius:1,tube:.4,tubularSegments:64,radialSegments:8,p:2,q:3};constructor(o={}){const s={...ge.defaultOptions,...o},{radius:e,tube:t,p:i,q:a}=s,n=q(s.tubularSegments,3),l=q(s.radialSegments,3),v=(l+1)*(n+1),F=l*n*6,C=new Float32Array(v*3),G=new Float32Array(v*3),N=new Float32Array(v*2),g=v>65536?new Uint32Array(F):new Uint16Array(F),E=new Float64Array(l+1),y=new Float64Array(l+1);for(let h=0;h<=l;h++){const u=h/l*Math.PI*2;E[h]=Math.cos(u),y[h]=Math.sin(u)}const I=a/i;let H=0,S=0,c=0;for(let h=0;h<=n;h++){const u=h/n*i*Math.PI*2,A=Math.cos(u),D=Math.sin(u),O=Math.cos(I*u),d=Math.sin(I*u),b=(2+O)*.5,B=e*b*A,w=e*d*.5,P=e*b*D,T=e*.5*(-I*d*A-(2+O)*D),V=e*.5*I*O,L=e*.5*(-I*d*D+(2+O)*A),p=V*P-L*w,m=L*B-T*P,_=T*w-V*B,z=Math.sqrt(p*p+m*m+_*_),M=p/z,K=m/z,U=_/z,R=K*L-U*V,Y=U*T-M*L,Q=M*V-K*T,W=Math.sqrt(R*R+Y*Y+Q*Q),be=R/W,xe=Y/W,Ce=Q/W,ye=h/n;for(let j=0;j<=l;j++){const X=E[j],Z=y[j],se=-X*be+Z*M,ae=-X*xe+Z*K,oe=-X*Ce+Z*U;C[H++]=B+t*se,C[H++]=w+t*ae,C[H++]=P+t*oe,G[S++]=se,G[S++]=ae,G[S++]=oe,N[c++]=ye,N[c++]=j/l}}const f=l+1;let x=0;for(let h=1;h<=n;h++)for(let u=1;u<=l;u++){const A=f*(h-1)+(u-1),D=f*h+(u-1),O=f*h+u,d=f*(h-1)+u;g[x++]=A,g[x++]=D,g[x++]=d,g[x++]=D,g[x++]=O,g[x++]=d}super({...s,positions:C,normals:G,uvs:N,indices:g})}};const Ee=ce({name:"phongLighting",requires:[Se],preLighting:{gpu:`
  var directLight = vec3<f32>(0.0);

  let albedoOverPI = albedo * INV_PI;
  let specScale = (shininess * 0.5 + 1.0) * INV_PI * 0.25 * specularStrength;
`,gl:`
  vec3 directLight = vec3(0.0);

  vec3 albedoOverPI = albedo * INV_PI;
  float specScale = (shininess * 0.5 + 1.0) * INV_PI * 0.25 * specularStrength;
`},perLight:{gpu:`
    let halfVector = normalize(viewDir + lightDir);
    let nDotH = max(dot(normal, halfVector), 0.0);
    let vDotH = max(dot(viewDir, halfVector), 0.0);

    let fc5 = exp2((-5.55473 * vDotH - 6.98316) * vDotH);
    let fresnel = specularColor + (vec3<f32>(1.0) - specularColor) * fc5;
    let specular = fresnel * (specScale * pow(nDotH, shininess));

    let irradiance = light.color * (nDotL * attenuation * shadow);
    directLight += (albedoOverPI + specular) * irradiance;
`,gl:`
    vec3 halfVector = normalize(viewDir + lightDir);
    float nDotH = max(dot(normal, halfVector), 0.0);
    float vDotH = max(dot(viewDir, halfVector), 0.0);

    float fc5 = exp2((-5.55473 * vDotH - 6.98316) * vDotH);
    vec3 fresnel = specularColor + (vec3(1.0) - specularColor) * fc5;
    vec3 specular = fresnel * (specScale * pow(nDotH, shininess));

    vec3 irradiance = light.color * (nDotL * attenuation * shadow);
    directLight += (albedoOverPI + specular) * irradiance;
`},postLighting:{gpu:`
  let ambient = global.uGlobalLightParams.xyz * albedoOverPI + sampleEnvironment(normal, 1.0) * albedo;
  finalColor = ambient + directLight + emissive;
`,gl:`
  vec3 ambient = uGlobalLightParams.xyz * albedoOverPI + sampleEnvironment(normal, 1.0) * albedo;
  finalColor = ambient + directLight + emissive;
`}}),ne={name:"phongMaterial",textures:["baseColor","normal"],bindings:{material:{baseColor:"vec4<f32>",specularColor:"vec3<f32>",shininess:"f32",specularStrength:"f32",alphaCutoff:"f32",normalScale:"f32"}},gpu:{fragment:{material:`
  var emissive: vec3<f32> = vec3<f32>(0.0);
  var specularStrength = material.specularStrength;

  var baseColor = material.baseColor;

  var baseTex = sampleBaseColor(input.vUV);
  let baseTexLinear = baseTex.rgb / max(baseTex.a, 0.001);
  baseTex = vec4<f32>(pow(baseTexLinear, vec3<f32>(2.2)), baseTex.a);
  baseColor *= baseTex;

  albedo *= baseColor.rgb;
  alpha *= baseColor.a;

  let viewDir = normalize(camera.uCameraPosition.xyz - input.vPosition);
  let specularColor = material.specularColor;
  let shininess = max(material.shininess, 1.0);
`}},gl:{fragment:{material:`
  vec3 emissive = vec3(0.0);
  float specularStrength = material.specularStrength;

  vec4 baseColor = material.baseColor;

  vec4 baseTex = sampleBaseColor(vUV);
  vec3 baseTexLinear = baseTex.rgb / max(baseTex.a, 0.001);
  baseTex.rgb = pow(baseTexLinear, vec3(2.2));
  baseColor *= baseTex;

  albedo *= baseColor.rgb;
  alpha *= baseColor.a;

  vec3 viewDir = normalize(uCameraPosition.xyz - vPosition);
  vec3 specularColor = material.specularColor;
  float shininess = max(material.shininess, 1.0);
`}}},Ne={name:"phongSpecularTexture",textures:["specular"],gpu:{fragment:{material:`
  specularStrength *= sampleSpecular(input.vUV).r;
`}},gl:{fragment:{material:`
  specularStrength *= sampleSpecular(vUV).r;
`}}};var Ke=class extends ue{emissive;_featureBits=[];_specularColorTint=1118481;constructor(r={}){const{specularTexture:o,normalTexture:s,emissive:e}=r;super(r);const t={baseColor:r.baseColorTexture,normal:s??Pe,...r.textures};if(o&&(t.specular=o,this._featureBits.push(Ne)),e&&(t.emissive=e.texture,this._featureBits.push(we)),this._deriveLayoutFromBits([ne,re,...this._featureBits,...this.extraBits],t),this.shininess=r.shininess??30,this.specularStrength=r.specularStrength??1,this.specularColor=r.specularColor??1118481,this.normalScale=r.normalScale??1,e){const i=this.emissive=new Te(this);i.color=e.color??16777215,i.strength=e.strength??1}}_descriptorByEnvKey=Object.create(null);getPrimaryDescriptor(r){this._variantDirty&&(this._descriptorByEnvKey=Object.create(null),this._variantDirty=!1);const o=r._envBit;let s=this._descriptorByEnvKey[o.name];if(s)return s;const e=[ne,o,re];for(let t=0;t<this._featureBits.length;t++)e.push(this._featureBits[t]);for(let t=0;t<this.extraBits.length;t++)e.push(this.extraBits[t]);return e.push(Ee),this._alphaMode==="mask"&&e.push(ee),s=new Le({}),s.update({bitsGpu:e,bitsGl:e}),this._descriptorByEnvKey[o.name]=s,s}_toOptions(){const{emissive:r,textures:o}=this;return{...super._toOptions(),specularColor:this.specularColor,shininess:this.shininess,specularStrength:this.specularStrength,normalScale:this.normalScale,specularTexture:o.specular,normalTexture:o.normal,emissive:r&&De(r)}}get shininess(){return this.data.shininess}set shininess(r){this.data.shininess=r}get specularStrength(){return this.data.specularStrength}set specularStrength(r){this.data.specularStrength=r}get normalScale(){return this.data.normalScale}set normalScale(r){this.data.normalScale=r}get specularColor(){return this._specularColorTint}set specularColor(r){const o=Be.shared.setValue(r);this._specularColorTint=o.toNumber();const s=this.data?.specularColor;s&&(Me(s,0,o),this.update())}destroy(r){this.destroyed||(super.destroy(r),this._descriptorByEnvKey=null,this._featureBits=null,this.emissive=void 0)}};const ie={name:"toonMaterial",textures:["baseColor"],bindings:{material:{baseColor:"vec4<f32>",bands:"f32",specularSize:"f32",rimPower:"f32",rimIntensity:"f32",alphaCutoff:"f32"}},gpu:{fragment:{material:`
  var baseColor = material.baseColor;

  if (HAS_UVS == 1) {
    var baseTex = sampleBaseColor(input.vUV);
    baseTex = vec4<f32>(baseTex.rgb / max(baseTex.a, 0.001), baseTex.a);
    baseColor *= baseTex;
  }

  albedo *= baseColor.rgb;
  alpha *= baseColor.a;

  var viewDir = normalize(camera.uCameraPosition.xyz - input.vPosition);
  let bands = max(material.bands, 1.0);
  let specularSize = material.specularSize;
  let rimPower = material.rimPower;
  let rimIntensity = material.rimIntensity;
`}},gl:{fragment:{material:`
  vec4 baseColor = material.baseColor;

  if (HAS_UVS == 1) {
    vec4 baseTex = sampleBaseColor(vUV);
    baseTex.rgb /= max(baseTex.a, 0.001);
    baseColor *= baseTex;
  }

  albedo *= baseColor.rgb;
  alpha *= baseColor.a;

  vec3 viewDir = normalize(uCameraPosition.xyz - vPosition);
  float bands = max(material.bands, 1.0);
  float specularSize = material.specularSize;
  float rimPower = material.rimPower;
  float rimIntensity = material.rimIntensity;
`}}},le=ce({name:"toonLighting",preLighting:{gpu:`
  var diffuseLight = vec3<f32>(0.0);
  var specLight = vec3<f32>(0.0);

  let ambientColor = global.uGlobalLightParams.xyz;
  diffuseLight += ambientColor * 0.4;
`,gl:`
  vec3 diffuseLight = vec3(0.0);
  vec3 specLight = vec3(0.0);

  diffuseLight += uGlobalLightParams.xyz * 0.4;
`},perLight:{gpu:`
    let litAmount = nDotL * attenuation * shadow;

    let quantized = floor(litAmount * bands + 0.5) / bands;
    diffuseLight += light.color * quantized;

    let halfVector = normalize(viewDir + lightDir);
    let nDotH = max(dot(normal, halfVector), 0.0);
    let specStep = smoothstep(1.0 - specularSize - 0.02, 1.0 - specularSize, nDotH);
    specLight += light.color * specStep * shadow * step(0.01, litAmount);
`,gl:`
    float litAmount = nDotL * attenuation * shadow;

    float quantized = floor(litAmount * bands + 0.5) / bands;
    diffuseLight += light.color * quantized;

    vec3 halfVector = normalize(viewDir + lightDir);
    float nDotH = max(dot(normal, halfVector), 0.0);
    float specStep = smoothstep(1.0 - specularSize - 0.02, 1.0 - specularSize, nDotH);
    specLight += light.color * specStep * shadow * step(0.01, litAmount);
`},postLighting:{gpu:`
  let nDotV = max(dot(normal, viewDir), 0.0);
  let rimFactor = pow(1.0 - nDotV, rimPower) * rimIntensity;

  finalColor = albedo * diffuseLight + specLight * 0.5 + vec3<f32>(rimFactor);
`,gl:`
  float nDotV = max(dot(normal, viewDir), 0.0);
  float rimFactor = pow(1.0 - nDotV, rimPower) * rimIntensity;

  finalColor = albedo * diffuseLight + specLight * 0.5 + vec3(rimFactor);
`}});var Re=class ve extends ue{static defaultOptions={bands:3,specularSize:.15,rimPower:3,rimIntensity:.4,outline:!0};constructor(o={}){const{bands:s,specularSize:e,rimPower:t,rimIntensity:i,outline:a,...n}={...ve.defaultOptions,...Ve(o)},l=[ie,le],v=[ie,le];n.alphaMode==="mask"&&(l.push(ee),v.push(ee)),super({...n,descriptor:{bitsGpu:l,bitsGl:v},passes:{outline:a,...n.passes}}),this.data.bands=s,this.data.specularSize=e,this.data.rimPower=t,this.data.rimIntensity=i}_toOptions(){const o=super._toOptions(),{outline:s,...e}=o.passes??{},{bands:t,specularSize:i,rimPower:a,rimIntensity:n}=this.data;return{...o,passes:e,outline:!!s,bands:t,specularSize:i,rimPower:a,rimIntensity:n}}},k=r=>o=>{const s=he(),[e,t]=pe(o,["ref","as"]),i=e.as!==void 0,a=e.as||new r(t);return te(()=>{e.ref&&e.ref(a)}),s.registerGeometry(a),me(()=>{s.unregisterGeometry(a),i||a.destroy()}),null},J=r=>o=>{const s=he(),[e,t]=pe(o,["ref","as"]),i=e.as!==void 0,a=e.as||new r(t);te(()=>{e.ref&&e.ref(a)});for(const n in t)te(_e(()=>o[n],l=>{l!==void 0&&(n in a?a[n]=l:a.data&&n in a.data&&(a.data[n]=l))},{defer:!0}));return s.registerMaterial(a),me(()=>{s.unregisterMaterial(a),i||a.destroy()}),null},Je=k(Oe),Ye=k(He),Qe=k(Ie),We=k(Ge),Xe=k(Ue),Ze=J(Ae),et=J(ze),tt=J(Ke),st=J(Re);export{Je as C,et as F,Ze as M,Qe as P,Ye as S,st as T,tt as a,We as b,Xe as c};
