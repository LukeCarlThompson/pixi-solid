import type { JSX } from "@solidjs/web";

import { Article, CodeBlock, Searchable } from "../../components";

export const route = {
  info: {
    label: "Scene queries",
    description:
      "Find display objects by their label property, decoupling tests from scene graph hierarchy.",
    order: 6,
    sections: [
      { id: "getbylabellabel", title: "getByLabel(label)" },
      { id: "querybylabellabel", title: "queryByLabel(label)" },
      { id: "getallbylabellabel", title: "getAllByLabel(label)" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <Article>
      <Searchable>
        <h1>Scene queries</h1>
        <p>
          Find display objects by their <code>label</code> property, decoupling tests from scene
          graph hierarchy.
        </p>
        <p>
          <code>mountScene</code> returns these helpers bound to the current root. The standalone
          form takes a root as its first argument, so it also works on any Pixi container you
          already hold.
        </p>
        <h2 id="getbylabellabel">getByLabel(label)</h2>
        <p>Throws when the label is not found.</p>
        <CodeBlock
          code={`const { getByLabel } = mountScene(() => (
  <Container label="scene">
    <Sprite label="player" x={100} />
  </Container>
));

expect(getByLabel("player").x).toBe(100);`}
          title="tsx"
        />
        <p>The standalone form takes the root explicitly:</p>
        <CodeBlock code={`const player = getByLabel(container, "player");`} title="tsx" />
        <h2 id="querybylabellabel">queryByLabel(label)</h2>
        <p>
          Same as <code>getByLabel</code>, but returns <code>undefined</code> instead of throwing.
        </p>
        <CodeBlock code={`const maybe = queryByLabel("missing-label"); // undefined`} title="tsx" />
        <h2 id="getallbylabellabel">getAllByLabel(label)</h2>
        <p>
          Find every display object with the given label, which is useful when a scene repeats one:
        </p>
        <CodeBlock
          code={`const { getAllByLabel } = mountScene(() => (
  <Container label="scene">
    <Sprite label="enemy" />
    <Sprite label="enemy" />
  </Container>
));

expect(getAllByLabel("enemy")).toHaveLength(2);`}
          title="tsx"
        />
      </Searchable>
    </Article>
  );
}
