/** @jsxImportSource theme-ui */

import { ThemeUICSSObject } from '@theme-ui/css';
import { ReactNode } from 'react';

const Badge = ({
  children,
  styles = {},
}: {
  children: ReactNode;
  styles?: ThemeUICSSObject;
}) => {
  return (
    <p
      sx={{
        width: 'fit-content',
        py: 1,
        px: 2,
        textAlign: 'center',
        borderRadius: '5px',
        height: 'min-content',
        fontSize: 0,
        color: 'white',
        ...styles,
      }}
    >
      {children}
    </p>
  );
};

export default Badge;
