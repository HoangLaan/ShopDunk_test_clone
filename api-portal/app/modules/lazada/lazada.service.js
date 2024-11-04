var moment = require('moment');
const { default: axios } = require('axios');
const { configLazada, buildParamater, doGetLazada, doPostLazada, doGetLazadaQueryString } = require('./heplper');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const { set, get, getByHash, delHash, del, setV2 } = require('../../common/helpers/redis.helper');
const lazadaClass = require('./lazada.class');
const stocksDetailService = require('../stocks-detail/stocks-detail.service');
const querystring = require('qs');
const { product } = require('../order/order.class');

const object = (code = '1') => {
  const msg = {
    'unpaid': { message: 'Chưa thanh toán' },
    'pending': { message: 'Chưa xử lý' },
    'toship': { message: 'Đã xử lý' },
    'ready_to_ship': { message: 'Đã xử lý' },
    'shipped': { message: 'vận chuyển' },
    'delivered': { message: 'Hoàn thành' },
    // 'IN_CANCEL': { message: 'Bị hủy' },
    'canceled': { message: 'Đã hủy' },
    // 'INVOICE_PENDING': { message: 'Đang xử lý hóa đơn' },
    '1': { message: 'Không xác định' }
  }
  return msg[code];
}

const connectLazada = async (queryParams = {}) => {
  try {
    let { code: codeAuthen = '', type = 2 } = queryParams || {};
    //Get accessToken Va lay Thong tin Shop
    let apiNameToken = '/auth/token/create';
    let paramToken = buildParamater({ code: codeAuthen }, apiNameToken);
    let resToken = await doGetLazada(apiNameToken, paramToken, true);
    let { code, country_user_info = [], access_token } = resToken || {};
    if (code != '0') {
      return new ServiceResponse(false, 'Lỗi kết nối Lazada', resToken);
    }

    //Luu token vao Redis
    let sellerId = country_user_info && country_user_info.length > 0 ? country_user_info[0].seller_id : null;
    if (!sellerId) {
      return new ServiceResponse(false, 'Lỗi kết nối Lazada', resToken);
    }
    setV2(`LAZADA-TOKEN:${sellerId}`, resToken);

    //Call Api lấy thông tin Seller để insert DB
    let apiProfile = '/seller/get';
    let paramsInfo = buildParamater({ access_token }, apiProfile);
    let resSeller = await doGetLazada(apiProfile, paramsInfo);
    let { code: code_seller = '', data } = resSeller || {};
    if (code_seller != '0') {
      return new ServiceResponse(false, 'Lỗi kết nối Lazada', resSeller);
    }
    const pool = await mssql.pool;
    const resShop = await pool
      .request()
      .input('SELLERID', `${apiHelper.getValueFromObject(data, 'seller_id')}`)
      .input('SHOPNAME', apiHelper.getValueFromObject(data, 'name'))
      .input('EMAIL', apiHelper.getValueFromObject(data, 'email'))
      .input('LOCATION', apiHelper.getValueFromObject(data, 'location'))
      .input('SHORTCODE', apiHelper.getValueFromObject(data, 'short_code'))
      .input('STATUS', apiHelper.getValueFromObject(data, 'status'))
      .input('CODE', codeAuthen)
      .input('ACCESSTOKEN', apiHelper.getValueFromObject(resToken, 'access_token'))
      .input('REFRESHTOKEN', apiHelper.getValueFromObject(resToken, 'refresh_token'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(queryParams, 'auth_name', 'adminitrator'))
      .execute('MD_SHOPPROFILE_ConnectLazada_AdminWeb');
    let shop = lazadaClass.detailShop(resShop.recordset[0] || {});
    return new ServiceResponse(true, '', shop);
  } catch (error) {
    logger.error(error, {
      function: 'lazada.service.connectLazada',
    });
    console.error('lazada.service.connectLazada', error);
    return new ServiceResponse(false, error.message);
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
      .input('TYPE', 'LAZADA')
      .execute('MD_SHOPPROFILE_GetList_AdminWeb');
    const listProfile = data.recordsets[0];
    return new ServiceResponse(true, '', {
      'data': lazadaClass.list(listProfile),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(listProfile),
    });
  } catch (e) {
    logger.error(e, { function: 'lazada.getListShopProfile' });
    return new ServiceResponse(true, '', {});
  }
};

const funGetInforSKUs = (array = []) => {
  let skus = {};
  if (array && array.length > 0) {
    let sum = 0;
    (array || []).map(sku => {
      skus['product_code'] = sku.SellerSku;
      skus['ShopSku'] = sku.ShopSku;
      skus['price'] = sku.price;
      sum += (sku.quantity || 0);
    })
    skus['quantity'] = sum;
  }
  return skus;
}

const sumTotalQuanity = (array) => {
  let sum = 0;
  if (array && array.length > 0) {
    (array || []).map(sku => {
      sum += ((sku.quantity || 0) - (sku.occupyQuantity || 0));
    })
  }
  return sum
}

const sumTotalSubQuantity = (array) => {
  let sum = 0;
  if (array && array.length > 0) {
    (array || []).map(sku => {
      sum += (((sku.withholdQuantity || 0) + (sku.occupyQuantity || 0)));
    })
  }
  return sum
}

const convertObjectToString = (object = {}) => {
  let { saleProp = {} } = (object || {});
  let name = '';
  if (saleProp && Object.values(saleProp) && Object.values(saleProp).length > 0) {
    (Object.values(saleProp) || []).map(item => {
      name = name + ' - ' + `${item || ''}`
    })
  }
  return name;
}

const getProduct = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    let sellerId = apiHelper.getValueFromObject(queryParams, 'shop_id');
    let token = await get(`LAZADA-TOKEN:${sellerId}`);
    if (token == 'null' || !token) {
      // await getAccessToken(body);
      return new ServiceResponse(false, 'Refesh', { is_refesh: true });
    }
    let { access_token = '' } = JSON.parse(token);
    if (access_token) {
      let apiProduct = '/products/get';
      let paramsInfo = buildParamater({ access_token, limit: itemsPerPage, offset: (currentPage - 1) * itemsPerPage }, apiProduct);
      let resToken = await doGetLazada(apiProduct, paramsInfo);
      let { code, data = {}, message } = resToken || {};
      if (code != '0') {
        logger.error(resToken, { function: 'lazada.getListProduct' });
        return new ServiceResponse(false, 'Lỗi lấy sản phẩm Lazada',);
      }
      let { products = [], total_products = 0 } = (data || {});
      let listProduct = {};

      (products || []).map(product => {
        let object = {};
        let { attributes = {} } = (product || []);
        let { skus = [] } = (product || []);
        if (skus && skus.length > 0) {
          (skus || []).map(sku => {
            let objectSKU = {};
            let nameSKU = (convertObjectToString(sku));

            let image =
              // Nếu có images mặc định thì lấy từ product
              product && product.images && product.images.length > 0 ? product.images
                :
                // Nếu không có lấy images khai báo trong phân loại
                sku && sku.Images && sku.Images.length > 0 ? sku.Images : [];

            objectSKU['image_url_list'] = (image || [])
            objectSKU['item_status'] = (product.status || '');
            objectSKU['item_id'] = (product.item_id || 0);
            objectSKU['SkuId'] = (sku.SkuId || 0);
            objectSKU['item_name'] = attributes && attributes.name ? `${attributes.name}${nameSKU}` : 'Không xác định';
            objectSKU['skus'] = sku;
            objectSKU = { ...objectSKU, ...funGetInforSKUs([sku]) };
            listProduct[`${(sku.SkuId || 0)}`] = objectSKU;
          });
        }
        // else{
        // object['image_url_list'] = (product.images || [])
        // object['item_status'] = (product.status || '');
        // object['item_id'] = (product.item_id || 0);
        // object['SkuId'] = (product.SkuId || 0);
        // object['item_name'] = attributes && attributes.name ? attributes.name : 'Không xác định';
        // object['skus'] = skus;
        // object = { ...object, ...funGetInforSKUs(skus) };
        // listProduct[`${(product.item_id || 0)}`] = object;
        // }
      })
      if (Object.values(listProduct).length > 0) {
        let stringProductCode = (Object.values(listProduct) || []).map(item => {
          if (item && item.SkuId) {
            return item.SkuId;
          } else {
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
          shop_id: sellerId
        };

        let responseGetInventory = await getListProductStocksDetailLazada(params);
        let { data: dataInventory } = responseGetInventory.getData();

        // Gộp 2 mảng thông tin cơ bảng và thông tin mở rộng lại với nhau để trả về
        let ListProduct = Object.values(listProduct).map(base => {
          let inventory = (dataInventory || []).find(pro => pro.product_lazada_id == base.SkuId) || {};
          return {
            ...base,
            product_portal: (inventory && inventory ? { ...inventory } : null),
            total_inventory: (inventory && inventory && inventory.total_inventory) || 0,
          };
        });

        return new ServiceResponse(true, 'Lấy dữ liệu sản phẩm thành công', {
          data: ListProduct,
          page: currentPage,
          limit: itemsPerPage,
          total: total_products,
        });
      }
      return new ServiceResponse(true, '',
        {
          total: 0,
          data: [],
          offset: 0,
          has_next_page: 0,
        })
    }
    return new ServiceResponse(false, 'Không tìm thấy Token', {});
  } catch (error) {
    logger.error(error, { function: 'lazada.getListProduct' });
    return new ServiceResponse(true, '', {});
  }
}


// Hàm dùng để đồng bộ ID sản phẩm lazada với sản phẩm ở portal
const updateProductIDLazada = async (body = {}) => {
  try {
    let product = apiHelper.getValueFromObject(body, 'product');
    let shop_id = apiHelper.getValueFromObject(body, 'shop_id');
    let product_lazada = apiHelper.getValueFromObject(body, 'product_lazada');

    let product_id = apiHelper.getValueFromObject(product, 'value');
    let product_id_lazada = apiHelper.getValueFromObject(product_lazada, 'SkuId');
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PRODUCTID', product)
      .input('PRODUCTLAZADAID', `${product_id_lazada}`)
      .input('SHOPID', shop_id)
      .input('KEY', 'LAZADA')
      .execute("MD_SHOPPROFILE_UpdateProductID_AdminWeb");

    const StocksDetails = data && data.recordset && data.recordset.length > 0 ? data.recordset[0] : [];

    let result = lazadaClass.detailProduct(StocksDetails);
    return new ServiceResponse(true, 'Cập nhật thành công', { ...result })
  } catch (e) {
    logger.error(e, { 'function': 'lazada.updateProductLazadaID' });
    return new ServiceResponse(false, '', []);
  }
}

const getOptsStocks = async (queryParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('ISACTIVE', 1)
      .input('ORDERID', null)
      .input('STOCKOUTPUTTYPE', 1)
      .execute("ST_STOCKSOUTREQUEST_GetStocks_AdminWeb");
    return new ServiceResponse(true, '', data.recordset && data.recordset.length ? lazadaClass.option(data.recordset) : [])
  } catch (e) {
    logger.error(e, { 'function': 'lazada.service.getOptsStocks' });
    return new ServiceResponse(true, '', []);
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
    return new ServiceResponse(true, '', lazadaClass.productOptions(dataRecord));
  } catch (e) {
    logger.error(e, { 'function': 'lazada.service.getListOptionsCategory' });

    return new ServiceResponse(true, '', {});
  }
}

