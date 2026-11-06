import { describe, expect, it } from "vitest";
import { endpointsFor } from "../lib/api/endpoints";
import {
  activeHeaderHref,
  apiHref,
  headerLinks,
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

describe("headerLinks", () => {
  it("leaves out every section with ready: false", () => {
    const titles = headerLinks("locusgraph").map((link) => link.title);
    for (const product of PRODUCTS) {
      const { title, ready } = PRODUCT_INFO[product];
      expect(titles.includes(title)).toBe(ready);
    }
  });

  it("adds the API reference for a section that has one", () => {
    expect(headerLinks("locusgraph").at(-1)).toEqual({
      title: "API reference",
      href: apiHref("locusgraph"),
    });
  });
});

describe("activeHeaderHref", () => {
  it("lights the API reference on an API path", () => {
    const slug = endpointsFor("spendgraph")[2].slug;
    expect(activeHeaderHref(`/spendgraph/api/${slug}`)).toBe(apiHref("spendgraph"));
  });

  it("lights the section on a guide path", () => {
    expect(activeHeaderHref("/spendgraph/sdk/errors")).toBe("/spendgraph");
  });
});
