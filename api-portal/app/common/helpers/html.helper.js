const fs = require('fs');
const path = require('path');
const ejs = require('ejs');


const format = (payload) => {
  const templatepath = path.join(__dirname, '../mailtemplates/'),
    emailTemplate = fs.readFileSync(path.resolve(`${templatepath}${payload.template}`), 'UTF-8');
  if(emailTemplate) {
    return ejs.render(emailTemplate, payload.mail);
  }
  return null;
};

module.exports = { format };
