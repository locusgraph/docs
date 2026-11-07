import { describe, expect, it } from "vitest";
import { endpointsFor } from "../lib/api/endpoints";
import {
  activeHeaderHref,
  apiHref,
  headerBrand,
  headerLinks,
  sectionChoices,
  sidebarGroups,
  trailFor,
} from "../lib/site/docs-shell";
import { PRODUCT_INFO, PRODUCTS } from "../lib/site/products";

/**
 * The header, the sidebar, the mobile sheet and the trail all read where the
 * reader is from `lib/site/docs-shell.ts`. A wrong answer there shows up on
 * every page at once, so each rule it encodes is held here.
 */

describe("trailFor", () => {
  it("keeps the Docs root link on every page", () => {
    for (const path of ["/locusgraph", "/locusgraph/overview", "/spendgraph/sdk/errors"]) {
      expect(trailFor(path)[0]).toEqual({ label: "Docs", href: "/" });
    }
  });

  it("stops at the section on the section root", () => {
    expect(trailFor("/locusgraph")).toEqual([
      { label: "Docs", href: "/" },
      { label: "LocusGraph" },
    ]);
  });

  it("keeps the group crumb on a group's first page, without a link", () => {
    expect(trailFor("/locusgraph/client/install")).toEqual([
      { label: "Docs", href: "/" },
      { label: "LocusGraph", href: "/locusgraph" },
      { label: "Client" },
      { label: "Install" },
    ]);
  });

  it("links the group crumb on any later page of the group", () => {
    const trail = trailFor("/locusgraph/client/errors");
    expect(trail[2]).toEqual({ label: "Client", href: "/locusgraph/client/install" });
  });

  it("names the API reference as the third crumb on an endpoint page", () => {
    const endpoint = endpointsFor("locusgraph")[1];
    const trail = trailFor(`/locusgraph/api/${endpoint.slug}`);
    expect(trail[2]).toEqual({ label: "API reference", href: apiHref("locusgraph") });
    expect(trail.at(-1)).toEqual({ label: endpoint.name });
  });

  it("never links the last crumb", () => {
    for (const path of ["/locusgraph", "/locusgraph/overview", "/spendgraph/sdk/errors"]) {
      expect(trailFor(path).at(-1)?.href).toBeUndefined();
    }
  });
});

describe("sidebarGroups", () => {
  it("lists only endpoints on an API path", () => {
    const endpoints = endpointsFor("spendgraph");
    const hrefs = sidebarGroups(`/spendgraph/api/${endpoints[0].slug}`).flatMap((group) =>
      group.items.map((item) => item.href)
    );
    expect(hrefs.length).toBe(endpoints.length);
    expect(hrefs.every((href) => href.startsWith("/spendgraph/api/"))).toBe(true);
  });

  it("lists no endpoints on a guide path", () => {
    const hrefs = sidebarGroups("/spendgraph/sdk/errors").flatMap((group) =>
      group.items.map((item) => item.href)
    );
    expect(hrefs.length).toBeGreaterThan(0);
    expect(hrefs.some((href) => href.includes("/api/") && href !== apiHref("spendgraph"))).toBe(
      false
    );
  });

  it("gives every group a label", () => {
    for (const path of ["/locusgraph/overview", "/spendgraph/overview"]) {
      expect(sidebarGroups(path).every((group) => group.label.length > 0)).toBe(true);
    }
  });
});

describe("headerBrand", () => {
  it("follows the section the reader is in", () => {
    expect(headerBrand("locusgraph")).toEqual({
      name: "LocusGraph",
      href: "/locusgraph",
      product: "locusgraph",
    });
    expect(headerBrand("spendgraph")).toEqual({
      name: PRODUCT_INFO.spendgraph.title,
      href: "/spendgraph",
      product: "spendgraph",
    });
  });

  it("keeps the host brand outside a known section", () => {
    expect(headerBrand("nowhere")).toEqual({ name: "LocusGraph", href: "/" });
  });
});

describe("sectionChoices", () => {
  it("lists only the sections with ready: true", () => {
    const listed = sectionChoices("locusgraph").map((choice) => choice.product);
    expect(listed).toEqual(PRODUCTS.filter((product) => PRODUCT_INFO[product].ready));
    expect(listed).toEqual(["locusgraph", "spendgraph"]);
  });

  it("marks the section being read, and only that one", () => {
    for (const product of ["locusgraph", "spendgraph"]) {
      const current = sectionChoices(product).filter((choice) => choice.current);
      expect(current.map((choice) => choice.product)).toEqual([product]);
    }
  });

  it("carries each section's title, blurb and root", () => {
    const [locus] = sectionChoices("spendgraph");
    expect(locus).toEqual({
      product: "locusgraph",
      title: PRODUCT_INFO.locusgraph.title,
      blurb: PRODUCT_INFO.locusgraph.blurb,
      href: "/locusgraph",
      current: false,
    });
  });
});

describe("headerLinks", () => {
  it("lists only the section's own API reference", () => {
    for (const product of ["locusgraph", "spendgraph"]) {
      expect(headerLinks(product)).toEqual([{ title: "API reference", href: apiHref(product) }]);
    }
  });

  it("leaves out every section link", () => {
    const titles = headerLinks("spendgraph").map((link) => link.title);
    for (const product of PRODUCTS) {
      expect(titles).not.toContain(PRODUCT_INFO[product].title);
    }
  });

  it("is empty for a section with no API", () => {
    expect(headerLinks("nowhere")).toEqual([]);
  });
});

describe("activeHeaderHref", () => {
  it("lights the section's own API reference on an API path", () => {
    const slug = endpointsFor("spendgraph")[2].slug;
    expect(activeHeaderHref(`/spendgraph/api/${slug}`)).toBe(apiHref("spendgraph"));
    const first = endpointsFor("locusgraph")[0].slug;
    expect(activeHeaderHref(`/locusgraph/api/${first}`)).toBe(apiHref("locusgraph"));
  });

  it("lights nothing on a guide path", () => {
    expect(activeHeaderHref("/spendgraph/sdk/errors")).toBe("");
    expect(activeHeaderHref("/locusgraph")).toBe("");
  });
});
