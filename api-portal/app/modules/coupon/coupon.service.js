const sql = require('mssql');
const couponClass = require('./coupon.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const { COUPON_PRODUCT_TYPE } = require('./helpers/constants');
const productClass = require('../product/product.class');
const { generateRandomString } = require('./helpers');
const API_CONST = require('../../common/const/api.const');
const xl = require('excel4node');
const { addSheet, addSheetGetList } = require('../../common/helpers/excel.helper');

const getOptions = async () => {
    try {
        const pool = await mssql.pool;
        const req = await pool.request().execute('SM_COUPON_GetOption_AdminWeb');
        const resProduct = couponClass.optionsProduct(req.recordsets[0]);
        const resCustomer = couponClass.optionsCustomer(req.recordsets[1]);
        const resProductCategory = couponClass.optionsProductCategory(req.recordsets[2]);
        return new ServiceResponse(true, '', {
            resProduct,
            resCustomer,
            resProductCategory,
        });
    } catch (e) {
        logger.error(e, { function: 'couponService.getOption' });
        return new ServiceResponse(false, e.message);
    }
};

const getCouponOptions = async() => {
    try {
        const pool = await mssql.pool;
        const req = await pool.request().execute('SM_COUPON_GetCouponOption_AdminWeb');
        const resCoupon = couponClass.optionsCoupon(req.recordset);
        return new ServiceResponse(true, '', resCoupon);
    } catch (e) {
        logger.error(e, { function: 'couponService.getOption' });
        return new ServiceResponse(false, e.message);
    }
}

const createOrUpdateCoupon = async (body = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    await transaction.begin();
    try {
        let authName = apiHelper.getValueFromObject(body, 'auth_name', 'administrator');
        let _coupon_id = apiHelper.getValueFromObject(body, 'coupon_id', null);
        let is_all_product = apiHelper.getValueFromObject(body, 'is_all_product', 0);
        let type_apply_product = apiHelper.getValueFromObject(body, 'type_apply_product', 0);
        const is_all_customer_type = apiHelper.getValueFromObject(body, 'is_all_customer_type');
        const product_list = apiHelper.getValueFromObject(body, 'product_list', []);
        const promotional_list = apiHelper.getValueFromObject(body, 'promotional_list', []);
        const is_auto_gen = apiHelper.getValueFromObject(body, 'is_auto_gen');
        const is_letter_n_number = apiHelper.getValueFromObject(body, 'is_letter_n_number');
        const is_letter = apiHelper.getValueFromObject(body, 'is_letter');
        const is_number = apiHelper.getValueFromObject(body, 'is_number');
        const preview_code = apiHelper.getValueFromObject(body, 'preview_code');
        const total_letter = apiHelper.getValueFromObject(body, 'total_letter');
        const prefixes = apiHelper.getValueFromObject(body, 'prefixes');
        const suffixes = apiHelper.getValueFromObject(body, 'suffixes');
        const is_gift_code = apiHelper.getValueFromObject(body, 'is_gift_code');
        const auto_code_gift_list = apiHelper.getValueFromObject(body, 'auto_code_gift_list',[]);
        let code_config = 0;

        //Loại ký tự: 1: cả chữ và số; 2: chỉ chữ; 3: chỉ số
        switch (true) {
            case is_letter_n_number === 1:
                code_config = 1;
                break
            case is_letter === 1:
                code_config = 2;
                break
            case is_number === 1:
                code_config = 3;
                break
        }
        const requestCoupon = new sql.Request(transaction);

        const resultCoupon = await requestCoupon
            .input('COUPONID', apiHelper.getValueFromObject(body, 'coupon_id'))
            .input('COUPONNAME', apiHelper.getValueFromObject(body, 'coupon_name'))
            .input('BUDGET',sql.Decimal(18,2),apiHelper.getValueFromObject(body,'budget'))
            .input('TOTALCOUPONVALUE', sql.Decimal(18,2),apiHelper.getValueFromObject(body,'total_coupon_value'))
            .input('STARTDATE', apiHelper.getValueFromObject(body, 'start_date'))
            .input('ENDDATE', apiHelper.getValueFromObject(body, 'end_date'))
            .input('ISALLPRODUCT', is_all_product)
            .input('ISANYPRODUCT', !is_all_product && (type_apply_product === COUPON_PRODUCT_TYPE.ANY ? 1 : 0))
            .input('ISAPPOINTPRODUCT', !is_all_product && (type_apply_product === COUPON_PRODUCT_TYPE.APPOINT ? 1 : 0))
            .input('ISAPPLYOTHERCOUPON', apiHelper.getValueFromObject(body, 'is_aplly_other_coupon', 0))
            .input('ISAPPLYOTHERPROMOTION', apiHelper.getValueFromObject(body, 'is_aplly_other_promotion', 0))
            .input('ISLIMITCOUPONTIMES', apiHelper.getValueFromObject(body, 'is_limit_promotion_times', 0))
            .input('MAXCOUPONTIMES', apiHelper.getValueFromObject(body, 'count_promotion_times', 1))
            .input('COUPONTIMESCYCLE', apiHelper.getValueFromObject(body, 'mounth_promotion_times', 1))
            .input('DESCRIPTION', apiHelper.getValueFromObject(body, 'description', ''))
            .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
            .input('ISALLCUSTOMERTYPE', is_all_customer_type)
            .input('ISSUPPLIER', apiHelper.getValueFromObject(body, 'is_supplier'))
            .input('SUPPLIERID', apiHelper.getValueFromObject(body, 'supplier_id'))
            .input('ISPARTNER', apiHelper.getValueFromObject(body, 'is_partner'))
            .input('PARTNERID', apiHelper.getValueFromObject(body, 'partner_id'))
            .input('ORDERTYPELIST', apiHelper.getValueFromObject(body, 'order_type_list'))
            .input('ISAUTOGEN', is_auto_gen)
            .input('CODECONFIG', code_config)
            .input('PREVIEWCODE', preview_code)
            .input('TOTALLETTER', total_letter)
            .input('PREFIXES', prefixes)
            .input('SUFFIXES', suffixes)
            .input('CREATEDUSER', authName)
            .execute('SM_COUPON_CreateOrUpdate_AdminWeb');
        const coupon_id = resultCoupon.recordset[0].RESULT;

        if (coupon_id <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Lỗi tạo mã khuyến mãi');
        }

        if (_coupon_id > 0) {
            const deleteMapping = new sql.Request(transaction);
            await deleteMapping.input('COUPONID', coupon_id).execute('SM_COUPON_REQUESTTYPE_DeleteMapping_AdminWeb');
        }

        // #endregion request_type_list
        if (product_list.length > 0) {
            const productListTrans = new sql.Request(transaction);
            for (let i = 0; i < product_list.length; i++) {
                await productListTrans
                    .input('COUPONID', coupon_id)
                    .input('PRODUCTID', parseInt(product_list[i]?.product_id))
                    .input('CREATEDUSER', authName)
                    .execute('SM_COUPON_PRODUCT_Create_AdminWeb');
            }
        }

        if (is_auto_gen && is_gift_code) {
            // Delete mapping auto_code_gift
            const autoCodeGiftReq = new sql.Request(transaction);
            await autoCodeGiftReq
                .input('COUPONID', coupon_id)
                .input('PRODUCTIDS', auto_code_gift_list.map((item) => item?.product_id).join('|'))
                .execute('SM_COUPON_AUTOCODEGIFT_DeleteMapping_AdminWeb');
            // Insert into
            const productListTrans = new sql.Request(transaction);
            const prefixesLength = prefixes?.length || 0;
            const suffixesLength = suffixes?.length || 0;
            const randomStringLength =
                total_letter - prefixesLength - suffixesLength >= 0
                    ? total_letter - prefixesLength - suffixesLength
                    : 0;
            const item = promotional_list[0];
            for (let i = 0; i < auto_code_gift_list.length; i++) {
                await productListTrans
                    .input('COUPONID', coupon_id)
                    .input('PRODUCTID', parseInt(auto_code_gift_list[i]?.product_id))
                    .input('GIFTQUANTITY', apiHelper.getValueFromObject(auto_code_gift_list[i], 'quantity'))
                    .input('CREATEDUSER', authName)
                    .execute('SM_COUPON_AUTOCODEGIFT_CreateOrUpdate_AdminWeb');

                const quantity = apiHelper.getValueFromObject(auto_code_gift_list[i], 'quantity') || 0;
                for (let i = 0; i < quantity; i++) {
                    let check = true;
                    let _coupon_code = '';
                    while (check) {
                        _coupon_code = generateRandomString(code_config, randomStringLength);
                        _coupon_code = (prefixes || '') + _coupon_code + (suffixes || '');
                        const res = await pool
                            .request()
                            .input('COUPONCODE', _coupon_code)
                            .execute('SM_COUPON_AUTOCODE_CheckCoupon_AdminWeb');
                        if (res.recordset.length === 0) {
                            check = false;
                        }
                    }
                    // const item = promotional_list[0];
                    const transaction1 = await new sql.Transaction(pool);
                    await transaction1.begin();
                    const promotionalList = new sql.Request(transaction1);
                    await promotionalList
                        .input('COUPONAUTOCODEID', apiHelper.getValueFromObject(item, 'coupon_auto_code_id'))
                        .input('COUPONID', coupon_id)
                        .input('CUSTOMERPHONE', apiHelper.getValueFromObject(item, 'customer_phone'))
                        .input('CUSTOMEREMAIL', apiHelper.getValueFromObject(item, 'customer_email'))
                        .input('COUPONCODE', _coupon_code)
                        .input('PRODUCTID', auto_code_gift_list[i]?.product_id)
                        // .input('DISCOUNTMONEY ', apiHelper.getValueFromObject(item, 'max_value_reduce'))
                        // .input('CUSTOMERNAME', apiHelper.getValueFromObject(item, 'max_total_money'))
                        .input('ISACTIVE', 1)
                        .input('ISUSED', 0)
                        .input('STARTDATE', apiHelper.getValueFromObject(body, 'start_date'))
                        .input('ENDDATE', apiHelper.getValueFromObject(body, 'end_date'))
                        .input('MAXVALUEREDUCE', apiHelper.getValueFromObject(item, 'max_value_reduce'))
                        .input('MAXTOTALMONEY', apiHelper.getValueFromObject(item, 'max_total_money'))
                        .input('MINTOTALMONEY', apiHelper.getValueFromObject(item, 'min_total_money'))
                        .input('MINTOTALPRODUCT', apiHelper.getValueFromObject(item, 'min_count'))
                        .input('MAXTOTALPRODUCT', apiHelper.getValueFromObject(item, 'max_count'))
                        .input('CREATEDUSER', authName)
                        .execute('SM_COUPON_AUTOCODE_CreateOrUpdate_V2_AdminWeb');
                    await transaction1.commit();
                }
            }
        }
        if (is_auto_gen && !is_gift_code) {
            const prefixesLength = prefixes?.length || 0;
            const suffixesLength = suffixes?.length || 0;
            const randomStringLength =
                total_letter - prefixesLength - suffixesLength >= 0
                    ? total_letter - prefixesLength - suffixesLength
                    : 0;
            const item = promotional_list[0];
            for (let i = 0; i < item.quantity; i++) {
                let check = true;
                let _coupon_code = '';
                while (check) {
                    _coupon_code = generateRandomString(code_config, randomStringLength);
                    _coupon_code = (prefixes || '') + _coupon_code + (suffixes || '');
                    const res = await pool
                        .request()
                        .input('COUPONCODE', _coupon_code)
                        .execute('SM_COUPON_AUTOCODE_CheckCoupon_AdminWeb');
                    if (res.recordset.length === 0) {
                        check = false;
                    }
                }
                const transaction1 = await new sql.Transaction(pool);
                await transaction1.begin();
                const promotionalList = new sql.Request(transaction1);
                await promotionalList
                    .input('COUPONAUTOCODEID', apiHelper.getValueFromObject(item, 'coupon_auto_code_id'))
                    .input('COUPONID', coupon_id)
                    .input('CUSTOMERPHONE', apiHelper.getValueFromObject(item, 'customer_phone'))
                    .input('CUSTOMEREMAIL', apiHelper.getValueFromObject(item, 'customer_email'))
                    .input('COUPONCODE', _coupon_code)
                    // .input('DISCOUNTMONEY ', apiHelper.getValueFromObject(item, 'max_value_reduce'))
                    // .input('CUSTOMERNAME', apiHelper.getValueFromObject(item, 'max_total_money'))
                    .input('ISACTIVE', 1)
                    .input('ISUSED', 0)
                    .input('STARTDATE', apiHelper.getValueFromObject(body, 'start_date'))
                    .input('ENDDATE', apiHelper.getValueFromObject(body, 'end_date'))
                    .input('MAXVALUEREDUCE', apiHelper.getValueFromObject(item, 'max_value_reduce'))
                    .input('MAXTOTALMONEY', apiHelper.getValueFromObject(item, 'max_total_money'))
                    .input('MINTOTALMONEY', apiHelper.getValueFromObject(item, 'min_total_money'))
                    .input('MINTOTALPRODUCT', apiHelper.getValueFromObject(item, 'min_count'))
                    .input('MAXTOTALPRODUCT', apiHelper.getValueFromObject(item, 'max_count'))
                    .input('CREATEDUSER', authName)
                    .execute('SM_COUPON_AUTOCODE_CreateOrUpdate_V2_AdminWeb');
                await transaction1.commit();
            }
            const _promotionalList = new sql.Request(transaction);
            await _promotionalList
                .input('COUPONCONDITIONID', apiHelper.getValueFromObject(item, 'coupon_conditionid'))
                .input('COUPONID', coupon_id)
                .input('CODEVALUE', apiHelper.getValueFromObject(item, 'code_value'))
                // .input('COUPONCODE', apiHelper.getValueFromObject(item, 'coupon_code'))
                .input('CODETYPE', apiHelper.getValueFromObject(item, 'code_type'))
                .input('MAXVALUEREDUCE', apiHelper.getValueFromObject(item, 'max_value_reduce'))
                .input('MAXTOTALMONEY', apiHelper.getValueFromObject(item, 'max_total_money'))
                .input('MINTOTALMONEY', apiHelper.getValueFromObject(item, 'min_total_money'))
                .input('MINTOTALPRODUCT', apiHelper.getValueFromObject(item, 'min_count'))
                .input('MAXTOTALPRODUCT', apiHelper.getValueFromObject(item, 'max_count'))
                .input('QUANTITY', apiHelper.getValueFromObject(item, 'quantity'))
                .input('PERCENTVALUE', apiHelper.getValueFromObject(item, 'percent_value'))
                .input('USERNAME', authName)
                .execute('SM_COUPONCONDITION_CreateOrUpdate_AdminWeb');
        }
        // #region promotional_list
        else if (promotional_list.length > 0) {
            for (let i = 0; i < promotional_list.length; i++) {
                const item = promotional_list[i];
                const promotionalList = new sql.Request(transaction);
                await promotionalList
                    .input('COUPONCONDITIONID', apiHelper.getValueFromObject(item, 'coupon_conditionid'))
                    .input('COUPONID', coupon_id)
                    .input('CODEVALUE', apiHelper.getValueFromObject(item, 'code_value'))
                    .input('COUPONCODE', apiHelper.getValueFromObject(item, 'coupon_code'))
                    .input('CODETYPE', apiHelper.getValueFromObject(item, 'code_type'))
                    .input('MAXVALUEREDUCE', apiHelper.getValueFromObject(item, 'max_value_reduce'))
                    .input('MAXTOTALMONEY', apiHelper.getValueFromObject(item, 'max_total_money'))
                    .input('MINTOTALMONEY', apiHelper.getValueFromObject(item, 'min_total_money'))
                    .input('MINTOTALPRODUCT', apiHelper.getValueFromObject(item, 'min_count'))
                    .input('MAXTOTALPRODUCT', apiHelper.getValueFromObject(item, 'max_count'))
                    .input('QUANTITY', apiHelper.getValueFromObject(item, 'quantity'))
                    .input('PERCENTVALUE', apiHelper.getValueFromObject(item, 'percent_value'))
                    .input('USERNAME', authName)
                    .execute('SM_COUPONCONDITION_CreateOrUpdate_AdminWeb');
            }
        }

        let is_aplly_other_coupon = apiHelper.getValueFromObject(body, 'is_aplly_other_coupon', 0);
        let is_aplly_other_promotion = apiHelper.getValueFromObject(body, 'is_aplly_other_promotion', 0);
        let list_coupon_apply = apiHelper.getValueFromObject(body, 'list_coupon_apply', []);
        let list_order_promotion_apply = apiHelper.getValueFromObject(body, 'list_order_promotion_apply', []);
        // #endregion promotional_list
        if (is_aplly_other_coupon && list_coupon_apply) {
            const couponList = new sql.Request(transaction);
            for (let i = 0; i < list_coupon_apply.length; i++) {
                let item = list_coupon_apply[i];
                if (item) {
                    await couponList
                        .input('COUPONID', coupon_id)
                        .input('SOURCE_COUPON_ID', item)
                        .input('CREATEDUSER', authName)
                        .execute('SM_COUPON_COMBOCOUPON_CreateOrUpdate_AdminWeb');
                }
            }
        }

        if (is_aplly_other_promotion && list_order_promotion_apply) {
            const promotionList = new sql.Request(transaction);
            for (let i = 0; i < list_order_promotion_apply.length; i++) {
                let item = list_order_promotion_apply[i];
                if (item) {
                    await promotionList
                        .input('COUPONID', coupon_id)
                        .input('PROMOTIONID', item)
                        .input('CREATEDUSER', authName)
                        .execute('SM_COUPON_PROMOTION_CreateOrUpdate_AdminWeb');
                }
            }
        }

        if (!is_all_customer_type) {
            const customer_type_list = apiHelper.getValueFromObject(body, 'customer_type_list', []);
            const reqInsCustomerType = new sql.Request(transaction);
            for (let i = 0; i < customer_type_list.length; i++) {
                await reqInsCustomerType
                    .input('COUPONID', coupon_id)
                    .input('CUSTOMERTYPEID', customer_type_list[i])
                    .input('CREATEDUSER', authName)
                    .execute('SM_COUPON_CUSTOMERTYPE_CreateOrUpdate_AdminWeb');
            }
        }

        await transaction.commit();
        return new ServiceResponse(true, '', coupon_id);
    } catch (error) {
        await transaction.rollback();
        logger.error(error, {
            function: 'couponService.createOrUpdateCoupon',
        });
        return new ServiceResponse(false, error.message);
    }
};

const getListCoupon = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'search'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'from_date'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'to_date'))
            .input('COUPONTYPESTATUSID', apiHelper.getValueFromObject(queryParams, 'coupon_type_status_id'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .input('ISDELETED', apiHelper.getFilterBoolean(queryParams, 'is_deleted', 0))
            .execute('SM_COUPON_Getlist_AdminWeb');
        const result = data.recordset;
        return new ServiceResponse(true, '', {
            data: couponClass.list(result),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, {
            function: 'couponService.getListCoupon',
        });

        return new ServiceResponse(false, '', {});
    }
};

const parseArrToString = (value, parse = true, syb = ',', type = 'string', valueDefault = null) => {
    let result = valueDefault;
    if (value) {
        if (parse) {
            if (checkArray(value)) {
                result = value.join(syb);
            }
        } else {
            value = value.toString();
            if (value.includes(syb)) {
                let arrSplit = [];
                result = [];
                arrSplit = value.split(syb);
                arrSplit.map((val, index) => {
                    if (val) {
                        let checkValNum = parseInt(val) ?? 0;
                        if (type === 'string') {
                            checkValNum = `${checkValNum}`;
                        }
                        result.push(checkValNum);
                    }
                });
            }
        }
    }
    return result;
};

const getCouponDetail = async (coupon_id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('COUPONID', coupon_id).execute('SM_COUPON_GetDetailById_AdminWeb');

        let coupon = couponClass.detail(data.recordsets[0][0]);
        if (coupon.is_auto_gen) {
            if (coupon.code_config === 1) {
                coupon.is_letter_n_number = 1;
            } else if (coupon.code_config === 2) {
                coupon.is_letter = 1;
            } else if (coupon.code_config === 3) {
                coupon.is_number = 1;
            }
        }
        if (coupon?.promotionid) {
            coupon.list_order_promotion_apply = parseArrToString(coupon.promotionid, false, ',', 'number');
        }

        if (coupon?.source_coupon_id) {
            coupon.list_coupon_apply = parseArrToString(coupon.source_coupon_id, false, ',', 'number');
        }

        const result = {
            ...coupon,
            order_type_list: data.recordsets[1]?.map((o) => o?.id),
            customer_type_list: couponClass.optionsCustomer(data.recordsets[2]),
            product_list: productClass.list(data.recordsets[3]),
            promotional_list: couponClass.optionsPromotion(data.recordsets[4]),
        };

        return new ServiceResponse(true, '', result);
    } catch (e) {
        logger.error(e, {
            function: 'couponService.getCouponDetail',
        });
        return new ServiceResponse(false, '', {});
    }
};

