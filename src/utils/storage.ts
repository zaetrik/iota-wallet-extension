import { ITransactionPayload } from '@iota/iota.js';
import { EitherAsync, Left, Right } from 'purify-ts';
import {
  getAddressOutputs,
  getMessageMetaData,
  getOutputDetails,
  getTransactionData,
  getTransactionForAddress,
  Transaction,
} from './iota';

export enum WalletError {
  WALLET_NOT_FOUND = 'Wallet not found',
  WALLETS_NOT_FOUND = 'Wallets not found',
  UNABLE_TO_RETRIEVE = 'Could not retrieve wallets',
  WALLET_ALREADY_EXISTS = 'Wallet already exists',
  MNEMONIC_NOT_FOUND = 'Pass phrase not found',
  WALLET_NAME_NOT_ALLOWED = 'Wallet name not allowed',
  UNABLE_TO_DELETE_WALLET = 'Unable to delete wallet',
  MNEMONIC_INVALID = 'Pass phrase invalid',
  UNABLE_TO_UNLOCK_WALLET = 'Unable to unlock wallet',
  UNABLE_TO_CREATE_WALLET = 'Unable to create wallet',
  MISSING_WALLET_NAME = 'Wallet name missing',
  MISSING_WALLET_PASSWORD = 'Wallet password missing',
  UNABLE_TO_GET_STORED_TRANSACTIONS = 'Unable to get stored transactions',
  UNABLE_TO_STORE_TRANSACTION_HISTORY = 'Unable to store transaction history',
  UNABLE_TO_FETCH_ADDRESS_OUTPUTS = 'Unable to fetch address outputs',
  UNABLE_TO_GET_TRANSACTION_DETAILS = 'Unable to get transaction details',
  UNABLE_TO_UPDATE_STORED_TRANSACTION = 'Unable to update stored transaction',
  UNABLE_TO_GET_TRANSACTION_DATA_RELATED_TO_CURRENT_ADDRESS = 'Could not get transaction data related to current address',
  UNABLE_TO_GET_ADDRESS = 'Unable to get address',
}

export const keyExistsInStorage = <T extends unknown>(
  key: string
): EitherAsync<'key does not exist in storage', T> => {
  return EitherAsync(() => chrome?.storage.sync.get([key]))
    .chain(async (results) =>
      results[key]
        ? Right(results[key])
        : Left('key does not exist in storage' as const)
    )
    .mapLeft(() => 'key does not exist in storage');
};

/**
 * Get all transactions from the storage.
 */
export const getStoredTransactions = (
  walletName: string
): EitherAsync<WalletError, Transaction[]> => {
  return EitherAsync(async () => {
    const result = await chrome?.storage.local.get(
      `${walletName}-transactions`
    );

    const storedTransactions =
      (result[`${walletName}-transactions`] as Transaction[]) ?? [];

    return storedTransactions;
  }).mapLeft(() => WalletError.UNABLE_TO_GET_STORED_TRANSACTIONS);
};

/**
 * Update a transaction from the storage.
 */
export const updateStoredTransaction = (
  walletName: string,
  updatedTransaction: Transaction
): EitherAsync<WalletError, Transaction[]> => {
  return getStoredTransactions(walletName)
    .chain(async (storedTransactions) => {
      const indexOutdatedTransaction = storedTransactions.findIndex(
        (t) => t.messageId === updatedTransaction.messageId
      );

      const updatedTransactions =
        indexOutdatedTransaction === -1
          ? // Add the transaction if it doesn't exist yet
            [updatedTransaction, ...storedTransactions]
          : storedTransactions.map((t) =>
              t.messageId === updatedTransaction.messageId
                ? updatedTransaction
                : t
            );

      await chrome?.storage.local.set({
        [`${walletName}-transactions`]: updatedTransactions,
      });

      return getStoredTransactions(walletName);
    })
    .mapLeft(() => WalletError.UNABLE_TO_UPDATE_STORED_TRANSACTION);
};

/**
 * Store a list of transactions in the storage.
 */
export const storeTransactions = (
  walletName: string,
  transactions: Transaction[]
): EitherAsync<WalletError, Transaction[]> => {
  return getStoredTransactions(walletName)
    .map((storedTransactions) =>
      transactions.filter(
        (t) => !storedTransactions.find((st) => st.messageId === t.messageId)
      )
    )
    .chain(async (nonStoredTransactions) => {
      await EitherAsync.sequence(
        nonStoredTransactions.map((t) =>
          getStoredTransactions(walletName).ifRight((st) => {
            chrome?.storage.local.set({
              [`${walletName}-transactions`]: [t, ...st],
            });
          })
        )
      ).run();

      return getStoredTransactions(walletName);
    })
    .mapLeft((e) =>
      e === WalletError.UNABLE_TO_GET_STORED_TRANSACTIONS
        ? e
        : WalletError.UNABLE_TO_STORE_TRANSACTION_HISTORY
    );
};

/**
 * Get incoming transactions from outputs on an address.
 */
