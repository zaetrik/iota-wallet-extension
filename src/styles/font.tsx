import { css, Global } from '@emotion/react';
import React from 'react';

export const FontFace = (): JSX.Element => (
  <Global
    styles={css`
      /* latin-ext */
      @font-face {
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url(https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu7GxKKTU1Kvnz.woff2)
          format('woff2');
        unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
          U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
      }
      /* latin */
      @font-face {
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url(https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2)
          format('woff2');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
          U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
          U+2212, U+2215, U+FEFF, U+FFFD;
      }
      /* latin-ext */
      @font-face {
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 500;
        font-display: swap;
        src: url(https://fonts.gstatic.com/s/roboto/v27/KFOlCnqEu92Fr1MmEU9fChc4AMP6lbBP.woff2)
          format('woff2');
        unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
          U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
      }
      /* latin */
      @font-face {
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 500;
        font-display: swap;
        src: url(https://fonts.gstatic.com/s/roboto/v27/KFOlCnqEu92Fr1MmEU9fBBc4AMP6lQ.woff2)
          format('woff2');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
          U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
          U+2212, U+2215, U+FEFF, U+FFFD;
      }
      /* latin-ext */
      @font-face {
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 700;
        font-display: swap;
        src: url(https://fonts.gstatic.com/s/roboto/v27/KFOlCnqEu92Fr1MmWUlfChc4AMP6lbBP.woff2)
          format('woff2');
        unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
          U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
      }
      /* latin */
      @font-face {
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 700;
        font-display: swap;
        src: url(https://fonts.gstatic.com/s/roboto/v27/KFOlCnqEu92Fr1MmWUlfBBc4AMP6lQ.woff2)
          format('woff2');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
          U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
          U+2212, U+2215, U+FEFF, U+FFFD;
      }
      /* latin-ext */
      @font-face {
        font-family: 'Roboto Condensed';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url(https://fonts.gstatic.com/s/robotocondensed/v19/ieVl2ZhZI2eCN5jzbjEETS9weq8-19y7DQk6YvNkeg.woff2)
          format('woff2');
        unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
          U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
      }
      /* latin */
      @font-face {
        font-family: 'Roboto Condensed';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url(https://fonts.gstatic.com/s/robotocondensed/v19/ieVl2ZhZI2eCN5jzbjEETS9weq8-19K7DQk6YvM.woff2)
          format('woff2');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
          U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
          U+2212, U+2215, U+FEFF, U+FFFD;
      }

      /* latin-ext */
      @font-face {
        font-family: 'Roboto Condensed';
        font-style: normal;
        font-weight: 700;
        font-display: swap;
        src: url(https://fonts.gstatic.com/s/robotocondensed/v19/ieVi2ZhZI2eCN5jzbjEETS9weq8-32meGCoYb9lecyVC4A.woff2)
          format('woff2');
        unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
          U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
      }
      /* latin */
      @font-face {
        font-family: 'Roboto Condensed';
        font-style: normal;
        font-weight: 700;
        font-display: swap;
        src: url(https://fonts.gstatic.com/s/robotocondensed/v19/ieVi2ZhZI2eCN5jzbjEETS9weq8-32meGCQYb9lecyU.woff2)
          format('woff2');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
          U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
          U+2212, U+2215, U+FEFF, U+FFFD;
      }
    `}
  />
);

export default FontFace;
