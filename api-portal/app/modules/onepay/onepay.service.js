const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const HttpRequest = require('./helper');

const getListInstallmentBank = async (queryParams = {}) => {
    try {
        const data = await HttpRequest.get('/onepay/installment-bank', { params: queryParams });
        return new ServiceResponse(true, 'success', data?.installments || []);
    } catch (e) {
        logger.error(e, { function: 'OnepayService.getListInstallmentBank' });
        return new ServiceResponse(true, 'failed', []);
    }
};

module.exports = {
    getListInstallmentBank,
};