// Hàm dùng để đồng bộ ID sản phẩm lazada với sản phẩm ở portal
const deleteIDLazada = async (body = {}) => {
  try {
    let infor = apiHelper.getValueFromObject(body, 'product');
    let shop_id = apiHelper.getValueFromObject(body, 'shop_id');
    let product = apiHelper.getValueFromObject(infor, 'product_portal');

    let product_id_lazada = apiHelper.getValueFromObject(infor, 'SkuId');
    let product_id = apiHelper.getValueFromObject(product, 'product_id');
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PRODUCTID', product_id)
      .input('PRODUCTLAZADAID', `${product_id_lazada}`)
      .input('SHOPID', shop_id)
      .input('KEY', 'LAZADA')
      .execute("MD_SHOPPROFILE_DeleteProductID_AdminWeb");
    return new ServiceResponse(true, 'Xóa đồng bộ thành công', {})
  } catch (e) {
    logger.error(e, { 'function': 'lazada.service.deleteIDLazada' });
    return new ServiceResponse(false, '', []);
  }
}


const getWareHouse = async (queryParams = {}) => {
  try {
    let sellerId = apiHelper.getValueFromObject(queryParams, 'shop_id');
    let token = await get(`LAZADA-TOKEN:${sellerId}`);
    if (token == 'null' || !token) {
      return new ServiceResponse(false, 'Refesh', { is_refesh: true });
    }
    let { access_token = '' } = JSON.parse(token);
    if (access_token) {
      let apiWareHouse = '/rc/warehouse/get';
      let paramsInfo = buildParamater({ access_token }, apiWareHouse);
      let resToken = await doGetLazada(apiWareHouse, paramsInfo);
      let { code, data = {}, message, result } = resToken || {};
      if (code != '0') {
        logger.error(resToken, { function: 'lazada.getListWareHouse' });
        return new ServiceResponse(false, 'Lỗi lấy danh sách nhà kho',);
      }
      let { module = [], total_products = 0 } = (result || {});
      let listWareHouse = (module || []).map(item => {
        return {
          ...item,
          id: item.code,
          value: item.code,
          label: item && item.name ? item.name : `Kho Mặc Định`
        }
      })

      let listWareHouseFilter = (listWareHouse || []).filter(house => house.code != 'customerreturn')
      return new ServiceResponse(true, 'Lấy dan sách nhà kho thành công', { listWareHouse: listWareHouseFilter })
    }
    return new ServiceResponse(false, 'Không tìm thấy Token', {});
  } catch (e) {
    logger.error(e, { 'function': 'lazada.service.getWareHouse' });
    return new ServiceResponse(false, '', []);
  }
}

