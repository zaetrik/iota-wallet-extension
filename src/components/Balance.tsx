/** @jsxImportSource theme-ui */
import {
  fold3,
  isInitial,
  isPending,
  isSuccess,
} from '@devexperts/remote-data-ts';
import { getSeed, getBalance } from '../utils/iota';
import useLoadable from '../utils/useLoadable';
import { keyframes } from '@emotion/react';
import { useEffect } from 'react';
import { useSettingsContext } from '../contexts/settingsContext';
import { useWalletContext } from '../contexts/walletContext';

// Components
import Button from './Button';
import Reload from './icons/Reload';
import IOTABalance from './IOTABalance';

const spinAnimation = keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});

const Balance = ({ mnemonic }: { mnemonic: string }) => {
  if (!mnemonic) return <></>;

  const { node } = useSettingsContext();
  const [balanceRequest, fetch] = useLoadable(() =>
    getBalance(getSeed(mnemonic), node)
  );
  const { updateBalance, balance } = useWalletContext();

  useEffect(() => fetch(), [node]);

  useEffect(() => {
    if (isSuccess(balanceRequest)) {
      updateBalance(balanceRequest.value);
    }

    const interval = setInterval(() => {
      if (!isPending(balanceRequest)) {
        fetch();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [mnemonic, balanceRequest]);

  return (
    <div sx={{ display: 'flex', gap: 1, flexFlow: 'column' }}>
      <div
        sx={{
          display: 'flex',
          width: '100%',
          alignContent: 'center',
          justifyContent: 'space-between',
          gap: 4,
        }}
      >
        {fold3<Error, number, JSX.Element>(
          () =>
            balance || balance === 0 ? (
              <IOTABalance balance={balance} />
            ) : (
              <p sx={{ fontSize: 4, lineHeight: 3 }}>Loading balance...</p>
            ),
          () =>
            balance || balance === 0 ? (
              <IOTABalance balance={balance} />
            ) : (
              <p sx={{ fontSize: 4, lineHeight: 3 }}>
                Could not fetch your balance!
              </p>
            ),
          (b) => <IOTABalance balance={b} />
        )(balanceRequest)}
        <Button
          styles={{
            backgroundColor: 'transparent',
            p: 0,
            ...(isPending(balanceRequest)
              ? { ':hover': { cursor: 'default' } }
              : {}),
          }}
          onClick={() => {
            if (!isPending(balanceRequest) && !isInitial(balanceRequest))
              fetch();
          }}
        >
          <Reload
            styles={{
              path: { fill: 'black' },
              ...(isPending(balanceRequest)
                ? {
                    animation: `${spinAnimation} 1.5s infinite`,
                  }
                : {}),
            }}
          />
        </Button>
      </div>
    </div>
  );
};

export default Balance;
