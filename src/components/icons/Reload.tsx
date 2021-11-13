/** @jsxImportSource theme-ui */

import { ThemeUICSSObject } from '@theme-ui/css';

const Reload = ({ styles = {} }: { styles?: ThemeUICSSObject }) => {
  return (
    <svg
      sx={styles}
      width="25"
      height="25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#a)" fillRule="evenodd" clipRule="evenodd" fill="#000">
        <path d="M13.041 19.624a7 7 0 0 0 4.95-8.574 1 1 0 0 1 1.932-.517A9 9 0 0 1 6.705 20.642a1 1 0 0 1 1.005-1.729 6.975 6.975 0 0 0 5.331.71z" />
        <path d="M16.235 13.607a1 1 0 0 1-.024-1.414l2.027-2.096a1 1 0 0 1 1.414-.024l2.096 2.026a1 1 0 1 1-1.39 1.438l-1.377-1.331-1.332 1.377a1 1 0 0 1-1.414.024zm-5.681-8.411a7 7 0 0 0-4.95 8.573 1 1 0 1 1-1.932.518A9 9 0 0 1 16.89 4.177a1 1 0 1 1-1.005 1.73 6.975 6.975 0 0 0-5.331-.711z" />
        <path d="M7.36 11.213a1 1 0 0 1 .024 1.414l-2.027 2.096a1 1 0 0 1-1.414.024L1.847 12.72a1 1 0 1 1 1.39-1.438l1.378 1.332 1.331-1.377a1 1 0 0 1 1.414-.024z" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default Reload;
