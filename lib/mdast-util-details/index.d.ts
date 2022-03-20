import type { Extension } from "mdast-util-from-markdown/lib";
export declare const DetailsFromMarkdown: Extension;
export declare const DetailsToMarkdown: {
    unsafe: never[];
    handlers: {
        detailsContainer: () => string;
        detailsContainerSummary: () => string;
    };
};