const updateStockLazada = async (body = {}) => {
  try {
    let sellerId = apiHelper.getValueFromObject(body, 'shop_id');
    let skus = apiHelper.getValueFromObject(body, 'skus');
    let item_id = apiHelper.getValueFromObject(body, 'item_id');
    let token = await get(`LAZADA-TOKEN:${sellerId}`);
    if (token == 'null' || !token) {
      return new ServiceResponse(false, 'Refesh', { is_refesh: true });
    }
    let { access_token = '' } = JSON.parse(token);
    if (access_token) {
      let apiUpdateQuantity = '/product/price_quantity/update';
      // format payload để gửi sang lazada
      let payLoad = fomatProductLazada(skus, item_id);
      let payloadXML = OBJtoXML(payLoad);
      let paramsInfo = buildParamater({ payload: payloadXML, access_token }, apiUpdateQuantity);
      let resUpdateQuantity = await doPostLazada(apiUpdateQuantity, paramsInfo);
      let { code, data = {}, message } = (resUpdateQuantity || {});
      if (code != '0') {
        logger.error(resUpdateQuantity, { function: 'lazada.updateStocks' });
        return new ServiceResponse(false, 'Lỗi cập nhật số lượng sản phẩm Lazada',);
      }

      let skusUpdate = (skus || []).map(sku => {
        let { multiWarehouseInventories = [] } = (sku || []);
        return {
          ...sku,
          quantity: sumTotalQuanity(multiWarehouseInventories)
        }
      })

      let result = {
        ...body,
        skus: skusUpdate,
        quantity: sumTotalQuanity(skusUpdate)
      }
      return new ServiceResponse(true, 'Cập nhật thông tin sản phẩm Lazada', result);
    }
    return new ServiceResponse(false, 'Không tìm thấy Token', {});
  } catch (error) {
    logger.error(error.message, { function: 'lazada.Service.UpdateStockLazada' });
    return new ServiceResponse(false, '', {});
  }
};

const checkNumberType = (array = []) => {
  if (array && array.length > 0) {
    let tempResult = {};
    for (let { shipping_provider_type } of array)
      tempResult[shipping_provider_type] = {
        count: tempResult[shipping_provider_type] ? tempResult[shipping_provider_type].count + 1 : 1
      }
    return tempResult
  }
  return 0;
}


const translate = (str = '') => {
  let newString = str;
  if (str.includes("Drop-off")) {
    newString = newString.replace(/Drop-off/g, "Gửi tại bưu cục ");
  }
  if (str.includes("Pickup")) {
    newString = newString.replace(/Pickup/g, "Lấy hàng bởi");
  }
  if (str.includes("Delivery")) {
    newString = newString.replace(/Delivery/g, "Vận chuyển");
  }
  if (str.includes("Delivered by Seller")) {
    return newString = newString.replace(/Delivered by Seller/g, "Người bán vận chuyển");

  }
  let array = newString.split(",");
  return array && array.length > 0 && array[0] ? array[0] : '';
}


const formatData = (listOrderDetail, orders) => {
  let list = {};
  (orders || []).map(order => {
    let { order_items = [] } = (listOrderDetail[order.order_id] || {});
    let grouped = (order_items || []).reduce((a, v) => {
      let item = order_items.filter(el => el.shop_sku == v.shop_sku);
      let orders_item_id = (item || []).map(o => {
        return o.order_item_id
      })

      return ({ ...a, [v.shop_sku]: { ...v, orders_item_id, count: (item && item.length ? item.length : 0) } })
    }, {});

    let isCheck = checkNumberType(Object.values(grouped));
    // Check xem trong 1 đơn hàng có từ 2 sản phẩm trở lên nhưng mỗi sản phẩm sẽ có hình thức giao khác nhau
    // Nếu có 2 hình thức khác nhau thì sẽ tách thành 2 gói để thao tác từng gói
    if (Object.values(isCheck) && Object.values(isCheck).length > 1) {
      (Object.values(grouped) || []).map(item => {
        let order_status = (object(item.status || '') || {});
        list[`${order.order_id}_${item.shipping_provider_type}`] = {
          ...order,
          price: (item.count || 0) * (item.item_price || 0),
          fulfillment_sla: (item.fulfillment_sla || ''),
          sla_time_stamp: (item.sla_time_stamp || ''),
          status: (item.status || ''),
          order_status: (order_status.message || ''),
          package_id: (item.package_id || ''),
          shipment_provider: (item.shipment_provider || ''),
          shipment_provider_label: translate(item.shipment_provider || ''),
          shipping_provider_type: (item.shipping_provider_type || ''),
          shipping_type: (item.shipping_type || ''),
          tracking_code: (item.tracking_code || ''),
          warehouse_code: (item.warehouse_code || '')

        };

        list[`${order.order_id}_${item.shipping_provider_type}`].detail = {
          order_items: [item]
        }
      })
    } else {// Nếu 2 hoặc nhiều hơn có cùng hình thức giao thì sẽ gom lại chỉ thao tác trên đơn hàng đó
      (Object.values(grouped) || []).map(item => {
        let order_status = (object(item.status || '') || {});
        list[`${order.order_id}`] = {
          ...order,
          price: (item.count || 0) * (item.item_price || 0),
          fulfillment_sla: (item.fulfillment_sla || ''),
          sla_time_stamp: (item.sla_time_stamp || ''),
          status: (item.status || ''),
          package_id: (item.package_id || ''),
          order_status: (order_status.message || ''),
          shipment_provider: (item.shipment_provider || ''),
          shipping_provider_type: (item.shipping_provider_type || ''),
          shipping_type: (item.shipping_type || ''),
          tracking_code: (item.tracking_code || ''),
          warehouse_code: (item.warehouse_code || ''),
          shipment_provider_label: translate(item.shipment_provider || '')
        };
      })
      list[`${order.order_id}`].detail = { order_items: Object.values(grouped) }
    }
  })
  return list
}

const getListOrder = async (body = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(body);
    const itemsPerPage = apiHelper.getItemsPerPage(body);
    let start_date = apiHelper.getValueFromObject(body, 'start_date');
    let end_date = apiHelper.getValueFromObject(body, 'end_date');
    let sellerId = apiHelper.getValueFromObject(body, 'shop_id');
    let token = await get(`LAZADA-TOKEN:${sellerId}`);
    if (token == 'null' || !token) {
      // await getAccessToken(body);
      return new ServiceResponse(false, 'Refesh', { is_refesh: true });
    }
    let { access_token = '' } = JSON.parse(token);
    if (access_token) {
      let time_to = end_date ? moment(new Date(end_date)).endOf('day').toISOString() : moment().toISOString();
      let time_from = start_date ? moment(new Date(start_date)).startOf('day').toISOString() : moment().subtract(365, 'd').toISOString();


      let order_status = apiHelper.getValueFromObject(body, 'order_type', 'pending');
      let apiGetOrder = '/orders/get';
      let paramsInfo = buildParamater({
        access_token,
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
        status: order_status,
        created_before: time_to,
        created_after: time_from,
        sort_by: "created_at",
        sort_direction: "DESC"

      },
        apiGetOrder);
      let result = await doGetLazada(apiGetOrder, paramsInfo)
      let { data = {}, code, message } = result;
      if (code != '0') {
        logger.error(message, { function: 'lazada.getListOrderLazada' });
        return new ServiceResponse(false, 'Lỗi lấy danh sách sản phẩm Lazada');
      }
      let { orders = [], count, countTotal } = (data || {});
      let order_ids = (orders || []).map(order => {
        return (order.order_id)
      })
      let resGetDetail = await getListOrderDetail({ shop_id: sellerId, order_ids });

      if (resGetDetail.isFailed()) {
        logger.error(result, { function: 'lazada.getDetail' });
        return new ServiceResponse(false, 'Lỗi lấy chi tiết đơn hàng thất bại');
      }
      let listOrderDetail = resGetDetail.getData();
      let list = formatData(listOrderDetail, orders);

      return new ServiceResponse(true, 'Lấy danh sách đơn hàng thành công', {
        list: Object.values(list),
        count,
        countTotal,
        data: Object.values(list),
        page: currentPage,
        limit: itemsPerPage,
        total: countTotal,
      });
    }
    return new ServiceResponse(false, 'Không tìm thấy Token', {});
  } catch (error) {
    logger.error(error.message, { function: 'lazada.GetListOrderPortal' });
    return new ServiceResponse(false, '', {});
  }
};

