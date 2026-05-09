import { marked } from 'marked'
import type { TEditorDocument } from '~/types/email-builder'
import { getFontFamily } from './font-families'
import { getPadding } from './style-schemas'

marked.setOptions({ breaks: true, gfm: true })
import {
  AvatarPropsDefaults,
  ButtonPropsDefaults,
  DividerPropsDefaults,
  HeadingPropsDefaults,
  SpacerPropsDefaults,
  TextPropsDefaults,
  ColumnsContainerPropsDefaults,
} from './schemas'
import type {
  AvatarProps,
  ButtonProps,
  ContainerProps,
  ColumnsContainerProps,
  DividerProps,
  EmailLayoutProps,
  HeadingProps,
  HtmlProps,
  ImageProps,
  RepeaterProps,
  SpacerProps,
  TextProps,
} from './schemas'

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

function styleToString(style: Record<string, string | number | undefined>): string {
  return Object.entries(style)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => {
      const cssKey = k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
      return `${cssKey}:${typeof v === 'number' && cssKey !== 'font-weight' && cssKey !== 'opacity' ? `${v}px` : v}`
    })
    .join(';')
}

function renderBlock(doc: TEditorDocument, blockId: string): string {
  const block = doc[blockId]
  if (!block) return ''
  const d = block.data as Record<string, unknown>
  switch (block.type) {
    case 'EmailLayout':
      return renderEmailLayout(doc, d as unknown as EmailLayoutProps)
    case 'Avatar':
      return renderAvatar(d as unknown as AvatarProps)
    case 'Button':
      return renderButton(d as unknown as ButtonProps)
    case 'Container':
      return renderContainer(doc, d as unknown as ContainerProps)
    case 'Repeater':
      return renderRepeater(doc, d as unknown as RepeaterProps)
    case 'ColumnsContainer':
      return renderColumnsContainer(doc, d as unknown as ColumnsContainerProps)
    case 'Divider':
      return renderDivider(d as unknown as DividerProps)
    case 'Heading':
      return renderHeading(d as unknown as HeadingProps)
    case 'Html':
      return renderHtmlBlock(d as unknown as HtmlProps)
    case 'Image':
      return renderImage(d as unknown as ImageProps)
    case 'Spacer':
      return renderSpacer(d as unknown as SpacerProps)
    case 'Text':
      return renderText(d as unknown as TextProps)
    default:
      return ''
  }
}

function renderChildren(doc: TEditorDocument, ids: string[]): string {
  return ids.map((id) => renderBlock(doc, id)).join('')
}

function renderEmailLayout(doc: TEditorDocument, p: EmailLayoutProps): string {
  const childrenIds = p.childrenIds ?? []
  const font = getFontFamily(p.fontFamily) ?? '"Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif'
  const border = p.borderColor ? `border:1px solid ${p.borderColor};` : ''
  const borderRadius = p.borderRadius ? `border-radius:${p.borderRadius}px;` : ''
  return `<div style="background-color:${p.backdropColor ?? '#F5F5F5'};color:${p.textColor ?? '#262626'};font-family:${font};font-size:16px;font-weight:400;letter-spacing:0.15008px;line-height:1.5;margin:0;padding:32px 0;min-height:100%;width:100%"><table align="center" width="100%" style="margin:0 auto;max-width:600px;background-color:${p.canvasColor ?? '#FFFFFF'};${borderRadius}${border}" role="presentation" cellspacing="0" cellpadding="0" border="0"><tbody><tr style="width:100%"><td>${renderChildren(doc, childrenIds)}</td></tr></tbody></table></div>`
}

function renderAvatar(p: AvatarProps): string {
  const size = p.props?.size ?? AvatarPropsDefaults.size
  const imageUrl = p.props?.imageUrl ?? AvatarPropsDefaults.imageUrl
  const alt = p.props?.alt ?? AvatarPropsDefaults.alt
  const shape = p.props?.shape ?? AvatarPropsDefaults.shape
  let borderRadius = ''
  if (shape === 'circle') borderRadius = `border-radius:${size}px;`
  else if (shape === 'rounded') borderRadius = `border-radius:${size * 0.125}px;`
  const sectionStyle = styleToString({
    textAlign: p.style?.textAlign ?? undefined,
    padding: getPadding(p.style?.padding),
  })
  return `<div style="${sectionStyle}"><img alt="${escapeHtml(alt)}" src="${escapeHtml(imageUrl)}" height="${size}" width="${size}" style="outline:none;border:none;text-decoration:none;object-fit:cover;height:${size}px;width:${size}px;max-width:100%;display:inline-block;vertical-align:middle;text-align:center;${borderRadius}" /></div>`
}

