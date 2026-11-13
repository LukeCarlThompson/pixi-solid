import type * as Pixi3D from "@pixi/3d";
import { Container3D as PixiContainer3D, View3D as PixiView3D } from "@pixi/3d";
import { cleanup, mountScene } from "pixi-solid/testing";
import { createSignal, Show } from "solid-js";
import { describe, expect, it } from "vitest";

import {
  Container3D as Container3DComp,
  PointLight,
  useView3D,
  View3D,
  View3DProvider,
} from "../components";
import { getByLabel3D } from "../testing";

describe("View3D component", () => {
  it("GIVEN children and viewport props WHEN it mounts THEN children land in view.root", () => {
    // GIVEN
    let viewRef: PixiView3D | undefined;

    // WHEN
    const { container } = mountScene<PixiView3D>(() => (
      <View3D ref={(el) => (viewRef = el)} width={400} height={300} toneMapping="aces">
        <Container3DComp label="group" x={10}>
          <PointLight label="sun" intensity={2} />
        </Container3DComp>
      </View3D>
    ));

    // THEN
    expect(container).toBeInstanceOf(PixiView3D);
    expect(viewRef).toBe(container);
    expect(container.width).toBe(400);
    expect(container.height).toBe(300);
    expect(container.toneMapping).toBe("aces");

    const userNodes = container.root.children.filter((c) => c !== container.camera);
    expect(userNodes.length).toBe(1);
    const group = userNodes[0];
    expect(group.label).toBe("group");
    expect(group.x).toBe(10);
    expect(group.children.length).toBe(1);
    expect(group.children[0].label).toBe("sun");

    // 3D nodes are reachable with the same label query as 2D ones.
    const foundGroup = getByLabel3D(container, "group");
    expect(foundGroup).toBe(group);
    const foundSun = getByLabel3D<Pixi3D.PointLight>(container, "sun");
    expect(foundSun).toBe(group.children[0]);

    cleanup();
  });

  it("GIVEN a toneMapping signal WHEN it changes THEN the view follows", () => {
    // GIVEN
    const [tone, setTone] = createSignal<"aces" | "reinhard">("aces");

    const { container } = mountScene<PixiView3D>(() => (
      <View3D width={500} height={500} toneMapping={tone()}>
        <Container3DComp label="box" />
      </View3D>
    ));

    expect(container.toneMapping).toBe("aces");

    // WHEN
    setTone("reinhard");

    // THEN
    expect(container.toneMapping).toBe("reinhard");

    cleanup();
  });

  it("GIVEN an untyped root prop WHEN it changes THEN the view keeps the root it was built with", () => {
    // GIVEN `root` is not part of View3DProps, but an untyped caller can still pass it
    const first = new PixiContainer3D({ label: "first" });
    const [root, setRoot] = createSignal(first);

    const { container } = mountScene<PixiView3D>(() => (
      <View3D {...({ root: root() } as Pixi3D.View3DOptions)} />
    ));

    expect(container.root).toBe(first);

    // WHEN the same prop is given a different root after mount
    setRoot(new PixiContainer3D({ label: "second" }));

    // THEN the view still tracks the root from construction, which is the only one it can render
    expect(container.root).toBe(first);

    cleanup();
  });

  it("GIVEN an untyped root prop WHEN it changes THEN the provider keeps the root it was built with", () => {
    // GIVEN `root` is not part of View3DProviderProps, but an untyped caller can still pass it
    const first = new PixiContainer3D({ label: "first" });
    const [root, setRoot] = createSignal(first);

    const { container } = mountScene<PixiView3D>(() => (
      <View3DProvider {...({ root: root() } as Pixi3D.View3DOptions)}>
        <View3D />
      </View3DProvider>
    ));

    expect(container.root).toBe(first);

    // WHEN
    setRoot(new PixiContainer3D({ label: "second" }));

    // THEN
    expect(container.root).toBe(first);

    cleanup();
  });

  it("GIVEN a view it created WHEN it unmounts THEN it destroys that view", () => {
    // GIVEN
    const [visible, setVisible] = createSignal(true);
    let viewRef: PixiView3D | undefined;

    mountScene(() => (
      <Show when={visible()}>
        <View3D ref={(el) => (viewRef = el)} width={400} height={300} />
      </Show>
    ));

    const view = viewRef;
    expect(view).toBeInstanceOf(PixiView3D);

    // WHEN
    setVisible(false);

    // THEN
    expect(view?.destroyed).toBe(true);

    cleanup();
  });
});

describe("View3DProvider component", () => {
  it("GIVEN a provider with a sibling 2D component WHEN it mounts THEN both resolve one view", () => {
    // GIVEN
    let siblingCapturedView: PixiView3D | undefined;
    let mountedView: PixiView3D | undefined;

    const SiblingComponent = () => {
      siblingCapturedView = useView3D();
      return null;
    };

    // WHEN
    const { container } = mountScene<PixiView3D>(() => (
      <View3DProvider width={400} height={300} toneMapping="aces">
        <View3D ref={(el) => (mountedView = el)} />
        <SiblingComponent />
      </View3DProvider>
    ));

    // THEN
    expect(siblingCapturedView).toBeInstanceOf(PixiView3D);
    expect(mountedView).toBe(siblingCapturedView);
    expect(siblingCapturedView?.width).toBe(400);
    expect(siblingCapturedView?.height).toBe(300);
    expect(siblingCapturedView?.toneMapping).toBe("aces");
    expect(container).toContain(siblingCapturedView);

    cleanup();
  });

  it("GIVEN a provider-owned view WHEN the mounted View3D unmounts THEN the view survives", () => {
    // GIVEN
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

    // WHEN
    setVisible(false);

    // THEN
    expect(view?.destroyed).toBe(false);

    cleanup();
  });

  it("GIVEN an adopted view WHEN the provider unmounts THEN the view is not destroyed", () => {
    // GIVEN
    const externalView = new PixiView3D({ width: 320, height: 240 });
    let viewRef: PixiView3D | undefined;

    mountScene(() => (
      <View3DProvider as={externalView}>
        <View3D ref={(el) => (viewRef = el)} />
      </View3DProvider>
    ));

    expect(viewRef).toBe(externalView);

    // WHEN
    cleanup();

    // THEN
    expect(externalView.destroyed).toBe(false);

    externalView.destroy({ children: true });
  });

  it("GIVEN one provider WHEN two View3D components mount THEN it throws", () => {
    // GIVEN / WHEN / THEN
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

  it("GIVEN a provider WHEN a View3D also passes as THEN it throws", () => {
    // GIVEN
    const externalView = new PixiView3D({ width: 320, height: 240 });

    // WHEN / THEN
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
