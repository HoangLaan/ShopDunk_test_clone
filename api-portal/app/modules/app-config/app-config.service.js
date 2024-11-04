const appConfigClass = require('../app-config/app-config.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
/**
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const fileHelper = require('../../common/helpers/file.helper');
const folderName = 'config';
const config = require('../../../config/config');

// create or update

const createOrUpdateAppConfig = async bodyParams => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('IDCONFIG', apiHelper.getValueFromObject(bodyParams, 'id_config'))
            .input('KEYCONFIG', apiHelper.getValueFromObject(bodyParams, 'key_config'))
            .input('VALUECONFIG', apiHelper.getValueFromObject(bodyParams, 'value_config'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.SYS_APPCONFIG_CREATE_OR_UPDATE);
        const appConfigID = data.recordset[0].RESULT;

        return new ServiceResponse(true, 'update success', appConfigID);
    } catch (e) {
        logger.error(e, { function: 'appConfig.createOrUpdateAppConfig' });
        return new ServiceResponse(false, RESPONSE_MSG.APPCONFIG.CREATE_FAILED);
    }
};

const getListAppConfig = async (queryParams = {}) => {
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
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute(PROCEDURE_NAME.SYS_APPCONFIG_GET_LIST);
        const dataRecord = data.recordsets[0];
        const totalItem = data.recordsets[1][0].TOTAL;
        return new ServiceResponse(true, '', {
            data: appConfigClass.list(dataRecord),
            page: currentPage,
            limit: itemsPerPage,
            total: totalItem,
        });
    } catch (e) {
        logger.error(e, { function: 'appConfig.getListAppConfig' });
        return new ServiceResponse(true, '', {});
    }
};

//Delete
const deleteAppConfig = async (appConfigId, bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('IDCONFIG', appConfigId)
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.SYS_APPCONFIG_DELETE);
        return new ServiceResponse(true, RESPONSE_MSG.APPCONFIG.DELETE_SUCCESS, '');
    } catch (e) {
        logger.error(e, { function: 'appConfig.deleteAppConfig' });
        return new ServiceResponse(false, e.message);
    }
};

// detail
const detailAppConfig = async appConfigId => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('IDCONFIG', appConfigId)
            .execute(PROCEDURE_NAME.SYS_APPCONFIG_GET_BY_ID);
        let appConfig = appConfigClass.detail(data.recordset[0]);
        return new ServiceResponse(true, '', appConfig);
    } catch (e) {
        logger.error(e, { function: 'appConfigService.detailAppConfig' });
        return new ServiceResponse(false, e.message);
    }
};

// Get by key
const getByKey = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYCONFIG', queryParams.key_config)
            .execute('SYS_APPCONFIG_GetByKeyConfig');
        const dataRecord = data.recordset;
        return new ServiceResponse(true, '', appConfigClass.getByKey(dataRecord));
    } catch (e) {
        logger.error(e, { function: 'appConfig.getByKey' });
        return new ServiceResponse(true, '', {});
    }
};

const getPageConfig = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGE', apiHelper.getValueFromObject(queryParams, 'page'))
            .execute(PROCEDURE_NAME.SYS_APPCONFIG_GETBYPAGESETTING_ADMINWEB);
        const configs =
            data && data.recordset && data.recordset.length ? appConfigClass.listPageSetting(data.recordset) : [];
        let configObject = (configs || []).reduce((obj, config) => {
            obj[config.config_key] = {
                value: config.data_type == 'json' ? JSON.parse(config.config_value) : config.config_value,
                data_type: config.data_type,
                config_type: config.config_type,
            };
            return obj;
        }, {});

        Object.keys(configObject).forEach(key => {
            if (configObject[key].value && typeof configObject[key].value === 'string') {
                if (configObject[key].data_type === 'image') {
                    configObject[key].value = config.domain_cdn + configObject[key].value;
                }
            }
            if (configObject[key].data_type == 'json') {
                let arrImg = configObject[key].value;
                for (let index = 0; index < arrImg.length; index++) {
                    const img = arrImg[index];
                    img.icon = config.domain_cdn + img.icon;
                }
            }
        });
        return new ServiceResponse(true, '', configObject);
    } catch (e) {
        logger.error(e, { function: 'appConfigService.getPageConfig' });
        return new ServiceResponse(false, e.message);
    }
};

const updatePageConfig = async (bodyParams = {}) => {

    try {
        let { page, configs = {} } = bodyParams;
        delete configs.auth_id;
        delete configs.auth_name;
        delete configs.data;

        if (Object.keys(configs).length) {
            const pool = await mssql.pool;
            (Object.keys(configs) || []).forEach(async key => {
                if (key && configs[key]) {
                    let config = configs[key];
                    let { value, data_type = 'string', config_type } = config;

                    if (data_type == 'json') {
                        if (value) {
                            for (let index = 0; index < value.length; index++) {
                                const item = value[index];
                                const path_image = await saveFile(item.icon, folderName);
                                if (path_image) {
                                    value[index].icon = path_image;
                                }
                            }
                        }
                    }

                    if (Array.isArray(value)) {
                        value = JSON.stringify(value);
                    }

                    if (typeof value === 'string') {
                        if (key.includes('_IMAGE') || data_type == 'image') {
                            // upload image
                            if (value) {
                                const path_image = await saveFile(value, folderName);
                                if (path_image) {
                                    value = path_image;
                                    data_type = 'image';
                                }
                            }
                        }
                    }

                    await pool
                        .request()
                        .input('CONFIGTYPE', config_type)
                        .input('KEYCONFIG', key)
                        .input('VALUECONFIG', value)
                        .input('DATATYPE', data_type)
                        .input('CREATEDUSER', apiHelper.getValueFromObject(configs, 'auth_name'))
                        .execute(PROCEDURE_NAME.SYS_APPCONFIG_UPDATEPAGESETTING_ADMINWEB);
                }
            });
        }
        return new ServiceResponse(true, '', 'success');
    } catch (e) {
        logger.error(e, { function: 'appConfigService.updatePageConfig' });
        return new ServiceResponse(false, e.message);
    }
};

const updateConfig = async (bodyParams={}) => {
    try {
        let auth_id = bodyParams.auth_id;
        let auth_name = bodyParams.auth_name;
        delete bodyParams.auth_id;
        delete bodyParams.auth_name;
        if (Object.keys(bodyParams).length) {
            const pool = await mssql.pool;
            (Object.keys(bodyParams) || []).forEach(async key => {
                if (key && bodyParams[key]) {
                    let value = bodyParams[key];
                    let result = await pool
                        .request()
                        .input('KEYCONFIG', key)
                        .input('VALUECONFIG', value)
                        .input('CREATEDUSER', auth_name)
                        .execute(PROCEDURE_NAME.SYS_APPCONFIG_UPDATEPAGESETTING_ADMINWEB);
                    
                    console.log("Here" ,result);
                }
            });
        }
        return new ServiceResponse(true, '', 'success');
    } catch (e) {
        logger.error(e, { function: 'appConfigService.updateConfig' });
        return new ServiceResponse(false, e.message);
    }
}

const saveFile = async (base64, folderName) => {
    let url = null;
    try {
        if (fileHelper.isBase64(base64)) {
            const extension = fileHelper.getExtensionFromBase64(base64);
            const guid = createGuid();
            url = await fileHelper.saveBase64(folderName, base64, `${guid}.${extension}`);
        } else {
            url = base64.split(config.domain_cdn)[1];
        }
    } catch (e) {
        logger.error(e, {
            function: 'appConfigService.saveFile',
        });
    }
    return url;
};

const createGuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        var r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

module.exports = {
    createOrUpdateAppConfig,
    getListAppConfig,
    deleteAppConfig,
    detailAppConfig,
    getByKey,
    getPageConfig,
    updatePageConfig,
    updateConfig,
};
