import FormSection from 'components/shared/FormSection';
import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import StockOutPrice from './components/StockOutPrice';
import DivideProduct from './components/DivideProduct';
import { getConfigValue } from 'services/app-config.service';
import { notification } from 'antd';
import { mapDataOptions4Select } from 'utils/helpers';
import { toString } from 'lodash';
import { getBusinessOptions } from 'services/business.service';
import { getOptionsProduct, getOptionsStockType } from 'services/product.service';
import { getOptionsStocks } from 'services/stocks.service';
import { getOptionsStocksInType } from 'services/stocks-in-request.service';
import { getOptionsStore } from 'services/store.service';

const StockConfig = () => {
  const methods = useFormContext();
  const { watch, setValue } = methods;
  const [loadDetail, setLoadDetail] = useState(0);

  const customToString = (data) => {
    data = mapDataOptions4Select(data);
    data.forEach((item) => {
      item.id = toString(item.id);
    });
    return data;
  };

  const getOptions = useCallback(() => {
    getBusinessOptions().then((data) => {
      setValue('bussiness_option', customToString(data));
    });
    getOptionsStore({
      business_ids:
        Array(methods.watch('ST_COGS_BUSINESSIDS_SETTINGS')).length >= 1
          ? Array(methods.watch('ST_COGS_BUSINESSIDS_SETTINGS')).join(',')
          : null,
    }).then((data) => {
      setValue('store_option', customToString(data));
    });
    getOptionsStockType({}).then((data) => {
      setValue('stock_type_option', customToString(data));
    });

    getOptionsProduct().then((data) => {
      setValue('product_option', customToString(data));
    });
    getOptionsStocksInType().then((data) => {
      setValue('stock_in_type_option', customToString(data));
    });
  }, []);

  const keys = [
    'ST_COGS_STARTDATE_SETTINGS',
    'ST_COGS_ENDDATE_SETTINGS',
    'ST_COGS_TIMECALCULATING_SETTINGS',
    'ST_COGS_BUSINESSIDS_SETTINGS',
    'ST_COGS_STOCKSIDS_SETTINGS',
    'ST_COGS_STOREIDS_SETTINGS',
    'ST_COGS_STOCKSTYPE_SETTINGS',
    'ST_COGS_CALCULATEMETHODS_SETTINGS',
    'ST_COGS_ISALLPRODUCT_SETTINGS',
    'ST_COGS_PRODUCTIDS_SETTINGS',
    'ST_COGS_CALCULATEDATE_SETTINGS',
    'ST_COGS_PERIOD_SETTINGS',
    'ST_COGS_TYPECALCULATING_SETTINGS',
    'STOCKSTYPEDIVISION',
    'STOCKSINTYPEDIVISION',
  ];
  const getDetail = useCallback(async () => {
    try {
      keys.map(async (key) => {
        await getConfigValue({ key_config: key })
          .then((data) => {
            let value = toString(data[0].value_config);
            if (value.includes('|')) {
              value = value.split('|');
            }
            setValue(key, value);
          })
          .finally(() => {
            setLoadDetail(1);
          });
      });
    } catch (error) {
      notification.error({ message: window._$g._(error.message) });
    }
  }, []);

  useEffect(getDetail, [getDetail]);
  useEffect(() => {
    if (loadDetail == 1) {
      getOptions();
    }
  }, [loadDetail, watch('ST_COGS_BUSINESSIDS_SETTINGS')]);

  useEffect(() => {
    getOptionsStocks({
      stock_type_id: methods.watch('ST_COGS_STOCKSTYPE_SETTINGS') ? methods.watch('ST_COGS_STOCKSTYPE_SETTINGS') : null,
      store_ids:
        Array(methods.watch('ST_COGS_STOREIDS_SETTINGS')).length >= 1
          ? Array(methods.watch('ST_COGS_STOREIDS_SETTINGS')).join(',')
          : methods.watch('ST_COGS_STOREIDS_SETTINGS'),
    }).then((data) => {
      setValue('stock_option', customToString(data));
    });
  }, [watch('store_option')]);

  const detailForm = [
    // {
    //   title: 'Cài đặt tính giá xuất kho',
    //   id: 'stockOutPriceConfig',
    //   component: StockOutPrice,
    // },
    {
      title: 'Cài đặt chia hàng',
      id: 'divideProductConfig',
      component: DivideProduct,
    },
  ];
  return <FormSection detailForm={detailForm} />;
};

export default StockConfig;
