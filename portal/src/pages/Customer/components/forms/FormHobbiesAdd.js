/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/style-prop-object */
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import BWButton from 'components/shared/BWButton/index';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import ICON_COMMON from 'utils/icons.common';
import { mapDataOptions, showToast } from 'utils/helpers';
import { getOptionsProductAttribute } from 'services/customer.service';

import FormTags from './FormTags';
import HobbiesService from 'services/hobbies.service';
import { useCustomerContext } from 'pages/Customer/utils/context';

const INIT_FORM = {
  is_active: 1,
};

function FormHobbiesAdd({ disabled = false }) {
  const methods = useFormContext();
  const watchAttributeList = methods.watch('product_attribute_list');

  // console.log('FormHobbiesAdd', methods.getValues());

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [optionsProductAttribute, setOptionsProductAttribute] = useState([]);
  const { refreshModalHobbies } = useCustomerContext();

  const fetchOptionsProductAttribute = async (search, limit = 100) => {
    const _optionsProductAttribute = await getOptionsProductAttribute({ search, limit });
    setOptionsProductAttribute(mapDataOptions(_optionsProductAttribute));
  };

  useEffect(() => {
    methods.reset(INIT_FORM);
  }, []);

  useEffect(() => {
    if (watchAttributeList?.length) {
      const current = methods.getValues('hobbies_value_list') || [];
      const newValues = [];
      watchAttributeList.forEach((item) => {
        item.values.forEach((value) => {
          if (current.indexOf(value) === -1) {
            newValues.push(value);
          }
        });
      });
      methods.setValue('hobbies_value_list', [...current, ...newValues]);
    }
  }, [watchAttributeList]);

  const onSubmit = async (payload) => {
    try {
      setLoadingSubmit(true);
      payload.product_attribute_list = (payload.product_attribute_list || []).map((item) => item.id);
      await HobbiesService.create(payload);
      refreshModalHobbies();
      showToast.success('Thêm mới thành công');
    } catch (error) {
      showToast.error(error.message);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <Spin spinning={loadingSubmit} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className='bw_row'>
          <div className='bw_col_6'>
            <FormItem label='Tên sở thích' isRequired disabled={disabled} style='gray'>
              <FormInput
                field='hobbies_name'
                placeholder='Nhập tên sở thích'
                validation={{
                  required: 'Tên sở thích là bắt buộc',
                }}
                disabled={disabled}
              />
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <label className='bw_checkbox'>
              <FormInput disabled={disabled} type='checkbox' field='is_apply_attribute' />
              <span />
              Áp dụng thuộc tính sản phẩm
            </label>
            {methods.watch('is_apply_attribute') === 1 && (
              <FormDebouneSelect
                field='product_attribute_list'
                mode='multiple'
                placeholder={'--Chọn--'}
                showSearch={true}
                options={optionsProductAttribute}
                fetchOptions={fetchOptionsProductAttribute}
                disabled={disabled}
                style={{ width: '100%', marginTop: 10 }}
              />
            )}
          </div>
          <div className='bw_col_12'>
            <FormItem label='Giá trị' isRequired disabled={disabled} style='gray'>
              <FormTags field='hobbies_value_list' />
            </FormItem>
          </div>
          <div className='bw_col_12'>
            <FormItem label='Mô tả' style='gray'>
              <FormTextArea rows={3} field='description' placeholder='Mô tả' disabled={disabled} />
            </FormItem>
          </div>
          <div className='bw_col_12'>
            <div className='bw_flex bw_justify_content_right'>
              <BWButton
                type='success'
                icon={ICON_COMMON.save}
                content='Thêm'
                onClick={methods.handleSubmit(onSubmit)}
                style={{ marginRight: 10 }}
              />
              <button type='button' className='bw_btn_outline' onClick={() => methods.reset({})}>
                Làm mới
              </button>
            </div>
          </div>
        </div>
      </form>
    </Spin>
  );
}

export default FormHobbiesAdd;
