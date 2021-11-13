/** @jsxImportSource theme-ui */
import { fold3 } from '@devexperts/remote-data-ts';
import { useState } from 'react';
import { useWalletContext } from '../../contexts/walletContext';
import { getWallets, WalletError } from '../../utils/storage';
import useLoadable from '../../utils/useLoadable';

// Components
import CreateWallet from './CreateWallet';
import UnlockWallet from './UnlockWallet';
import ScreenWrapper from '../Screen/ScreenWrapper';
import Error from '../Error';

const LoginScreen = () => {
  const [createNewWallet, setCreateNewWallet] = useState(false);
  const [wallets] = useLoadable(getWallets);
  const { error } = useWalletContext();

  return (
    <ScreenWrapper>
      {fold3<WalletError, string[], JSX.Element>(
        () => <p>Loading wallets...</p>,
        () => <Error error={error} />,
        (existingWallets) =>
          existingWallets.length === 0 || createNewWallet ? (
            <CreateWallet
              existingWallets={existingWallets}
              goBack={() => setCreateNewWallet(false)}
            />
          ) : (
            <UnlockWallet
              existingWallets={existingWallets}
              onCreateNewWallet={() => setCreateNewWallet(true)}
            />
          )
      )(wallets)}
    </ScreenWrapper>
  );
};

export default LoginScreen;
