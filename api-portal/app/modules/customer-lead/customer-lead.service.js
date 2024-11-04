const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const rules = require('./customer-lead.rule');
const customerLeadClass = require('./customer-lead.class');
const stringHelper = require('../../common/helpers/string.helper');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const API_CONST = require('../../common/const/api.const');
const { getImageUrl, addSheet } = require('./utils');
const { excelHeaderStyle, exampleImportData, exampleImportDataHeader } = require('./constants');
const xl = require('excel4node');
const readXlsxFile = require('read-excel-file/node');
const { addSheet: addSheetV2, addOptionToData } = require('../../common/helpers/excel.helper');

const createOrUpdate = async (body) => {
    try {
        const authName = apiHelper.getValueFromObject(body, 'auth_name', 'administrator');
        // const idUpdate = apiHelper.getValueFromObject(body, 'data_leads_id');

        let password = apiHelper.getValueFromObject(body, 'password');
        password = password ? stringHelper.hashPassword(password) : null;

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
            .input('DATALEADSID', apiHelper.getValueFromObject(body, 'data_leads_id'))
            .input('PASSWORD', password)
            .input('IMAGEAVATAR', image_avatar)
            .input('DATALEADSCODE', apiHelper.getValueFromObject(body, 'data_leads_code'))
            .input('FULLNAME', apiHelper.getValueFromObject(body, 'full_name_customer'))
            .input('BIRTHDAY', apiHelper.getValueFromObject(body, 'birthday'))
            .input('GENDER', apiHelper.getValueFromObject(body, 'gender'))
            .input('PHONENUMBER', apiHelper.getValueFromObject(body, 'phone_number'))
            .input('PHONENUMBERSECONDARY', apiHelper.getValueFromObject(body, 'phone_number_secondary'))
            .input('EMAIL', apiHelper.getValueFromObject(body, 'email'))
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
            .input('ISSYSTEM', apiHelper.getValueFromObject(body, 'is_system'))
            .input('CREATEDUSER', authName)
            .execute(PROCEDURE_NAME.CRM_CUSTOMERDATALEADS_CREATEORUPDATE_ADMINWEB);

        const idResult = createOrUpdateResult.recordset[0].RESULT;
        if (!idResult) {
            return new ServiceResponse(false, 'Lỗi lưu khách hàng tiềm năng');
        }

        return new ServiceResponse(true, 'Lưu khách hàng tiềm năng thành công', {
            dataleads_id: createOrUpdateResult.recordsets[1][0].RESULT,
            member_name: createOrUpdateResult.recordsets[1][0].FULLNAME,
            customer_code: createOrUpdateResult.recordsets[1][0].DATALEADSCODE,
        });
    } catch (e) {
        logger.error(e, { function: 'customerLeadService.createOrUpdate' });
        return new ServiceResponse(false, e.message);
    }
};

const generateCode = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute(PROCEDURE_NAME.CRM_CUSTOMERDATALEADS_GENCODE_ADMINWEB);
        return new ServiceResponse(true, '', data.recordset[0].GEN_CODE);
    } catch (e) {
        logger.error(e, { function: 'customerLeadService.generateCode' });
        return new ServiceResponse(true, '', '');
    }
};

