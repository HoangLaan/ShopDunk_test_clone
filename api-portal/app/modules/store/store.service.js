const storeClass = require('../store/store.class');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const fileHelper = require('../../common/helpers/file.helper');
const { storeName } = require('./utils/constants');

const getOptions = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
            .input('BUSINESSIDS', apiHelper.getValueFromObject(queryParams, 'business_ids'))
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'search'))
            .execute(storeName.MD_STORE_GETOPTIONS);
        const data = res.recordset;
        return new ServiceResponse(true, '', storeClass.options(data));
    } catch (e) {
        logger.error(e, { function: 'storeService.getOptions' });
        return new ServiceResponse(false, '', {});
    }
};

const getListStore = async (queryParams = {}) => {
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
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
            .input('BUSINESSIDS', apiHelper.getValueFromObject(queryParams, 'business_ids'))
            .input('AREAID', apiHelper.getValueFromObject(queryParams, 'area_id'))
            .input('PROVINCEID', apiHelper.getValueFromObject(queryParams, 'province_id'))
            .input('DISTRICTID', apiHelper.getValueFromObject(queryParams, 'district_id'))
            .input('WARDID', apiHelper.getValueFromObject(queryParams, 'ward_id'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active', 1))
            .input('CLUSTERID', apiHelper.getValueFromObject(queryParams, 'cluster_id'))
            .input('STORETYPEID', apiHelper.getValueFromObject(queryParams, 'store_type_id'))
            .execute('MD_STORE_GetList_AdminWeb');

        const stores = data.recordset;

        return new ServiceResponse(true, '', {
            data: storeClass.list(stores),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(stores),
        });
    } catch (e) {
        logger.error(e, { function: 'StoreService.getListStore' });
        return new ServiceResponse(true, '', {
            data: [],
            page: currentPage,
            limit: itemsPerPage,
            total: 0,
        });
    }
};

const detailStore = async (storeId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('STOREID', storeId).execute('MD_STORE_GetById_AdminWeb');

        // Store detail
        let detail = storeClass.detail(data.recordsets[0][0]);
        // Store images
        detail.images = storeClass.images(data.recordsets[1]);
        // Store ips
        detail.ips = storeClass.ips(data.recordsets[2]);

        detail.bank_accounts = storeClass.bankAccounts(data.recordsets[3]);
        detail.management = {
            value: data.recordsets[0][0]?.MANAGEMENTUSERNAME?.trim(),
            label: data.recordsets[0][0]?.MANAGEMENTFULLNAME?.trim(),
        };
        detail.store_assistants = data.recordsets[4].map((assistant) => ({
            value: assistant.USERNAME ? assistant.USERNAME.split('-')[0] : null,
            label: assistant.USERNAME,
        }))
        // Response
        return new ServiceResponse(true, '', detail);
    } catch (e) {
        logger.error(e, { function: 'storeService.detailStore' });
        return new ServiceResponse(false, e.message);
    }
};

