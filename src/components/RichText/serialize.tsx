import React, { Fragment, JSX } from 'react'
import { CMSLink } from '@/components/Link'
import { DefaultNodeTypes, SerializedBlockNode } from '@payloadcms/richtext-lexical'

import {
  IS_BOLD,
  IS_CODE,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  IS_SUBSCRIPT,
  IS_SUPERSCRIPT,
  IS_UNDERLINE,
} from './nodeFormat'
import type { Page } from '@/payload-types'
import { FormBlock } from '@/blocks/Form/Component'
import { ColumnsBlock } from '@/blocks/ColumnsBlock/Component'
import { SubtitleBlockProps, SubtitleLexicalBlock } from '@/blocks/Lexical/Subtitle/Component'
import { CarouselBlockProps, CarouselLexicalBlock } from '@/blocks/Lexical/Carousel/Component'
import {
  CheckmarkListBlockProps,
  CheckmarkListLexicalBlock,
} from '@/blocks/Lexical/CheckmarkList/Component'

export type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<
      | Extract<Page['layout'][0], { blockType: 'formBlock' }>
      | Extract<Page['layout'][0], { blockType: 'columnsBlock' }>
      | SubtitleBlockProps
      | CarouselBlockProps
      | CheckmarkListBlockProps
    >

type Props = {
  nodes: NodeTypes[]
}

export function serializeLexical({ nodes }: Props): JSX.Element {
  const formatClasses = {
    center: 'text-center',
    left: 'text-left',
    right: 'text-right',
    justify: 'text-justify',
  }
  const headingSizeClasses = {
    h1: 'text-[2.5rem] md:text-[3.5rem] lg:text-[4rem]',
    h2: 'text-[2rem] md:text-[2.5rem] mb-4',
    h3: 'text-[1.5rem] md:text-[2rem]',
    h4: 'text-[1rem] md:text-[1.5rem]',
  }
  return (
    <Fragment>
      {nodes?.map((node, index): JSX.Element | null => {
        if (node == null) {
          return null
        }

        if (node.type === 'text') {
          let text = <React.Fragment key={index}>{node.text}</React.Fragment>
          if (node.format & IS_BOLD) {
            text = <strong key={index}>{text}</strong>
          }
          if (node.format & IS_ITALIC) {
            text = <em key={index}>{text}</em>
          }
          if (node.format & IS_STRIKETHROUGH) {
            text = (
              <span key={index} style={{ textDecoration: 'line-through' }}>
                {text}
              </span>
            )
          }
          if (node.format & IS_UNDERLINE) {
            text = (
              <span key={index} style={{ textDecoration: 'underline' }}>
                {text}
              </span>
            )
          }
          if (node.format & IS_CODE) {
            text = <code key={index}>{node.text}</code>
          }
          if (node.format & IS_SUBSCRIPT) {
            text = <sub key={index}>{text}</sub>
          }
          if (node.format & IS_SUPERSCRIPT) {
            text = <sup key={index}>{text}</sup>
          }
          if (node.style) {
            const style: React.CSSProperties = {}

            let match = node.style.match(/background-color: ([^;]+)/)
            match && (style.backgroundColor = match[1])

            match = node.style.match(/color: ([^;]+)/)
            match && (style.color = match[1])

            text = (
              <span style={style} key={index}>
                {text}
              </span>
            )
          }

          return text
        }

        // NOTE: Hacky fix for
        // https://github.com/facebook/lexical/blob/d10c4e6e55261b2fdd7d1845aed46151d0f06a8c/packages/lexical-list/src/LexicalListItemNode.ts#L133
        // which does not return checked: false (only true - i.e. there is no prop for false)
        const serializedChildrenFn = (node: NodeTypes): JSX.Element | null => {
          if (node.children == null) {
            return null
          } else {
            if (node?.type === 'list' && node?.listType === 'check') {
              for (const item of node.children) {
                if ('checked' in item) {
                  if (!item?.checked) {
                    item.checked = false
                  }
                }
              }
            }
            return serializeLexical({ nodes: node.children as NodeTypes[] })
          }
        }

        const serializedChildren = 'children' in node ? serializedChildrenFn(node) : ''

        if (node.type === 'block') {
          const block = node.fields

          const blockType = block?.blockType

          if (!block || !blockType) {
            return null
          }
          switch (blockType) {
            case 'formBlock':
              return typeof block.form !== 'number' ? (
                // @ts-ignore
                <FormBlock key={index} {...block} enableIntro={block.enableIntro || false} />
              ) : null
            case 'columnsBlock':
              return <ColumnsBlock key={index} {...block} />
            case 'subtitle':
              return <SubtitleLexicalBlock key={index} {...block} />
            case 'carousel':
              return <CarouselLexicalBlock key={index} {...block} />
            case 'checkmarkList':
              return <CheckmarkListLexicalBlock key={index} {...block} />
            default:
              return null
          }
        } else {
          switch (node.type) {
            case 'linebreak': {
              return <br className="col-start-2" key={index} />
            }
            case 'paragraph': {
              return (
                <p
                  className={`col-start-2 ${node.format && formatClasses[node.format]} mb-3`}
                  key={index}
                >
                  {serializedChildren}
                </p>
              )
            }
            case 'heading': {
              const Tag = node?.tag
              return (
                <Tag
                  className={`col-start-2 ${headingSizeClasses[Tag]} ${node.format && `${formatClasses[node.format]}`} `}
                  key={index}
                >
                  {serializedChildren}
                </Tag>
              )
            }
            case 'list': {
              const Tag = node?.tag
              return (
                <Tag className="list col-start-2" key={index}>
                  {serializedChildren}
                </Tag>
              )
            }
            case 'listitem': {
              if (node?.checked != null) {
                return (
                  <li
                    aria-checked={node.checked ? 'true' : 'false'}
                    className={` ${node.checked ? '' : ''} ${formatClasses[node.format]} `}
                    key={index}
                    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                    role="checkbox"
                    tabIndex={-1}
                    value={node?.value}
                  >
                    {serializedChildren}
                  </li>
                )
              } else {
                return (
                  <li key={index} value={node?.value}>
                    {serializedChildren}
                  </li>
                )
              }
            }
            case 'quote': {
              return (
                <blockquote className={`col-start-2 ${formatClasses[node.format]} `} key={index}>
                  {serializedChildren}
                </blockquote>
              )
            }
            case 'link': {
              const fields = node.fields

              return (
                <CMSLink
                  key={index}
                  newTab={Boolean(fields?.newTab)}
                  reference={fields.doc as any}
                  type={fields.linkType === 'internal' ? 'reference' : 'custom'}
                  url={fields.url}
                >
                  {serializedChildren}
                </CMSLink>
              )
            }

            default:
              return null
          }
        }
      })}
    </Fragment>
  )
}
