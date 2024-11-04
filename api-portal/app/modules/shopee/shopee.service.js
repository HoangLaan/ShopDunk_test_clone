const shopeeClass = require('./shopee.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const moment = require('moment');
const pdfHelper = require('../../common/helpers/pdf.helper');
const { cloneDeep, uniqBy, chain, reject, forEach } = require('lodash');
const axios = require('axios');
const md5 = require('md5');
const FormData = require('form-data');
const fs = require('fs');

const crypto = require('crypto');
const https = require('https');
const { path } = require('app-root-path');
const { parse } = require('path');
const { set, get, getByHash, delHash, del, setV2 } = require('../../common/helpers/redis.helper');
const { PDFDocument } = require("pdf-lib");
const stocksDetailService = require('../stocks-detail/stocks-detail.service');
// const { merge } = require('merge-pdf-buffers');


const object = (code = '') => {
  const msg = {
    'UNPAID': { message: 'Chưa thanh toán' },
    'READY_TO_SHIP': { message: 'Chưa xử lý' },
    'PROCESSED': { message: 'Đã xử lý' },
    'SHIPPED': { message: 'vận chuyển' },
    'COMPLETED': { message: 'Hoàn thành' },
    'IN_CANCEL': { message: 'Bị hủy' },
    'CANCELLED': { message: 'Đã hủy' },
    'INVOICE_PENDING': { message: 'Đang xử lý hóa đơn' },
    'TO_CONFIRM_RECEIVE': { message: 'Đã xác nhận vận chuyển' },
    '': { message: 'Không xác định' }
  }
  if(msg[code]){
    return msg[code];
  }else{
    return { message: 'Không xác định' }
  }
}

const requestPostShopee = (link, params, config = {}) => {
  let baseURL = process.env.SHOPEE_URL || 'https://partner.test-stable.shopeemobile.com';
  return axios
    .post(`${link}`, params, config)
    .then(response => response)
    .catch(error => error);
};

const requestGetShopee = (link, params, token) => {
  let baseURL = process.env.SHOPEE_URL || 'https://partner.test-stable.shopeemobile.com';
  return axios
    .get(`${link}`, params)
    .then(response => response)
    .catch(error => error);
};


// create or update Order
const createShopeeProfile = async bodyParams => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('SHOPNAME', apiHelper.getValueFromObject(bodyParams, 'shop_name'))
      .input('SHOPID', apiHelper.getValueFromObject(bodyParams, 'shop_id'))
      .input('ID', apiHelper.getValueFromObject(bodyParams, 'id', null))
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .input('SHOPTYPE', 1)
      .execute('MD_SHOPPROFILE_CreateOrUpdate_AdminWeb');
    const shopeeProfileID = data.recordset[0].RESULT;
    if (!shopeeProfileID) {
      return new ServiceResponse(false, "Khởi tạo thông tin cửa hàng thất bại");
    }
    return new ServiceResponse(true, 'Khởi tạo thông tin của hàng thành công', shopeeProfileID);
  } catch (e) {
    logger.error(e, { function: 'orderService.createCustomerStocks' });
    return new ServiceResponse(false, "Khởi tạo thông tin cửa hàng thất bại");
  }
};


// create or update Order
const deleteShopProfile = async bodyParams => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('SHOPID', apiHelper.getValueFromObject(bodyParams, 'shop_id'))
      .execute('MD_SHOPPROFILE_Delete_AdminWeb');
    const shopeeProfileID = data.recordset[0].RESULT;
    if (!shopeeProfileID) {
      return new ServiceResponse(false, "Xóa cửa hàng thất bại");
    }
    return new ServiceResponse(true, 'Xóa của hàng thành công', {});
  } catch (e) {
    logger.error(e, { function: 'orderService.createCustomerStocks' });
    return new ServiceResponse(false, "Xóa của hàng thất bại thất bại");
  }
};

const connectShoppe = async (body = {}) => {
  try {
    // let rawSignature = `${process.env.KEY_HASH_SHOPEE}${process.env.SHOPEE_RETURN_URL}`
    // let signature = crypto.createHash('sha256').update(rawSignature).digest('hex');
    let path_connect = `${process.env.SHOPEE_URL}${process.env.SHOPEE_CONNECT_PATH}`;
    let timestamp = timeStampZone()//Math.floor(Date.now() / 1000);

    let rawSignature = `${process.env.PARTNER_ID}${process.env.SHOPEE_CONNECT_PATH}${timestamp}`;
    let signature = crypto.createHmac('sha256', process.env.KEY_HASH_SHOPEE).update(rawSignature).digest('hex');
    let path = `${path_connect}?partner_id=${process.env.PARTNER_ID}&timestamp=${timestamp}&sign=${signature}&redirect=${process.env.SHOPEE_RETURN_URL}`;
    return new ServiceResponse(true, '', { path: path });
  } catch (error) {
    logger.error(error.message, { function: 'ShopeeService.connectShoppe' });
    return new ServiceResponse(false, '', {});
  }
};

const timeStampZone = () => {
  return parseInt(Math.floor((Date.now() - (1000 * 60 * process.env.TIME_ZONE_DEPLAY)) / 1000));
}

const DisconnectShopee = async (body = {}) => {
  try {
    let path_disconnect = `${process.env.SHOPEE_URL}${process.env.SHOPEE_DISCONNECT_PATH}`;
    let timestamp = timeStampZone();
    let rawSignature = `${process.env.PARTNER_ID}${process.env.SHOPEE_DISCONNECT_PATH}${timestamp}`;
    let signature = crypto.createHmac('sha256', process.env.KEY_HASH_SHOPEE).update(rawSignature).digest('hex');

    let path = `${path_disconnect}?partner_id=${process.env.PARTNER_ID}&timestamp=${timestamp}&sign=${signature}&redirect=${process.env.SHOPEE_RETURN_URL}?disconnect=true`;
    return new ServiceResponse(true, '', { path: path });
  } catch (error) {
    logger.error(error.message, { function: 'ShopeeService.disconnectShoppe' });
    return new ServiceResponse(false, '', {});
  }
};

const getAccessToken = async (body = {}) => {
  try {
    let code = apiHelper.getValueFromObject(body, 'code');
    let shop_id = apiHelper.getValueFromObject(body, 'shop_id');
    let timestamp = timeStampZone()  //Math.floor(Date.now() / 1000);

    // Chữ kí thô
    let rawSignature = `${process.env.PARTNER_ID}/api/v2/auth/token/get${timestamp}`;
    // Chữ kí hash
    let signature = crypto.createHmac('sha256', process.env.KEY_HASH_SHOPEE).update(rawSignature).digest('hex');

    let params = {
      code: code,
      shop_id: parseInt(shop_id),
      partner_id: parseInt(process.env.PARTNER_ID),
      timestamp: parseInt(timestamp),

    };

    // Đường dẫn để lấy token
    let path = `${process.env.SHOPEE_URL}/api/v2/auth/token/get?partner_id=${process.env.PARTNER_ID}&timestamp=${timestamp}&sign=${signature}`;
    let result = await requestPostShopee(path, params);
    let { data: res } = result;
    let { error } = (res || {});
    if (error == '') {
      setV2(`SHOPEE_ACCESSTOKEN:${parseInt(shop_id)}`, JSON.stringify(res));
      setV2(`SHOPEE_CONFIG`, JSON.stringify({ code, shop_id }));
      return new ServiceResponse(true, '', {});
    } else {
      // Với mỗi mã code khi shopee redirect về chỉ dùng 1 lần duy nhất để lấy accessToken và RefeshToken
      let { message = '', code_message_value = '' } = res || {};
      logger.error(res, { function: 'ShopeeService.GenarateAccessToken' });
      // return {...new ServiceResponse(false,`${code_message_value}`), is_error : 1};
      return new ServiceResponse(false, '', {});
    }
  } catch (error) {
    logger.error(error.message, { function: 'ShopeeService.GetAccessToken' });
    return new ServiceResponse(false, '', {});
  }
};

// Lấy thông tin của cửa hàng trên shopee
const getProfileShop = async (body = {}) => {
  try {
    let code = apiHelper.getValueFromObject(body, 'code');
    let shop_id = apiHelper.getValueFromObject(body, 'shop_id');
    let is_break = apiHelper.getValueFromObject(body, 'is_break' , false );

    // let token = await get(`SHOPEE_ACCESSTOKEN:${parseInt(shop_id)}`);

    // if(token == 'null'){
    //     await getAccessToken(body);
    // }
    token = await get(`SHOPEE_ACCESSTOKEN:${parseInt(shop_id)}`);
    let { access_token = null } = JSON.parse(`${JSON.parse(token)}`);
    if (access_token) {
      let timestamp = timeStampZone();  //Math.floor(Date.now() / 1000);
      // Chữ kí thô
      // let rawSignature = `${process.env.PARTNER_ID}/api/v2/shop/get_profile${timestamp}${access_token}${shop_id}${process.env.KEY_HASH_SHOPEE}`;
      let rawSignature = `${process.env.PARTNER_ID}/api/v2/shop/get_shop_info${timestamp}${access_token}${shop_id}`;

      // Chữ kí hash
      let signature = crypto.createHmac('sha256', process.env.KEY_HASH_SHOPEE).update(rawSignature).digest('hex');

      // let path = `${process.env.SHOPEE_URL}/api/v2/shop/get_profile?access_token=${access_token}&partner_id=${process.env.PARTNER_ID}&shop_id=${shop_id}&sign=${signature}&timestamp=${timestamp}`;
      let path = `${process.env.SHOPEE_URL}/api/v2/shop/get_shop_info?partner_id=${process.env.PARTNER_ID}&shop_id=${shop_id}&access_token=${access_token}&sign=${signature}&timestamp=${timestamp}`;
      let Profile = await requestGetShopee(path);
      let { data: res } = Profile;
      /// Có Data
      if (res) {
        let { error } = (res || {});
        if (error == '') {
          return new ServiceResponse(true, '', { data: res });
        } else {
          let { message = '', error = '' } = (res || {});
          logger.error(res, { function: 'ShopeeService.getProfileShopee' });
          return new ServiceResponse(false, `${message}`, {});
        }
      } else {
        //Token hết hạn
        let { response } = (Profile || {});
        let { data, status, headers } = (response || {});
        let { message, error } = data;
        if ((error == 'error_auth' && message == 'Invalid access_token.') && !is_break ) {
          await refeshToken({ ...body, _callBack: getProfileShop })
        }else{
          logger.error(data, { function: 'ShopeeService.InvalidToken' });
          return new ServiceResponse(false, '', {});
        }
      }
    }
  } catch (error) {
    logger.error(error.message, { function: 'ShopeeService.GetProfileShop' });
    return new ServiceResponse(false, '', {});
  }
};

