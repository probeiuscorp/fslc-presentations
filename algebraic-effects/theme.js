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
    code: undefined,
    root: {
      textAlign: 'left',
    },
    a: {
      color: '#9d7ff5'
    },
    strong: {
      color: 'white',
    },
    Slide: {
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      paddingTop: '1em',
      paddingLeft: '2em',
      paddingRight: '2em',
      gap: '1em',
      color: '#d8d8d8',
    },
    h1: {
      color: '#99ffcc',
      fontSize: '1.5em',
      '::before': {
        content: '"\u2589 "',
      },
      '&:only-child': {
        alignSelf: 'center',
        margin: 'auto 0',
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
