const mssql = require('../../models/mssql');
const logger = require('../../common/classes/logger.class');
const apiHelper = require('../../common/helpers/api.helper');
const { calTotalQuantity, findCogs, keysConfigMapping, CALCULATE_METHODS } = require('./utils/helper');
const stocksDetailClass = require('./stocks-detail.class');
const ServiceResponse = require('../../common/responses/service.response');
const moment = require('moment');

const isValidTimeCalculating = async (queryParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request().execute('ST_COGS_CheckValidCalculating_AdminWeb');

    if (!data.recordset[0]?.ISVALID) return false;
    return true;
  } catch (e) {
    logger.error(e, { function: 'stocksDetailService.isValidTimeCalculating' });
    return false;
  }
};

const getCogsSettings = async (queryParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('KEYSCONFIG', Object.values(keysConfigMapping).join('|'))
      .execute('ST_COGS_GetCogSettings_AdminWeb');

    const result = stocksDetailClass.configsSettings(data.recordset);
    if (parseInt(result.need_calculate_goods) === 1) {
      result.choose_calculate_goods = 0;
      result.selected_product = [];
    } else {
      result.choose_calculate_goods = 1;
    }
    result.all_days = result.type_run_service === 1 ? 1 : 0;
    result.last_days_of_month = result.type_run_service === 2 ? 1 : 0;

    result.calculate_according_stocks = result.type_calculating === 1 ? 1 : 0;
    result.calculate_not_according_stocks = result.type_calculating === 2 ? 1 : 0;

    return result;
  } catch (e) {
    logger.error(e, { function: 'stocksDetailService.getCogsSettings' });
    return {};
  }
};

const getListProductForCogs = async (queryParams) => {
  try {
    const pool = await mssql.pool;

    const data = await pool
      .request()
      .input('STOCKSID', apiHelper.getValueFromObject(queryParams, 'stocks_id'))
      .execute('ST_COGS_GetAllProduct_AdminWeb');

    return stocksDetailClass.product(data.recordset);
  } catch (e) {
    logger.error(e, { function: 'stocksDetailService.getListProductForCogs' });
    return [];
  }
};

const calStocksIn = async ({ stocks_ids, stocks_id, product_id, start_date, end_date }) => {
  try {
    const pool = await mssql.pool;
    const stocksIntRes = await pool
      .request()
      .input('STOCKSLIST', stocks_ids)
      .input('STOCKSID', stocks_id)
      .input('PRODUCTID', product_id)
      .input('STARTDATE', start_date)
      .input('ENDDATE', end_date)
      .execute('ST_COGS_GetStocksIn_AdminWeb');
    return stocksIntRes.recordset[0] ?? { total_money: 0, quantity: 0 };
  } catch (error) {
    logger.error(error, { function: 'stocksDetailService.calStocksIn' });
    return { total_money: 0, quantity: 0 };
  }
};

const createOrUpdateCogs = async (queryParams) => {
  try {
    const pool = await mssql.pool;
    const res = await pool
      .request()
      .input('COGSID', null)
      .input('PRICINGMETHODID', queryParams.calculate_method)
      .input('STOCKSID', queryParams.stocks_id)
      .input('STARTDATE', queryParams.start_date)
      .input('ENDDATE', queryParams.end_date)
      .input('PRODUCTID', queryParams.product_id)
      .input('COGSPRICE', queryParams._cogs)
      .input('PERIOD', queryParams.period)
      .input('CREATEDUSER', queryParams.auth_name)
      .execute('ST_COGS_CreateOrUpdate_AdminWeb');
    const result = res.recordset[0].RESULT;
    if (!result) {
      throw Error('Tính giá xuất kho thất bại');
    }
    return true;
  } catch (e) {
    logger.error(e, { function: 'stocksDetailService.getListProductForCogs' });
    return false;
  }
};

const calInvertoryLastest = async ({ stocks_ids, stocks_id, product_id, start_date }) => {
  try {
    const pool = await mssql.pool;
    const dataRes = await pool
      .request()
      .input('STOCKSID', stocks_id)
      .input('STOCKSLIST', stocks_ids)
      .input('PRODUCTID', product_id)
      .input('STARTDATE', start_date)
      .execute('ST_COGS_GetInventoryLast_AdminWeb');
    return dataRes.recordset[0]?.TOTALINVENTORY ?? 0;
  } catch (error) {
    logger.error(error, { function: 'stocksDetailService.calInvertoryLastest' });
    return 0;
  }
};

