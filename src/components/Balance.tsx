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

const spinAnimation = keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});

const Balance = ({ mnemonic }: { mnemonic: string }) => {
  if (!mnemonic) return <></>;

  const { node } = useSettingsContext();
  const [balance, fetch] = useLoadable(() =>
    getBalance(getSeed(mnemonic), node)
  );
  const { updateBalance } = useWalletContext();

  useEffect(() => fetch(), [node]);

  useEffect(() => {
    if (isSuccess(balance)) {
      updateBalance(balance.value);
    }

    const interval = setInterval(() => {
      if (!isPending(balance)) {
        fetch();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [mnemonic, balance]);

  return (
    <div sx={{ display: 'flex', gap: 1, flexFlow: 'column' }}>
      <div
        sx={{
          display: 'flex',
          gap: 1,
          width: '100%',
          alignContent: 'center',
        }}
      >
        <h1>Balance</h1>
        <Button
          styles={{
            backgroundColor: 'transparent',
            p: 0,
            ...(isPending(balance) ? { ':hover': { cursor: 'default' } } : {}),
          }}
          onClick={() => {
            if (!isPending(balance) && !isInitial(balance)) fetch();
          }}
        >
          <Reload
            styles={{
              path: { fill: 'black' },
              ...(isPending(balance)
                ? {
                    animation: `${spinAnimation} 1.5s infinite`,
                  }
                : {}),
            }}
          />
        </Button>
      </div>

      {fold3<Error, number, JSX.Element>(
        () => <p sx={{ fontSize: 3 }}>Loading balance...</p>,
        () => <p sx={{ fontSize: 3 }}>Could not fetch your balance!</p>,
        (b) => <p sx={{ fontSize: 3 }}>{b / 1000000} Mi</p>
      )(balance)}
    </div>
  );
};

export default Balance;