const getListOrderDetail = async (body = {}) => {
  try {
    const order_ids = JSON.stringify(apiHelper.getValueFromObject(body, 'order_ids'));

    let sellerId = apiHelper.getValueFromObject(body, 'shop_id');
    let token = await get(`LAZADA-TOKEN:${sellerId}`);
    if (token == 'null' || !token) {
      // await getAccessToken(body);
      return new ServiceResponse(false, 'Refesh', { is_refesh: true });
    }
    let { access_token = '' } = JSON.parse(token);
    if (access_token) {
      let apiGetOrder = '/orders/items/get';
      let paramsInfo = buildParamater({ access_token, order_ids }, apiGetOrder);
      let result = await doGetLazada(apiGetOrder, paramsInfo);
      let { data = {}, code, message } = result;
      if (code != '0') {
        logger.error(result, { function: 'lazada.getListOrderDetail' });
        return new ServiceResponse(false, 'Lỗi lấy chi tiết đơn hàng',);
      }
      let object = data.reduce((a, v) => ({ ...a, [v?.order_id]: v }), {});
      return new ServiceResponse(true, 'Lấy chi tiết đơn hàng thành công', object);
    }
    return new ServiceResponse(false, 'Không tìm thấy Token', {});
  } catch (error) {
    logger.error(error.message, { function: 'lazada.getListOrderDetail' });
    return new ServiceResponse(false, '', {});
  }
};


const fomatProductLazada = (skus, item_id) => {
  let skusConvert = (skus || []).map(item => {
    let object = {}
    let { multiWarehouseInventories = [] } = (item || []);

    // Nếu chỉ có nhiều hơn 1 kho => sẽ cập nhật số lượng theo từng kho
    if (multiWarehouseInventories && multiWarehouseInventories.length > 1) {
      let listInventory = (multiWarehouseInventories || []).map(item => {
        return {
          Quantity: `${item.quantity || 0}`,
          WarehouseCode: `${item.warehouseCode}`
        }
      })
      // format lại của 1 sản phẩm;
      object = {
        "ItemId": `${item_id}`,
        "SkuId": `${item.SkuId}`,
        "SellerSku": `${item.SellerSku}`,
        "Price": "",
        "SalePrice": "",
        "SaleStartDate": "",
        "SaleEndDate": "",
        "MultiWarehouseInventories": {
          "MultiWarehouseInventory": listInventory
        }
      }
      // Nếu chỉ có duy nhất 1 kho => sẽ không cần truyền kho chỉ cần truyền số lượng
    } else {
      let listInventory = (multiWarehouseInventories || []).map(ware => {
        return {
          "Quantity": `${ware.quantity || 0}`,
        }
      })

      object = {
        "ItemId": `${item_id}`,
        "SkuId": `${item.SkuId}`,
        "SellerSku": `${item.SellerSku}`,
        "Price": "",
        "SalePrice": "",
        "SaleStartDate": "",
        "SaleEndDate": "",
        "Quantity": listInventory && listInventory.length > 0 && listInventory[0] && listInventory[0].Quantity ? listInventory[0].Quantity : 0
      }

    }
    return object;
  })

  // Trả về đúng định dạng để convert từ object sang XML rồi đẩy sang lazada
  return {
    "Request": {
      "Product": {
        "Skus": {
          "Sku": skusConvert
        }
      }
    }
  }
}

const fomatProductLazadaDefault = (skus = [], item_id, quantity = 0) => {
  let skusConvert = (skus || []).map(item => {
    let object = {}
    let { multiWarehouseInventories = [] } = (item || []);
    let QuantityResult = 0

    // Tính số lượng sau khi + số lượng tồn kho và số lượng đã bán +
    let sum = 0;
    if (multiWarehouseInventories && multiWarehouseInventories.length > 0) {
      (multiWarehouseInventories || []).map(sku => {
        sum += (sum + (sku.occupyQuantity || 0) + (sku.withholdQuantity || 0));
      })
    }

    if (quantity <= sum) {
      QuantityResult = sum
    } else {
      QuantityResult = quantity
    }

    // Nếu chỉ có nhiều hơn 1 kho => sẽ cập nhật số lượng theo từng kho
    if (multiWarehouseInventories && multiWarehouseInventories.length < 2) {
      object = {
        "ItemId": `${item_id}`,
        "SkuId": `${item.SkuId}`,
        "SellerSku": `${item.SellerSku}`,
        "Price": "",
        "SalePrice": "",
        "SaleStartDate": "",
        "SaleEndDate": "",
        "Quantity": (QuantityResult || 0)
      }

    }
    return object;
  })
  // Trả về đúng định dạng để convert từ object sang XML rồi đẩy sang lazada
  return {
    "Request": {
      "Product": {
        "Skus": {
          "Sku": skusConvert
        }
      }
    }
  }
}
const fomatProductLazadaDefaultSellable = (skus = [], item_id, quantity = 0) => {
  let skusConvert = (skus || []).map(item => {
    let object = {}
    let { multiWarehouseInventories = [] } = (item || []);

    // Nếu chỉ có nhiều hơn 1 kho => sẽ cập nhật số lượng theo từng kho
    if (multiWarehouseInventories && multiWarehouseInventories.length < 2) {
      object = {
        "ItemId": `${item_id}`,
        "SkuId": `${item.SkuId}`,
        "SellerSku": `${item.SellerSku}`,
        "Quantity": (quantity || 0)
      }

    }
    return object;
  })
  // Trả về đúng định dạng để convert từ object sang XML rồi đẩy sang lazada
  return {
    "Request": {
      "Product": {
        "Skus": {
          "Sku": skusConvert
        }
      }
    }
  }
}

const OBJtoXML = (obj) => {
  var xml = '';
  for (var prop in obj) {
    xml += obj[prop] instanceof Array ? '' : "<" + prop + ">";
    if (obj[prop] instanceof Array) {
      for (var array in obj[prop]) {
        xml += "<" + prop + ">";
        xml += OBJtoXML(new Object(obj[prop][array]));
        xml += "</" + prop + ">";
      }
    } else if (typeof obj[prop] == "object") {
      xml += OBJtoXML(new Object(obj[prop]));
    } else {
      xml += obj[prop];
    }
    xml += obj[prop] instanceof Array ? '' : "</" + prop + ">";
  }
  var xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
  return xml
}


const printShipping = async (body = {}) => {
  try {
    let sellerId = apiHelper.getValueFromObject(body, 'shop_id');
    // let package_id = apiHelper.getValueFromObject(body, 'package_id');
    let order_list_raw = apiHelper.getValueFromObject(body, 'order_list');
    let packages = (order_list_raw || []).map(item => {
      return { "package_id": `${item.package_id}` }
    })
    let token = await get(`LAZADA-TOKEN:${sellerId}`);
    let { access_token = '' } = JSON.parse(token);
    if (access_token) {
      let apiGetOrder = '/order/package/document/get';
      let getDocumentReq = JSON.stringify({ "doc_type": "PDF", "packages": packages } || {});
      let paramsInfo = buildParamater({ access_token, getDocumentReq }, apiGetOrder);
      let res = await doGetLazada(apiGetOrder, paramsInfo);
      let { result = {}, code, message } = res;
      if (code != '0') {
        logger.error(result, { function: 'lazada.printbill' });
        return new ServiceResponse(false, 'Lỗi in phiếu',);
      }
      let { data: dataFile } = (result || {});
      return new ServiceResponse(true, 'In phiếu thành công', dataFile);
    }
    return new ServiceResponse(false, 'Không tìm thấy Token', {});
  } catch (e) {
    logger.error(e, { function: 'lazada.service.printbill' });
    return new ServiceResponse(true, '', {});
  }
}

