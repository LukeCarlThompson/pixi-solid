export {
  AmbientLight,
  BatchedMesh3D,
  Camera3D,
  Container3D,
  DirectionalLight,
  Mesh3D,
  Model3D,
  ParticleContainer3D,
  PointLight,
  SpotLight,
  Sprite3D,
} from "./components";
export type {
  AmbientLightComponentProps,
  BatchedMesh3DComponentProps,
  Camera3DComponentProps,
  Container3DComponentProps,
  DirectionalLightComponentProps,
  Mesh3DComponentProps,
  Model3DComponentProps,
  ParticleContainer3DComponentProps,
  PointLightComponentProps,
  SpotLightComponentProps,
  Sprite3DComponentProps,
} from "./components";

export type {
  AdoptableProps,
  Container3DAxisProps,
  Container3DProps,
  Leaf3DProps,
  PixiComponent3D,
  RefAsProps3D,
  TopLevelAxisProps,
} from "./factories";

export {
  CapsuleGeometry,
  ConeGeometry,
  CubeGeometry,
  CylinderGeometry,
  FlatMaterial,
  IcosahedronGeometry,
  Material3D,
  PhongMaterial,
  PlaneGeometry,
  PortalMaterial,
  SphereGeometry,
  ToonMaterial,
  TorusGeometry,
  TorusKnotGeometry,
} from "./resources";
export type { ResourceRefProps } from "./resources";

export { View3D } from "./view-3d";
export type { View3DProps } from "./view-3d";
export { useScreenToWorld, useView3D, useWorldToScreen, View3DProvider } from "./view-3d-context";
export type {
  ScreenToWorldPoint,
  ScreenToWorldTarget,
  View3DProviderProps,
  WorldToScreenResult,
} from "./view-3d-context";

export { OrbitCamera } from "./orbit-camera";
export type { OrbitCameraProps } from "./orbit-camera";
export { FPSCamera } from "./fps-camera";
export type { FPSCameraProps } from "./fps-camera";
export { ParticleSystem3D } from "./particle-system-3d";
export type { ParticleSystem3DComponentProps } from "./particle-system-3d";

export { createContainerTexture } from "./container-texture";
export type { ContainerTextureOptions } from "./container-texture";

export { PIXI_3D_EVENT_NAMES, PIXI_SOLID_3D_EVENT_HANDLER_NAMES } from "./event-properties";
export type {
  Pixi3DEventName,
  PixiSolid3DEventMap,
  PixiSolid3DEventHandlerMap,
  PixiSolid3DEventHandlerName,
} from "./event-properties";
