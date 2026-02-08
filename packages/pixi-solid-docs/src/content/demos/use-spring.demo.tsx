import type * as Pixi from "pixi.js";
import { FillGradient } from "pixi.js";
import { Graphics, PixiCanvas } from "pixi-solid";
import { useSpring } from "pixi-solid/utils";
import { createSignal } from "solid-js";

const DraggingDemo = () => {
  const [isDragging, setIsDragging] = createSignal(false);
  const pointerPosition = { x: 100, y: 100 };

  const draggingScale = 1.4;
  const droppedScale = 0.8;
  let scaleTarget = droppedScale;

  const springyScale = useSpring({
    to: () => scaleTarget,
    damping: () => (isDragging() ? 50 : 100),
    stiffness: () => (isDragging() ? 80 : 100),
    mass: () => 20,
  });

  const springyPositionX = useSpring({
    to: () => pointerPosition.x,
    damping: () => (isDragging() ? 50 : 100),
    stiffness: () => (isDragging() ? 40 : 100),
  });

  const springyPositionY = useSpring({
    to: () => pointerPosition.y,
    damping: () => (isDragging() ? 60 : 100),
    stiffness: () => (isDragging() ? 30 : 100),
  });

  let dragTarget: Pixi.Container | undefined;

  const handlePointerDown = (e: Pixi.FederatedPointerEvent) => {
    dragTarget = e.target;
    scaleTarget = draggingScale;
    setIsDragging(true);

    if (!e.target.parent) return;
    // Calculate the offset from the dragTarget's local origin to the click point
    e.target.parent.toLocal(e.global, undefined, pointerPosition);
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
      angle={springyPositionX.velocity() * 0.05}
      scale={springyScale.value()}
      x={springyPositionX.value()}
      y={springyPositionY.value()}
    />
  );
};

export const DemoApp = () => {
  return (
    <PixiCanvas style={{ "aspect-ratio": "2/1.5" }} antialias={true}>
      <DraggingDemo />
    </PixiCanvas>
  );
};
