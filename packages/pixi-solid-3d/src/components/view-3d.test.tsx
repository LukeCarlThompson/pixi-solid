import type * as Pixi3D from "@pixi/3d";
import { View3D as PixiView3D } from "@pixi/3d";
import { cleanup, getByLabel, mountScene } from "pixi-solid/testing";
import { createSignal } from "solid-js";
import { describe, expect, it } from "vitest";

import {
  Container3D as Container3DComp,
  PointLight,
  useView3D,
  View3D,
  View3DProvider,
} from "../components";

describe("View3D component", () => {
  it("mounts View3D and mounts 3D children into view.root", () => {
    let viewRef: PixiView3D | undefined;

    const { container } = mountScene<PixiView3D>(() => (
      <View3D ref={(el) => (viewRef = el)} width={400} height={300} toneMapping="aces">
        <Container3DComp label="group" x={10}>
          <PointLight label="sun" intensity={2} />
        </Container3DComp>
      </View3D>
    ));

    expect(container).toBeInstanceOf(PixiView3D);
    expect(viewRef).toBe(container);
    expect(container.width).toBe(400);
    expect(container.height).toBe(300);
    expect(container.toneMapping).toBe("aces");

    // Children should be attached to view.root (Container3D) alongside default camera
    const userNodes = container.root.children.filter((c) => c !== container.camera);
    expect(userNodes.length).toBe(1);
    const group = userNodes[0];
    expect(group.label).toBe("group");
    expect(group.x).toBe(10);
    expect(group.children.length).toBe(1);
    expect(group.children[0].label).toBe("sun");

    // Seamlessly query 3D children directly from View3D using pixi-solid getByLabel
    const foundGroup = getByLabel<Pixi3D.Container3D>(container, "group");
    expect(foundGroup).toBe(group);
    const foundSun = getByLabel<Pixi3D.PointLight>(container, "sun");
    expect(foundSun).toBe(group.children[0]);

    cleanup();
  });

  it("updates View3D toneMapping and dimensions reactively", () => {
    const [tone, setTone] = createSignal<"aces" | "reinhard">("aces");

    const { container } = mountScene<PixiView3D>(() => (
      <View3D width={500} height={500} toneMapping={tone()}>
        <Container3DComp label="box" />
      </View3D>
    ));

    expect(container.toneMapping).toBe("aces");

    setTone("reinhard");
    expect(container.toneMapping).toBe("reinhard");

    cleanup();
  });

  it("View3DProvider provides View3D context to sibling components", () => {
    let siblingCapturedView: PixiView3D | undefined;

    const SiblingComponent = () => {
      siblingCapturedView = useView3D();
      return null;
    };

    mountScene(() => (
      <View3DProvider>
        <View3D width={400} height={300} />
        <SiblingComponent />
      </View3DProvider>
    ));

    expect(siblingCapturedView).toBeInstanceOf(PixiView3D);
    expect(siblingCapturedView?.width).toBe(400);

    cleanup();
  });

  it("View3DProvider throws if multiple View3D instances attempt to register", () => {
    expect(() => {
      mountScene(() => (
        <View3DProvider>
          <View3D width={400} height={300} />
          <View3D width={500} height={400} />
        </View3DProvider>
      ));
    }).toThrow("Multiple <View3D> components detected inside a single <View3DProvider>");

    cleanup();
  });
});
