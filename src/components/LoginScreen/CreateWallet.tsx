/** @jsxImportSource theme-ui */

import { useState } from 'react';
import { createMnemonic } from '../../utils/iota';
import { useWalletContext } from '../../contexts/walletContext';

// Components
import Button from '../Button';
import Error from '../Error';
import GoBack from '../Button/GoBack';
import NavBarWrapper from '../NavBarWrapper';
import Settings from '../Settings';
import ChevronButton from '../Button/ChevronButton';

type CreateWalletProps = {
  existingWallets: string[];
  goBack: () => void;
};
const CreateWallet = ({ goBack, existingWallets }: CreateWalletProps) => {
  const [walletPassword, setWalletPassword] = useState('');
  const [walletName, setWalletName] = useState('');
  const [mnemonic, setMnemonic] = useState(createMnemonic());
  const { createWallet, error, workerLoading } = useWalletContext();

  return (
    <>
      <NavBarWrapper>
        {existingWallets.length > 0 ? (
          <GoBack onClick={goBack} />
        ) : (
          <h1 sx={{ lineHeight: 2, color: 'mint' }}>IOTA Wallet</h1>
        )}

        <Settings />
      </NavBarWrapper>

      <Error error={error} />
      <label>Wallet name</label>
      <input
        type="text"
        value={walletName}
        onChange={(e) => setWalletName(String(e.currentTarget.value))}
      />
      <label>Wallet password</label>
      <input
        type="password"
        value={walletPassword}
        onChange={(e) => setWalletPassword(String(e.currentTarget.value))}
      />
      <label>Pass phrase</label>
      <input
        type="text"
        value={mnemonic}
        onChange={(e) => setMnemonic(String(e.currentTarget.value))}
      />
      <Button styles={{ mt: 2 }} onClick={() => setMnemonic(createMnemonic())}>
        Generate random pass phrase
      </Button>
      {workerLoading ? (
        <Button styles={{ mt: 6 }}>Creating wallet...</Button>
      ) : (
        <ChevronButton
          styles={{ mt: 6 }}
          onClick={() => {
            if (mnemonic && walletPassword) {
              createWallet(mnemonic.trim(), walletPassword, walletName);
              setWalletPassword('');
              setMnemonic('');
              setWalletName('');
            }
          }}
        >
          Create Wallet
        </ChevronButton>
      )}
    </>
  );
};

export default CreateWallet;
