import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { notification } from 'antd';
import FormItem from 'components/shared/BWFormControl/FormItem';
import { getOptionStock, getListShopProfile, updateStocksId } from '../../helpers/call-api-lazada';
import { showToast } from 'utils/helpers';

const FilterOrder = ({ onChange, paramsOrder = {} }) => {
  const methods = useForm();
  const { watch } = methods;
  const [listStocksTypeOpts, setListStocksTypeOpts] = useState([]);
  const [listShopProfile, setListShopProfile] = useState([]);
  // const [defaultTypeOrder, setDefaultType] = useState('pending');
  const [optionsTypeOrder, setOptionsTypeOrder] = useState([
    {
      value: 'unpaid',
      label: 'Chưa thanh toán',
    },
    {
      value: 'pending',
      label: 'Chưa xử lý',
    },
    {
      value: 'ready_to_ship',
      label: 'Đã xử lý',
    },
    {
      value: 'shipping',
      label: 'Vận chuyển',
    },
    {
      value: 'delivered',
      label: 'Hoàn thành',
    },
    {
      value: 'failed',
      label: 'Đơn thất bại',
    },
    {
      value: 'canceled',
      label: 'Đã hủy',
    },
    {
      value: 'INVOICE_PENDING',
      label: 'Đang xử lý hóa đơn',
    },
  ]);

  useEffect(() => {
    let { order_type = 'pending' } = paramsOrder || {};
    methods.reset({
      order_type: order_type,
    });
  }, []);

  return (
    <React.Fragment>
      <FormProvider {...methods}>
        <div className='bw_row'>
          <div className='bw_col_12'>
            <div className='bw_row bw_justify_content_right'>
              <FormItem label='Trạng thái đơn hàng' className='bw_col_4'>
                <FormSelect
                  field='order_type'
                  id='order_type'
                  list={optionsTypeOrder}
                  allowClear={true}
                  onChange={(value) =>
                    onChange({
                      order_type: value,
                    })
                  }
                />
              </FormItem>
            </div>
          </div>
        </div>
      </FormProvider>
    </React.Fragment>
  );
};

export default FilterOrder;
