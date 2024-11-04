const partnerClass = require('./partner.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const API_CONST = require('../../common/const/api.const');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const mssql = require('../../models/mssql');
const _ = require('lodash');
const sql = require('mssql');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const folderName = 'partner';
const fileHelper = require('../../common/helpers/file.helper');
const config = require('../../../config/config');
const xl = require('excel4node');
const { addSheetGetList } = require('../../common/helpers/excel.helper');
const getList = async (params = {}) => {
    try {
        const itemsPerPage = apiHelper.getItemsPerPage(params)
        const page = apiHelper.getCurrentPage(params)
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(params, 'keyword'))
            .input('ISACTIVE', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ALL))
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', page)
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(params, 'created_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(params, 'created_date_to'))
            .input('SOURCEID', apiHelper.getValueFromObject(params, 'source_id'))
            .input('CUSTOMERTYPEID', apiHelper.getValueFromObject(params, 'customer_type_id'))
            .execute(PROCEDURE_NAME.CRM_PARTNER_GET_LIST_ADMINWEB);
        return new ServiceResponse(true, '',  {
            list: partnerClass.list(res.recordsets[0]),
            itemsPerPage: itemsPerPage,
            page: page,
            total: apiHelper.getTotalData(res.recordset),
        });
    } catch (error) {
        logger.error(error, { function: 'servicePartner.getList' });
        return new ServiceResponse(false, error, []);
    }
};

// CHECK EXISTS NAME, PHONE, EMAIL
const checkExists = async (partnerId, partnerName, phoneNumber, email, partner_code) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PARTNERID', partnerId)
            .input('PARTNERNAME', partnerName)
            .input('EMAIL', email)
            .input('PHONENUMBER', phoneNumber)
            .input('PARTNERCODE', partner_code)
            .execute(PROCEDURE_NAME.CRM_PARTNER_CHECKEXISTS_ADMINWEB);
        let checkExists = data.recordset;
        if (checkExists && checkExists.length > 0) {
            checkExists = partnerClass.check(checkExists[0]);
            return checkExists;
        }
    } catch (e) {
        return null;
    }
};

const createGuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        var r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

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
            function: 'servicePartner.saveFile',
        });
    }
    return url;
};

