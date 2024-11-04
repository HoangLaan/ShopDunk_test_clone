const apiHelper = require('../../common/helpers/api.helper');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const API_CONST = require('../../common/const/api.const');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const bankUserClass = require('./bank-user.class');
const { addSheet, addSheetV2 } = require('./utils');
const { excelHeaderStyle, exampleImportData, transformDataHeader, exampleConfig } = require('./constants');
const xl = require('excel4node');
const readXlsxFile = require('read-excel-file/node');
const rules = require('./bank-user.rule');
const Joi = require('joi');
const { transformArrayExcel, mappedArrayToNewKey } = require('../../common/helpers/excel.helper');
const _ = require('lodash');

const getList = async (queryParams = {}) => {
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
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute(PROCEDURE_NAME.MD_BANKACC_GETLIST_ADMINWEB);

        const result = data.recordset;

        return new ServiceResponse(true, '', {
            data: bankUserClass.list(result),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(result),
        });
    } catch (error) {
        logger.error(error, { function: 'bankUserService.getList' });
        return new ServiceResponse(true, '', {});
    }
};

const getById = async (bankUserId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('BANKUSERID', bankUserId)
            .execute(PROCEDURE_NAME.MD_BANKACC_GETBYID_ADMINWEB);

        if (!data.recordsets[0]) {
            return new ServiceResponse(false, 'Không tìm thấy loại công việc');
        }

        const result = {
            ...bankUserClass.getById(data.recordsets[0][0]),
        };

        return new ServiceResponse(true, '', result);
    } catch (error) {
        logger.error(error, { function: 'bankUserService.getById' });
        return new ServiceResponse(false, error.message);
    }
};

const createOrUpdate = async (body) => {
    try {
        const authName = apiHelper.getValueFromObject(body, 'auth_name', 'administrator');
        const pool = await mssql.pool;
        const result = await pool
            .request()
            .input('BANKACCID', apiHelper.getValueFromObject(body, 'bank_user_id'))
            .input('BANKID', apiHelper.getValueFromObject(body, 'bank_id'))
            .input('BANKNUMBER', apiHelper.getValueFromObject(body, 'bank_number'))
            .input('BANKBRANCH', apiHelper.getValueFromObject(body, 'bank_branch'))
            // .input('COMPANYID', apiHelper.getValueFromObject(body, 'company_id'))
            .input('BANKUSERNAME', apiHelper.getValueFromObject(body, 'bank_username'))
            .input('PROVINCEID', apiHelper.getValueFromObject(body, 'province_id'))
            .input('BRANCHADDRESS', apiHelper.getValueFromObject(body, 'branch_address'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(body, 'description'))
            .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(body, 'is_system'))
            .input('CREATEDUSER', authName)
            .execute(PROCEDURE_NAME.MD_BANKACC_CREATEORUPDATE_ADMINWEB);

        if (!apiHelper.getResult(result.recordset)) {
            return new ServiceResponse(false, 'Lỗi lưu tài khoản ngân hàng');
        }
        return new ServiceResponse(true, 'Lưu tài khoản ngân hàng thành công', {});
    } catch (error) {
        logger.error(error, { function: 'bankUserService.createOrUpdate' });
        return new ServiceResponse(false, error.message);
    }
};

const _delete = async (bodyParams) => {
    try {
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);

        const pool = await mssql.pool;
        await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'BANKACCID')
            .input('TABLENAME', 'MD_BANKACC')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');
        return new ServiceResponse(true, '', true);
    } catch (e) {
        logger.error(e, { function: 'bankUserService.deleteCoupon' });
        return new ServiceResponse(false, '', {});
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
            sheetName: 'Danh sách tài khoản ngân hàng',
            header: {
                bank_number: 'Số tài khoản',
                bank_name: 'Tên ngân hàng',
                // company_name: 'Công ty áp dụng',
                bank_username: 'Chủ tài khoản',
                created_user: 'Người tạo',
                created_date: 'Ngày tạo',
            },
            data,
        });

        return new ServiceResponse(true, '', wb);
    } catch (e) {
        logger.error(e, { function: 'bankUserService.exportExcel' });
        return new ServiceResponse(true, '', {});
    }
};

