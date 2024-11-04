const database = require('../../models');
const moduleClass = require('./contract-type.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const API_CONST = require('../../common/const/api.const');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const mssql = require('../../models/mssql');
const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');

const contractTypeDetail = async contractTypeId => {
    try {
        const pool = await mssql.pool;

        const resData = await pool
            .request()
            .input('CONTRACTTYPEID', contractTypeId)
            .execute('HR_CONTRACTTYPE_GetById_AdminWeb');

        let contractType = resData.recordset[0];

        if (contractType) {
            contractType = moduleClass.detail(contractType);

            return new ServiceResponse(true, '', contractType);
        }

        return new ServiceResponse(false, '', null);
    } catch (e) {
        logger.error(e, {function: 'ContractTypeService.contractTypeDetail'});

        return new ServiceResponse(false, e.message);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.HR_CONTRACTTYPE_OPTIONS);
};

module.exports = {
    contractTypeDetail,
};
