import type { JSX } from "@solidjs/web";
import type { ParentProps } from "solid-js";

import styles from "./style.module.scss";

export type ButtonProps = ParentProps<{
  label: string;
  onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
  variant?: "ghost" | "solid";
  expanded?: boolean;
  controls?: string;
}>;

export const Button = (props: ButtonProps): JSX.Element => (
  <button
    type="button"
    class={[styles.button, styles[props.variant ?? "ghost"]]}
    aria-label={props.label}
    aria-expanded={props.expanded ? "true" : undefined}
    aria-controls={props.controls}
    onClick={props.onClick}
  >
    {props.children}
  </button>
);
