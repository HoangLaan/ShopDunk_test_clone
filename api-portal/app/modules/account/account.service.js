const crmAccountClass = require('../account/account.class');
const templateMail = require('../account/template.html');

const crmAccCustomerTypeService = require('../acc-customer-type/acc-customer-type.service');
const crmCustomerCompanyService = require('../customer-company/customer-company.service');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const API_CONST = require('../../common/const/api.const');
const stringHelper = require('../../common/helpers/string.helper');
const _ = require('lodash');
const fileHelper = require('../../common/helpers/file.helper');
const folderName = 'account';
const config = require('../../../config/config');
const xl = require('excel4node');
const API_SOCIAL = require('../../common/const/axios-api.const');
const nodemailer = require('nodemailer');
const { excelHeaderStyle, exampleImportDataHeader, exampleImportData } = require('./constants');
const readXlsxFile = require('read-excel-file/node');
const { getImageUrl, addSheet } = require('./utils');
const validateRules = require('./account.rule');
const Joi = require('joi');
const { addSheet: addSheetV2, addOptionToData } = require('../../common/helpers/excel.helper');

/**
 * Get list CRM_ACCOUNT
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListCRMAccount = async (queryParams = {}, authName) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams).trim();
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('CARINGUSER', authName)
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('COUNTRYID', apiHelper.getValueFromObject(queryParams, 'country_id'))
            .input('PROVINCEID', apiHelper.getValueFromObject(queryParams, 'province_id'))
            .input('DISTRICTID', apiHelper.getValueFromObject(queryParams, 'district_id'))
            .input('WARDID', apiHelper.getValueFromObject(queryParams, 'ward_id'))
            .input('FROMBIRTHDAY', apiHelper.getValueFromObject(queryParams, 'from_birth_day'))
            .input('TOBIRTHDAY', apiHelper.getValueFromObject(queryParams, 'to_birth_day'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
            .input('GENDER', apiHelper.getValueFromObject(queryParams, 'gender'))
            .input('SOURCEID', apiHelper.getValueFromObject(queryParams, 'source_id'))
            .input('TYPEREGISTER', apiHelper.getValueFromObject(queryParams, 'type_register'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .input('CUSTOMERTYPEID', apiHelper.getValueFromObject(queryParams, 'customer_type_id'))
            .input('PROCESSSTEPID', apiHelper.getValueFromObject(queryParams, 'process_step_id'))
            .input('CUSTOMERCOMPANYNAME', apiHelper.getValueFromObject(queryParams, 'customer_company_name'))
            .input('USERASSIGNED', apiHelper.getValueFromObject(queryParams, 'user_assigned'))
            .input('DATERETURNED', apiHelper.getValueFromObject(queryParams, 'date_returned'))
            .input('DAYSSINCELASTORDERFROM', apiHelper.getValueFromObject(queryParams, 'days_since_last_order_from'))
            .input('DAYSSINCELASTORDERTO', apiHelper.getValueFromObject(queryParams, 'days_since_last_order_to'))
            .input('ORDERCOUNT', apiHelper.getValueFromObject(queryParams, 'order_count'))
            .input('ORDEROPERATOR', apiHelper.getValueFromObject(queryParams, 'order_operator'))
            .input('TASKSTATUS', apiHelper.getValueFromObject(queryParams, 'task_status'))
            .input('MEMBERID', apiHelper.getValueFromObject(queryParams, 'member_id'))
            .input('BUYFROM', apiHelper.getValueFromObject(queryParams, 'buy_from'))
            .input('BUYTO', apiHelper.getValueFromObject(queryParams, 'buy_to'))
            .input('WFLOWID', apiHelper.getValueFromObject(queryParams, 'wflow_id'))
            .input('INTERESTCONTENT', apiHelper.getValueFromObject(queryParams, 'interest_content'))
            .input('ISEXISTSEMAIL', apiHelper.getValueFromObject(queryParams, 'is_exists_email'))
            .execute(PROCEDURE_NAME.CRM_ACCOUNT_GETLIST_ADMINWEB);

        // const Account = data.recordsets[0];
        const Account = data.recordset;
        return new ServiceResponse(true, '', {
            data: crmAccountClass.list(Account),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(Account),
        });
    } catch (e) {
        logger.error(e, {
            function: 'AccountService.getListCRMAccount',
        });
        return new ServiceResponse(true, '', {});
    }
};

const getListCustomerOptimal = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams).trim();
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', keyword)
            .input('ORDEROPERATOR', apiHelper.getValueFromObject(queryParams, 'order_operator'))
            .input('ORDERCOUNT', apiHelper.getValueFromObject(queryParams, 'order_count'))
            .input('SOURCEID', apiHelper.getValueFromObject(queryParams, 'source_id'))
            .input('CUSTOMERTYPEID', apiHelper.getValueFromObject(queryParams, 'customer_type_id'))
            .input('WFLOWID', apiHelper.getValueFromObject(queryParams, 'wflow_id'))
            .input('INTERESTCONTENT', apiHelper.getValueFromObject(queryParams, 'interest_content'))
            .input('FROMBIRTHDAY', apiHelper.getValueFromObject(queryParams, 'from_birth_day'))
            .input('TOBIRTHDAY', apiHelper.getValueFromObject(queryParams, 'to_birth_day'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
            .input('BUYFROM', apiHelper.getValueFromObject(queryParams, 'buy_from'))
            .input('BUYTO', apiHelper.getValueFromObject(queryParams, 'buy_to'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .input('TASKSTATUS', apiHelper.getValueFromObject(queryParams, 'task_status'))
            .input('BRANDID', apiHelper.getValueFromObject(queryParams, 'brand_id'))
            .execute('CRM_ACCOUNT_GetListCustomer_AdminWeb');

        // const Account = data.recordsets[0];
        const Account = data.recordset;
        return new ServiceResponse(true, '', {
            data: crmAccountClass.list(Account),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(Account),
        });
    } catch (e) {
        logger.error(e, {
            function: 'AccountService.getListCustomerOptimal',
        });
        return new ServiceResponse(true, '', {});
    }
};

const getListLatestCRMAccount = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('CARINGUSER', queryParams.user)
            .execute(PROCEDURE_NAME.CRM_ACCOUNT_GETLISTLATEST_ADMINWEB);
        const Account = data.recordsets[0];
        return new ServiceResponse(true, '', {
            data: crmAccountClass.list(Account),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(Account),
        });
    } catch (e) {
        logger.error(e, {
            function: 'AccountService.getListLatestCRMAccount',
        });
        return new ServiceResponse(true, '', {});
    }
};

const createCRMAccount = async (body = {}, bodyAccCustomerType = {}) => {
    return await createCRMAccountOrUpdate(body);
};

const updateCRMAccount = async (body = {}, member_id) => {
    body.member_id = member_id;
    return await createCRMAccountOrUpdate(body);
};

const findByCustomerCode = async (customerCode, memberId) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('MEMBERID', memberId)
            .input('CUSTOMERCODE', customerCode)
            .execute('CRM_ACCOUNT_FindByCustomerCode_AdminWeb');
        let data = res.recordset;
        if (data.length) {
            return true;
        }
        return null;
    } catch (error) {
        logger.error(error, {
            function: 'AccountService.findByCustomerCode',
        });
        return new ServiceResponse(false, error.message);
    }
};

const createCRMAccountOrUpdate = async (body = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();

        let password = apiHelper.getValueFromObject(body, 'password');
        password = password ? stringHelper.hashPassword(password) : null;

        let customer_type_list = apiHelper.getValueFromObject(body, 'customer_type');
        let image_avatar = apiHelper.getValueFromObject(body, 'image_avatar');
        if (image_avatar) {
            const path_image_avatar = await saveFile(image_avatar, folderName);
            if (path_image_avatar) {
                image_avatar = path_image_avatar;
            }
        }

        // Save CRM_ACCOUNT
        const requestAccount = new sql.Request(transaction);
        const resultAccount = await requestAccount
            .input('MEMBERID', apiHelper.getValueFromObject(body, 'member_id'))
            .input('USERNAME', apiHelper.getValueFromObject(body, 'phone_number'))
            .input('CUSTOMERTYPEID', apiHelper.getValueFromObject(body, 'customer_type_id'))
            .input('CUSTOMERCOMPANYID', apiHelper.getValueFromObject(body, 'customer_company_id'))
            .input('ANNIVERSARYDATE', apiHelper.getValueFromObject(body, 'anniversary_date'))
            .input('HUSBANDWIFEDATE', apiHelper.getValueFromObject(body, 'husband_wife_date'))
            .input('SOURCEID', apiHelper.getValueFromObject(body, 'source_id'))
            .input('CAREERID', apiHelper.getValueFromObject(body, 'career_id'))
            .input('DATALEADSID', apiHelper.getValueFromObject(body, 'data_leads_id'))
            .input('IMAGEAVATAR', image_avatar)
            .input('PASSWORD', password)
            .input('FULLNAME', apiHelper.getValueFromObject(body, 'fullNameCustomer'))
            .input('BIRTHDAY', apiHelper.getValueFromObject(body, 'birth_day'))
            .input('GENDER', apiHelper.getValueFromObject(body, 'gender'))
            .input('MARITALSTATUS', apiHelper.getValueFromObject(body, 'marital_status'))
            .input('PHONENUMBER', apiHelper.getValueFromObject(body, 'phone_number'))
            .input('PHONENUMBERSECONDARY', apiHelper.getValueFromObject(body, 'phone_number_secondary'))
            .input('EMAIL', apiHelper.getValueFromObject(body, 'email'))
            .input('IDCARD', apiHelper.getValueFromObject(body, 'id_card'))
            .input('IDCARDDATE', apiHelper.getValueFromObject(body, 'id_card_date'))
            .input('IDCARDPLACE', apiHelper.getValueFromObject(body, 'id_card_place'))
            .input('ADDRESS', apiHelper.getValueFromObject(body, 'address'))
            .input('PROVINCEID', apiHelper.getValueFromObject(body, 'province_id'))
            .input('DISTRICTID', apiHelper.getValueFromObject(body, 'district_id'))
            .input('COUNTRYID', apiHelper.getValueFromObject(body, 'country_id'))
            .input('WARDID', apiHelper.getValueFromObject(body, 'ward_id'))
            .input('POSTALCODE', apiHelper.getValueFromObject(body, 'postal_code'))
            .input('CARINGUSER', apiHelper.getValueFromObject(body, 'caring_user'))
            .input('CUSTOMERCODE', apiHelper.getValueFromObject(body, 'customer_code'))
            .input('PRESENTERID', apiHelper.getValueFromObject(body, 'presenter_id'))
            .input('ZALOID', apiHelper.getValueFromObject(body, 'zalo_id'))
            .input('FACEBOOKID', apiHelper.getValueFromObject(body, 'facebook_id'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(body, 'is_system'))
            .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute(PROCEDURE_NAME.CRM_ACCOUNT_CREATEORUPDATE_ADMINWEB);

        const isCreate = apiHelper.getValueFromObject(body, 'member_id') ? false : true;

        const member_id = resultAccount.recordset[0].RESULT;
        const memberName = resultAccount.recordset[0].FULLNAME;
        const customerCode = resultAccount.recordset[0].CUSTOMERCODE;

        // check xem user đó đã có địa chỉ mặc định trong sổ địa chỉ hay chưa
        if (isCreate && member_id > 0) {
            let province_id = apiHelper.getValueFromObject(body, 'province_id');
            let district_id = apiHelper.getValueFromObject(body, 'district_id');
            let ward_id = apiHelper.getValueFromObject(body, 'ward_id');
            const requestAddressBook = new sql.Request(transaction);
            const resultAddressBook = await requestAddressBook
                .input('MEMBERID', member_id)
                .input('ADDRESSID', apiHelper.getValueFromObject(body, 'address_id'))
                .input('GENDER', apiHelper.getValueFromObject(body, 'gender'))
                .input('FULLNAME', apiHelper.getValueFromObject(body, 'fullNameCustomer'))
                .input('ADDRESS', apiHelper.getValueFromObject(body, 'address'))
                .input('CAREERID', apiHelper.getValueFromObject(body, 'career_id'))
                .input('PHONENUMBER', apiHelper.getValueFromObject(body, 'phone_number'))
                .input('PROVINCEID', province_id)
                .input('DISTRICTID', district_id)
                .input('WARDID', ward_id)
                .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                .input('ISDEFAULT', 1)
                .execute('CRM_ADDRESSBOOK_CreateOrUpdate_AdminWeb');
            const addressBookId = resultAddressBook.recordset[0].RESULT;

            if (addressBookId < 0) {
                await transaction.rollback();
                return new ServiceResponse(false, e.message);
            }
        }

        const requestDeleteCustomerType = new sql.Request(transaction);
        await requestDeleteCustomerType
            .input('MEMBERID', member_id)
            .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute('CRM_ACC_CUSTOMERTYPE_delete_AdminWeb');

        const requestAddCustomerType = new sql.Request(transaction);
        if (customer_type_list && customer_type_list.length > 0) {
            for (let i = 0; i < customer_type_list.length; i++) {
                const resultAddCustomerType = await requestAddCustomerType
                    .input('MEMBERID', member_id)
                    .input('CUSTOMERTYPEID', parseInt(customer_type_list[i].value))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                    .input('ISACTIVE', 1)
                    .input('ISDELETED', 0)
                    .execute('CRM_ACC_CUSTOMERTYPE_CreateOrUpdate_AdminWeb');
                let resultAdd =
                    resultAddCustomerType &&
                    resultAddCustomerType.recordset &&
                    resultAddCustomerType.recordset.length &&
                    resultAddCustomerType.recordset[0].RESULT;
                if (!resultAdd || !resultAddCustomerType.recordset) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Lỗi lưu danh sách loại khách hàng');
                }
            }
        }

        Object.assign(body, { member_id: member_id });
        if (member_id && isCreate) {
            crmAccCustomerTypeService.createAccCustomerTypeOrUpdate(body, member_id);
        }

        await transaction.commit();
        return new ServiceResponse(true, '', {
            member_id: member_id,
            member_name: memberName,
            customer_code: customerCode,
        });
    } catch (error) {
        await transaction.rollback();
        logger.error(error, {
            function: 'AccountService.createCRMAccountOrUpdate',
        });
        return new ServiceResponse(false, error.message);
    }
};

const detailCRMAccount = async (memberid) => {
    try {
        const pool = await mssql.pool;

        const data = await pool
            .request()
            .input('MEMBERID', memberid)
            .execute(PROCEDURE_NAME.CRM_ACCOUNT_GETBYID_ADMINWEB);
        const Account =
            data &&
            data.recordsets &&
            data.recordsets.length > 0 &&
            data.recordsets[0] &&
            data.recordsets[0].length &&
            data.recordsets[0][0]
                ? data.recordsets[0][0]
                : [];
        const customer_typeList =
            data && data.recordsets && data.recordsets.length > 0 && data.recordsets[1] ? data.recordsets[1] : [];

        let accountResult = crmAccountClass.detail(Account);
        let customertypeListResult = crmAccountClass.listCustomerTypeValueLabel(customer_typeList);
        const customer_company = crmAccountClass.customerCompany(data.recordsets[2][0]);
        if (Account) {
            return new ServiceResponse(true, '', {
                ...accountResult,
                customer_type: customertypeListResult,
                customer_company,
            });
        }
        return new ServiceResponse(false, '', null);
    } catch (e) {
        logger.error(e, {
            function: 'AccountService.detailAccount',
        });

        return new ServiceResponse(false, e.message);
    }
};

const detailGenCustomerCode = async () => {
    try {
        const pool = await mssql.pool;

        const data = await pool.request().execute(PROCEDURE_NAME.CRM_ACCOUNT_GENCUSTOMERCODE);
        const Account = data.recordset[0];
        if (Account) {
            return new ServiceResponse(true, '', crmAccountClass.genCustomerCode(Account));
        }
        return new ServiceResponse(false, '', null);
    } catch (e) {
        logger.error(e, {
            function: 'AccountService.detailGenCustomerCode',
        });

        return new ServiceResponse(false, e.message);
    }
};

const deleteCRMAccount = async (memberid, authName) => {
    const pool = await mssql.pool;
    try {
        // Delete user group
        await pool
            .request()
            .input('MEMBERID', memberid)
            .input('UPDATEDUSER', authName)
            .execute(PROCEDURE_NAME.CRM_ACCOUNT_DELETE_ADMINWEB);

        removeCacheOptions();

        // Return ok
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, {
            function: 'AccountService.deleteAccount',
        });

        // Return failed
        return new ServiceResponse(false, e.message);
    }
};

const changeStatusCRMAccount = async (memberid, authName, isActive) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('MEMBERID', memberid)
            .input('ISACTIVE', isActive)
            .input('UPDATEDUSER', authName)
            .execute(PROCEDURE_NAME.CRM_ACCOUNT_UPDATESTATUS_ADMINWEB);
        removeCacheOptions();
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, {
            function: 'AccountService.changeStatusCRMAccount',
        });

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
        } else {
            url = base64.split(config.domain_cdn)[1];
        }
    } catch (e) {
        logger.error(e, {
            function: 'AccountService.saveFile',
        });
    }
    return url;
};

const createGuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        var r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.CRM_ACCOUNT_OPTIONS);
};

const changePassCRMAccount = async (memberid, body = {}) => {
    try {
        const pool = await mssql.pool;
        let password = apiHelper.getValueFromObject(body, 'password');
        password = stringHelper.hashPassword(password);
        await pool
            .request()
            .input('MEMBERID', memberid)
            .input('PASSWORD', password)
            .input('UPDATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute(PROCEDURE_NAME.CRM_ACCOUNT_CHANGEPASS_ADMINWEB);
        removeCacheOptions();
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, {
            function: 'AccountService.changePassCRMAccount',
        });

        return new ServiceResponse(false);
    }
};

//get list history
const getListHistory = async (member_id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('MEMBERID', member_id)
            .execute(PROCEDURE_NAME.CRM_TAILORATTRIBUTE_HISTORY_GETLIST_ADMINWEB);
        const list = data.recordset;
        // If exists
        return new ServiceResponse(true, '', {
            listHistory: crmAccountClass.listHistory(list),
        });
    } catch (e) {
        logger.error(e, { function: 'AccountService.getListHistory' });
        return new ServiceResponse(false, e.message);
    }
};

const exportExcel = async (queryParams = {}) => {
    const params = {
        ...queryParams,
        itemsPerPage: API_CONST.MAX_EXPORT_EXCEL,
        is_active: 1,
    };
    const serviceRes = await getListCustomerOptimal(params);
    const { data } = serviceRes.getData();
    const wb = new xl.Workbook();
    addSheetV2({
        workbook: wb,
        isAddNoNum: true,
        sheetName: 'Danh sách khách hàng',
        config: {
            customer_code: {
                title: 'Mã khách hàng',
            },
            full_name: {
                title: 'Tên khách hàng',
            },
            gender: {
                title: 'Giới tính',
            },
            birth_day: {
                title: 'Ngày sinh',
            },
            phone_number: {
                title: 'Số điện thoại',
            },
            address_full: {
                title: 'Địa chỉ',
                width: 40,
            },
            customer_type_name: {
                title: 'Hạng khách hàng',
            },
        },
        data,
    });

    return new ServiceResponse(true, '', wb);
};

const getTemplateImport = async () => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request().execute(PROCEDURE_NAME.CRM_ACCOUNT_GETTEMPLATEIMPORT_ADMINWEB);
        let [customerTypeOptions, sourceOptions, presenterOptions, careerOptions] = res.recordsets;
        customerTypeOptions = addOptionToData(customerTypeOptions);
        sourceOptions = addOptionToData(sourceOptions);
        presenterOptions = addOptionToData(presenterOptions);
        careerOptions = addOptionToData(careerOptions);

        const wb = new xl.Workbook();
        const headerStyle = wb.createStyle(excelHeaderStyle);

        const _exampleImportData = [...exampleImportData];
        _exampleImportData[0].customer_type_id = customerTypeOptions[0].option;
        _exampleImportData[0].source_id = sourceOptions[0].option;
        _exampleImportData[0].presenter_id = presenterOptions[0].option;
        _exampleImportData[0].career_id = careerOptions[0].option;

        addSheetV2({
            workbook: wb,
            sheetName: 'Nhập khách hàng',
            isAddNoNum: true,
            config: {
                ...exampleImportDataHeader,
                customer_type_id: {
                    title: 'Hạng khách hàng *',
                    width: 20,
                    validate: {
                        type: 'list',
                        allowBlank: true,
                        showDropDown: true,
                        formulas: [`='Hạng khách hàng'!$C$2:$C$${customerTypeOptions.length + 1}`],
                    },
                },
                source_id: {
                    title: 'Nguồn khách hàng',
                    width: 20,
                    validate: {
                        type: 'list',
                        allowBlank: true,
                        showDropDown: true,
                        formulas: [`='Nguồn khách hàng'!$C$2:$C$${sourceOptions.length + 1}`],
                    },
                },
                presenter_id: {
                    title: 'Người giới thiệu',
                    width: 20,
                    validate: {
                        type: 'list',
                        allowBlank: true,
                        showDropDown: true,
                        formulas: [`='Người giới thiệu'!$C$2:$C$${presenterOptions.length + 1}`],
                    },
                },
                career_id: {
                    title: 'Nghề nghiệp',
                    width: 20,
                    validate: {
                        type: 'list',
                        allowBlank: true,
                        showDropDown: true,
                        formulas: [`='Nghề nghiệp'!$C$2:$C$${careerOptions.length + 1}`],
                    },
                },
                gender: {
                    title: 'Giới tính *',
                    width: 20,
                    validate: {
                        type: 'list',
                        allowBlank: true,
                        showDropDown: true,
                        formulas: ['Nam,Nữ'],
                    },
                },
                is_active: {
                    title: 'Kích hoạt',
                    width: 20,
                    validate: {
                        type: 'list',
                        allowBlank: true,
                        showDropDown: true,
                        formulas: ['Có,Không'],
                    },
                },
            },
            data: _exampleImportData,
        });

        addSheetV2({
            workbook: wb,
            sheetName: 'Hạng khách hàng',
            config: {
                id: { title: 'Mã hạng khách hàng' },
                name: { title: 'Tên hạng khách hàng' },
                option: {
                    title: 'Hạng khách hàng',
                    width: 30,
                },
            },
            data: customerTypeOptions,
        });
        addSheetV2({
            workbook: wb,
            sheetName: 'Nguồn khách hàng',
            config: {
                id: { title: 'Mã nguồn khách hàng' },
                name: { title: 'Tên nguồn khách hàng' },
                option: {
                    title: 'Nguồn khách hàng',
                    width: 30,
                },
            },
            data: sourceOptions,
        });
        addSheetV2({
            workbook: wb,
            sheetName: 'Người giới thiệu',
            config: {
                id: { title: 'Mã người giới thiệu' },
                name: { title: 'Tên người giới thiệu' },
                option: {
                    title: 'Người giới thiệu',
                    width: 30,
                },
            },
            data: presenterOptions,
        });
        addSheetV2({
            workbook: wb,
            sheetName: 'Nghề nghiệp',
            config: {
                id: { title: 'Mã nghề nghiệp' },
                name: { title: 'Tên nghề nghiệp' },
                option: {
                    title: 'Nghề nghiệp',
                    width: 30,
                },
            },
            data: careerOptions,
        });

        return new ServiceResponse(true, '', wb);
    } catch (error) {
        logger.error(error, {
            function: 'customerService.getTemplateImport',
        });
        return new ServiceResponse(false, e.message);
    }
};

const createOrUpdate = async (body) => {
    try {
        const authName = apiHelper.getValueFromObject(body, 'auth_name', 'administrator');

        let password = apiHelper.getValueFromObject(body, 'password', 'SDxinchao');
        password = stringHelper.hashPassword(password);

        let image_avatar = apiHelper.getValueFromObject(body, 'image_avatar');
        if (image_avatar) {
            const path_image_avatar = await getImageUrl(image_avatar);
            if (path_image_avatar) {
                image_avatar = path_image_avatar;
            }
        }
        const pool = await mssql.pool;
        const createOrUpdateResult = await pool
            .request()
            .input('IMAGEAVATAR', image_avatar)
            .input('FULLNAME', apiHelper.getValueFromObject(body, 'full_name'))
            .input('BIRTHDAY', apiHelper.getValueFromObject(body, 'birth_day'))
            .input('GENDER', apiHelper.getValueFromObject(body, 'gender'))
            .input('PHONENUMBER', apiHelper.getValueFromObject(body, 'phone_number'))
            .input('EMAIL', apiHelper.getValueFromObject(body, 'email'))
            .input('PASSWORD', password)
            .input('USERNAME', apiHelper.getValueFromObject(body, 'phone_number'))
            .input('ZALOID', apiHelper.getValueFromObject(body, 'zalo_id'))
            .input('FACEBOOKID', apiHelper.getValueFromObject(body, 'facebook_id'))
            .input('AFFILIATE', apiHelper.getValueFromObject(body, 'affiliate'))
            .input('SOURCEID', apiHelper.getValueFromObject(body, 'source_id'))
            .input('PRESENTERID', apiHelper.getValueFromObject(body, 'presenter_id'))
            .input('CUSTOMERCOMPANYID', apiHelper.getValueFromObject(body, 'customer_company_id'))
            .input('CUSTOMERTYPEID', apiHelper.getValueFromObject(body, 'customer_type_id'))
            .input('COUNTRYID', apiHelper.getValueFromObject(body, 'country_id'))
            .input('PROVINCEID', apiHelper.getValueFromObject(body, 'province_id'))
            .input('DISTRICTID', apiHelper.getValueFromObject(body, 'district_id'))
            .input('WARDID', apiHelper.getValueFromObject(body, 'ward_id'))
            .input('POSTALCODE', apiHelper.getValueFromObject(body, 'postal_code'))
            .input('ADDRESS', apiHelper.getValueFromObject(body, 'address'))
            .input('IDCARD', apiHelper.getValueFromObject(body, 'id_card'))
            .input('IDCARDDATE', apiHelper.getValueFromObject(body, 'id_card_date'))
            .input('IDCARDPLACE', apiHelper.getValueFromObject(body, 'id_card_place'))
            .input('CAREERID', apiHelper.getValueFromObject(body, 'career_id'))
            .input('IDCARDPLACE', apiHelper.getValueFromObject(body, 'id_card_place'))
            .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
            .input('CREATEDUSER', authName)
            .execute(PROCEDURE_NAME.CRM_ACCOUNT_CREATEORUPDATEACCOUNT_ADMINWEB);

        const idResult = createOrUpdateResult.recordset[0].RESULT;
        if (!idResult) {
            return new ServiceResponse(false, 'Lỗi lưu khách hàng');
        }
        return new ServiceResponse(true, 'Lưu khách hàng thành công', {});
    } catch (e) {
        logger.error(e, { function: 'customerService.createOrUpdate' });
        return new ServiceResponse(false, e.message);
    }
};

const importExcel = async (bodyParams = {}, file) => {
    try {
        const rows = await readXlsxFile(file.buffer);
        let import_errors = [];

        if (rows?.length <= 1) {
            return new ServiceResponse(false, 'Tập tin chưa có dữ liệu!', null);
        }

        // transform array excel row to array valid object
        const rowsDataCustomer = [];
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const rowItem = {};
            Object.keys(exampleImportDataHeader).forEach((key, index) => {
                const indexColumn = index + 1;
                if (key === 'is_active') {
                    const cellIsActive = (row[indexColumn] || '').toString().trim().toLowerCase();
                    rowItem[key] = cellIsActive === 'có' || cellIsActive === '1' ? 1 : 0;
                } else if (key === 'gender') {
                    const cellIsActive = (row[indexColumn] || '').toString().trim().toLowerCase();
                    rowItem[key] = cellIsActive === 'nam' ? 1 : 0;
                } else if (['customer_type_id', 'source_id', 'presenter_id', 'career_id'].indexOf(key) > -1) {
                    const _value = (row[indexColumn] || '').split(' - ');
                    rowItem[key] = _value?.length ? _value[0] : null;
                } else {
                    rowItem[key] = (row[indexColumn] || '').toString().trim();
                }
            });
            rowsDataCustomer.push(rowItem);
        }

        // start import
        for (let i = 0; i < rowsDataCustomer.length; i++) {
            const rowItem = {
                ...rowsDataCustomer[i],
                is_system: 0,
            };
            try {
                await Joi.object(validateRules.createCRMAccount.body).validate(rowItem);
                const serviceRes = await createOrUpdate(rowItem);
                if (serviceRes.isFailed()) {
                    throw new Error(serviceRes.message);
                }
            } catch (error) {
                const msg = error?.details?.length ? error?.details[0]?.message : error.message;
                const _error = { ...rowItem, error_message: msg };
                import_errors.push(_error);
            }
        }
        return new ServiceResponse(true, '', {
            import_data: rowsDataCustomer,
            import_errors,
        });
    } catch (error) {
        console.log('~  error >>>', error);
        logger.error(error, {
            function: 'customerService.importExcel',
        });
        return new ServiceResponse(false, error.message);
    }
};

const getListSource = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('MD_SOURCE_GetListSource_AdminWeb');
        let sourceList = data.recordset;
        return new ServiceResponse(true, '', {
            data: crmAccountClass.listSource(sourceList),
        });
    } catch (e) {
        logger.error(e, { function: 'AccountService.getListSource' });
        return new ServiceResponse(false, e.message);
    }
};

const getListCareer = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('MD_SOURCE_GetListCareer_AdminWeb');
        let sourceList = data.recordset;
        return new ServiceResponse(true, '', {
            data: crmAccountClass.listSource(sourceList),
        });
    } catch (e) {
        logger.error(e, { function: 'AccountService.getListCareer' });
        return new ServiceResponse(false, e.message);
    }
};

const getListProcess = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('RS_PROCESSSTEP_GetListOption_AdminWeb');
        let sourceList = data.recordset;
        return new ServiceResponse(true, '', {
            data: crmAccountClass.listProcess(sourceList),
        });
    } catch (e) {
        logger.error(e, { function: 'AccountService.getListCareer' });
        return new ServiceResponse(false, e.message);
    }
};

const getBuyHistoryList = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);

        const data = await pool
            .request()
            .input('MEMBERID', apiHelper.getValueFromObject(queryParams, 'member_id'))
            .input('ORDERID', apiHelper.getValueFromObject(queryParams, 'order_id'))
            .input('DATALEADSID', apiHelper.getValueFromObject(queryParams, 'data_leads_id'))
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .execute('CRM_ACCOUNT_GetPurchaseHistory_AdminWeb');

        const dataHistoryList = data.recordsets;
        // const dataHistoryStatitics = crmAccountClass.purchaseHistoryStatistics(data.recordsets[1][0]);
        return new ServiceResponse(true, '', {
            data: {
                list: crmAccountClass.purchaseHistoryList(dataHistoryList[0]),
                statitics: {
                    total_money: data.recordsets[1][0]?.TOTALORDERMONEY || 0,
                    total_orders: data.recordsets[2]?.length || 0,
                },
            },
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(dataHistoryList[0]),
        });
    } catch (e) {
        logger.error(e, { function: 'AccountService.getBuyHistoryList' });
        return new ServiceResponse(false, '', { dataHistoryList: [] });
    }
};

const createOrUpdateAddressBook = async (body = {}) => {
    try {
        const pool = await mssql.pool;
        const { recordset } = await pool
            .request()
            .input('ADDRESSID', apiHelper.getValueFromObject(body, 'address_id'))
            .input('MEMBERID', apiHelper.getValueFromObject(body, 'member_id'))
            .input('GENDER', apiHelper.getValueFromObject(body, 'gender'))
            .input('FULLNAME', apiHelper.getValueFromObject(body, 'full_name_customer'))
            .input('ADDRESS', apiHelper.getValueFromObject(body, 'address'))
            .input('CAREERID', apiHelper.getValueFromObject(body, 'career_id'))
            .input('PHONENUMBER', apiHelper.getValueFromObject(body, 'phone_number'))
            .input('PROVINCEID', apiHelper.getValueFromObject(body, 'province_id'))
            .input('DISTRICTID', apiHelper.getValueFromObject(body, 'district_id'))
            .input('NOTE', apiHelper.getValueFromObject(body, 'note'))
            .input('WARDID', apiHelper.getValueFromObject(body, 'ward_id'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .input('EMAIL', apiHelper.getValueFromObject(body, 'email'))
            .input('ISDEFAULT', apiHelper.getValueFromObject(body, 'is_default') * 1)
            .execute('CRM_ADDRESSBOOK_CreateOrUpdate_AdminWeb');
        return new ServiceResponse(true, '', recordset[0].RESULT);
    } catch (error) {
        return new ServiceResponse(false, error.message, null);
    }
};

const getListAddress = async (member_id, locale) => {
    try {
        const pool = await mssql.pool;
        const { recordset } = await pool
            .request()
            .input('LOCALE', 'vn')
            .input('MEMBERID', member_id)
            .execute('CRM_ADDRESSBOOK_GetList_AdminWeb');
        return new ServiceResponse(true, '', crmAccountClass.listAddress(recordset));
    } catch (error) {
        return new ServiceResponse(false, error.message, null);
    }
};

const deleteAddress = async (address_id, body = {}) => {
    try {
        const pool = await mssql.pool;
        const { recordset } = await pool
            .request()
            .input('ADDRESSID', address_id)
            .input('USERNAME', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute('CRM_ADDRESSBOOK_Delete_AdminWeb');
        return new ServiceResponse(true, '', '');
    } catch (error) {
        return new ServiceResponse(false, error.message, null);
    }
};

const changeDefault = async (body = {}) => {
    const { member_id, address_id } = body;
    try {
        const pool = await mssql.pool;
        const { recordset } = await pool
            .request()
            .input('ADDRESSID', address_id)
            .input('MEMBERID', member_id)
            .input('USERNAME', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute('CRM_ADDRESSBOOK_ChangeDefault_AdminWeb');
        return new ServiceResponse(true, '', '');
    } catch (error) {
        return new ServiceResponse(false, error.message, null);
    }
};

const getCustomerTypeHistoryList = async (member_id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('MEMBERID', member_id)
            .execute('CRM_ACCOUNT_GetListCustomerType_AdminWeb');
        const dataHistoryList = crmAccountClass.customerTypeHistory(data.recordsets[0]);
        return new ServiceResponse(true, '', { dataHistoryList });
    } catch (e) {
        logger.error(e, { function: 'AccountService.getCustomerTypeHistoryList' });
        return new ServiceResponse(false, '', {});
    }
};

const getCustomerRepairHistoryList = async (member_id, queryParams) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('MEMBERID', member_id)
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .execute('RS_RQ_WARRANTY_REPAIR_HISTORY_GetByMemberId_AdminWeb');
        const dataHistoryList = crmAccountClass.customerRepairHistory(data.recordset);
        return new ServiceResponse(true, '', {
            data: dataHistoryList,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, { function: 'AccountService.getCustomerTypeHistoryList' });
        return new ServiceResponse(false, '', {});
    }
};

const getProductWatchlist = async (queryParams = {}) => {
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
            .input('MEMBERID', apiHelper.getValueFromObject(queryParams, 'member_id'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
            .execute('CRM_ACCOUNT_GetProductWatchlist_AdminWeb');
        const products = data.recordset;
        return new ServiceResponse(true, '', {
            data: crmAccountClass.productWatchlist(products),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(products),
        });
    } catch (e) {
        logger.error(e, {
            function: 'AccountService.getProductWatchlist',
        });
        return new ServiceResponse(false, e.message);
    }
};

const sendMail = async (from, to, subject, text, html) => {
    try {
        var transporter = nodemailer.createTransport({
            // config mail server
            service: 'Gmail',
            auth: {
                user: config.mail.MAIL_SMTP_USER,
                pass: config.mail.MAIL_SMTP_PASSWORD,
            },
        });
        const mainOptions = {
            // thiết lập đối tượng, nội dung gửi mail
            from: config.mail.MAIL_FROM,
            to: to,
            subject: subject,
            text: text,
            html: html,
        };
        transporter.sendMail(mainOptions, (err, info) => {
            if (err) {
                console.log(err);
                return false;
            } else {
                console.log('Message sent: ' + info.response);
                return true;
            }
        });

        return true;
    } catch (e) {
        logger.error(e, {
            function: 'AccountService.sendMail',
        });
        return false;
    }
};

const getListHistoryDataLeadsCare = async (queryParams) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('MEMBERID', apiHelper.getValueFromObject(queryParams, 'member_id'))
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .execute('CRM_ACCOUNT_GetListDataLeadsCare_AdminWeb');
        const totalCountDataLeads = data.recordsets[0];
        const dataHistoryDataLeadsCare = crmAccountClass.dataleadshistory(data.recordsets[1]);
        return new ServiceResponse(true, '', {
            data: dataHistoryDataLeadsCare,
            totalCare: totalCountDataLeads ? totalCountDataLeads[0].COUNTCARE : 0,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordsets[1]),
        });
    } catch (e) {
        logger.error(e, { function: 'AccountService.getListHistoryDataLeadsCare' });
        return new ServiceResponse(false, '', {});
    }
};

const getListChatHistoryZalo = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const currentPage = apiHelper.getValueFromObject(queryParams, 'currentPage');
        const itemsPerPage = apiHelper.getValueFromObject(queryParams, 'itemsPerPage');
        const data = await pool
            .request()
            .input('MEMBERID', apiHelper.getValueFromObject(queryParams, 'member_id'))
            .execute(PROCEDURE_NAME.CRM_ACCOUNT_GETBYID_ADMINWEB);
        const accountDetail = crmAccountClass.detail(data.recordset[0]);

        let dataChatHistory = [];
        if (accountDetail.zalo_id) {
            let params = {
                user_id: accountDetail.zalo_id,
                offset: (currentPage - 1) * itemsPerPage,
                count: itemsPerPage,
            };
            const listZaloChat = await API_SOCIAL.getAPI('conversation', { data: params });
            if (listZaloChat && listZaloChat.length > 0) {
                dataChatHistory = listZaloChat;
            }
        }
        return new ServiceResponse(true, '', {
            data: dataChatHistory,
            page: currentPage,
            limit: itemsPerPage,
        });
    } catch (e) {
        logger.error(e, {
            function: 'AccountService.getListChatHistoryZalo',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getListCRMAccountTask = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', keyword)
            .input('COUNTRYID', apiHelper.getValueFromObject(queryParams, 'country_id'))
            .input('PROVINCEID', apiHelper.getValueFromObject(queryParams, 'province_id'))
            .input('DISTRICTID', apiHelper.getValueFromObject(queryParams, 'district_id'))
            .input('WARDID', apiHelper.getValueFromObject(queryParams, 'ward_id'))
            .input('GENDER', apiHelper.getValueFromObject(queryParams, 'gender'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
            .input('STATUSDATALEADSKEY', apiHelper.getValueFromObject(queryParams, 'status_data_leads_key'))
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .execute('CRM_ACCOUNT_GetList_Task_AdminWeb');

        const Account = data.recordset;

        return new ServiceResponse(true, '', {
            data: crmAccountClass.listAccountTask(Account),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(Account),
        });
    } catch (e) {
        logger.error(e, {
            function: 'AccountService.getListCRMAccountTask',
        });

        return new ServiceResponse(true, '', {});
    }
};
const getListMemberPoint = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('ISEXCHANGE', apiHelper.getValueFromObject(queryParams, 'is_exchange'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('MEMBERID', apiHelper.getValueFromObject(queryParams, 'member_id'))
            .execute('PO_MEMBERPOINT_GetListOfUser_AdminWeb');

        const memberPoint = data.recordset;

        const total_point =
            data.recordsets[1] && data.recordsets[1].length && crmAccountClass.list_member_point(data.recordsets[1][0]);

        return new ServiceResponse(true, '', {
            items: crmAccountClass.list_member_point(memberPoint),
            page: currentPage,
            itemsPerPage: itemsPerPage,
            totalItems: apiHelper.getTotalData(memberPoint),
            total_point: total_point || null,
        });
    } catch (e) {
        logger.error(e, {
            function: 'AccountService.getListMemberPoint',
        });

        return new ServiceResponse(true, '', {});
    }
};

const getListUserRepair = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('CRM_ACCOUNT_GetListUserRepair_AdminWeb');
        const total_list = crmAccountClass.list_user_repair(data.recordset);

        return new ServiceResponse(true, '', total_list);
    } catch (e) {
        logger.error(e, {
            function: 'accountService.getListMemberPoint',
        });

        return new ServiceResponse(true, '', {});
    }
};

const deleteListAccount = async (bodyParams) => {
    try {
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'MEMBERID')
            .input('TABLENAME', 'CRM_ACCOUNT')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');
        return new ServiceResponse(true, '', true);
    } catch (e) {
        logger.error(e, { function: 'accountService.deleteListAccount' });
        return new ServiceResponse(false, 'Lỗi xoá danh sách khách hàng');
    }
};

const getOptionsProductAttribute = async function (queryParams = {}) {
    try {
        const keyword = apiHelper.getSearch(queryParams);

        const pool = await mssql.pool;
        const { recordset } = await pool
            .request()
            .input('KEYWORD', keyword)
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute('CRM_ACCOUNT_GetOptionsProductAttribute_AdminWeb');
        return new ServiceResponse(true, '', crmAccountClass.optionsProductAttribute(recordset));
    } catch (e) {
        logger.error(e, { function: 'accountService.getOptionsProductAttribute' });
        return new ServiceResponse(false, '', null);
    }
};

const updateHobbiesRelatives = async (member_id, body = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        const authName = apiHelper.getValueFromObject(body, 'auth_name', 'administrator');

        await new sql.Request(transaction)
            .input('MEMBERID', member_id)
            .execute(PROCEDURE_NAME.CRM_ACCOUNT_DELETEMAPPINGHOBBIESRELATIVES_ADMINWEB);

        // #region customer_hobbies
        const customer_hobbies = apiHelper.getValueFromObject(body, 'customer_hobbies', []);
        for (let i = 0; i < customer_hobbies.length; i++) {
            await new sql.Request(transaction)
                .input('MEMBERID', member_id)
                .input('HOBBIESVALUEID', customer_hobbies[i])
                .execute(PROCEDURE_NAME.CRM_ACCOUNT_CREATEHOBBIES_ADMINWEB);
        }
        // #endregion customer_hobbies

        // #region customer_relatives
        const customer_relatives = apiHelper.getValueFromObject(body, 'customer_relatives', []);
        for (let i = 0; i < customer_relatives.length; i++) {
            await new sql.Request(transaction)
                .input('MEMBERID', member_id)
                .input('MEMBERREFID', apiHelper.getValueFromObject(customer_relatives[i], 'member_ref_id'))
                .input(
                    'RELATIONSHIPMEMBERID',
                    apiHelper.getValueFromObject(customer_relatives[i], 'relationship_member_id'),
                )
                .execute(PROCEDURE_NAME.CRM_ACCOUNT_CREATERELATIVES_ADMINWEB);
        }
        // #endregion customer_relatives

        await transaction.commit();
        return new ServiceResponse(true, 'Lưu sở thích người thân khách hàng thành công', {});
    } catch (e) {
        logger.error(e, { function: 'AccountService.updateHobbiesRelatives' });
        return new ServiceResponse(false);
    }
};

const getHobbiesRelatives = async (member_id) => {
    try {
        const pool = await mssql.pool;
        const { recordsets } = await pool
            .request()
            .input('MEMBERID', member_id)
            .execute(PROCEDURE_NAME.CRM_ACCOUNT_GETLISTHOBBIESRELATIVES_ADMINWEB);

        const result = {
            customer_hobbies: crmAccountClass.customerHobbies(recordsets[0]),
            customer_relatives: crmAccountClass.customerRelatives(recordsets[1]),
        };
        return new ServiceResponse(true, '', result);
    } catch (error) {
        return new ServiceResponse(false, error.message, null);
    }
};

const updateAddressBookList = async (member_id, body = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        const authName = apiHelper.getValueFromObject(body, 'auth_name', 'administrator');

        await new sql.Request(transaction)
            .input('MEMBERID', member_id)
            .input('DELETEDUSER', authName)
            .execute(PROCEDURE_NAME.CRM_ACCOUNT_DELETEMAPPINGADDRESSBOOK_ADMINWEB);

        // #region address_book_list
        const address_book_list = apiHelper.getValueFromObject(body, 'address_book_list', []);
        for (let i = 0; i < address_book_list.length; i++) {
            const item = address_book_list[i];
            const result = await new sql.Request(transaction)
                .input('MEMBERID', member_id)
                .input('ADDRESSID', apiHelper.getValueFromObject(item, 'address_id'))
                .input('MEMBERID', apiHelper.getValueFromObject(item, 'member_id'))
                .input('GENDER', apiHelper.getValueFromObject(item, 'gender'))
                .input('FULLNAME', apiHelper.getValueFromObject(item, 'full_name'))
                .input('ADDRESS', apiHelper.getValueFromObject(item, 'address'))
                .input('CAREERID', apiHelper.getValueFromObject(item, 'career_id'))
                .input('PHONENUMBER', apiHelper.getValueFromObject(item, 'phone_number'))
                .input('PROVINCEID', apiHelper.getValueFromObject(item, 'province_id'))
                .input('DISTRICTID', apiHelper.getValueFromObject(item, 'district_id'))
                .input('NOTE', apiHelper.getValueFromObject(item, 'note'))
                .input('WARDID', apiHelper.getValueFromObject(item, 'ward_id'))
                .input('CREATEDUSER', apiHelper.getValueFromObject(item, 'auth_name'))
                .input('ISDEFAULT', apiHelper.getValueFromObject(item, 'is_default') * 1)
                .execute(PROCEDURE_NAME.CRM_ACCOUNT_CREATEORUPDATEADDRESSBOOK_ADMINWEB);
        }
        // #endregion address_book_list

        await transaction.commit();
        return new ServiceResponse(true, 'Lưu địa chỉ khách hàng thành công', {});
    } catch (e) {
        logger.error(e, { function: 'AccountService.updateAddressBookList' });
        return new ServiceResponse(false);
    }
};

const getListByUser = async (bodyParams) => {
    try {
        let keyword = apiHelper.getSearch(bodyParams);
        let currentPage = apiHelper.getCurrentPage(bodyParams);
        let auth_name = apiHelper.getValueFromObject(bodyParams, 'auth_name');
        const pool = await mssql.pool;
        const { recordsets } = await pool
            .request()
            .input('PAGEINDEX', currentPage)
            .input('USERNAME', auth_name)
            .execute(PROCEDURE_NAME.CRM_CUSTOMER_GETLISTBYUSER_ADMINWEB);

        const result = crmAccountClass.customerListUser(recordsets[0]);
        return new ServiceResponse(true, '', result);
    } catch (e) {
        logger.error(e, { function: 'accountService.deleteListAccount' });
        return new ServiceResponse(false, 'Lỗi xoá danh sách khách hàng');
    }
};

const getTaskHistory = async (queryParams) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('MEMBERID', apiHelper.getValueFromObject(queryParams, 'member_id'))
            //.input('PAGESIZE', itemsPerPage)
            //.input('PAGEINDEX', currentPage)
            .execute('CRM_TASK_GetListWithCustomer_AdminWeb');

        return new ServiceResponse(true, '', {
            data: res.recordset,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(res.recordset),
        });
    } catch (error) {
        logger.error(error, { function: 'CustomerService.getTaskHistory' });
        return new ServiceResponse(false, error.message);
    }
};

const changeName = async (member_id, body = {}) => {
    try {
        const full_name = apiHelper.getValueFromObject(body, 'customer_name');

        const pool = await mssql.pool;
        await pool
            .request()
            .input('MEMBERID', member_id)
            .input('FULLNAME', full_name)
            .input('UPDATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute('CRM_ACCOUNT_ChangeFullName_AdminWeb');

        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, {
            function: 'customerLeadService.changePassword',
        });

        return new ServiceResponse(false);
    }
};

const deleteHobbiesRelatives = async (account_hobbies_id) => {
    try {
        const pool = await mssql.pool;
        const query = `DELETE FROM CRM_ACCOUNT_HOBBIES where ACCOUNTHOBBIESID = ${account_hobbies_id} `;
        await pool.request().query(query);

        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, {
            function: 'customerLeadService.deleteHobbiesRelatives',
        });

        return new ServiceResponse(false);
    }
};

module.exports = {
    getListCRMAccount,
    createCRMAccount,
    updateCRMAccount,
    detailCRMAccount,
    detailGenCustomerCode,
    deleteCRMAccount,
    changeStatusCRMAccount,
    changePassCRMAccount,
    getListHistory,
    getCustomerRepairHistoryList,
    getListLatestCRMAccount,
    exportExcel,
    getTemplateImport,
    importExcel,
    getListSource,
    getListCareer,
    getBuyHistoryList,
    createOrUpdateAddressBook,
    getListAddress,
    deleteAddress,
    changeDefault,
    getCustomerTypeHistoryList,
    getProductWatchlist,
    getListHistoryDataLeadsCare,
    getListChatHistoryZalo,
    findByCustomerCode,
    getListCRMAccountTask,
    getListMemberPoint,
    getListProcess,
    getListUserRepair,
    deleteListAccount,
    getOptionsProductAttribute,
    updateHobbiesRelatives,
    getHobbiesRelatives,
    updateAddressBookList,
    getListByUser,
    getTaskHistory,
    getListCustomerOptimal,
    changeName,
    deleteHobbiesRelatives,
};
