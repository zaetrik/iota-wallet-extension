import { ITransactionPayload, LedgerInclusionState } from '@iota/iota.js';
import { EitherAsync } from 'purify-ts';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { WorkerMessage } from '../worker';
import {
  getAddress,
  getSeed,
  getTransactionData,
  getTransactionForAddress,
  isMnemonic,
  Transaction,
} from '../utils/iota';
import { useSettingsContext } from './settingsContext';
import {
  createWallet,
  getEncryptedMnemonic,
  getTransactionsFromAddress,
  removeWallet,
  storeTransactions,
  updateStoredTransaction,
  WalletError,
} from '../utils/storage';

type WalletContextType = {
  createWallet: (
    mnemonicStr: string,
    walletPassword: string,
    walletName: string
  ) => void;
  unlockWallet: (walletPassword: string, walletName: string) => void;
  removeWallet: (walletName: string) => void;
  logout: () => void;
  updateBalance: (balance: number) => void;
  updateTransactionHistory: (
    messageId?: string,
    payload?: ITransactionPayload,
    ledgerInclusionState?: LedgerInclusionState
  ) => void;
  updateAddress: (addressBech32: string) => void;
  mnemonic?: string;
  error?: WalletError;
  walletName?: string;
  transactionHistory: Transaction[];
  balance?: number;
  address?: string;
  workerLoading: boolean;
};

const WalletContext = createContext<WalletContextType>({
  createWallet: () => {},
  unlockWallet: () => {},
  removeWallet: () => {},
  logout: () => {},
  updateTransactionHistory: () => {},
  updateBalance: () => {},
  updateAddress: () => {},
  address: undefined,
  mnemonic: undefined,
  walletName: undefined,
  error: undefined,
  transactionHistory: [],
  balance: undefined,
  workerLoading: false,
});

export const WalletContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { node } = useSettingsContext();

  const [worker] = useState(new Worker('worker.bundle.js'));
  const [workerLoading, setWorkerLoading] = useState(false);
  const [error, setError] = useState<WalletError | undefined>(undefined);

  const [mnemonic, setMnemonic] = useState<undefined | string>(undefined);
  const [walletName, setWalletName] = useState<undefined | string>(undefined);
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [balance, setBalance] = useState<number | undefined>(undefined);
  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>(
    []
  );

  const resetState = () => {
    setError(undefined);
    setWalletName(undefined);
    setMnemonic(undefined);
    setTransactionHistory([]);
    setBalance(undefined);
    setAddress(undefined);
  };

  const updateTransactionHistoryCtxFunc = (
    messageId?: string,
    payload?: ITransactionPayload,
    ledgerInclusionState?: LedgerInclusionState
  ) => {
    if (walletName && messageId && payload && address) {
      // Push a single transaction to storage
      EitherAsync(() =>
        getTransactionData(messageId, payload, ledgerInclusionState, node)
      )
        .mapLeft(() => WalletError.UNABLE_TO_GET_TRANSACTION_DETAILS)
        .chain(async (transactions) =>
          getTransactionForAddress(transactions, address)
        )
        .chain((transaction) =>
          updateStoredTransaction(walletName, transaction)
        )
        .ifRight(setTransactionHistory)
        .ifLeft(setError)
        .run();
    } else if (walletName && address) {
      // Get transactions from address
      getTransactionsFromAddress(address, walletName, node)
        .chain((transactions) => storeTransactions(walletName, transactions))
        .ifRight(setTransactionHistory)
        .ifLeft(setError)
        .run();
    }
  };

  const createWalletCtxFunc = (
    mnemonicStr: string,
    walletPassword: string,
    walletName: string
  ) => {
    resetState();

    if (!isMnemonic(mnemonicStr)) {
      setError(WalletError.MNEMONIC_INVALID);
      return;
    }

    if (!walletName) {
      setError(WalletError.MISSING_WALLET_NAME);
      return;
    }

    if (!walletPassword) {
      setError(WalletError.MISSING_WALLET_PASSWORD);
      return;
    }

    setWorkerLoading(true);
    worker.postMessage([
      'createWallet',
      { walletPassword, mnemonic: mnemonicStr, walletName },
    ]);
  };

  const removeWalletCtxFunc = (walletName: string) => {
    resetState();

    removeWallet(walletName).ifLeft(setError).run();
  };

  const unlockWalletCtxFunc = (walletPassword: string, walletName: string) => {
    resetState();
    setWorkerLoading(true);

    getEncryptedMnemonic(walletName)
      .ifRight((encryptedMnemonic) => {
        worker.postMessage([
          'unlockWallet',
          {
            walletPassword,
            encryptedMnemonic,
            walletName,
          },
        ]);
      })
      .ifLeft((e) => {
        setError(e);
        setWorkerLoading(false);
      })
      .run();
  };

  useEffect(() => {
    worker.onmessage = function (e: MessageEvent<WorkerMessage>) {
      const {
        type,
        encryptedMnemonic,
        decryptedMnemonic,
        walletName,
        error: workerError,
      } = e.data;

      const dataAvailable =
        encryptedMnemonic &&
        walletName &&
        decryptedMnemonic &&
        isMnemonic(decryptedMnemonic);

      const hasError = workerError || !isMnemonic(decryptedMnemonic ?? '');

      switch (type) {
        case 'unlockWallet':
          if (hasError) {
            setError(WalletError.UNABLE_TO_UNLOCK_WALLET);
            setWorkerLoading(false);
            break;
          }

          if (dataAvailable) {
            // Get latest transaction history when unlocking wallet
            EitherAsync(() => getAddress(getSeed(decryptedMnemonic), node))
              .mapLeft(() => WalletError.UNABLE_TO_GET_ADDRESS)
              .chain((address) =>
                getTransactionsFromAddress(address, walletName, node)
              )
              .chain((transactions) =>
                storeTransactions(walletName, transactions)
              )
              .ifRight(setTransactionHistory)
              .ifLeft(setError)
              .run()
              .then(() => setWorkerLoading(false));

            setMnemonic(decryptedMnemonic);
            setWalletName(walletName);
          }

          break;
        case 'createWallet':
          if (hasError) {
            setError(WalletError.UNABLE_TO_CREATE_WALLET);
            setWorkerLoading(false);
            break;
          }

          if (dataAvailable) {
            EitherAsync(() => getAddress(getSeed(decryptedMnemonic), node))
              .mapLeft(() => WalletError.UNABLE_TO_GET_ADDRESS)
              .chain((address) =>
                createWallet(walletName, address, encryptedMnemonic, node)
              )
              .ifRight((transactions) => {
                setTransactionHistory(transactions);
                setMnemonic(decryptedMnemonic);
                setWalletName(walletName);
              })
              .ifLeft(setError)
              .run()
              .then(() => setWorkerLoading(false));
          }

          break;
        default:
          setWorkerLoading(false);
          break;
      }
    };
  }, [worker, node]);

  return (
    <WalletContext.Provider
      value={{
        createWallet: createWalletCtxFunc,
        unlockWallet: unlockWalletCtxFunc,
        removeWallet: removeWalletCtxFunc,
        logout: resetState,
        updateBalance: setBalance,
        updateTransactionHistory: updateTransactionHistoryCtxFunc,
        updateAddress: setAddress,
        address,
        mnemonic,
        error,
        walletName,
        transactionHistory,
        balance,
        workerLoading,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = (): WalletContextType => {
  const ctx = useContext(WalletContext);

  if (!ctx.createWallet) {
    throw new Error(
      'useWalletContext has to be used within the WalletContextProvider'
    );
  }

  return ctx;
};
