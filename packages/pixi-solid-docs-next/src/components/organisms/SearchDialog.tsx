import type { JSX } from "@solidjs/web";
import MiniSearch from "minisearch";
import { createEffect, createSignal, For, onSettled, Show } from "solid-js";

import { href } from "../../href";

import styles from "./SearchDialog.module.scss";

type SearchRecord = { id: string; title: string; headings: string; text: string };

type SearchHit = { id: string; title: string; snippet: string };

export type SearchDialogProps = {
  open: boolean;
  onClose: () => void;
};

/** Text around the match, so a hit reads as a sentence rather than the start of the page. */
const excerpt = (text: string, query: string): string => {
  const at = text.toLowerCase().indexOf(query.toLowerCase());
  if (at <= 40) return text.slice(0, 150);
  return `…${text.slice(at - 40, at + 110)}`;
};

const loadIndex = async (): Promise<SearchRecord[]> => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}search-index.json`);
    const contentType = response.headers.get("content-type") ?? "";

    // The dev server answers unknown paths with index.html, so a JSON check matters more than
    // response.ok. The index is a build artefact.
    if (!response.ok || !contentType.includes("application/json")) return [];

    return (await response.json()) as SearchRecord[];
  } catch {
    return [];
  }
};

export const SearchDialog = (props: SearchDialogProps): JSX.Element => {
  const [query, setQuery] = createSignal("");
  const [hits, setHits] = createSignal<SearchHit[]>([]);
  const [active, setActive] = createSignal(0);
  const [ready, setReady] = createSignal(false);
  const noResults = () => ready() && query().length > 0 && hits().length === 0;
  let search: MiniSearch<SearchRecord> | undefined;
  let input: HTMLInputElement | undefined;

  const run = (value: string) => {
    if (!search || value.trim().length === 0) {
      setHits([]);
      return;
    }

    const results = search.search(value, { prefix: true, fuzzy: 0.2, boost: { title: 3 } });

    setHits(
      results.slice(0, 8).map((result) => ({
        id: String(result.id),
        title: String(result.title ?? result.id),
        snippet: excerpt(String(result.text ?? ""), value),
      })),
    );
    setActive(0);
  };

  onSettled(() => {
    const controller = new AbortController();
    void loadIndex().then((records) => {
      if (controller.signal.aborted) return;

      search = new MiniSearch<SearchRecord>({
        fields: ["title", "headings", "text"],
        storeFields: ["title", "text"],
        idField: "id",
      });
      search.addAll(records);
      setReady(true);
    });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") props.onClose();
    };

    window.addEventListener("keydown", onKey);

    return () => {
      controller.abort();
      window.removeEventListener("keydown", onKey);
    };
  });

  createEffect(
    () => props.open,
    (open) => {
      if (open) queueMicrotask(() => input?.focus());
      else setQuery("");
    },
  );

  const go = (hit: SearchHit) => {
    props.onClose();
    window.location.assign(href(hit.id));
  };

  return (
    <Show when={props.open}>
      <div class={styles.overlay} role="presentation" onClick={props.onClose}>
        <div
          class={styles.dialog}
          role="dialog"
          aria-modal="true"
          aria-label="Search documentation"
          onClick={(event) => event.stopPropagation()}
        >
          <input
            ref={(element) => (input = element)}
            class={styles.input}
            type="search"
            placeholder="Search the docs"
            value={query()}
            onInput={(event) => {
              setQuery(event.currentTarget.value);
              run(event.currentTarget.value);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActive((current) => Math.min(current + 1, hits().length - 1));
              }
              if (event.key === "ArrowUp") {
                event.preventDefault();
                setActive((current) => Math.max(current - 1, 0));
              }
              if (event.key === "Enter") {
                const hit = hits()[active()];
                if (hit) go(hit);
              }
            }}
          />

          <ul class={styles.results}>
            <For each={hits()}>
              {(hit, index) => (
                <li>
                  <button
                    type="button"
                    class={styles.result}
                    data-active={index() === active()}
                    onClick={() => go(hit)}
                  >
                    <span class={styles.resultTitle}>{hit.title}</span>
                    <span class={styles.resultSnippet}>{hit.snippet}</span>
                  </button>
                </li>
              )}
            </For>
          </ul>

          <Show when={noResults()}>
            <p class={styles.empty}>No results for “{query()}”.</p>
          </Show>
        </div>
      </div>
    </Show>
  );
};
