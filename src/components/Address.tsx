/** @jsxImportSource theme-ui */
import { fold3, isSuccess } from '@devexperts/remote-data-ts';
import { useEffect } from 'react';
import { getSeed, getAddress } from '../utils/iota';
import { useSettingsContext } from '../contexts/settingsContext';
import useLoadable from '../utils/useLoadable';
import { useWalletContext } from '../contexts/walletContext';

// Components
import CopyToClipBoard from './Button/CopyToClipboard';

const Address = ({ mnemonic }: { mnemonic: string }) => {
  const { node } = useSettingsContext();
  const [address, fetch] = useLoadable(() =>
    getAddress(getSeed(mnemonic), node)
  );
  const { updateAddress } = useWalletContext();

  useEffect(() => {
    if (isSuccess(address)) {
      updateAddress(address.value);
    }
  }, [address]);

  useEffect(() => fetch(), [node]);

  return (
    <div
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignContent: 'center',
        gap: 4,
      }}
    >
      {fold3<Error, string | Uint8Array, JSX.Element>(
        () => <p sx={{ fontSize: 1 }}>Loading...</p>,
        () => <p sx={{ fontSize: 1 }}>Could not fetch address</p>,
        (a) => <p sx={{ wordBreak: 'break-word', fontSize: 1 }}>{a}</p>
      )(address)}
      {isSuccess(address) && <CopyToClipBoard text={address.value} />}
    </div>
  );
};

export default Address;