// Chỉ lấy chỉ lấy id của sản phẩm và dùng để gọi các api lấy các thông tin của sản phẩm khác
const getProduct = async (body = {}) => {
  try {
    let start_date = apiHelper.getValueFromObject(body, 'start_date');
    let end_date = apiHelper.getValueFromObject(body, 'end_date');
    let shop_id = apiHelper.getValueFromObject(body, 'shop_id');
    let itemsPerPage = apiHelper.getValueFromObject(body, 'itemsPerPage');
    let page = apiHelper.getValueFromObject(body, 'page');
    let is_break = apiHelper.getValueFromObject(body, 'is_break' , false );
    // const currentPage = apiHelper.getCurrentPage(queryParams);

    if (shop_id) {
      let token = await get(`SHOPEE_ACCESSTOKEN:${parseInt(shop_id)}`);
      if (token == 'null') {
        // await getAccessToken(body);
        return new ServiceResponse(false, 'Refesh', { is_refesh: true });
      }
      let { access_token = '' } = JSON.parse(`${JSON.parse(token)}`);
      if (access_token) {
        let code = apiHelper.getValueFromObject(body, 'code');
        let timestamp = timeStampZone();  //Math.floor(Date.now() / 1000);

        let offPerpage = (page - 1) * itemsPerPage;

        // let update_time_from =Math.floor((start_date ? new Date(moment(new Date(start_date)).format('YYYY-MM-DD HH:mm:ss')).getTime() : Date.now()) /1000 );

        // let update_time_to = Math.floor((end_date ? new Date(moment(new Date(end_date)).format('YYYY-MM-DD HH:mm:ss')).getTime() : Date.now() ) /1000 );
        // Chữ kí thô
        let rawSignature = `${process.env.PARTNER_ID}/api/v2/product/get_item_list${timestamp}${access_token}${shop_id}`;
        // Chữ kí hash
        let signature = crypto.createHmac('sha256', process.env.KEY_HASH_SHOPEE).update(rawSignature).digest('hex');

        let path = `${process.env.SHOPEE_URL}/api/v2/product/get_item_list?partner_id=${process.env.PARTNER_ID}&shop_id=${shop_id}&access_token=${access_token}&sign=${signature}&timestamp=${timestamp}&offset=${offPerpage}&page_size=${itemsPerPage}&item_status=NORMAL`;

        let listProduct = await requestGetShopee(path);
        let { data: res } = listProduct;

        if (res) {
          let { error, response } = (res || {});
          // Nếu không có lỗi thì sẽ lấy được dữ liệu
          if (error == '' && response) {
            let { item = [] } = (response || {});
            // Nếu có sản phẩm 
            if (item && item.length && item.length > 0) {
              let { total_count, next_offset, has_next_page } = response;
              let list_item_id = (item || []).map(i => {
                return i.item_id;
              });

              // Lấy thông tin cơ bản của sản phẩm
              let resultBaseInfor = await getBaseInfoProduct({ ...body, access_token, list_item_id });
              if (resultBaseInfor.isFailed()) {
                return new ServiceResponse(false, `Đã xảy ra lỗi khi lấy thông tin cơ bản của sản phẩm`, {});
              }
              // Lấy thông tin mở rộng của sản phẩm
              let resultExtendInfor = await getExtendInfoProduct({ ...body, access_token, list_item_id });
              if (resultExtendInfor.isFailed()) {
                return new ServiceResponse(false, `Đã xảy ra lỗi khi lấy thông tin mở rộng của sản phẩm`, {});
              }

              let ListExtendInfor = [];
              let ListBaseInfor = [];
              let ListProductMap = {};
              
              if (resultBaseInfor.isSuccess()) {
                // Lọc lại thông tin từ dữ liệu cơ bảng của sản phẩm
                ListBaseInfor = await Promise.all((resultBaseInfor.getData() || []).map(async product => {
                  let stocks_info = (product || {}).stock_info_v2;
                  let resModel = await getModelList({shop_id , item_id : product.item_id});
                  if (resModel.isFailed()) {
                    
                  }
                  let {model = []} = (resModel.getData());
                  // Nếu 1 sản phẩm được phân loại => 2 model trong 1 sản phẩm => sẽ tách sản phẩm thành các sản phẩm với mã model
                  if(model && model.length > 0){
                    (model || []).map(m =>{
                      let stocks_info_model = (m || {}).stock_info_v2
                      ListProductMap[m.model_id] = {
                        item_id: m.model_id || '',
                        item_name: `${product.item_name || ''} - ${m.model_name} `,
                        category_id: product.category_id || '',
                        description: product.description || '',
                        price_info: product.price_info || '',
                        weight: product.weight || '',
                        condition: product.condition || '',
                        item_status: product.item_status || '',
                        description_type: product.description_type || '',
                        product_code: product.item_sku || '',
                        image : product.image,
                        ...(product.brand || {}),
                        ...(product.pre_order || {}),
                        ...(product.dimension || {}),
                        ...(stocks_info_model || {}),
                      }
                    })
                  // Nếu sản phẩm chỉ có một không phân loại sẽ lấy mã sản phẩm
                  }else{
                    ListProductMap[product.item_id] = {
                      item_id: product.item_id || '',
                      item_name: product.item_name || '',
                      category_id: product.category_id || '',
                      description: product.description || '',
                      price_info: product.price_info || '',
                      weight: product.weight || '',
                      condition: product.condition || '',
                      item_status: product.item_status || '',
                      description_type: product.description_type || '',
                      product_code: product.item_sku || '',
                      image : product.image,
                      ...(product.brand || {}),
                      ...(product.pre_order || {}),
                      ...(product.dimension || {}),
                      ...(stocks_info || {}),
                    };
                  }
                }));
              }
              let stringProductCode = (Object.values(ListProductMap) || [])
                .map(item => {
                  if (item && item.item_id) {
                    return item.item_id;
                  }else{
                    return 0
                  }
                })
                .join(',');

              // Lấy số tồn kho ở site
              let params = {
                itemsPerPage: '25',
                page: '1',
                is_active: '1',
                is_out_of_stock: '1',
                search: `${stringProductCode}`,
                user_name: '',
                shop_id: shop_id
              };
              let responseGetInventory = await getListProductStocksDetailShopee(params);
              let { data = [] } = responseGetInventory.getData();

              if (resultExtendInfor.isSuccess()) {
                // Lọc lại thông tin từ dữ liệu mở rộng của sản phẩm
                ListExtendInfor = (resultExtendInfor.getData() || []).map(product => {
                  return {
                    item_id: product.item_id || 0,
                    sale: product.sale || 0,
                    likes: product.likes || 0,
                    rating_star: product.rating_star || 0,
                    comment_count: product.comment_count || 0,
                  };
                });
              }
              // Gộp 2 mảng thông tin cơ bảng và thông tin mở rộng lại với nhau để trả về
              let ListProduct = (Object.values(ListProductMap) || []).map(base => {
                let extend = (ListExtendInfor || []).find(ext => ext.item_id == base.item_id);
                let inventory = (data || []).find(pro => pro.product_shopee_id == base.item_id) || {};
                return {
                  ...base,
                  ...extend,
                  product_portal :(inventory && inventory ? {...inventory} : null ),
                  total_inventory: (inventory && inventory && inventory.total_inventory) || 0,
                };
              });
              return new ServiceResponse(true, 'Lấy dữ liệu sản phẩm thành công', {
                data: ListProduct,
                offset: next_offset,
                has_next_page: has_next_page,
                page: page,
                limit: itemsPerPage,
                total: total_count,
              });
              // Nếu không có sản phẩm
            } else {
              return new ServiceResponse(true, 'Lấy dữ liệu sản phẩm thành công', {
                total: 0,
                data: [],
                offset: 0,
                has_next_page: 0,
              });
            }
            // End if Không có lỗi
          } else {
            let { message = '', error = '' } = res || {};
            logger.error(res, { function: 'ShopeeService.GetProductShopee' });
            return new ServiceResponse(false, `${message}`, {});
          }
        } // End If có kết quả 
        else // Trường hợp lỗi
        {
          //Token hết hạn
          let { response } = (listProduct || {});
          let { data, status, headers } = (response || {});
          let { message, error } = data;
          if ((error == 'error_auth' && message == 'Invalid access_token.') && (!is_break)) {
            await refeshToken({ ...body, _callBack: getProduct })
          }else{
            logger.error(data, { function: 'ShopeeService.InvalidErrorGetProduct' });
            return new ServiceResponse(false, '', {});
          }
        }
      }
    }
  } catch (error) {
    logger.error(error.message, { function: 'ShopeeService.GetProductShop' });
    return new ServiceResponse(false, '', {});
  }
};

// Lấy các thông tin cơ bản của sản phẩm trên shopee
const getBaseInfoProduct = async (params = {}) => {
  try {
    let start_date = apiHelper.getValueFromObject(params, 'start_date');
    let end_date = apiHelper.getValueFromObject(params, 'end_date');
    let shop_id = apiHelper.getValueFromObject(params, 'shop_id');
    let access_token = apiHelper.getValueFromObject(params, 'access_token');
    let list_item_id = apiHelper.getValueFromObject(params, 'list_item_id');
    let is_break = apiHelper.getValueFromObject(params, 'is_break' , false );

    if (access_token) {
      let code = apiHelper.getValueFromObject(params, 'code');
      let timestamp = timeStampZone();//Math.floor(Date.now() / 1000);
      // Chữ kí thô
      let rawSignature = `${process.env.PARTNER_ID}/api/v2/product/get_item_base_info${timestamp}${access_token}${shop_id}`;
      // Chữ kí hash
      let signature = crypto.createHmac('sha256', process.env.KEY_HASH_SHOPEE).update(rawSignature).digest('hex');

      let path = `${process.env.SHOPEE_URL}/api/v2/product/get_item_base_info?partner_id=${process.env.PARTNER_ID}&shop_id=${shop_id}&access_token=${access_token}&sign=${signature}&timestamp=${timestamp}&item_id_list=${list_item_id}`;
      let listProduct = await requestGetShopee(path);
      let { data: res } = listProduct;
      if (res) {
        let { response, error } = (res || {});
        if (error == '' && response) {
          let { item_list = [] } = (response || {});
          return new ServiceResponse(true, '', item_list);
        } else {
          let { message = '', error = '' } = res || {};
          logger.error(res, { function: 'ShopeeService.GetBaseInfoProductShopee' });
          return new ServiceResponse(false, '', []);
        }
      } else {
        //Token hết hạn
        let { response } = (listProduct || {});
        let { data, status, headers } = (response || {});
        let { message, error } = data;
        if ((error == 'error_auth' && message == 'Invalid access_token.') && !is_break) {
          await refeshToken({ ...params, _callBack: getBaseInfoProduct })
        }else{
          logger.error(data, { function: 'ShopeeService.InvalidErrorBaseInFor' });
          return new ServiceResponse(false, '', {});
        }
      }
    }
  } catch (error) {
    logger.error(error.message, { function: 'ShopeeService.GetBaseInfoProduct' });
    return new ServiceResponse(false, '', {});
  }
};

// Lấy các thông tin cơ bản của sản phẩm trên shopee
const getExtendInfoProduct = async (params = {}) => {
  try {
    let start_date = apiHelper.getValueFromObject(params, 'start_date');
    let end_date = apiHelper.getValueFromObject(params, 'end_date');
    let shop_id = apiHelper.getValueFromObject(params, 'shop_id');
    let access_token = apiHelper.getValueFromObject(params, 'access_token');
    let list_item_id = apiHelper.getValueFromObject(params, 'list_item_id');
    let is_break = apiHelper.getValueFromObject(params, 'is_break' , false );

    if (access_token) {
      let code = apiHelper.getValueFromObject(params, 'code');
      let timestamp = timeStampZone(); // Math.floor(Date.now() / 1000);
      // Chữ kí thô
      let rawSignature = `${process.env.PARTNER_ID}/api/v2/product/get_item_extra_info${timestamp}${access_token}${shop_id}`;
      // Chữ kí hash
      let signature = crypto.createHmac('sha256', process.env.KEY_HASH_SHOPEE).update(rawSignature).digest('hex');

      let path = `${process.env.SHOPEE_URL}/api/v2/product/get_item_extra_info?partner_id=${process.env.PARTNER_ID}&shop_id=${shop_id}&access_token=${access_token}&sign=${signature}&timestamp=${timestamp}&item_id_list=${list_item_id}`;
      let listProduct = await requestGetShopee(path);
      let { data: res } = listProduct;
      if (res) {
        let { response, error } = (res || {});
        if (error == '' && response) {
          let { item_list = [] } = (response || {});

          return new ServiceResponse(true, '', item_list);
        } else {
          let { message = '', error = '' } = res || {};
          logger.error(res, { function: 'ShopeeService.GetBaseInfoProduct' });
          return new ServiceResponse(false, '', []);
        }
      } else {
        //Token hết hạn
        let { response } = (listProduct || {});
        let { data, status, headers } = (response || {});
        let { message, error } = data;
        if ((error == 'error_auth' && message == 'Invalid access_token.') && !is_break ) {
          await refeshToken({ ...params, _callBack: getExtendInfoProduct })
        }else{
          logger.error(data, { function: 'ShopeeService.InvalidErrorExtendInFor' });
          return new ServiceResponse(false, '', {});
        }
      }
    }
  } catch (error) {
    logger.error(error.message, { function: 'ShopeeService.GetBaseInfoProduct' });
    return new ServiceResponse(false, '', {});
  }
};

