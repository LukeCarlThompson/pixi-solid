import type { JSX } from "@solidjs/web";
import { createSignal, For, onSettled, Show } from "solid-js";

import styles from "./style.module.scss";

export type TableOfContentsProps = {
  sections: readonly { id: string; title: string }[];
  /** A popover above the article for narrow screens, rather than the sticky rail. */
  compact?: boolean;
};

export const TableOfContents = (props: TableOfContentsProps): JSX.Element => {
  const [open, setOpen] = createSignal(false);
  let wrapRef: HTMLDivElement | undefined;

  // A popover closes on Escape or on a click outside it. The rail is always visible, so this
  // only runs for the compact form.
  onSettled(() => {
    if (!props.compact) return;

    const onPointerDown = (event: PointerEvent) => {
      if (wrapRef && !wrapRef.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);

    // onSettled takes the teardown as its return value; onCleanup is not allowed here.
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  });

  return (
    <Show when={props.sections.length > 0}>
      <nav class={[styles.toc, { [styles.compact]: props.compact }]} aria-label="On this page">
        <Show
          when={props.compact}
          fallback={
            <ul class={styles.list}>
              <For each={props.sections}>
                {(section) => (
                  <li>
                    <a href={`#${section.id}`}>{section.title}</a>
                  </li>
                )}
              </For>
            </ul>
          }
        >
          <div class={styles.popover} ref={wrapRef}>
            <button
              type="button"
              class={styles.trigger}
              aria-expanded={open() ? "true" : "false"}
              aria-controls="toc-popover"
              onClick={() => {
                setOpen((value) => !value);
              }}
            >
              On this page
              <span class={styles.chevron} aria-hidden="true" />
            </button>
            <Show when={open()}>
              <ul class={styles.panel} id="toc-popover">
                <For each={props.sections}>
                  {(section) => (
                    <li>
                      <a href={`#${section.id}`} onClick={() => setOpen(false)}>
                        {section.title}
                      </a>
                    </li>
                  )}
                </For>
              </ul>
            </Show>
          </div>
        </Show>
      </nav>
    </Show>
  );
};
