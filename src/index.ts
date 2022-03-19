import type { Element, Node, Root } from 'hast'
import { h } from 'hastscript'
import type { Plugin, Transformer } from 'unified'
import { visit } from 'unist-util-visit'

import { DetailsFromMarkdown, DetailsToMarkdown } from './mdast-util-details/index.js'
import { syntax } from './micromark-details/index.js'

interface DetailsNode extends Node {
  name: string
  attributes: {
    open: boolean
    class?: string
  }
}

let warningIssued = false

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const remarkDetails: Plugin<[], Root, Root> = function(options = {}): Transformer<Root> {
  const data = this.data() as Record<string, unknown[] | undefined>

  // warning for old remarks
  if (
    !warningIssued
    && (
      this.Parser?.prototype?.blockTokenizers
      || this.Compiler?.prototype?.visitors
    )
  ) {
    warningIssued = true
    console.warn(
      '[remark-details] Warning: please upgrade to remark 13 to use this plugin',
    )
  }

  function add(field: string, value: unknown) {
    /* istanbul ignore if - other extensions. */
    if (data[field])
      data[field]!.push(value)
    else
      data[field] = [value]
  }

  add('micromarkExtensions', syntax)
  add('fromMarkdownExtensions', DetailsFromMarkdown)
  add('toMarkdownExtensions', DetailsToMarkdown)

  function ondetails(node: DetailsNode | any) {
    const data = node.data || (node.data = {})
    const hast = h(node.name, node.attributes) as unknown as Element

    data.hName = hast.tagName
    data.hProperties = hast.properties
  }

  function transform(tree: Root) {
    visit(tree, ['detailsContainer', 'detailsContainerSummary'], ondetails)
  }

  return transform
}

export default remarkDetails
