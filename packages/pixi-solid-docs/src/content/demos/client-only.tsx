import type { JSX } from "solid-js";
import { createSignal, lazy, onMount, Show } from "solid-js";

/**
 * A component to lazily load the component on the client only.
 * Astro renders the components in a NodeJS environment when in dev mode which the pixi-solid library doesn't support.
 * So this wrapper allows us to use the components in dev mode with hot reloading.
 * @param fileName a string of the file name of the component that should be loaded. `./${props.fileName}.demo.tsx`
 */
export const ClientOnly = (props: { fileName: string }): JSX.Element => {
  const [isClient, setIsClient] = createSignal(false);

  onMount(() => {
    setIsClient(true);
  });

  const Component = lazy(async () => {
    const file = await import(`./${props.fileName}.demo.tsx`);
    const firstKey = Object.keys(file)[0];
    const firstExport = file[firstKey];

    return {
      default: firstExport,
    };
  });
  return (
    <Show when={isClient()}>
      <Component />
    </Show>
  );
};