const getList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams).trim();

        let taskStatus = apiHelper.getFilterBoolean(queryParams, 'task_status');
        if (!['ASSIGNED', 'IN_PROCESS', 'NOT_ASSIGNED'].includes(taskStatus)) {
            taskStatus = null;
        }

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('GENDER', apiHelper.getValueFromObject(queryParams, 'gender'))
            .input('SOURCEID', apiHelper.getValueFromObject(queryParams, 'source_id'))
            .input('WFLOWID', apiHelper.getValueFromObject(queryParams, 'wflow_id'))
            .input('INTERESTCONTENT', apiHelper.getValueFromObject(queryParams, 'interest_content'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
            .input('ISEXISTSEMAIL', apiHelper.getValueFromObject(queryParams, 'is_exists_email'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .input('CUSTOMERTYPEID', apiHelper.getValueFromObject(queryParams, 'customer_type_id'))
            .input('TASKSTATUS', taskStatus)
            .execute(PROCEDURE_NAME.CRM_CUSTOMERDATALEADS_GETLIST_ADMINWEB);

        const customerLeads = data.recordset;

        return new ServiceResponse(true, '', {
            data: customerLeadClass.list(customerLeads),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(customerLeads),
        });
    } catch (error) {
        logger.error(error, { function: 'customerLeadService.getList' });
        return new ServiceResponse(true, '', {});
    }
};

const getById = async (customerLeadId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('DATALEADSID', customerLeadId)
            .execute(PROCEDURE_NAME.CRM_CUSTOMERDATALEADS_GETBYID_ADMINWEB);

        if (!data.recordsets[0]) {
            return new ServiceResponse(false, 'Không tìm thấy khách hàng tiềm năng');
        }

        const detail = customerLeadClass.getById(data.recordsets[0][0]);
        const customer_company = customerLeadClass.customerCompany(data.recordsets[1][0]);
        const result = { ...detail, customer_company };
        return new ServiceResponse(true, '', result);
    } catch (e) {
        logger.error(e, {
            function: 'customerLeadService.getById',
        });
        return new ServiceResponse(false, e.message);
    }
};

const _delete = async (body) => {
    try {
        const ids = apiHelper.getValueFromObject(body, 'ids', []).join('|');
        const pool = await mssql.pool;
        await pool
            .request()
            .input('DATALEADSIDS', ids)
            .input('DELETEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute(PROCEDURE_NAME.CRM_CUSTOMERDATALEADS_DELETEIDS_ADMINWEB);
        return new ServiceResponse(true, '', {});
    } catch (e) {
        logger.error(e, { function: 'customerLeadService._delete' });
        return new ServiceResponse(false, e.message);
    }
};

const getListCustomerCompany = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getValueFromObject(queryParams, 'keyword');

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute(PROCEDURE_NAME.CRM_CUSTOMERDATALEADS_GETLISTCUSTOMERCOMPANY_ADMINWEB);

        const result = data.recordset;
        return new ServiceResponse(true, '', {
            data: customerLeadClass.listCustomerCompany(result),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(result),
        });
    } catch (e) {
        logger.error(e, { function: 'customerLeadService.getCustomerCompany' });
        return new ServiceResponse(true, '', {});
    }
};

const createCustomerCompany = async (body) => {
    try {
        const authName = apiHelper.getValueFromObject(body, 'auth_name', 'administrator');
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('CUSTOMERCOMPANYNAME', apiHelper.getValueFromObject(body, 'customer_company_name'))
            .input('REPRESENTATIVENAME', apiHelper.getValueFromObject(body, 'representative_name'))
            .input('DATALEADSID', apiHelper.getValueFromObject(body, 'data_leads_id'))
            .input('TAXCODE', apiHelper.getValueFromObject(body, 'tax_code'))
            .input('PHONENUMBER', apiHelper.getValueFromObject(body, 'phone_number'))
            .input('EMAIL', apiHelper.getValueFromObject(body, 'email'))
            .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
            .input('CREATEDUSER', authName)
            .execute(PROCEDURE_NAME.CRM_CUSTOMERDATALEADS_CREATECUSTOMERCOMPANY_ADMINWEB_V2);
        const idResult = res.recordset[0].RESULT;
        if (!idResult) {
            return new ServiceResponse(false, 'Lỗi lưu công ty khách hàng');
        }
        return new ServiceResponse(true, 'Lưu công ty khách hàng thành công', { customer_company_id: idResult });
    } catch (e) {
        logger.error(e, { function: 'customerLeadService.createCustomerCompany' });
        return new ServiceResponse(false, e.message);
    }
};

const changePassword = async (customerLeadId, body = {}) => {
    try {
        let password = apiHelper.getValueFromObject(body, 'new_password');
        password = stringHelper.hashPassword(password);

        const pool = await mssql.pool;
        await pool
            .request()
            .input('DATALEADSID', customerLeadId)
            .input('PASSWORD', password)
            .input('UPDATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute(PROCEDURE_NAME.CRM_CUSTOMERDATALEADS_CHANGEPASSWORD_ADMINWEB);
        cacheHelper.removeByKey(CACHE_CONST.CRM_CUSTOMERDATALEADS_OPTIONS);
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, {
            function: 'customerLeadService.changePassword',
        });

        return new ServiceResponse(false);
    }
};

