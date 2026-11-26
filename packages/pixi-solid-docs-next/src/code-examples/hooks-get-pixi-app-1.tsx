import { getPixiApp, Container, PixiCanvas } from "pixi-solid";

const MyComponent = () => {
  const app = getPixiApp();

  // You can now safely use the PixiJS Application instance
  console.log("PixiJS Application instance:", app);

  return <Container>{/* Your components here*/}</Container>;
};

export const DemoApp = () => {
  return (
    <PixiCanvas>
      <MyComponent />
    </PixiCanvas>
  );
};
