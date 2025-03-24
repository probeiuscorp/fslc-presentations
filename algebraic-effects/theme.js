import { themes } from 'mdx-deck';
const base = themes.dark;
export default {
  ...base,
  fonts: {
    body: '"Crimson Text", serif',
  },
  googleFont: 'https://fonts.googleapis.com/css?family=Crimson+Text',
  styles: {
    ...base.styles,
    root: {
      textAlign: 'left',
    },
    p: {
      marginBlockStart: 0,
      marginBlockEnd: 0,
    },
    ul: {
      marginBlockStart: 0,
      marginBlockEnd: 0,
    },
    ol: {
      marginBlockStart: 0,
      marginBlockEnd: 0,
    },
    a: {
      color: '#9d7ff5'
    },
    Slide: {
      alignItems: 'flex-start',
      paddingLeft: '2em',
      paddingRight: '2em',
      gap: '1em',
    },
    h1: {
      color: '#99ffcc',
      fontSize: '1.5em',
      '::before': {
        content: '"\u2589 "',
      },
      '&:only-child': {
        alignSelf: 'center',
        fontSize: '2em',
      },
    },
    h2: {
      color: '#2b97d9',
      '::before': {
        content: '"\u258A "',
      },
    },
    img: {
      filter: 'invert(1)',
      width: 'unset',
      height: 'unset',
      alignSelf: 'center',
    },
  },
};
