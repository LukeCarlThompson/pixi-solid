import type { JSX } from "@solidjs/web";

import { Article, CodeBlock, Searchable } from "../../components";

export const route = {
  info: {
    label: "Project Setup",
    description: "How to set up a project with Pixi Solid.",
    order: 1,
    sections: [
      { id: "creating-a-new-project", title: "Creating a new project" },
      { id: "existing-project", title: "Existing project" },
      { id: "llm-skill", title: "LLM skill" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <Article>
      <Searchable>
        <h1>Project Setup</h1>
        <h2 id="creating-a-new-project">Creating a new project</h2>
        <p>
          To use <code>pixi-solid</code> you need a SolidJS project. If you do not have one yet,
          create one with:
        </p>
        <CodeBlock code={`npm init solid@latest`} title="bash" />
        <p>This creates a new SolidJS project in a directory of your choice.</p>
        <p>
          Next, install <code>pixi-solid</code> along with its peer dependency <code>pixi.js</code>{" "}
          in the project you created:
        </p>
        <CodeBlock code={`npm i pixi-solid pixi.js`} title="bash" />
        <h2 id="existing-project">Existing project</h2>
        <p>
          If you already have a project, make sure that <code>pixi.js</code> and{" "}
          <code>solid-js</code> are installed. Then install <code>pixi-solid</code>:
        </p>
        <CodeBlock code={`npm i pixi-solid`} title="bash" />
        <h3 id="compiler-setup">Compiler setup</h3>
        <p>
          <code>pixi-solid</code> uses <code>@solidjs/web</code> as its JSX renderer. Point your JSX
          compiler at it with <code>"jsxImportSource": "@solidjs/web"</code> in{" "}
          <code>tsconfig.json</code>, and use <code>@solidjs/vite-plugin</code> in your Vite config.
        </p>
        <h2 id="llm-skill">LLM skill</h2>
        <p>A pixi-solid skill for LLM coding assistants ships with the package. You can either:</p>
        <ul>
          <li>
            <p>
              <strong>Reference the path</strong> in your <code>AGENTS.md</code> or{" "}
              <code>.cursorrules</code>:{" "}
              <code>node_modules/pixi-solid/dist/skills/pixi-solid/SKILL.md</code>
            </p>
          </li>
          <li>
            <p>
              <strong>Install it for Agent Skills-compatible assistants</strong>:{" "}
              <code>
                mkdir -p .agents/skills/pixi-solid && cp -R
                node_modules/pixi-solid/dist/skills/pixi-solid/. .agents/skills/pixi-solid/
              </code>
            </p>
          </li>
        </ul>
        <p>
          The skill covers the full public API: components, hooks, utilities, providers, and testing
          patterns.
        </p>
      </Searchable>
    </Article>
  );
}
