import type { RouteSectionProps } from "@solidjs/router";
import type { HeadTag, JSX } from "@solidjs/web";
import { useHead } from "@solidjs/web";
import { createEffect, createSignal, onSettled, Show } from "solid-js";

import { pagesByPath } from "../../../nav";
import { installViewTransitions } from "../../../view-transition";
import { Pagination } from "../../molecules/pagination";
import { Header } from "../../organisms/header";
import { SearchDialog } from "../../organisms/search-dialog";
import { Sidebar } from "../../organisms/sidebar";
import { TableOfContents } from "../../organisms/table-of-contents";

import styles from "./style.module.scss";

const SITE_URL = "https://lukecarlthompson.github.io";

export const DocsLayout = (props: RouteSectionProps): JSX.Element => {
  const [navOpen, setNavOpen] = createSignal(false);
  const [searchOpen, setSearchOpen] = createSignal(false);
  const [isNarrow, setIsNarrow] = createSignal(false);

  const pathname = () => {
    const withoutBase = props.location.pathname.replace(
      import.meta.env.BASE_URL.replace(/\/$/, ""),
      "",
    );

    return withoutBase.replace(/\/$/, "") || "/";
  };
  const page = () => pagesByPath.get(pathname());
  const sections = () => page()?.info.sections ?? [];

  installViewTransitions();

  // Fade the route slot on each change where the browser has no View Transitions, which handle
  // the same job with a cross-fade.
  let routeRef: HTMLDivElement | undefined;
  const hasViewTransitions = () => typeof document.startViewTransition === "function";

  createEffect(
    () => pathname(),
    () => {
      if (!routeRef || hasViewTransitions()) return;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      routeRef.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 180, easing: "ease-out" });
    },
  );

  // Canonical and social tags are absolute, so they carry the deployed origin and base.
  const pageUrl = () =>
    `${SITE_URL}${import.meta.env.BASE_URL}${pathname() === "/" ? "" : `${pathname().slice(1)}/`}`;

  useHead((): HeadTag[] => {
    const current = page();
    const title = pathname() === "/" ? "pixi-solid" : `${current?.label} · pixi-solid`;
    const description = current?.info.description;
    const url = pageUrl();
    const tags: HeadTag[] = [
      { tag: "title", props: { children: title }, key: "title" },
      { tag: "link", props: { rel: "canonical", href: url }, key: "canonical" },
      {
        tag: "meta",
        props: { property: "og:title", content: current?.label ?? "pixi-solid" },
        key: "og:title",
      },
      { tag: "meta", props: { property: "og:type", content: "article" }, key: "og:type" },
      { tag: "meta", props: { property: "og:url", content: url }, key: "og:url" },
      { tag: "meta", props: { property: "og:locale", content: "en" }, key: "og:locale" },
      {
        tag: "meta",
        props: { property: "og:site_name", content: "pixi-solid" },
        key: "og:site_name",
      },
      {
        tag: "meta",
        props: { name: "twitter:card", content: "summary_large_image" },
        key: "twitter:card",
      },
    ];

    if (description) {
      tags.push(
        { tag: "meta", props: { name: "description", content: description }, key: "description" },
        {
          tag: "meta",
          props: { property: "og:description", content: description },
          key: "og:description",
        },
      );
    }

    return tags;
  });

  // A closed drawer is off screen at narrow widths, so it must leave the tab order. The query is
  // read after mount, which keeps the server render identical for every viewport.
  onSettled(() => {
    const query = matchMedia("(max-width: 960px)");
    const update = () => setIsNarrow(query.matches);

    update();
    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  });

  // Setup and teardown of the document shortcut, returned for the owner to run.
  onSettled(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA";

      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div class={styles.shell}>
      <a class={styles.skip} href="#content">
        Skip to content
      </a>
      <Header onOpenNav={() => setNavOpen(true)} onOpenSearch={() => setSearchOpen(true)} />

      <div class={styles.body}>
        <aside
          class={[styles.aside, { [styles.open]: navOpen() }]}
          inert={isNarrow() && !navOpen() ? true : undefined}
          aria-hidden={isNarrow() && !navOpen() ? "true" : undefined}
        >
          <Sidebar currentPath={props.location.pathname} onNavigate={() => setNavOpen(false)} />
        </aside>

        <main class={styles.main} id="content" tabindex="-1">
          <div class={styles.inlineToc}>
            <TableOfContents sections={sections()} compact />
          </div>
          <div ref={routeRef} class={styles.route}>
            {props.children}
          </div>
          <Pagination currentPath={pathname()} />
        </main>

        <div class={styles.rail}>
          <TableOfContents sections={sections()} />
        </div>
      </div>

      <footer class={styles.footer}>
        <span>MIT licensed. Built with SolidJS and PixiJS.</span>
        <a href="https://github.com/LukeCarlThompson/pixi-solid" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </footer>

      <SearchDialog open={searchOpen()} onClose={() => setSearchOpen(false)} />

      <Show when={navOpen()}>
        <button
          type="button"
          class={styles.scrim}
          aria-label="Close navigation"
          onClick={() => setNavOpen(false)}
        />
      </Show>
    </div>
  );
};
