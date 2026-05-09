import type { TEditorDocument } from '~/types/email-builder'

export const EMPTY_EMAIL_MESSAGE: TEditorDocument = {
  root: {
    type: 'EmailLayout',
    data: {
      backdropColor: '#F5F5F5',
      canvasColor: '#FFFFFF',
      textColor: '#242424',
      fontFamily: 'MODERN_SANS',
      childrenIds: [],
    },
  },
}

export const WELCOME_EMAIL: TEditorDocument = {
  root: {
    type: 'EmailLayout',
    data: {
      backdropColor: '#F2F5F7',
      canvasColor: '#FFFFFF',
      textColor: '#242424',
      fontFamily: 'MODERN_SANS',
      childrenIds: ['block-heading', 'block-text', 'block-button', 'block-divider', 'block-footer'],
    },
  },
  'block-heading': {
    type: 'Heading',
    data: {
      props: { text: 'Welcome!', level: 'h1' },
      style: {
        padding: { top: 32, bottom: 0, left: 24, right: 24 },
        textAlign: 'center',
      },
    },
  },
  'block-text': {
    type: 'Text',
    data: {
      props: {
        text: "We're thrilled to have you on board. Get started by exploring your dashboard and setting up your profile.",
      },
      style: {
        padding: { top: 16, bottom: 16, left: 24, right: 24 },
        textAlign: 'center',
        fontSize: 16,
      },
    },
  },
  'block-button': {
    type: 'Button',
    data: {
      props: {
        text: 'Get Started',
        url: 'https://example.com',
        buttonBackgroundColor: '#0070F3',
        buttonTextColor: '#FFFFFF',
        buttonStyle: 'rounded',
        size: 'large',
      },
      style: {
        textAlign: 'center',
        padding: { top: 8, bottom: 24, left: 24, right: 24 },
      },
    },
  },
  'block-divider': {
    type: 'Divider',
    data: {
      props: { lineColor: '#EEEEEE', lineHeight: 1 },
      style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
    },
  },
  'block-footer': {
    type: 'Text',
    data: {
      props: { text: 'If you have any questions, reply to this email. We\'d love to help!' },
      style: {
        padding: { top: 8, bottom: 32, left: 24, right: 24 },
        fontSize: 13,
        color: '#999999',
        textAlign: 'center',
      },
    },
  },
}

export const OTP_EMAIL: TEditorDocument = {
  root: {
    type: 'EmailLayout',
    data: {
      backdropColor: '#F2F5F7',
      canvasColor: '#FFFFFF',
      textColor: '#242424',
      fontFamily: 'MODERN_SANS',
      childrenIds: ['block-heading', 'block-text', 'block-code', 'block-footer'],
    },
  },
  'block-heading': {
    type: 'Heading',
    data: {
      props: { text: 'Your verification code', level: 'h2' },
      style: { padding: { top: 32, bottom: 0, left: 24, right: 24 }, textAlign: 'center' },
    },
  },
  'block-text': {
    type: 'Text',
    data: {
      props: { text: 'Enter the following code to verify your identity:' },
      style: {
        padding: { top: 16, bottom: 16, left: 24, right: 24 },
        textAlign: 'center',
      },
    },
  },
  'block-code': {
    type: 'Heading',
    data: {
      props: { text: '847 293', level: 'h1' },
      style: {
        padding: { top: 16, bottom: 16, left: 24, right: 24 },
        textAlign: 'center',
        backgroundColor: '#F0F0F0',
        fontFamily: 'MONOSPACE',
      },
    },
  },
  'block-footer': {
    type: 'Text',
    data: {
      props: { text: 'This code expires in 10 minutes. If you did not request this code, please ignore this email.' },
      style: {
        padding: { top: 16, bottom: 32, left: 24, right: 24 },
        fontSize: 13,
        color: '#999999',
        textAlign: 'center',
      },
    },
  },
}

export const RESET_PASSWORD_EMAIL: TEditorDocument = {
  root: {
    type: 'EmailLayout',
    data: {
      backdropColor: '#F2F5F7',
      canvasColor: '#FFFFFF',
      textColor: '#242424',
      fontFamily: 'MODERN_SANS',
      childrenIds: ['block-heading', 'block-text', 'block-button', 'block-footer'],
    },
  },
  'block-heading': {
    type: 'Heading',
    data: {
      props: { text: 'Reset your password', level: 'h2' },
      style: { padding: { top: 32, bottom: 0, left: 24, right: 24 } },
    },
  },
  'block-text': {
    type: 'Text',
    data: {
      props: {
        text: "We received a request to reset your password. Click the button below to choose a new one. If you didn't make this request, you can safely ignore this email.",
      },
      style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
    },
  },
  'block-button': {
    type: 'Button',
    data: {
      props: {
        text: 'Reset Password',
        url: 'https://example.com/reset',
        buttonBackgroundColor: '#0070F3',
        buttonTextColor: '#FFFFFF',
        buttonStyle: 'rounded',
        size: 'large',
      },
      style: { padding: { top: 8, bottom: 24, left: 24, right: 24 } },
    },
  },
  'block-footer': {
    type: 'Text',
    data: {
      props: { text: 'This link expires in 1 hour.' },
      style: {
        padding: { top: 8, bottom: 32, left: 24, right: 24 },
        fontSize: 13,
        color: '#999999',
      },
    },
  },
}

export const SAMPLE_TEMPLATES: { label: string; value: TEditorDocument }[] = [
  { label: 'Empty', value: EMPTY_EMAIL_MESSAGE },
  { label: 'Welcome email', value: WELCOME_EMAIL },
  { label: 'One-time passcode (OTP)', value: OTP_EMAIL },
  { label: 'Reset password', value: RESET_PASSWORD_EMAIL },
]
