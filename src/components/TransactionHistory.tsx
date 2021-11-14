/** @jsxImportSource theme-ui */

import { useEffect, useState } from 'react';
import { useWalletContext } from '../contexts/walletContext';
import { getMessageMetaData, Transaction } from '../utils/iota';
import { useSettingsContext } from '../contexts/settingsContext';
import { EitherAsync } from 'purify-ts';
import { accountNameStyles } from './AccountView';

// Compoents
import Button from './Button';
import History from './icons/History';
import GoBack from './Button/GoBack';
import Screen from './Screen/Screen';
import Settings from './Settings';
import NavBarWrapper from './NavBarWrapper';
import Error from './Error';
import Badge from './Badge';

const TransactionAddress = ({
  type,
  address,
}: {
  type: 'from' | 'to';
  address: string;
}) => {
  return (
    <div sx={{ display: 'flex', flexFlow: 'column', gap: 1 }}>
      <p sx={{ variant: 'text.subheading', fontWeight: 'regular' }}>{type}:</p>
      <a
        href={`https://explorer.iota.org/mainnet/addr/${address}`}
        target="_blank"
        sx={{ wordBreak: 'break-word' }}
      >
        {address}
      </a>
    </div>
  );
};

const TransactionMessage = ({ messageId }: { messageId: string }) => {
  return (
    <div sx={{ display: 'flex', flexFlow: 'column', gap: 1 }}>
      <p sx={{ variant: 'text.subheading', fontWeight: 'regular' }}>Message:</p>
      <a
        href={`https://explorer.iota.org/mainnet/message/${messageId}`}
        target="_blank"
        sx={{ wordBreak: 'break-word' }}
      >
        {messageId}
      </a>
    </div>
  );
};

const Transaction = ({ transaction }: { transaction: Transaction }) => {
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
        p: 2,
        gap: 2,
        display: 'flex',
        flexFlow: 'column',
        borderBottom: '1px solid black',
      }}
    >
      <TransactionAddress
        type={incomingTransaction ? 'from' : 'to'}
        address={
          incomingTransaction ? transaction.fromAddress : transaction.toAddress
        }
      />

      <TransactionMessage messageId={transaction.messageId} />

      <div sx={{ display: 'flex', gap: 2 }}>
        <Badge
          styles={{ backgroundColor: incomingTransaction ? 'mint' : 'red' }}
        >
          {incomingTransaction ? '+' : '-'}
          {(transaction.amount / 1000000).toFixed(2)} Mi
        </Badge>

        {transaction.ledgerInclusionState && (
          <Badge
            styles={{
              backgroundColor:
                transaction.ledgerInclusionState === 'conflicting'
                  ? 'yellow'
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
    </div>
  );
};

const OpenHistory = ({ onClose }: { onClose: () => void }) => {
  const { transactionHistory, error, walletName } = useWalletContext();

  return (
    <Screen>
      <NavBarWrapper>
        <div sx={{ display: 'flex', gap: 2 }}>
          <GoBack onClick={onClose} />
          <h1 sx={accountNameStyles}>{walletName}</h1>
        </div>
        <Settings />
      </NavBarWrapper>
      <Error error={error} />
      <h1>Transaction history</h1>
      <div sx={{ overflow: 'auto' }}>
        {transactionHistory.length === 0 && <p>Nothing here yet</p>}
        {transactionHistory.map((t) => (
          <Transaction key={t.messageId} transaction={t} />
        ))}
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