const refeshToken = async (body = {}) => {
  try {
    let shop_id = apiHelper.getValueFromObject(body, 'shop_id');
    let token = await get(`SHOPEE_ACCESSTOKEN:${parseInt(shop_id)}`);
    let { refresh_token = '' } = JSON.parse(`${JSON.parse(token)}`);

    if (refresh_token) {
      let timestamp = timeStampZone(); //Math.floor(Date.now() / 1000);
      // Chữ kí thô
      let rawSignature = `${process.env.PARTNER_ID}/api/v2/auth/access_token/get${timestamp}`;
      // Chữ kí hash
      let signature = crypto.createHmac('sha256', process.env.KEY_HASH_SHOPEE).update(rawSignature).digest('hex');
      let path = `${process.env.SHOPEE_URL}/api/v2/auth/access_token/get?partner_id=${process.env.PARTNER_ID}&sign=${signature}&timestamp=${timestamp}`;

      let requestBody = {
        refresh_token: refresh_token,
        partner_id: parseInt(process.env.PARTNER_ID),
        shop_id: parseInt(shop_id),
      };
      let result = await requestPostShopee(path, requestBody);
      let { data: res } = result;
      if (res) {
        let { error } = res;
        if (error == '') {
          let { access_token = null } = res;
          await setV2(`SHOPEE_ACCESSTOKEN:${parseInt(shop_id)}`, JSON.stringify(res));

          // Hàm call gọi ngược lại
          let { _callBack } = body;
          if (_callBack) {
            await _callBack({...body , is_break : true});
            return new ServiceResponse(true, 'Refesh Token shopee');
          }
        } else {
          let { message = '', code_message_value = '' } = res || {};
          logger.error(res, { function: 'ShopeeService.CallrefeshToken' });
          return new ServiceResponse(true, '', {});
        }
      } else {
        //Refesh Token không hợp lệ
        let { response } = (result || {});
        let { data, status, headers } = (response || {});
        let { message, error } = data;
        if (error == 'error_auth' && message == 'Invalid refresh_token.') {
          // return await DisconnectShopee();
          let resultDisconnect = await DisconnectShopee();
          return new ServiceResponse(false, '', resultDisconnect.getData());
        }
        logger.error(data, { function: 'ShopeeService.InvalidRefeshToken' });
        return new ServiceResponse(false, '', {});
      }
    }
    return new ServiceResponse(false, '', {});
  } catch (error) {
    logger.error(error.message, { function: 'ShopeeService.refeshToken' });
    return new ServiceResponse(false, '', {});
  }
};

const removeToken = async (body = {}) => {
  try {
    let shop_id = apiHelper.getValueFromObject(body, 'shop_id');
    // let code = apiHelper.getValueFromObject(body, 'code', '');
    if (shop_id) {
        setV2(`SHOPEE_ACCESSTOKEN:${parseInt(shop_id)}`, null),
        setV2(`SHOPEE_CONFIG`, null)
      return new ServiceResponse(true, 'Xóa kết nối thành công', {});
    }
  } catch (error) {
    logger.error(error.message, { function: 'ShopeeService.RemoveTokenSite' });
    return new ServiceResponse(false, '', {});
  }
};

const checkToken = async (body = {}) => {
  try {
    let shopee_config = await get(`SHOPEE_CONFIG`);
    if (shopee_config) {
      return new ServiceResponse(true, 'Có tồn tại config', JSON.parse(`${JSON.parse(shopee_config)}`));
    } else {
      return new ServiceResponse(false, 'Không tồn tại config', {});
    }
  } catch (error) {
    logger.error(error.message, { function: 'ShopeeService.CheckTokenSite' });
    return new ServiceResponse(false, '', {});
  }
};

const updateStockShopee = async (body = {}) => {
  try {
    let shop_id = apiHelper.getValueFromObject(body, 'shop_id');
    let item_id = apiHelper.getValueFromObject(body, 'item_id');
    let total_inventory = apiHelper.getValueFromObject(body, 'total_inventory');
    let is_break = apiHelper.getValueFromObject(body, 'is_break', false);

    let token = await get(`SHOPEE_ACCESSTOKEN:${parseInt(shop_id)}`);
    let { access_token = '' } = JSON.parse(`${JSON.parse(token)}`);
    if (access_token) {
      let timestamp = timeStampZone(); //Math.floor(Date.now() / 1000);
      // Chữ kí thô
      let rawSignature = `${process.env.PARTNER_ID}/api/v2/product/update_stock${timestamp}${access_token}${shop_id}`;
      // Chữ kí hash
      let signature = crypto.createHmac('sha256', process.env.KEY_HASH_SHOPEE).update(rawSignature).digest('hex');
      let path = `${process.env.SHOPEE_URL}/api/v2/product/update_stock?shop_id=${shop_id}&access_token=${access_token}&partner_id=${process.env.PARTNER_ID}&sign=${signature}&timestamp=${timestamp}`;

      let requestBody = {
        item_id: parseInt(item_id),
        stock_list: [
          {
            model_id: 0,
            seller_stock: [
              {
                stock: parseInt(total_inventory),
              },
            ],
          },
        ],
      };
      let result = await requestPostShopee(path, requestBody);
      let { data: res } = result;
      
      if (res) {// Nếu có kết quả
        let { response = {} } = res;
        return new ServiceResponse(true, 'Cập nhật tồn kho lên sàn shopee', { is_refesh: true });
      } else {
        //Token hết hạn
        let { response } = (result || {});
        let { data, status, headers } = (response || {});
        let { message, error } = data;
        if ((error == 'error_auth' && message == 'Invalid access_token.') && !is_break) {
          await refeshToken({ ...body, _callBack: updateStockShopee })
        }else{
          logger.error(data, { function: 'ShopeeService.UpdateStockShopeeProduct' });
          return new ServiceResponse(false, '', {});
        }
      }
      
    //   if (response) {
    //     return new ServiceResponse(true, 'Cập nhật tồn kho lên sàn shopee', { is_refesh: true });
    //   } else {
    //     let { data, status, headers } = response || {};
    //     let { message = '', code_message_value = '' } = data || {};
    //     logger.error(data, { function: 'ShopeeService.UpdateStockShopeeProduct' });
    //     return new ServiceResponse(false, '', {});
    //   }
    }
  } catch (error) {
    logger.error(error.message, { function: 'ShopeeService.UpdateStockShopee' });
    return new ServiceResponse(false, '', {});
  }
};


