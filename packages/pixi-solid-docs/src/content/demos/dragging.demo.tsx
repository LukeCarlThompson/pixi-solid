import type * as Pixi from "pixi.js";
import { FillGradient } from "pixi.js";
import { Graphics, PixiApplication, PixiCanvas, PixiStage } from "pixi-solid";
import { createSignal } from "solid-js";
import { createMutable } from "solid-js/store";

const DraggingDemo = () => {
  const [isDragging, setIsDragging] = createSignal(false);
  const pointerPosition = createMutable({ x: 100, y: 100 });

  const scale = () => (isDragging() ? 1.1 : 1);

  let dragTarget: Pixi.Container | undefined;

  const handlePointerDown = (e: Pixi.FederatedPointerEvent) => {
    dragTarget = e.target;
    setIsDragging(true);

    if (!e.target.parent) return;
    // Convert the global coords to the targets parent coordinate space
    e.target.parent.toLocal(e.global, undefined, pointerPosition);
  };

  const handlePointerUp = () => {
    dragTarget = undefined;
    setIsDragging(false);
  };

  const handlePointerMove = (e: Pixi.FederatedPointerEvent) => {
    if (!dragTarget || !dragTarget.parent) return;
    dragTarget.parent.toLocal(e.global, undefined, pointerPosition);
  };

  const gradient = new FillGradient({
    type: "linear",
    colorStops: [
      { offset: 0, color: "#b6e3ff" },
      { offset: 1, color: "#0099ff" },
    ],
  });

  return (
    <Graphics
      ref={(graphics) => {
        graphics.roundRect(-50, -50, 100, 100, 20).fill(gradient);
      }}
      eventMode={"static"}
      cursor={isDragging() ? "grabbing" : "grab"}
      onpointerdown={handlePointerDown}
      onpointerup={handlePointerUp}
      onpointerupoutside={handlePointerUp}
      onglobalpointermove={handlePointerMove}
      scale={scale()}
      x={pointerPosition.x}
      y={pointerPosition.y}
    />
  );
};

export const DemoApp = () => {
  return (
    <PixiApplication antialias={true} resolution={window.devicePixelRatio}>
      <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
        <PixiStage>
          <DraggingDemo />
        </PixiStage>
      </PixiCanvas>
    </PixiApplication>
  );
};
