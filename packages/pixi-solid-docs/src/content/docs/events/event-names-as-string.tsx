import { createResource, For, Show } from "solid-js";

export const EventNamesList = () => {
  const [eventNamesResource] = createResource(async () => {
    const eventNames = await import("pixi-solid").then((mod) => mod.PIXI_SOLID_EVENT_HANDLER_NAMES);

    return eventNames;
  });

  return (
    <Show when={eventNamesResource()}>
      {(eventNames) => (
        <ul>
          <For each={eventNames()}>{(eventName) => <li>{eventName}</li>}</For>
        </ul>
      )}
    </Show>
  );
};
