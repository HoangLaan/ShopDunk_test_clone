import React from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';

const OrderStatusPermission = ({ functionOpts }) => {
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
          <FormItem label='Quyền thêm' isRequired>
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
          <FormItem label='Quyền sửa' isRequired>
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
          <FormItem label='Quyền xoá' isRequired>
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
          <FormItem label='Quyền xem' isRequired>
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
