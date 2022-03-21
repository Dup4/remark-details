import type { Options as ToMarkdownExtension } from "mdast-util-to-markdown/lib/types";
import { track } from "mdast-util-to-markdown/lib/util/track.js";
import { containerPhrasing } from "mdast-util-to-markdown/lib/util/container-phrasing.js";
import { containerFlow } from "mdast-util-to-markdown/lib/util/container-flow.js";
import { indentLines } from "mdast-util-to-markdown/lib/util/indent-lines.js";
import { Node } from "unist";
import { Parent, Content } from "mdast";

interface DetailsAttributes {
  open: boolean;
  symbol: string;
  class?: string;
}

interface DetailsContainerNode extends Node {
  type: "detailsContainer";
  attributes: DetailsAttributes;
  children: Array<Content | detailsContainerSummaryNode>;
}

interface detailsContainerSummaryNode extends Node, Parent {
  type: "detailsContainerSummary";
}

export const DetailsToMarkdown: ToMarkdownExtension = {
  unsafe: [],
  handlers: {
    detailsContainer: (
      node: DetailsContainerNode,
      parent,
      context,
      safeOptions
    ) => {
      const indexStack = context.indexStack;
      const attributes = node.attributes;
      const children = node.children || [];
      const tracker = track(safeOptions);

      let value = tracker.move(attributes.symbol);

      if (attributes.symbol !== "!!!" && attributes.open) {
        value += tracker.move("+");
      }

      if (attributes?.class && attributes?.class.length > 0) {
        value += tracker.move(" ");
        value += tracker.move(attributes.class);
      }

      if (children.length > 0) {
        const index = 0;
        const child = children[index];

        if (child.type === "detailsContainerSummary") {
          indexStack.push(index);
          value += tracker.move(" ");
          value += tracker.move(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            context.handle(child, node as any, context, {
              before: "",
              after: "",
              ...tracker.current(),
            })
          );
          children.shift();
          indexStack.pop();
        }
      }

      value += tracker.move("\n");

      const subValue = indentLines(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        containerFlow(node as any, context, safeOptions),
        map
      );

      return value + subValue;
    },
    detailsContainerSummary: (
      node: detailsContainerSummaryNode,
      parent,
      context,
      safeOptions
    ) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const value = containerPhrasing(node as any, context, safeOptions);
      return value;
    },
  },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function map(line, index, blank) {
  return "    " + line;
}
