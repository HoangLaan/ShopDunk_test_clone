import React, { useState, useEffect, useCallback } from 'react';
import { showToast } from 'utils/helpers';

import { mapDataOptions4Select } from 'utils/helpers';
import { getOptionsFunction } from 'services/function.service';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';

const OrderStatusPermission = ({ disabled }) => {
  const [functionOpts, setFunctionOpts] = useState([]);
  const getInitData = useCallback(async () => {
    try {
      let dataFunctionOpts = await getOptionsFunction();
      setFunctionOpts(mapDataOptions4Select(dataFunctionOpts));
    } catch (error) {
      showToast.error(error ? error.message : 'Có lỗi xảy ra!');
    }
  }, []);

  useEffect(() => {
    getInitData();
  }, []);
  return (
    <BWAccordion title='Thông tin quyền' id='bw_info_cus' isRequired>
      <p
        className='bw_red'
        style={{
          fontSize: '13px',
          fontStyle: 'italic',
        }}>
        * Vui lòng chọn đúng quyền cho từng trạng thái đơn hàng
      </p>
      <div className='bw_row bw_mt_1'>
        <div className='bw_col_6'>
          <FormItem label='Quyền thêm' isRequired disabled={disabled}>
            <FormSelect
              field='add_function_id'
              id='add_function_id'
              list={functionOpts}
              allowClear={true}
              validation={{
                required: 'Vui lòng chọn quyền',
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Quyền sửa' isRequired disabled={disabled}>
            <FormSelect
              field='edit_function_id'
              id='edit_function_id'
              list={functionOpts}
              allowClear={true}
              validation={{
                required: 'Vui lòng chọn quyền',
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Quyền xoá' isRequired disabled={disabled}>
            <FormSelect
              field='delete_function_id'
              id='delete_function_id'
              list={functionOpts}
              allowClear={true}
              validation={{
                required: 'Vui lòng chọn quyền',
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Quyền xem' isRequired disabled={disabled}>
            <FormSelect
              field='view_function_id'
              id='view_function_id'
              list={functionOpts}
              allowClear={true}
              validation={{
                required: 'Vui lòng chọn quyền',
              }}
            />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
};

export default OrderStatusPermission;
