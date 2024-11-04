const Queue = require('bull');
const mssql = require('../models/mssql');
const sql = require('mssql');
const apiHelper = require('../../app/common/helpers/api.helper');
const ServiceResponse = require('../../app/common/responses/service.response');
const PROCEDURE_NAME = require('../../app/common/const/procedureName.const');
const RESPONSE_MSG = require('../common/const/responseMsg.const');
const readXlsxFile = require('read-excel-file/node');
const ProductService = require('../modules/product/product.service');
const { getListOutputType } = require('../modules/output-type/output-type.service');
const { getListArea } = require('../modules/area/area.service');
const { getBusinessList } = require('../modules/business/business.service');
const { getCurrentDateFormatted } = require('../modules/sl-prices/helper');
const logger = require('../common/classes/logger.class'); 

const CONFIG = {
    redis: {
        host: process.env.REDIS_URL,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PWD,
        connectTimeout: 30000 
    }
}
// Tạo hàng đợi
const insertImportPriceQueue = new Queue('insertImportPriceQueue', CONFIG);

// Worker xử lý công việc từ hàng đợi
insertImportPriceQueue.process(async (job, done) => {
    try {
        const bufferData = Buffer.from(job.data.file.buffer.data);
        if (bufferData && job.data.auth) {
            const res = await insertRecord(bufferData, job.data.auth);
            done(null, res);
        }
    } catch (error) {
        done(new Error(`Error processing job: ${error.message}`));
    }
});

