import { lazy } from "solid-js";
/**
 * A component to lazily load the component on the client only.
 * Astro renders the components in a NodeJS environment when in dev mode which the pixi-solid library doens't support.
 * So this wrapper allows us to use the components in dev moode with hot reloading.
 * @param filepath a string of the path relative to this component of the component that should be loaded.
 */
export const ClientOnly = (props: { filePath: string }) => {
  const Component = lazy(async () => {
    const file = await import(props.filePath);
    const firstKey = Object.keys(file)[0];
    const firstExport = file[firstKey];

    console.log(firstExport);

    return {
      default: firstExport,
    };
  });

  return <Component />;
};
