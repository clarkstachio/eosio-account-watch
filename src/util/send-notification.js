import axios from 'axios';

const sendNotification = async (notification) => {
  await axios.post(process.env.NOTIFICATION_HOOK, notification);
};

export default sendNotification;
