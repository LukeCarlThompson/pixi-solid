import type { JSX } from "@solidjs/web";
import { For } from "solid-js";

import { href } from "../../../href";
import { navGroups } from "../../../nav";

import styles from "./style.module.scss";

export type SidebarProps = {
  currentPath: string;
  onNavigate?: () => void;
};

export const Sidebar = (props: SidebarProps): JSX.Element => {
  const isActive = (path: string) => props.currentPath === path;
  const ariaCurrent = (active: boolean) => (active ? "page" : undefined);

  return (
    <nav class={styles.sidebar} aria-label="Documentation">
      <For each={navGroups}>
        {(group) => (
          <section class={styles.group}>
            <p class={styles.groupLabel}>{group.label}</p>
            <ul class={styles.list}>
              <For each={group.pages}>
                {(page) => (
                  <li>
                    <a
                      href={href(page.path)}
                      class={[styles.link, { [styles.active]: isActive(page.path) }]}
                      aria-current={ariaCurrent(isActive(page.path))}
                      onClick={() => props.onNavigate?.()}
                    >
                      {page.label}
                    </a>
                  </li>
                )}
              </For>
            </ul>
          </section>
        )}
      </For>

      <section class={styles.group}>
        <p class={styles.groupLabel}>Links</p>
        <ul class={styles.list}>
          <li>
            <a
              class={styles.link}
              href="https://github.com/LukeCarlThompson/pixi-solid"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              class={styles.link}
              href="https://www.npmjs.com/package/pixi-solid"
              target="_blank"
              rel="noreferrer"
            >
              npm
            </a>
          </li>
        </ul>
      </section>

      <p class={styles.version}>v2 · SolidJS 2</p>
    </nav>
  );
};
