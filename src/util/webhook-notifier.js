import axios from 'axios';

const notify = async (notice) => {
  await axios.post(process.env.NOTIFICATION_HOOK, notice);
};

export default notify;