const changeName = async (customerLeadId, body = {}) => {
    try {
        const full_name = apiHelper.getValueFromObject(body, 'customer_name');
        const pool = await mssql.pool;
        await pool
            .request()
            .input('DATALEADSID', customerLeadId)
            .input('FULLNAME', full_name)
            .input('UPDATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute('CRM_CUSTOMERDATALEADS_ChangeFullName_AdminWeb');
            
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, {
            function: 'customerLeadService.changePassword',
        });

        return new ServiceResponse(false);
    }
};

const exportExcel = async (body) => {
    try {
        const params = {
            ...body,
            itemsPerPage: API_CONST.MAX_EXPORT_EXCEL,
        };
        const serviceRes = await getList(params);
        const { data } = serviceRes.getData();

        const wb = new xl.Workbook();
        addSheet({
            workbook: wb,
            sheetName: 'Danh sách khách hàng tiềm năng',
            header: {
                data_leads_code: 'Mã khách hàng',
                full_name: 'Tên khách hàng tiềm năng',
                gender: 'Giới tính',
                birthday: 'Ngày sinh',
                phone_number: 'Số điện thoại',
                email: 'Email',
                address: 'Địa chỉ',
                zalo_id: 'Zalo ID',
                facebook_id: 'Facebook ID',
                affiliate: 'Affiliate',
            },
            data,
        });

        return new ServiceResponse(true, '', wb);
    } catch (e) {
        logger.error(e, { function: 'customerLeadService.exportExcel' });
        return new ServiceResponse(true, '', {});
    }
};

const getTemplateImport = async () => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request().execute(PROCEDURE_NAME.CRM_CUSTOMERDATALEADS_GETTEMPLATEIMPORT_ADMINWEB);
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
            sheetName: 'Nhập khách hàng tiềm năng',
            isAddNoNum: true,
            config: {
                ...exampleImportDataHeader,
                customer_type_id: {
                    title: 'Hạng khách hàng',
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
            function: 'customerLeadService.getTemplateImport',
        });
        return new ServiceResponse(false, error.message);
    }
};

const importExcel = async (bodyParams = {}) => {
    try {
        const pathUpload = apiHelper.getValueFromObject(bodyParams, 'path_upload');
        const rows = await readXlsxFile(pathUpload);
        let import_errors = [];

        if (rows?.length <= 1) {
            return new ServiceResponse(false, 'Tập tin chưa có dữ liệu!', null);
        }

        // transform array excel row to array valid object
        const rowsDataLead = [];
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const rowDataLead = {};
            Object.keys(exampleImportDataHeader).forEach((key, index) => {
                const indexColumn = index + 1;
                if (key === 'is_active') {
                    const cellIsActive = (row[indexColumn] || '').toString().trim().toLowerCase();
                    rowDataLead[key] = cellIsActive === 'có' || cellIsActive === '1' ? 1 : 0;
                } else if (key === 'gender') {
                    const cellIsActive = (row[indexColumn] || '').toString().trim().toLowerCase();
                    rowDataLead[key] = cellIsActive === 'nam' ? 1 : 0;
                } else if (['customer_type_id', 'source_id', 'presenter_id', 'career_id'].indexOf(key) > -1) {
                    const _value = (row[indexColumn] || '').split(' - ');
                    rowDataLead[key] = _value?.length ? _value[0] : null;
                } else {
                    rowDataLead[key] = (row[indexColumn] || '').toString().trim();
                }
            });
            rowsDataLead.push(rowDataLead);
        }

        // start import
        for (let i = 0; i < rowsDataLead.length; i++) {
            const importDataLead = rowsDataLead[i];
            try {
                await rules.createCustomerLead.body.validate(importDataLead);
                const serviceRes = await createOrUpdate(importDataLead);
                if (serviceRes.isFailed()) {
                    throw new Error(serviceRes.getMessage());
                }
            } catch (error) {
                const msg = error?.details?.length ? error?.details[0]?.message : error.message;
                const _error = { ...importDataLead, error_message: msg };
                import_errors.push(_error);
            }
        }
        return new ServiceResponse(true, '', {
            import_data: rowsDataLead,
            import_errors,
        });
    } catch (error) {
        logger.error(error, {
            function: 'customerLeadService.importExcel',
        });
        return new ServiceResponse(false, error.message);
    }
};

module.exports = {
    createOrUpdate,
    generateCode,
    getList,
    getById,
    delete: _delete,
    getListCustomerCompany,
    createCustomerCompany,
    changePassword,
    exportExcel,
    getTemplateImport,
    importExcel,
    changeName
};
