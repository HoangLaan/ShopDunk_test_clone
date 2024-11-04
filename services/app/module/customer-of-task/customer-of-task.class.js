const Transform = require('../../common/helpers/transform.helper');
const template = {
  notify_id: '{{#? NOTIFYID}}',
  notify_title: '{{#? NOTIFYTITLE}}',
  notify_content: '{{#? NOTIFYCONTENT}}',
};

let transform = new Transform(template);

const notify = (notify) => {
  return transform.transform(notify, ['notify_id', 'notify_title', 'notify_content']);
};

module.exports = {
  notify,
};
