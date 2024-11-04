const appRoot = require('app-root-path');
const pdf = require('pdf-creator-node');

const createBarcode = (html, data, filename = 'barcode.pdf', { width = '40mm', height = '30mm' }) => {
    const options = {
        width,
        height,
        childProcessOptions: {
            env: {
                OPENSSL_CONF: '/dev/null',
            },
        },
    };
    const document = {
        html: html,
        data,
        path: `${appRoot}/storage/barcode/${filename}.pdf`,
        type: 'pdf',
    };
    return new Promise((resolve, reject) => {
        pdf.create(document, options)
            .then(res => {
                resolve(true);
            })
            .catch(error => {
                reject(error);
            });
    });
};

module.exports = {
    createBarcode,
};
