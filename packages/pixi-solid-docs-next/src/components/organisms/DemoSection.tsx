import type { JSX } from "@solidjs/web";
import { Show } from "solid-js";

import { CodeBlock } from "../molecules/CodeBlock";
import { DemoFrame } from "../molecules/DemoFrame";

import styles from "./DemoSection.module.scss";

export type DemoSectionProps = {
  title?: string;
  source?: string;
  ratio?: string;
  children: JSX.Element;
};

export const DemoSection = (props: DemoSectionProps): JSX.Element => (
  <section class={styles.section} aria-label={props.title ?? "Demo"}>
    <div class={styles.stage} style={{ "aspect-ratio": props.ratio ?? "16 / 9" }}>
      <DemoFrame label={props.title ?? "Live demo"} />
      <div class={styles.live}>{props.children}</div>
    </div>
    <Show when={props.source}>{(source) => <CodeBlock code={source()} title="demo.tsx" />}</Show>
  </section>
);
