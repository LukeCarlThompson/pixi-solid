import type { JSX } from "@solidjs/web";
import type { ParentProps } from "solid-js";

import styles from "./style.module.scss";

export type SearchableProps = ParentProps;

/**
 * Marks its contents as page prose for the search index. The build collects what it wraps and
 * refuses to finish when a page has none, so a new page cannot slip past search unnoticed.
 */
export const Searchable = (props: SearchableProps): JSX.Element => (
  <div class={styles.searchable} data-search>
    {props.children}
  </div>
);
