import { Rectangle } from "pixi.js";
import { HTMLText, onResize, PixiApplication, PixiCanvas, PixiStage } from "pixi-solid";

export const DemoApp = () => {
  return (
    <PixiApplication>
      <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
        <PixiStage>
          <HTMLText
            text={"<p>HTML Text</p><p>This is a <strong>bold</strong> and <em>italic</em> text.</p>"}
            style={{
              fontFamily: "Arial",
              fontSize: 24,
              fill: "#e24f4fff",
              align: "right",
              padding: 20,
            }}
            ref={(text) => {
              // Position the text in the center of the screen on resize
              onResize((screen) => {
                text.pivot.x = text.width * 0.5;
                text.pivot.y = text.height * 0.5;
                text.position.x = screen.width * 0.5;
                text.position.y = screen.height * 0.5;
              });
            }}
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
        </PixiStage>
      </PixiCanvas>
    </PixiApplication>
  );
};
