import type { JSX } from "@solidjs/web";
import { clientOnly } from "@solidjs/web";

import { CodeBlock, DemoSection } from "../../components";

const EventNamesDemo = clientOnly(() => import("../../demos/event-names.demo"), { export: "Demo" });

export const route = {
  info: {
    label: "Overview",
    description: "A page describing the events available in Pixi Solid.",
    order: 1,
    sections: [{ id: "event-handlers", title: "Event handlers" }],
  },
};

export default function Page(): JSX.Element {
  return (
    <article class="ps-prose">
      <h1>Overview</h1>
      <h2 id="event-handlers">Event handlers</h2>
      <p>
        Pixi Solid components support all PixiJS event handlers for various user interactions and
        events. These event handlers can be added as props to the components, similar to how event
        handlers are added in SolidJS.
      </p>
      <p>
        The event handler names are the same as in PixiJS, but prefixed with <code>on</code>.
        <code>mouseover</code> becomes <code>onmouseover</code>. Refer to the{" "}
        <a href="https://pixijs.com/8.x/guides/components/events">PixiJS events docs</a> for more
        details on each event and when they are triggered and how event modes work. The usage is
        exactly the same as in PixiJS but we access them via SolidJS props instead of adding and
        removing listeners imperatively.
      </p>
      <CodeBlock
        code={`//...
<Sprite
  //...
  eventMode="static"
  onpointertap={(event) => {
    console.log("Sprite clicked!", event);
  }}
  onpointerover={(event) => {
    console.log("Pointer moved over Sprite!", event);
  }}
/>;
//...`}
        title="tsx"
      />
      <h3 id="full-event-list">Full event list</h3>
      <DemoSection title="event-names">
        <EventNamesDemo fallback={<span />} />
      </DemoSection>
    </article>
  );
}
