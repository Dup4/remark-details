import { h } from "hastscript";
import { visit } from "unist-util-visit";
import { DetailsFromMarkdown, DetailsToMarkdown, } from "./mdast-util-details/index.js";
import { syntax } from "./micromark-details/index.js";
let warningIssued = false;
const remarkDetails = function (
// eslint-disable-next-line @typescript-eslint/no-unused-vars
options = {}) {
    const data = this.data();
    // warning for old remarks
    if (!warningIssued &&
        (this.Parser?.prototype?.blockTokenizers ||
            this.Compiler?.prototype?.visitors)) {
        warningIssued = true;
        console.warn("[remark-details] Warning: please upgrade to remark 13 to use this plugin");
    }
    function add(field, value) {
        if (data[field]) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            data[field].push(value);
        }
        else {
            data[field] = [value];
        }
    }
    add("micromarkExtensions", syntax);
    add("fromMarkdownExtensions", DetailsFromMarkdown);
    add("toMarkdownExtensions", DetailsToMarkdown);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function ondetails(node) {
        const data = node.data || (node.data = {});
        const hast = h(node.name, node.attributes);
        data.hName = hast.tagName;
        data.hProperties = hast.properties;
    }
    function transform(tree) {
        visit(tree, ["detailsContainer", "detailsContainerSummary"], ondetails);
    }
    return transform;
};
export default remarkDetails;
