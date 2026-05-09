import { z } from 'zod'
import { COLOR_SCHEMA, PADDING_SCHEMA } from './style-schemas'
import { FONT_FAMILY_SCHEMA } from './font-families'

// ── Avatar ──────────────────────────────────────────────────────────────────
export const AvatarPropsSchema = z.object({
  style: z
    .object({
      textAlign: z.enum(['left', 'center', 'right']).optional().nullable(),
      padding: PADDING_SCHEMA,
    })
    .optional()
    .nullable(),
  props: z
    .object({
      size: z.number().gt(0).optional().nullable(),
      shape: z.enum(['circle', 'square', 'rounded']).optional().nullable(),
      imageUrl: z.string().optional().nullable(),
      alt: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
})
export type AvatarProps = z.infer<typeof AvatarPropsSchema>
export const AvatarPropsDefaults = { size: 64, imageUrl: '', alt: '', shape: 'square' as const }

// ── Button ──────────────────────────────────────────────────────────────────
export const ButtonPropsSchema = z.object({
  style: z
    .object({
      backgroundColor: COLOR_SCHEMA,
      fontSize: z.number().min(0).optional().nullable(),
      fontFamily: FONT_FAMILY_SCHEMA,
      fontWeight: z.enum(['bold', 'normal']).optional().nullable(),
      textAlign: z.enum(['left', 'center', 'right']).optional().nullable(),
      padding: PADDING_SCHEMA,
    })
    .optional()
    .nullable(),
  props: z
    .object({
      buttonBackgroundColor: COLOR_SCHEMA,
      buttonStyle: z.enum(['rectangle', 'pill', 'rounded']).optional().nullable(),
      buttonTextColor: COLOR_SCHEMA,
      fullWidth: z.boolean().optional().nullable(),
      size: z.enum(['x-small', 'small', 'large', 'medium']).optional().nullable(),
      text: z.string().optional().nullable(),
      url: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
})
export type ButtonProps = z.infer<typeof ButtonPropsSchema>
export const ButtonPropsDefaults = {
  text: '',
  url: '',
  fullWidth: false,
  size: 'medium' as const,
  buttonStyle: 'rounded' as const,
  buttonTextColor: '#FFFFFF',
  buttonBackgroundColor: '#999999',
}

// ── Container ───────────────────────────────────────────────────────────────
export const ContainerPropsSchema = z.object({
  style: z
    .object({
      backgroundColor: COLOR_SCHEMA,
      borderColor: COLOR_SCHEMA,
      borderRadius: z.number().optional().nullable(),
      padding: PADDING_SCHEMA,
    })
    .optional()
    .nullable(),
  props: z
    .object({
      childrenIds: z.array(z.string()).optional().nullable(),
    })
    .optional()
    .nullable(),
})
export type ContainerProps = z.infer<typeof ContainerPropsSchema>

// ── ColumnsContainer ────────────────────────────────────────────────────────
export const ColumnsContainerPropsSchema = z.object({
  style: z
    .object({
      backgroundColor: COLOR_SCHEMA,
      padding: PADDING_SCHEMA,
    })
    .optional()
    .nullable(),
  props: z
    .object({
      fixedWidths: z
        .tuple([z.number().nullish(), z.number().nullish(), z.number().nullish()])
        .optional()
        .nullable(),
      columnsCount: z.union([z.literal(2), z.literal(3)]).optional().nullable(),
      columnsGap: z.number().optional().nullable(),
      contentAlignment: z.enum(['top', 'middle', 'bottom']).optional().nullable(),
      columns: z
        .array(z.object({ childrenIds: z.array(z.string()) }))
        .optional()
        .nullable(),
    })
    .optional()
    .nullable(),
})
export type ColumnsContainerProps = z.infer<typeof ColumnsContainerPropsSchema>
export const ColumnsContainerPropsDefaults = {
  columnsCount: 2 as const,
  columnsGap: 0,
  contentAlignment: 'middle' as const,
}

// ── Repeater ────────────────────────────────────────────────────────────────
export const RepeaterPropsSchema = z.object({
  style: z
    .object({
      backgroundColor: COLOR_SCHEMA,
      backgroundAlternatingColor: COLOR_SCHEMA,
      borderColor: COLOR_SCHEMA,
      borderRadius: z.number().optional().nullable(),
      padding: PADDING_SCHEMA,
    })
    .optional()
    .nullable(),
  props: z
    .object({
      childrenIds: z.array(z.string()).optional().nullable(),
      dataVariable: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
})
export type RepeaterProps = z.infer<typeof RepeaterPropsSchema>

// ── Divider ─────────────────────────────────────────────────────────────────
export const DividerPropsSchema = z.object({
  style: z
    .object({
      backgroundColor: COLOR_SCHEMA,
      padding: PADDING_SCHEMA,
    })
    .optional()
    .nullable(),
  props: z
    .object({
      lineColor: COLOR_SCHEMA,
      lineHeight: z.number().optional().nullable(),
    })
    .optional()
    .nullable(),
})
export type DividerProps = z.infer<typeof DividerPropsSchema>
export const DividerPropsDefaults = { lineHeight: 1, lineColor: '#333333' }

// ── Heading ─────────────────────────────────────────────────────────────────
export const HeadingPropsSchema = z.object({
  props: z
    .object({
      text: z.string().optional().nullable(),
      level: z.enum(['h1', 'h2', 'h3']).optional().nullable(),
    })
    .optional()
    .nullable(),
  style: z
    .object({
      color: COLOR_SCHEMA,
      backgroundColor: COLOR_SCHEMA,
      fontFamily: FONT_FAMILY_SCHEMA,
      fontWeight: z.enum(['bold', 'normal']).optional().nullable(),
      textAlign: z.enum(['left', 'center', 'right']).optional().nullable(),
      padding: PADDING_SCHEMA,
    })
    .optional()
    .nullable(),
})
export type HeadingProps = z.infer<typeof HeadingPropsSchema>
export const HeadingPropsDefaults = { level: 'h2' as const, text: '' }

// ── Html ────────────────────────────────────────────────────────────────────
export const HtmlPropsSchema = z.object({
  style: z
    .object({
      color: COLOR_SCHEMA,
      backgroundColor: COLOR_SCHEMA,
      fontFamily: FONT_FAMILY_SCHEMA,
      fontSize: z.number().min(0).optional().nullable(),
      textAlign: z.enum(['left', 'right', 'center']).optional().nullable(),
      padding: PADDING_SCHEMA,
    })
    .optional()
    .nullable(),
  props: z
    .object({
      contents: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
})
export type HtmlProps = z.infer<typeof HtmlPropsSchema>

// ── Image ───────────────────────────────────────────────────────────────────
export const ImagePropsSchema = z.object({
  style: z
    .object({
      padding: PADDING_SCHEMA,
      backgroundColor: COLOR_SCHEMA,
      textAlign: z.enum(['center', 'left', 'right']).optional().nullable(),
    })
    .optional()
    .nullable(),
  props: z
    .object({
      width: z.number().optional().nullable(),
      height: z.number().optional().nullable(),
      url: z.string().optional().nullable(),
      alt: z.string().optional().nullable(),
      linkHref: z.string().optional().nullable(),
      contentAlignment: z.enum(['top', 'middle', 'bottom']).optional().nullable(),
    })
    .optional()
    .nullable(),
})
export type ImageProps = z.infer<typeof ImagePropsSchema>

// ── Spacer ──────────────────────────────────────────────────────────────────
export const SpacerPropsSchema = z.object({
  props: z
    .object({
      height: z.number().gte(0).optional().nullish(),
    })
    .optional()
    .nullable(),
})
export type SpacerProps = z.infer<typeof SpacerPropsSchema>
export const SpacerPropsDefaults = { height: 16 }

// ── Text ────────────────────────────────────────────────────────────────────
export const TextPropsSchema = z.object({
  style: z
    .object({
      color: COLOR_SCHEMA,
      backgroundColor: COLOR_SCHEMA,
      fontSize: z.number().gte(0).optional().nullable(),
      fontFamily: FONT_FAMILY_SCHEMA,
      fontWeight: z.enum(['bold', 'normal']).optional().nullable(),
      textAlign: z.enum(['left', 'center', 'right']).optional().nullable(),
      padding: PADDING_SCHEMA,
    })
    .optional()
    .nullable(),
  props: z
    .object({
      markdown: z.boolean().optional().nullable(),
      text: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
})
export type TextProps = z.infer<typeof TextPropsSchema>
export const TextPropsDefaults = { text: '' }

// ── EmailLayout ─────────────────────────────────────────────────────────────
export const EmailLayoutPropsSchema = z.object({
  backdropColor: COLOR_SCHEMA,
  borderColor: COLOR_SCHEMA,
  borderRadius: z.number().optional().nullable(),
  canvasColor: COLOR_SCHEMA,
  textColor: COLOR_SCHEMA,
  fontFamily: FONT_FAMILY_SCHEMA,
  childrenIds: z.array(z.string()).optional().nullable(),
})
export type EmailLayoutProps = z.infer<typeof EmailLayoutPropsSchema>
