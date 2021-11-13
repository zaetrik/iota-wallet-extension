import { Theme } from 'theme-ui';

const makeTheme = <T extends Theme>(t: T) => t;

export const colors = {
  black: '#0c0c0c',
  blackLight: 'rgba(12, 12, 12, 0.65)',
  white: '#ffffff',
  whiteLight: 'rgba(255, 255, 255, 0.9)',
  primary: '#00043a',
  mint: '#2ec4b6',
  red: '#f94144',
  yellow: '#f8961e',
};

const theme = makeTheme({
  space: [0, 5, 12, 16, 22, 32, 42, 60],
  fonts: {
    roboto:
      'Roboto, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif',
    robotoCondensed:
      'Roboto Condensed, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif',
  },
  fontSizes: [12, 14, 16, 18, 20],
  fontWeights: {
    regular: 400,
    medium: 500,
    bold: 700,
  },
  lineHeights: {
    large: 1.5,
    body: 1.3,
    heading: 1.2,
  },
  colors,
  text: {
    heading: {
      fontFamily: 'roboto',
      fontSize: 4,
      fontWeight: 'regular',
      lineHeight: 'heading',
    },
    subheading: {
      fontFamily: 'robotoCondensed',
      fontSize: 2,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      lineHeight: 'heading',
    },
    label: {
      fontFamily: 'roboto',
      fontSize: 0,
      fontWeight: 'regular',
      textTransform: 'uppercase',
      lineHeight: 'heading',
    },
    body: {
      fontFamily: 'roboto',
      fontSize: 2,
      lineHeight: 'large',
      fontWeight: 'body',
    },
    link: {
      fontFamily: 'robotoCondensed',
      fontSize: 1,
    },
  },
  styles: {
    root: {
      fontFamily: 'roboto',
      lineHeight: 'body',
      fontWeight: 'regular',
      color: 'black',
      '& label': {
        variant: 'text.label',
        pt: 2,
        pb: 1,
      },
      select: {
        p: 1,
        variant: 'text.body',
        borderRadius: '4px',
        border: '1px solid black',
      },
      input: {
        p: 1,
        variant: 'text.body',
        borderRadius: '4px',
        border: '1px solid black',
      },
      button: {
        variant: 'text.subheading',
        textAlign: 'left',
        border: 'none',
        cursor: 'pointer',
        color: 'white',
        p: 4,
      },
      a: {
        variant: 'text.link',
      },
      p: {
        variant: 'text.body',
      },
      backgroundColor: 'white',
      WebkitFontSmoothing: 'antialiased',
      'p, h1 , h2, h3, h4': {
        m: 0,
      },
    },
  },
  config: {
    useColorSchemeMediaQuery: false,
  },
});

export default theme;
