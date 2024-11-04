var fs = require("fs");
var Handlebars = require('handlebars');

const build = (template, data) => {
    const html = fs.readFileSync(`app/templates/mail/${template}.html`, 'utf8');
    return Handlebars.compile(html)(data);
}

const createMail = (TYPE, data) => {
    switch (TYPE) {
        case 'OFFWORK':
            return {
                mail_subject: `[DUYỆT ĐƠN XIN NGHỈ PHÉP] ${data.full_name}`,
                mail_content: build('offwork', data)
            }
    }
}



module.exports = {
    createMail,
}