const deleteCoupon = async (bodyParams) => {
    try {
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'COUPONID')
            .input('TABLENAME', 'SM_COUPON')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');
        return new ServiceResponse(true, '', true);
    } catch (e) {
        logger.error(e, {
            function: 'couponService.deleteCoupon',
        });

        return new ServiceResponse(false, '', {});
    }
};

const getListDetailCouponCode = async (coupon_id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('COUPONID', coupon_id).execute('SM_COUPON_TOTALAPPLY_GetByCouponId');
        const result = couponClass.optionsListCouponCode(data.recordset);
        return new ServiceResponse(true, '', result);
    } catch (e) {
        logger.error(e, {
            function: 'couponService.getCouponDetail',
        });
        return new ServiceResponse(false, '', {});
    }
};

const getListDetailAutoGenCouponCode = async (coupon_id, params) => {
    try {
        const currentPage = apiHelper.getCurrentPage(params);
        const itemsPerPage = apiHelper.getItemsPerPage(params);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('COUPONID', coupon_id)
            .input('KEYWORD', apiHelper.getValueFromObject(params, 'search'))
            .input('USEDSTATUS', apiHelper.getValueFromObject(params, 'used_status'))
            .input('APPLYDATEFROM', apiHelper.getValueFromObject(params, 'apply_date_from'))
            .input('APPLYDATETO', apiHelper.getValueFromObject(params, 'apply_date_to'))
            .execute('SM_COUPON_TOTALAPPLY_GetAutoGenByCouponId');
        const result = couponClass.optionsListAutoGenCouponCode(data.recordset);
        const result1 = data.recordsets[1][0];
        const result2 = data.recordsets[2][0];

        return new ServiceResponse(true, '', {
            data: result,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
            meta: {
                ...result1,
                ...result2,
            },
        });
    } catch (e) {
        logger.error(e, {
            function: 'couponService.getListDetailAutoGenCouponCode',
        });
        return new ServiceResponse(false, '', {});
    }
};