const createStoreOrUpdate = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    const createOrUpdateStoreRequest = new sql.Request(transaction);
    try {
        const store_id = apiHelper.getValueFromObject(bodyParams, 'store_id');
        // Kiểm tra có trung code hay không
        const dataCheckStoreCode = await pool
            .request()
            .input('STOREID', store_id)
            .input('STORECODE', apiHelper.getValueFromObject(bodyParams, 'store_code'))
            .execute('MD_STORE_CheckCode_AdminWeb');

        if (dataCheckStoreCode.recordset[0].RESULT) {
            return new ServiceResponse(false, 'Mã cửa hàng đã tồn tại.');
        }

        let banner_url = null;
        try {
            banner_url = await fileHelper.saveImage(apiHelper.getValueFromObject(bodyParams, 'banner_url'));
        } catch (error) {
            logger.error(error, { function: 'storeService.SaveBanner' });
        }

        let store_image_url = null;
        try {
            store_image_url = await fileHelper.saveImage(apiHelper.getValueFromObject(bodyParams, 'store_image_url'));
        } catch (error) {
            logger.error(error, { function: 'StoreService.SaveBanner' });
        }

        await transaction.begin();
        const address_id = apiHelper.getValueFromObject(bodyParams, 'address');
        const company_id = apiHelper.getValueFromObject(bodyParams, 'company_id');
        const business_id = apiHelper.getValueFromObject(bodyParams, 'business_id');
        const province_id = apiHelper.getValueFromObject(bodyParams, 'province_id');
        const district_id = apiHelper.getValueFromObject(bodyParams, 'district_id');
        const ward_id = apiHelper.getValueFromObject(bodyParams, 'ward_id');

        const data = await createOrUpdateStoreRequest
            .input('STOREID', store_id)
            .input('STORECODE', apiHelper.getValueFromObject(bodyParams, 'store_code'))
            .input('STORENAME', apiHelper.getValueFromObject(bodyParams, 'store_name'))
            .input('PHONENUMBER', apiHelper.getValueFromObject(bodyParams, 'phone_number'))
            .input('DESCRIPTIONS', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('MAPURL', apiHelper.getValueFromObject(bodyParams, 'map_url'))
            .input('OPENTIME', apiHelper.getValueFromObject(bodyParams, 'open_time'))
            .input('CLOSETIME', apiHelper.getValueFromObject(bodyParams, 'close_time'))
            .input('LOCATIONX', apiHelper.getValueFromObject(bodyParams, 'location_x'))
            .input('LOCATIONY', apiHelper.getValueFromObject(bodyParams, 'location_y'))
            .input('BANNERURL', banner_url)
            .input('AREAID', apiHelper.getValueFromObject(bodyParams, 'area_id'))
            .input('COMPANYID', company_id)
            .input('BUSINESSID', business_id)
            .input('COUNTRYID', apiHelper.getValueFromObject(bodyParams, 'country_id'))
            .input('PROVINCEID', province_id)
            .input('DISTRICTID', district_id)
            .input('WARDID', ward_id)
            .input('ADDRESS', address_id)
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('OPENINGDAY', apiHelper.getValueFromObject(bodyParams, 'opening_day'))
            .input('CLOSINGDAY', apiHelper.getValueFromObject(bodyParams, 'closing_day'))
            .input('STATUSTYPE', apiHelper.getValueFromObject(bodyParams, 'status_type'))
            .input('ACREAGE', apiHelper.getValueFromObject(bodyParams, 'acreage'))
            .input('BRANDID', apiHelper.getValueFromObject(bodyParams, 'brand_id'))
            .input('CLUSTERID', apiHelper.getValueFromObject(bodyParams, 'cluster_id'))
            .input('STORETYPEID', apiHelper.getValueFromObject(bodyParams, 'store_type_id'))
            .input('MANAGEMENTUSERNAME', apiHelper.getValueFromObject(bodyParams, 'management')?.value)
            .input('SIZETYPE', apiHelper.getValueFromObject(bodyParams, 'size_type'))
            .input('ARCHITECTURETYPE', apiHelper.getValueFromObject(bodyParams, 'architecture_type'))
            .input('AGESTORE', apiHelper.getValueFromObject(bodyParams, 'age_store'))
            .execute('MD_STORE_CreateOrUpdate_AdminWeb');
        const storeId = data.recordset[0].RESULT;

        const store_assistants = apiHelper.getValueFromObject(bodyParams, 'store_assistants');
        if (store_assistants) {
            // delete old store_assitants
            const storeAssistantDel = new sql.Request(transaction);
            await storeAssistantDel
                .input('STOREID', storeId)
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('MD_STOREASSISTANT_DELETE');
            
            //insert new store_assistants
            for (let assistant of store_assistants) {
                let storeAssistantCreate = new sql.Request(transaction);
                let assistantResult = await storeAssistantCreate
                    .input('STOREID', storeId)
                    .input('USERNAME', assistant.name)
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .execute('MD_STOREASSISTANT_Create')
                
                if (!assistantResult.recordset[0].RESULT) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Tạo phó cửa hàng thất bại');
                }
            }
        }

        if (store_id) {
            const deleteMapper = new sql.Request(transaction);
            const deleteRes = await deleteMapper
                .input('STOREID', store_id)
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('MD_STORE_DeleteMapByStoreId_AdminWeb');
            const result = deleteRes.recordset[0].RESULT;

            if (result <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, RESPONSE_MSG.CRUD.CREATE_FAILED);
            }
        } else {
            const stock_list = apiHelper.getValueFromObject(bodyParams, 'stock_list', []);
            const createStock = new sql.Request(transaction);
            for (let i = 0; i < stock_list.length; i++) {
                const item = stock_list[i];
                const stocksCode = apiHelper
                    .getValueFromObject(item, 'name')
                    ?.split(' ')
                    .map((o) => o[0])
                    .toString()
                    .replaceAll(',', '')
                    .toUpperCase();
                console.log(stocksCode, apiHelper.getValueFromObject(item, 'stocks_name'));
                const data = await createStock
                    .input('STOCKSCODE', stocksCode)
                    .input('STOCKSNAME', apiHelper.getValueFromObject(item, 'name'))
                    .input('STOCKTYPEID', apiHelper.getValueFromObject(item, 'id'))
                    .input('STOREID', storeId)
                    .input('ADDRESS', address_id)
                    .input('COMPANYID', company_id)
                    .input('BUSINESSID', business_id)
                    .input('PROVINCEID', province_id)
                    .input('DISTRICTID', district_id)
                    .input('WARDID', ward_id)
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .input('ISACTIVE', 1)
                    .execute('ST_STOCKS_CreateOrUpdate_AdminWeb');
                let stocksId = data.recordset[0].RESULT;
                if (!stocksId) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Lỗi tạo kho cho cửa hàng!');
                }
            }
        }

        //const images = apiHelper.getValueFromObject(bodyParams, 'images', []);
        const ips = apiHelper.getValueFromObject(bodyParams, 'ips', []);

        // for (let i = 0; i < images.length; i++) {
        //     const picture_url = await fileHelper.saveImage(images[i].picture_url);
        //     const createImageRequest = new sql.Request(transaction);
        //     const createRes = await createImageRequest
        //         .input('STOREID', storeId)
        //         .input('PICTUREURL', picture_url)
        //         .input('ISDEFAULT', images[i].is_default)
        //         .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
        //         .execute('STO_STOREIMAGES_Create_AdminWeb');

        //     const result = createRes.recordset[0].RESULT;
        //     if (result <= 0) {
        //         await transaction.rollback();
        //         return new ServiceResponse(false, RESPONSE_MSG.CRUD.CREATE_FAILED);
        //     }
        // }

        for (let index = 0; index < ips.length; index++) {
            const element = ips[index];
            const createIpStore = new sql.Request(transaction);
            const resIpStore = await createIpStore
                .input('STOREID', storeId)
                .input('IPID', apiHelper.getValueFromObject(element, 'ip_id'))
                .input('IPNAME', apiHelper.getValueFromObject(element, 'ip_name'))
                .input('IPADDRESS', apiHelper.getValueFromObject(element, 'ip_address'))
                .input('ISIPV4', apiHelper.getValueFromObject(element, 'is_ipv4'))
                .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('MD_STOREIP_createOrUpdate_adminWeb');
            const result = resIpStore.recordset[0].RESULT;
            if (result <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, RESPONSE_MSG.CRUD.CREATE_FAILED);
            }
        }

        const bankAccounts = apiHelper.getValueFromObject(bodyParams, 'bank_accounts');
        if (bankAccounts && bankAccounts.length) {
            for (let i = 0; i < bankAccounts.length; i++) {
                const requestBankAccountCreate = new sql.Request(transaction);
                const dataBankAccountCreate = await requestBankAccountCreate
                    .input('STOREID', store_id)
                    .input('BANKACCOUNTID', apiHelper.getValueFromObject(bankAccounts[i], 'bank_account_id'))
                    .input('BANKID', apiHelper.getValueFromObject(bankAccounts[i], 'bank_id'))
                    .input('BANKNUMBER', apiHelper.getValueFromObject(bankAccounts[i], 'bank_number'))
                    .input('BANKBRANCH', apiHelper.getValueFromObject(bankAccounts[i], 'bank_branch'))
                    .input('BANKCODE', apiHelper.getValueFromObject(bankAccounts[i], 'bank_code'))
                    .input('ISDEFAULT', apiHelper.getValueFromObject(bankAccounts[i], 'is_default'))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .input('BANKACCOUNTNAME', apiHelper.getValueFromObject(bankAccounts[i], 'bank_account_name'))
                    .execute('MD_STOREBANKACCOUNT_CreateOrUpdate_AdminWeb');
                if (
                    !dataBankAccountCreate.recordset ||
                    !dataBankAccountCreate.recordset.length ||
                    !dataBankAccountCreate.recordset[0].RESULT
                ) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Lỗi thêm mới tài khoản ngân hàng.');
                }
            }
        }

        await transaction.commit();
        return new ServiceResponse(true, '', storeId);
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'StoreService.createOrUpdate' });
        return new ServiceResponse(false, e.message);
    }
};

