/* eslint-disable import/no-unresolved */
import MDXComponents from "@theme-original/MDXComponents";
import Contact from "@site/src/components/Contact.mdx";
import Install from "@site/src/components/Install.mdx";
import { Video } from "@site/src/components/Video";

const _module = {
  ...MDXComponents,
  Contact,
  Install,
  Video,
};

export default _module;
