const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/home-page.demo-DrICJ_mX.js","assets/web-BTd9NawZ.js","assets/CanvasPool-DtqSaXnh.js","assets/rolldown-runtime-hePW80VL.js","assets/dist-BWyuAgmK.js","assets/Filter-tmaoo_H6.js","assets/canvasUtils-BmkL-0m_.js","assets/Cache-DjsX-fAq.js","assets/RenderTargetSystem-CXGlBGSL.js","assets/GCManagedHash-iaZqB6Fm.js","assets/GraphicsContext-oKSnaaQD.js","assets/getTextureBatchBindGroup-CPqe_4fB.js","assets/getTexelRangeRects-7j664Y_P.js","assets/Assets-D-FVVTjl.js","assets/checkExtension-BGvys2BB.js","assets/BlurFilter-BMdnZ5a3.js","assets/run_06-CTyTGqHK.js","assets/run_03-BMWUeCLM.js","assets/object-fit-B53WMoQZ.js","assets/sky-kt9IjSui.js","assets/ground-tile-Cp0xO0Yu.js","assets/home-page-sGXi8Rdw.css"])))=>i.map(i=>d[i]);
import{C as e,J as t,L as n,M as r,a as i,c as a,d as o,ht as s,m as c,p as l,z as u}from"./web-BTd9NawZ.js";import{a as d,i as f,n as p,o as m,u as h}from"./components-BiYutFnA.js";var g=`import { AnimatedSprite, Container } from "pixi-solid";
import type * as Pixi from "pixi.js";
import { Match, omit, Switch } from "solid-js";

import { getIdleAnimationTextures, getRunAnimationTextures } from "./get-animation-textures";

export type CharacterProps = Omit<Pixi.ContainerOptions, "children"> & {
  direction: "left" | "right";
  isRunning: boolean;
};

export const Character = (props: CharacterProps) => {
  const pixiProps = omit(props, "isRunning", "direction");

  return (
    <Container {...pixiProps} label={"Character"}>
      <Switch>
        <Match when={props.isRunning}>
          <AnimatedSprite
            autoPlay={true}
            textures={getRunAnimationTextures()}
            scaleX={props.direction === "left" ? -1 : 1}
            animationSpeed={0.25}
            anchorX={0.5}
            anchorY={0.92}
          />
        </Match>
        <Match when={!props.isRunning}>
          <AnimatedSprite
            autoPlay={true}
            textures={getIdleAnimationTextures()}
            scaleX={props.direction === "left" ? -1 : 1}
            animationSpeed={0.25}
            anchorX={0.5}
            anchorY={0.92}
          />
        </Match>
      </Switch>
    </Container>
  );
};
`,_=`import style from "./style.module.css";

export type ControlsProps = {
  isRunning: boolean;
  direction: "left" | "right";
  onToggleRunningClicked: () => void;
  onToggleDirectionClicked: () => void;
};

export const Controls = (props: ControlsProps) => {
  return (
    <div class={style["controls-wrap"]}>
      <button type="button" class={style["controls-button"]} onClick={props.onToggleRunningClicked}>
        {props.isRunning ? "Click to stop" : "Click to run"}
      </button>
      <br />
      <button
        type="button"
        class={style["controls-button"]}
        onClick={props.onToggleDirectionClicked}
      >
        {props.direction === "left" ? "Click to face right" : "Click to face left"}
      </button>
    </div>
  );
};
`,v=`.controls-wrap {
  position: absolute;
  z-index: 1;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 10px;
}

.controls-button {
  margin: 0;
  cursor: pointer;
}
`,y=`import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";

export const getRunAnimationTextures = () => [
  Assets.get<Pixi.Texture>("run_01"),
  Assets.get<Pixi.Texture>("run_02"),
  Assets.get<Pixi.Texture>("run_03"),
  Assets.get<Pixi.Texture>("run_04"),
  Assets.get<Pixi.Texture>("run_05"),
  Assets.get<Pixi.Texture>("run_06"),
];

export const getIdleAnimationTextures = () => [
  Assets.get<Pixi.Texture>("idle_01"),
  Assets.get<Pixi.Texture>("idle_02"),
  Assets.get<Pixi.Texture>("idle_03"),
  Assets.get<Pixi.Texture>("idle_03"),
  Assets.get<Pixi.Texture>("idle_04"),
  Assets.get<Pixi.Texture>("idle_04"),
  Assets.get<Pixi.Texture>("idle_04"),
  Assets.get<Pixi.Texture>("idle_04"),
  Assets.get<Pixi.Texture>("idle_04"),
  Assets.get<Pixi.Texture>("idle_04"),
  Assets.get<Pixi.Texture>("idle_04"),
  Assets.get<Pixi.Texture>("idle_04"),
  Assets.get<Pixi.Texture>("idle_04"),
  Assets.get<Pixi.Texture>("idle_04"),
  Assets.get<Pixi.Texture>("idle_04"),
  Assets.get<Pixi.Texture>("idle_04"),
  Assets.get<Pixi.Texture>("idle_05"),
  Assets.get<Pixi.Texture>("idle_06"),
  Assets.get<Pixi.Texture>("idle_07"),
  Assets.get<Pixi.Texture>("idle_07"),
  Assets.get<Pixi.Texture>("idle_08"),
  Assets.get<Pixi.Texture>("idle_08"),
  Assets.get<Pixi.Texture>("idle_08"),
  Assets.get<Pixi.Texture>("idle_08"),
  Assets.get<Pixi.Texture>("idle_08"),
  Assets.get<Pixi.Texture>("idle_08"),
  Assets.get<Pixi.Texture>("idle_08"),
  Assets.get<Pixi.Texture>("idle_08"),
  Assets.get<Pixi.Texture>("idle_08"),
  Assets.get<Pixi.Texture>("idle_08"),
  Assets.get<Pixi.Texture>("idle_08"),
  Assets.get<Pixi.Texture>("idle_08"),
  Assets.get<Pixi.Texture>("idle_08"),
];
`,b=`import { CRTFilter } from "pixi-filters";
import { Container, onTick, PixiCanvas, Sprite, usePixiScreen, TilingSprite } from "pixi-solid";
import { ObjectFitContainer } from "pixi-solid/utils";
import type * as Pixi from "pixi.js";
import { Assets, BlurFilter, Rectangle } from "pixi.js";
import { createMemo, Loading, onCleanup, Show } from "solid-js";

import { Character } from "./character";
import { Controls } from "./controls";
import { loadSceneAssets } from "./load-scene-assets";
import { createPlayerStore } from "./player-store";

const DemoScene = (props: { isRunning: boolean; direction: "left" | "right" }) => {
  const pixiScreen = usePixiScreen();
  const sceneBounds = new Rectangle(0, 0, 400, 400);

  const blurFilter = new BlurFilter({ strength: 8 });
  const crtFilter = new CRTFilter({
    curvature: 3,
    lineContrast: 0.1,
    vignetting: 0.1,
    noise: 0.04,
    noiseSize: 2,
  });

  onTick(({ deltaTime }) => {
    crtFilter.seed = Math.random() * 10;
    crtFilter.time += deltaTime * 0.3;
  });

  let ground: Pixi.TilingSprite | undefined;

  onTick(({ deltaTime }) => {
    if (!ground) return;

    const movementSpeed = props.isRunning ? 1.3 : 0;
    const directionMultiplier = props.direction === "left" ? 1 : -1;
    ground.tilePosition.x += movementSpeed * directionMultiplier * deltaTime;
  });

  onCleanup(() => {
    blurFilter.destroy();
    crtFilter.destroy();
  });

  return (
    <ObjectFitContainer width={pixiScreen.width} height={pixiScreen.height} fitMode="cover">
      <Container filters={crtFilter} boundsArea={sceneBounds}>
        <ObjectFitContainer width={sceneBounds.width} height={sceneBounds.height} fitMode="cover">
          <Sprite label="Sky" texture={Assets.get<Pixi.Texture>("sky")} filters={blurFilter} />
        </ObjectFitContainer>
        <TilingSprite
          label="Ground"
          width={sceneBounds.width}
          height={sceneBounds.height * 0.3}
          position={{ x: 0, y: sceneBounds.height * 0.7 }}
          ref={(instance) => (ground = instance)}
          texture={Assets.get<Pixi.Texture>("ground")}
        />
        <Character
          direction={props.direction}
          isRunning={props.isRunning}
          position={{ x: sceneBounds.width * 0.5, y: sceneBounds.height * 0.7 }}
        />
      </Container>
    </ObjectFitContainer>
  );
};

export const Demo = () => {
  const playerStore = createPlayerStore();
  const assetsReady = createMemo(() => loadSceneAssets());

  return (
    <div style={{ position: "relative" }}>
      <Controls
        isRunning={playerStore.state.isRunning}
        direction={playerStore.state.direction}
        onToggleDirectionClicked={playerStore.toggleDirection}
        onToggleRunningClicked={playerStore.toggleRunning}
      />
      {/* The fallback is a DOM element, so the boundary sits outside the canvas. A \`<Loading>\`
          inside \`PixiCanvas\` would add its fallback as a Pixi child. */}
      <Loading fallback={<div>Loading...</div>}>
        <Show when={assetsReady()}>
          <PixiCanvas
            style={{
              "aspect-ratio": "16/9",
              overflow: "hidden",
              "border-radius": "10px",
            }}
          >
            <DemoScene
              isRunning={playerStore.state.isRunning}
              direction={playerStore.state.direction}
            />
          </PixiCanvas>
        </Show>
      </Loading>
    </div>
  );
};
`,x=`import { Assets, TextureStyle } from "pixi.js";

import groundAssetUrl from "@/assets/ground-tile.png";
import idleAssetUrl_01 from "@/assets/idle_01.png";
import idleAssetUrl_02 from "@/assets/idle_02.png";
import idleAssetUrl_03 from "@/assets/idle_03.png";
import idleAssetUrl_04 from "@/assets/idle_04.png";
import idleAssetUrl_05 from "@/assets/idle_05.png";
import idleAssetUrl_06 from "@/assets/idle_06.png";
import idleAssetUrl_07 from "@/assets/idle_07.png";
import idleAssetUrl_08 from "@/assets/idle_08.png";
import runAssetUrl_01 from "@/assets/run_01.png";
import runAssetUrl_02 from "@/assets/run_02.png";
import runAssetUrl_03 from "@/assets/run_03.png";
import runAssetUrl_04 from "@/assets/run_04.png";
import runAssetUrl_05 from "@/assets/run_05.png";
import runAssetUrl_06 from "@/assets/run_06.png";
import skyAssetUrl from "@/assets/sky.png";

export const loadSceneAssets = async () => {
  TextureStyle.defaultOptions.scaleMode = "nearest";

  try {
    await Assets.load([
      { alias: "sky", src: skyAssetUrl },
      { alias: "ground", src: groundAssetUrl },
      { alias: "run_01", src: runAssetUrl_01 },
      { alias: "run_02", src: runAssetUrl_02 },
      { alias: "run_03", src: runAssetUrl_03 },
      { alias: "run_04", src: runAssetUrl_04 },
      { alias: "run_05", src: runAssetUrl_05 },
      { alias: "run_06", src: runAssetUrl_06 },
      { alias: "idle_01", src: idleAssetUrl_01 },
      { alias: "idle_02", src: idleAssetUrl_02 },
      { alias: "idle_03", src: idleAssetUrl_03 },
      { alias: "idle_04", src: idleAssetUrl_04 },
      { alias: "idle_05", src: idleAssetUrl_05 },
      { alias: "idle_06", src: idleAssetUrl_06 },
      { alias: "idle_07", src: idleAssetUrl_07 },
      { alias: "idle_08", src: idleAssetUrl_08 },
    ]);
    return true;
  } catch {
    return false;
  }
};
`,S=`import { createStore } from "solid-js";

export type PlayerStore = {
  state: Readonly<AppState>;
  toggleRunning: () => void;
  toggleDirection: () => void;
};

export type AppState = {
  isRunning: boolean;
  direction: Direction;
};

export type Direction = "left" | "right";

export const createPlayerStore = (): PlayerStore => {
  const [state, setState] = createStore<AppState>({
    isRunning: true,
    direction: "right",
  });

  const toggleRunning = () => {
    setState((state) => {
      state.isRunning = !state.isRunning;
    });
  };

  const toggleDirection = () => {
    setState((state) => {
      state.direction = state.direction === "left" ? "right" : "left";
    });
  };

  return {
    state,
    toggleRunning,
    toggleDirection,
  };
};
`,C=n(`<div class=_home_1yi2b_1><section class=_hero_1yi2b_9><p class=_eyebrow_1yi2b_15>SolidJS 2 · PixiJS 8</p><h1 class=_title_1yi2b_24>PixiJS scenes, <span class=_accent_1yi2b_30>written as JSX.</span></h1><p class=_lede_1yi2b_34>pixi-solid renders every major PixiJS display object as a component, so your scene graph is reactive, typed, and testable without a browser.</p><div class=_actions_1yi2b_40><a class=_primary_1yi2b_47>Get started</a><a class=_secondary_1yi2b_48>See a component</a></div><pre class=_install_1yi2b_77><code>npm i pixi-solid pixi.js solid-js</code></pre></section><section class=_features_1yi2b_104 aria-label="Why pixi-solid"><div class=_card_1yi2b_109><h2>Signals drive the scene</h2><p>Props bind to Pixi objects, one effect per key, so an update touches one property.</p></div><div class=_card_1yi2b_109><h2>Cleanup is automatic</h2><p>Components destroy the instances they own and detach the ones they do not.</p></div><div class=_card_1yi2b_109><h2>Testable headless</h2><p>Context, hooks and ticker run without a GPU, so scenes mount in jsdom.</p></div></section><section class=_demo_1yi2b_96 aria-label="Live demo"></section><section aria-label="Code example"><h2 class=_sectionTitle_1yi2b_91>Code example</h2><!$><!/>`),w=a(()=>u(()=>import(`./home-page.demo-DrICJ_mX.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21])),{export:`Demo`},`src/demos/home-page.demo.tsx`);function T(){return t(f,{get children(){var n=l(C),a=n.firstChild,u=a.firstChild.nextSibling.nextSibling.nextSibling.firstChild,f=u.nextSibling,T=a.nextSibling.nextSibling,E=T.nextSibling,D=E.firstChild.nextSibling,[O,k]=c(D.nextSibling),A=s();return e(T,t(w,{get fallback(){return t(d,{ratio:`16 / 9`,label:`Live demo`})}})),e(E,t(p,{get items(){return[{label:`app.tsx`,content:t(m,{code:b,title:`app.tsx`})},{label:`player-store.ts`,content:t(m,{code:S,title:`player-store.ts`})},{label:`character.tsx`,content:t(m,{code:g,title:`character.tsx`})},{label:`textures.ts`,content:t(m,{code:y,title:`get-animation-textures.ts`})},{label:`assets.ts`,content:t(m,{code:x,title:`load-scene-assets.ts`})},{label:`controls.tsx`,content:t(m,{code:_,title:`controls/index.tsx`})},{label:`style.module.css`,content:t(m,{code:v,title:`controls/style.module.css`})}]}}),O,k),o(()=>({e:h(`/getting-started/install`),t:h(`/components/container`)}),({e,t},n)=>{e!==n?.e&&r(u,`href`,e),t!==n?.t&&r(f,`href`,t),i(u,A),i(f,A)}),n}})}export{T as default};