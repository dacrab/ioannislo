/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="@astrojs/react/client" />

declare module '*.astro' {
  const Component: any;
  export default Component;
}
