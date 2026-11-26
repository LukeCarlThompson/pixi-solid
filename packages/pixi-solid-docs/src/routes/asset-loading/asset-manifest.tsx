import type { JSX } from "@solidjs/web";

import snippet1 from "../../code-examples/asset-loading-asset-manifest-1.json?raw";
import snippet2 from "../../code-examples/asset-loading-asset-manifest-2.tsx?raw";
import { CodeBlock } from "../../components";
import { href } from "../../href";

export const route = {
  info: {
    label: "Loading an Asset Manifest",
    description: "How to load multiple assets efficiently with an asset manifest in pixi-solid.",
    order: 100,
    sections: [
      { id: "what-is-an-asset-manifest", title: "What is an Asset Manifest?" },
      { id: "example-assets-manifestjson", title: "Example assets-manifest.json" },
      {
        id: "example-loading-assets-from-a-manifest",
        title: "Example: Loading Assets from a Manifest",
      },
      { id: "further-reading", title: "Further reading" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <article class="ps-prose">
      <h1>Loading an Asset Manifest</h1>
      <p>
        For applications with many assets, managing individual asset loading can become cumbersome.
        PixiJS provides an <strong>Asset Manifest</strong> system that lets you define all your
        assets, their paths, and groups in a single JSON file.
      </p>
      <p>
        Use PixiJS <a href="https://pixijs.io/assetpack/">AssetPack</a> to generate the manifest for
        you.
      </p>
      <p>
        This guide demonstrates how to load an entire asset manifest and then access the loaded
        assets within your <code>pixi-solid</code> application.
      </p>
      <h2 id="what-is-an-asset-manifest">What is an Asset Manifest?</h2>
      <p>
        An asset manifest is a JSON file that describes your application's assets. It typically
        includes:
      </p>
      <ul>
        <li>
          <p>
            <strong>
              <code>bundles</code>
            </strong>
            : Groups of assets that can be loaded together. This is extremely useful for loading
            assets required for a specific scene or component.
          </p>
        </li>
        <li>
          <p>
            <strong>
              <code>assets</code>
            </strong>
            : Individual assets with their unique <code>alias</code> (how you refer to them in code)
            and <code>src</code> (their file path).
          </p>
        </li>
      </ul>
      <h3 id="example-assets-manifestjson">
        Example <code>assets-manifest.json</code>
      </h3>
      <p>
        Let's assume you have an <code>assets-manifest.json</code> file in your <code>public</code>{" "}
        folder like this:
      </p>
      <CodeBlock code={snippet1} lang="json" title="json" />
      <p>
        Loading a manifest resolves to <code>void</code>, so the memo reports when the bundles are
        ready rather than returning the assets. Components then read each asset by its alias as they
        need it.
      </p>
      <h3 id="example-loading-assets-from-a-manifest">Example: Loading Assets from a Manifest</h3>
      <CodeBlock code={snippet2} title="tsx" />
      <p>
        The boundary renders its <code>fallback</code> while the bundles load, so the page can show
        a DOM loading indicator before any Pixi object exists.
      </p>
      <p>
        When a scene needs only a few known assets, return them from the memo and read them directly
        instead. See{" "}
        <a href={href("/asset-loading/individual-assets")}>loading individual assets</a>.
      </p>
      <h2 id="further-reading">Further reading</h2>
      <ul>
        <li>
          <p>
            Read more about{" "}
            <a href="https://pixijs.com/8.x/guides/components/assets">
              PixiJS Assets Management and Manifests
            </a>{" "}
            in the official PixiJS documentation.
          </p>
        </li>
      </ul>
    </article>
  );
}
