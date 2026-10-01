import type * as Pixi3D from "@pixi/3d";
import { View3D as PixiView3D } from "@pixi/3d";
import { cleanup, getByLabel, mountScene } from "pixi-solid/testing";
import { createSignal, Show } from "solid-js";
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

  it("destroys its own View3D instance on unmount", () => {
    const [visible, setVisible] = createSignal(true);
    let viewRef: PixiView3D | undefined;

    mountScene(() => (
      <Show when={visible()}>
        <View3D ref={(el) => (viewRef = el)} width={400} height={300} />
      </Show>
    ));

    const view = viewRef;
    expect(view).toBeInstanceOf(PixiView3D);

    setVisible(false);

    expect(view?.destroyed).toBe(true);

    cleanup();
  });
});

describe("View3DProvider component", () => {
  it("creates the View3D and shares it with sibling 2D components", () => {
    let siblingCapturedView: PixiView3D | undefined;
    let mountedView: PixiView3D | undefined;

    const SiblingComponent = () => {
      siblingCapturedView = useView3D();
      return null;
    };

    const { container } = mountScene<PixiView3D>(() => (
      <View3DProvider width={400} height={300} toneMapping="aces">
        <View3D ref={(el) => (mountedView = el)} />
        <SiblingComponent />
      </View3DProvider>
    ));

    expect(siblingCapturedView).toBeInstanceOf(PixiView3D);
    expect(mountedView).toBe(siblingCapturedView);
    expect(siblingCapturedView?.width).toBe(400);
    expect(siblingCapturedView?.height).toBe(300);
    expect(siblingCapturedView?.toneMapping).toBe("aces");
    expect(container).toContain(siblingCapturedView);

    cleanup();
  });

  it("keeps the provider-owned View3D alive when the mounted View3D unmounts", () => {
    const [visible, setVisible] = createSignal(true);
    let viewRef: PixiView3D | undefined;

    mountScene(() => (
      <View3DProvider width={400} height={300}>
        <Show when={visible()}>
          <View3D ref={(el) => (viewRef = el)} />
        </Show>
      </View3DProvider>
    ));

    const view = viewRef;
    expect(view).toBeInstanceOf(PixiView3D);

    setVisible(false);

    expect(view?.destroyed).toBe(false);

    cleanup();
  });

  it("adopts a View3D passed through as without destroying it", () => {
    const externalView = new PixiView3D({ width: 320, height: 240 });
    let viewRef: PixiView3D | undefined;

    mountScene(() => (
      <View3DProvider as={externalView}>
        <View3D ref={(el) => (viewRef = el)} />
      </View3DProvider>
    ));

    expect(viewRef).toBe(externalView);

    cleanup();

    expect(externalView.destroyed).toBe(false);

    externalView.destroy({ children: true });
  });

  it("throws when two View3D components mount the same provider-owned view", () => {
    expect(() => {
      mountScene(() => (
        <View3DProvider width={400} height={300}>
          <View3D />
          <View3D />
        </View3DProvider>
      ));
    }).toThrow(
      "Only one <View3D> may be mounted at a time per View3D instance. Unmount it before mounting another.",
    );

    cleanup();
  });

  it("throws when View3D combines as with an enclosing View3DProvider", () => {
    const externalView = new PixiView3D({ width: 320, height: 240 });

    expect(() => {
      mountScene(() => (
        <View3DProvider width={400} height={300}>
          <View3D as={externalView} />
        </View3DProvider>
      ));
    }).toThrow("<View3D> cannot combine the `as` prop with an enclosing <View3DProvider>");

    cleanup();

    externalView.destroy({ children: true });
  });
});
