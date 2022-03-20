import { markdownSpace } from "micromark-util-character";
import type { State, Tokenizer } from "micromark-util-types";

const detailsClassList = [
  "note",
  "abstract",
  "summary",
  "tldr",
  "info",
  "todo",
  "tip",
  "hint",
  "important",
  "success",
  "check",
  "done",
  "question",
  "help",
  "faq",
  "warning",
  "caution",
  "attention",
  "failure",
  "fail",
  "missing",
  "danger",
  "error",
  "bug",
  "example",
  "quote",
  "cite",
];

const detailsClassNums = detailsClassList.length;

export const factoryDetailsClass: Tokenizer = function (effects, ok, nok) {
  const findIx = Array(detailsClassList.length).fill(0);
  let preCompleteMatch = false;

  const findClassName: State = function (code) {
    if (preCompleteMatch) {
      if (markdownSpace(code)) {
        effects.exit("detailsContainerClassName");
        return ok(code);
      }
    }

    preCompleteMatch = false;

    let okCnt = 0;
    for (let i = 0; i < detailsClassNums; i++) {
      const len = detailsClassList[i].length;
      if (findIx[i] < 0 || findIx[i] >= len) {
        continue;
      }

      if (
        detailsClassList[i][findIx[i]] === String.fromCharCode(code as number)
      ) {
        ++okCnt;
        ++findIx[i];
        if (findIx[i] == len) {
          preCompleteMatch = true;
        }
      } else {
        findIx[i] = -1;
      }
    }

    if (okCnt == 0) {
      return nok(code);
    }

    effects.consume(code);
    return findClassName;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (code) => {
    effects.enter("detailsContainerClassName");
    return findClassName;
  };
};
