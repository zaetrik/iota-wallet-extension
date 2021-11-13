/** @jsxImportSource theme-ui */

import { ThemeUICSSObject } from '@theme-ui/css';

const Copy = ({ styles = {} }: { styles?: ThemeUICSSObject }) => {
  return (
    <svg
      sx={styles}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      height="25"
      width="25"
    >
      <path d="M21 10v10a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1zM6 14H5V5h9v1a1 1 0 0 0 2 0V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h2a1 1 0 0 0 0-2z" />
    </svg>
  );
};

export default Copy;
