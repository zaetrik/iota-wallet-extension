/** @jsxImportSource theme-ui */

import { useWalletContext } from '../contexts/walletContext';

// Components
import Address from './Address';
import Balance from './Balance';
import NavBarWrapper from './NavBarWrapper';
import ScreenWrapper from './Screen/ScreenWrapper';
import Settings from './Settings';
import TransactionHistory from './TransactionHistory';
import Transfer from './Transfer';

const AccountView = ({ mnemonic }: { mnemonic: string }) => {
  const { logout, walletName } = useWalletContext();

  return (
    <ScreenWrapper styles={{ gap: 3 }}>
      <NavBarWrapper onClose={logout}>
        <div sx={{ display: 'flex', gap: 2 }}>
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
