import type { JSX } from "@solidjs/web";
import type { ParentProps } from "solid-js";

import styles from "./style.module.scss";

export type ArticleProps = ParentProps;

/** Page content wrapper: prose spacing and element styling, scoped to the article. */
export const Article = (props: ArticleProps): JSX.Element => (
  <article class={styles.article}>{props.children}</article>
);
