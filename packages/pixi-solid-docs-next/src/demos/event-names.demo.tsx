import { createMemo, For, Loading } from "solid-js";

export const Demo = () => {
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
