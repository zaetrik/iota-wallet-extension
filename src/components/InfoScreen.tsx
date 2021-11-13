/** @jsxImportSource theme-ui */

import {
  isFailure,
  isInitial,
  isPending,
  isSuccess,
} from '@devexperts/remote-data-ts';
import { useEffect } from 'react';
import { setUserAcceptedWarning } from '../utils/storage';
import useLoadable from '../utils/useLoadable';

// Components
import ChevronButton from './Button/ChevronButton';
import ScreenWrapper from './Screen/ScreenWrapper';

const InfoScreen = ({ onAccepted }: { onAccepted: () => void }) => {
  const [accepted, setAccepted] = useLoadable(setUserAcceptedWarning, false);

  useEffect(() => {
    if (isSuccess(accepted)) {
      onAccepted();
    }
  }, [accepted]);

  return (
    <ScreenWrapper styles={{ gap: 2 }}>
      <h1 sx={{ mt: 2 }}>WARNING</h1>
      <p>
        This wallet is a work in progress. There could be errors and bugs. Use
        at your own risk!
        <br />
        Please always make sure that you have your pass phrase backed up, so you
        can still access your funds even when this wallet may not work.
        <br />
        <br />
        This wallet is intended for small amounts of IOTA.{' '}
        <b>Please DO NOT use this as your main wallet!</b> View this as a wallet
        you can use for small transactions on the internet and deposit IOTA as
        needed.
      </p>
      <p>
        You can view further info and the source code{' '}
        <a
          sx={{ variant: 'text.body' }}
          href="https://github.com/zaetrik/iota-wallet-extension"
          target="_blank"
        >
          here
        </a>
        .
      </p>
      <ChevronButton
        styles={{ mt: 4 }}
        onClick={isInitial(accepted) ? setAccepted : undefined}
      >
        {isPending(accepted)
          ? 'Saving...'
          : isFailure(accepted)
          ? 'Something went wrong...'
          : 'I read the warning and acknowledge it'}
      </ChevronButton>
    </ScreenWrapper>
  );
};

export default InfoScreen;
