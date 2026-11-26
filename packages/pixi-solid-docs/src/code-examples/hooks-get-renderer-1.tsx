import { getRenderer, Container, PixiCanvas } from "pixi-solid";

const MyComponent = () => {
  const renderer = getRenderer();

  // You can now safely use the PixiJS Renderer instance
  console.log("Renderer resolution:", renderer.resolution);
  console.log("Renderer view size:", renderer.width, renderer.height);

  return <Container>{/* Your components here*/}</Container>;
};

export const DemoApp = () => {
  return (
    <PixiCanvas>
      <MyComponent />
    </PixiCanvas>
  );
};
