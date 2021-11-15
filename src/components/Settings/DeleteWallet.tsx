/** @jsxImportSource theme-ui */

import { useState } from 'react';
import { useWalletContext } from '../../contexts/walletContext';

// Components
import Button from '../Button';
import Screen from '../Screen/Screen';
import Copy from '../icons/Copy';
import NavBarWrapper from '../NavBarWrapper';

type DeleteWalletProps = {
  onClose: () => void;
};
const DeleteWallet = ({ onClose }: DeleteWalletProps) => {
  const { walletName, mnemonic, removeWallet } = useWalletContext();
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  const isLoggedIn = walletName && mnemonic;
  if (!isLoggedIn) return <></>;

  return (
    <Screen>
      <NavBarWrapper onClose={onClose} />
      <h1>Are you sure you want to delete the wallet "{walletName}"?</h1>
      <Button
        styles={{
          backgroundColor: copiedToClipboard ? 'mint' : 'primary',
          ...(copiedToClipboard ? { ':hover': {}, cursor: 'default' } : {}),
          ':hover': {
            color: 'whiteLight',
            path: { fill: 'whiteLight' },
          },
        }}
        onClick={() => {
          if (!copiedToClipboard) {
            navigator.clipboard.writeText(mnemonic);
            setCopiedToClipboard(true);

            setTimeout(() => setCopiedToClipboard(false), 2000);
          }
        }}
      >
        {copiedToClipboard ? (
          'Copied to clipboard!'
        ) : (
          <>
            Copy pass phrase{' '}
            <Copy
              styles={{
                ml: 2,
              }}
            />
          </>
        )}
      </Button>
      <div sx={{ display: 'flex', gap: 1 }}>
        <Button onClick={() => removeWallet(walletName)}>YES</Button>
        <Button onClick={onClose}>NO</Button>
      </div>
    </Screen>
  );
};

export default DeleteWallet;
