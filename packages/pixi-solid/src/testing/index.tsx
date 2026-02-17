import type { JSX, ParentProps } from "solid-js";
import { children } from "solid-js";

/**
 * This calls the children components but doesn't mount to anything.
 * This is useful for testing components using SollidJS testing library without needing to worry about the Pixi Application or rendering at all. It can be used as a wrapper around the component you want to test in the render function of the testing library.
 */
export const NoMount = (props: ParentProps): JSX.Element => {
  const c = children(() => props.children);
  c();

  return <></>;
};
