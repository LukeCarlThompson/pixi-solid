import { pageEntries } from "./routes";

export type PageSection = { id: string; title: string };

export type PageInfo = {
  label?: string;
  description?: string;
  order?: number;
  sections?: readonly PageSection[];
};

export type NavPage = {
  path: string;
  label: string;
  info: PageInfo;
};

export type NavGroup = {
  label: string;
  pages: NavPage[];
};

const titleCase = (segment: string): string => {
  const words = segment.replace(/[-_]/g, " ").trim();

  return words.charAt(0).toUpperCase() + words.slice(1);
};

const toPage = (path: string, info: PageInfo): NavPage => {
  const leaf = path.split("/").filter(Boolean).pop() ?? "Introduction";

  return { path, label: info.label ?? titleCase(leaf), info };
};

/** The not-found page has a URL but no place in the navigation. */
const HIDDEN = new Set(["/404"]);

export const navPages: NavPage[] = pageEntries
  .filter((route) => !HIDDEN.has(route.path))
  .map((route) => toPage(route.path, route.info as PageInfo));

/** Section order and labels for the sidebar. Page membership and order still come from files. */
const SECTIONS = [
  { directory: "", label: "Overview" },
  { directory: "getting-started", label: "Getting started" },
  { directory: "components", label: "Components" },
  { directory: "events", label: "Events" },
  { directory: "asset-loading", label: "Asset loading" },
  { directory: "hooks", label: "Hooks" },
  { directory: "utils", label: "Utils" },
  { directory: "examples", label: "Examples" },
  { directory: "testing", label: "Testing" },
  { directory: "migration", label: "Migration" },
  { directory: "3d", label: "3D (Beta)" },
];

const sectionRank = (directory: string) => {
  const index = SECTIONS.findIndex((section) => section.directory === directory);
  return index === -1 ? SECTIONS.length : index;
};

export const navGroups: NavGroup[] = (() => {
  const groups = new Map<string, NavPage[]>();

  for (const page of navPages) {
    const segments = page.path.split("/").filter(Boolean);
    const directory = segments.length > 1 ? segments[0] : "";

    const list = groups.get(directory) ?? [];
    list.push(page);
    groups.set(directory, list);
  }

  return [...groups]
    .sort(([a], [b]) => sectionRank(a) - sectionRank(b))
    .map(([directory, pages]) => ({
      label:
        SECTIONS.find((section) => section.directory === directory)?.label ?? titleCase(directory),
      pages: pages.sort(
        (a, b) => (a.info.order ?? 100) - (b.info.order ?? 100) || a.path.localeCompare(b.path),
      ),
    }));
})();

export const pagesByPath = new Map(navPages.map((page) => [page.path, page]));

/** Every page in sidebar order, for previous/next navigation. */
export const orderedPages: NavPage[] = navGroups.flatMap((group) => group.pages);
