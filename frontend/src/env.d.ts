/// <reference types="astro/client" />
/// <reference types="@sanity/astro/module" />

// Allow importing Astro components in TypeScript
declare module '*.astro' {
  const component: any;
  export default component;
}