const createOrUpdate = async (id = null, params = {}) => {
    if (params.image_avatar) {
        const path_image_avatar = await saveFile(params.image_avatar, folderName);
        if (path_image_avatar) {
            params.image_avatar = path_image_avatar;
        }
    }
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    await transaction.begin();
    try {
        const check = await checkExists(
            id,
            apiHelper.getValueFromObject(params, 'partner_name'),
            apiHelper.getValueFromObject(params, 'phone_number'),
            apiHelper.getValueFromObject(params, 'email'),
            apiHelper.getValueFromObject(params, 'partner_code'),
        );
        if (check && check.exists_name === 1) {
            await transaction.rollback();
            return new ServiceResponse(false, RESPONSE_MSG.CRM_PARTNER.EXISTS_NAME, null);
        }
        if (check && check.exists_code === 1) {
            await transaction.rollback();
            return new ServiceResponse(false, RESPONSE_MSG.CRM_PARTNER.EXISTS_PARTNERCODE, null);
        }
        if (check && check.exists_phone === 1) {
            await transaction.rollback();
            return new ServiceResponse(false, RESPONSE_MSG.CRM_PARTNER.EXISTS_PHONENUMBER, null);
        }
        if (check && check.exists_email === 1) {
            await transaction.rollback();
            return new ServiceResponse(false, RESPONSE_MSG.CRM_PARTNER.EXISTS_EMAIL, null);
        }
        const reqPartner = new sql.Request(transaction);
        const dataPartner = await reqPartner
            .input('PARTNERID', id)
            .input('PARTNERCODE', apiHelper.getValueFromObject(params, 'partner_code', null))
            .input('PARTNERNAME', apiHelper.getValueFromObject(params, 'partner_name', null))
            .input('DESCRIPTION', apiHelper.getValueFromObject(params, 'description', null))
            .input('PHONENUMBER', apiHelper.getValueFromObject(params, 'phone_number', null))
            .input('EMAIL', apiHelper.getValueFromObject(params, 'email', null))
            .input('TAXCODE', apiHelper.getValueFromObject(params, 'tax_code', null))
            .input('CARINGUSER', apiHelper.getValueFromObject(params, 'caring_user', null))
            .input('PROVINCEID', apiHelper.getValueFromObject(params, 'province_id', 0))
            .input('DISTRICTID', apiHelper.getValueFromObject(params, 'district_id', 0))
            .input('WARDID', apiHelper.getValueFromObject(params, 'ward_id', 0))
            .input('ADDRESS', apiHelper.getValueFromObject(params, 'address', null))
            .input('USERID', apiHelper.getValueFromObject(params, 'user_id', null))
            .input('SOURCEID', apiHelper.getValueFromObject(params, 'source_id', null))
            .input('CUSTOMERTYPEID', apiHelper.getValueFromObject(params, 'customer_type_id', null))
            .input('REPRESENTATIVENAME', apiHelper.getValueFromObject(params, 'representative_name', null))
            .input('REPRESENTATIVEGENDER', apiHelper.getValueFromObject(params, 'representative_gender', null))
            .input('REPRESENTATIVEPHONE', apiHelper.getValueFromObject(params, 'representative_phone', null))
            .input('REPRESENTATIVEEMAIL', apiHelper.getValueFromObject(params, 'representative_email', null))
            .input('REPRESENTATIVEIDCARD', apiHelper.getValueFromObject(params, 'representative_id_card', null))
            .input(
                'REPRESENTATIVEIDCARDPLACE',
                apiHelper.getValueFromObject(params, 'representative_id_card_place', null),
            )
            .input('IMAGEAVATAR', apiHelper.getValueFromObject(params, 'image_avatar', null))
            .input('NOTE', apiHelper.getValueFromObject(params, 'note', null))
            .input('ISCRTSYSTEM', apiHelper.getValueFromObject(params, 'is_crt_system', API_CONST.ISACTIVE.ACTIVE))
            .input('ISACTIVE', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ACTIVE))
            .input('ISSYSTEM', apiHelper.getValueFromObject(params, 'is_system', API_CONST.ISSYSTEM.NOT_SYSTEM))
            .input('CREATEDUSER', apiHelper.getValueFromObject(params, 'auth_name', null))
            .execute(PROCEDURE_NAME.CRM_PARTNER_CREATEORUPDATE_ADMINWEB);
        let result = apiHelper.getResult(dataPartner.recordset);
        if (!result) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Lỗi tạo hoặc cập nhật khách hàng doanh nghiệp', null);
        }
        if (id != null) {
            const reqCustomerContactDel = new sql.Request(transaction);
            const dataCustomerContactDel = await reqCustomerContactDel
                .input('PARTNERID', id)
                .input('DELETEDUSER', apiHelper.getValueFromObject(params, 'auth_name', null))
                .execute(PROCEDURE_NAME.CRM_PARTNER_CUSTOMERCONTACT_DELETEMANY_ADMINWEB);
            if (!apiHelper.getResult(dataCustomerContactDel.recordset)) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Lỗi xóa người liên hệ');
            }
        }
        const customer_contacts = apiHelper.getValueFromObject(params, 'customer_contacts', []);
        if (customer_contacts.length > 0) {
            const reqCustomerContactInsert = new sql.Request(transaction);
            const dataCustomerContactInsert = await reqCustomerContactInsert
                .input('PARTNERID', result)
                .input('LIST', customer_contacts.map((x) => x.contact_customer_id).join(','))
                .input('CREATEDUSER', apiHelper.getValueFromObject(params, 'auth_name', null))
                .execute(PROCEDURE_NAME.CRM_PARTNER_CUSTOMERCONTACT_CREATEMANY_ADMINWEB);
            let resultCustomerContactInsert = apiHelper.getResult(dataCustomerContactInsert.recordset);
            if (!resultCustomerContactInsert) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Lỗi tạo người liên hệ', null);
            }
        }
        removeCacheOptions();
        transaction.commit();
        return new ServiceResponse(true);
    } catch (error) {
        transaction.rollback();
        logger.error(error, { function: 'servicePartner.createOrUpdateHandler' });
        return new ServiceResponse(false, error.message);
    }
};

