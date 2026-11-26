import type { JSX } from "@solidjs/web";
import { createSignal } from "solid-js";

import { Button } from "../button";

import styles from "./style.module.scss";

const readTheme = (): "light" | "dark" =>
  document.documentElement.dataset.theme === "light" ? "light" : "dark";

export const ThemeToggle = (): JSX.Element => {
  const [theme, setTheme] = createSignal<"light" | "dark">(
    typeof document === "undefined" ? "dark" : readTheme(),
  );

  const toggle = () => {
    const next = theme() === "dark" ? "light" : "dark";

    document.documentElement.dataset.theme = next;

    try {
      localStorage.setItem("ps-theme", next);
    } catch {
      // Private mode, nothing to persist.
    }

    setTheme(next);
  };

  return (
    <Button label="Toggle theme" onClick={toggle}>
      {/* Both icons ship; CSS shows the one that matches the document theme, so the server and the
          client render the same tree. */}
      <svg
        class={styles.sun}
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" />
      </svg>
      <svg
        class={styles.moon}
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
      >
        <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
      </svg>
    </Button>
  );
};
