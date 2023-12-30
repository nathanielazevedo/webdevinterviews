/* eslint-disable import/prefer-default-export */
const colors = {
  lightBlue: '#9cdcfe',
  yellow: '#dcdcaa',
  purple: '#fa39f0',
  green: '#4ec9b0',
  orange: '#ce9178',
  comment: '#6a9956',
  blue: '#569cd6',
}

export const theme = {
  colors: {
    surface1: '#1e1e1e',
    surface2: '#181818',
    surface3: '#2F2F2F',
    clickable: '#999999',
    base: 'white',
    disabled: '#4D4D4D',
    hover: '#C5C5C5',
    accent: '',
    error: 'white',
    errorSurface: '#5c0600',
  },
  syntax: {
    plain: '#C5C5C5',
    comment: {
      color: colors.comment,
      fontStyle: 'italic',
    },
    keyword: colors.purple,
    tag: colors.blue,
    punctuation: 'grey',
    definition: colors.green,
    property: colors.lightBlue,
    static: colors.blue,
    string: colors.orange,
  },
  font: {
    // size: '12px',
    // lineHeight: '16px',
    // mono: 'Fira Code, monospace',
  },
}
