import AWS from 'aws-sdk';

const TRANSFER_STATUS_TYPE = 'TRANSFER';
const docClient = new AWS.DynamoDB.DocumentClient();

export const getStatus = async (account) => {
  const response = await docClient
    .get({
      TableName: process.env.STATUSES_TABLE,
      Key: {
        account: account,
        statusType: TRANSFER_STATUS_TYPE
      }
    })
    .promise();

  return response.Item ?? (await logTransfer(account, Date.now()));
};

export const logTransfer = async (account, transferTime) => {
  const status = {
    account: account,
    statusType: TRANSFER_STATUS_TYPE,
    statusValue: 'Sent',
    transferTime: Number(transferTime),
    createTime: Date.now()
  };

  await docClient
    .put({
      TableName: process.env.STATUSES_TABLE,
      Item: status
    })
    .promise();

  return status;
};
