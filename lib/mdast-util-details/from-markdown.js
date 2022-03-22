function enter(type, token, name) {
    this.enter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { type: type, name: name ?? "", attributes: {}, children: [] }, token);
}
function getDetailsAttributes(ctx) {
    return ctx.getData("detailsAttributes");
}
export const DetailsFromMarkdown = {
    enter: {
        detailsContainer(token) {
            this.setData("detailsAttributes", []);
            enter.call(this, "detailsContainer", token, "details");
        },
        detailsContainerSummary(token) {
            // pushin all the attributes for <details> tag before entering
            // <summary> tag
            const attributes = getDetailsAttributes(this);
            const cleaned = {
                symbol: "???",
                open: false,
            };
            const classes = [];
            for (const attribute of attributes) {
                if (attribute[0] === "symbol") {
                    cleaned.symbol = attribute[1];
                }
                if (attribute[0] === "class") {
                    classes.push(attribute[1]);
                }
                if (attribute[0] === "open") {
                    cleaned.open = attribute[1];
                }
            }
            if (classes.length > 0) {
                cleaned.class = classes.join(" ");
            }
            // this.setData("detailsAttributes");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const node = this.stack[this.stack.length - 1];
            node.attributes = cleaned;
            enter.call(this, "detailsContainerSummary", token, "summary");
        },
    },
    exit: {
        detailsContainer(token) {
            this.exit(token);
        },
        detailsContainerSummary(token) {
            this.exit(token);
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        detailsExpanded(token) {
            getDetailsAttributes(this).push(["open", true]);
        },
        detailsContainerClassName(token) {
            getDetailsAttributes(this).push(["class", this.sliceSerialize(token)]);
        },
        detailsContainerSequence(token) {
            getDetailsAttributes(this).push(["symbol", this.sliceSerialize(token)]);
        },
    },
};
