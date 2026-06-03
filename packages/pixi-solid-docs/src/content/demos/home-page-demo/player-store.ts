import { createStore } from "solid-js/store";

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
    setState("isRunning", (value) => !value);
  };

  const toggleDirection = () => {
    setState("direction", (value) => (value === "left" ? "right" : "left"));
  };

  return {
    state,
    toggleRunning,
    toggleDirection,
  };
};
