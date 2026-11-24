import { createStore } from "solid-js";

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

  // Solid 2 setters take a single draft callback; per-path setters are gone.
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
