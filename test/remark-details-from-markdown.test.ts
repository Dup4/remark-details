
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

TestCaseFromMarkdown({
  markdown: 'hello world',
  html: '<p>hello world</p>',
  message: 'basic test',
})

TestCaseFromMarkdown({
  markdown: '???+总结如下\n',
  html: '<details open><summary>总结如下</summary></details>',
  message: 'no content details',
})

TestCaseFromMarkdown({
  markdown: '???+ note 总结\n',
  html: '<details open class="note"><summary>总结</summary></details>',
  message: 'no content details with note',
})

TestCaseFromMarkdown({
  markdown: `???+ 总结
    how to do this`,
  html: '<details open><summary>总结</summary><p>how to do this</p></details>',
  message: 'details without note',
})

TestCaseFromMarkdown({
  markdown: `???+ note 总结
    how to do this`,
  html: '<details open class="note"><summary>总结</summary><p>how to do this</p></details>',
  message: 'details with note',
})

TestCaseFromMarkdown({
  markdown: `???+ note 总结
    how to do this
    how to do that`,
  html: `<details open class="note"><summary>总结</summary><p>how to do this
how to do that</p></details>`,
  message: 'details with note',
})

TestCaseFromMarkdown({
  markdown: `???+ note 总结
    to be or not to be
    that is the question

but now it is not`,
  html: `<details open class="note"><summary>总结</summary><p>to be or not to be
that is the question</p></details>
<p>but now it is not</p>`,
  message: 'details with note',
})

TestCaseFromMarkdown({
  markdown: `???+ note 总结
    to be or not to be
    that is the question

but now it is not`,
  html: `<details open class="note"><summary>总结</summary><p>to be or not to be
that is the question</p></details>
<p>but now it is not</p>`,
  message: 'details with note',
})

TestCaseFromMarkdown({
  markdown: `???+ warning 总结
    The sunlight claps the earth,
    and the moonbeams kiss the sea:
    what are all these kissings worth,
    \`\`\`cpp
    for (int i = 0; i <= 100; i++) {
        cout << "if thou kiss not me?" << endl;
    }
    \`\`\`

if not me, who`,
  html: `<details open class="warning"><summary>总结</summary><p>The sunlight claps the earth,
and the moonbeams kiss the sea:
what are all these kissings worth,</p><pre><code class="language-cpp">for (int i = 0; i &#x3C;= 100; i++) {
    cout &#x3C;&#x3C; "if thou kiss not me?" &#x3C;&#x3C; endl;
}
</code></pre></details>
<p>if not me, who</p>`,
  message: 'details with note and code',
})

TestCaseFromMarkdown({
  markdown: `???+ note 总结
    > I have drunken deep of joy,
    And I will taste no other wine tonight

thats it`,
  html: `<details open class="note"><summary>总结</summary><blockquote>
<p>I have drunken deep of joy,
And I will taste no other wine tonight</p>
</blockquote></details>
<p>thats it</p>`,
  message: 'details with note and blockquote',
})

TestCaseFromMarkdown({
  markdown: `???+ warning \`warning\`
    write something here`,
  html: '<details open class="warning"><summary><code>warning</code></summary><p>write something here</p></details>',
  message: '',
})

for (let i = 1; i <= 15; ++i)
  TestCaseFromMarkdown(NewTestCaseConfig(i))
