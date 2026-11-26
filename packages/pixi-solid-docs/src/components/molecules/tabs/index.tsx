import type { JSX } from "@solidjs/web";
import { createSignal, For } from "solid-js";

import styles from "./style.module.scss";

export type TabItem = {
  label: string;
  content: JSX.Element;
};

export type TabsProps = {
  items: readonly TabItem[];
};

const ariaBoolean = (value: boolean) => (value ? "true" : "false");

export const Tabs = (props: TabsProps): JSX.Element => {
  const [active, setActive] = createSignal(0);

  return (
    <div class={styles.tabs}>
      <div class={styles.list} role="tablist">
        <For each={props.items}>
          {(item, index) => (
            <button
              type="button"
              role="tab"
              class={[styles.tab, { [styles.active]: active() === index() }]}
              aria-selected={ariaBoolean(active() === index())}
              onClick={() => {
                setActive(index());
              }}
            >
              {item.label}
            </button>
          )}
        </For>
      </div>

      <For each={props.items}>
        {(item, index) => (
          <div
            class={styles.panel}
            role="tabpanel"
            hidden={active() !== index()}
            aria-label={item.label}
          >
            {item.content}
          </div>
        )}
      </For>
    </div>
  );
};
