/** @jsxImportSource theme-ui */

import { ThemeUICSSObject } from '@theme-ui/css';
import { useWalletContext } from '../contexts/walletContext';

// Components
import Address from './Address';
import Balance from './Balance';
import GoBack from './Button/GoBack';
import NavBarWrapper from './NavBarWrapper';
import ScreenWrapper from './Screen/ScreenWrapper';
import Settings from './Settings';
import TransactionHistory from './TransactionHistory';
import Transfer from './Transfer';

export const accountNameStyles: ThemeUICSSObject = {
  maxWidth: '11ch',
  lineHeight: 2,
  color: 'mint',
  wordBreak: 'break-word',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  mr: 2,
};

const AccountView = ({ mnemonic }: { mnemonic: string }) => {
  const { logout, walletName } = useWalletContext();

  return (
    <ScreenWrapper styles={{ gap: 3 }}>
      <NavBarWrapper>
        <div sx={{ display: 'flex', gap: 2 }}>
          <GoBack onClick={logout} />
          <h1 sx={accountNameStyles}>{walletName}</h1>
        </div>
        <div sx={{ display: 'flex', gap: 1 }}>
          <TransactionHistory />
          <Settings />
        </div>
      </NavBarWrapper>

      <Balance mnemonic={mnemonic} />
      <Address mnemonic={mnemonic} />
      <Transfer styles={{ mt: 6 }} mnemonic={mnemonic} />
    </ScreenWrapper>
  );
};

export default AccountView;