const deleteStore = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('STOREIDS', apiHelper.getValueFromObject(bodyParams, 'list_id').toString())
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('MD_STORE_DeleteMany_AdminWeb');

        return new ServiceResponse(true, '', 'ok');
    } catch (e) {
        logger.error(e, { function: 'StoreService.deleteStore' });
        return new ServiceResponse(false, e.message);
    }
};

const getListStoreWithDeboune = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(bodyParams, 'key_word'))
            .execute('MD_STORE_GetListWithDeboune');
        const stores = data.recordset;

        return new ServiceResponse(true, '', storeClass.list(stores));
    } catch (e) {
        logger.error(e, { function: 'StoreService.getListStoreWithDeboune' });
        return new ServiceResponse(false, e.message);
    }
};

const getOptionsByUser = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'user_name'))
            .execute('MD_STORE_getOptionsByUser_AdminWeb');
        const result = storeClass.options(data.recordset);
        if (result) {
            return new ServiceResponse(true, '', result);
        }
        return new ServiceResponse(false, '', null);
    } catch (error) {
        logger.error(e, {
            function: 'store.service.getOptionsByUser',
        });

        return new ServiceResponse(false, '', {});
    }
};

const getOptsByUserHaveStocksWarranty = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'user_name'))
            .execute('MD_STORE_getOptionsByUserHaveStocksWarranty_AdminWeb');
        const result = storeClass.options(data.recordset);
        if (result) {
            return new ServiceResponse(true, '', result);
        }
        return new ServiceResponse(false, '', null);
    } catch (error) {
        logger.error(e, {
            function: 'store.service.getOptsByUserHaveStocksWarranty',
        });

        return new ServiceResponse(false, '', {});
    }
};
module.exports = {
    getListStore,
    detailStore,
    createStoreOrUpdate,
    deleteStore,
    getListStoreWithDeboune,
    getOptionsByUser,
    getOptions,
    getOptsByUserHaveStocksWarranty,
};
