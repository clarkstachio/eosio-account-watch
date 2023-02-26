import * as transferModel from './model/transfers';
import * as inventoryModel from './model/inventory';
import { findSentTransfers, getAssetCount } from './service/account-service';
import { inventoryNotice, transferNotice } from './service/notice-factory';
import notify from './util/webhook-notifier';

export const checkInventoryHandler = async () => {
  const account = process.env.WATCH_ACCOUNT;
  const assetCount = await getAssetCount(account);
  const newStatus = await inventoryModel.updateAssetCount(account, assetCount);

  if (newStatus) {
    await notify(inventoryNotice(account, newStatus, assetCount));
    console.log(
      `${account} inventory status change: ${newStatus.statusValue} - ${assetCount} assets. Notice sent.`
    );
  } else {
    console.log(
      `${account} inventory status has not changed ... ${assetCount} assets`
    );
  }
};

export const checkTransfersHandler = async () => {
  const account = process.env.WATCH_ACCOUNT;
  const lastStatus = await transferModel.getStatus(account);
  const transfers = await findSentTransfers(account, lastStatus.transferTime);

  if (transfers.length > 0) {
    await transferModel.logTransfer(account, transfers[0].created_at_time);
    await notify(transferNotice(account, transfers));
    console.log(`${account} sent ${transfers.length} transfers. Notice sent.`);
  } else {
    console.log(`${account} has no new tranfers.`);
  }
};
