/** @jsxImportSource theme-ui */

import { ThemeUICSSObject } from '@theme-ui/css';
import { ReactNode } from 'react';
import { useWalletContext } from '../contexts/walletContext';

// Components
import GoBack from './Button/GoBack';

export const accountNameStyles: ThemeUICSSObject = {
  maxWidth: '16ch',
  lineHeight: 2.5,
  wordBreak: 'break-word',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  mr: 2,
};

const NavBarWrapper = ({
  children,
  onClose,
}: {
  children?: ReactNode;
  onClose?: () => void;
}) => {
  const { walletName } = useWalletContext();

  return (
    <div
      sx={{
        minHeight: 50,
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'space-between',
      }}
    >
      {onClose && (
        <div sx={{ display: 'flex', gap: 2, height: '100%' }}>
          <GoBack onClick={onClose} />
          <h1 sx={accountNameStyles}>{walletName}</h1>
        </div>
      )}
      {children}
    </div>
  );
};

export default NavBarWrapper;
