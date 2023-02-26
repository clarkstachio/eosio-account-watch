export const ipfsUrl = (hash) => `${process.env.IPFS_URL}/${hash}`;

export const assetUrl = (assetId) => `${process.env.ASSET_URL}/${assetId}`;

export const accountUrl = (account) => `${process.env.ACCOUNT_URL}/${account}`;

export const transactionUrl = (txId) =>
  `${process.env.TRANSACTION_URL}/${txId}`;