const insertRecord = async (file, auth) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();

        const rows = await readXlsxFile(file);
        let import_data = [];
        let import_errors = [];
        let import_total = 0;

        for (let i in rows) {
            let arr_area_id = []
            let arr_data_business = []
            let product_id
            let output_type_id
            let unit_id
            let model_id
            let product_type
            let price_id
            let base_price

            // Bỏ qua dòng tiêu đề đầu
            if (i > 0 && rows[i]) {
                import_total += 1;

                let product_code = rows[i][0] || '';
                let product_name = `${rows[i][1] || ''}`.trim();
                let output_type_name = `${rows[i][2] || ''}`.trim();
                let start_date = `${rows[i][3] || ''}`.trim();
                let end_date = `${rows[i][4] || ''}`.trim();
                let price_vat = `${rows[i][5] || ''}`.trim();
                let basePrice = `${rows[i][6] || ''}`.trim();
                let area_name = `${rows[i][7] || ''}`.trim();
                let business_name = `${rows[i][8] || ''}`.trim();

                if (!product_code || !output_type_name || !start_date || !end_date || !price_vat || !area_name) {
                    return new ServiceResponse(false, 'Thiếu trường dữ liệu bắt buộc!', null);
                }

                if (rows.length < 2) {
                    return new ServiceResponse(false, 'Tập tin chưa có dữ liệu!', null);
                }

                // Tìm thông tin sản phẩm product_id, unit_id, model_id, product_type
                if (product_code) {
                    try {
                        const res = await ProductService.getListProduct({ search: product_code })
                        if (res.data.data[0].product_id) {
                            product_id = res.data.data[0].product_id
                            unit_id = res.data.data[0].unit_id
                            model_id = res.data.data[0].model_id
                            product_type = res.data.data[0].product_type
                        }
                    } catch (error) {
                        await transaction.rollback();
                        console.error('Lỗi tìm thông tin sản phẩm: ', error.message);
                        return new ServiceResponse(false, `Không tìm thấy sản phẩm có mã là: ${product_code}`)
                    }
                }

                // Tìm hình thức xuất
                if (output_type_name) {
                    try {
                        const res = await getListOutputType({ search: output_type_name })
                        if (res.data.data[0].output_type_id) {
                            output_type_id = res.data.data[0].output_type_id
                        }
                    } catch (error) {
                        await transaction.rollback();
                        console.error('Lỗi tìm thấy hình thức xuất: ', error.message);
                        return new ServiceResponse(false, `Không tìm thấy hình thức xuất: ${output_type_name}`)
                    }
                }

                // Tìm Khu Vực
                if (area_name && area_name === 'Tất cả') {
                    try {
                        const results = await getListArea({ itemsPerPage: 9999 })
                        if (results.data.data.length > 0) {
                            results.data.data.map((serviceResponse) => {
                                arr_area_id.push(serviceResponse.area_id)
                            });
                        }
                    } catch (error) {
                        await transaction.rollback();
                        console.error('Lỗi tìm thấy khu vực: ', error.message);
                        return new ServiceResponse(false, `Không tìm thấy khu vực ${area_name}`)
                    }
                } else if (area_name && area_name !== 'Tất cả') {
                    try {
                        const areaArray = area_name.split(',').map((name) => name.trim());
                        const promises = areaArray.map(async (val) => {
                            try {
                                const listAreaId = await getListArea({ search: val });
                                return listAreaId;
                            } catch (error) {
                                await transaction.rollback();
                                console.error(`Error fetching area IDs for ${val}:`, error.message);
                                throw error; // Propagate the error if needed
                            }
                        });

                        const results = await Promise.all(promises);
                        if (results?.length > 0) {
                            results.map((serviceResponse) => {
                                arr_area_id.push(serviceResponse.data.data[0].area_id)
                            });
                        }
                    } catch (error) {
                        await transaction.rollback();
                        console.error('Error fetching area IDs:', error.message);
                        return new ServiceResponse(false, error.message);
                    }

                } else {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Không tìm thấy khu vực!')
                }

                // Tìm chi nhánh theo Khu vực
                if (arr_area_id.length > 0) {
                    try {
                        const promises = arr_area_id.map(async (val) => {
                            try {
                                const listAreaId = await getBusinessList({ area_ids: val, itemsPerPage: 99999 });
                                return listAreaId;
                            } catch (error) {
                                await transaction.rollback();
                                console.error(`Error fetching area IDs for ${val}:`, error.message);
                                return new ServiceResponse(
                                    false,
                                    `Không tìm thấy chi nhánh theo khu vực có id: ${val}, Lỗi: ${error.message}`,
                                );
                            }
                        });

                        const results = await Promise.all(promises);
                        if (results.length > 0) {
                            results.map((serviceResponse) => {
                                arr_data_business.push(serviceResponse.data.data)
                            });
                        }
                    } catch (error) {
                        await transaction.rollback();
                        console.error('Error fetching area IDs:', error.message);
                        return new ServiceResponse(false, error.message);
                    }
                }

                if (price_vat && !basePrice) {
                    base_price = Math.round(Number(price_vat) / ((100 + 10) / 100))
                } else {
                    base_price = basePrice
                }

                let price_import = {
                    product_id,
                    output_type_id,
                    start_date,
                    end_date,
                    price_vat,
                    base_price,
                    unit_id,
                    model_id,
                    product_type
                };
                const auth_name = apiHelper.getValueFromObject(auth, 'user_name');

                // Insert SL_PRICES
                try {
                    const res = await importPriceInDB({ ...price_import, auth_name }, pool);
                    if (res.data) {
                        price_id = res?.data
                    }
                    import_data.push(res?.data);
                } catch (error) {
                    import_errors.push({
                        price_import,
                        errmsg: [error.message],
                        i,
                    });
                }

                // Insert SL_PRICE_APPLY_OUTPUTTYPE_BUSINESS
                if (arr_data_business && arr_data_business.length > 0 && price_id) {
                    for (let j = 0; j < arr_data_business.length; j++) {
                        const itemBusiness = arr_data_business[j];
                        if (itemBusiness && itemBusiness.length > 0) {
                            for (let j = 0; j < itemBusiness.length; j++) {
                                const dataSubmit = itemBusiness[j];
                                const requestApplyOutputtypeCreate = new sql.Request(transaction);
                                const dataTaskApplyPutputtypeCreate = await requestApplyOutputtypeCreate
                                    .input('PRICEID', price_id)
                                    .input('OUTPUTTYPEID', output_type_id)
                                    .input('AREAID', dataSubmit.area_id)
                                    .input('COMPANYID', null)
                                    .input('BUSINESSID', dataSubmit.business_id)
                                    .execute(PROCEDURE_NAME.SL_PRICES_APPLY_OUTPUTTYPE_CREATEORUPDATE);
                                const applyOutputtypeListId = dataTaskApplyPutputtypeCreate.recordset[0].RESULT;
                                if (applyOutputtypeListId <= 0) {
                                    await transaction.rollback();
                                    return new ServiceResponse(false, RESPONSE_MSG.SL_PRICES.CREATE_FAILED);
                                }
                            }
                        }
                    }
                }

                // Insert mức duyệt SL_PRICE_APPLY_REVIEWLEVEL
                if (price_id) {
                    const requestApplyReviewLevelCreate = new sql.Request(transaction);
                    const dataTaskApplyReviewLevelCreate = await requestApplyReviewLevelCreate
                        .input('PRICEID', price_id)
                        .input('OUTPUTTYPEID', output_type_id)
                        .input('PRICEREVIEWLEVELID', 5)
                        .input('REVIEWUSER', auth_name)
                        .input('AUTOREVIEW', 1)
                        .input('DEPARTMENTID', null)
                        .execute('SL_PRICE_APPLY_REVIEWLEVEL_CreateOrUpdate');
                    const applyReviewLevelId = dataTaskApplyReviewLevelCreate.recordset[0].RESULT;
                    if (applyReviewLevelId <= 0) {
                        await transaction.rollback();
                        return new ServiceResponse(false, RESPONSE_MSG.SL_PRICES.CREATE_FAILED);
                    }
                }

            }
        }

        // Commit transaction
        await transaction.commit();

        return new ServiceResponse(true, '', {
            import_data,
            import_total,
            import_errors,
        });
    } catch (error) {
        logger.error(error, {
            function: 'PriceService.importExcel',
        });
        await transaction.rollback();
        return new ServiceResponse(false, error.message);
    }
};

