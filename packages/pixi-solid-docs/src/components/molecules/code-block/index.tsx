import type { JSX } from "@solidjs/web";
import { toHtml } from "hast-util-to-html";
import { refractor } from "refractor";
import bash from "refractor/bash";
import json from "refractor/json";
import tsx from "refractor/tsx";
import { createMemo, createSignal } from "solid-js";

import styles from "./style.module.scss";

refractor.register(tsx);
refractor.register(bash);
refractor.register(json);

const ALIASES = { bash: "bash", json: "json", sh: "bash", tsx: "tsx", ts: "tsx" } as const;

export type CodeLang = keyof typeof ALIASES;

export type CodeBlockProps = {
  /** The source, read at render on both server and client, so the markup matches. */
  code: string;
  lang?: CodeLang;
  title?: string;
};

export const CodeBlock = (props: CodeBlockProps): JSX.Element => {
  const [copied, setCopied] = createSignal(false);

  const html = createMemo(() => {
    const language = ALIASES[props.lang ?? "tsx"];
    return toHtml(refractor.highlight(props.code, language));
  });

  const copy = async (event: MouseEvent) => {
    const code = (event.currentTarget as HTMLElement)
      .closest(`.${styles.block}`)
      ?.querySelector("code")?.textContent;

    if (!code) return;

    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <figure class={styles.block}>
      <div class={styles.head}>
        <span class={styles.title}>{props.title ?? props.lang ?? "code"}</span>
        <button
          type="button"
          class={styles.copy}
          onClick={(event) => void copy(event)}
          aria-label="Copy code"
        >
          {copied() ? "Copied" : "Copy"}
        </button>
      </div>
      <div class={styles.body}>
        <pre class={`language-${props.lang ?? "tsx"}`}>
          <code innerHTML={html()} />
        </pre>
      </div>
    </figure>
  );
};