function renderButton(p: ButtonProps): string {
  const text = p.props?.text ?? ButtonPropsDefaults.text
  const url = p.props?.url ?? ButtonPropsDefaults.url
  const fullWidth = p.props?.fullWidth ?? ButtonPropsDefaults.fullWidth
  const buttonTextColor = p.props?.buttonTextColor ?? ButtonPropsDefaults.buttonTextColor
  const buttonBg = p.props?.buttonBackgroundColor ?? ButtonPropsDefaults.buttonBackgroundColor
  const bStyle = p.props?.buttonStyle ?? ButtonPropsDefaults.buttonStyle
  const size = p.props?.size ?? ButtonPropsDefaults.size

  let br = '4'
  if (bStyle === 'rectangle') br = '0'
  else if (bStyle === 'pill') br = '64'

  let pad: [number, number] = [12, 20]
  if (size === 'x-small') pad = [4, 8]
  else if (size === 'small') pad = [8, 12]
  else if (size === 'large') pad = [16, 32]

  const textRaise = (pad[1] * 2 * 3) / 4
  const wrapperStyle = styleToString({
    backgroundColor: p.style?.backgroundColor ?? undefined,
    textAlign: p.style?.textAlign ?? undefined,
    padding: getPadding(p.style?.padding),
  })

  const linkStyle = `color:${buttonTextColor};font-size:${p.style?.fontSize ?? 16}px;${p.style?.fontFamily ? `font-family:${getFontFamily(p.style.fontFamily)};` : ''}font-weight:${p.style?.fontWeight ?? 'bold'};background-color:${buttonBg};border-radius:${br}px;display:${fullWidth ? 'block' : 'inline-block'};padding:${pad[0]}px ${pad[1]}px;text-decoration:none`

  return `<div style="${wrapperStyle}"><a href="${escapeHtml(url)}" style="${linkStyle}" target="_blank"><!--[if mso]><i style="letter-spacing: ${pad[1]}px;mso-font-width:-100%;mso-text-raise:${textRaise}" hidden>&nbsp;</i><![endif]--><span>${escapeHtml(text)}</span><!--[if mso]><i style="letter-spacing: ${pad[1]}px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]--></a></div>`
}

function renderContainer(doc: TEditorDocument, p: ContainerProps): string {
  const childrenIds = p.props?.childrenIds ?? []
  const border = p.style?.borderColor ? `border:1px solid ${p.style.borderColor};` : ''
  const style = styleToString({
    backgroundColor: p.style?.backgroundColor ?? undefined,
    borderRadius: p.style?.borderRadius ? `${p.style.borderRadius}px` : undefined,
    padding: getPadding(p.style?.padding),
  })
  return `<div style="${style}${border}">${renderChildren(doc, childrenIds)}</div>`
}

function renderRepeater(doc: TEditorDocument, p: RepeaterProps): string {
  const childrenIds = p.props?.childrenIds ?? []
  const dataVariable = (p.props?.dataVariable ?? '').replace(/^\{\{|\}\}$/g, '')
  const border = p.style?.borderColor ? `border:1px solid ${p.style.borderColor};` : ''
  const bgColor = p.style?.backgroundColor ?? undefined
  const altColor = p.style?.backgroundAlternatingColor ?? undefined
  const useAlternating = dataVariable && altColor && altColor !== bgColor

  const bgStyle = useAlternating
    ? `background-color:{{@isOdd '${altColor}' '${bgColor ?? ''}'}}`
    : bgColor ? `background-color:${bgColor}` : ''

  const otherStyles = styleToString({
    borderRadius: p.style?.borderRadius ? `${p.style.borderRadius}px` : undefined,
    padding: getPadding(p.style?.padding),
  })
  const fullStyle = [bgStyle, otherStyles, border].filter(Boolean).join(';')

  const childrenHtml = renderChildren(doc, childrenIds)
  if (dataVariable) {
    return `{{#each ${dataVariable}}}<div style="${fullStyle}">${childrenHtml}</div>{{/each}}`
  }
  return `<div style="${fullStyle}">${childrenHtml}</div>`
}

function renderColumnsContainer(doc: TEditorDocument, p: ColumnsContainerProps): string {
  const columnsCount = p.props?.columnsCount ?? ColumnsContainerPropsDefaults.columnsCount
  const columnsGap = p.props?.columnsGap ?? ColumnsContainerPropsDefaults.columnsGap
  const contentAlignment = p.props?.contentAlignment ?? ColumnsContainerPropsDefaults.contentAlignment
  const columns = p.props?.columns ?? []
  const wrapperStyle = styleToString({
    backgroundColor: p.style?.backgroundColor ?? undefined,
    padding: getPadding(p.style?.padding),
  })

  let cells = ''
  for (let i = 0; i < 3; i++) {
    if (columnsCount === 2 && i === 2) continue
    let paddingLeft = 0
    let paddingRight = 0
    if (columnsCount === 2) {
      paddingLeft = i === 0 ? 0 : columnsGap / 2
      paddingRight = i === 0 ? columnsGap / 2 : 0
    } else {
      if (i === 0) { paddingLeft = 0; paddingRight = (2 * columnsGap) / 3 }
      else if (i === 1) { paddingLeft = columnsGap / 3; paddingRight = columnsGap / 3 }
      else { paddingLeft = (2 * columnsGap) / 3; paddingRight = 0 }
    }
    const fixedWidth = p.props?.fixedWidths?.[i]
    const widthStyle = fixedWidth ? `width:${fixedWidth}px;` : ''
    const children = columns[i] ? renderChildren(doc, columns[i].childrenIds) : ''
    cells += `<td style="box-sizing:content-box;vertical-align:${contentAlignment};padding-left:${paddingLeft}px;padding-right:${paddingRight}px;${widthStyle}">${children}</td>`
  }

  return `<div style="${wrapperStyle}"><table align="center" width="100%" cellpadding="0" border="0" style="table-layout:fixed;border-collapse:collapse"><tbody style="width:100%"><tr style="width:100%">${cells}</tr></tbody></table></div>`
}

