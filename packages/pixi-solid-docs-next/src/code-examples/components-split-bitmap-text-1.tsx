import { SplitBitmapText } from "pixi-solid";
import { BitmapFont } from "pixi.js";

BitmapFont.install({
  name: "GameFont",
  style: {
    fontFamily: "Arial",
    fontSize: 40,
  },
});

<SplitBitmapText
  text="Fast per-character animation"
  style={{ fontFamily: "GameFont", fontSize: 40, fill: "white" }}
/>;
