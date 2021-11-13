/** @jsxImportSource theme-ui */
import { ThemeUICSSObject } from '@theme-ui/css';
import { ReactNode } from 'react';

const Screen = ({
  children,
  styles = {},
}: {
  children: ReactNode;
  styles?: ThemeUICSSObject;
}) => {
  return (
    <div
      sx={{
        zIndex: 1,
        backgroundColor: 'white',
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        display: 'flex',
        flexFlow: 'column',
        gap: 3,
        ...styles,
      }}
    >
      {children}
    </div>
  );
};

export default Screen;
