import type { JSX } from "@solidjs/web";
import type { ParentProps } from "solid-js";

import styles from "./style.module.scss";

export type TableProps = ParentProps;

/** A table rendered from page markup: keeps the cells authored, owns the styling and overflow. */
export const Table = (props: TableProps): JSX.Element => (
  <div class={styles.scroll}>
    <table class={styles.table}>{props.children}</table>
  </div>
);