const getTemplateImport = async () => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request().execute(PROCEDURE_NAME.MD_BANKUSER_GETTEMPLATEIMPORT_ADMINWEB);

        const wb = new xl.Workbook();
        const headerStyle = wb.createStyle(excelHeaderStyle);

        const _exampleConfig = {
            index: {
                title: 'STT',
                width: 5,
            },
            ...exampleConfig,
            bank_id: {
                title: 'Ngân hàng *',
                width: 20,
                validate: {
                    type: 'list',
                    allowBlank: true,
                    showDropDown: true,
                    formulas: [`='Danh sách ngân hàng'!$C$2:$C$${res.recordsets[0].length + 1}`],
                },
            },
            province_id: {
                title: 'Tỉnh/Thành phố',
                width: 20,
                validate: {
                    type: 'list',
                    allowBlank: true,
                    showDropDown: true,
                    formulas: [`='Danh sách tỉnh thành phố'!$C$2:$C$${res.recordsets[1].length + 1}`],
                },
            },
        };

        const _exampleImportData = exampleImportData.map((x, index) => ({
            ...x,
            index: index + 1,
        }));

        addSheetV2({
            workbook: wb,
            sheetName: 'Nhập tài khoản ngân hàng',
            config: _exampleConfig,
            data: _exampleImportData,
        });

        const ws_note = wb.addWorksheet('Lưu ý');
        ws_note.column(1).setWidth(30);
        ws_note.column(2).setWidth(80);

        ws_note.cell(1, 1).string('Cột').style(headerStyle);
        ws_note.cell(1, 2).string('Lưu ý').style(headerStyle);
        ws_note.cell(2, 1).string('Kích hoạt');
        ws_note.cell(2, 2).string('Nhập có/không hoặc 1/0');

        addSheetV2({
            workbook: wb,
            sheetName: 'Danh sách ngân hàng',
            config: {
                id: { title: 'Mã ngân hàng' },
                name: { title: 'Tên ngân hàng' },
                option: {
                    title: 'Ngân hàng',
                    width: 30,
                },
            },
            data: res.recordsets[0].map((x) => ({
                ...x,
                option: `${x.id} - ${x.name}`,
            })),
        });

        addSheetV2({
            workbook: wb,
            sheetName: 'Danh sách tỉnh thành phố',
            config: {
                id: { title: 'Mã Tỉnh/Thành phố' },
                name: { title: 'Tên Tỉnh/Thành phố' },
                option: {
                    title: 'Tỉnh/Thành phố',
                    width: 30,
                },
            },
            data: res.recordsets[1].map((x) => ({
                ...x,
                option: `${x.id} - ${x.name}`,
            })),
        });

        return new ServiceResponse(true, '', wb);
    } catch (error) {
        logger.error(error, {
            function: 'bankUserService.getTemplateImport',
        });
        return new ServiceResponse(false, error.message);
    }
};

const importExcel = async (bodyParams = {}) => {
    try {
        const pathUpload = apiHelper.getValueFromObject(bodyParams, 'path_upload');
        const rows = await readXlsxFile(pathUpload);
        const auth_name = apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator');
        let import_errors = [];

        if (rows?.length <= 1) {
            return new ServiceResponse(false, 'Tập tin chưa có dữ liệu!', null);
        }

        // transform excel key to valid key
        const rowsExcel = transformArrayExcel(rows);
        let rowsTransformed = mappedArrayToNewKey(rowsExcel, transformDataHeader);
        // transform value
        const rowsImport = rowsTransformed.map((item) => {
            for (let key in item) {
                const value = item[key];
                if (key === 'is_active') {
                    item[key] = value.toLowerCase() === 'có' || value === '1' ? 1 : 0;
                } else if (key === 'bank_id' || key === 'province_id') {
                    const _value = (item[key] || '').split(' - ');
                    item[key] = _value?.length ? _value[0] : null;
                } else {
                    item[key] = (value || '').toString().trim();
                }
            }
            return item;
        });
        // start import
        for (let i = 0; i < rowsImport.length; i++) {
            const rowItem = { ...rowsImport[i], auth_name };
            try {
                await Joi.object(rules.create.body).unknown().validate(rowItem);
                const serviceRes = await createOrUpdate(rowItem);
                if (serviceRes.isFailed()) {
                    throw new Error(serviceRes.getMessage());
                }
            } catch (error) {
                const msg = error?.details?.length ? error?.details[0]?.message : error.message;
                const _error = { ...rowItem, error_message: msg };
                import_errors.push(_error);
            }
        }
        return new ServiceResponse(true, '', {
            import_data: rowsImport,
            import_errors,
        });
    } catch (error) {
        logger.error(error, { function: 'bankUserService.importExcel' });
        return new ServiceResponse(false, error.message);
    }
};

module.exports = {
    getList,
    getById,
    createOrUpdate,
    delete: _delete,
    exportExcel,
    getTemplateImport,
    importExcel,
};
