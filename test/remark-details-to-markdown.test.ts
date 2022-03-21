/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import remarkStringify from "remark-stringify";
import remarkParse from "remark-parse";
import remarkDetails from "../lib/index.js";
import { unified } from "unified";
import { fileURLToPath } from "url";
import { basename } from "path";
import TestCase, {
  NewTestCaseConfig,
  TestCaseFromMarkdown,
  TestCaseToMarkdown,
} from "./test-case.js";

const __filename = fileURLToPath(import.meta.url);
const __basename = basename(__filename);

TestCase.namePrefix = __basename.replace(/\./g, "-");

const mdStringify = (input: string) =>
  unified()
    .use(remarkParse)
    .use(remarkDetails)
    .use(remarkStringify)
    .processSync(input).value as string;

TestCase.processor = (input: string) => mdStringify(input);

for (let i = 26; i <= 27; i++) {
  TestCaseToMarkdown(NewTestCaseConfig(i));
}
