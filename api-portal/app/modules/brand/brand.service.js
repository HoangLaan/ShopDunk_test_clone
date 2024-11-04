const brandClass = require('./brand.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');

const getListBrand = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute('MD_BRAND_GetList_AdminWeb');

        const brands = data.recordset;

        return new ServiceResponse(true, '', {
            data: brandClass.list(brands),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(brands),
        });
    } catch (e) {
        logger.error(e, { function: 'brandService.getListBrand' });
        return new ServiceResponse(true, '', {});
    }
};

const detailBrand = async (brandId) => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request().input('BRANDID', brandId).execute('MD_BRAND_GetById_AdminWeb');
        let brand = brandClass.detail(res.recordset[0] || {});
        return new ServiceResponse(true, '', brand);
    } catch (e) {
        logger.error(e, { function: 'brandService.detailBrand' });
        return new ServiceResponse(false, e.message);
    }
};

const createBrandOrUpdate = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        const brand_id = apiHelper.getValueFromObject(bodyParams, 'brand_id');
        //check name
        const dataCheck = await pool
            .request()
            .input('BRANDID', brand_id)
            .input('BRANDNAME', apiHelper.getValueFromObject(bodyParams, 'brand_name'))
            .execute('MD_BRAND_CheckName_AdminWeb');

        if (dataCheck.recordset && dataCheck.recordset[0].RESULT == 1) {
            return new ServiceResponse(false, 'Tên thương hiệu đã tồn tại !', null);
        }

        const data = await pool
            .request()
            .input('BRANDID', brand_id)
            .input('BRANDNAME', apiHelper.getValueFromObject(bodyParams, 'brand_name'))
            .input('BRANDCODE', apiHelper.getValueFromObject(bodyParams, 'brand_code'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(bodyParams, 'is_active'))
            .input('ISSYSTEM', apiHelper.getFilterBoolean(bodyParams, 'is_system'))
            .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
            .input('PARENTID', apiHelper.getValueFromObject(bodyParams, 'parent_id'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('MD_BRAND_CreateOrUpdate_AdminWeb');
        const brandId = data.recordset[0].RESULT;
        if (!brandId) {
            return new ServiceResponse(false, brand_id ? 'Cập nhật thất bại !' : 'Tạo mới thất bại');
        }
        return new ServiceResponse(true, brand_id ? 'Cập nhật thành công !' : 'Tạo mới thành công', brandId);
    } catch (e) {
        logger.error(e, { function: 'brandService.createBrandOrUpdate' });
        return new ServiceResponse(false, e.message);
    }
};

const deleteBrand = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('BRANDIDS', apiHelper.getValueFromObject(bodyParams, 'ids'))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('MD_BRAND_Delete_AdminWeb');
        return new ServiceResponse(true, 'ok');
    } catch (e) {
        logger.error(e, { function: 'brandService.deleteBrand' });
        return new ServiceResponse(false, e.message);
    }
};

const getOptionsCompany = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', (auth_name = apiHelper.getValueFromObject(queryParams, 'auth_name')))
            .execute('AM_COMPANY_GetOptionsForUser_AdminWeb');
        const brands = brandClass.options(data.recordset);
        return new ServiceResponse(true, '', brands);
    } catch (e) {
        logger.error(e, { function: 'brandService.getOptionsCompany' });
        return new ServiceResponse(true, '', {});
    }
};

const getOptionsBrand = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('MD_BRAND_GetOptions_AdminWeb');

        return new ServiceResponse(true, '', brandClass.options(data.recordset));
    } catch (e) {
        logger.error(e, {
            function: 'brandService.getOptionsBrand',
        });
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getListBrand,
    detailBrand,
    createBrandOrUpdate,
    deleteBrand,
    getOptionsCompany,
    getOptionsBrand,
};
