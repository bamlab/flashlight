// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

/* eslint-disable import/no-unresolved */
import { themes } from "prism-react-renderer";

const googleFonts = [
  {
    tagName: "link",
    attributes: {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    },
  },
  {
    tagName: "link",
    attributes: {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossorigin: "anonymous",
    },
  },
  {
    tagName: "link",
    attributes: {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap",
    },
  },
];

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Flashlight",
  tagline: "Get a performance score for your app",
  favicon: "img/favicon.png",
  url: "https://flashlight.dev",
  baseUrl: "/",
  organizationName: "bamlab",
  projectName: "flashlight",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          routeBasePath: "/",
          editUrl: "https://github.com/bamlab/flashlight/tree/main/website",
        },
        blog: {
          showReadingTime: true,
          editUrl: "https://github.com/bamlab/flashlight/tree/main/website",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  headTags: [...googleFonts],
  scripts: [
    {
      src: "https://plausible.io/js/script.js",
      defer: true,
      "data-domain": "docs.flashlight.dev",
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: "img/social.png",
      navbar: {
        title: "",
        logo: {
          href: "https://flashlight.dev",
          alt: "Flashlight",
          src: "img/logo.svg",
        },
        items: [
          {
            type: "doc",
            docId: "index",
            position: "left",
            label: "Docs",
          },
          {
            href: "https://github.com/bamlab/flashlight",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      algolia: {
        appId: "3D4CC5GWMG",
        apiKey: "5ecf93c51d34a00ef9b84a90a49cf431",
        indexName: "flashlight",
      },
      footer: {
        style: "dark",
        links: [
          {
            label: "Website",
            href: "https://flashlight.dev",
          },
          {
            label: "GitHub",
            href: "https://github.com/bamlab/flashlight",
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} BAM. Built with Docusaurus.`,
      },

      prism: {
        darkTheme: themes.vsDark,
      },

      // forceDarkMode: true,
      // darkMode: true,
      colorMode: {
        // "light" | "dark"
        defaultMode: "dark",

        // Hides the switch in the navbar
        // Useful if you want to support a single color mode
        disableSwitch: true,
      },
    }),
};

module.exports = config;
