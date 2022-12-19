export const getText = (node: HTMLElement): string | null => {
  if (node.childNodes.length > 0) {
    return (
      Array.from(node.childNodes)
        .map((child) => getText(child as HTMLElement))
        .filter(Boolean)
        .join("\n") || null
    );
  }

  return node.textContent;
};
