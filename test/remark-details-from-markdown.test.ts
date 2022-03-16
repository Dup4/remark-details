
import { unified } from 'unified'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remark2rehype from 'remark-rehype'
import remarkDetails from '../lib/index.js'
import TestCase, { NewTestCaseConfig, TestCaseFromMarkdown } from './test-case.js'

TestCase.processor = (input: string) => {
  return unified()
    .use(remarkParse)
    .use(remarkDetails)
    .use(remark2rehype)
    .use(rehypeStringify)
    .processSync(input).value as string
}

for (let i = 1; i <= 26; ++i)
  TestCaseFromMarkdown(NewTestCaseConfig(i))
