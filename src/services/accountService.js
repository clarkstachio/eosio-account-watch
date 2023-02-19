import atomicClient from '../util/atomic-client.js';

export const getInventoryAssetCount = async (accountName) => {
  const account = await atomicClient.getAccount(accountName);

  return account.collections.reduce(
    (count, collection) => count + Number(collection.assets),
    0
  );
};
