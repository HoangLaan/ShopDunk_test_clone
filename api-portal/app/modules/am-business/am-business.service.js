const amBusinessClass = require('../am-business/am-business.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const cache = require('../../common/classes/cache.class');
const API_CONST = require('../../common/const/api.const');
const _ = require('lodash');
const fileHelper = require('../../common/helpers/file.helper');
const folderNameBanner = 'banners';
const folderNameIcon = 'logos';
const config = require('../../../config/config');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
/**
 * Get list AM_BUSINESS
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListAMBusiness = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getValueFromObject(queryParams, 'keyword');

        const pool = await mssql.pool;
        const data = await pool.request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('AREAID', apiHelper.getValueFromObject(queryParams, 'area_id'))
            .input('BUSINESSTYPEID', apiHelper.getValueFromObject(queryParams, 'business_type_id'))
            .input('PROVINCEID', apiHelper.getValueFromObject(queryParams, 'province_id'))
            .input('DISTRICTID', apiHelper.getValueFromObject(queryParams, 'district_id'))
            .input('WARDID', apiHelper.getValueFromObject(queryParams, 'ward_id'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute(PROCEDURE_NAME.AM_BUSINESS_GETLIST);

        const Businesss = data.recordset;

        return new ServiceResponse(true, '', {
            'data': amBusinessClass.list(Businesss),
            'page': currentPage,
            'limit': itemsPerPage,
            'total': apiHelper.getTotalData(Businesss),
        });
    } catch (e) {
        logger.error(e, { 'function': 'BusinessService.getListBusiness' });

        return new ServiceResponse(true, '', {});
    }
};
const createAMBusiness = async (body = {}) => {
    return await createAMBusinessOrUpdate(body);
};

const updateAMBusiness = async (body = {}, business_id) => {
    body.business_id = business_id;
    return await createAMBusinessOrUpdate(body);
};

const createAMBusinessOrUpdate = async (body = {}) => {
    let business_banner = apiHelper.getValueFromObject(body, 'business_banner');
    if (business_banner) {
        const pathBanner = await saveFile(business_banner, folderNameBanner);
        if (pathBanner) {
            business_banner = pathBanner;
        }
    }
    let business_icon_url = apiHelper.getValueFromObject(body, 'business_icon_url');
    if (business_icon_url) {
        const pathIcon = await saveFile(business_icon_url, folderNameIcon);
        if (pathIcon) {
            business_icon_url = pathIcon;
        }
    }
    const pool = await mssql.pool;
    try {
        // checkname
        const dataCheck = await pool.request()
            .input('BUSINESSID', apiHelper.getValueFromObject(body, 'business_id'))
            .input('BUSINESSNAME', apiHelper.getValueFromObject(body, 'business_name'))
            .input('COMPANYID', apiHelper.getValueFromObject(body, 'company_id'))
            .execute(PROCEDURE_NAME.AM_BUSINESS_CHECKNAME);
        if (dataCheck.recordset && dataCheck.recordset[0].RESULT == 1) {
            return new ServiceResponse(false, RESPONSE_MSG.AMBUSINESS.EXISTS_NAME, null);
        }
        // Save AM_BUSINESS
        const data = await pool.request()
            .input('BUSINESSID', apiHelper.getValueFromObject(body, 'business_id'))
            .input('BUSINESSNAME', apiHelper.getValueFromObject(body, 'business_name'))
            .input('BUSINESSCODE', apiHelper.getValueFromObject(body, 'business_code'))
            .input('AREAID', apiHelper.getValueFromObject(body, 'area_id'))
            .input('COMPANYID', apiHelper.getValueFromObject(body, 'company_id'))
            .input('BUSINESSTYPEID', apiHelper.getValueFromObject(body, 'business_type_id'))
            .input('BUSINESSBANNER', business_banner)
            .input('BUSINESSICONURL', business_icon_url)
            .input('BUSINESSPHONENUMBER', apiHelper.getValueFromObject(body, 'business_phone_number'))
            .input('BUSINESSEMAIL', apiHelper.getValueFromObject(body, 'business_mail'))
            .input('BUSINESSWEBSITE', apiHelper.getValueFromObject(body, 'business_website'))
            .input('OPENINGDATE', apiHelper.getValueFromObject(body, 'opening_date'))
            .input('BUSINESSCOUNTRYID', apiHelper.getValueFromObject(body, 'business_country_id'))
            .input('BUSINESSSTATEID', apiHelper.getValueFromObject(body, 'business_state_id'))
            .input('BUSINESSCITYID', apiHelper.getValueFromObject(body, 'business_city_id'))
            .input('BUSINESSSTATE', apiHelper.getValueFromObject(body, 'business_state'))
            .input('BUSINESSPROVINCEID', apiHelper.getValueFromObject(body, 'business_province_id'))
            .input('BUSINESSDISTRICTID', apiHelper.getValueFromObject(body, 'business_district_id'))
            .input('BUSINESSWARDID', apiHelper.getValueFromObject(body, 'business_ward_id'))
            .input('BUSINESSADDRESS', apiHelper.getValueFromObject(body, 'business_address'))
            .input('BUSINESSADDRESSFULL', apiHelper.getValueFromObject(body, 'business_address_full'))
            .input('LOCATIONX', apiHelper.getValueFromObject(body, 'location_x'))
            .input('LOCATIONY', apiHelper.getValueFromObject(body, 'location_y'))
            .input('OPENTIME', apiHelper.getValueFromObject(body, 'open_time'))
            .input('CLOSETIME', apiHelper.getValueFromObject(body, 'close_time'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(body, 'description'))
            .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_id'))
            .execute(PROCEDURE_NAME.AM_BUSINESS_CREATEORUPDATE);
        removeCacheOptions();

        return new ServiceResponse(true);
    } catch (error) {
        logger.error(error, { 'Business': 'BusinessService.createAMBusinessOrUpdate' });
        console.error('BusinessService.createAMBusinessOrUpdate', error);
        return new ServiceResponse(false, e.message);
    }
};

const detailAMBusiness = async (businessId) => {
    try {
        const pool = await mssql.pool;

        const data = await pool.request()
            .input('BUSINESSID', businessId)
            .execute(PROCEDURE_NAME.AM_BUSINESS_GETBYID);
        const Business = data.recordset[0];
        if (Business) {
            return new ServiceResponse(true, '', amBusinessClass.detail(Business));
        }
        return new ServiceResponse(false, '', null);
    } catch (e) {
        logger.error(e, { 'function': 'BusinessService.detailBusiness' });

        return new ServiceResponse(false, e.message);
    }
};

const deleteAMBusiness = async (businessId, authId) => {
    const pool = await mssql.pool;
    try {
        // Delete user group
        await pool.request()
            .input('BUSINESSID', businessId)
            .input('UPDATEDUSER', authId)
            .execute(PROCEDURE_NAME.AM_BUSINESS_DELETE);

        removeCacheOptions();

        // Return ok
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { 'function': 'BusinessService.deleteBusiness' });

        // Return failed
        return new ServiceResponse(false, e.message);
    }
};

const changeStatusAMBusiness = async (businessId, authId, isActive) => {
    try {
        const pool = await mssql.pool;
        await pool.request()
            .input('BUSINESSID', businessId)
            .input('ISACTIVE', isActive)
            .input('UPDATEDUSER', authId)
            .execute(PROCEDURE_NAME.AM_BUSINESS_UPDATESTATUS);
        removeCacheOptions();
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { 'function': 'BusinessService.changeStatusBusiness' });

        return new ServiceResponse(false);
    }
};
const saveFile = async (base64, folderName) => {
    let url = null;

    try {
        if (fileHelper.isBase64(base64)) {
            const extension = fileHelper.getExtensionFromBase64(base64);
            const guid = createGuid();
            url = await fileHelper.saveBase64(folderName, base64, `${guid}.${extension}`);
        }
        else {
            url = base64.split(config.domain_cdn)[1];
        }
    } catch (e) {
        logger.error(e, { 'function': 'BusinessService.saveFile' });
    }
    return url;
};
const createGuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};
const getOptions = async function (UserId) {
    try {
        console.log({ UserId })
        const pool = await mssql.pool;
        const data = await pool.request()
            .input('IsActive', API_CONST.ISACTIVE.ALL)
            .input('UserId', UserId)
            .execute(PROCEDURE_NAME.AM_BUSINESS_GETOPTIONS);

        return data.recordset;
    } catch (e) {
        logger.error(e, { 'function': 'BusinessService.getOptions' });
        return [];
    }
};

const getOptionsByAreaList = async function (queryParams) {
    try {
        const pool = await mssql.pool;
        const res = await pool.request()
            .input('COMPANYID', queryParams.company_id)
            .input('AREAID', queryParams.area_id)
            .execute(PROCEDURE_NAME.AM_BUSINESS_GETOPTIONS_BY_AREA_LIST);
        const data = res.recordset;
        return new ServiceResponse(true, '', amBusinessClass.optionsByAreaList(data));
    } catch (e) {
        logger.error(e, { 'function': 'BusinessService.getOptionsByAreaList' });
        return [];
    }
};

const getOptionsAll = async (queryParams = {}) => {
    try {
        // Get parameter
        const ids = apiHelper.getValueFromObject(queryParams, 'ids', []);
        const isActive = apiHelper.getFilterBoolean(queryParams, 'is_active');
        const parentId = apiHelper.getValueFromObject(queryParams, 'parent_id');
        const userId = apiHelper.getValueFromObject(queryParams, 'auth_id');
        // Get data from cache
        //const data = await cache.wrap(CACHE_CONST.AM_BUSINESS_OPTIONS, () => {
        // return getOptions(userId);
        //});
        const data = await getOptions(userId);

        // Filter values: empty, null, undefined
        const idsFilter = ids.filter((item) => { return item; });
        const dataFilter = _.filter(data, (item) => {
            let isFilter = true;
            if (Number(isActive) !== API_CONST.ISACTIVE.ALL && Boolean(Number(isActive)) !== item.ISACTIVE) {
                isFilter = false;
            }
            if (idsFilter.length && !idsFilter.includes(item.ID.toString())) {
                isFilter = false;
            }
            if (parentId && Number(parentId) !== Number(item.PARENTID)) {
                isFilter = false;
            }

            if (isFilter) {
                return item;
            }
            return null;
        });

        return new ServiceResponse(true, '', amBusinessClass.options(dataFilter));
    } catch (e) {
        logger.error(e, { 'function': 'BusinessService.getOptionsAll' });

        return new ServiceResponse(true, '', []);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.AM_BUSINESS_OPTIONS);
};

const getOptionsByAreaId = async function (queryParams) {
    try {
        const pool = await mssql.pool;
        const res = await pool.request()
            .input('AREAID', queryParams.area_id)
            .execute(PROCEDURE_NAME.AM_BUSINESS_GETOPTIONSBYAREAID_ADMINWEB);
        const data = res.recordset;
        return new ServiceResponse(true, '', amBusinessClass.options(data));
    } catch (e) {
        logger.error(e, { 'function': 'BusinessService.getOptionsByAreaList' });
        return [];
    }
};

module.exports = {
    getListAMBusiness,
    createAMBusiness,
    updateAMBusiness,
    detailAMBusiness,
    deleteAMBusiness,
    changeStatusAMBusiness,
    getOptionsAll,
    getOptionsByAreaList,
    getOptionsByAreaId
};
