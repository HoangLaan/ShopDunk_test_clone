const mssql = require('../../models/mssql');
const logger = require('../../common/classes/logger.class');
const ServiceResponse = require('../../common/responses/service.response');

const getListTokenDeviceUser = async () => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request().input('PUSHTYPE', 1).execute('GET_LIST_TOKEN_USER');
    return new ServiceResponse(true, '', {
      data: data.recordset.map((value) => value.DEVICETOKEN),
    });
  } catch (e) {
    logger.error(e, { function: 'mailService.getListTokenDeviceUser' });
    return new ServiceResponse(false, e.message);
  }
};

const scan = async () => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request().execute('NEWS_NEWS_GetListToPush_Service');
    if (!data.recordset.length) return [];
    const news = data.recordset || [];

    let notifications = [];
    for (let i = 0; i < news.length; i++) {
      const { title = 'Tin tức nội bộ', NEWSTITLE: body = '', NEWSID: id = 0 } = news[i];
      let notification = {
        all: 1,
        notification: {
          title,
          body,
        },
        data: {
          id: `${id}`.toString(),
          key: 'NEWS',
        },
      };
      notifications.push(notification);
    }
    return notifications;
  } catch (e) {
    logger.error(e, { function: 'news.scan' });
    return null;
  }
};

module.exports = {
  getListTokenDeviceUser,
  scan,
};
