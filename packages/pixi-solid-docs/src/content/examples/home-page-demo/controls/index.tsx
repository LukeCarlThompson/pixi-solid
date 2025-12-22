import style from "./style.module.css";

export type ControlsProps = {
  isRunning: boolean;
  direction: "left" | "right";
  onToggleRunningClicked: () => void;
  onToggleDirectionClicked: () => void;
};

export const Controls = (props: ControlsProps) => {
  return (
    <div class={style["controls-wrap"]}>
      <button type="button" onClick={props.onToggleRunningClicked}>
        {props.isRunning ? "Click to stop" : "Click to run"}
      </button>
      <br />
      <button type="button" onClick={props.onToggleDirectionClicked}>
        {props.direction === "left" ? "Click to face right" : "Click to face left"}
      </button>
    </div>
  );
};
