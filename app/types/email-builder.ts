import type { Component } from 'vue'
import type { z } from 'zod'

export type BlockType =
  | 'Avatar'
  | 'Button'
  | 'Container'
  | 'ColumnsContainer'
  | 'Divider'
  | 'Heading'
  | 'Html'
  | 'Image'
  | 'Repeater'
  | 'Spacer'
  | 'Text'
  | 'EmailLayout'

export interface TEditorBlock {
  type: BlockType
  data: Record<string, unknown>
}

export type TEditorDocument = Record<string, TEditorBlock>

export interface BlockDefinition {
  schema: z.ZodType
  component: Component
}

export type BlockDictionary = Record<BlockType, BlockDefinition>

export interface EmailTemplateListItem {
  Id: number
  Name: string
  Description: string | null
}

export interface EmailTemplateRecord {
  Id: number
  Name: string
  Description: string | null
  SubjectEn: string
  SubjectFr: string
  HtmlEn: string | null
  HtmlFr: string | null
  JsonEn: TEditorDocument | null
  JsonFr: TEditorDocument | null
  PlainTextEn: string | null
  PlainTextFr: string | null
}
