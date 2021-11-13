/** @jsxImportSource theme-ui */

import { ThemeUICSSObject } from '@theme-ui/css';

const History = ({ styles = {} }: { styles?: ThemeUICSSObject }) => {
  return (
    <svg
      sx={styles}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      height="25"
      width="25"
    >
      <path
        d="M16 1a14.86 14.86 0 0 0-9.33 3.26L6 4.83V2a1 1 0 0 0-2 0v5a1 1 0 0 0 1 1h5a1 1 0 0 0 0-2H7.71l.23-.2A12.86 12.86 0 0 1 16 3 13 13 0 1 1 3 16a1 1 0 0 0-2 0A15 15 0 1 0 16 1z"
        fill="#039be5"
      />
      <path
        d="m19.79 21.21-4.5-4.5A1 1 0 0 1 15 16V7a1 1 0 0 1 2 0v8.59l4.21 4.2a1 1 0 0 1-1.42 1.42z"
        fill="#ffb74d"
      />
    </svg>
  );
};

export default History;
