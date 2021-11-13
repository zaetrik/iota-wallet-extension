/** @jsxImportSource theme-ui */

import { ThemeUICSSObject } from '@theme-ui/css';

const Checkmark = ({ styles = {} }: { styles?: ThemeUICSSObject }) => {
  return (
    <svg sx={styles} xmlns="http://www.w3.org/2000/svg" width="25" height="25">
      <path d="M9.993 19.421 3.286 12.58l1.428-1.401 5.293 5.4 9.286-9.286 1.414 1.414L9.993 19.421z" />
    </svg>
  );
};

export default Checkmark;
