import { createResource, For, Show } from "solid-js";

export const EventNamesList = () => {
  const [eventNamesResource] = createResource(async () => {
    const eventNames = await import("pixi-solid").then((mod) => mod.PIXI_SOLID_EVENT_HANDLER_NAMES);

    return eventNames;
  });

  return (
    <Show when={eventNamesResource()}>
      {(eventNames) => (
        <ul style={{ padding: "0 0 0 14px" }}>
          <For each={eventNames()}>
            {(eventName) => (
              <li style={{ padding: "0", margin: "0", "line-height": "1.4" }}>{eventName}</li>
            )}
          </For>
        </ul>
      )}
    </Show>
  );
};
