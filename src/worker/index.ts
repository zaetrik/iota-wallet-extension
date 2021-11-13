import { AES, enc } from 'crypto-js';

const encrypt = (data: string, password: string): Promise<string> =>
  new Promise((resolve) => {
    const encrypted = AES.encrypt(data, password);

    resolve(encrypted.toString());
  });

// Throws an error if the wrong password is used: 'Malformed UTF-8 data'
const decrypt = (encryptedData: string, password: string): Promise<string> =>
  new Promise((resolve) => {
    const decrypted = AES.decrypt(encryptedData, password).toString(enc.Utf8);

    resolve(decrypted);
  });

type WorkerParams = {
  encryptedMnemonic?: string;
  encryptedStorageKey?: string;
  walletPassword: string;
  mnemonic?: string;
};

export type WorkerMessage = {
  type: 'unlockWallet' | 'createWallet';
  walletName?: string;
  encryptedMnemonic?: string;
  decryptedMnemonic?: string;
  error?: Error;
};

onmessage = async function (e) {
  const type = e.data[0] as 'unlockWallet' | 'createWallet';

  const {
    encryptedMnemonic,
    walletPassword,
    mnemonic,
    encryptedStorageKey,
    ...rest
  } = e.data[1] as WorkerParams;

  try {
    if (!walletPassword) throw new Error('no wallet password set');

    if (type === 'unlockWallet' && encryptedMnemonic) {
      const decryptedMnemonic = await decrypt(
        encryptedMnemonic,
        walletPassword
      );

      postMessage({
        type,
        encryptedMnemonic: encryptedMnemonic,
        decryptedMnemonic: decryptedMnemonic,
        ...rest,
      });
    } else if (type === 'createWallet' && mnemonic) {
      const encryptedMnemonic = await encrypt(mnemonic, walletPassword);

      postMessage({
        type,
        encryptedMnemonic,
        decryptedMnemonic: mnemonic,
        ...rest,
      });
    }
  } catch (e) {
    postMessage({ type, error: e });
  }
};
