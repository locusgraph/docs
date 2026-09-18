/**
 * A doc that lives in a package exports its own summary.
 *
 * `@types/mdx` declares only the default export, which is the component. The
 * pages under `app/docs` wrap that summary with the route's path — so the title
 * and description stay beside the prose they describe rather than in the app.
 */
declare module "*.mdx" {
  export const meta: { title: string; description: string };
}
