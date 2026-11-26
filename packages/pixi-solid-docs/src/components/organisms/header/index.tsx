import type { JSX } from "@solidjs/web";

import { href } from "../../../href";
import { ThemeToggle } from "../../atoms/theme-toggle";

import styles from "./style.module.scss";

export type HeaderProps = {
  onOpenNav: () => void;
  onOpenSearch: () => void;
};

export const Header = (props: HeaderProps): JSX.Element => (
  <header class={styles.header}>
    <a class={styles.brand} href={href("/")}>
      <img class={styles.logo} src={href("/logo.png")} alt="" decoding="async" />
      <span class={styles.wordmark}>pixi-solid</span>
    </a>

    <div class={styles.actions}>
      <button type="button" class={styles.search} aria-label="Search" onClick={props.onOpenSearch}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <span class={styles.searchLabel}>Search</span>
        <kbd class={styles.kbd}>/</kbd>
      </button>

      <nav class={styles.nav} aria-label="Primary">
        <a
          class={styles.iconLink}
          href="https://github.com/LukeCarlThompson/pixi-solid"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub repository"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
          </svg>
        </a>
      </nav>

      <ThemeToggle />

      <button
        type="button"
        class={styles.menu}
        aria-label="Open navigation"
        onClick={props.onOpenNav}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>
    </div>
  </header>
);
