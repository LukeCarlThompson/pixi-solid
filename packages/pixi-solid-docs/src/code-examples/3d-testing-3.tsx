import { ParticleSystem3D, View3D } from "pixi-solid-3d";
import { createTestContext, mountScene } from "pixi-solid/testing";
const ctx = createTestContext();

mountScene(() => (
  <ctx.Provider>
    <View3D>
      <ParticleSystem3D capacity={64} emitRate={20} />
    </View3D>
  </ctx.Provider>
));

await ctx.ticker.fastForwardFrames(2);
