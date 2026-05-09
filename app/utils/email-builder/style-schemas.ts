import { z } from 'zod'

export const COLOR_SCHEMA = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/)
  .nullable()
  .optional()

export const PADDING_SCHEMA = z
  .object({
    top: z.number(),
    bottom: z.number(),
    right: z.number(),
    left: z.number(),
  })
  .optional()
  .nullable()

export type Padding = z.infer<typeof PADDING_SCHEMA>

export function getPadding(padding: Padding): string | undefined {
  if (!padding) return undefined
  return `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`
}
