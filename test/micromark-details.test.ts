import { micromark } from 'micromark'
import { detailsHtml as html, syntax } from '../lib/micromark-details/index.js'
import TestCase, { NewTestCaseConfig, TestCaseFromMarkdown } from './test-case.js'

TestCase.processor = (input: string) => {
  return micromark(input, {
    extensions: [syntax],
    htmlExtensions: [html as any],
  })
}

TestCaseFromMarkdown({
  markdown: 'hello world',
  html: '<p>hello world</p>',
  message: 'basic test',
})

TestCaseFromMarkdown({
  markdown: '???+总结如下\n',
  html: '<details open><summary>总结如下</summary>\n</details>',
  message: 'no content details',
})

TestCaseFromMarkdown({
  markdown: '???+ note 总结\n',
  html: '<details open class="note"><summary>总结</summary>\n</details>',
  message: 'no content details with note',
})

TestCaseFromMarkdown({
  markdown: '???+ warning 总结\n',
  html: '<details open class="warning"><summary>总结</summary>\n</details>',
  message: 'no content details with warning',
})