const getPackProvider = async (body = {}) => {
  try {
    let order_list_raw = apiHelper.getValueFromObject(body, 'order_list');
    let sellerId = apiHelper.getValueFromObject(body, 'shop_id');
    let token = await get(`LAZADA-TOKEN:${sellerId}`);
    let { access_token = '' } = JSON.parse(token);
    if (access_token) {
      let apiShippingProvider = '/order/shipment/providers/get';
      let getShipmentProvidersReq = JSON.stringify({ "orders": order_list_raw } || {});
      let paramsInfo = buildParamater({ access_token, getShipmentProvidersReq }, apiShippingProvider);
      let res = await doGetLazada(apiShippingProvider, paramsInfo);
      let { result = {}, code, message } = res;
      if (code != '0') {
        logger.error(res, { function: 'lazada.getPackProvider' });
        return new ServiceResponse(false, 'Lỗi lấy danh sách nhà cung cấp vận chuyển',);
      }
      let { data } = (result || {});
      return new ServiceResponse(true, 'Lấy danh sách thành công');
    }
    return new ServiceResponse(false, 'Không tìm thấy Token', {});
  } catch (error) {
    logger.error(e, { function: 'lazada.service.getPackProvider' });
    return new ServiceResponse(true, '', {});
  }
}


const createPackOrder = async (body = {}) => {
  try {
    let order_list_raw = apiHelper.getValueFromObject(body, 'list_current_order');
    let pack_order_list = (order_list_raw || []).map(order => {
      let { detail = {} } = (order || {});
      let { order_items = [] } = (detail || {});
      let array = [];
      (order_items || []).map(detail => {
        array = [...array, ...detail.orders_item_id];
      })
      return {
        order_item_list: array,
        order_id: order.order_id
      }
    })
    let sellerId = apiHelper.getValueFromObject(body, 'shop_id');
    let token = await get(`LAZADA-TOKEN:${sellerId}`);
    let { access_token = '' } = JSON.parse(token);
    if (access_token) {
      let apiShippingProvider = '/order/fulfill/pack';
      let PackParamater = JSON.stringify({ "pack_order_list": pack_order_list, "delivery_type": "dropship", "shipping_allocate_type": "TFS" } || {});
      let paramsInfo = buildParamater({ access_token, packReq: PackParamater }, apiShippingProvider);
      let res = await doPostLazada(apiShippingProvider, paramsInfo);
      let { result = {}, code, message } = res;
      if (code != '0') {
        logger.error(res, { function: 'lazada.createPackOrder' });
        return new ServiceResponse(false, 'Lỗi lấy tạo gói đơn hàng');
      }
      let { data } = (result || {});
      return new ServiceResponse(true, 'Tạo gói đơn hàng thành công', data);
    }
    return new ServiceResponse(false, 'Không tìm thấy Token', {});
  } catch (error) {
    logger.error(error, { function: 'lazada.service.createPackOrder' });
    return new ServiceResponse(true, '', {});
  }
}

// package_id
const createReadyToShip = async (body = {}) => {
  try {
    let pack_order_list = apiHelper.getValueFromObject(body, 'pack_order_list');
    let array = [];
    let packages = (pack_order_list || []).map(order => {
      let { order_item_list = [] } = (order || {})
      array = (order_item_list || []).map(pack => {
        return { "package_id": pack.package_id };
      })
    })
    let sellerId = apiHelper.getValueFromObject(body, 'shop_id');
    let token = await get(`LAZADA-TOKEN:${sellerId}`);
    let { access_token = '' } = JSON.parse(token);
    if (access_token) {
      if (array && array.length > 0) {
        let apiShippingProvider = '/order/package/rts';
        let readyToShipParams = JSON.stringify({ "packages": array } || {});
        let paramsInfo = buildParamater({ access_token, readyToShipReq: readyToShipParams }, apiShippingProvider);
        let res = await doPostLazada(apiShippingProvider, paramsInfo);
        let { result = {}, code, message } = res;
        if (code != '0') {
          logger.error(res, { function: 'lazada.createReadyToShip' });
          return new ServiceResponse(false, 'Lỗi không chuyển đơn hàng sẵn sàng giao');
        }
        let { data } = (result || {});
        return new ServiceResponse(true, 'Chuyển trạng thái đơn hàng thành công', data);
      } else {
        return new ServiceResponse(false, 'Đã xảy ra lỗi', {});
      }

    }
    return new ServiceResponse(false, 'Không tìm thấy Token', {});
  } catch (error) {
    logger.error(error, { function: 'lazada.service.createReadyToShip' });
    return new ServiceResponse(true, '', {});
  }
}

const getOptionCancel = async (body = {}) => {
  try {
    let sellerId = apiHelper.getValueFromObject(body, 'shop_id');
    let orderCancel = apiHelper.getValueFromObject(body, 'orderCancel');
    let detail = apiHelper.getValueFromObject(orderCancel, 'detail', {});
    let order_id = apiHelper.getValueFromObject(orderCancel, 'order_id', '');

    let { order_items = [] } = (detail || {});
    let array = [];
    (order_items || []).map(item => {
      array = [...array, ...item.orders_item_id];
    })

    let token = await get(`LAZADA-TOKEN:${sellerId}`);
    let { access_token = '' } = JSON.parse(token);
    if (access_token) {
      let apiGetOptionCancel = '/order/reverse/cancel/validate';
      // let getOptionCancel = JSON.stringify({"orders": order_list_raw } || {});
      let paramsInfo = buildParamater({ access_token, order_id: order_id, order_item_id_list: JSON.stringify(array || []) }, apiGetOptionCancel);
      let res = await doGetLazada(apiGetOptionCancel, paramsInfo);
      let { data = {}, code, message } = res;
      if (code != '0') {
        logger.error(result, { function: 'lazada.getOptionCancel' });
        return new ServiceResponse(false, 'Lỗi Lấy danh sách lý do hủy đơn');
      }
      return new ServiceResponse(true, 'Chuyển trạng thái đơn hàng thành công', data);
    }
    return new ServiceResponse(false, 'Không tìm thấy Token', {});
  } catch (error) {
    logger.error(error, { function: 'lazada.service.getOptionCancel' });
    return new ServiceResponse(true, '', {});
  }
}

