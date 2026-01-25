import { HTMLText, PixiApplication, PixiCanvas, PixiStage, usePixiScreen } from "pixi-solid";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();
  return (
    <>
      <HTMLText
        text={"<p>HTML Text</p><p>This is a <strong>bold</strong> and <em>italic</em> text.</p>"}
        style={{
          fontFamily: "Arial",
          fontSize: 24,
          fill: "#e24f4fff",
          align: "right",
          padding: 20,
        }}
        anchor={0.5}
        x={pixiScreen.width * 0.5}
        y={pixiScreen.height * 0.5}
      />
      <HTMLText
        text={`<div class="outer">
<p>This text supports:</p>
<ul class="list">
    <li class="list__item">✨ Emojis</li>
    <li class="list__item">🎨 Custom CSS</li>
    <li class="list__item">📏 Custom word wrap sizing</li>
</ul>
</div>`}
        style={{
          fontSize: 24,
          align: "left",
          fill: "#334455",
          cssOverrides: [".outer { line-height: 1.2; }", ".list { margin: 0; padding: 0; }"],
          wordWrap: true,
          wordWrapWidth: 300,
        }}
      />
      <HTMLText
        text={'<div style="padding: 10px">Scale mode nearest</div>'}
        style={{
          fontSize: 24,
          fill: "#04ff00ff",
        }}
        textureStyle={{
          scaleMode: "nearest",
        }}
      />
    </>
  );
};

export const Demo = () => (
  <PixiApplication>
    <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
      <PixiStage>
        <DemoComponent />
      </PixiStage>
    </PixiCanvas>
  </PixiApplication>
);
