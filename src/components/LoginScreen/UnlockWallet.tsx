/** @jsxImportSource theme-ui */

import { useState } from 'react';
import { useWalletContext } from '../../contexts/walletContext';

// Components
import Button from '../Button';
import ChevronButton from '../Button/ChevronButton';
import Error from '../Error';
import NavBarWrapper from '../NavBarWrapper';
import Settings from '../Settings';

type UnlockWalletProps = {
  existingWallets: string[];
  onCreateNewWallet: () => void;
};
const UnlockWallet = ({
  existingWallets,
  onCreateNewWallet,
}: UnlockWalletProps) => {
  const [walletPassword, setWalletPassword] = useState('');
  const [walletName, setWalletName] = useState(existingWallets[0]);
  const { unlockWallet, error, workerLoading } = useWalletContext();

  return (
    <>
      <NavBarWrapper>
        <h1 sx={{ lineHeight: 2, color: 'mint' }}>IOTA Wallet</h1>
        <Settings />
      </NavBarWrapper>
      <Error error={error} />
      <label>Wallets</label>
      <select
        value={walletName}
        onChange={(e) => setWalletName(String(e.currentTarget.value))}
      >
        {existingWallets.map((wallet) => (
          <option key={wallet} value={wallet}>
            {wallet}
          </option>
        ))}
      </select>
      <label>Wallet Password</label>
      <input
        type="password"
        value={walletPassword}
        onChange={(e) => setWalletPassword(String(e.currentTarget.value))}
      />
      {workerLoading ? (
        <Button styles={{ mt: 2 }}>Unlocking wallet...</Button>
      ) : (
        <ChevronButton
          styles={{ mt: 2 }}
          onClick={() => {
            unlockWallet(walletPassword, walletName);
            setWalletPassword('');
          }}
        >
          Unlock wallet
        </ChevronButton>
      )}

      <Button
        styles={{ mt: 100 }}
        onClick={workerLoading ? undefined : onCreateNewWallet}
      >
        Create a new wallet
      </Button>
    </>
  );
};

export default UnlockWallet;
