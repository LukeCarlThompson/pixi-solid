import { Container, useTicker } from "pixi-solid";

import { onMount } from "solid-js";

export const MyComponent = () => {
  const ticker = useTicker();
  onMount(() => console.log("Ticker running:", ticker.started));

  return <Container />;
};