const calPriceExport = async (queryParams = {}) => {
  try {
    const calculate_not_according_stocks = queryParams.calculate_not_according_stocks;
    const all_product = queryParams.all_product;
    const stocksIn = queryParams.stocksIn;
    const stocksOut = queryParams.stocksOut;
    let stocks_ids = queryParams.stocks_ids;
    // Tính giá theo kho ko cần stocks_ids
    if (!calculate_not_according_stocks) {
      stocks_ids = null;
    }
    const start_date = queryParams.start_date;
    const end_date = queryParams.end_date;
    const calculate_method = queryParams.calculate_method;
    const period = queryParams.period;
    let stocks_id = queryParams.stocks_id;
    const current_stocks_id = stocks_id;
    if (calculate_not_according_stocks) {
      stocks_id = null;
    }
    const cogs_list = queryParams.cogs_list; // tìm giá xuất của kỳ trước đó
    let cogs_list_instance = {};
    if (!calculate_not_according_stocks) {
      for (const item of cogs_list) {
        if (item.cogs_price <= 0) continue;
        if (!cogs_list_instance[`${item.product_id}_${item.stocks_id}`]) {
          // Lấy giá xuất kho mới nhất
          cogs_list_instance[`${item.product_id}_${item.stocks_id}`] = item;
        }
      }
    }
    const auth_name = queryParams.auth_name ?? 'administrator';
    let _cogs;
    for (const item of all_product) {
      // Tổng số lượng và tổng tiền nhập từ ngày đến ngày
      const { quantity, total_money } = await calStocksIn({
        stocks_ids,
        stocks_id,
        product_id: item.product_id,
        start_date,
        end_date,
      });
      const cogs = calculate_not_according_stocks
        ? cogs_list[0]
        : cogs_list_instance[`${item.product_id}_${stocks_id}`];

      if (!cogs) {
        // nếu không có giá xuất
        _cogs = Math.round(total_money / quantity);
      } else {
        // Bình quân sau mỗi lần nhập
        if (calculate_method === CALCULATE_METHODS.CONTINUOSAVCO) {
          // Lấy lần nhập mới nhất
          const { total_in, total_price_cost } = stocksIn.shift();
          // nếu có giá xuất kho
          const total_in_quantity = calTotalQuantity(stocksIn, item.product_id, stocks_id, 'total_in') ?? 0; // Tổng số lượng nhâp kho của sản phẩm không bao gồm lần nhập mới nhất
          const total_out_quantity = calTotalQuantity(stocksOut, item.product_id, stocks_id, 'total_out') ?? 0; // Tổng số lượng xuất kho của sản phẩm

          // Tính V1
          // let inventory_quantity = total_in_quantity - total_out_quantity; // số lượng tồn kho của kỳ trước đó
          // let inventory_money = inventory_quantity * cogs?.cogs_price; // tổng thành tiền tồn kỳ trước đó
          // _cogs = Math.round((total_money + inventory_money) / (quantity + inventory_quantity));

          // Tính V2
          let inventory_quantity = total_in_quantity - total_out_quantity; // số lượng tồn kho của kỳ trước đó
          let inventory_money = inventory_quantity * cogs?.cogs_price; // tổng thành tiền tồn kỳ trước đó
          let total_in_money_lastest = total_in * total_price_cost; // tổng tiền của lần nhập mới nhất
          _cogs = Math.round((inventory_money + total_in_money_lastest) / (inventory_quantity + total_in));

          // Nếu ko có nhập kho trong khoảng thời gian thì lấy giá xuất kho gần nhất
          if (quantity <= 0) {
            _cogs = cogs?.cogs_price;
          }
        } else if (calculate_method === CALCULATE_METHODS.PREIODICAVCO) {
          // Bình quân cuối kỳ

          // Tồn cuối kỳ tháng trước
          const total_inventory_lastest = await calInvertoryLastest({
            stocks_id: current_stocks_id,
            stocks_ids,
            start_date,
            product_id: item.product_id,
          });

          // Tính V2
          let inventory_money = total_inventory_lastest * cogs?.cogs_price; // tổng thành tiền tồn kỳ trước đó
          _cogs = Math.round((inventory_money + total_money) / (total_inventory_lastest + quantity));

          // Nếu ko có nhập kho trong khoảng thời gian thì lấy giá xuất kho gần nhất
          if (quantity <= 0) {
            _cogs = cogs?.cogs_price;
          }
        }
      }
      if (isNaN(_cogs)) _cogs = 0;

      await createOrUpdateCogs({
        calculate_method,
        stocks_id: current_stocks_id,
        start_date,
        end_date,
        product_id: item.product_id,
        _cogs,
        period,
        auth_name,
      });
    }
  } catch (e) {
    logger.error(e, { function: 'stocksDetailService.calPriceExport' });
    return [];
  }
};