Date.prototype.addDays = function (days) {
  // Add days to given date
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

const convertTimeStampToDateHour = (timeStamp) => {
  return moment.unix(timeStamp).format("DD/MM/YYYY HH:mm:ss");
}

const convertTimeStampToDate = (timeStamp) => {
  return moment.unix(timeStamp).format("DD/MM/YYYY");
}

const getListOrder = async (body = {}) => {
  try {
    let start_date = apiHelper.getValueFromObject(body, 'start_date');
    let end_date = apiHelper.getValueFromObject(body, 'end_date');
    let shop_id = apiHelper.getValueFromObject(body, 'shop_id');
    let itemsPerPage = apiHelper.getValueFromObject(body, 'itemsPerPage');
    let is_break = apiHelper.getValueFromObject(body, 'is_break' , false );
    // let itemsPerPage = 100;

    if (shop_id) {
      let order_status = apiHelper.getValueFromObject(body, 'order_type', 'READY_TO_SHIP');
      let page = apiHelper.getValueFromObject(body, 'page');
      let token = await get(`SHOPEE_ACCESSTOKEN:${parseInt(shop_id)}`);
      if (token == 'null') {
        return new ServiceResponse(false, 'Refesh', { is_refesh: true });
      }
      let { access_token = '' } = JSON.parse(`${JSON.parse(token)}`);

      if (access_token) { // Có tồn tại access Token trong redis
        let timestamp = timeStampZone(); //Math.floor(Date.now() / 1000);
        let offPerpage = `${(page - 1) * itemsPerPage}`;
        let time_to = end_date ? moment(moment(end_date, "DD/MM/YYYY")).endOf('day').unix() : moment().unix();
        let time_from = start_date ? moment(moment(start_date, "DD/MM/YYYY")).startOf('day').unix() : moment().subtract(15, 'd').unix();

        // Chữ kí thô
        let rawSignature = `${process.env.PARTNER_ID}/api/v2/order/get_order_list${timestamp}${access_token}${shop_id}`;
        // Chữ kí hash
        let signature = crypto.createHmac('sha256', process.env.KEY_HASH_SHOPEE).update(rawSignature).digest('hex');
        let path = `${process.env.SHOPEE_URL}/api/v2/order/get_order_list?partner_id=${process.env.PARTNER_ID}&shop_id=${shop_id}&access_token=${access_token}&sign=${signature}&timestamp=${timestamp}&page_size=${itemsPerPage}&response_optional_fields=order_status&order_status=${order_status}&cursor=${offPerpage}&time_range_field=create_time&time_from=${time_from}&time_to=${time_to}`;

        let listOrder = await requestGetShopee(path);
        let { data: res } = listOrder;
        if (res) {// Nếu có kết quả
          let { response, error } = (res || {});
          if (error == '' && response) {// Không có lỗi 

            let { order_list: order_list_id } = (response || {});
            // return new ServiceResponse(true , 'Lấy dữ liệu đơn hàng thành công' , {total : total_count , data :  ListProduct , offset : next_offset, has_next_page : has_next_page})
            if (order_list_id && order_list_id.length && order_list_id.length > 0) {

              let { total_count, next_cursor, more } = response;
              let order_sn_list = (order_list_id || []).map(i => {
                return i.order_sn;
              });
              // Lấy thông tin chi tiết của đơn hàng
              let orderDetail = await getOrderDetail({ ...body, access_token, order_sn_list });

              if (orderDetail.isFailed()) {
                return new ServiceResponse(false, `Đã xảy ra lỗi khi lấy chi tiết đơn hàng`, {});
              }
              let resultListOrder = [];
              if (order_status == 'PROCESSED') {
                // Lọc các thông tin cần thiết để hiển thị
                resultListOrder = await Promise.all((orderDetail.getData() || []).map(async (order) => {
                  let order_status = object(order.order_status || '');

                  // Lấy thông tin mã vận chuyển
                  let result = await getTrackingNumberCode({ shop_id, order_sn: (order.order_sn || '') });
                  let tracking_number = { tracking_number: '', hint: '' };
                  if (result.isFailed()) {

                  }
                  tracking_number = result.getData();
                  return {
                    order_sn: (order.order_sn || ''),
                    total_amount: (order.total_amount || 0),
                    shipping_carrier: (order.shipping_carrier || ''),
                    estimated_shipping_fee: (order.estimated_shipping_fee || 0),
                    reverse_shipping_fee: (order.reverse_shipping_fee || 0),
                    payment_method: (order.payment_method || 0),
                    region: (order.region || ''),
                    days_to_ship: (order.days_to_ship || 0),
                    order_status: (order_status.message || ''),
                    order_status_code: order.order_status,
                    ship_by_date: convertTimeStampToDate(order.ship_by_date || 0),
                    create_time: convertTimeStampToDateHour(order.create_time || 0),
                    item_list: (order.item_list || []),
                    buyer_username: (order.buyer_username || ''),
                    cancel_by: (order.cancel_by || ''),
                    tracking_number: (tracking_number)
                  };
                }));
              } else {
                // Lọc các thông tin cần thiết để hiển thị
                resultListOrder = (orderDetail.getData() || []).map(order => {
                  let order_status = object(order.order_status || '');
                  return {
                    order_sn: (order.order_sn || ''),
                    total_amount: (order.total_amount || 0),
                    shipping_carrier: (order.shipping_carrier || ''),
                    estimated_shipping_fee: (order.estimated_shipping_fee || 0),
                    reverse_shipping_fee: (order.reverse_shipping_fee || 0),
                    payment_method: (order.payment_method || 0),
                    region: (order.region || ''),
                    days_to_ship: (order.days_to_ship || 0),
                    order_status: (order_status.message || ''),
                    order_status_code: order.order_status,
                    ship_by_date: convertTimeStampToDate(order.ship_by_date || 0),
                    create_time: convertTimeStampToDateHour(order.create_time || 0),
                    item_list: (order.item_list || []),
                    buyer_username: (order.buyer_username || ''),
                    cancel_by: (order.cancel_by || ''),

                  };
                });
              }
              return new ServiceResponse(true, 'Lấy dữ liệu đơn hàng thành công', {
                total: total_count,
                data: resultListOrder,
                cursor: next_cursor,
                more: more,
              });

              // Nếu không có đơn hàng
            } else {
              return new ServiceResponse(true, 'Lấy dữ liệu đơn hàng thành công', {
                total: 0,
                data: [],
                cursor: '0',
                more: false,
              });
            }
          } else { // Nếu có lỗi và có kết quả
            let { message = 'Đã xảy ra lỗi', error = '' } = (res || {});
            logger.error(res, { function: 'ShopeeService.GetOrderShopee' });
            return new ServiceResponse(false, `${message}`, {});
          }

        } else { // Lỗi không có kết quả như là invalid token
          //Token hết hạn
          let { response } = (listOrder || {});
          let { data, status, headers } = (response || {});
          let { message, error } = data;
          if ((error == 'error_auth' && message == 'Invalid access_token.') && !is_break) {
            await refeshToken({ ...body, _callBack: getListOrder })
          }else{
            logger.error(data, { function: 'ShopeeService.InvalidErrorListOrder' });
            return new ServiceResponse(false, '', {});
          }
        }
      }
    }

  } catch (error) {
    console.log('ShopeeService.GetListOrder', error);
    logger.error(error.message, { function: 'ShopeeService.GetListOrder' });
    return new ServiceResponse(false, '', {});
  }
};

const getOrderDetail = async (params = {}) => {
  try {
    let start_date = apiHelper.getValueFromObject(params, 'start_date');
    let end_date = apiHelper.getValueFromObject(params, 'end_date');
    let shop_id = apiHelper.getValueFromObject(params, 'shop_id');
    let access_token = apiHelper.getValueFromObject(params, 'access_token');
    let order_sn_list = apiHelper.getValueFromObject(params, 'order_sn_list');
    let is_break = apiHelper.getValueFromObject(params, 'is_break' , false );

    if (access_token) {
      let code = apiHelper.getValueFromObject(params, 'code');
      let timestamp = timeStampZone(); //Math.floor(Date.now() / 1000);

      let response_optional_fields = `buyer_user_id,buyer_username,estimated_shipping_fee,shipping_carrier,total_amount,reverse_shipping_fee,payment_method,item_list,buyer_cancel_reason,cancel_reason,cancel_by,recipient_address`;
      // Chữ kí thô
      let rawSignature = `${process.env.PARTNER_ID}/api/v2/order/get_order_detail${timestamp}${access_token}${shop_id}`;
      // Chữ kí hash
      let signature = crypto.createHmac('sha256', process.env.KEY_HASH_SHOPEE).update(rawSignature).digest('hex');

      let path = `${process.env.SHOPEE_URL}/api/v2/order/get_order_detail?partner_id=${process.env.PARTNER_ID}&shop_id=${shop_id}&access_token=${access_token}&sign=${signature}&response_optional_fields=${response_optional_fields}&timestamp=${timestamp}&order_sn_list=${order_sn_list}`;
      let listOrder = await requestGetShopee(path);
      let { data: res } = listOrder;

      if (res) { // Có tồn tại data

        let { response, error } = (res || {});
        if (error == '' && response) { // Không có lỗi và có kết quả
          let { order_list = [] } = (response || {});
          return new ServiceResponse(true, '', order_list);
        } else { // Có lỗi và có kết quả
          let { message = '', code_message_value = '' } = res || {};
          logger.error(res, { function: 'ShopeeService.GetDetailOrderShopee' });
          return new ServiceResponse(false, `${message}`, {});
        }

      } else { // Có lỗi và không có kết quả phải lấy trong response như : Invali Access_Token
        //Token hết hạn
        let { response } = (listOrder || {});
        let { data, status, headers } = (response || {});
        let { message, error } = data;
        // Nếu báo Invalid Access_Token => thì sẽ gọi refesh và kèm theo callBack hàm gọi lại sau khi refesh thì sẽ gọi hàm lấy dữ liệu lại
        if ((error == 'error_auth' && message == 'Invalid access_token.') && !is_break ) {
          await refeshToken({ ...params, _callBack: getOrderDetail })
        }else{
          logger.error(data, { function: 'ShopeeService.InvalidErrorListOrder' });
          return new ServiceResponse(false, '', {});
        }
      }
    }
  } catch (error) {
    logger.error(error.message, { function: 'ShopeeService.GetListOrderDetail' });
    return new ServiceResponse(false, '', {});
  }
};

const crawlListOrderInsert = async (body = {}) => {
  let ListOrder = apiHelper.getValueFromObject(body, 'order_list', []);
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  try {
    await transaction.begin();
    const reqAccount = new sql.Request(transaction);
    const reqOrder = new sql.Request(transaction);
    const reqOrderDetail = new sql.Request(transaction);

    let shop_id = apiHelper.getValueFromObject(body, 'shop_id');

    for (let i = 0; i < ListOrder.length; i++) {
      let recipient_address = apiHelper.getValueFromObject(ListOrder[i], 'recipient_address', {});
      const resultAccount = await reqAccount
        .input('MEMBERID', null)
        .input('CUSTOMERTYPEID', null)
        .input('USERNAME', apiHelper.getValueFromObject(ListOrder[i], 'buyer_username'))
        .input('GENDER', 0)
        .input('FULLNAME', apiHelper.getValueFromObject(recipient_address, 'name'))
        .input('PHONENUMBER', apiHelper.getValueFromObject(recipient_address, 'phone'))
        .input('ADDRESS', apiHelper.getValueFromObject(recipient_address, 'full_address'))
        .input('CARINGUSER', '')
        .input('ISSYSTEM', 0)
        .input('ISACTIVE', 1)
        .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
        .input('CUSTOMERCODE', apiHelper.getValueFromObject(body, 'customer_code'))
        .input('SOURCEID', 12) // 12 LÀ SHOPEE 
        .input('SHOPEEBUYERID', apiHelper.getValueFromObject(ListOrder[i], 'buyer_user_id'))
        .execute('CRM_ACCOUNT_CreateFromShopee_AdminWeb');
      // if(resultAccount)
      const member_id = resultAccount.recordset[0].RESULT;
      if (!member_id) {
        await transaction.rollback();
        return new ServiceResponse(false, 'Tạo khách hàng từ shopee thất bại', {});
      }
      let total_money = apiHelper.getValueFromObject(ListOrder[i], 'total_amount', 0);
      let total_amount = apiHelper.getValueFromObject(ListOrder[i], 'total_amount', 0);
      let full_name = apiHelper.getValueFromObject(ListOrder[i], 'buyer_username', "");
      let total_shipping_fee = apiHelper.getValueFromObject(ListOrder[i], 'estimated_shipping_fee', 0);
      let order_sn = apiHelper.getValueFromObject(ListOrder[i], 'order_sn', 0);
      let note = apiHelper.getValueFromObject(ListOrder[i], 'note', "");
      let item_list = apiHelper.getValueFromObject(ListOrder[i], 'item_list', []);

      const resOrder = await reqOrder
        .input('MEMBERID', member_id)
        .input('TOTALMONEY', total_money)
        .input('TOTALDISCOUNT', 0)
        .input('TOTALVAT', 0)
        .input('TOTALPAID', null)
        .input('TOTALAMOUNT', total_amount) //VNPAY
        .input('SUBTOTAL', null)
        .input('DISCOUNTVALUE', null)
        .input('PAYMENTTYPE', null)
        .input('DESCRIPTION', note)
        .input('GENDER', null)
        .input('FULLNAME', full_name)
        .input('EMAIL', null)
        .input('PHONENUMBER', null)
        .input('BIRTHDAY', null)
        .input('BANKID', null)
        .input('BANKCODE', null)
        .input('SUBTOTALAPPLYDISCOUNT', null)
        .input('DISCOUNTCOUPON', null)
        .input('RECEIVEADDRESSID', null)
        .input('RECEIVESTOREID', null)
        .input('ISINVOICE', null)
        .input('INVOICETAX', null)
        .input('INVOICECOMPANYNAME', null)
        .input('INVOICEEMAIL', null)
        .input('INVOICEFULLNAME', null)
        .input('TOTALSHIPPINGFEE', total_shipping_fee)
        .input('ORDERNO', order_sn)
        .input('SHOPID', shop_id)
        .execute('SL_ORDER_CreateFromShopee_AdminWeb');

      let { order_id = null, order_no = null, ref_id = null } = resOrder.recordset[0];

      if (!order_id) {
        await transaction.rollback();
        return new ServiceResponse(true, 'Đặt hàng không thành công.', {});
      }

      for (let j = 0; j < item_list.length; j++) {
        let product_id = apiHelper.getValueFromObject(item_list[j], 'item_id', 0);
        let model_id = apiHelper.getValueFromObject(item_list[j], 'model_id', 0);


        let item_name = apiHelper.getValueFromObject(item_list[j], 'item_name', 0);
        let quantity = apiHelper.getValueFromObject(item_list[j], 'model_quantity_purchased', 0);
        let total_price = apiHelper.getValueFromObject(item_list[j], 'model_original_price', 0);
        let change_price = apiHelper.getValueFromObject(item_list[j], 'model_discounted_price', 0);

        const resOrderDetail = await reqOrderDetail
          .input('ORDERID', order_id)
          .input('PRODUCTID', model_id == 0 ? `${product_id}` : `${model_id}` )
          .input('QUANTITY', quantity)
          .input('PRICE', total_price)
          .input('TOTALPRICE', ((total_price * quantity) || 0))
          .input('TOTALAMOUNT', 0)
          .input('DISCOUNTVALUE', 0)
          .input('TOTALDISCOUNT', 0)
          .input('UNITID', null)
          .input('MEMBERID', null)
          .input('ISDISCOUNTPERCENT', null)
          .input('CHANGEPRICE', change_price) //Gia sau khuyen mai
          .input('ISCOMBO', 0)
          .input('ISPROMOTIONGIFT', false)
          .input('NOTE', null)
          .input('COMBOID', null)
          .input('REFORDERDETAILID', null)
          .execute('SL_ORDERDETAIL_CreateFromShopee_AdminWeb');

        let { RESULT: order_detail_id = 0 } = resOrderDetail.recordset[0];
        if (!order_detail_id) {
          await transaction.rollback();
          return new ServiceResponse(false, 'Lưu chi tiết đơn hàng không thành công.', {});
        }
      }
    }
    await transaction.commit();
    return new ServiceResponse(true, '', { is_success: true, });

  } catch (error) {
    await transaction.rollback();
    logger.error(error.message, { function: 'ShopeeService.InsertOrder' });
    return new ServiceResponse(true, '', {});
  }
}

// const getSignShopee = async (bodyParams = {}) => {
//     try {
//         let route = apiHelper.getValueFromObject(bodyParams, 'route', '');
//         let is_public = apiHelper.getValueFromObject(bodyParams, 'is_public', false);

//         let shopee_config = await get(`SHOPEE_CONFIG`);
//         let config = JSON.parse(`${JSON.parse(shopee_config)}`);
//         let {shop_id = 0} = config || {};
//         let token = await get(`SHOPEE_ACCESSTOKEN:${parseInt(shop_id)}`);                       
//         let {access_token = null} = JSON.parse(`${JSON.parse(token)}`);
//         let _timestamp = timeStampZone();
//         let rawSignature = '';
//         if (is_public) {
//             rawSignature = `${process.env.PARTNER_ID}/${route}${_timestamp}`;
//         } else {
//             rawSignature = `${process.env.PARTNER_ID}/${route}${_timestamp}${access_token}${shop_id}`;
//         }
//         let signature = crypto.createHmac('sha256', process.env.KEY_HASH_SHOPEE).update(rawSignature).digest('hex');
//         return new ServiceResponse(true, '', {sign: signature, shop_id, access_token, timestamp: _timestamp});
//     } catch (error) {
//         logger.error(error.message, {function: 'shopee.service.getSignShopee'});
//         return new ServiceResponse(false, '', null);
//     }
// };




const getSignShopee = async (bodyParams = {}) => {
  try {
    let route = apiHelper.getValueFromObject(bodyParams, 'route', '');
    let is_public = apiHelper.getValueFromObject(bodyParams, 'is_public', false);

    let shopee_config = await get(`SHOPEE_CONFIG`);
    let config = JSON.parse(`${JSON.parse(shopee_config)}`);
    let { shop_id = 0 } = config || {};
    let token = await get(`SHOPEE_ACCESSTOKEN:${parseInt(shop_id)}`);
    let { access_token = null } = JSON.parse(`${JSON.parse(token)}`);
    let _timestamp = timeStampZone();
    let timestamp = timeStampZone();  //Math.floor(Date.now() / 1000);
    // Chữ kí thô
    // let rawSignature = `${process.env.PARTNER_ID}/api/v2/shop/get_profile${timestamp}${access_token}${shop_id}${process.env.KEY_HASH_SHOPEE}`;
    let rawSignature = `${process.env.PARTNER_ID}/api/v2/shop/get_shop_info${timestamp}${access_token}${shop_id}`;

    // Chữ kí hash
    let signature = crypto.createHmac('sha256', process.env.KEY_HASH_SHOPEE).update(rawSignature).digest('hex');

    // let path = `${process.env.SHOPEE_URL}/api/v2/shop/get_profile?access_token=${access_token}&partner_id=${process.env.PARTNER_ID}&shop_id=${shop_id}&sign=${signature}&timestamp=${timestamp}`;
    let path = `${process.env.SHOPEE_URL}/api/v2/shop/get_shop_info?partner_id=${process.env.PARTNER_ID}&shop_id=${shop_id}&access_token=${access_token}&sign=${signature}&timestamp=${timestamp}`;

    return new ServiceResponse(true, '', { path: path });
  } catch (error) {
    logger.error(error.message, { function: 'shopee.service.getSignShopee' });
    return new ServiceResponse(false, '', null);
  }
};

const getListShopProfile = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .execute('MD_SHOPPROFILE_GetList_AdminWeb');
    const listProfile = data.recordsets[0];
    return new ServiceResponse(true, '', {
      'data': shopeeClass.list(listProfile),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(listProfile),
    });
  } catch (e) {
    logger.error(e, { function: 'orderService.getListShopProfile' });
    return new ServiceResponse(true, '', {});
  }
};



