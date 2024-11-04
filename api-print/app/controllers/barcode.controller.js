const SingleResponse = require('../common/responses/single.response');
const pdfHelper = require('../common/helpers/pdf.helper');

const print = async (req, res, next) => {
    try {
        const { html, data, filename, option } = req.body;
        console.log(req.body);
        await pdfHelper.createBarcode(html, data, filename, option);
        next(new SingleResponse({ path: `barcode/${filename}.pdf` }, 'Create barcode successfully'))
    } catch (err) {
        return next(new SingleResponse(false, "Unknow Error"));
    }
};

module.exports = {
    print
};