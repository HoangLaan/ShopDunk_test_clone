import React, { useMemo } from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormRadioGroup from '../../../../components/shared/BWFormControl/FormRadioGroup';
import { useFormContext } from 'react-hook-form';

function StocksTypeInfo({ disabled, title }) {
  const methods = useFormContext();

  const STOCKSTYPE = useMemo(
    () => [
      { value: 1, label: 'Kho hàng mới' },
      { value: 2, label: 'Kho hàng cũ' },
      { value: 3, label: 'Kho bảo hành' },
      { value: 4, label: 'Kho hàng lỗi' },
      { value: 5, label: 'Kho hàng trưng bày' },
      { value: 6, label: 'Kho hàng trôi bảo hành' },
      { value: 7, label: 'Kho hàng dự án' },
      { value: 8, label: 'Kho phụ kiện' },
      { value: 9, label: 'Kho công ty' },
      { value: 10, label: 'Kho chờ xử lí khác' },
      { value: 11, label: 'Kho Preorder' },
      { value: 12, label: 'Kho cọc' },
    ],
    [],
  );

  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <div className='bw_col_6'>
          <FormItem label='Tên loại kho' isRequired={true} disabled={disabled}>
            <FormInput
              field='stocks_type_name'
              placeholder='Nhập tên loại kho'
              validation={{
                required: 'Tên loại là bắt buộc',
              }}
              onChange={(e) => {
                const stocks_name = e.target.value;
                methods.clearErrors('stocks_type_name');
                methods.setValue('stocks_type_name', stocks_name);
                const name_array = stocks_name.split(' ');
                const stocks_code = name_array.map((_) => _[0]).join('');
                if (stocks_code?.toUpperCase()) {
                  methods.setValue('stocks_type_code', stocks_code?.toUpperCase());
                }
              }}
            />
          </FormItem>
        </div>

        <div className='bw_col_6'>
          <FormItem label='Mã loại kho' isRequired={true} disabled={disabled}>
            <FormInput
              field='stocks_type_code'
              placeholder='Nhập mã loại kho'
              validation={{
                required: 'Mã loại kho là bắt buộc',
              }}
            />
          </FormItem>
        </div>

        <div className='bw_col_12'>
          <FormItem label='Mô tả' disabled={disabled}>
            <FormTextArea rows={3} field='description' placeholder='Nhập mô tả loại kho' disabled={disabled} />
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <div className='bw_frm_box'>
            <label>
              Định nghĩa loại kho <span className='bw_red'>*</span>
            </label>
            <FormRadioGroup
              field='type'
              list={STOCKSTYPE}
              disabled={disabled}
              custom
              style={{ marginBottom: '20px' }}
            />
          </div>
        </div>
        <div className='bw_col_12'>
          <FormItem label='Cài đặt thuộc tính loại kho'>
            <label className='bw_checkbox' style={{ marginTop: '15px' }}>
              <FormInput type='checkbox' field='is_export_to' />
              <span />
              Xuất chuyển sang kho hàng lỗi yêu cầu duyệt
            </label>
          </FormItem>
          <FormItem label='Cài đặt trang thái giao dịch'>
            <label className='bw_checkbox' style={{ marginTop: '15px' }}>
              <FormInput type='checkbox' field='is_not_for_sale' />
              <span />
              Không cho phép giao dịch
            </label>
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
}

export default StocksTypeInfo;
