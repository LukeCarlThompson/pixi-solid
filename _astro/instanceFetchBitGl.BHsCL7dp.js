import{j as n}from"./view-3d.CbSxVUmV.js";const r=6,s=["x","y","z","w"],t=e=>({texel:e>>2,component:s[e&3]}),o=t(16),l=t(18),a=t(20),x=t(17);function c(e){return{name:e?"instanceFetchMaterial":"instanceFetch",bindings:{global:{uMeshStoreTexture:"texture_2d<u32>",uRenderInstanceTexture:"texture_2d<u32>",batchTransform:{uBatchWorldMatrix:"mat4x4<f32>"}}},gl:{vertex:{header:`
      uniform int uInstanceBase;

      uvec4 fetchStoreTexel(int texel) {
        return texelFetch(uMeshStoreTexture, ${n("texel")}, 0);
      }
      `,input:`
      int instanceSlot = uInstanceBase + gl_InstanceID;
      uvec4 renderInstance = texelFetch(uRenderInstanceTexture, ${n("instanceSlot")}, 0);

      int storeTexel = int(renderInstance.x) * ${r};

      modelMatrix = uBatchWorldMatrix * mat4(
        uintBitsToFloat(fetchStoreTexel(storeTexel)),
        uintBitsToFloat(fetchStoreTexel(storeTexel + 1)),
        uintBitsToFloat(fetchStoreTexel(storeTexel + 2)),
        uintBitsToFloat(fetchStoreTexel(storeTexel + 3)));

      uvec4 indexLanes = fetchStoreTexel(storeTexel + ${o.texel});
      float bonePitIndex = float(indexLanes.${o.component});
      vec2 morphData = vec2(
        float(fetchStoreTexel(storeTexel + ${a.texel}).${a.component}),
        float(int(indexLanes.${l.component})));
      ${e?`vMaterialIndex = indexLanes.${x.component};`:""}
      `}}}}const u=c(!1),T=c(!0);export{T as a,u as i};
