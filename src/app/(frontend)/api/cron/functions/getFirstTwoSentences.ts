export const getFirstTwoSentences = (text: string | undefined) => {
  if (!text) return undefined
  const sentences = text.split(/(?<=[.?!])\s+/)
  return sentences.length >= 2 ? sentences.slice(0, 2).join(' ') : text
}
