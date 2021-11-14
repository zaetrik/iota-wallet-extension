import { Bip32Path, Bip39 } from '@iota/crypto.js';
import {
  Bech32Helper,
  Ed25519Address,
  Ed25519Seed,
  ED25519_ADDRESS_TYPE,
  getBalance as getBalanceIOTA,
  INodeInfo,
  LedgerInclusionState,
  REFERENCE_UNLOCK_BLOCK_TYPE,
  send,
  SIGNATURE_UNLOCK_BLOCK_TYPE,
  ISignatureUnlockBlock,
  SingleNodeClient,
  ITransactionPayload,
  IMessage,
  IAddressOutputsResponse,
  ISigLockedSingleOutput,
  ISigLockedDustAllowanceOutput,
} from '@iota/iota.js';
import { Converter } from '@iota/util.js';
import axios from 'axios';
import { Either, Left, Right } from 'purify-ts';
import { WalletError } from './storage';

const API_ENDPOINT = 'https://chrysalis-nodes.iota.org';

/**
 * Generate a random mnemonic.
 */
export const createMnemonic = (): string => {
  const randomMnemonic = Bip39.randomMnemonic();

  return randomMnemonic;
};

/**
 * Get seed from mnemonic.
 */
export const getSeed = (mnemonic = createMnemonic()): Ed25519Seed => {
  const baseSeed = Ed25519Seed.fromMnemonic(mnemonic);

  return baseSeed;
};

// Store node info in cache to prevent unnecessary request to the node.
let nodeInfoCache = {} as INodeInfo & { nodeURL: string };

/**
 * Fetch the node info.
 */
const getNodeInfo = async (node = API_ENDPOINT): Promise<INodeInfo> => {
  const client = new SingleNodeClient(node);

  return nodeInfoCache.bech32HRP && nodeInfoCache.nodeURL === node
    ? nodeInfoCache
    : client.info().then((info) => {
        nodeInfoCache = { ...info, nodeURL: node };
        return info;
      });
};

/**
 * Transform an address, e.g. ED25519, to an Bech32 address.
 */
export const toBech32Address = (
  address: string | Uint8Array,
  type = ED25519_ADDRESS_TYPE,
  node = API_ENDPOINT
): Promise<string> => {
  return getNodeInfo(node).then((nodeInfo) =>
    Bech32Helper.toBech32(
      type,
      typeof address === 'string' ? Converter.hexToBytes(address) : address,
      nodeInfo.bech32HRP
    )
  );
};

/**
 * Get an address for a seed.
 */
export const getAddress = (
  seed: Ed25519Seed,
  node = API_ENDPOINT
): Promise<string> => {
  const path = new Bip32Path("m/44'/4218'/0'/0'/0'");

  const walletAddressSeed = seed.generateSeedFromPath(path);
  const walletEd25519Address = new Ed25519Address(
    walletAddressSeed.keyPair().publicKey
  );
  const newAddress = walletEd25519Address.toAddress();

  return toBech32Address(newAddress, ED25519_ADDRESS_TYPE, node);
};

/**
 * Fetch current balance for a seed.
 */
export const getBalance = (
  seed: Ed25519Seed,
  node = API_ENDPOINT
): Promise<number> => {
  const client = new SingleNodeClient(node);

  return getBalanceIOTA(client, seed, 0);
};

export type TransactionResponse = {
  messageId: string;
  message: IMessage;
};
/**
 * Send a transfer to an address.
 */
export const sendTransfer = (
  seed: Ed25519Seed,
  addressBech32: string, // Bech32 format
  amount: number,
  node = API_ENDPOINT
): Promise<TransactionResponse> => {
  const client = new SingleNodeClient(node, {});

  return send(
    client,
    seed,
    0,
    addressBech32,
    amount,
    undefined,
    // Make sure to look up enough addresses, so we find the one with a balance on it.
    {
      startIndex: 0,
      zeroCount: 50,
    }
  );
};

/**
 * Check if an address could be in Bech32 format.
 */
export const isBech32 = (addressBech32: string): boolean => {
  return Bech32Helper.matches(addressBech32, nodeInfoCache.bech32HRP ?? 'iota');
};

/**
 * Check if a string could be a valid pass phrase.
 */
export const isMnemonic = (str: string): boolean => {
  return str.split(' ').length === 24 || str.split(' ').length === 25;
};

export type NodeMessageMetaData = {
  networkId: string;
  parentMessageIds: string[];
  nonce: string;
  payload: ITransactionPayload;
};

/**
 * Get meta data for a message.
 */
export const getMessageMetaData = async (
  messageId: string,
  node = API_ENDPOINT
): Promise<
  NodeMessageMetaData & { ledgerInclusionState?: LedgerInclusionState }