const detail = async (id) => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request().input('PARTNERID', id).execute(PROCEDURE_NAME.CRM_PARTNER_GET_BY_ID_ADMINWEB);
        return new ServiceResponse(true, '', {
            ...partnerClass.detail(res.recordset[0]),
            customer_contacts: partnerClass.listCustomerContact(res.recordsets[1]),
        });
    } catch (error) {
        logger.error(error, { function: 'servicePartner.detail' });
        return new ServiceResponse(false, error.message);
    }
};

const remove = async (bodyParams) => {
    try {
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []).join(',');
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('IDS', list_id)
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.CRM_PARTNER_DELETEMANY_ADMINWEB);
        const result = apiHelper.getResult(data.recordset);
        if (!result) {
            return new ServiceResponse(false);
        }
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'ManufacturerService.deleteManufacturer' });
        return new ServiceResponse(false, e.message);
    }
};

const getCustomerContact = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(params, 'keyword', null))
            .input('ISACTIVE', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ALL))
            .input('PAGESIZE', apiHelper.getValueFromObject(params, 'itemsPerPage', API_CONST.PAGINATION.LIMIT))
            .input('PAGEINDEX', apiHelper.getValueFromObject(params, 'page', null))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(params, 'created_date_from', null))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(params, 'created_date_to', null))
            .execute(PROCEDURE_NAME.CRM_CUSTOMERCONTACT_GETLIST_ADMINWEB);
        return new ServiceResponse(true, '', {
            list: partnerClass.listCustomerContact(data.recordsets[0]),
            total: data.recordset[0]?.['TOTALITEMS'] || 0,
        });
    } catch (error) {
        logger.error(error, { function: 'servicePartner.getCustomerContact' });
        return new ServiceResponse(false, error.message);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.MD_SOURCE_OPTIONS);
};

const getCustomerTypeInfo = async (id) => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request().input('CUSTOMERTYPEID', id).execute(PROCEDURE_NAME.CRM_CUSTOMERTYPE_GETBYID);
        return new ServiceResponse(true, '',partnerClass.detailCustomerType(res.recordset[0]));
    } catch (error) {
        logger.error(error, { function: 'servicePartner.getCustomerTypeInfo' });
        return new ServiceResponse(false, error.message);
    }
};

const exportExcel = async (queryParams = {}) => {
    try {
        const serviceRes = await getList({ ...queryParams, itemsPerPage: API_CONST.MAX_EXPORT_EXCEL });
        if (serviceRes.isFailed()) {
            return new ServiceResponse(false, 'Lỗi xuất file excel.');
        }

        const { list } = serviceRes.getData();
        const dataExport = list.map((item) => ({
            ...item,
            is_active: item.is_active ? 'Kích hoạt' : 'Ẩn',
        }));

        const wb = new xl.Workbook();
        addSheetGetList({
            workbook: wb,
            sheetName: 'Danh sách khách hàng đăng kí nhận tin',
            header: {
                partner_code: 'Mã khách hàng DN',
                partner_name: 'Tên khách hàng DN',
                tax_code: 'Mã số thuế',
                phone_number: 'Số điện thoại',
                caring_user_name: 'Nhân viên phụ trách',
                address: 'Địa chỉ',
                is_active: 'Kích hoạt',
            },
            data: dataExport,
        });

        return new ServiceResponse(true, '', wb);
    } catch (error) {
        logger.error(error, { function: 'servicePartner.exportExcel' });
        return new ServiceResponse(true, '', {});
    }
};

const getOptionsListAccount = async (params = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(params);
        const itemsPerPage = apiHelper.getItemsPerPage(params);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(params, 'keyword'))
            .input('PAGESIZE', apiHelper.getValueFromObject(params, 'itemsPerPage', 5))
            .input('PAGEINDEX', apiHelper.getValueFromObject(params, 'page', 1))
            .execute('CRM_ACCOUNT_GetListAccount_AdminWeb');

        return new ServiceResponse(true, '', {
            data: partnerClass.listAccount(data.recordsets[0]),
            page: currentPage,
            limit: itemsPerPage,
            total: data.recordset[0]?.['TOTALITEMS'] || 0,
        });
    } catch (error) {
        logger.error(error, { function: 'partnerService.getOptionsListAccount' });
        return new ServiceResponse(true, '', {});
    }
}

module.exports = {
    getList,
    detail,
    createOrUpdate,
    remove,
    getCustomerContact,
    getCustomerTypeInfo,
    exportExcel,
    getOptionsListAccount
};