const getOptionShippingList = async (body = {}) => {
  try {
    let shop_id = apiHelper.getValueFromObject(body, 'shop_id');
    let list_current_order = apiHelper.getValueFromObject(body, 'list_current_order', []);

    if(list_current_order && list_current_order.length && list_current_order.length >0){
      let listOption = await Promise.all(
        (list_current_order || []).map(async (item) => {
          let result = await getOptionShipping({ shop_id, ...item });
          if (result.isFailed()) {
            return {
              ...item,
              info_needed: { dropoff: [], pickup: [] },
              dropoff: { branch_list: [], slug_list: [] },
              pickup: { address_list: [] }
            }
          }
          return {
            ...item,
            ...(result.getData() || {})
          }
        })
      )
      return new ServiceResponse(true, '', listOption);
    }
    return new ServiceResponse(true, '', []);
  } catch (e) {
    logger.error(e, { function: 'ShopeeService.getOptionShippingList' });
    return new ServiceResponse(true, '', {});
  }
}

const getOptionShipping = async (body = {}) => {
  try {
    let shop_id = apiHelper.getValueFromObject(body, 'shop_id');
    let order_sn = apiHelper.getValueFromObject(body, 'order_sn');
    let is_break = apiHelper.getValueFromObject(body, 'is_break' , false);

    if (shop_id) {
      let token = await get(`SHOPEE_ACCESSTOKEN:${parseInt(shop_id)}`);
      if (token == 'null') {
        return new ServiceResponse(false, 'Refesh', { is_refesh: true });
      }
      let { access_token = '' } = JSON.parse(`${JSON.parse(token)}`);

      if (access_token) { // Có tồn tại access Token trong redis
        let timestamp = timeStampZone();

        // Chữ kí thô
        let rawSignature = `${process.env.PARTNER_ID}/api/v2/logistics/get_shipping_parameter${timestamp}${access_token}${shop_id}`;
        // Chữ kí hash
        let signature = crypto.createHmac('sha256', process.env.KEY_HASH_SHOPEE).update(rawSignature).digest('hex');
        let path = `${process.env.SHOPEE_URL}/api/v2/logistics/get_shipping_parameter?partner_id=${process.env.PARTNER_ID}&shop_id=${shop_id}&access_token=${access_token}&sign=${signature}&timestamp=${timestamp}&order_sn=${order_sn}`;

        let listOrder = await requestGetShopee(path);
        let { data: res } = listOrder;

        if (res) {// Nếu có kết quả
          let { response, error } = (res || {});
          if (error == '' && response) {// Không có lỗi 
            return new ServiceResponse(true, '', response);
          } else { // Nếu có lỗi và có kết quả
            let { message = 'Đã xảy ra lỗi', error = '' } = (res || {});
            logger.error(res, { function: 'ShopeeService.getOptionShippingShopee' });
            return new ServiceResponse(false, `${message}`, {});
          }
        } else { // Lỗi không có kết quả như là invalid token
          //Token hết hạn
          let { response } = (listOrder || {});
          let { data, status, headers } = (response || {});
          let { message, error } = data;
          if ((error == 'error_auth' && message == 'Invalid access_token.') && !is_break ) {
            await refeshToken({ ...body, _callBack: getOptionShipping })
          }else{
            logger.error(data, { function: 'ShopeeService.getOptionShipping' });
            return new ServiceResponse(false, '', {});
          }
        }
      }
    }
  } catch (e) {
    logger.error(e, { function: 'ShopeeService.getOptionShipping' });
    return new ServiceResponse(true, '', {});
  }
}

const shipOrder = async (body = {}) => {
  try {
    let shop_id = apiHelper.getValueFromObject(body, 'shop_id');
    let list_order = apiHelper.getValueFromObject(body, 'list_order');
    let listOrderConfirm = await Promise.all(
      (Object.values(list_order) || []).map(async (item) => {
        let result = await shipOrderSingle({ ...item, shop_id: shop_id });
        if (result.isSuccess()) {
          return {
            order_sn: item.order_sn,
            is_pass: true,
          }
        } else {
          return {
            order_sn: item.order_sn,
            is_pass: false,
          }
        }
      })
    )
    return new ServiceResponse(true, 'Cập nhật đơn hàng thành công', { listOrderConfirm });
  } catch (e) {
    logger.error(e, { function: 'ShopeeService.shipOrder' });
    return new ServiceResponse(false, '', {});
  }
}

const shipOrderSingle = async (body = {}) => {
  try {
    let shop_id = apiHelper.getValueFromObject(body, 'shop_id');
    let order_sn = apiHelper.getValueFromObject(body, 'order_sn');
    let pickup = apiHelper.getValueFromObject(body, 'pick_up');
    let is_break = apiHelper.getValueFromObject(body, 'is_break', false);
    if (shop_id) {
      let token = await get(`SHOPEE_ACCESSTOKEN:${parseInt(shop_id)}`);
      if (token == 'null') {
        return new ServiceResponse(false, 'Refesh', { is_refesh: true });
      }
      let { access_token = '' } = JSON.parse(`${JSON.parse(token)}`);

      if (access_token) { // Có tồn tại access Token trong redis
        let timestamp = timeStampZone();

        // Chữ kí thô
        let rawSignature = `${process.env.PARTNER_ID}/api/v2/logistics/ship_order${timestamp}${access_token}${shop_id}`;
        // Chữ kí hash
        let signature = crypto.createHmac('sha256', process.env.KEY_HASH_SHOPEE).update(rawSignature).digest('hex');
        let path = `${process.env.SHOPEE_URL}/api/v2/logistics/ship_order?partner_id=${process.env.PARTNER_ID}&shop_id=${shop_id}&access_token=${access_token}&sign=${signature}&timestamp=${timestamp}`;

        let params = {
          order_sn: order_sn,
          pickup: pickup
        }
        let ship_order = await requestPostShopee(path, params);
        let { data: res } = ship_order;

        if (res) {// Nếu có kết quả
          let { response, error } = (res || {});
          if (error == '') {// Không có lỗi 
            return new ServiceResponse(true, 'Nhận đơn thành công', {});
          } else { // Nếu có lỗi và có kết quả
            let { message = 'Đã xảy ra lỗi', error = '' } = (res || {});
            logger.error(res, { function: 'ShopeeService.shipOrderSingleShopee' });
            return new ServiceResponse(false, `${message}`, {});
          }
        } else { // Lỗi không có kết quả như là invalid token
          //Token hết hạn
          let { response } = (ship_order || {});
          let { data, status, headers } = (response || {});
          let { message, error } = data;
          if ((error == 'error_auth' && message == 'Invalid access_token.') && !is_break ) {
            await refeshToken({ ...body, _callBack: shipOrderSingle })
          }else{
            logger.error(data, { function: 'ShopeeService.shipOrderSingle_Shopee' });
            return new ServiceResponse(false, '', {});
          }
        }
      }
    }
  } catch (e) {
    logger.error(e, { function: 'ShopeeService.shipOrderSingle' });
    return new ServiceResponse(false, '', {});
  }
}

