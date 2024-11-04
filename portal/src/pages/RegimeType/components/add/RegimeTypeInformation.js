import React from 'react';
import { useDispatch } from 'react-redux';
import { useFormContext } from 'react-hook-form';

import { getOptionsGlobal } from 'actions/global';
import { mapDataOptions4Select, removeCharactersVietnamese } from 'utils/helpers';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormTreeSelect from 'components/shared/BWFormControl/FormTreeSelect';

const RegimeTypeInformation = ({ disabled, title }) => {
  const dispatch = useDispatch();
  const methods = useFormContext();

  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <FormItem className='bw_col_6' disabled={disabled} isRequired label='Tên loại chế độ'>
          <FormInput
            type='text'
            field='regime_type_name'
            placeholder='Nhập tên loại chế độ'
            validation={{
              required: 'Tên loại chế độ là bắt buộc',
              validate: (value) => !!value.trim() || 'Tên loại chế độ là bắt buộc.',
            }}
            onChange={(e) => {
              methods.clearErrors('regime_type_name');
              methods.setValue('regime_type_name', e.target.value);
              methods.setValue(
                'regime_type_code',
                e.target.value
                  ?.trim()
                  ?.split(/\s+/)
                  ?.map((e) => removeCharactersVietnamese(e.substring(0, 1)))
                  ?.slice(0, 5)
                  ?.join('')
                  ?.toUpperCase(),
              );
            }}
            maxlength={250}
          />
        </FormItem>

        <FormItem className='bw_col_6' disabled isRequired label='Mã loại chế độ'>
          <FormInput type='text' field='regime_type_code' />
        </FormItem>
      </div>

      <div className='bw_row'>
        <FormItem className='bw_col_6' label='Thuộc loại chế độ' disabled={disabled}>
          <FormTreeSelect
            field='parent_id'
            fetchOptions={(node) => {
              return dispatch(getOptionsGlobal('regimeType', node)).then((res) => {
                return mapDataOptions4Select(res);
              });
            }}
            allowClear={true}
            treeDataSimpleMode
            placeholder='--Chọn--'
          />
        </FormItem>
      </div>

      <div className='bw_row'>
        <FormItem className='bw_col_12' label='Chính sách, quy định áp dụng' isRequired disabled={disabled}>
          <FormTextArea
            type='text'
            field='policy'
            placeholder='Nhập chính sách, quy định'
            validation={{
              required: 'Chính sách, quy định là bắt buộc',
              validate: (value) => !value || value.length <= 2000 || 'Ghi chú không vượt quá 2000 từ.',
            }}
          />
        </FormItem>
      </div>

      <div className='bw_row'>
        <FormItem className='bw_col_12' label='Mô tả' disabled={disabled}>
          <FormTextArea
            type='text'
            field='description'
            placeholder='Nhập mô tả'
            validation={{
              validate: (value) => !value || value.length <= 1000 || 'Mô tả không vượt quá 1000 từ.',
            }}
          />
        </FormItem>
      </div>
    </BWAccordion>
  );
};

export default RegimeTypeInformation;
