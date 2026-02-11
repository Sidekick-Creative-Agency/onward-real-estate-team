import { $getRoot, $getSelection, SerializedEditorState } from 'lexical'
import { createHeadlessEditor } from '@lexical/headless'
import { $generateNodesFromDOM } from '@lexical/html'
import { JSDOM } from 'jsdom'

export const serializeString = (input: string | undefined) => {
  if (!input) return undefined
  const editorNodes = []
  const editor = createHeadlessEditor({ nodes: editorNodes })
  editor.update(
    () => {
      const dom = new JSDOM(input)
      const nodes = $generateNodesFromDOM(editor, dom.window.document)
      $getRoot().select()
      $getSelection()?.insertNodes(nodes)
    },
    { discrete: true },
  )
  return editor.getEditorState().toJSON()
}
