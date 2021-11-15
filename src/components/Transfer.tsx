/** @jsxImportSource theme-ui */

import {
  failure,
  pending,
  RemoteData,
  success,
  fold,
  initial,
  isInitial,
} from '@devexperts/remote-data-ts';
import { ITransactionPayload } from '@iota/iota.js';
import { ThemeUICSSObject } from '@theme-ui/css';
import { EitherAsync } from 'purify-ts';
import { useState } from 'react';
import {
  getBech32HRP,
  getSeed,
  isBech32,
  sendTransfer,
  TransactionResponse,
} from '../utils/iota';
import { useSettingsContext } from '../contexts/settingsContext';
import { useWalletContext } from '../contexts/walletContext';

// Components
import Button from './Button';
import ChevronButton from './Button/ChevronButton';
import Error from './Error';

type TransferProps = {
  mnemonic: string;
  styles?: ThemeUICSSObject;
};
const Transfer = ({ mnemonic, styles = {} }: TransferProps) => {
  const { node } = useSettingsContext();
  const {
    balance = 0,
    updateTransactionHistory,
    address: walletAddress,
  } = useWalletContext();
  const [transferAmount, setTransferAmount] = useState('');
  const [address, setAddress] = useState('');
  const [transfer, setTransfer] =
    useState<RemoteData<unknown, TransactionResponse>>(initial);
  const [helpText, setHelpText] = useState<string | undefined>(undefined);

  const send = () => {
    if (!isBech32(address)) {
      EitherAsync(() => getBech32HRP(node))
        .ifRight((hrp) =>
          setHelpText(`Please enter a valid address starting with '${hrp}'`)
        )
        .ifLeft(() => setHelpText('Please enter a valid address'))
        .run();

      return;
    }

    if (address === walletAddress) {
      setHelpText('You cannot send a transfer to your own address');
      return;
    }

    if (isNaN(parseFloat(transferAmount))) {
      setHelpText('Please enter a valid transfer amount');
      return;
    }

    if (parseFloat(transferAmount) <= 0) {
      setHelpText('Amount must be greater than 0');
      return;
    }

    if (balance < parseFloat(transferAmount) * 1000000) {
      setHelpText('Insufficient balance');
      return;
    }

    if (
      balance - parseFloat(transferAmount) * 1000000 < 1000000 &&
      balance - parseFloat(transferAmount) * 1000000 > 0
    ) {
      setHelpText('You cannot leave dust on the address');
      return;
    }

    setTransfer(pending);

    void EitherAsync(() =>
      sendTransfer(
        getSeed(mnemonic),
        address,
        parseFloat(transferAmount) * 1000000,
        node
      )
    )
      .ifRight((d) => {
        setTransfer(success(d));
        updateTransactionHistory(
          d.messageId,
          d.message.payload as ITransactionPayload
        );

        // Reset success message
        setTimeout(() => {
          setAddress('');
          setTransferAmount('');
          setTransfer(initial);
        }, 2000);
      })
      .ifLeft((e) => {
        console.log(e);
        setTransfer(failure(e));

        // Reset success message
        setTimeout(() => {
          setTransfer(initial);
        }, 2000);
      })
      .run();
  };

  return (
    <div
      sx={{
        display: 'flex',
        flexFlow: 'column',
        button: {
          mt: 2,
          ...(isInitial(transfer) ? {} : { ':hover': { cursor: 'default' } }),
        },
        ...styles,
        ...(helpText ? { mt: 2 } : {}),
      }}
    >
      <Error error={helpText} />
      <label>Address</label>
      <input
        type="text"
        value={address}
        onChange={(e) => {
          if (isInitial(transfer)) {
            setHelpText(undefined);
            setAddress(String(e.currentTarget.value));
          }
        }}
      />
      <label>Amount in Miota</label>
      <input
        type="text"
        value={transferAmount}
        onChange={(e) => {
          if (isInitial(transfer)) {
            setHelpText(undefined);
            setTransferAmount(String(e.currentTarget.value).replace(',', '.'));
          }
        }}
      />
      {fold<unknown, TransactionResponse, JSX.Element>(
        () => <ChevronButton onClick={send}>Send</ChevronButton>,
        () => <Button>Sending transfer...</Button>,
        () => {
          setTimeout(() => setTransfer(initial), 2500);
          return (
            <Button
              styles={{
                backgroundColor: 'red',
              }}
            >
              Could not send transfer!
            </Button>
          );
        },
        () => {
          setTimeout(() => setTransfer(initial), 2500);
          return (
            <Button
              styles={{
                backgroundColor: 'mint',
              }}
            >
              Transfer sent!
            </Button>
          );
        }
      )(transfer)}
    </div>
  );
};

export default Transfer;
