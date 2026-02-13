import { Graphics, PixiCanvas } from "pixi-solid";
import { useSmoothDamp } from "pixi-solid/utils";
import type * as Pixi from "pixi.js";
import { FillGradient } from "pixi.js";
import { createSignal } from "solid-js";

const DraggingDemo = () => {
  const [isDragging, setIsDragging] = createSignal(false);
  const pointerPosition = { x: 100, y: 100 };

  const draggingScale = 1.4;
  const droppedScale = 0.8;
  let scaleTarget = droppedScale;

  const dampedScale = useSmoothDamp({
    to: () => scaleTarget,
    smoothTimeMs: () => (isDragging() ? 50 : 200),
  });

  let dragTarget: Pixi.Container | undefined;

  const handlePointerDown = (e: Pixi.FederatedPointerEvent) => {
    dragTarget = e.target;
    scaleTarget = draggingScale;
    setIsDragging(true);

    if (!e.target.parent) return;
    // Calculate the offset from the dragTarget's local origin to the click point
    const localPointerPosition = e.target.parent.toLocal(e.global);
    pointerPosition.x = localPointerPosition.x;
    pointerPosition.y = localPointerPosition.y;
  };

  const handlePointerUp = () => {
    dragTarget = undefined;
    scaleTarget = droppedScale;
    setIsDragging(false);
  };

  const handlePointerMove = (e: Pixi.FederatedPointerEvent) => {
    if (!dragTarget || !dragTarget.parent) return;
    dragTarget.parent.toLocal(e.global, undefined, pointerPosition);
  };

  const dampedPositionX = useSmoothDamp({
    to: () => pointerPosition.x,
    smoothTimeMs: () => 150,
  });

  const dampedPositionY = useSmoothDamp({
    to: () => pointerPosition.y,
    smoothTimeMs: () => 150,
  });

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
      angle={dampedPositionX.velocity() * 0.05}
      scale={dampedScale.value()}
      x={dampedPositionX.value()}
      y={dampedPositionY.value()}
    />
  );
};

export const DemoApp = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5" }} antialias={true}>
    <DraggingDemo />
  </PixiCanvas>
);
