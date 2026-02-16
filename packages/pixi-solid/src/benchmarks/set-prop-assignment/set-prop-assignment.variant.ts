import type * as Pixi from "pixi.js";

export const assignWithKeyIn = <T>(instance: Pixi.Container, key: string, value: T): void => {
  if (key in instance) {
    (instance as any)[key] = value;
  }
};

export const assignWithTryCatch = <T>(instance: Pixi.Container, key: string, value: T): void => {
  try {
    (instance as any)[key] = value;
  } catch {
    // Ignore assignment failures to simulate optimistic assignment.
  }
};
