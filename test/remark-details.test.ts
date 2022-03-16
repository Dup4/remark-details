import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import FileSystem from 'fs'
import { unified } from 'unified'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remark2rehype from 'remark-rehype'
import remarkDetails from '../lib/index.js'
import testCase, { fromPath } from './test-case.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

testCase.processor = (input: string) => {
  return unified()
    .use(remarkParse)
    .use(remarkDetails)
    .use(remark2rehype)
    .use(rehypeStringify)
    .processSync(input).value as string
}

testCase({
  input: 'hello world',
  expected: '<p>hello world</p>',
  message: 'basic test',
})

testCase({
  input: '???+总结如下\n',
  expected: '<details open><summary>总结如下</summary></details>',
  message: 'no content details',
})

testCase({
  input: '???+ note 总结\n',
  expected: '<details open class="note"><summary>总结</summary></details>',
  message: 'no content details with note',
})

testCase({
  input: `???+ 总结
    how to do this`,
  expected: '<details open><summary>总结</summary><p>how to do this</p></details>',
  message: 'details without note',
})

testCase({
  input: `???+ note 总结
    how to do this`,
  expected: '<details open class="note"><summary>总结</summary><p>how to do this</p></details>',
  message: 'details with note',
})

testCase({
  input: `???+ note 总结
    how to do this
    how to do that`,
  expected: `<details open class="note"><summary>总结</summary><p>how to do this
how to do that</p></details>`,
  message: 'details with note',
})

testCase({
  input: `???+ note 总结
    to be or not to be
    that is the question

but now it is not`,
  expected: `<details open class="note"><summary>总结</summary><p>to be or not to be
that is the question</p></details>
<p>but now it is not</p>`,
  message: 'details with note',
})

testCase({
  input: `???+ note 总结
    to be or not to be
    that is the question

but now it is not`,
  expected: `<details open class="note"><summary>总结</summary><p>to be or not to be
that is the question</p></details>
<p>but now it is not</p>`,
  message: 'details with note',
})

testCase({
  input: `???+ warning 总结
    The sunlight claps the earth,
    and the moonbeams kiss the sea:
    what are all these kissings worth,
    \`\`\`cpp
    for (int i = 0; i <= 100; i++) {
        cout << "if thou kiss not me?" << endl;
    }
    \`\`\`

if not me, who`,
  expected: `<details open class="warning"><summary>总结</summary><p>The sunlight claps the earth,
and the moonbeams kiss the sea:
what are all these kissings worth,</p><pre><code class="language-cpp">for (int i = 0; i &#x3C;= 100; i++) {
    cout &#x3C;&#x3C; "if thou kiss not me?" &#x3C;&#x3C; endl;
}
</code></pre></details>
<p>if not me, who</p>`,
  message: 'details with note and code',
})

testCase({
  input: `???+ note 总结
    > I have drunken deep of joy,
    And I will taste no other wine tonight

thats it`,
  expected: `<details open class="note"><summary>总结</summary><blockquote>
<p>I have drunken deep of joy,
And I will taste no other wine tonight</p>
</blockquote></details>
<p>thats it</p>`,
  message: 'details with note and blockquote',
})

testCase({
  input: `???+ warning \`warning\`
    write something here`,
  expected: '<details open class="warning"><summary><code>warning</code></summary><p>write something here</p></details>',
  message: '',
})

for (let i = 1; i <= 15; ++i) {
  const inputFilePath = path.join(__dirname, '..', `test/input/${i}.md`)
  const expectedFilePath = path.join(__dirname, '..', `test/expected/${i}.html`)

  testCase({
    input: fromPath(inputFilePath),
    expected: FileSystem.existsSync(expectedFilePath) ? fromPath(expectedFilePath) : '',
    message: 'details with many codes',
  })
}
