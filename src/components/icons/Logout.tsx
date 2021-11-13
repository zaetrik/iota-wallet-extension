/** @jsxImportSource theme-ui */

import { ThemeUICSSObject } from '@theme-ui/css';

const Logout = ({ styles = {} }: { styles?: ThemeUICSSObject }) => {
  return (
    <svg
      sx={styles}
      height="25"
      width="25"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
    >
      <path d="M10.95 15.84h-11V.17h11v3.88h-1V1.17h-9v13.67h9v-2.83h1v3.83z" />
      <path d="M5 8h6v1H5zm6-2.04 4.4 2.54-4.4 2.54V5.96z" />
    </svg>
  );
};

export default Logout;
