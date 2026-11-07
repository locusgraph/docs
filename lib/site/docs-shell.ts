import { endpointBySlug, endpointsFor, groupsFor } from "@/lib/api/endpoints";
import { pagesOf, productOf, treeFor, treesFor } from "@/lib/site/docs-nav";
import { isProduct, PRODUCT_INFO, PRODUCTS, type Product } from "@/lib/site/products";

/**
 * What the LocusGraph docs shell is handed, worked out from the path.
 *
 * The header, the sidebar, the mobile sheet and the trail all read the same
 * three things: which section this is, whether it is the API reference, and
 * which page. Keeping them here means the four never disagree about where the
 * reader is, and none of it needs a component to test.
 */

export interface NavItem {
  title: string;
  href: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export interface Crumb {
  label: string;
  href?: string;
}

export function isApiPath(pathname: string): boolean {
  return pathname.includes("/api/");
}

/** The first endpoint's page, which is where "API reference" goes. */
export function apiHref(product: string): string | undefined {
  const first = endpointsFor(product)[0];
  return first ? `/${product}/api/${first.slug}` : undefined;
}

/**
 * The header's brand: the section's own mark and name, linking to the section
 * root. Inside a section the reader is reading one product, so the header says
 * which. A path outside any known section keeps the host's brand.
 */
export interface HeaderBrand {
  name: string;
  href: string;
  product?: Product;
}

export function headerBrand(product: string): HeaderBrand {
  if (!isProduct(product)) return { name: "LocusGraph", href: "/" };
  return { name: PRODUCT_INFO[product].title, href: `/${product}`, product };
}

/** One row of the section switcher the header brand opens. */
export interface SectionChoice {
  product: Product;
  title: string;
  blurb: string;
  href: string;
  current: boolean;
}

/**
 * What the header brand offers to switch to: every section with `ready: true`,
 * in the order `PRODUCTS` lists them, with the one being read marked. A section
 * that is not ready stays out, the same as it stays off the host index.
 */
export function sectionChoices(current: string): SectionChoice[] {
  return PRODUCTS.filter((key) => PRODUCT_INFO[key].ready).map((key) => ({
    product: key,
    title: PRODUCT_INFO[key].title,
    blurb: PRODUCT_INFO[key].blurb,
    href: `/${key}`,
    current: key === current,
  }));
}

/**
 * The header's links: the section's own API reference, when it has one.
 * Moving between sections goes through the host index, which the brand on the
 * host pages and the "Docs" crumb both lead back to.
 */
export function headerLinks(product: string): NavItem[] {
  const api = apiHref(product);
  return api ? [{ title: "API reference", href: api }] : [];
}

/**
 * Which header link is lit. Exact match, because that is how the shell
 * compares. Off the API reference nothing is lit, so the empty string.
 */
export function activeHeaderHref(pathname: string): string {
  if (!isApiPath(pathname)) return "";
  return apiHref(productOf(pathname)) ?? "";
}

/**
 * The sidebar for a path.
 *
 * Guides get one group per tree. A tree with no title is the section's own
 * pages, so it borrows the name of its first section rather than repeating the
 * product name the header already shows.
 *
 * The API reference lists endpoints only, grouped by the resource they act on.
 * Thirty-seven endpoints beside the guides would bury the written pages, so
 * the two never share a sidebar.
 */
export function sidebarGroups(pathname: string): NavGroup[] {
  const product = productOf(pathname);

  if (isApiPath(pathname)) {
    const endpoints = endpointsFor(product);
    return groupsFor(product).map((group) => ({
      label: group,
      items: endpoints
        .filter((endpoint) => endpoint.group === group)
        .map((endpoint) => ({
          title: endpoint.name,
          href: `/${product}/api/${endpoint.slug}`,
        })),
    }));
  }

  const fallback = isProduct(product) ? PRODUCT_INFO[product].title : "Docs";
  return treesFor(product).map((tree) => ({
    label: tree.title || tree.sections[0]?.title || fallback,
    items: pagesOf(tree).map(({ title, href }) => ({ title, href })),
  }));
}

/**
 * The trail from the host index down to the page.
 *
 * Every level is a link except the last, which is where you are. On an API page
 * the third level is "API reference" rather than the endpoint's resource group:
 * `Memories` and `Contexts` group the sidebar and have no page of their own,
 * and a crumb that goes nowhere is worse than one less crumb.
 *
 * The group crumb is kept even when its own href is this page, so the first
 * page of a group does not lose a level the others have. Its link is dropped
 * instead, because a link to the page you are on does nothing.
 */
export function trailFor(pathname: string): Crumb[] {
  const product = productOf(pathname);
  const info = isProduct(product) ? PRODUCT_INFO[product] : undefined;
  if (pathname === `/${product}`) {
    return [{ label: "Docs", href: "/" }, { label: info?.title ?? "Docs" }];
  }
  const tree = treeFor(pathname);
  const page = tree ? pagesOf(tree).find((item) => item.href === pathname) : undefined;
  const endpoint = isApiPath(pathname)
    ? endpointBySlug(product, pathname.split("/api/")[1] ?? "")
    : undefined;

  const group = endpoint
    ? { label: "API reference", href: apiHref(product) }
    : tree?.title
      ? { label: tree.title, href: tree.href }
      : undefined;

  const trail: Crumb[] = [
    { label: "Docs", href: "/" },
    ...(info ? [{ label: info.title, href: `/${product}` }] : []),
    ...(group ? [group.href === pathname ? { label: group.label } : group] : []),
    { label: endpoint?.name ?? page?.title ?? info?.title ?? "Docs" },
  ];

  return trail.map((crumb, i) => (i === trail.length - 1 ? { label: crumb.label } : crumb));
}
