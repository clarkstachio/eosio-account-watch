import { accountUrl, ipfsUrl, assetUrl } from '../util/url-gen';

export const inventoryNotice = (account, newStatus, assetCount) =>
  message({
    content: `*${account}* inventory status.`,
    embeds: [
      {
        title: `Inventory ${newStatus.statusValue}`,
        url: accountUrl(account),
        description: `I have **${assetCount} assets** in inventory.`
      }
    ]
  });

export const transferNotice = (account, transfers) =>
  message({
    content: `*${account}* sent ${transfers.length} transfers`,
    embeds: transfers.map((transfer) => ({
      title: transfer.assets[0].data.name,
      url: assetUrl(transfer.assets[0].asset_id),
      fields: [
        {
          name: 'mint #',
          value: transfer.assets[0].template_mint ?? 'n/a',
          inline: true
        },
        {
          name: 'recipient',
          value: transfer.recipient_name,
          inline: true
        }
      ],
      thumbnail: {
        url: ipfsUrl(transfer.assets[0].data.img)
      }
    }))
  });

const message = (content) => ({
  ...content,
  username: process.env.NOTIFICATION_SENDER,
  avatar_url: ipfsUrl(process.env.NOTIFICATION_AVATAR_IPFS_HASH)
});
