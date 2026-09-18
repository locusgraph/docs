import type { ComponentType } from "react";

/** What a doc module hands back: the prose, and the summary it carries. */
export interface DocModule {
  default: ComponentType;
  meta: { title: string; description: string };
}
