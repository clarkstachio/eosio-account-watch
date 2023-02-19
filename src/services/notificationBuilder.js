export const buildInventoryNotification = (newStatus, assetCount) => {
  return {
    content: 'My inventory status has changed!',
    embeds: [
      {
        title: `Inventory ${newStatus.val}`,
        url: process.env.NOTIFICATION_INFO_URL,
        description: `I have **${assetCount} assets** in inventory.`
      }
    ]
  };
};