const getTrackingNumberCode = async (body = {}) => {
  try {
    let shop_id = apiHelper.getValueFromObject(body, 'shop_id');
    let order_sn = apiHelper.getValueFromObject(body, 'order_sn');
    let is_break = apiHelper.getValueFromObject(body, 'is_break', false);
    if (shop_id) {
      let token = await get(`SHOPEE_ACCESSTOKEN:${parseInt(shop_id)}`);
      if (token == 'null') {
        return new ServiceResponse(false, 'Refesh', { is_refesh: true });
      }
      let { access_token = '' } = JSON.parse(`${JSON.parse(token)}`);

      if (access_token) { // Có tồn tại access Token trong redis
        let timestamp = timeStampZone();

        // Chữ kí thô
        let rawSignature = `${process.env.PARTNER_ID}/api/v2/logistics/get_tracking_number${timestamp}${access_token}${shop_id}`;
        // Chữ kí hash
        let signature = crypto.createHmac('sha256', process.env.KEY_HASH_SHOPEE).update(rawSignature).digest('hex');
        let path = `${process.env.SHOPEE_URL}/api/v2/logistics/get_tracking_number?partner_id=${process.env.PARTNER_ID}&shop_id=${shop_id}&access_token=${access_token}&sign=${signature}&timestamp=${timestamp}&order_sn=${order_sn}`;

        let tracking_number = await requestGetShopee(path);
        let { data: res } = tracking_number;

        if (res) {// Nếu có kết quả
          let { response, error } = (res || {});
          if (error == '' && response) {// Không có lỗi 
            return new ServiceResponse(true, '', response);
          } else { // Nếu có lỗi và có kết quả
            let { message = 'Đã xảy ra lỗi', error = '' } = (res || {});
            logger.error(res, { function: 'ShopeeService.getTrackingNumberCodeShopee' });
            return new ServiceResponse(false, `${message}`, {});
          }
        } else { // Lỗi không có kết quả như là invalid token
          //Token hết hạn
          let { response } = (tracking_number || {});
          let { data, status, headers } = (response || {});
          let { message, error } = data;
          if ((error == 'error_auth' && message == 'Invalid access_token.') && !is_break) {
            await refeshToken({ ...body, _callBack: getTrackingNumberCode })
          }else{
            logger.error(data, { function: 'ShopeeService.getTrackingNumberCode' });
            return new ServiceResponse(false, '', {});
          }
        }
      }
    }
  } catch (e) {
    logger.error(e, { function: 'ShopeeService.getTrackingNumberCode' });
    return new ServiceResponse(true, '', {});
  }
}

const getDocumentShipResult = async (body = {}) => {
  try {
    let shop_id = apiHelper.getValueFromObject(body, 'shop_id');
    let order_list = apiHelper.getValueFromObject(body, 'order_list');
    let is_break = apiHelper.getValueFromObject(body, 'is_break');
    if (shop_id) {
      let token = await get(`SHOPEE_ACCESSTOKEN:${parseInt(shop_id)}`);
      if (token == 'null') {
        return new ServiceResponse(false, 'Refesh', { is_refesh: true });
      }
      let { access_token = '' } = JSON.parse(`${JSON.parse(token)}`);

      if (access_token) { // Có tồn tại access Token trong redis
        let timestamp = timeStampZone();

        // Chữ kí thô
        let rawSignature = `${process.env.PARTNER_ID}/api/v2/logistics/get_shipping_document_result${timestamp}${access_token}${shop_id}`;
        // Chữ kí hash
        let signature = crypto.createHmac('sha256', process.env.KEY_HASH_SHOPEE).update(rawSignature).digest('hex');
        let path = `${process.env.SHOPEE_URL}/api/v2/logistics/get_shipping_document_result?partner_id=${process.env.PARTNER_ID}&shop_id=${shop_id}&access_token=${access_token}&sign=${signature}&timestamp=${timestamp}`;

        let param = {
          order_list: order_list
        }

        let list_shipping_document = await requestPostShopee(path, param);
        let { data: res } = list_shipping_document;

        if (res) {// Nếu có kết quả
          let { response, error } = (res || {});
          if (error == '' && response) {// Không có lỗi 
            return new ServiceResponse(true, '', response);
          } else { // Nếu có lỗi và có kết quả
            let { message = 'Đã xảy ra lỗi', error = '' } = (res || {});
            logger.error(res, { function: 'ShopeeService.getDocumentShipResultShopee' });
            return new ServiceResponse(false, `${message}`, {});
          }
        } else { // Lỗi không có kết quả như là invalid token
          //Token hết hạn
          let { response } = (list_shipping_document || {});
          let { data, status, headers } = (response || {});
          let { message, error } = data;
          if ((error == 'error_auth' && message == 'Invalid access_token.') && !is_break) {
            await refeshToken({ ...body, _callBack: shipOrder })
          }else{
            logger.error(data, { function: 'ShopeeService.getDocumentShipResultget' });
            return new ServiceResponse(false, '', {});
          }
        }
      }
    }
  } catch (e) {
    logger.error(e, { function: 'ShopeeService.getDocumentShipResult' });
    return new ServiceResponse(true, '', {});
  }
}

const cancelOrder = async (body = {}) => {
  try {
    let shop_id = apiHelper.getValueFromObject(body, 'shop_id');
    // Lấy thông tin đơn hàng
    let order = apiHelper.getValueFromObject(body, 'order_sn');
    let order_cancel = apiHelper.getValueFromObject(body, 'orderCancel');
    // lấy danh sách item không tồn kho sẽ có thuộc tính là is_out_stock = true
    let item_list_raw = apiHelper.getValueFromObject(order_cancel, 'item_list');
    let is_break = apiHelper.getValueFromObject(body, 'is_break' , false);


    // lọc ra sản phẩm bị đánh dấu hết hàng bởi user params để gửi sang shopee
    let item_list = (item_list_raw || []).filter((item, index) => {
      if (item.is_out_stock == true) {
        return {
          item
        }
      }
    })

    let order_sn = apiHelper.getValueFromObject(order_cancel, 'order_sn');

    if (shop_id) {
      let token = await get(`SHOPEE_ACCESSTOKEN:${parseInt(shop_id)}`);
      if (token == 'null') {
        return new ServiceResponse(false, 'Refesh', { is_refesh: true });
      }
      let { access_token = '' } = JSON.parse(`${JSON.parse(token)}`);

      if (access_token) { // Có tồn tại access Token trong redis
        let timestamp = timeStampZone();

        // Chữ kí thô
        let rawSignature = `${process.env.PARTNER_ID}/api/v2/order/cancel_order${timestamp}${access_token}${shop_id}`;
        // Chữ kí hash
        let signature = crypto.createHmac('sha256', process.env.KEY_HASH_SHOPEE).update(rawSignature).digest('hex');
        let path = `${process.env.SHOPEE_URL}/api/v2/order/cancel_order?partner_id=${process.env.PARTNER_ID}&shop_id=${shop_id}&access_token=${access_token}&sign=${signature}&timestamp=${timestamp}`;

        let params = {
          order_sn: order_sn,
          cancel_reason: 'OUT_OF_STOCK',
          item_list: item_list
        }

        let ship_order = await requestPostShopee(path, params);
        let { data: res } = ship_order;

        if (res) {// Nếu có kết quả
          let { response, error } = (res || {});
          if (error == '' && response) {// Không có lỗi 
            return new ServiceResponse(true, 'Hủy đơn thành công', {});
          } else { // Nếu có lỗi và có kết quả
            let { message = 'Đã xảy ra lỗi', error = '' } = (res || {});
            logger.error(res, { function: 'ShopeeService.cancelOrderShopee' });
            return new ServiceResponse(false, `${message}`, {});
          }
        } else { // Lỗi không có kết quả như là invalid token
          //Token hết hạn
          let { response } = (ship_order || {});
          let { data, status, headers } = (response || {});
          let { message, error } = data;
          if ((error == 'error_auth' && message == 'Invalid access_token.') && !is_break ) {
            await refeshToken({ ...body, _callBack: cancelOrder })
          }else{
            logger.error(data, { function: 'ShopeeService.cancelOrder_Shopee' });
            return new ServiceResponse(false, '', {});
          }
        }
      }
    }
  } catch (e) {
    logger.error(e, { function: 'ShopeeService.cancelOrder' });
    return new ServiceResponse(false, '', {});
  }
}

const shippingDocument = async (body = {}) => {
  try {
    let shop_id = apiHelper.getValueFromObject(body, 'shop_id');
    let order_list_raw = apiHelper.getValueFromObject(body, 'order_list');
    let is_break = apiHelper.getValueFromObject(body, 'is_break', false);

    let order_list = (order_list_raw || []).map(item => {
      return {
        order_sn: (item.order_sn || ''),
        ...item.tracking_number,
      }
    })
    if (shop_id) {
      let token = await get(`SHOPEE_ACCESSTOKEN:${parseInt(shop_id)}`);
      if (token == 'null') {
        return new ServiceResponse(false, 'Refesh', { is_refesh: true });
      }
      let { access_token = '' } = JSON.parse(`${JSON.parse(token)}`);

      if (access_token) { // Có tồn tại access Token trong redis
        let timestamp = timeStampZone();

        // Chữ kí thô
        let rawSignature = `${process.env.PARTNER_ID}/api/v2/logistics/create_shipping_document${timestamp}${access_token}${shop_id}`;
        // Chữ kí hash
        let signature = crypto.createHmac('sha256', process.env.KEY_HASH_SHOPEE).update(rawSignature).digest('hex');
        let path = `${process.env.SHOPEE_URL}/api/v2/logistics/create_shipping_document?partner_id=${process.env.PARTNER_ID}&shop_id=${shop_id}&access_token=${access_token}&sign=${signature}&timestamp=${timestamp}`;

        let params = {
          order_list: order_list
        }

        let createShippingDocument = await requestPostShopee(path, params);
        let { data: res } = createShippingDocument;

        if (res) {// Nếu có kết quả
          let { response, error } = (res || {});
          if (error == '' && response) {// Không có lỗi 
            return new ServiceResponse(true, '', response);
          } else { // Nếu có lỗi và có kết quả
            let { message = 'Đã xảy ra lỗi', error = '' } = (res || {});
            logger.error(res, { function: 'ShopeeService.createShippingDocument' });
            return new ServiceResponse(false, `${message}`, {});
          }
        } else { // Lỗi không có kết quả như là invalid token
          //Token hết hạn
          let { response } = (createShippingDocument || {});
          let { data, status, headers } = (response || {});
          let { message, error } = data;
          if ((error == 'error_auth' && message == 'Invalid access_token.')&& !is_break) {
            await refeshToken({ ...body, _callBack: shippingDocument })
          }else{
            logger.error(data, { function: 'ShopeeService.ShippingDocument_Shopee' });
            return new ServiceResponse(false, '', {});
          }
        }
      }
    }
  } catch (e) {
    logger.error(e, { function: 'ShopeeService.createShippingDocument' });
    return new ServiceResponse(false, '', {});
  }
}

