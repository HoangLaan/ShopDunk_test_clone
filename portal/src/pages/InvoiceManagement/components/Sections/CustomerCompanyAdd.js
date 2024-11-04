/* eslint-disable react/style-prop-object */
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import BWButton from 'components/shared/BWButton/index';
import ICON_COMMON from 'utils/icons.common';
import { showToast } from 'utils/helpers';
import CustomerLeadService from 'services/customer-lead.service';
import { FORM_RULES } from 'utils/constants';

const INIT_FORM = {
  is_active: 1,
};

function CustomerCompanyAdd({ disabled = false, refreshCompany }) {
  const methods = useFormContext();
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    methods.reset(INIT_FORM);
  }, []);

  const onSubmit = async (payload) => {
    try {
      setLoadingSubmit(true);
      const res = await CustomerLeadService.createCustomerCompany(payload);
      methods.setValue('customer_company', {
        ...methods.getValues(),
        customer_company_id: res.customer_company_id,
      });
      refreshCompany();
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
          <div className='bw_col_12'>
            <FormItem label='Tên công ty' isRequired disabled={disabled} style='gray'>
              <FormInput
                field='customer_company_name'
                placeholder='Nhập tên công ty'
                validation={{
                  required: 'Tên công ty là bắt buộc',
                }}
                disabled={disabled}
              />
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem label='Người đại diện' disabled={disabled} style='gray'>
              <FormInput field='representative_name' placeholder='Nhập tên người đại diện' disabled={disabled} />
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem label='Mã số thuế' isRequired disabled={disabled} style='gray'>
              <FormInput
                field='tax_code'
                placeholder='Mã số thuế'
                validation={{
                  required: 'Mã số thuế là bắt buộc',
                }}
                disabled={disabled}
              />
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem label='Số điện thoại' isRequired disabled={disabled} style='gray'>
              <FormInput
                field='phone_number'
                placeholder='Số điện thoại'
                validation={FORM_RULES.phone}
                disabled={disabled}
              />
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem label='Email' isRequired disabled={disabled} style='gray'>
              <FormInput field='email' placeholder='Email' validation={FORM_RULES.email} disabled={disabled} />
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
              <BWButton
                type='button'
                outline
                className='bw_close_modal'
                content='Làm mới'
                onClick={() => methods.reset({})}
              />
            </div>
          </div>
        </div>
      </form>
    </Spin>
  );
}

export default CustomerCompanyAdd;
