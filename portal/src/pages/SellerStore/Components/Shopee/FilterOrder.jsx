import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { notification } from 'antd';
import FormItem from 'components/shared/BWFormControl/FormItem';
import { getOptionStock, getListShopProfile, updateStocksId } from '../../helpers/call-api-lazada';
import { showToast } from 'utils/helpers';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';

const FilterOrder = ({ onChange, paramsOrder = {} }) => {
  const methods = useForm();
  const { watch } = methods;
  // const [defaultTypeOrder, setDefaultType] = useState('pending');
  const [optionsTypeOrder, setOptionsTypeOrder] = useState([
    {
      value: 'UNPAID',
      label: 'Chưa thanh toán',
    },
    {
      value: 'READY_TO_SHIP',
      label: 'Chưa xử lý',
    },
    {
      value: 'PROCESSED',
      label: 'Đã xử lý',
    },
    {
      value: 'SHIPPED',
      label: 'Vận chuyển',
    },
    {
      value: 'COMPLETED',
      label: 'Hoàn thành',
    },
    {
      value: 'IN_CANCEL',
      label: 'Bị hủy',
    },
    {
      value: 'CANCELLED',
      label: 'Đã hủy',
    },
    {
      value: 'INVOICE_PENDING',
      label: 'Đang xử lý hóa đơn',
    },
  ]);

  const onRefresh = () => {};

  useEffect(() => {
    let { order_type = 'READY_TO_SHIP', end_date = null, start_date = null } = paramsOrder || {};
    methods.reset({
      order_type: order_type,
      end_date,
      start_date,
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
              <FormItem label='Ngày tạo đơn' className='bw_col_4'>
                <FormDateRange
                  allowClear={true}
                  fieldStart={'start_date'}
                  fieldEnd={'end_date'}
                  placeholder={['Từ ngày', 'Đến ngày']}
                  format={'DD/MM/YYYY'}
                  onChange={(dates, dateStrings) => {
                    if (dates) {
                      if (dateStrings[0] && dateStrings[1]) {
                        onChange({
                          start_date: dateStrings[0],
                          end_date: dateStrings[1],
                        });
                      }
                    } else {
                      onChange({
                        start_date: '',
                        end_date: '',
                      });
                    }
                  }}
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
