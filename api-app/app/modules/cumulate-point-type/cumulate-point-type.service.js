const cumulatePointTypeClass = require('./cumulate-point-type.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const mssql = require('../../models/mssql');
const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');

const detail = async (params, pool) => {
    try {
        const res = await pool
            .request()
            .input('ACPOINTID', apiHelper.getValueFromObject(params, 'id'))
            .execute('PT_ACCUMULATEPOINTTYPE_GetById_App');
        return new ServiceResponse(true, '', {
            ...cumulatePointTypeClass.detail(res.recordsets[0]?.[0]),
        });
    } catch (error) {
        logger.error(error, {function: 'AccumulatePointTypeService.detail'});
        return new ServiceResponse(false, error);
    }
};

const getListOptions = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('PRODUCTIDS', apiHelper.getValueFromObject(params, 'product_ids'))
            .input('STOREID', apiHelper.getValueFromObject(params, 'store_id'))
            .input('CUSTOMERTYPEID', apiHelper.getValueFromObject(params, 'customer_type_id'))
            .execute('PT_ACCUMULATEPOINTTYPE_GetOPtions_App');

        return new ServiceResponse(true, '', cumulatePointTypeClass.listOptions(res.recordset));
    } catch (error) {
        logger.error(error, {function: 'AccumulatePointTypeService.getListOptions'});
        return new ServiceResponse(false, error, []);
    }
};

const calculatePoint = async (params = {}, pool) => {
    try {
        const acpointId = apiHelper.getValueFromObject(params, 'acpoint_id');
        const totalMoney = apiHelper.getValueFromObject(params, 'total_money');
        const presenter = apiHelper.getValueFromObject(params, 'presenter');

        const accumulateDetail = await detail({id: acpointId}, pool);

        if (accumulateDetail.isSuccess()) {
            const data = accumulateDetail.getData();
            let customer_point = Math.floor(Number(totalMoney) / Number(data.value)) * Number(data.point);
            let presenter_point = 0;

            if (presenter) {
                let point_aff_member = data?.point_aff_member || 0;
                let point_referred = data?.point_referred || 0;

                if (data.is_apply_condition) {
                    data.list_condition?.forEach(
                        condition => {
                            if (totalMoney >= condition.order_value_from && totalMoney <= condition.order_value_to) {
                                point_aff_member += condition.point_aff_member || 0;
                                point_referred += condition.point_referred || 0;
                            }
                        },
                        {presenter_point: 0, customer_point: 0},
                    );
                }

                presenter_point = Number(point_aff_member || 0);
                customer_point += Number(point_referred || 0);
            }

            return new ServiceResponse(true, '', {
                customer_point,
                presenter_point,
            });
        }

        return new ServiceResponse(true, '', 0);
    } catch (error) {
        logger.error(error, {function: 'AccumulatePointTypeService.calculatePoint'});
        return new ServiceResponse(false, error, []);
    }
};

module.exports = {
    detail,
    getListOptions,
    calculatePoint,
};
