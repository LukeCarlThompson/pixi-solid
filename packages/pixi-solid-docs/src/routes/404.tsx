import type { JSX } from "@solidjs/web";

import { href } from "../href";

export const route = {
  info: {
    label: "Page not found",
    description:
      "The page you asked for does not exist. Browse the pixi-solid documentation instead.",
  },
};

export default function NotFound(): JSX.Element {
  return (
    <article class="ps-prose">
      <h1>Page not found</h1>
      <p>
        There is no page at this address. Start from the <a href={href("/")}>introduction</a>, or
        use the search box to find what you need.
      </p>
    </article>
  );
}