const cancelOrder = async (body = {}) => {
  try {
    let sellerId = apiHelper.getValueFromObject(body, 'shop_id');
    let order = apiHelper.getValueFromObject(body, 'order_sn');
    // let orderCancel = apiHelper.getValueFromObject(body, 'order_cancel');
    let detail = apiHelper.getValueFromObject(body, 'detail', {});
    let order_id = apiHelper.getValueFromObject(body, 'order_id', '');
    let cancel_reason = apiHelper.getValueFromObject(body, 'reason_cancel', '');

    let { order_items = [] } = (detail || {});
    let array = [];
    (order_items || []).map(item => {
      array = [...array, ...item.orders_item_id];
    })

    let token = await get(`LAZADA-TOKEN:${sellerId}`);
    let { access_token = '' } = JSON.parse(token);
    if (access_token) {
      let apiCancel = '/order/reverse/cancel/create';
      let paramsInfo = buildParamater({ access_token, order_id: order_id, order_item_id_list: JSON.stringify(array || []), reason_id: cancel_reason }, apiCancel);
      let res = await doGetLazada(apiCancel, paramsInfo);
      let { data = {}, code, message } = res;
      if (code != '0') {
        logger.error(data, { function: 'lazada.cancelOrder' });
        return new ServiceResponse(false, 'Lỗi hủy đơn hàng');
      }
      return new ServiceResponse(true, 'Hủy đơn hàng thành công', data);

    }
    return new ServiceResponse(false, 'Không tìm thấy Token', {});

  } catch (error) {
    logger.error(error, { function: 'lazada.service.cancelOrder' });
    return new ServiceResponse(true, '', {});
  }
}

const updateSuccess = async (body = {}) => {
  try {
    let sellerId = apiHelper.getValueFromObject(body, 'shop_id');
    let order = apiHelper.getValueFromObject(body, 'order', {});
    let detail = apiHelper.getValueFromObject(order, 'detail', {});
    let order_items = apiHelper.getValueFromObject(detail, 'order_items', []);

    let array = [];
    array = (order_items || []).map(pack => {
      return { "package_id": pack.package_id };
    })

    let token = await get(`LAZADA-TOKEN:${sellerId}`);
    let { access_token = '' } = JSON.parse(token);
    if (access_token) {
      if (array && array.length > 0) {
        let apiUpdateSuccess = '/order/package/sof/delivered';
        let dbsDeliveryReq = JSON.stringify({ "packages": array } || {});
        let paramsInfo = buildParamater({ access_token, dbsDeliveryReq: dbsDeliveryReq }, apiUpdateSuccess);
        let res = await doPostLazada(apiUpdateSuccess, paramsInfo);
        let { result = {}, code, message } = res;
        if (code != '0') {
          logger.error(result, { function: 'lazada.cancelOrder' });
          return new ServiceResponse(false, 'Lỗi hủy đơn hàng');
        }
        let { data = {} } = (result || {});
        return new ServiceResponse(true, 'Hủy đơn hàng thành công', data);
      } else {
        return new ServiceResponse(false, 'Đã xảy ra lỗi');
      }
    }
    return new ServiceResponse(false, 'Không tìm thấy Token', {});

  } catch (error) {
    logger.error(error, { function: 'lazada.service.updateSuccess' });
    return new ServiceResponse(true, '', {});
  }
}


const updateFailed = async (body = {}) => {
  try {
    let sellerId = apiHelper.getValueFromObject(body, 'shop_id');
    let order = apiHelper.getValueFromObject(body, 'order', {});
    let detail = apiHelper.getValueFromObject(order, 'detail', {});
    let order_items = apiHelper.getValueFromObject(detail, 'order_items', []);

    let array = [];
    array = (order_items || []).map(pack => {
      return { "package_id": pack.package_id };
    })

    let token = await get(`LAZADA-TOKEN:${sellerId}`);
    let { access_token = '' } = JSON.parse(token);
    if (access_token) {
      if (array && array.length > 0) {
        let apiUpdateFailed = '/order/package/sof/failed_delivery';
        let dbsFailedDeliveryReq = JSON.stringify({ "packages": array } || {});
        let paramsInfo = buildParamater({ access_token, dbsFailedDeliveryReq: dbsFailedDeliveryReq }, apiUpdateFailed);
        let res = await doPostLazada(apiUpdateFailed, paramsInfo);
        let { result = {}, code, message } = res;
        if (code != '0') {
          logger.error(res, { function: 'lazada.cancelOrder' });
          return new ServiceResponse(false, 'Lỗi hủy đơn hàng');
        }
        let { data = {} } = (result || {});
        return new ServiceResponse(true, 'Hủy đơn hàng thành công', data);
      } else {
        return new ServiceResponse(false, 'Đã xảy ra lỗi');
      }
    }
    return new ServiceResponse(false, 'Không tìm thấy Token', {});
  } catch (error) {
    logger.error(error, { function: 'lazada.service.updateFailed' });
    return new ServiceResponse(true, '', {});
  }
}

const updateFailedOrSuccessOrder = async (body = {}) => {
  try {
    let key = apiHelper.getValueFromObject(body, 'key');
    if (key == 'success') {
      let resupdateSuces = await updateSuccess({ ...body });
      if (resupdateSuces.isFailed()) {
        return new ServiceResponse(false, 'Xảy ra lỗi khi cập nhật đơn hàng thành công');
      }
      return new ServiceResponse(true, 'Cập nhật đơn hàng thành công');
    } else {
      let resupdateFailed = await updateFailed({ ...body });
      if (resupdateFailed.isFailed()) {
        return new ServiceResponse(false, 'Xảy ra lỗi khi cập nhật đơn hàng thành công');
      }
      return new ServiceResponse(true, 'Cập nhật đơn hàng thành công');
    }
  } catch (error) {
    logger.error(error, { function: 'lazada.service.updateFailedOrSuccessOrder' });
    return new ServiceResponse(true, '', {});
  }
}

const removeToken = async (body = {}) => {
  try {
    let shop_id = apiHelper.getValueFromObject(body, 'shop_id');
    if (shop_id) {
      setV2(`LAZADA_ACCESSTOKEN:${parseInt(shop_id)}`, null),
        setV2(`LAZADA_CONFIG`, null)
      return new ServiceResponse(true, 'Xóa kết nối thành công', {});
    }
  } catch (error) {
    logger.error(error.message, { function: 'lazada.Service.RemoveTokenSite' });
    return new ServiceResponse(false, '', {});
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
    const shopProfileID = data.recordset[0].RESULT;
    if (!shopProfileID) {
      return new ServiceResponse(false, "Xóa cửa hàng thất bại");
    }
    return new ServiceResponse(true, 'Xóa của hàng thành công', {});
  } catch (e) {
    logger.error(e, { function: 'orderService.createCustomerStocks' });
    return new ServiceResponse(false, "Xóa của hàng thất bại thất bại");
  }
};

const getconnectLazada = async (body = {}) => {
  try {

    let path = process.env.LAZADA_URL;
    let return_url = process.env.LAZADA_RETURN_URL
    let client_id = process.env.LAZADA_PARTNER_ID
    let url = `${path}?response_type=code&force_auth=true&redirect_uri=${return_url}&client_id=${client_id}`;
    return new ServiceResponse(true, '', { path: url });
  } catch (error) {
    logger.error(error.message, { function: 'lazada.service.getconnectLazada' });
    return new ServiceResponse(false, '', {});
  }
};

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
    logger.error(e, { 'function': 'lazada.service.updateStocksID' });
    return new ServiceResponse(false, '', []);
  }
}

