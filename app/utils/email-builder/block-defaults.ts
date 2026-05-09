import type { TEditorBlock } from '~/types/email-builder'

export function getDefaultBlock(type: TEditorBlock['type']): TEditorBlock {
  switch (type) {
    case 'Avatar':
      return {
        type: 'Avatar',
        data: {
          style: { textAlign: 'center', padding: { top: 16, bottom: 16, left: 24, right: 24 } },
          props: { size: 64, shape: 'circle', imageUrl: '', alt: '' },
        },
      }
    case 'Button':
      return {
        type: 'Button',
        data: {
          props: {
            text: 'Button',
            url: '',
            buttonBackgroundColor: '#999999',
            buttonTextColor: '#FFFFFF',
            buttonStyle: 'rounded',
            size: 'medium',
          },
          style: { textAlign: 'center', padding: { top: 16, bottom: 16, left: 24, right: 24 } },
        },
      }
    case 'Container':
      return {
        type: 'Container',
        data: {
          style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
          props: { childrenIds: [] },
        },
      }
    case 'ColumnsContainer':
      return {
        type: 'ColumnsContainer',
        data: {
          style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
          props: {
            columnsCount: 2,
            columnsGap: 16,
            contentAlignment: 'middle',
            columns: [{ childrenIds: [] }, { childrenIds: [] }, { childrenIds: [] }],
          },
        },
      }
    case 'Divider':
      return {
        type: 'Divider',
        data: {
          style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
          props: { lineColor: '#CCCCCC', lineHeight: 1 },
        },
      }
    case 'Heading':
      return {
        type: 'Heading',
        data: {
          props: { text: 'Heading', level: 'h2' },
          style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
        },
      }
    case 'Html':
      return {
        type: 'Html',
        data: {
          props: { contents: '<p>Custom HTML</p>' },
          style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
        },
      }
    case 'Image':
      return {
        type: 'Image',
        data: {
          props: {
            url: 'https://placehold.co/600x400@2x/F8F8F8/CCC?text=Your%20image',
            alt: '',
            width: undefined,
            height: undefined,
            linkHref: undefined,
            contentAlignment: 'middle',
          },
          style: { padding: { top: 16, bottom: 16, left: 24, right: 24 }, textAlign: 'center' },
        },
      }
    case 'Repeater':
      return {
        type: 'Repeater',
        data: {
          style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
          props: { childrenIds: [], dataVariable: '' },
        },
      }
    case 'Spacer':
      return {
        type: 'Spacer',
        data: { props: { height: 16 } },
      }
    case 'Text':
      return {
        type: 'Text',
        data: {
          props: { text: 'Text content' },
          style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
        },
      }
    case 'EmailLayout':
      return {
        type: 'EmailLayout',
        data: {
          backdropColor: '#F5F5F5',
          canvasColor: '#FFFFFF',
          textColor: '#242424',
          fontFamily: 'MODERN_SANS',
          childrenIds: [],
        },
      }
  }
}

export function generateBlockId(): string {
  return `block-${Date.now()}`
}
