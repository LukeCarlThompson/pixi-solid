import { createStore } from "solid-js/store";

import { onTick } from "../../on-tick";

type ClockStore = {
  time: number;
};

export const createClockStore = (): ClockStore => {
  const [store, setStore] = createStore({
    time: 0,
  });

  onTick((ticker) => {
    setStore("time", (t) => t + ticker.deltaMS);
  });

  return store;
};