// Webhook nên kết quả đúng hay sai gì cũng phải trả về true để code trả cho lazada là 200
const getPushLazada = async (body = {}) => {
  try {
    let sellerId = apiHelper.getValueFromObject(body, 'seller_id');
    let data = apiHelper.getValueFromObject(body, 'data', {});
    let order_id = apiHelper.getValueFromObject(data, 'trade_order_id', '');

    let resorder = await getOrder({ ...body });
    if (resorder.isFailed()) {
      return new ServiceResponse(true, 'Lấy thông tin đơn hàng thất bại', {})
    }
    let resorderDetail = await getListOrderDetail({ ...body, shop_id: sellerId, order_ids: [order_id] });
    if (resorderDetail.isFailed()) {
      return new ServiceResponse(true, 'Lấy thông tin chi tiết đơn hàng thất bại', {})
    }
    let order = resorder.getData();
    let detail = resorderDetail.getData();


    let { order_items } = (detail[order_id] || {});
    let grouped = (order_items || []).reduce((a, v) => {
      let item = order_items.filter(el => el.shop_sku == v.shop_sku);
      let orders_item_id = (item || []).map(o => {
        return o.order_item_id
      })
      return ({ ...a, [v.shop_sku]: { ...v, orders_item_id, count: (item && item.length ? item.length : 0) } })
    }, {});

    let result = Object.assign({}, order, { order_items: Object.values(grouped) });
    return new ServiceResponse(true, 'Lấy đơn hàng thành công', result);
  } catch (e) {
    logger.error(e, { function: 'lazada.service.getPushLazada' });
    return new ServiceResponse(false, '', {});
  }
}


const getOrder = async (body = {}) => {
  try {
    let sellerId = apiHelper.getValueFromObject(body, 'seller_id');
    let order = apiHelper.getValueFromObject(body, 'data', {});
    let order_id = apiHelper.getValueFromObject(order, 'trade_order_id', '');
    let token = await get(`LAZADA-TOKEN:${sellerId}`);
    let { access_token = '' } = JSON.parse(token);
    if (access_token) {
      let apiGetOrder = '/order/get';
      let paramsInfo = buildParamater({ access_token, order_id: order_id }, apiGetOrder);
      let res = await doGetLazada(apiGetOrder, paramsInfo);
      let { data = {}, code, message } = res;
      if (code != '0') {
        logger.error(res, { function: 'lazada.getOrder' });
        return new ServiceResponse(false, 'Lấy đơn hàng thất bại');
      }
      return new ServiceResponse(true, 'Lấy đơn hàng thành công', data);
    }
  } catch (error) {
    logger.error(e, { function: 'lazada.service.getOrder' });
    return new ServiceResponse(false, '', {});
  }
}

const detailGenCustomerCode = async () => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request().execute('CRM_ACCOUNT_GenCustomerLazada');
    const Account = data.recordset[0];
    if (Account) {
      return new ServiceResponse(true, '', lazadaClass.genCustomerCode(Account));
    }
    return new ServiceResponse(false, '', null);
  } catch (e) {
    logger.error(e, {
      function: 'lazada.service.detailGenCustomerCode',
    });

    return new ServiceResponse(false, e.message);
  }
};


const crawlListOrderInsert = async (body = {}) => {
  let inforPush = apiHelper.getValueFromObject(body, 'data', {});
  let address = apiHelper.getValueFromObject(body, 'address_billing', {});
  let {
    address1 = '',
    address2 = '',
    address3 = '',
    address4 = '',
    address5 = '',
    city = '',
    country = '',
    phone,
    last_name,
    first_name
  } = (address || {});

  let addressfull = `${address1}, ${address2}, ${address3}, ${address4}, ${address5}, ${city}, ${country}`;
  let full_name = `${first_name} ${last_name}`


  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  try {
    await transaction.begin();
    const reqAccount = new sql.Request(transaction);
    const reqOrder = new sql.Request(transaction);
    const reqOrderDetail = new sql.Request(transaction);

    let shop_id = apiHelper.getValueFromObject(body, 'shop_id');


    const resultAccount = await reqAccount
      .input('MEMBERID', null)
      .input('CUSTOMERTYPEID', null)
      .input('USERNAME', apiHelper.getValueFromObject(inforPush, 'buyer_id'))
      .input('GENDER', 0)
      .input('FULLNAME', full_name)
      .input('PHONENUMBER', phone)
      .input('ADDRESS', addressfull)
      .input('CARINGUSER', '')
      .input('ISSYSTEM', 0)
      .input('ISACTIVE', 1)
      .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .input('CUSTOMERCODE', apiHelper.getValueFromObject(body, 'customer_code'))
      .input('SOURCEID', 11) // 12 LÀ LAZADA
      .input('LAZADABUYERID', apiHelper.getValueFromObject(inforPush, 'buyer_id'))
      .execute('CRM_ACCOUNT_CreateFromLazada_AdminWeb');
    // if(resultAccount)
    const member_id = resultAccount.recordset[0].RESULT;
    if (!member_id) {
      await transaction.rollback();
      return new ServiceResponse(false, 'Tạo khách hàng từ lazada thất bại', {});
    }
    let total_money = apiHelper.getValueFromObject(body, 'price', 0);
    let total_amount = apiHelper.getValueFromObject(body, 'price', 0);
    // let full_name = apiHelper.getValueFromObject(body, 'buyer_username', "");
    let total_shipping_fee = apiHelper.getValueFromObject(body, 'shipping_fee', 0);
    let order_sn = apiHelper.getValueFromObject(body, 'order_id', 0);
    let note = apiHelper.getValueFromObject(body, 'note', "");
    let order_items = apiHelper.getValueFromObject(body, 'order_items', []);

    const resOrder = await reqOrder
      .input('MEMBERID', member_id)
      .input('TOTALMONEY', parseInt(total_money || 0))
      .input('TOTALDISCOUNT', 0)
      .input('TOTALVAT', 0)
      .input('TOTALPAID', null)
      .input('TOTALAMOUNT', parseInt(total_money || 0))
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
      .input('ORDERNO', `${order_sn}`)
      .input('SHOPID', shop_id)
      .execute('SL_ORDER_CreateFromLazada_AdminWeb');

    let { order_id = null, order_no = null, ref_id = null } = resOrder.recordset[0];

    if (!order_id) {
      await transaction.rollback();
      return new ServiceResponse(true, 'Đặt hàng không thành công.', {});
    }

    for (let j = 0; j < order_items.length; j++) {
      let shop_sku = apiHelper.getValueFromObject(order_items[j], 'shop_sku', 0);
      // let product_id = shop_sku.split("_");
      let product_id = apiHelper.getValueFromObject(order_items[j], 'sku_id', 0);

      let item_name = apiHelper.getValueFromObject(order_items[j], 'name', 0);
      let quantity = apiHelper.getValueFromObject(order_items[j], 'count', 0);
      let total_price = apiHelper.getValueFromObject(order_items[j], 'item_price', 0);
      let change_price = apiHelper.getValueFromObject(order_items[j], 'item_price', 0);
      const resOrderDetail = await reqOrderDetail
        .input('ORDERID', order_id)
        .input('PRODUCTID', `${product_id}`)
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
        .execute('SL_ORDERDETAIL_CreateFromLazada_AdminWeb');

      let { RESULT: order_detail_id = 0 } = resOrderDetail.recordset[0];
      if (!order_detail_id) {
        await transaction.rollback();
        return new ServiceResponse(false, 'Lưu chi tiết đơn hàng không thành công.', {});
      }
    }
    await transaction.commit();
    return new ServiceResponse(true, '', { is_success: true, });

  } catch (error) {
    await transaction.rollback();
    logger.error(error.message, { function: 'lazada.service.InsertOrder' });
    return new ServiceResponse(true, '', {});
  }
}

