import{M as e,T as t}from"./CanvasPool.IN5fI3JC.js";import{p as n}from"./pixi-canvas.CjyKCql-.js";import{I as r,k as i,w as a}from"./DemoMount.astro_astro_type_script_index_0_lang.BSIN7oNQ.js";import"./lib.J5WdxiT7.js";import{A as o,B as s,F as c,H as l,I as u,L as d,R as f,U as p,V as m,W as h,j as g,p as _,z as v}from"./dist.B6ct--nN.js";import{J as y,L as b,W as x,Zt as S,kt as C}from"./Container3D.4-tQT7-L.js";import{t as w}from"./CubeGeometry.zHkkba0H.js";(class e extends p{static defaultOptions={...p.defaultOptions,radius:.5,height:2,radialSegments:32,heightSegments:8};constructor(t={}){let n={...e.defaultOptions,...t},{radius:r,height:i}=n,a=g(n.radialSegments,3),o=g(n.heightSegments,1),s=Math.max(1,Math.ceil(a/2)),c=Math.max(0,i-2*r),l=c*.5,u=1/(c+2*r),d=r*u,f=c*u,p=1/a,m=1/o,h=1/s,_=a+1,v=new Float32Array(_),y=new Float32Array(_),b=Math.PI*2*p;for(let e=0;e<_;e++){let t=e*b;v[e]=Math.sin(t),y[e]=Math.cos(t)}let x=s,S=o+1,C=s,w=x+S+C,T=w-1,E=w*_,D=(T-1)*a*6,O=new Float32Array(E*3),k=new Float32Array(E*3),A=new Float32Array(E*2),j=new(E>65536?Uint32Array:Uint16Array)(D),M=0,N=0,P=0,F=0;for(let e=0;e<s;e++){let t=e*h,n=(1-t)*(Math.PI/2),i=d*t,o=Math.cos(n),s=Math.sin(n),c=o*r,u=s*r+l;for(let e=0;e<=a;e++){let t=e*p,n=y[e],r=v[e];O[M++]=c*n,O[M++]=u,O[M++]=c*r,k[N++]=o*n,k[N++]=s,k[N++]=o*r,A[P++]=t,A[P++]=i}}for(let e=0;e<=o;e++){let t=e*m,n=l-t*c,i=d+t*f;for(let e=0;e<=a;e++){let t=e*p,a=y[e],o=v[e];O[M++]=r*a,O[M++]=n,O[M++]=r*o,k[N++]=a,k[N++]=0,k[N++]=o,A[P++]=t,A[P++]=i}}for(let e=1;e<=s;e++){let t=e*h,n=Math.PI/2*t,i=d+f+d*t,o=Math.cos(n),s=Math.sin(n),c=o*r,u=-s*r-l;for(let e=0;e<=a;e++){let t=e*p,n=y[e],r=v[e];O[M++]=c*n,O[M++]=u,O[M++]=c*r,k[N++]=o*n,k[N++]=-s,k[N++]=o*r,A[P++]=t,A[P++]=i}}let I=T-1;for(let e=0;e<T;e++){let t=e===0,n=e===I;for(let r=0;r<a;r++){let i=e*_+r,a=i+1,o=i+_,s=o+1;t||(j[F++]=i,j[F++]=a,j[F++]=o),n||(j[F++]=a,j[F++]=s,j[F++]=o)}}super({...n,positions:O,normals:k,uvs:A,indices:j})}});function T(e,t,n,r,i,a){let o=g(r,3),s=g(i,1),c=n*.5,l=(t-e)/n,u=1/Math.sqrt(1+l*l),d=l*u,f=1/o,p=1/s,m=o+1,h=new Float32Array(m),_=new Float32Array(m),v=Math.PI*2*f;for(let e=0;e<m;e++){let t=e*v;h[e]=Math.sin(t),_[e]=Math.cos(t)}let y=e===0,b=t===0,x=m*(s+1),S=o*s*6-((y?o*3:0)+(b?o*3:0)),C=!a&&!y,w=!a&&!b,T=C?m+1:0,E=w?m+1:0,D=C?o*3:0,O=w?o*3:0,k=x+T+E,A=S+D+O,j=new Float32Array(k*3),M=new Float32Array(k*3),N=new Float32Array(k*2),P=new(k>65536?Uint32Array:Uint16Array)(A),F=0,I=0,L=0,R=0;for(let r=0;r<=s;r++){let i=r*p,a=i*(t-e)+e,s=c-i*n;for(let e=0;e<=o;e++){let t=e*f,n=h[e],r=_[e];j[F++]=a*r,j[F++]=s,j[F++]=a*n,M[I++]=r*u,M[I++]=d,M[I++]=n*u,N[L++]=t,N[L++]=i}}for(let e=0;e<s;e++){let t=y&&e===0,n=b&&e===s-1;for(let r=0;r<o;r++){let i=e*m+r,a=i+1,o=i+m,s=o+1;t||(P[R++]=i,P[R++]=a,P[R++]=o),n||(P[R++]=a,P[R++]=s,P[R++]=o)}}if(C){let t=F/3;j[F++]=0,j[F++]=c,j[F++]=0,M[I++]=0,M[I++]=1,M[I++]=0,N[L++]=.5,N[L++]=.5;for(let t=0;t<=o;t++){let n=_[t],r=h[t];j[F++]=e*n,j[F++]=c,j[F++]=e*r,M[I++]=0,M[I++]=1,M[I++]=0,N[L++]=n*.5+.5,N[L++]=r*.5+.5}for(let e=0;e<o;e++)P[R++]=t,P[R++]=t+e+2,P[R++]=t+e+1}if(w){let e=F/3;j[F++]=0,j[F++]=-c,j[F++]=0,M[I++]=0,M[I++]=-1,M[I++]=0,N[L++]=.5,N[L++]=.5;for(let e=0;e<=o;e++){let n=_[e],r=h[e];j[F++]=t*n,j[F++]=-c,j[F++]=t*r,M[I++]=0,M[I++]=-1,M[I++]=0,N[L++]=n*.5+.5,N[L++]=r*.5+.5}for(let t=0;t<o;t++)P[R++]=e,P[R++]=e+t+1,P[R++]=e+t+2}return{positions:j,normals:M,uvs:N,indices:P}}var E=class e extends p{static defaultOptions={...p.defaultOptions,radius:1,height:2,radialSegments:32,heightSegments:1,openEnded:!1};constructor(t={}){let n={...e.defaultOptions,...t},{radius:r,height:i,radialSegments:a,heightSegments:o,openEnded:s}=n,c=T(0,r,i,a,o,s);super({...n,...c})}};(class e extends p{static defaultOptions={...p.defaultOptions,radiusTop:1,radiusBottom:1,height:2,radialSegments:32,heightSegments:1,openEnded:!1};constructor(t={}){let n={...e.defaultOptions,...t},{radiusTop:r,radiusBottom:i,height:a,radialSegments:o,heightSegments:s,openEnded:c}=n,l=T(r,i,a,o,s,c);super({...n,...l})}});var D=7;(class e extends p{static defaultOptions={...p.defaultOptions,radius:1,detail:0};constructor(t={}){let n={...e.defaultOptions,...t},{radius:r}=n,i=n.detail,a=Number.isFinite(i)?Math.max(0,Math.min(D,Math.floor(i))):0,o=(1+Math.sqrt(5))/2,s=[-1,o,0,1,o,0,-1,-o,0,1,-o,0,0,-1,o,0,1,o,0,-1,-o,0,1,-o,o,0,-1,o,0,1,-o,0,-1,-o,0,1],c=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],l=10*4**a+2,u=new Float32Array(l*3),d=new Float32Array(l*3),f=new Float32Array(l*2),p=0,m=(e,t,n)=>{let i=Math.sqrt(e*e+t*t+n*n),a=e/i,o=t/i,s=n/i,c=p,l=c*3;u[l]=a*r,u[l+1]=o*r,u[l+2]=s*r,d[l]=a,d[l+1]=o,d[l+2]=s;let m=.5+Math.atan2(s,a)/(2*Math.PI),h=.5-Math.asin(o)/Math.PI,g=c*2;return f[g]=m,f[g+1]=h,p++,c};for(let e=0;e<s.length;e+=3)m(s[e],s[e+1],s[e+2]);let h=new Map,g=(e,t)=>{let n=e<t?e:t,r=e<t?t:e,i=n*1048576+r,a=h.get(i);if(a!==void 0)return a;let o=n*3,s=r*3,c=(u[o]+u[s])/2,l=(u[o+1]+u[s+1])/2,d=(u[o+2]+u[s+2])/2,f=m(c,l,d);return h.set(i,f),f},_=new Uint32Array(c.length);for(let e=0;e<c.length;e++)_[e]=c[e];let v=c.length/3;for(let e=0;e<a;e++){let e=new Uint32Array(v*4*3),t=0;for(let n=0;n<v;n++){let r=n*3,i=_[r],a=_[r+1],o=_[r+2],s=g(i,a),c=g(a,o),l=g(o,i);e[t]=i,e[t+1]=s,e[t+2]=l,e[t+3]=a,e[t+4]=c,e[t+5]=s,e[t+6]=o,e[t+7]=l,e[t+8]=c,e[t+9]=s,e[t+10]=c,e[t+11]=l,t+=12}_=e,v*=4}let y=v*3,b=p>65536?new Uint32Array(y):new Uint16Array(y);for(let e=0;e<y;e++)b[e]=_[e];super({...n,positions:u,normals:d,uvs:f,indices:b})}});var O=class e extends p{static defaultOptions={...p.defaultOptions,radius:1,widthSegments:32,heightSegments:16};constructor(t={}){let n={...e.defaultOptions,...t},{radius:r}=n,i=g(n.widthSegments,3),a=g(n.heightSegments,2),o=(i+1)*(a+1),s=(a-1)*i*2,c=new Float32Array(o*3),l=new Float32Array(o*3),u=new Float32Array(o*2),d=o<=65536?new Uint16Array(s*3):new Uint32Array(s*3),f=new Float64Array(a+1),p=new Float64Array(a+1);for(let e=0;e<=a;e++){let t=e/a*Math.PI;f[e]=Math.sin(t),p[e]=Math.cos(t)}let m=new Float64Array(i+1),h=new Float64Array(i+1);for(let e=0;e<=i;e++){let t=e/i*Math.PI*2;m[e]=Math.sin(t),h[e]=Math.cos(t)}let _=0,v=0;for(let e=0;e<=a;e++){let t=e/a,n=f[e],o=p[e];for(let e=0;e<=i;e++){let a=e/i,s=m[e],d=n*h[e],f=o,p=n*s;c[_]=d*r,c[_+1]=f*r,c[_+2]=p*r,l[_]=d,l[_+1]=f,l[_+2]=p,_+=3,u[v]=a,u[v+1]=t,v+=2}}let y=i+1,b=0;for(let e=0;e<a;e++)for(let t=0;t<i;t++){let n=e*y+t,r=n+1,i=n+y,o=i+1;e!==0&&(d[b]=n,d[b+1]=r,d[b+2]=i,b+=3),e!==a-1&&(d[b]=r,d[b+1]=o,d[b+2]=i,b+=3)}super({...n,positions:c,normals:l,uvs:u,indices:d})}};(class e extends p{static defaultOptions={...p.defaultOptions,radius:1,tube:.4,radialSegments:12,tubularSegments:48,arc:Math.PI*2,thetaStart:0,thetaLength:Math.PI*2};constructor(t={}){let n={...e.defaultOptions,...t},{radius:r,tube:i,arc:a,thetaStart:o,thetaLength:s}=n,c=g(n.radialSegments,3),l=g(n.tubularSegments,3),u=(c+1)*(l+1),d=c*l*6,f=new Float32Array(u*3),p=new Float32Array(u*3),m=new Float32Array(u*2),h=u>65536?new Uint32Array(d):new Uint16Array(d),_=new Float64Array(l+1),v=new Float64Array(l+1);for(let e=0;e<=l;e++){let t=e/l*a;_[e]=Math.cos(t),v[e]=Math.sin(t)}let y=0,b=0,x=0;for(let e=0;e<=c;e++){let t=o+e/c*s,n=Math.cos(t),a=Math.sin(t),u=e/c,d=r+i*n,h=i*a;for(let e=0;e<=l;e++){let t=_[e],r=v[e];f[y++]=d*t,f[y++]=h,f[y++]=d*r,p[b++]=n*t,p[b++]=a,p[b++]=n*r,m[x++]=e/l,m[x++]=u}}let S=l+1,C=0;for(let e=1;e<=c;e++)for(let t=1;t<=l;t++){let n=S*e+t-1,r=S*(e-1)+t-1,i=S*(e-1)+t,a=S*e+t;h[C++]=n,h[C++]=a,h[C++]=r,h[C++]=r,h[C++]=a,h[C++]=i}super({...n,positions:f,normals:p,uvs:m,indices:h})}});var k=class e extends p{static defaultOptions={...p.defaultOptions,radius:1,tube:.4,tubularSegments:64,radialSegments:8,p:2,q:3};constructor(t={}){let n={...e.defaultOptions,...t},{radius:r,tube:i,p:a,q:o}=n,s=g(n.tubularSegments,3),c=g(n.radialSegments,3),l=(c+1)*(s+1),u=c*s*6,d=new Float32Array(l*3),f=new Float32Array(l*3),p=new Float32Array(l*2),m=l>65536?new Uint32Array(u):new Uint16Array(u),h=new Float64Array(c+1),_=new Float64Array(c+1);for(let e=0;e<=c;e++){let t=e/c*Math.PI*2;h[e]=Math.cos(t),_[e]=Math.sin(t)}let v=o/a,y=0,b=0,x=0;for(let e=0;e<=s;e++){let t=e/s*a*Math.PI*2,n=Math.cos(t),o=Math.sin(t),l=Math.cos(v*t),u=Math.sin(v*t),m=(2+l)*.5,g=r*m*n,S=r*u*.5,C=r*m*o,w=r*.5*(-v*u*n-(2+l)*o),T=r*.5*v*l,E=r*.5*(-v*u*o+(2+l)*n),D=T*C-E*S,O=E*g-w*C,k=w*S-T*g,A=Math.sqrt(D*D+O*O+k*k),j=D/A,M=O/A,N=k/A,P=M*E-N*T,F=N*w-j*E,I=j*T-M*w,L=Math.sqrt(P*P+F*F+I*I),R=P/L,z=F/L,B=I/L,V=e/s;for(let e=0;e<=c;e++){let t=h[e],n=_[e],r=-t*R+n*j,a=-t*z+n*M,o=-t*B+n*N;d[y++]=g+i*r,d[y++]=S+i*a,d[y++]=C+i*o,f[b++]=r,f[b++]=a,f[b++]=o,p[x++]=V,p[x++]=e/c}}let S=c+1,C=0;for(let e=1;e<=s;e++)for(let t=1;t<=c;t++){let n=S*(e-1)+(t-1),r=S*e+(t-1),i=S*e+t,a=S*(e-1)+t;m[C++]=n,m[C++]=r,m[C++]=a,m[C++]=r,m[C++]=i,m[C++]=a}super({...n,positions:d,normals:f,uvs:p,indices:m})}},A=u({name:`phongLighting`,requires:[b],preLighting:{gpu:`
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
`}}),j={name:`phongMaterial`,textures:[`baseColor`,`normal`],bindings:{material:{baseColor:`vec4<f32>`,specularColor:`vec3<f32>`,shininess:`f32`,specularStrength:`f32`,alphaCutoff:`f32`,normalScale:`f32`}},gpu:{fragment:{material:`
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
`}}},M={name:`phongSpecularTexture`,textures:[`specular`],gpu:{fragment:{material:`
  specularStrength *= sampleSpecular(input.vUV).r;
`}},gl:{fragment:{material:`
  specularStrength *= sampleSpecular(vUV).r;
`}}},N=class extends x{emissive;_featureBits=[];_specularColorTint=1118481;constructor(e={}){let{specularTexture:t,normalTexture:n,emissive:r}=e;super(e);let i={baseColor:e.baseColorTexture,normal:n??S,...e.textures};if(t&&(i.specular=t,this._featureBits.push(M)),r&&(i.emissive=r.texture,this._featureBits.push(v)),this._deriveLayoutFromBits([j,m,...this._featureBits,...this.extraBits],i),this.shininess=e.shininess??30,this.specularStrength=e.specularStrength??1,this.specularColor=e.specularColor??1118481,this.normalScale=e.normalScale??1,r){let e=this.emissive=new d(this);e.color=r.color??16777215,e.strength=r.strength??1}}_descriptorByEnvKey=Object.create(null);getPrimaryDescriptor(e){this._variantDirty&&=(this._descriptorByEnvKey=Object.create(null),!1);let t=e._envBit,n=this._descriptorByEnvKey[t.name];if(n)return n;let r=[j,t,m];for(let e=0;e<this._featureBits.length;e++)r.push(this._featureBits[e]);for(let e=0;e<this.extraBits.length;e++)r.push(this.extraBits[e]);return r.push(A),this._alphaMode===`mask`&&r.push(l),n=new C({}),n.update({bitsGpu:r,bitsGl:r}),this._descriptorByEnvKey[t.name]=n,n}_toOptions(){let{emissive:e,textures:t}=this;return{...super._toOptions(),specularColor:this.specularColor,shininess:this.shininess,specularStrength:this.specularStrength,normalScale:this.normalScale,specularTexture:t.specular,normalTexture:t.normal,emissive:e&&f(e)}}get shininess(){return this.data.shininess}set shininess(e){this.data.shininess=e}get specularStrength(){return this.data.specularStrength}set specularStrength(e){this.data.specularStrength=e}get normalScale(){return this.data.normalScale}set normalScale(e){this.data.normalScale=e}get specularColor(){return this._specularColorTint}set specularColor(e){let n=t.shared.setValue(e);this._specularColorTint=n.toNumber();let r=this.data?.specularColor;r&&(y(r,0,n),this.update())}destroy(e){this.destroyed||(super.destroy(e),this._descriptorByEnvKey=null,this._featureBits=null,this.emissive=void 0)}},P={name:`toonMaterial`,textures:[`baseColor`],bindings:{material:{baseColor:`vec4<f32>`,bands:`f32`,specularSize:`f32`,rimPower:`f32`,rimIntensity:`f32`,alphaCutoff:`f32`}},gpu:{fragment:{material:`
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
`}}},F=u({name:`toonLighting`,preLighting:{gpu:`
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
`}}),I=class t extends x{static defaultOptions={bands:3,specularSize:.15,rimPower:3,rimIntensity:.4,outline:!0};constructor(n={}){let{bands:r,specularSize:i,rimPower:a,rimIntensity:o,outline:s,...c}={...t.defaultOptions,...e(n)},u=[P,F],d=[P,F];c.alphaMode===`mask`&&(u.push(l),d.push(l)),super({...c,descriptor:{bitsGpu:u,bitsGl:d},passes:{outline:s,...c.passes}}),this.data.bands=r,this.data.specularSize=i,this.data.rimPower=a,this.data.rimIntensity=o}_toOptions(){let e=super._toOptions(),{outline:t,...n}=e.passes??{},{bands:r,specularSize:i,rimPower:a,rimIntensity:o}=this.data;return{...e,passes:n,outline:!!t,bands:r,specularSize:i,rimPower:a,rimIntensity:o}}},L=e=>t=>r(()=>{let r=_(),o=t.as,s=o!==void 0,c=o||new e(n(t,`ref`,`as`));return a(()=>t.ref,e=>h(e,c)),r.registerGeometry(c),i(()=>{r.unregisterGeometry(c),s||c.destroy()}),null}),R=e=>t=>r(()=>{let r=_(),o=t.as,s=o!==void 0,c={...n(t,`ref`,`as`)},l=o||new e(c);a(()=>t.ref,e=>h(e,l));for(let e in c)a(()=>t[e],t=>{t!==void 0&&(e in l?l[e]=t:l.data&&e in l.data&&(l.data[e]=t))},{defer:!0});return r.registerMaterial(l),i(()=>{r.unregisterMaterial(l),s||l.destroy()}),null}),z=L(w),B=L(O),V=L(o),H=L(E),U=L(k),W=R(c),G=R(s),K=R(N),q=R(I);export{K as a,q as c,W as i,U as l,z as n,V as o,G as r,B as s,H as t};