const exportExcel = async (coupon_id, body) => {
    try {
        const params = {
            ...body,
            itemsPerPage: API_CONST.MAX_EXPORT_EXCEL,
        };
        const serviceRes = await getListDetailAutoGenCouponCode(coupon_id, params);

        const { data } = serviceRes.getData();

        const wb = new xl.Workbook();
        addSheetGetList({
            workbook: wb,
            sheetName: 'Danh sách mã giảm',
            header: {
                coupon_code: 'Mã khuyến mãi',
                start_date: 'Thời gian bắt đầu',
                end_date: 'Thời gian kết thúc',
                is_used: 'Trạng thái sử dụng',
                customer_name: 'Tên khách hàng',
                customer_phone: 'Số điện thoại',
                customer_email: 'Email',
                used_date: 'Ngày sử dụng',
                is_sent: 'Trạng thái gửi mail',
                order_no: 'Mã đơn hàng',
            },
            data,
        });

        return new ServiceResponse(true, '', wb);
    } catch (e) {
        logger.error(e, { function: 'couponService.exportExcel' });
        return new ServiceResponse(true, '', {});
    }
};

module.exports = {
    getOptions,
    getCouponOptions,
    createOrUpdateCoupon,
    getListCoupon,
    getCouponDetail,
    deleteCoupon,
    getListDetailCouponCode,
    getListDetailAutoGenCouponCode,
    exportExcel,
};
