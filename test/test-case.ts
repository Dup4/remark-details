import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import FileSystem from 'fs'
import test from 'ava'
import type { VFile } from 'vfile'
import { readSync } from 'to-vfile'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

interface TestCaseConfig {
  name?: string
  html: string | VFile
  markdown: string | VFile
  message?: string
}

enum TestMode {
  FromMarkdown,
  ToMarkdown,
}

type ProcessorType = (input: string) => string

interface ITestCase {
  (config: TestCaseConfig, mode: TestMode, processor?: ProcessorType): void
  count: number
  processor: ProcessorType
}

class TestData {
  private static dataPath = path.join(__dirname, '..', 'test', 'data')

  private static getDataPath(idx: number): string {
    return path.join(this.dataPath, String(idx))
  }

  private static getMarkdownFilePath(idx: number): string {
    return path.join(this.getDataPath(idx), 'markdown.md')
  }

  private static getHTMLFilePath(idx: number): string {
    return path.join(this.getDataPath(idx), 'html.html')
  }

  private static getMessageFilePath(idx: number): string {
    return path.join(this.getDataPath(idx), 'message.md')
  }

  private static fromPathIfExists(path: string): string {
    return FileSystem.existsSync(path) ? readSync(path).toString() : ''
  }

  public static GetMarkdown(idx: number): string {
    return this.fromPathIfExists(this.getMarkdownFilePath(idx))
  }

  public static GetHTML(idx: number): string {
    return this.fromPathIfExists(this.getHTMLFilePath(idx))
  }

  public static GetMessage(idx: number): string {
    const message = this.fromPathIfExists(this.getMessageFilePath(idx))
    if (message.length === 0)
      return 'details with many codes'

    return message
  }
}

const NewTestCaseConfig = function(idx: number): TestCaseConfig {
  return {
    markdown: TestData.GetMarkdown(idx),
    html: TestData.GetHTML(idx),
    message: TestData.GetMarkdown(idx),
  }
}

const TestCase = <ITestCase> function(config: TestCaseConfig, mode: TestMode, processor?: ProcessorType) {
  const getTestCaseData = (data: string | VFile): string => {
    if (typeof (data) == 'string')
      return data

    return data.value.toString()
  }

  const html = getTestCaseData(config.html)
  const markdown = getTestCaseData(config.markdown)
  const process = processor ?? TestCase.processor
  const name = config.name ?? `Test Case ${++TestCase.count}${config.name ? `: ${config.name}` : ''}`

  test(name, (ava) => {
    let input = ''
    let expected = ''

    if (mode === TestMode.FromMarkdown) {
      input = markdown
      expected = html
    }
    else if (mode === TestMode.ToMarkdown) {
      input = html
      expected = markdown
    }

    const actual = process(input)
    ava.is(actual.trim(), expected.trim(), config.message)
  })
}

TestCase.count = 0
TestCase.processor = input => input

const TestCaseFromMarkdown = function(config: TestCaseConfig, processor?: ProcessorType) {
  TestCase(config, TestMode.FromMarkdown, processor)
}

const TestCaseToMarkdown = function(config: TestCaseConfig, processor?: ProcessorType) {
  TestCase(config, TestMode.ToMarkdown, processor)
}

export default TestCase
export { TestCaseFromMarkdown, TestCaseToMarkdown, NewTestCaseConfig }
