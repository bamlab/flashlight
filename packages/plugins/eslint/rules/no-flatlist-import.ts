// eslint-disable-next-line import/no-unresolved
import { ESLintUtils } from "@typescript-eslint/utils";

type MessageId = "no-flatlist-import";

type Options = [];

const createRule = ESLintUtils.RuleCreator((name) => `https://flashlight.dev/rule/${name}`);

export const rule = createRule<Options, MessageId>({
  name: "no-flatlist-import",
  defaultOptions: [],
  create(context) {
    return {
      ImportDeclaration(node) {
        const { specifiers, source } = node;
        if (
          source.value === "react-native" &&
          specifiers.some(
            (specifier) =>
              specifier.local.name === "FlatList" || specifier.local.name === "SectionList"
          )
        ) {
          context.report({
            node,
            messageId: `no-flatlist-import`,
          });
        }
      },
    };
  },
  meta: {
    docs: {
      description: "RN FlatList & SectionList should not be used",
      recommended: "error",
    },
    messages: {
      "no-flatlist-import": `Avoid using FlatList or SectionList as it's performance heavy in your app rendering. It can be visible on moderately long lists during fast scrolling with white items instead of your list's elements.
We recommend to use Flashlist instead for high performance list rendering.
However, if your app supports Right-To-Left languages (Arabic, Hebrew etc), you will have render issues. You might want to try RecyclerListView instead for better performances still.

See Flashlist : https://github.com/Shopify/flash-list
See RTL languages issues : (Flashlist) https://github.com/Shopify/flash-list/issues/544, (FlatList) https://github.com/facebook/react-native/issues/19150
See RecyclerListView : https://github.com/Flipkart/recyclerlistview`,
    },
    type: "suggestion",
    schema: [],
  },
});
