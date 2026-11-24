import { createMemo, For, Loading } from "solid-js";

export const Demo = () => {
  // Solid 2 removed `createResource`. An async `createMemo` is the replacement: reading it
  // suspends, so the enclosing `<Loading>` waits for the module before rendering the list.
  const eventNames = createMemo(
    async () => (await import("pixi-solid")).PIXI_SOLID_EVENT_HANDLER_NAMES,
  );

  return (
    <Loading>
      <ul style={{ padding: "0 0 0 14px" }}>
        <For each={eventNames()}>
          {(eventName) => (
            <li style={{ padding: "0", margin: "0", "line-height": "1.4" }}>{eventName}</li>
          )}
        </For>
      </ul>
    </Loading>
  );
};
