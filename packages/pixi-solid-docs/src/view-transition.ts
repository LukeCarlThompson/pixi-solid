import { useNavigate } from "@solidjs/router";
import { onSettled } from "solid-js";

/**
 * Cross-fades route content with the View Transitions API. Browsers without it keep the plain
 * navigation path, so this only ever adds an animation.
 *
 * The router's own click handler skips prevented events, so preventing here prevents a double
 * navigation rather than racing it.
 */
export const installViewTransitions = (): void => {
  const navigate = useNavigate();

  onSettled(() => {
    if (typeof document.startViewTransition !== "function") return;

    const base = import.meta.env.BASE_URL.replace(/\/$/, "");

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) return;

      const anchor = event
        .composedPath()
        .find((node): node is HTMLAnchorElement => node instanceof HTMLAnchorElement);
      if (!anchor || anchor.target || anchor.hasAttribute("download")) return;

      const rel = (anchor.getAttribute("rel") ?? "").split(/\s+/);
      if (rel.includes("external")) return;

      const url = new URL(anchor.href, document.baseURI);
      if (url.origin !== location.origin || !url.pathname.startsWith(base)) return;
      if (url.pathname === location.pathname && url.search === location.search) return;

      event.preventDefault();
      // A leading slash is a full document path to the router, so the base stays on.
      document.startViewTransition(() => {
        navigate(url.pathname + url.search + url.hash);
      });
    };

    document.addEventListener("click", onClick, true);

    return () => document.removeEventListener("click", onClick, true);
  });
};
