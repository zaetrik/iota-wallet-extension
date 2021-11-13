/** @jsxImportSource theme-ui */

import { useState } from 'react';
import { useWalletContext } from '../../contexts/walletContext';
import { useSettingsContext } from '../../contexts/settingsContext';

// Components
import GoBack from '../Button/GoBack';
import Button from '../Button';
import Trash from '../icons/Trash';
import SettingsIcon from '../icons/Settings';
import Screen from '../Screen/Screen';
import DeleteWallet from './DeleteWallet';
import NodeSettings from './NodeSettings';
import Error from '../Error';
import ChevronButton from '../Button/ChevronButton';
import CopyToClipBoard from '../Button/CopyToClipboard';

const ClosedSettings = ({ onOpen }: { onOpen: () => void }) => {
  return (
    <Button
      onClick={onOpen}
      styles={{
        backgroundColor: 'transparent',
        p: 0,
        path: { fill: 'black', stroke: 'black' },
        svg: { height: 50, width: 50 },
      }}
    >
      <SettingsIcon />
    </Button>
  );
};

const OpenSettings = ({ onClose }: { onClose: () => void }) => {
  const { walletName, mnemonic } = useWalletContext();
  const { error } = useSettingsContext();

  const [showDeleteWallet, setShowDeleteWallet] = useState(false);
  const [showNodeSettings, setShowNodeSettings] = useState(false);

  const isLoggedIn = walletName && mnemonic;

  const donationAddress =
    'iota1qr07gc8ugjjcfxlvf3g47m9j22y33ssr5ld4dmettugw68q5wjr6knt6aeh';

  return (
    <Screen>
      <GoBack onClick={onClose} styles={{ pt: 2 }} />
      <Error error={error} />
      <h1>Settings</h1>
      <ChevronButton onClick={() => setShowNodeSettings(true)}>
        Change node
      </ChevronButton>
      {showNodeSettings && (
        <NodeSettings onClose={() => setShowNodeSettings(false)} />
      )}
      {isLoggedIn && (
        <>
          <Button
            styles={{
              ':hover': {
                color: 'whiteLight',
                path: { fill: 'whiteLight' },
              },
            }}
            onClick={() => setShowDeleteWallet(true)}
          >
            Delete wallet{' '}
            <Trash
              styles={{
                ml: 2,
              }}
            />
          </Button>

          {showDeleteWallet && (
            <DeleteWallet onClose={() => setShowDeleteWallet(false)} />
          )}
        </>
      )}
      <ChevronButton
        buttonType="link"
        href="https://github.com/zaetrik/iota-wallet-extension"
        target="_blank"
      >
        GitHub repository
      </ChevronButton>
      <div sx={{ wordBreak: 'break-word', mt: 4 }}>
        <p>
          If you like this wallet, please consider donating to the following
          IOTA address :)
        </p>
        <div sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <p>
            <b>{donationAddress}</b>
          </p>
          <CopyToClipBoard text={donationAddress} />
        </div>
      </div>
    </Screen>
  );
};

const Settings = () => {
  const [showSettings, setShowSettings] = useState(false);

  return showSettings ? (
    <OpenSettings onClose={() => setShowSettings(false)} />
  ) : (
    <ClosedSettings onOpen={() => setShowSettings(true)} />
  );
};

export default Settings;
