import { Theme } from 'theme-ui';

const makeTheme = <T extends Theme>(t: T) => t;

export const colors = {
  black: '#0c0c0c',
  blackLight: 'rgba(12, 12, 12, 0.65)',
  white: '#ffffff',
  whiteLight: 'rgba(255, 255, 255, 0.9)',
  primary: '#0c0c0c',
  mint: '#B3E3AB',
  red: '#FF7081',
  orange: '#FBBB97',
  grey: 'rgba(0, 0, 0, 0.38)',
};

const theme = makeTheme({
  space: [0, 5, 12, 16, 22, 32, 42, 60],
  fonts: {
    roboto:
      'Roboto, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif',
    robotoCondensed:
      'Roboto Condensed, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif',
    robotoMono:
      'Roboto Mono, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", monospace',
  },
  fontSizes: [12, 14, 16, 18, 20, 40],
  fontWeights: {
    thin: 100,
    light: 300,
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
      fontFamily: 'robotoMono',
      fontSize: 4,
      fontWeight: 'light',
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
      fontFamily: 'robotoCondensed',
      fontSize: 0,
      fontWeight: 'regular',
      textTransform: 'uppercase',
      lineHeight: 'heading',
    },
    body: {
      fontFamily: 'robotoMono',
      fontSize: 2,
      fontWeight: 'regular',
      lineHeight: 'large',
    },
    link: {
      fontFamily: 'robotoMono',
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
      h1: {
        variant: 'text.heading',
      },
      a: {
        variant: 'text.link',
        color: 'black',
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