function renderDivider(p: DividerProps): string {
  const lineHeight = p.props?.lineHeight ?? DividerPropsDefaults.lineHeight
  const lineColor = p.props?.lineColor ?? DividerPropsDefaults.lineColor
  const style = styleToString({
    padding: getPadding(p.style?.padding),
    backgroundColor: p.style?.backgroundColor ?? undefined,
  })
  return `<div style="${style}"><hr style="width:100%;border:none;border-top:${lineHeight}px solid ${lineColor};margin:0" /></div>`
}

function renderHeading(p: HeadingProps): string {
  const level = p.props?.level ?? HeadingPropsDefaults.level
  const text = p.props?.text ?? HeadingPropsDefaults.text
  let fontSize = 24
  if (level === 'h1') fontSize = 32
  else if (level === 'h3') fontSize = 20
  const style = styleToString({
    color: p.style?.color ?? undefined,
    backgroundColor: p.style?.backgroundColor ?? undefined,
    fontWeight: p.style?.fontWeight ?? 'bold',
    textAlign: p.style?.textAlign ?? undefined,
    margin: '0',
    fontFamily: p.style?.fontFamily ? getFontFamily(p.style.fontFamily) : undefined,
    fontSize: `${fontSize}px`,
    padding: getPadding(p.style?.padding),
  })
  return `<${level} style="${style}">${escapeHtml(text)}</${level}>`
}

function renderHtmlBlock(p: HtmlProps): string {
  const contents = p.props?.contents
  const style = styleToString({
    color: p.style?.color ?? undefined,
    backgroundColor: p.style?.backgroundColor ?? undefined,
    fontFamily: p.style?.fontFamily ? getFontFamily(p.style.fontFamily) : undefined,
    fontSize: p.style?.fontSize ? `${p.style.fontSize}px` : undefined,
    textAlign: p.style?.textAlign ?? undefined,
    padding: getPadding(p.style?.padding),
  })
  return `<div style="${style}">${contents ?? ''}</div>`
}

function renderImage(p: ImageProps): string {
  const url = p.props?.url ?? ''
  const alt = p.props?.alt ?? ''
  const width = p.props?.width
  const height = p.props?.height
  const linkHref = p.props?.linkHref
  const contentAlignment = p.props?.contentAlignment ?? 'middle'
  const sectionStyle = styleToString({
    padding: getPadding(p.style?.padding),
    backgroundColor: p.style?.backgroundColor ?? undefined,
    textAlign: p.style?.textAlign ?? undefined,
  })
  const wAttr = width ? ` width="${width}"` : ''
  const hAttr = height ? ` height="${height}"` : ''
  const imgStyle = `outline:none;border:none;text-decoration:none;vertical-align:${contentAlignment};display:inline-block;max-width:100%${width ? `;width:${width}px` : ''}${height ? `;height:${height}px` : ''}`
  const img = `<img alt="${escapeHtml(alt)}" src="${escapeHtml(url)}"${wAttr}${hAttr} style="${imgStyle}" />`
  if (linkHref) {
    return `<div style="${sectionStyle}"><a href="${escapeHtml(linkHref)}" style="text-decoration:none" target="_blank">${img}</a></div>`
  }
  return `<div style="${sectionStyle}">${img}</div>`
}

function renderSpacer(p: SpacerProps): string {
  const height = p.props?.height ?? SpacerPropsDefaults.height
  return `<div style="height:${height}px"></div>`
}

function renderText(p: TextProps): string {
  const text = p.props?.text ?? TextPropsDefaults.text
  const isMarkdown = p.props?.markdown ?? false
  const style = styleToString({
    color: p.style?.color ?? undefined,
    backgroundColor: p.style?.backgroundColor ?? undefined,
    fontSize: p.style?.fontSize ? `${p.style.fontSize}px` : undefined,
    fontFamily: p.style?.fontFamily ? getFontFamily(p.style.fontFamily) : undefined,
    fontWeight: p.style?.fontWeight ?? undefined,
    textAlign: p.style?.textAlign ?? undefined,
    padding: getPadding(p.style?.padding),
  })
  const content = isMarkdown
    ? (marked.parse(text, { async: false }) as string)
    : escapeHtml(text)
  return `<div style="${style}">${content}</div>`
}

export function renderToHtml(
  doc: TEditorDocument,
  options: { rootBlockId: string }
): string {
  return `<!DOCTYPE html><html><body>${renderBlock(doc, options.rootBlockId)}</body></html>`
}
