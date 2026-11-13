import { describe, expect, it } from "vitest";

import { isWritableProp } from "./bind-props";

class GetterOnly {
  get size(): number {
    return 4;
  }
}

class GetterAndSetter {
  #value = 1;

  get value(): number {
    return this.#value;
  }

  set value(next: number) {
    this.#value = next;
  }
}

class WithField {
  label = "node";
}

class WithMethod {
  tick(): void {}
}

describe("isWritableProp", () => {
  it("GIVEN a getter with no setter WHEN checked THEN it is not writable", () => {
    // GIVEN
    const instance = new GetterOnly();

    // WHEN
    const writable = isWritableProp(instance, "size");

    // THEN
    expect(writable).toBe(false);
  });

  it("GIVEN an accessor with a setter WHEN checked THEN it is writable", () => {
    // GIVEN
    const instance = new GetterAndSetter();

    // WHEN
    const writable = isWritableProp(instance, "value");

    // THEN
    expect(writable).toBe(true);
  });

  it("GIVEN a data property on the instance WHEN checked THEN it is writable", () => {
    // GIVEN
    const instance = { label: "node" };

    // WHEN
    const writable = isWritableProp(instance, "label");

    // THEN
    expect(writable).toBe(true);
  });

  it("GIVEN a read-only data property on the instance WHEN checked THEN it is not writable", () => {
    // GIVEN
    const instance = Object.defineProperty({}, "id", { value: 1, writable: false });

    // WHEN
    const writable = isWritableProp(instance, "id");

    // THEN
    expect(writable).toBe(false);
  });

  it("GIVEN an inherited data property WHEN checked THEN it is writable", () => {
    // GIVEN
    const instance = new WithField();

    // WHEN
    const writable = isWritableProp(instance, "label");

    // THEN
    expect(writable).toBe(true);
  });

  it("GIVEN a property the instance does not have WHEN checked THEN it is not writable", () => {
    // GIVEN
    const instance = new WithMethod();

    // WHEN
    const writable = isWritableProp(instance, "missing");

    // THEN
    expect(writable).toBe(false);
  });

  it("GIVEN two instances of one class WHEN only one has a field THEN each answer follows its own instance", () => {
    // GIVEN
    const withField = new WithField();
    const withoutField = Object.create(WithField.prototype) as object;

    // WHEN
    const writableOnOwner = isWritableProp(withField, "label");
    const writableOnOther = isWritableProp(withoutField, "label");

    // THEN
    expect(writableOnOwner).toBe(true);
    expect(writableOnOther).toBe(false);
  });
});
