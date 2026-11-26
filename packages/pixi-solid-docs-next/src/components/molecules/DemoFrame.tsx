import type { JSX } from "@solidjs/web";

import styles from "./DemoFrame.module.scss";

export type DemoFrameProps = {
  label?: string;
  ratio?: string;
};

export const DemoFrame = (props: DemoFrameProps): JSX.Element => (
  <div
    class={styles.frame}
    style={{ "aspect-ratio": props.ratio ?? "16 / 9" }}
    role="status"
    aria-busy="true"
    aria-live="polite"
  >
    <span class={styles.spinner} aria-hidden="true" />
    <span class={styles.label}>Loading demo…</span>
  </div>
);
