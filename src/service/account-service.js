import atomicClient from '../util/atomic-client.js';

export const getAssetCount = async (accountName) => {
  const account = await atomicClient.getAccount(accountName);

  return account.collections.reduce(
    (count, collection) => count + Number(collection.assets),
    0
  );
};

export const findSentTransfers = async (sender, after) => {
  return await atomicClient.getTransfers({ sender, after });
};
