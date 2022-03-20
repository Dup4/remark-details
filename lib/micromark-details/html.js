export const detailsHtml = {
    enter: {
        detailsContainer() {
            this.tag("<details");
        },
        detailsContainerClassName() {
            this.tag(' class="');
        },
        detailsContainerSummary() {
            this.tag(">");
            this.tag("<summary>");
            this.buffer();
        },
        detailsContainerContent() {
            // this.tag('<p>');
        },
    },
    exit: {
        detailsContainer() {
            this.tag("</details>");
        },
        detailsContainerClassName(token) {
            this.tag(this.sliceSerialize(token));
            this.tag('"');
        },
        detailsContainerSummary() {
            const data = this.resume();
            this.raw(data);
            this.tag("</summary>");
        },
        detailsExpanded() {
            this.tag(" open");
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        detailsContainerFence() { },
        detailsContainerContent() {
            // this.tag('</p>');
        },
    },
};
