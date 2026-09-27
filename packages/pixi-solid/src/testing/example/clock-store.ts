import { createStore } from "solid-js";

import { onTick } from "../../on-tick";

type ClockStore = {
  time: number;
};

export const createClockStore = (): ClockStore => {
  const [store, setStore] = createStore({
    time: 0,
  });

  onTick((ticker) => {
    setStore((state) => {
      state.time += ticker.deltaMS;
    });
  });

  return store;
};
