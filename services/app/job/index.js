const cron = require('node-cron');
const BULLMQQUEUE = require('../bullmq/queue');
const OffWorkService = require('../module/offwork/offwork.service');
const ReceiveslipService = require('../module/receiveslip/receiveslip.service');
const PaymentslipService = require('../module/paymentslip/paymentslip.service');
const PreOrderService = require('../module/pre-order/pre-order.service');
const orderService = require('../module/order/order.service');
const purchaseRequisitionService = require('../module/purchase-requisition/purchase-requisition.service');
const cogsService = require('../module/cogs/cogs.service');

// Scan announce and news every minute
cron
  .schedule(
    '0 * * * * *',
    async () => {
      //8-23
      try {
        BULLMQQUEUE.add({ type: 'announce.scan', payload: { run: true } });
        BULLMQQUEUE.add({ type: 'news.scan', payload: { run: true } });
      } catch (error) {
        logger.error(error);
      }
    },
    {
      timezone: 'Asia/Ho_Chi_Minh',
    },
  )
  .start();

// chạy job update phép nhân viên vào cuối ngày
cron
  .schedule(
    '55 23 * * *',
    async () => {
      //8-23
      try {
        OffWorkService.update();
      } catch (error) {
        logger.error(error);
      }
    },
    {
      timezone: 'Asia/Ho_Chi_Minh',
    },
  )
  .start();

// Tao phieu thu tu dong
cron
  .schedule(
    '0 29 2 * * *',
    async () => {
      //8-23
      try {
        ReceiveslipService.create();
      } catch (error) {
        logger.error(error);
      }
    },
    {
      timezone: 'Asia/Ho_Chi_Minh',
    },
  )
  .start();

cron
  .schedule(
    '0 20 2 * * *',
    async () => {
      //8-23
      try {
        PaymentslipService.create();
      } catch (error) {
        logger.error(error);
      }
    },
    {
      timezone: 'Asia/Ho_Chi_Minh',
    },
  )
  .start();

// chạy job update hạng KH khi cuối ngày
cron
  .schedule(
    '58 23 * * *',
    async () => {
      try {
        BULLMQQUEUE.add({ type: 'customer-type.update', payload: { run: true } });
      } catch (error) {
        logger.error(error);
      }
    },
    {
      timezone: 'Asia/Ho_Chi_Minh',
    },
  )
  .start();

// chạy job create email/sms 18h hằng ngày:
cron
  .schedule(
    '0 18 * * *',
    async () => {
      try {
        BULLMQQUEUE.add({ type: 'task-type.createSendEmailSMS', payload: { run: true } });
      } catch (error) {
        logger.error(error);
      }
    },
    {
      timezone: 'Asia/Ho_Chi_Minh',
    },
  )
  .start();

// */10 * * * * *: every 10s
// chạy job lên lịch gửi sms nhắc nhở thanh toán vào cuối ngày
cron
  .schedule(
    '55 23 * * *',
    async () => {
      try {
        await PreOrderService.getListAndUpdateJobs();
      } catch (error) {
        logger.error(error);
      }
    },
    {
      timezone: 'Asia/Ho_Chi_Minh',
    },
  )
  .start();

// chạy job reset ngày nghỉ của nhân viên vào mỗi ngày
cron
  .schedule(
    '55 23 * * *',
    async () => {
      try {
        await OffWorkService.reset();
      } catch (error) {
        logger.error(error);
      }
    },
    {
      timezone: 'Asia/Ho_Chi_Minh',
    },
  )
  .start();

// chạy job 15s sẽ query 1 lần kiểm tra đơn hàng cần gửi notify
cron
  .schedule(
    '*/15 * * * * *',
    async () => {
      try {
        await orderService.sendNotifyTask();
      } catch (error) {
        logger.error(error);
      }
    },
    {
      timezone: 'Asia/Ho_Chi_Minh',
    },
  )
  .start();

// chạy job 15m/lần huỷ các đơn có imei nhưng không thanh toán
cron
  .schedule(
    '*/15 * * * *',
    async () => {
      try {
        await orderService.cancelOldOrder();
      } catch (error) {
        logger.error(error);
      }
    },
    {
      timezone: 'Asia/Ho_Chi_Minh',
    },
  )
  .start();

// chạy job 1h/lần huỷ các yêu cầu mua hàng chưa tạo đơn đặt hàng trong vòng (5 ngày theo loại yêu cầu)
cron
  .schedule(
    '0 * * * *',
    async () => {
      try {
        await purchaseRequisitionService.cancelTask();
      } catch (error) {
        logger.error(error);
      }
    },
    {
      timezone: 'Asia/Ho_Chi_Minh',
    },
  )
  .start();

// Chạy mỗi phút để check tính giá xuất kho theo điều kiện
cron
  .schedule(
    '* * * * *',
    async () => {
      try {
        cogsService.calculateOutStocks();
      } catch (error) {
        logger.error(error);
      }
    },
    {
      timezone: 'Asia/Ho_Chi_Minh',
    },
  )
  .start();
