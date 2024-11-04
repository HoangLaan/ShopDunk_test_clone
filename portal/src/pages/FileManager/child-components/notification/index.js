import { notification } from 'antd';

const NotificationBase = (type, description) => {
  notification[type]({
    message: 'Thông báo',
    description: description,
    placement: 'bottomRight',
  });
};

export default NotificationBase;
