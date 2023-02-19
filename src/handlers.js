import { updateStatusByAssetCount } from './model/inventoryStatus.js';
import { getInventoryAssetCount } from './services/accountService.js';
import { buildInventoryNotification } from './services/notificationBuilder.js';
import sendNotification from './util/send-notification.js';

export const checkInventory = async () => {
  const assetCount = await getInventoryAssetCount(process.env.WATCH_ACCOUNT);
  const newStatus = await updateStatusByAssetCount(assetCount);

  if (newStatus) {
    await sendNotification(buildInventoryNotification(newStatus, assetCount));

    console.log(
      `Inventory status change: ${newStatus.val} - ${assetCount} assets. Notification sent.`
    );
  } else {
    console.log(`Inventory status has not changed ... ${assetCount} assets`);
  }
};
