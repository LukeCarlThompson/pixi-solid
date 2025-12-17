import { Container, getTicker } from "pixi-solid";

import { onMount } from "solid-js";

export const MyComponent = () => {
  const ticker = getTicker();
  onMount(() => console.log("Ticker running:", ticker.started));

  return <Container />;
};