const importPriceInDB = async (bodyParams = {}, pool) => {
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        const dateNow = getCurrentDateFormatted()

        //Insert Price
        const requestPrice = new sql.Request(transaction);
        const resultPrice = await requestPrice
            // .input('PRICEID', apiHelper.getValueFromObject(bodyParams, 'price_id'))
            .input('PRODUCTID', apiHelper.getValueFromObject(bodyParams, 'product_id'))
            .input('MATERIALID', null)
            .input('OUTPUTTYPEID', apiHelper.getValueFromObject(bodyParams, 'output_type_id'))
            .input('PRICE', apiHelper.getValueFromObject(bodyParams, 'price_vat'))
            .input('BASEPRICE', apiHelper.getValueFromObject(bodyParams, 'base_price'))
            .input('STARTDATE', apiHelper.getValueFromObject(bodyParams, 'start_date'))
            .input('ENDDATE', apiHelper.getValueFromObject(bodyParams, 'end_date'))
            .input('ISREVIEW', 2)
            .input('ISACTIVE', 1)
            .input('ISOUTPUTFORWEB', null)
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('UNITID', apiHelper.getValueFromObject(bodyParams, 'unit_id'))
            .input('MODELID', apiHelper.getValueFromObject(bodyParams, 'model_id'))
            .input('PRODUCTIMEICODE', null)
            .input('REVIEWDATE', dateNow)
            .input('PRODUCTTYPE', apiHelper.getValueFromObject(bodyParams, 'product_type'))
            .execute('SL_PRICES_CreateOrUpdate');

        const priceId = resultPrice.recordset[0].RESULT;

        if (!priceId) {
            await transaction.rollback();
            throw new Error(RESPONSE_MSG.SL_PRICES.CREATE_FAILED);
        }

        await transaction.commit();
        return new ServiceResponse(true, '', priceId);
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};


module.exports = {
    insertImportPriceQueue
}