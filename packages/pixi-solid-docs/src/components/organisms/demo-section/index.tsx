import type { JSX } from "@solidjs/web";
import { createSignal, onSettled, Show } from "solid-js";

import { CodeBlock } from "../../molecules/code-block";
import { DemoFrame } from "../../molecules/demo-frame";

import styles from "./style.module.scss";

export type DemoSectionProps = {
  title?: string;
  source?: string;
  children: JSX.Element;
};

/** Frames to wait for the demo to mount before the placeholder gives up. */
const MOUNT_FRAMES = 120;

export const DemoSection = (props: DemoSectionProps): JSX.Element => {
  const [ready, setReady] = createSignal(false);
  let live: HTMLDivElement | undefined;

  // The placeholder covers the module load. Once the demo is in the tree it is done, so it goes.
  onSettled(() => {
    let frames = 0;
    let handle = 0;

    const check = () => {
      if ((live?.childElementCount ?? 0) > 0 || ++frames > MOUNT_FRAMES) {
        setReady(true);
        return;
      }
      handle = requestAnimationFrame(check);
    };

    handle = requestAnimationFrame(check);

    return () => cancelAnimationFrame(handle);
  });

  return (
    <section class={styles.section} aria-label={props.title ?? "Demo"}>
      <div class={[styles.stage, { [styles.loading]: !ready() }]}>
        <Show when={!ready()}>
          <DemoFrame label={props.title ?? "Live demo"} overlay />
        </Show>
        <div class={styles.live} ref={live}>
          {props.children}
        </div>
      </div>
      <Show when={props.source}>{(source) => <CodeBlock code={source()} title="demo.tsx" />}</Show>
    </section>
  );
};
