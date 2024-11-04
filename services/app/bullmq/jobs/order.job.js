const logger = require('../../common/classes/logger.class');
const orderService = require('../../module/order/order.service');

const process = async (type, payload) => {
  if (!type || !payload) return;
  switch (type) {
    case 'order.sendNotifyJob':
      return await sendNotifyJob(payload);
  }
};


const sendNotifyJob = async (payload = {}) => {
  try {
    await orderService.sendNotifyJob(payload);
  } catch (error) {
    logger.error(error, {
      function: 'customer-type-job.sendNotifyJob',
    });
  }
};

module.exports = {
  process,
};
