import FileSystem from 'fs'
import test from 'ava'
import { VFile } from 'vfile'

interface TestCaseConfig {
  name?: string
  input: string | VFile
  expected: string | VFile
  message?: string
}

interface TestCase {
  (config: TestCaseConfig, processor?: (input: string) => string): string
  count: number
  processor: (input: string) => string
}

function getTestCaseData(data: string | VFile): string {
  if (typeof (data) == 'string')
    return data

  return FileSystem.readFileSync(data.path).toString()
}

const testCase = <TestCase> function(config: TestCaseConfig, processor?: (input: string) => string) {
  const input = getTestCaseData(config.input)
  const expected = getTestCaseData(config.expected)
  const process = processor ?? testCase.processor
  const name = `Test Case ${++testCase.count}${config.name ? `: ${config.name}` : ''}`

  test(name, (ava) => {
    const actual = process(input)
    ava.is(actual.trim(), expected.trim(), config.message)
  })
}

testCase.count = 0
testCase.processor = input => input

export default testCase

export function fromPath(path: string): VFile {
  const result = new VFile()
  result.path = path
  return result
}