const getResultShippingDocument = async (body = {}) => {
  try {
    let shop_id = apiHelper.getValueFromObject(body, 'shop_id');
    let order_list_raw = apiHelper.getValueFromObject(body, 'order_list');
    let is_break = apiHelper.getValueFromObject(body, 'is_break', false);

    let order_list = (order_list_raw || []).map(item => {
      return {
        order_sn: (item.order_sn || ''),
        ...item.tracking_number,
      }
    })

    if (shop_id) {
      let token = await get(`SHOPEE_ACCESSTOKEN:${parseInt(shop_id)}`);
      if (token == 'null') {
        return new ServiceResponse(false, 'Refesh', { is_refesh: true });
      }
      let { access_token = '' } = JSON.parse(`${JSON.parse(token)}`);

      if (access_token) { // Có tồn tại access Token trong redis
        let timestamp = timeStampZone();

        // Chữ kí thô
        let rawSignature = `${process.env.PARTNER_ID}/api/v2/logistics/get_shipping_document_result${timestamp}${access_token}${shop_id}`;
        // Chữ kí hash
        let signature = crypto.createHmac('sha256', process.env.KEY_HASH_SHOPEE).update(rawSignature).digest('hex');
        let path = `${process.env.SHOPEE_URL}/api/v2/logistics/get_shipping_document_result?partner_id=${process.env.PARTNER_ID}&shop_id=${shop_id}&access_token=${access_token}&sign=${signature}&timestamp=${timestamp}`;

        let params = {
          order_list: order_list
        }


        let getResultShipping = await requestPostShopee(path, params);
        let { data: res } = getResultShipping;

        if (res) {// Nếu có kết quả
          let { response, error } = (res || {});
          if (error == '' && response) {// Không có lỗi 
            return new ServiceResponse(true, '', response);
          } else { // Nếu có lỗi và có kết quả
            let { message = 'Đã xảy ra lỗi', error = '' } = (res || {});
            logger.error(res, { function: 'ShopeeService.getResultShippingDocument' });
            return new ServiceResponse(false, `${message}`, {});
          }
        } else { // Lỗi không có kết quả như là invalid token
          //Token hết hạn
          let { response } = (getResultShipping || {});
          let { data, status, headers } = (response || {});
          let { message, error } = data;
          if ((error == 'error_auth' && message == 'Invalid access_token.') && !is_break) {
            await refeshToken({ ...body, _callBack: getResultShippingDocument })
          }else{
            logger.error(data, { function: 'ShopeeService.getResultShippingDocument_Shopee' });
            return new ServiceResponse(false, '', {});
          }
        }
      }
    }
  } catch (e) {
    logger.error(e, { function: 'ShopeeService.getResultShippingDocument' });
    return new ServiceResponse(true, '', {});
  }
}

const getWaybill = async (body = {}) => {
  try {
    let shop_id = apiHelper.getValueFromObject(body, 'shop_id');
    let order_list_raw = apiHelper.getValueFromObject(body, 'order_list');

    let order_list_name = (order_list_raw || []).map(item => {
      return item.order_sn
    }).join("_");

    if (order_list_raw && order_list_raw.length > 0) {
      let listBufferWayBill = await Promise.all(
        (order_list_raw || []).map(async (item) => {
          let result = await getWaybillSingle({ order_list: [item], shop_id: shop_id });
          if (result.isSuccess()) {
            return result.getData()
          }
        })
      )

      let fileName = `${moment().format('DDMMYYYY')}_${order_list_name}`;
      await combinePDFBuffers(listBufferWayBill, `storage/pdf/${fileName}.pdf`)
      // await writeFile(`storage/pdf/${fileName}.pdf`, listBufferWayBill);
      return new ServiceResponse(true, '', { path: `pdf/${fileName}.pdf` });
    }

  } catch (e) {
    logger.error(e, { function: 'ShopeeService.getWaybill' });
    return new ServiceResponse(true, '', {});
  }
}

const combinePDFBuffers = async (listBufferWayBill, path) => {
  try {
    const mergedPdf = await PDFDocument.create();
    for (let document of listBufferWayBill) {
      document = await PDFDocument.load(document);

      const copiedPages = await mergedPdf.copyPages(document, document.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    return fs.writeFileSync(`${path}`, await mergedPdf.save());
    // const firstPDFStream = await PDFDocument.load(listBufferWayBill[0]);


    // const letters = await PDFDocument.load(listBufferWayBill[1]);
    // const pagesArray = await letters.copyPages(firstPDFStream, firstPDFStream.getPageIndices());

    // for (const page of pagesArray) {
    //   letters.addPage(page);
    // }

    // let buffer = await letters.save()
    // fs.writeFileSync(`${path}`, await letters.save());

  }
  catch (e) {
    console.log(e);
    throw new Error('Error during PDF combination: ' + e.message);
  }
};

// const combinePDFBuffers = (listBufferWayBill) => {
// 	var outStream = new memoryStreams.WritableStream();
// 	try {
// 		let firstPDFStream = new hummus.PDFRStreamForBuffer(listBufferWayBill[0]);
// 		var pdfWriter = hummus.createWriterToModify(firstPDFStream, new hummus.PDFStreamForResponse(outStream));
// 		for (let i = 1; i < listBufferWayBill.length; i++) {
// 			var secondPDFStream = new hummus.PDFRStreamForBuffer(listBufferWayBill[i]);
// 			pdfWriter.appendPDFPagesFromPDF(secondPDFStream);
// 		}
// 		pdfWriter.end();
// 		var newBuffer = outStream.toBuffer();
// 		outStream.end();
// 		// var firstPDFStream = new hummus.PDFRStreamForBuffer(listBufferWayBill[0]);
// 		// // var secondPDFStream = new hummus.PDFRStreamForBuffer(listBufferWayBill[1]);

// 		// var pdfWriter = hummus.createWriterToModify(firstPDFStream, new hummus.PDFStreamForResponse(outStream));
// 		// pdfWriter.appendPDFPagesFromPDF(secondPDFStream);
// 		// pdfWriter.end();
// 		// var newBuffer = outStream.toBuffer();
// 		// outStream.end();

// 		return newBuffer;
// 	}
// 	catch (e) {
// 		outStream.end();
// 		throw new Error('Error during PDF combination: ' + e.message);
// 	}
// };
const getWaybillSingle = async (body = {}) => {
  try {
    let shop_id = apiHelper.getValueFromObject(body, 'shop_id');
    let order_list_raw = apiHelper.getValueFromObject(body, 'order_list');
    let is_break = apiHelper.getValueFromObject(body, 'is_break' , false);
    let order_list = (order_list_raw || []).map(item => {
      return {
        order_sn: (item.order_sn || ''),
      }
    })

    if (shop_id) {
      let token = await get(`SHOPEE_ACCESSTOKEN:${parseInt(shop_id)}`);
      if (token == 'null') {
        return new ServiceResponse(false, 'Refesh', { is_refesh: true });
      }
      let { access_token = '' } = JSON.parse(`${JSON.parse(token)}`);

      if (access_token) { // Có tồn tại access Token trong redis
        let timestamp = timeStampZone();

        // Chữ kí thô
        let rawSignature = `${process.env.PARTNER_ID}/api/v2/logistics/download_shipping_document${timestamp}${access_token}${shop_id}`;
        // Chữ kí hash
        let signature = crypto.createHmac('sha256', process.env.KEY_HASH_SHOPEE).update(rawSignature).digest('hex');
        let path = `${process.env.SHOPEE_URL}/api/v2/logistics/download_shipping_document?partner_id=${process.env.PARTNER_ID}&shop_id=${shop_id}&access_token=${access_token}&sign=${signature}&timestamp=${timestamp}`;

        let params = {
          shipping_document_type: 'NORMAL_AIR_WAYBILL',
          order_list: order_list
        }
        let config = {
          responseType: 'arraybuffer',
          responseEncoding: 'binary',
        };
        let wayBill = await requestPostShopee(path, params, config);
        let { data: res } = wayBill;
        if (res) {// Nếu có kết quả
          let { message = '', error = '' } = (res || {});
          if (!error) {// Không có lỗi 

            let buf = Buffer.from(res, 'base64');
            // let fileName = `${moment().format('DDMMYYYY')}_12341243`;
            // await writeFile(`storage/pdf/${fileName}.pdf`, buf);
            return new ServiceResponse(true, '', buf);

          } else { // Nếu có lỗi và có kết quả
            let { message = '', error = '' } = (res || {});
            logger.error(error, { function: 'ShopeeService.getWaybill' });
            return new ServiceResponse(false, `${message}`, {});
          }
        } else { // Lỗi không có kết quả như là invalid token
          //Token hết hạn
          let { response } = (wayBill || {});
          let { data, status, headers } = (response || {});
          let { message, error } = data;
          if ((error == 'error_auth' && message == 'Invalid access_token.') && !is_break  ) {
            await refeshToken({ ...body, _callBack: getWaybillSingle })
          }else{
            logger.error(error, { function: 'ShopeeService.getWaybill_Shopee' });
            return new ServiceResponse(false, '', {});
          }
        }
      }
    }
  } catch (e) {
    logger.error(e, { function: 'ShopeeService.getWaybill' });
    return new ServiceResponse(true, '', {});
  }
}

const getListShippingDocumentParamater = async (body = {}) => {
  try {
    let shop_id = apiHelper.getValueFromObject(body, 'shop_id');
    let order_list_raw = apiHelper.getValueFromObject(body, 'order_list');
    let is_break = apiHelper.getValueFromObject(body, 'is_break');

    let order_list = (order_list_raw || []).map(item => {
      return {
        order_sn: (item.order_sn || ''),
        ...item.tracking_number,
      }
    })

    if (shop_id) {
      let token = await get(`SHOPEE_ACCESSTOKEN:${parseInt(shop_id)}`);
      if (token == 'null') {
        return new ServiceResponse(false, 'Refesh', { is_refesh: true });
      }
      let { access_token = '' } = JSON.parse(`${JSON.parse(token)}`);

      if (access_token) { // Có tồn tại access Token trong redis
        let timestamp = timeStampZone();

        // Chữ kí thô
        let rawSignature = `${process.env.PARTNER_ID}/api/v2/logistics/get_shipping_document_parameter${timestamp}${access_token}${shop_id}`;
        // Chữ kí hash
        let signature = crypto.createHmac('sha256', process.env.KEY_HASH_SHOPEE).update(rawSignature).digest('hex');
        let path = `${process.env.SHOPEE_URL}/api/v2/logistics/get_shipping_document_parameter?partner_id=${process.env.PARTNER_ID}&shop_id=${shop_id}&access_token=${access_token}&sign=${signature}&timestamp=${timestamp}`;

        let params = {
          order_list: order_list
        }

        let createShippingDocument = await requestPostShopee(path, params);
        let { data: res } = createShippingDocument;

        if (res) {// Nếu có kết quả
          let { response, error } = (res || {});
          if (error == '' && response) {// Không có lỗi 
            return new ServiceResponse(true, '', response);
          } else { // Nếu có lỗi và có kết quả
            let { message = 'Đã xảy ra lỗi', error = '' } = (res || {});
            logger.error(res, { function: 'ShopeeService.getListShippingDocumentParamater' });
            return new ServiceResponse(false, `${message}`, {});
          }
        } else { // Lỗi không có kết quả như là invalid token
          //Token hết hạn
          let { response } = (createShippingDocument || {});
          let { data, status, headers } = (response || {});
          let { message, error } = data;
          if ((error == 'error_auth' && message == 'Invalid access_token.') && !is_break ) {
            await refeshToken({ ...body, _callBack: getListShippingDocumentParamater })
          }else{
            logger.error(data, { function: 'ShopeeService.getListShippingDocumentParamater_Shopee' });
            return new ServiceResponse(false, '', {});
          }
        }
      }
    }
  } catch (e) {
    logger.error(e, { function: 'ShopeeService.getListShippingDocumentParamater' });
    return new ServiceResponse(true, '', {});
  }
}

const writeFile = (path, data) =>
  new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })

