import type { JSX } from "@solidjs/web";
import { Show } from "solid-js";

import { href } from "../../href";
import { orderedPages } from "../../nav";

import styles from "./Pagination.module.scss";

export type PaginationProps = {
  currentPath: string;
};

export const Pagination = (props: PaginationProps): JSX.Element => {
  const index = () => orderedPages.findIndex((page) => page.path === props.currentPath);
  const previous = () => (index() > 0 ? orderedPages[index() - 1] : undefined);
  const next = () =>
    index() >= 0 && index() < orderedPages.length - 1 ? orderedPages[index() + 1] : undefined;

  return (
    <Show when={index() >= 0}>
      <nav class={styles.pagination} aria-label="Pagination">
        <Show when={previous()}>
          {(page) => (
            <a class={styles.previous} href={href(page().path)} rel="prev">
              <span class={styles.direction}>Previous</span>
              <span class={styles.title}>{page().label}</span>
            </a>
          )}
        </Show>

        <Show when={next()}>
          {(page) => (
            <a class={styles.next} href={href(page().path)} rel="next">
              <span class={styles.direction}>Next</span>
              <span class={styles.title}>{page().label}</span>
            </a>
          )}
        </Show>
      </nav>
    </Show>
  );
};
