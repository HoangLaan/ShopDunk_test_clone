// import { useLocation } from 'react-router-dom';
import React, { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import Icon from './Icon';
import FormRadioGroup from 'components/shared/BWFormControl/FormRadioGroup';

const OrderStatusInformation = ({ disabled }) => {
  const formality = useMemo(
    () => [
      { value: '0', label: 'Đơn mới' },
      { value: '1', label: 'Đã xác nhận' },
      { value: '2', label: 'Đang xử lý' },
      { value: '3', label: 'Đã hoàn thành' },
      { value: '4', label: 'Đã huỷ' },
    ],
    [],
  );

  return (
    <BWAccordion title='Thông tin trạng thái đơn hàng'>
      <div className='bw_row'>
        <div className='bw_col_3'>
          <Icon isEdit={!disabled} />
        </div>

        <div className='bw_col_9'>
          <div className='bw_row'>
            <div className='bw_col_12'>
              <FormItem disabled={disabled} isRequired label='Tên trạng thái'>
                <FormInput
                  type='text'
                  field='order_status_name'
                  placeholder='Nhập tên trạng thái đơn hàng'
                  validation={{
                    required: 'Tên trạng thái là bắt buộc không được bỏ trống!',
                    validate: (value) => value.trim() !== '' || 'Tên trạng thái là bắt buộc không được bỏ trống!',
                  }}
                  maxlength={250}
                />
              </FormItem>
            </div>

            <div className='bw_col_12'>
              <FormItem disabled={disabled} label='Mô tả'>
                <FormTextArea
                  type='text'
                  field='description'
                  placeholder='Nhập mô tả'
                  validation={{
                    validate: (value) => !value || value?.length <= 2000 || 'Trường mô tả nhập quá độ dài cho phép',
                  }}
                />
              </FormItem>
            </div>

            <div className='bw_col_12'>
              <FormItem isRequired label='Chọn hình thức'>
                <FormRadioGroup
                  list={formality}
                  custom={true}
                  field='formality'
                  style={{ width: '33%', marginBottom: '20px' }}
                  validation={{
                    required: 'Loại hình thức là bắt buộc',
                  }}
                />
              </FormItem>
            </div>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
};

export default OrderStatusInformation;
