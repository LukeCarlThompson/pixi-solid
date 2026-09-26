import { Application } from "pixi.js";
import type * as Pixi from "pixi.js";
import { afterEach, describe, expect, it, vi } from "vitest";

import { createTestContext, mountScene } from "../testing";

import * as pixiApplicationFactory from "./pixi-application";
import { PixiApplicationProvider } from "./pixi-application-provider";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("PixiApplicationProvider application ownership", () => {
  it("GIVEN app initialization is pending WHEN provider unmounts THEN it destroys the app after initialization completes", async () => {
    const ctx = createTestContext();
    const destroy = vi.fn();
    ctx.app.destroy = destroy;

    let finishInitialization: (() => void) | undefined;
    const appInitialization = new Promise<Pixi.Application>((resolve) => {
      finishInitialization = () => resolve(ctx.app);
    });
    const createAppSpy = vi
      .spyOn(pixiApplicationFactory, "createPixiApplication")
      .mockImplementation((_props, onCreate) => {
        onCreate?.(ctx.app);
        return appInitialization;
      });

    const { dispose } = mountScene(() => <PixiApplicationProvider />);
    await vi.waitFor(() => expect(createAppSpy).toHaveBeenCalled());

    // WHEN
    dispose();

    // THEN: don't destroy an app while init is still using it.
    expect(destroy).not.toHaveBeenCalled();

    if (!finishInitialization) throw new Error("App init did not start");
    finishInitialization();

    // AND: destroy the late-resolving app exactly once.
    await vi.waitFor(() => expect(destroy).toHaveBeenCalledTimes(1));
  });

  it("GIVEN a ready app created by provider WHEN provider unmounts THEN it destroys the app", async () => {
    const ctx = createTestContext();
    const destroy = vi.fn();
    ctx.app.destroy = destroy;
    const addRendererListener = vi.spyOn(ctx.renderer, "addListener");

    vi.spyOn(pixiApplicationFactory, "createPixiApplication").mockImplementation(
      (_props, onCreate) => {
        onCreate?.(ctx.app);
        return Promise.resolve(ctx.app);
      },
    );

    const { dispose } = mountScene(() => <PixiApplicationProvider />);
    await vi.waitFor(() => expect(addRendererListener).toHaveBeenCalled());

    dispose();

    expect(destroy).toHaveBeenCalledTimes(1);
  });

  it("GIVEN an externally owned app WHEN provider unmounts THEN it does not destroy the app", async () => {
    const ctx = createTestContext();
    const destroy = vi.fn();
    ctx.app.destroy = destroy;
    const addRendererListener = vi.spyOn(ctx.renderer, "addListener");
    const createAppSpy = vi.spyOn(pixiApplicationFactory, "createPixiApplication");
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const { dispose } = mountScene(() => <PixiApplicationProvider existingApp={ctx.app} />);
    await vi.waitFor(() => expect(addRendererListener).toHaveBeenCalled());

    dispose();

    expect(destroy).not.toHaveBeenCalled();
    expect(createAppSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("GIVEN an external app and initialization options WHEN provider mounts THEN it warns that the options are ignored", async () => {
    const ctx = createTestContext();
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const addRendererListener = vi.spyOn(ctx.renderer, "addListener");

    const { dispose } = mountScene(() => (
      <PixiApplicationProvider existingApp={ctx.app} background="#1099bb" />
    ));
    await vi.waitFor(() => expect(addRendererListener).toHaveBeenCalled());

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("Application options were provided but ignored"),
    );
    dispose();
  });

  it("GIVEN an ancestor app provider and nested initialization options WHEN nested provider mounts THEN it warns that the options are ignored", async () => {
    const ctx = createTestContext();
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const addRendererListener = vi.spyOn(ctx.renderer, "addListener");

    const { dispose } = mountScene(() => (
      <PixiApplicationProvider existingApp={ctx.app}>
        <PixiApplicationProvider background="#1099bb" />
      </PixiApplicationProvider>
    ));
    await vi.waitFor(() => expect(addRendererListener).toHaveBeenCalledTimes(2));

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("Application options were provided but ignored"),
    );
    dispose();
  });
});

describe("createPixiApplication initialization cleanup", () => {
  it("GIVEN app initialization fails WHEN the helper rejects THEN it destroys the app stage", async () => {
    const initializationError = new Error("init failed");
    let createdApp: Pixi.Application | undefined;

    vi.spyOn(Application.prototype, "init").mockRejectedValue(initializationError);

    await expect(
      pixiApplicationFactory.createPixiApplication(undefined, (app) => {
        createdApp = app;
      }),
    ).rejects.toBe(initializationError);

    expect(createdApp?.stage.destroyed).toBe(true);
  });
});
