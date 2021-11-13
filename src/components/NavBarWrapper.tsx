/** @jsxImportSource theme-ui */

import { ReactNode } from 'react';

const NavBarWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div sx={{ display: 'flex', justifyContent: 'space-between' }}>
      {children}
    </div>
  );
};

export default NavBarWrapper;
