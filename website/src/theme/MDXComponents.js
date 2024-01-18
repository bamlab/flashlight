/* eslint-disable import/no-unresolved */
import React from "react";
// Import the original mapper
import MDXComponents from "@theme-original/MDXComponents";
import Contact from "@site/src/components/Contact.mdx";

const _module = {
  // Re-use the default mapping
  ...MDXComponents,
  // Map the "<Highlight>" tag to our Highlight component
  // `Highlight` will receive all props that were passed to `<Highlight>` in MDX
  Contact,
};

export default _module;
