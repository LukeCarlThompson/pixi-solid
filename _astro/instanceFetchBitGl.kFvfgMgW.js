import{it as e}from"./Container3D.4-tQT7-L.js";var t=6,n=[`x`,`y`,`z`,`w`],r=e=>({texel:e>>2,component:n[e&3]}),i=r(16),a=r(18),o=r(20),s=r(17);function c(n){return{name:n?`instanceFetchMaterial`:`instanceFetch`,bindings:{global:{uMeshStoreTexture:`texture_2d<u32>`,uRenderInstanceTexture:`texture_2d<u32>`,batchTransform:{uBatchWorldMatrix:`mat4x4<f32>`}}},gl:{vertex:{header:`
      uniform int uInstanceBase;

      uvec4 fetchStoreTexel(int texel) {
        return texelFetch(uMeshStoreTexture, ${e(`texel`)}, 0);
      }
      `,input:`
      int instanceSlot = uInstanceBase + gl_InstanceID;
      uvec4 renderInstance = texelFetch(uRenderInstanceTexture, ${e(`instanceSlot`)}, 0);

      int storeTexel = int(renderInstance.x) * ${t};

      modelMatrix = uBatchWorldMatrix * mat4(
        uintBitsToFloat(fetchStoreTexel(storeTexel)),
        uintBitsToFloat(fetchStoreTexel(storeTexel + 1)),
        uintBitsToFloat(fetchStoreTexel(storeTexel + 2)),
        uintBitsToFloat(fetchStoreTexel(storeTexel + 3)));

      uvec4 indexLanes = fetchStoreTexel(storeTexel + ${i.texel});
      float bonePitIndex = float(indexLanes.${i.component});
      vec2 morphData = vec2(
        float(fetchStoreTexel(storeTexel + ${o.texel}).${o.component}),
        float(int(indexLanes.${a.component})));
      ${n?`vMaterialIndex = indexLanes.${s.component};`:``}
      `}}}}var l=c(!1),u=c(!0);export{u as n,l as t};