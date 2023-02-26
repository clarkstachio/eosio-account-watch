import AWS from 'aws-sdk';

const INVENTORY_STATUS_TYPE = 'INVENTORY';

const INVENTORY_THRESHOLDS = Object.freeze({
  OK: process.env.INVENTORY_OK_THRESHOLD,
  Low: process.env.INVENTORY_LOW_THRESHOLD,
  'Very Low': process.env.INVENTORY_VERY_LOW_THRESHOLD
});

const docClient = new AWS.DynamoDB.DocumentClient();

export const updateAssetCount = async (account, assetCount) => {
  try {
    const status = {
      account,
      statusType: INVENTORY_STATUS_TYPE,
      statusValue: calcThreshold(assetCount),
      createTime: Date.now()
    };

    await docClient
      .put({
        TableName: process.env.STATUSES_TABLE,
        Item: status,
        ConditionExpression:
          'attribute_not_exists(statusValue) OR statusValue <> :status',
        ExpressionAttributeValues: {
          ':status': status.statusValue
        }
      })
      .promise();

    return status;
  } catch (err) {
    if (err.code === 'ConditionalCheckFailedException') {
      return null;
    }

    throw err;
  }
};

const calcThreshold = (assetCount) => {
  if (assetCount < 0) {
    throw new Error(
      `Asset count must be a positive number. ${assetCount} given.`
    );
  }

  for (let status in INVENTORY_THRESHOLDS) {
    if (assetCount >= INVENTORY_THRESHOLDS[status]) {
      return status;
    }
  }

  return 'Critical';
};
