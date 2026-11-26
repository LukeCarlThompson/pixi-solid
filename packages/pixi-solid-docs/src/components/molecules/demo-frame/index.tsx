import type { JSX } from "@solidjs/web";

import styles from "./style.module.scss";

export type DemoFrameProps = {
  label?: string;
  /** Intrinsic shape for a standalone frame; an overlay fills its parent instead. */
  ratio?: string;
  overlay?: boolean;
};

export const DemoFrame = (props: DemoFrameProps): JSX.Element => (
  <div
    class={[styles.frame, { [styles.overlay]: props.overlay }]}
    style={props.overlay ? undefined : { "aspect-ratio": props.ratio ?? "16 / 9" }}
    role="status"
    aria-busy="true"
    aria-live="polite"
  >
    <span class={styles.spinner} aria-hidden="true" />
    <span class={styles.label}>Loading demo…</span>
  </div>
);