const updateOrderStatus = async (body = {}) => {
  try {
    let query = apiHelper.getValueFromObject(body, 'data');
    let status = apiHelper.getValueFromObject(query, 'order_status');
    let ordersn = apiHelper.getValueFromObject(query, 'trade_order_id');
    const pool = await mssql.pool;
    await pool.request()
      .input('KEY', status)
      .input('ORDERSN', ordersn)
      .execute('SL_ORDER_UpdateCodeLazada_AdminWeb');
    return new ServiceResponse(true, '', {});

  } catch (e) {
    logger.error(e, { function: 'lazada.service.UpdateStatus' });
    return new ServiceResponse(false, '', {});
  }
}


const updateSingleStockLazada = async (body = {}) => {
  try {
    ;
    let sellerId = apiHelper.getValueFromObject(body, 'shop_id');
    let skus = apiHelper.getValueFromObject(body, 'skus');
    let product_portal = apiHelper.getValueFromObject(body, 'product_portal');
    let item_id = apiHelper.getValueFromObject(body, 'item_id');

    let quantity = apiHelper.getValueFromObject(product_portal, 'total_inventory');
    let token = await get(`LAZADA-TOKEN:${sellerId}`);

    if (token == 'null' || !token) {
      return new ServiceResponse(false, 'Refesh', { is_refesh: true });
    }
    let { access_token = '' } = JSON.parse(token);
    if (access_token) {
      let apiUpdateQuantity = '/product/price_quantity/update';
      // format payload để gửi sang lazada
      let payLoad = fomatProductLazadaDefault([skus], item_id, quantity);
      let payloadXML = OBJtoXML(payLoad);
      let paramsInfo = buildParamater({ payload: payloadXML, access_token }, apiUpdateQuantity);
      let resUpdateQuantity = await doPostLazada(apiUpdateQuantity, paramsInfo);
      let { code, data = {}, message } = (resUpdateQuantity || {});
      if (code != '0') {
        logger.error(resUpdateQuantity, { function: 'lazada.updateStocksSingle' });
        return new ServiceResponse(false, 'Lỗi cập nhật số lượng sản phẩm Lazada',);
      }

      let skusUpdate = ([skus] || []).map(sku => {
        let { multiWarehouseInventories = [] } = (sku || []);
        return {
          ...sku,
          quantity: (quantity - sumTotalSubQuantity(multiWarehouseInventories)) > 0 ? quantity - sumTotalSubQuantity(multiWarehouseInventories) : 0
        }
      })
      let result = {
        ...body,
        skus: skusUpdate,
        quantity: sumTotalQuanity(skusUpdate),
        is_refesh: true
      }
      return new ServiceResponse(true, 'Cập nhật thông tin sản phẩm Lazada', result);
    }
    return new ServiceResponse(false, 'Không tìm thấy Token', {});
  } catch (error) {
    logger.error(error.message, { function: 'lazada.Service.UpdateStockSingleLazada' });
    return new ServiceResponse(false, '', {});
  }
};


const updateSellableLazada = async (body = {}) => {
  try {
    let sellerId = apiHelper.getValueFromObject(body, 'shop_id');
    let skus = apiHelper.getValueFromObject(body, 'skus');
    let product_portal = apiHelper.getValueFromObject(body, 'product_portal');
    let item_id = apiHelper.getValueFromObject(body, 'item_id');

    let quantity = apiHelper.getValueFromObject(product_portal, 'total_inventory');
    let token = await get(`LAZADA-TOKEN:${sellerId}`);
    if (token == 'null' || !token) {
      return new ServiceResponse(false, 'Refesh', { is_refesh: true });
    }
    let { access_token = '' } = JSON.parse(token);
    if (access_token) {
      let apiUpdateQuantity = '/product/stock/sellable/update';
      // format payload để gửi sang lazada
      let payLoad = fomatProductLazadaDefaultSellable([skus], item_id, quantity);
      let payloadXML = OBJtoXML(payLoad);
      let paramsInfo = buildParamater({ payload: payloadXML, access_token }, apiUpdateQuantity);
      let resUpdateQuantity = await doPostLazada(apiUpdateQuantity, paramsInfo);
      let { code, data = {}, message } = (resUpdateQuantity || {});
      if (code != '0') {
        logger.error(resUpdateQuantity, { function: 'lazada.updateSellable' });
        return new ServiceResponse(false, 'Lỗi cập nhật số lượng bán của sản phẩm Lazada',);
      }

      let skusUpdate = ([skus] || []).map(sku => {
        let { multiWarehouseInventories = [] } = (sku || []);
        return {
          ...sku,
          quantity: sumTotalQuanity(multiWarehouseInventories)
        }
      })
      let result = {
        ...body,
        skus: skusUpdate,
        quantity: sumTotalQuanity(skusUpdate),
        is_refesh: true
      }
      return new ServiceResponse(true, 'Cập nhật số lượng bán của sản phẩm Lazada', result);
    }
    return new ServiceResponse(false, 'Không tìm thấy Token', {});
  } catch (error) {
    logger.error(error.message, { function: 'lazada.Service.updateSellableLazada' });
    return new ServiceResponse(false, '', {});
  }
};


/**
 * Get list Inventory site to compare shopee
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListProductStocksDetailLazada = async (queryParams = {}) => {
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
      .input('SHOPID', `${apiHelper.getValueFromObject(queryParams, 'shop_id')}`)
      .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'user_name'))
      .execute('ST_STOCKSDETAIL_GetListLazada_AdminWeb');
    const StocksDetails = data.recordsets[0];
    let result = lazadaClass.listInventory(StocksDetails);
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



const updateListProductLazada = async (body = {}) => {
  try {
    let sellerId = apiHelper.getValueFromObject(body, 'shop_id');
    let list_product = apiHelper.getValueFromObject(body, 'list_product_checked');

    let list_map = await Promise.all((list_product || []).map(async (product) => {
      let result = await updateSingleStockLazada({ ...product, shop_id: sellerId });
      if (result.isSuccess()) {
        return {
          ...result.getData(),
          is_pass: true,
        }
      }else{
        return{
          ...product,
          is_pass: false,
        }
      }
    }));

    return new ServiceResponse(true, 'Cập nhật thông tin danh sách sản phẩm Lazada', list_map);

  } catch (error) {
    logger.error(error.message, { function: 'lazada.Service.UpdateStockSingleLazada' });
    return new ServiceResponse(false, '', {});
  }
};


// let listOrderConfirm = await Promise.all(
//   (Object.values(list_order) || []).map(async (item) => {
//     let result = await shipOrderSingle({ ...item, shop_id: shop_id });
//     if (result.isSuccess()) {
//       return {
//         order_sn: item.order_sn,
//         is_pass: true,
//       }
//     } else {
//       return {
//         order_sn: item.order_sn,
//         is_pass: false,
//       }
//     }
//   })
// )

module.exports = {
  connectLazada,
  getListShopProfile,
  getProduct,
  updateProductIDLazada,
  getOptsStocks,
  getProductOptions,
  deleteIDLazada,
  getWareHouse,
  updateStockLazada,
  getListOrder,
  printShipping,
  createPackOrder,
  createReadyToShip,
  getOptionCancel,
  cancelOrder,
  updateFailedOrSuccessOrder,
  removeToken,
  deleteShopProfile,
  getconnectLazada,
  updateStocks,
  getPushLazada,
  detailGenCustomerCode,
  crawlListOrderInsert,
  updateOrderStatus,
  updateSingleStockLazada,
  updateSellableLazada,
  updateListProductLazada
  // updateStockLazadaDefault
};
