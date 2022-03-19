import { markdownLineEnding } from 'micromark-util-character'
import { constants } from 'micromark-util-symbol/constants.js'
import { types } from 'micromark-util-symbol/types.js'
import type { Code, Effects, State } from 'micromark-util-types'

export function factorySummary(
  effects: Effects,
  ok: State,
  nok: State,
  type: string,
): State {
  function summary(code: Code) {
    if (!markdownLineEnding(code)) {
      effects.consume(code)
      return summary
    }
    effects.exit(types.chunkText)
    effects.exit(type)
    return ok(code)
  }

  return (code) => {
    if (!markdownLineEnding(code)) {
      effects.enter(type)
      effects.enter(types.chunkText, {
        contentType: constants.contentTypeText,
      })
      effects.consume(code)
      return summary
    }
    return nok(code)
  }
}

export const chineseOrEnglish = /[0-9A-Za-z\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|[\uD86A-\uD86C][\uDC00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D]/
