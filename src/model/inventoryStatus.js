import AWS from 'aws-sdk';

const docClient = new AWS.DynamoDB.DocumentClient();

const INVENTORY_THRESHOLDS = Object.freeze({
  OK: process.env.INVENTORY_OK_THRESHOLD,
  Low: process.env.INVENTORY_LOW_THRESHOLD,
  'Very Low': process.env.INVENTORY_VERY_LOW_THRESHOLD
});

export const updateStatusByAssetCount = async (assetCount) => {
  try {
    const status = {
      statusType: 'INVENTORY',
      val: calcStatusWithAssetCount(assetCount),
      createTime: new Date().toISOString()
    };

    await docClient
      .put({
        TableName: 'StatusesTable',
        Item: status,
        ConditionExpression: 'attribute_not_exists(val) OR val <> :status',
        ExpressionAttributeValues: {
          ':status': status.val
        }
      })
      .promise();

    return status;
  } catch (err) {
    if (err.code === 'ConditionalCheckFailedException') {
      return undefined;
    }

    throw err;
  }
};

const calcStatusWithAssetCount = (assetCount) => {
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