export const getTransactionsFromAddress = (
  address: string,
  walletName: string,
  node?: string,
  filterOutStoredTransactions = true
): EitherAsync<WalletError, Transaction[]> => {
  return EitherAsync(() => getAddressOutputs(address, node))
    .chain(({ outputIds }) =>
      // Get the details for the first 25 outputs.
      EitherAsync.sequence(
        outputIds
          .filter((_, i) => i < 25)
          .map((id) => EitherAsync(() => getOutputDetails(id, node)))
      )
    )
    .mapLeft(() => WalletError.UNABLE_TO_FETCH_ADDRESS_OUTPUTS)
    .chain(async (outputDetails) => {
      if (filterOutStoredTransactions) {
        // Filter out transactions that are already in storage to prevent unnecessary reequests to the node.
        return getStoredTransactions(walletName).map((storedTransactions) =>
          outputDetails.filter(
            (o) => !storedTransactions.find((t) => t.messageId === o.messageId)
          )
        );
      }
      return Right(outputDetails);
    })
    .chain((filteredOutputDetails) => {
      return EitherAsync.sequence(
        // Get the transaction details for every output.
        filteredOutputDetails.map((o) =>
          EitherAsync(async () => {
            const messageMetaData = await getMessageMetaData(o.messageId, node);

            return getTransactionData(
              o.messageId,
              messageMetaData.payload,
              messageMetaData.ledgerInclusionState,
              node
            );
          })
            .mapLeft(() => WalletError.UNABLE_TO_GET_TRANSACTION_DETAILS)
            .chain(async (transactions) =>
              getTransactionForAddress(transactions, address)
            )
        )
      );
    });
};

export const getWallets = (): EitherAsync<WalletError, string[]> => {
  return EitherAsync(() => chrome?.storage.sync.get(['wallets']))
    .mapLeft(() => WalletError.UNABLE_TO_RETRIEVE)
    .chain(async ({ wallets }) => {
      if (!wallets) {
        await chrome?.storage.sync.set({ wallets: [] });
        return Right([]);
      }

      return wallets && Array.isArray(wallets)
        ? Right(wallets)
        : Left(WalletError.WALLETS_NOT_FOUND);
    });
};

/**
 * Get a wallet from the storage.
 */
export const getWallet = (
  walletName: string
): EitherAsync<WalletError, string> => {
  return getWallets().chain(async (wallets: string[]) => {
    const wallet = wallets.find((w) => w === walletName);

    return wallet ? Right(wallet) : Left(WalletError.WALLET_NOT_FOUND);
  });
};

/**
 * Create a new wallet and store all needed data in the storage.
 */
export const createWallet = (
  walletName: string,
  address: string,
  encryptedMnemonic: string,
  node?: string
): EitherAsync<WalletError, Transaction[]> => {
  // Check if wallet already exists.
  return getWallet(walletName)
    .swap()
    .mapLeft(() => WalletError.WALLET_ALREADY_EXISTS)
    .chain(() => getWallets())
    .chain((wallets) =>
      // Check if there is already a key in storage with the wallet name.
      keyExistsInStorage(walletName)
        .swap()
        .mapLeft(() => WalletError.WALLET_NAME_NOT_ALLOWED)
        .map(() => wallets)
    )
    .map((wallets) =>
      // Add wallet name to storage.
      chrome?.storage.sync.set({ wallets: [...wallets, walletName] })
    )
    .map(() =>
      // Add encrypted mnemonic to storage.
      chrome?.storage.sync.set({
        [walletName]: encryptedMnemonic,
      })
    )
    .chain(() =>
      // Fetch initial transaction history for address.
      getTransactionsFromAddress(address, walletName, node)
    );
};

/**
 * Remove a wallet and its related data from storage.
 */
export const removeWallet = (
  walletName: string
): EitherAsync<WalletError, string[]> => {
  return getWallet(walletName)
    .chain(() => getWallets())
    .chain((wallets) => {
      const newWallets = wallets.filter((w) => w !== walletName);

      return chrome?.storage.sync
        .remove([walletName])
        .then(() => chrome?.storage.sync.set({ wallets: newWallets }))
        .then(() => chrome?.storage.local.remove(`${walletName}-transactions`))
        .then(() => Right(newWallets))
        .catch(() => Left(WalletError.UNABLE_TO_DELETE_WALLET));
    });
};

/**
 * Get an encrypted mnemonic from the storage.
 */
export const getEncryptedMnemonic = (
  walletName: string
): EitherAsync<WalletError, string> => {
  // Verify we have the wallet stored before accessing.
  return getWallet(walletName).chain(async (wallet) => {
    const result = await chrome?.storage.sync.get([wallet]);

    return result[wallet]
      ? Right(result[wallet] as string)
      : Left(WalletError.MNEMONIC_NOT_FOUND);
  });
};

/**
 * Set the acceptance status of the warning message.
 */
export const setUserAcceptedWarning = (
  accepted = true
): EitherAsync<unknown, void> => {
  return EitherAsync(() => chrome?.storage.sync.set({ userWarning: accepted }));
};

/**
 * Check if a user accepted the warning message.
 */
export const userAcceptedWarning = (): EitherAsync<unknown, boolean> => {
  return EitherAsync(
    () =>
      chrome?.storage.sync.get('userWarning') as Promise<{
        userWarning?: boolean;
      }>
  ).map((result) => result.userWarning === true);
};
