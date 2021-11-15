/** @jsxImportSource theme-ui */

import { useEffect, useState } from 'react';
import { useWalletContext } from '../contexts/walletContext';
import {
  getBech32HRP,
  getMessageMetaData,
  isDevNet as checkIfDevNet,
  Transaction,
} from '../utils/iota';
import { useSettingsContext } from '../contexts/settingsContext';
import { EitherAsync } from 'purify-ts';
import useLoadable from '../utils/useLoadable';
import { fold3 } from '@devexperts/remote-data-ts';

// Compoents
import Button from './Button';
import History from './icons/History';
import Screen from './Screen/Screen';
import Settings from './Settings';
import NavBarWrapper from './NavBarWrapper';
import Error from './Error';
import Badge from './Badge';
import IOTABalance from './IOTABalance';

type TransactionAddressProps = {
  type: 'from' | 'to';
  address: string;
  isDevNet: boolean;
};
const TransactionAddress = ({
  type,
  address,
  isDevNet,
}: TransactionAddressProps) => {
  return (
    <div sx={{ display: 'flex', gap: 2 }}>
      <Badge
        styles={{
          backgroundColor: 'grey',
          textTransform: 'uppercase',
          minWidth: '8ch',
          px: 0,
        }}
      >
        {type}
      </Badge>
      <a
        href={`https://explorer.iota.org/${
          isDevNet ? 'devnet' : 'mainnet'
        }/addr/${address}`}
        target="_blank"
        sx={{ wordBreak: 'break-word' }}
      >
        {address}
      </a>
    </div>
  );
};

type TransactionMessageProps = { messageId: string; isDevNet: boolean };
const TransactionMessage = ({
  messageId,
  isDevNet,
}: TransactionMessageProps) => {
  return (
    <div sx={{ display: 'flex', gap: 2 }}>
      <Badge
        styles={{
          backgroundColor: 'grey',
          minWidth: '8ch',
          px: 0,
        }}
      >
        MSG
      </Badge>
      <a
        href={`https://explorer.iota.org/${
          isDevNet ? 'devnet' : 'mainnet'
        }/message/${messageId}`}
        target="_blank"
        sx={{ wordBreak: 'break-word' }}
      >
        {messageId}
      </a>
    </div>
  );
};

type TransactionProps = {
  transaction: Transaction;
  isDevNet: boolean;
};
const Transaction = ({ transaction, isDevNet }: TransactionProps) => {
  const { node } = useSettingsContext();
  const { address, updateTransactionHistory } = useWalletContext();

  useEffect(() => {
    // If we don't have the final transaction meta data try to fetch it again.
    if (transaction.ledgerInclusionState === 'pending') {
      EitherAsync(() => getMessageMetaData(transaction.messageId, node))
        .ifRight((messageMetaData) => {
          return updateTransactionHistory(
            transaction.messageId,
            messageMetaData.payload,
            messageMetaData.ledgerInclusionState
          );
        })
        .run();
    }
  }, [node]);

  const incomingTransaction = address === transaction.toAddress;

  return (
    <div
      sx={{
        py: 2,
        pr: 2,
        gap: 2,
        display: 'flex',
        flexFlow: 'column',
      }}
    >
      <div sx={{ display: 'flex', gap: 2 }}>
        <Badge
          styles={{ backgroundColor: incomingTransaction ? 'mint' : 'red' }}
        >
          <div sx={{ display: 'flex' }}>
            {incomingTransaction ? '+' : '-'}
            <IOTABalance
              styles={{ fontSize: 0 }}
              balance={transaction.amount}
            />
          </div>
        </Badge>

        {transaction.ledgerInclusionState && (
          <Badge
            styles={{
              backgroundColor:
                transaction.ledgerInclusionState === 'conflicting'
                  ? 'orange'
                  : transaction.ledgerInclusionState === 'noTransaction' ||
                    transaction.ledgerInclusionState === 'pending'
                  ? 'black'
                  : 'mint',
            }}
          >
            {' '}
            {transaction.ledgerInclusionState}
          </Badge>
        )}
      </div>

      <TransactionAddress
        isDevNet={isDevNet}
        type={incomingTransaction ? 'from' : 'to'}
        address={
          incomingTransaction ? transaction.fromAddress : transaction.toAddress
        }
      />

      <TransactionMessage
        messageId={transaction.messageId}
        isDevNet={isDevNet}
      />
    </div>
  );
};

const OpenHistory = ({ onClose }: { onClose: () => void }) => {
  const { node } = useSettingsContext();
  const { transactionHistory, error, walletName } = useWalletContext();
  const [isDevNet] = useLoadable(() => checkIfDevNet(node));
  const [bech32HRP] = useLoadable(() => getBech32HRP(node));

  return (
    <Screen>
      <NavBarWrapper onClose={onClose}>
        <Settings />
      </NavBarWrapper>
      <Error error={error} />

      <div
        sx={{ overflow: 'auto', display: 'flex', flexFlow: 'column', gap: 3 }}
      >
        {transactionHistory.length === 0 && <p>Nothing here yet</p>}
        {fold3<Error, boolean, JSX.Element>(
          () => <p>Loading...</p>,
          () => <Error error="Unable to get transaction history" />,
          (d) =>
            fold3<Error, string, JSX.Element>(
              () => <p>Loading...</p>,
              () => <Error error="Unable to get transaction history" />,
              (hrp) => (
                <>
                  {transactionHistory
                    .filter(
                      (t) =>
                        t.fromAddress.startsWith(hrp) &&
                        t.toAddress.startsWith(hrp)
                    )
                    .map((t) => (
                      <Transaction
                        key={t.messageId}
                        transaction={t}
                        isDevNet={d}
                      />
                    ))}
                </>
              )
            )(bech32HRP)
        )(isDevNet)}
      </div>
    </Screen>
  );
};

const ClosedHistory = ({ onOpen }: { onOpen: () => void }) => {
  return (
    <Button
      styles={{ p: 0, backgroundColor: 'transparent', path: { fill: 'black' } }}
      onClick={onOpen}
    >
      <History />
    </Button>
  );
};

const TransactionHistory = () => {
  const [showHistory, setShowHistory] = useState(false);
  const { updateTransactionHistory } = useWalletContext();

  useEffect(() => {
    if (showHistory) {
      updateTransactionHistory();
    }
  }, [showHistory]);

  return showHistory ? (
    <OpenHistory onClose={() => setShowHistory(false)} />
  ) : (
    <ClosedHistory onOpen={() => setShowHistory(true)} />
  );
};

export default TransactionHistory;