const calculateOutStocks = async (params = {}) => {
  try {
    const isValidCal = await isValidTimeCalculating();
    if (!isValidCal) return;

    const dataSettings = await getCogsSettings();
    params = { ...params, ...dataSettings };
    if (Object.values(params).length === 0) throw Error('Tính giá xuất kho thất bại');

    const pool = await mssql.pool;
    const calculate_method = apiHelper.getValueFromObject(params, 'calculate_method', null);
    if (!Object.values(CALCULATE_METHODS).includes(calculate_method))
      return new ServiceResponse(false, 'Phương pháp tính đang phát triển');

    const auth_name = apiHelper.getValueFromObject(params, 'auth_name', null);
    let stocks_type_list = apiHelper.getValueFromObject(params, 'stocks_type_list_settings', []);
    if (!Array.isArray(stocks_type_list)) {
      stocks_type_list = [stocks_type_list];
    }
    const need_calculate_goods = apiHelper.getValueFromObject(params, 'need_calculate_goods', null); // Hàng hóa cần tính giá
    let selected_product = apiHelper.getValueFromObject(params, 'selected_product', []);
    if (!Array.isArray(selected_product)) {
      selected_product = [selected_product];
    }

    const choose_calculate_goods = apiHelper.getValueFromObject(params, 'choose_calculate_goods', null); // Hàng hóa được chọn
    const product_list = choose_calculate_goods
      ? selected_product?.map((item) => ({ product_id: item.product_id ?? item }))
      : null;
    const calculate_date = apiHelper.getValueFromObject(params, 'calculate_date');
    const start_date = apiHelper.getValueFromObject(params, 'start_date_settings');
    const end_date = apiHelper.getValueFromObject(params, 'end_date_settings');
    const period = apiHelper.getValueFromObject(params, 'period_settings');
    const calculate_according_stocks = apiHelper.getValueFromObject(params, 'calculate_according_stocks', null);
    const calculate_not_according_stocks = apiHelper.getValueFromObject(params, 'calculate_not_according_stocks', null);
    let store_ids = apiHelper.getValueFromObject(params, 'store_ids_settings', []);
    if (!Array.isArray(store_ids)) {
      store_ids = [store_ids];
    }

    let stocks_ids = apiHelper.getValueFromObject(params, 'stocks_ids_settings', []);

    if (!Array.isArray(stocks_ids)) {
      stocks_ids = [stocks_ids];
    }
    let stocksList = stocks_ids?.map((item) => ({ stocks_id: item }));
    if (stocks_ids.length === 0) {
      //Select stocks by stocks type if not exists stocks_ids config
      const stocksRes = await pool
        .request()
        .input('STOCKSTYPELIST', stocks_type_list.map((item) => item.id ?? item).join('|'))
        .input('STOREIDS', store_ids.map((item) => item.id ?? item).join('|'))
        .execute('ST_COGS_GetStocksByStocksType_AdminWeb');
      stocksList = stocksDetailClass.stocksList(stocksRes.recordset);
    }
    stocks_ids = stocksList.map((item) => item.stocks_id ?? item).join('|');

    if (calculate_method === CALCULATE_METHODS.CONTINUOSAVCO) {
      // Tính giá từ start_date đến end_date + 1
      const dateFormat = 'DD/MM/YYYY';
      const startDate = moment(start_date, dateFormat);
      const endDate = moment(end_date, dateFormat).add(1, 'days');

      // Ngày lặp trước đó
      let current_date = start_date;

      const calStocksWaiting = async (currentDate, endDate, time = 300) => {
        let prev_date = currentDate.format(dateFormat);
        current_date = prev_date;

        // =========== Tính giá xuất kho =================
        // bình quân gia quyền cuối kỳ || bình quân gia quyền mỗi lần nhập
        const stocksInStocksOutRes = await pool
          .request()
          .input('STOCKSLIST', stocks_ids)
          .input('PRODUCTLIST', selected_product?.join('|'))
          .input('STARTDATE', current_date)
          .input('ENDDATE', prev_date)
          .input('PERIOD', period)
          .input('PRICINGMETHODID', calculate_method)
          .execute('ST_COGS_GetInventoryPrePeriod_AdminWeb');
        const stocksIn = stocksDetailClass.stocksIn(stocksInStocksOutRes.recordsets[0]);
        const stocksOut = stocksDetailClass.stocksOut(stocksInStocksOutRes.recordsets[1]);
        const cogs_list = stocksDetailClass.cogs(stocksInStocksOutRes.recordsets[2]);

        if (parseInt(need_calculate_goods) === 1) {
          // Hàng hóa cần tính giá --- tính tất cả hàng hóa trong kho được chọn
          let all_product = await getListProductForCogs();
          if (calculate_not_according_stocks) {
            // tính giá không theo kho
            for (let i = 0; i < stocksList.length; i++) {
              const isSuccess = calPriceExport({
                all_product,
                stocksIn,
                stocksOut,
                stocks_ids,
                start_date: current_date,
                end_date: prev_date,
                calculate_method,
                period,
                stocks_id: stocksList[i].stocks_id,
                cogs_list,
                calculate_not_according_stocks,
                auth_name,
              });
              // if (!isSuccess) return new ServiceResponse(false, 'Tính giá thất bại');
            }
          } else if (calculate_according_stocks) {
            // tính giá theo kho
            for (let i = 0; i < stocksList.length; i++) {
              all_product = await getListProductForCogs({ stocks_id: stocksList[i].stocks_id });
              const isSuccess = calPriceExport({
                all_product,
                stocksIn,
                stocksOut,
                stocks_ids,
                start_date: current_date,
                end_date: prev_date,
                calculate_method,
                period,
                stocks_id: stocksList[i].stocks_id,
                cogs_list,
                calculate_not_according_stocks,
                auth_name,
              });
              // if (!isSuccess) return new ServiceResponse(false, 'Tính giá thất bại');
            }
          }
        } else if (choose_calculate_goods) {
          // Hàng hóa được chọn
          if (calculate_not_according_stocks) {
            // tính giá không theo kho
            for (let i = 0; i < stocksList.length; i++) {
              const isSuccess = calPriceExport({
                all_product: product_list,
                stocksIn,
                stocksOut,
                stocks_ids,
                start_date: current_date,
                end_date: prev_date,
                calculate_method,
                period,
                stocks_id: stocksList[i].stocks_id,
                cogs_list,
                calculate_not_according_stocks,
                auth_name,
              });
              // if (!isSuccess) return new ServiceResponse(false, 'Tính giá thất bại');
            }
          } else if (calculate_according_stocks) {
            // tính giá theo kho

            for (let i = 0; i < stocksList.length; i++) {
              const isSuccess = calPriceExport({
                all_product: product_list,
                stocksIn,
                stocksOut,
                stocks_ids,
                start_date: current_date,
                end_date: prev_date,
                calculate_method,
                period,
                stocks_id: stocksList[i].stocks_id,
                cogs_list,
                calculate_not_according_stocks,
                auth_name,
              });
              // if (!isSuccess) return new ServiceResponse(false, 'Tính giá thất bại');
            }
          }
        }
        // =========== End Tính giá xuất kho ===============

        // Kiểm tra điều kiện dừng
        if (currentDate.isSameOrBefore(endDate)) {
          // Gọi lại hàm sau 1 giây
          setTimeout(async () => {
            await calStocksWaiting(currentDate.clone().add(1, 'days'), endDate);
          }, time);
        }
      };

      await calStocksWaiting(startDate, endDate);
    } else if (calculate_method === CALCULATE_METHODS.PREIODICAVCO) {
      // Bình quân cuối kỳ
      // Tính giá từ start_date đến end_date + 1
      const dateFormat = 'DD/MM/YYYY';
      const startDate = moment(start_date, dateFormat);
      const endDate = moment(end_date, dateFormat).add(1, 'months');

      // Tạo một mảng các tháng trong khoảng thời gian
      const monthsInRange = [];
      let currentDate = startDate.clone();

      while (currentDate.isSameOrBefore(endDate)) {
        monthsInRange.push(currentDate.clone());
        currentDate.add(1, 'month');
      }

      const calStocksDelay = async (index, time = 1500) => {
        if (index < monthsInRange.length) {
          const currentMonth = monthsInRange[index];
          const firstDay = currentMonth.clone().startOf('month').format('DD/MM/YYYY');
          const lastDay = currentMonth.clone().endOf('month').format('DD/MM/YYYY');
          // =========== Tính giá xuất kho =================
          // bình quân gia quyền cuối kỳ || bình quân gia quyền mỗi lần nhập
          const stocksInStocksOutRes = await pool
            .request()
            .input('STOCKSLIST', stocks_ids)
            .input('PRODUCTLIST', selected_product?.join('|'))
            .input('STARTDATE', firstDay)
            .input('ENDDATE', lastDay)
            .input('PERIOD', period)
            .input('PRICINGMETHODID', calculate_method)
            .execute('ST_COGS_GetInventoryPrePeriod_AdminWeb');
          const stocksIn = stocksDetailClass.stocksIn(stocksInStocksOutRes.recordsets[0]);
          const stocksOut = stocksDetailClass.stocksOut(stocksInStocksOutRes.recordsets[1]);
          const cogs_list = stocksDetailClass.cogs(stocksInStocksOutRes.recordsets[2]);

          if (parseInt(need_calculate_goods) === 1) {
            // Hàng hóa cần tính giá --- tính tất cả hàng hóa trong kho được chọn
            let all_product = await getListProductForCogs();
            if (calculate_not_according_stocks) {
              // tính giá không theo kho
              for (let i = 0; i < stocksList.length; i++) {
                const isSuccess = calPriceExport({
                  all_product,
                  stocksIn,
                  stocksOut,
                  stocks_ids,
                  start_date: firstDay,
                  end_date: lastDay,
                  calculate_method,
                  period,
                  stocks_id: stocksList[i].stocks_id,
                  cogs_list,
                  calculate_not_according_stocks,
                  auth_name,
                });
                // if (!isSuccess) return new ServiceResponse(false, 'Tính giá thất bại');
              }
            } else if (calculate_according_stocks) {
              // tính giá theo kho
              for (let i = 0; i < stocksList.length; i++) {
                all_product = await getListProductForCogs({ stocks_id: stocksList[i].stocks_id });
                const isSuccess = calPriceExport({
                  all_product,
                  stocksIn,
                  stocksOut,
                  stocks_ids,
                  start_date: firstDay,
                  end_date: lastDay,
                  calculate_method,
                  period,
                  stocks_id: stocksList[i].stocks_id,
                  cogs_list,
                  calculate_not_according_stocks,
                  auth_name,
                });
                // if (!isSuccess) return new ServiceResponse(false, 'Tính giá thất bại');
              }
            }
          } else if (choose_calculate_goods) {
            // Hàng hóa được chọn
            if (calculate_not_according_stocks) {
              // tính giá không theo kho
              for (let i = 0; i < stocksList.length; i++) {
                const isSuccess = calPriceExport({
                  all_product: product_list,
                  stocksIn,
                  stocksOut,
                  stocks_ids,
                  start_date: firstDay,
                  end_date: lastDay,
                  calculate_method,
                  period,
                  stocks_id: stocksList[i].stocks_id,
                  cogs_list,
                  calculate_not_according_stocks,
                  auth_name,
                });
                // if (!isSuccess) return new ServiceResponse(false, 'Tính giá thất bại');
              }
            } else if (calculate_according_stocks) {
              // tính giá theo kho

              for (let i = 0; i < stocksList.length; i++) {
                const isSuccess = calPriceExport({
                  all_product: product_list,
                  stocksIn,
                  stocksOut,
                  stocks_ids,
                  start_date: firstDay,
                  end_date: lastDay,
                  calculate_method,
                  period,
                  stocks_id: stocksList[i].stocks_id,
                  cogs_list,
                  calculate_not_according_stocks,
                  auth_name,
                });
                // if (!isSuccess) return new ServiceResponse(false, 'Tính giá thất bại');
              }
            }
          }
          // =========== End Tính giá xuất kho ===============

          // Dừng 1 giây trước khi chạy vòng lặp tiếp theo để data kịp lưu xuống db
          setTimeout(async () => {
            await calStocksDelay(index + 1);
          }, time);
        }
      };

      await calStocksDelay(0);
    }

    return new ServiceResponse(true, 'Tính giá xuất kho thành công');
  } catch (e) {
    logger.error(e, { function: 'stocksDetailService.calculateOutStocks' });
    return new ServiceResponse(false, e.message || e);
  }
};

module.exports = {
  calculateOutStocks,
};
