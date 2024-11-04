import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { notification } from 'antd';
import FormItem from 'components/shared/BWFormControl/FormItem';
import { getOptionStock, getListShopProfile, updateStocksId } from '../../helpers/call-api-lazada';
import { showToast } from 'utils/helpers';

const FilterProduct = ({ onChange, shop_id }) => {
  const methods = useForm();
  const { watch } = methods;
  const [listStocksTypeOpts, setListStocksTypeOpts] = useState([]);
  const [listShopProfile, setListShopProfile] = useState([]);

  useEffect(() => {
    methods.reset({
      is_active: 1,
    });
  }, [methods]);

  useEffect(() => {
    getDataFilter();
  }, []);

  useEffect(() => {
    getListOptionsShopProfile();
  }, []);

  const getDataFilter = async () => {
    try {
      let data = await getOptionStock();
      setListStocksTypeOpts(data);
    } catch (error) {
      notification.error({ message: `Có lỗi xảy ra.` });
    }
  };

  const getListOptionsShopProfile = async () => {
    try {
      let res = await getListShopProfile();
      let { data = {} } = res || {};
      let { listLazada = [], listShopee = [] } = data || {};
      setListShopProfile(listShopee);
      methods.setValue(
        'shop_id',
        listShopee && listShopee.length > 0 && listShopee[0] && listShopee[0].shop_id ? listShopee[0].shop_id : null,
      );
      methods.setValue(
        'stock_id',
        listShopee && listShopee.length > 0 && listShopee[0] && listShopee[0].stock_id ? listShopee[0].stock_id : null,
      );
    } catch (error) {
      notification.error({ message: `Có lỗi xảy ra.` });
    }
  };

  const onClear = () => {
    methods.reset({
      is_active: 1,
    });
    onChange({
      search: '',
    });
  };

  const onSubmit = async (values) => {
    try {
      await updateStocksId(values);
      onChange({
        itemsPerPage: 10,
        page: 1,
      });
      showToast.success(`Đồng bộ kho với gian hàng thành công`, {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
    } catch (error) {
      showToast.error(error ? error.message : 'Có lỗi xảy ra!', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    }
  };

  return (
    <React.Fragment>
      <FormProvider {...methods}>
        <div className='bw_row'>
          <div className='bw_col_12'>
            <div className='bw_frm_box bw_readonly'>
              <div className='bw_row'>
                <h3 className='bw_title_search bw_col_12'>Liên kết hàng hoá</h3>
                <h5
                  className='bw_mb_2 bw_col_12'
                  style={{
                    paddingLeft: '10px',
                  }}>
                  Liên kết hàng hoá từ sàn Shopee
                </h5>
              </div>
              <div className='bw_row'>
                <FormItem label='Gian hàng' className='bw_col_4'>
                  <FormSelect
                    field='shop_id'
                    id='shop_id'
                    list={listShopProfile}
                    allowClear={true}
                    value={shop_id}
                    onChange={(value) => methods.setValue('shop_id', value)}
                  />
                </FormItem>
                <FormItem label='Kho đồng bộ' className='bw_col_4'>
                  <FormSelect
                    field='stock_id'
                    id='stock_id'
                    list={listStocksTypeOpts}
                    allowClear={true}
                    onChange={(value) => methods.setValue('stock_id', value)}
                  />
                </FormItem>
                <div
                  className='bw_flex bw_justify_content_center'
                  style={{
                    marginBottom: '10px',
                  }}>
                  <button
                    type='button'
                    onClick={methods.handleSubmit(onSubmit)}
                    className='bw_btn bw_btn_success'
                    style={{
                      marginLeft: '8px',
                      marginRight: '8px',
                    }}>
                    <span className='fi fi-rr-filter'></span>
                    Đồng bộ kho
                  </button>
                  {/* <button type="button" onClick={onClose} className="bw_btn_outline bw_btn_outline_success bw_close_modal">
                    <span className="fi fi-rr-refresh"></span>
                    Đóng
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </FormProvider>
    </React.Fragment>
  );
};

export default FilterProduct;
