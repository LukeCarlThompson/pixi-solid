import type { JSX } from "@solidjs/web";
import { Show } from "solid-js";
import type { ParentProps } from "solid-js";

import styles from "./Aside.module.scss";

export type AsideProps = ParentProps<{
  tone?: "note" | "tip" | "warning";
  title?: string;
}>;

export const Aside = (props: AsideProps): JSX.Element => (
  <aside class={[styles.aside, styles[props.tone ?? "note"]]}>
    <Show when={props.title}>{(title) => <p class={styles.title}>{title()}</p>}</Show>
    <div class={styles.body}>{props.children}</div>
  </aside>
);
