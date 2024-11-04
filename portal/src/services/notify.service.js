import httpClient from 'utils/httpClient.js';

const NotifyService = {
  sendAdv: (payload) => {
    return httpClient.post('/notify/send-sms-adv', payload);
  },
};

export default NotifyService;
