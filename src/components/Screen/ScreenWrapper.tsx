/** @jsxImportSource theme-ui */

import { ThemeUICSSObject } from '@theme-ui/css';
import { ReactNode } from 'react';

const ScreenWrapper = ({
  children,
  styles = {},
}: {
  children: ReactNode;
  styles?: ThemeUICSSObject;
}) => {
  return (
    <div
      sx={{
        display: 'flex',
        flexFlow: 'column',
        position: 'relative',
        ...styles,
      }}
    >
      {children}
    </div>
  );
};

export default ScreenWrapper;
