import { AES, enc, lib, PBKDF2, algo } from 'crypto-js';

const SALT_LENGTH = 16;
const IV_LENGTH = 16;

const decrypt = (encryptedDataBase64: string, password: string): string => {
  const encrypted = enc.Base64.parse(encryptedDataBase64);

  const salt = lib.WordArray.create(encrypted.words.slice(0, SALT_LENGTH / 4));

  const iv = lib.WordArray.create(
    encrypted.words.slice(0 + SALT_LENGTH / 4, (SALT_LENGTH + IV_LENGTH) / 4)
  );

  const key = PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 10000,
    hasher: algo.SHA256,
  });

  const encryptedDataPart = lib.WordArray.create(
    encrypted.words.slice((SALT_LENGTH + IV_LENGTH) / 4)
  ).toString(enc.Base64);

  const decrypted = AES.decrypt(encryptedDataPart, key, {
    iv,
  }).toString(enc.Utf8);

  return decrypted;
};

const encrypt = (data: string, password: string): string => {
  const salt = lib.WordArray.random(SALT_LENGTH);
  const iv = lib.WordArray.random(IV_LENGTH);

  const key = PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 10000,
    hasher: algo.SHA256,
  });

  const encryptedData = AES.encrypt(data, key, {
    iv: iv,
  }).ciphertext;

  const encrypted = lib.WordArray.create()
    .concat(salt)
    .concat(iv)
    .concat(encryptedData);

  return encrypted.toString(enc.Base64);
};

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
      const decryptedMnemonic = decrypt(encryptedMnemonic, walletPassword);

      postMessage({
        type,
        encryptedMnemonic: encryptedMnemonic,
        decryptedMnemonic: decryptedMnemonic,
        ...rest,
      });
    } else if (type === 'createWallet' && mnemonic) {
      const encryptedMnemonic = encrypt(mnemonic, walletPassword);

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