> => {
  const client = new SingleNodeClient(node, {});

  const {
    data: { data: messageMetaData },
  } = await axios.get<{}, { data: { data: NodeMessageMetaData } }>(
    `${node}/api/v1/messages/${messageId}`
  );

  const { ledgerInclusionState } = await client.messageMetadata(messageId);

  return { ...messageMetaData, ledgerInclusionState };
};

/**
 * Get the outputs for an address.
 */
export const getAddressOutputs = async (
  addressBech32: string,
  node = API_ENDPOINT
): Promise<IAddressOutputsResponse> => {
  const client = new SingleNodeClient(node, {});

  const addressOutputs = await client.addressOutputs(
    addressBech32,
    undefined,
    true
  );

  return addressOutputs;
};

export type NodeOutputDetails = {
  messageId: string;
  transactionId: string;
  outputIndex: number;
  isSpent: boolean;
  ledgerIndex: number;
  output: (ISigLockedSingleOutput | ISigLockedDustAllowanceOutput)[];
};

/**
 * Get the details for an output.
 */
export const getOutputDetails = async (
  outputId: string,
  node = API_ENDPOINT
): Promise<NodeOutputDetails> => {
  const {
    data: { data: output },
  } = await axios.get<{}, { data: { data: NodeOutputDetails } }>(
    `${node}/api/v1/outputs/${outputId}`
  );

  return output;
};

export type Transaction = {
  fromAddress: string;
  toAddress: string;
  amount: number;
  messageId: string;
  ledgerInclusionState?: LedgerInclusionState;
};

/**
 * Get the transaction details for a message.
 */
export const getTransactionData = async (
  messageId: string,
  payload: ITransactionPayload,
  ledgerInclusionState?: LedgerInclusionState,
  node = API_ENDPOINT
): Promise<Transaction[]> => {
  const { unlockBlocks } = payload;
  const signatureBlocks = unlockBlocks.reduce((sigBlocks, block) => {
    if (block.type === SIGNATURE_UNLOCK_BLOCK_TYPE) {
      return [...sigBlocks, block as ISignatureUnlockBlock];
    } else if (block.type === REFERENCE_UNLOCK_BLOCK_TYPE) {
      return unlockBlocks[block.reference]
        ? [...sigBlocks, unlockBlocks[block.reference] as ISignatureUnlockBlock]
        : sigBlocks;
    }

    return sigBlocks;
  }, [] as ISignatureUnlockBlock[]);

  const unlockAddresses = signatureBlocks.map((block) => {
    return Converter.bytesToHex(
      new Ed25519Address(
        Converter.hexToBytes(block.signature.publicKey)
      ).toAddress()
    );
  });

  const bech32SenderAddresses = await Promise.all(
    unlockAddresses.map((address) =>
      toBech32Address(address, ED25519_ADDRESS_TYPE, node)
    )
  );

  const bech32RecipientAddresses = await Promise.all(
    payload.essence.outputs.map((output) =>
      toBech32Address(output.address.address, ED25519_ADDRESS_TYPE, node)
    )
  );

  const transactions: Transaction[] = bech32RecipientAddresses.reduce(
    (t, address, i) => {
      if (
        // Check that we have a recipient and amount for every sender address.
        !bech32SenderAddresses[0] ||
        !payload.essence.outputs[i].amount ||
        // Ignore the case where the remainder of the balance is sent back to the sender address.
        address === bech32SenderAddresses[0]
      ) {
        return t;
      }

      return [
        ...t,
        {
          fromAddress: bech32SenderAddresses[0],
          toAddress: address,
          amount: payload.essence.outputs[i].amount,
          messageId,
          ledgerInclusionState,
        },
      ];
    },
    [] as Transaction[]
  );

  return transactions;
};

/**
 * Get the transaction related to the given address.
 */
export const getTransactionForAddress = (
  transactions: Transaction[],
  address?: string
): Either<WalletError, Transaction> => {
  const transaction = transactions.find(
    (t) => t.fromAddress === address || t.toAddress === address
  );

  return transaction
    ? Right(transaction)
    : Left(
        WalletError.UNABLE_TO_GET_TRANSACTION_DATA_RELATED_TO_CURRENT_ADDRESS
      );
};

/**
 * Check if current node is connected to the dev net.
 */
export const isDevNet = async (node = API_ENDPOINT): Promise<boolean> => {
  const { bech32HRP } = await getNodeInfo(node);

  return bech32HRP === 'atoi';
};

/**
 * Get the human readable part of bech32 addresses for the current node.
 */
export const getBech32HRP = async (node = API_ENDPOINT): Promise<string> => {
  const { bech32HRP } = await getNodeInfo(node);

  return bech32HRP;
};
