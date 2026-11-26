const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/pass-through-props.demo-Xb9ZtD1C.js","assets/web-BTd9NawZ.js","assets/CanvasPool-DtqSaXnh.js","assets/rolldown-runtime-hePW80VL.js","assets/dist-BWyuAgmK.js","assets/Filter-tmaoo_H6.js","assets/canvasUtils-BmkL-0m_.js","assets/Cache-DjsX-fAq.js","assets/RenderTargetSystem-CXGlBGSL.js","assets/GCManagedHash-iaZqB6Fm.js","assets/GraphicsContext-oKSnaaQD.js","assets/getTextureBatchBindGroup-CPqe_4fB.js","assets/getTexelRangeRects-7j664Y_P.js","assets/Assets-D-FVVTjl.js","assets/checkExtension-BGvys2BB.js","assets/object-fit-B53WMoQZ.js","assets/bird_03-D1QJhzFY.js","assets/sky-kt9IjSui.js","assets/bird_05-B2MZaQL_.js"])))=>i.map(i=>d[i]);
import{J as e,L as t,c as n,p as r,z as i}from"./web-BTd9NawZ.js";import{c as a,i as o,n as s,o as c,t as l}from"./components-BiYutFnA.js";var u=`import { PixiCanvas, Text, usePixiScreen, Sprite } from "pixi-solid";
import { ObjectFitContainer } from "pixi-solid/utils";
import type * as Pixi from "pixi.js";
import { Assets, TextureStyle } from "pixi.js";
import { createMemo, createSignal, Loading, Show } from "solid-js";

import birdAssetUrl_01 from "@/assets/bird_01.png";
import birdAssetUrl_02 from "@/assets/bird_02.png";
import birdAssetUrl_03 from "@/assets/bird_03.png";
import birdAssetUrl_04 from "@/assets/bird_04.png";
import birdAssetUrl_05 from "@/assets/bird_05.png";
import birdAssetUrl_06 from "@/assets/bird_06.png";
import skyAssetUrl from "@/assets/sky.png";

import { Bird } from "./pass-through-props";

const DemoComponent = () => {
  const [flyingSpeed, setFlyingSpeed] = createSignal(1);
  const pixiScreen = usePixiScreen();

  const assetsReady = createMemo(async () => {
    await Assets.init();
    // Setting scale mode to nearest for crisp pixel art
    TextureStyle.defaultOptions.scaleMode = "nearest";
    await Assets.load<Pixi.Texture>([
      { alias: "sky", src: skyAssetUrl },
      { alias: "bird_01", src: birdAssetUrl_01 },
      { alias: "bird_02", src: birdAssetUrl_02 },
      { alias: "bird_03", src: birdAssetUrl_03 },
      { alias: "bird_04", src: birdAssetUrl_04 },
      { alias: "bird_05", src: birdAssetUrl_05 },
      { alias: "bird_06", src: birdAssetUrl_06 },
    ]);
    return true;
  });

  const handlePointerMove = (e: Pixi.FederatedPointerEvent) => {
    const notInsideCanvas =
      e.global.x < 0 ||
      e.global.x > pixiScreen.width ||
      e.global.y < 0 ||
      e.global.y > pixiScreen.height;
    if (notInsideCanvas) return;

    const speed = Math.min(Math.max((e.global.x / pixiScreen.width) * 2, 0), 2);
    setFlyingSpeed(speed);
  };
  return (
    <Loading>
      <Show when={assetsReady()}>
        <ObjectFitContainer width={pixiScreen.width} height={pixiScreen.height} fitMode={"cover"}>
          <Sprite
            texture={Assets.get<Pixi.Texture>("sky")}
            onglobalpointermove={handlePointerMove}
            eventMode="static"
          />
        </ObjectFitContainer>
        {/* Here on our \`Bird\` custom component we can also set any of the ContainerOptions we picked and they will be passed through to the underlying Container */}
        <Bird
          flyingSpeed={flyingSpeed()}
          x={pixiScreen.width / 2}
          y={pixiScreen.height / 2}
          scale={2}
        />
        <Text
          text={\`Flying Speed: \${flyingSpeed().toFixed(2)}\`}
          x={10}
          y={10}
          style={{
            fill: "#ffffff",
            fontSize: 16,
          }}
        />
      </Show>
    </Loading>
  );
};

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
    <DemoComponent />
  </PixiCanvas>
);
`,d=`import type { PixiComponentProps } from "pixi-solid";
import { AnimatedSprite, onTick, Container } from "pixi-solid";
import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";
import { omit } from "solid-js";

// Using the utility PixiComponentProps type to allow passing through any ContainerOptions props by default or accepts a generic for the specific Pixi component options we want to support.
export type BirdProps = Pick<PixiComponentProps, "position" | "x" | "y" | "angle" | "scale"> & {
  flyingSpeed: number;
};

export const Bird = (props: BirdProps) => {
  const birdTextures = Assets.get<Pixi.Texture>([
    "bird_01",
    "bird_02",
    "bird_03",
    "bird_04",
    "bird_05",
    "bird_06",
  ]);

  // Omitting flyingSpeed so we pass only the valid Container props to our AnimatedSprite
  const containerProps = omit(props, "flyingSpeed");

  let bird: Pixi.AnimatedSprite | undefined;
  let time = 0;

  onTick((ticker) => {
    if (!bird) return;

    time = time + ticker.deltaTime * props.flyingSpeed;
    bird.position.x = Math.sin(time / 90) * 20;
    bird.position.y = Math.cos(time / 30) * 25;
  });

  return (
    // Spread the containerProps to pass through all valid Container options and the ref
    <Container {...containerProps}>
      <AnimatedSprite
        textures={Object.values(birdTextures)}
        animationSpeed={0.4 * props.flyingSpeed}
        autoPlay={true}
        anchor={0.5}
        ref={(instance) => (bird = instance)}
      />
    </Container>
  );
};
`,f=t(`<h1>Pass through props`),p=t(`<h2 id=demo>Demo`),m=t(`<p>Move your mouse or touch across the canvas to change the flying speed of the bird.`),h=t(`<h2 id=code-example>Code example`),g=t(`<p>When you create custom components, it is often useful to pass props through to the underlying PixiJS components. This allows for greater flexibility by gaining access to properties such as position, scale or adding event listeners from the outside.`),_=t(`<p>Instead of writing them out one by one, you can use the utility type <code>PixiComponentProps</code> which contains props for the PixiJS <code>Container</code> but you can extend it by passing in the specific component type a generic <code>PixiComponentProps&lt;Pixi.SpriteOptions></code>. It may be useful to combine with the built in <code>Omit</code> or <code>Pick</code> utility types to exclude or include specific props. Combine it with <code>omit</code> and the <code>{...props}</code> spread to pass all received props, or only a specific group, down to the underlying component. <code>omit</code> returns a reactive view of the remaining props.`),v=t(`<span>`),y=n(()=>i(()=>import(`./pass-through-props.demo-Xb9ZtD1C.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18])),{export:`Demo`},`src/demos/pass-through-props.demo.tsx`);function b(){return e(a,{get children(){return e(o,{get children(){return[r(f),r(p),r(m),e(l,{title:`pass-through-props`,get children(){return e(y,{get fallback(){return r(v)}})}}),r(h),r(g),r(_),e(s,{get items(){return[{label:`pass-through-props-example.tsx`,content:e(c,{code:d,title:`tsx`})},{label:`demo-app.tsx`,content:e(c,{code:u,title:`tsx`})}]}})]}})}})}export{b as default};