const getPushShopee = async (body = {}) => {
  try {
    let shop_id = apiHelper.getValueFromObject(body, 'shop_id');
    let data = apiHelper.getValueFromObject(body, 'data');

    let order_sn = apiHelper.getValueFromObject(data, 'ordersn');

    let token = await get(`SHOPEE_ACCESSTOKEN:${parseInt(shop_id)}`);
    if (token == 'null') {
      return new ServiceResponse(false, 'Refesh', { is_refesh: true });
    }
    let { access_token = '' } = JSON.parse(`${JSON.parse(token)}`);
    if (access_token) {
      // Lấy thông tin chi tiết của đơn hàng
      let orderDetail = await getOrderDetail({ ...body, access_token, order_sn_list: [`${order_sn}`] });
      if (orderDetail.isFailed()) {
        // failed nhưng sẽ trả về true để return về code 200 cho shopee
        return new ServiceResponse(true, `Đã xảy ra lỗi khi lấy chi tiết đơn hàng`, {});
      }
      return new ServiceResponse(true, `Lấy chi tiết đơn hàng từ push`, { order_list: orderDetail.getData() });
    }
    return new ServiceResponse(true, '', {});
  } catch (e) {
    logger.error(e, { function: 'ShopeeService.getWaybill' });
    return new ServiceResponse(false, '', {});
  }
}

const updateOrderStatus = async (body = {}) => {
  try {
    let query = apiHelper.getValueFromObject(body, 'data');
    let status = apiHelper.getValueFromObject(query, 'status');
    let ordersn = apiHelper.getValueFromObject(query, 'ordersn');
    const pool = await mssql.pool;
    await pool.request()
      .input('KEY', status)
      .input('ORDERSN', ordersn)
      .execute('SL_ORDER_UpdateCodeShopee_AdminWeb');
    return new ServiceResponse(true, '', {});

  } catch (e) {
    logger.error(e, { function: 'ShopeeService.UpdateStatus' });
    return new ServiceResponse(false, '', {});
  }
}

const detailGenCustomerCode = async () => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request().execute('CRM_ACCOUNT_GenCustomerCodeShopee');
    const Account = data.recordset[0];
    if (Account) {
      return new ServiceResponse(true, '', shopeeClass.genCustomerCode(Account));
    }
    return new ServiceResponse(false, '', null);
  } catch (e) {
    logger.error(e, {
      function: 'ShopeeService.detailGenCustomerCode',
    });

    return new ServiceResponse(false, e.message);
  }
};

const getOptsStocks = async (queryParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('ISACTIVE', 1)
      .input('ORDERID', null)
      .input('STOCKOUTPUTTYPE', 1)
      .execute("ST_STOCKSOUTREQUEST_GetStocks_AdminWeb");
    return new ServiceResponse(true, '', data.recordset && data.recordset.length ? shopeeClass.option(data.recordset) : [])
  } catch (e) {
    logger.error(e, { 'function': 'ShopeeService.getOptsStocks' });
    return new ServiceResponse(true, '', []);
  }
}

const updateStocks = async (body = {}) => {
  try {
    let shop_id = apiHelper.getValueFromObject(body, 'shop_id');
    let stock = apiHelper.getValueFromObject(body, 'stock');
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('STOCKID', apiHelper.getValueFromObject(stock, 'id'))
      .input('SHOPID', shop_id)
      .execute("MD_SHOPPROFILE_UpdateStock_AdminWeb");
    return new ServiceResponse(true, 'Cập nhật thành công', {})
  } catch (e) {
    logger.error(e, { 'function': 'ShopeeService.updateStocksID' });
    return new ServiceResponse(false, '', []);
  }
}

// Hàm dùng để đồng bộ ID sản phẩm shopee với sản phẩm ở portal
const updateProductIDShopee = async (body = {}) => {
  try {
    let product = apiHelper.getValueFromObject(body, 'product');
    let shop_id = apiHelper.getValueFromObject(body, 'shop_id');
    let product_shopee = apiHelper.getValueFromObject(body, 'product_shopee');
    
    // let product_id = apiHelper.getValueFromObject(product, 'product_id');
    let product_id_shopee = apiHelper.getValueFromObject(product_shopee, 'item_id');
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PRODUCTID', product)
      .input('PRODUCTSHOPEEID', `${product_id_shopee}`)
      .input('SHOPID', shop_id)
      .execute("MD_SHOPPROFILE_UpdateProductID_AdminWeb");

      const dataRecord = data && data.recordset && data.recordset.length > 0 ? data.recordset[0] : [] ;
      let result = shopeeClass.detailProduct(dataRecord);

    return new ServiceResponse(true, 'Cập nhật thành công', {...result})
  } catch (e) {
    logger.error(e, { 'function': 'ShopeeService.updateProductShopeeID' });
    return new ServiceResponse(false, '', []);
  }
}

const getProductOptions = async (queryParams = {}) => {
  let keyword = apiHelper.getValueFromObject(queryParams, 'keyword', '');
  const currentPage = apiHelper.getCurrentPage(queryParams);
  const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
    .input('KEYWORD', keyword ? keyword.trim() : '')
    .input('PAGESIZE', itemsPerPage)
    .input('PAGEINDEX', currentPage)
    .execute('MD_PRODUCT_GetOptionProduct_AdminWeb');

    const dataRecord = data.recordset;
    return new ServiceResponse(true, '', shopeeClass.productOptions(dataRecord));
  } catch (e) {
    logger.error(e, { 'function': 'RpRevenueOverall.getListOptionsCategory' });

    return new ServiceResponse(true, '', {});
  }
};

// Hàm dùng để đồng bộ ID sản phẩm shopee với sản phẩm ở portal
const deleteIDShopee = async (body = {}) => {
  try {
    let infor = apiHelper.getValueFromObject(body, 'product');
    let shop_id = apiHelper.getValueFromObject(body, 'shop_id');
    let product = apiHelper.getValueFromObject(infor, 'product_portal');

    let product_id_lazada = apiHelper.getValueFromObject(infor, 'item_id');
    let product_id = apiHelper.getValueFromObject(product, 'product_id');
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PRODUCTID', product_id)
      .input('PRODUCTLAZADAID', `${product_id_lazada}`)
      .input('SHOPID', shop_id)
      .input('KEY', 'SHOPEE')
      .execute("MD_SHOPPROFILE_DeleteProductID_AdminWeb");
    return new ServiceResponse(true, 'Xóa đồng bộ thành công', {})
  } catch (e) {
    logger.error(e, { 'function': 'ShopeeService.deleteIDShopee' });
    return new ServiceResponse(false, '', []);
  }
}

const getModelList = async (body = {})=>{
  try{
    let shop_id = apiHelper.getValueFromObject(body, 'shop_id');
    let is_break = apiHelper.getValueFromObject(body, 'is_break' , false );
    let item_id = apiHelper.getValueFromObject(body, 'item_id');

    if (shop_id) {
      let token = await get(`SHOPEE_ACCESSTOKEN:${parseInt(shop_id)}`);
      if (token == 'null') {
        return new ServiceResponse(false, 'Refesh', { is_refesh: true });
      }
      let { access_token = '' } = JSON.parse(`${JSON.parse(token)}`);

      if (access_token) { // Có tồn tại access Token trong redis
        let timestamp = timeStampZone();

        // Chữ kí thô
        let rawSignature = `${process.env.PARTNER_ID}/api/v2/product/get_model_list${timestamp}${access_token}${shop_id}`;
        // Chữ kí hash
        let signature = crypto.createHmac('sha256', process.env.KEY_HASH_SHOPEE).update(rawSignature).digest('hex');
        let path = `${process.env.SHOPEE_URL}/api/v2/product/get_model_list?partner_id=${process.env.PARTNER_ID}&shop_id=${shop_id}&access_token=${access_token}&sign=${signature}&timestamp=${timestamp}&item_id=${item_id}`;

        let resultgetModelList = await requestGetShopee(path);
        let { data: res } = resultgetModelList;
        if (res) {// Nếu có kết quả
          let { response, error } = (res || {});
          if (error == '' && response) {// Không có lỗi 
            return new ServiceResponse(true, '', response);
          } else { // Nếu có lỗi và có kết quả
            let { message = 'Đã xảy ra lỗi', error = '' } = (res || {});
            logger.error(res, { function: 'ShopeeService.getModelList' });
            return new ServiceResponse(false, `${message}`, {});
          }
        } else { // Lỗi không có kết quả như là invalid token
          //Token hết hạn
          let { response } = (resultgetModelList || {});
          let { data, status, headers } = (response || {});
          let { message, error } = data;
          if ((error == 'error_auth' && message == 'Invalid access_token.') && !is_break) {
            await refeshToken({ ...body, _callBack: getModelList })
          }else{
            logger.error(data, { function: 'ShopeeService.getModelList_Shopee' });
            return new ServiceResponse(false, '', {});
          }
        }
      }
    }


  }catch(error){
    logger.error(e, { 'function': 'ShopeeService.getModelOfProduct' });
    return new ServiceResponse(false, '', []);
  }
}

/**
 * Get list Inventory site to compare shopee 
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListProductStocksDetailShopee = async (queryParams = {}) => {
  try {
      const currentPage = apiHelper.getCurrentPage(queryParams);
      const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
      const keyword = apiHelper.getSearch(queryParams);
      const pool = await mssql.pool;
      const data = await pool.request()
          .input('PageSize', itemsPerPage)
          .input('PageIndex', currentPage)
          .input('KEYWORD', keyword)
          .input('PRODUCTCATEGORYID', apiHelper.getValueFromObject(queryParams, 'product_category_id'))
          .input('PRODUCTID', apiHelper.getValueFromObject(queryParams, 'product_id'))
          .input('MODELID', apiHelper.getValueFromObject(queryParams, 'model_id'))
          .input('MANUFACTURERID', apiHelper.getValueFromObject(queryParams, 'manufacturer_id'))
          .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
          .input('SUPPLIERID', apiHelper.getValueFromObject(queryParams, 'suplier_id'))
          .input('ISOUTOFSTOCK', apiHelper.getValueFromObject(queryParams, 'is_out_of_stock'))
          .input('ISACTIVE', apiHelper.getValueFromObject(queryParams, 'is_active'))
          // .input('STOCKSID', apiHelper.getValueFromObject(queryParams, 'stocks_id'))
          .input('SHOPID',`${apiHelper.getValueFromObject(queryParams, 'shop_id')}`)
          .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'user_name'))
          .execute('ST_STOCKSDETAIL_GetListShopee_AdminWeb');
          const StocksDetails = data.recordsets[0];
          let result = shopeeClass.listInventory(StocksDetails);
          // result = handleMergeData(result);
      return new ServiceResponse(true, '', {
          'data': result,
          'page': currentPage,
          'limit': itemsPerPage,
          'total': apiHelper.getTotalData(data.recordset) //data.recordset[0].TOTALITEMS,
      });
  } catch (e) {
      logger.error(e, { 'function': 'stocksDetailService.getListStocksDetail' });
      return new ServiceResponse(true, '', {});
  }
};


module.exports = {
  getAccessToken,
  connectShoppe,
  DisconnectShopee,
  getProfileShop,
  getProduct,
  removeToken,
  checkToken,
  updateStockShopee,
  getListOrder,
  refeshToken,
  crawlListOrderInsert,
  getSignShopee,
  createShopeeProfile,
  deleteShopProfile,
  getListShopProfile,
  getOptionShipping,
  shipOrder,
  getTrackingNumberCode,
  getDocumentShipResult,
  shippingDocument,
  getResultShippingDocument,
  getWaybill,
  getOptionShippingList,
  getListShippingDocumentParamater,
  cancelOrder,
  getPushShopee,
  detailGenCustomerCode,
  updateOrderStatus,
  getOptsStocks,
  updateStocks,
  updateProductIDShopee,
  getProductOptions,
  deleteIDShopee,
  getModelList
};



