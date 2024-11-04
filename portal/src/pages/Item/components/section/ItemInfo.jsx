import React, { useCallback, useEffect, useState } from 'react';
import { Space } from 'antd';

//compnents
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormSelect from 'components/shared/BWFormControl/FormSelect';

import { msgError } from '../../helpers/msgError';
import { useFormContext } from 'react-hook-form';
import { mapDataOptions4SelectCustom } from 'utils/helpers';
import { getOptionsCompany } from 'services/company.service';

import { getParentOptions } from 'services/item.service';
import { getOptionsGlobal } from 'services/global.service';
import FormTreeSelect from 'components/shared/BWFormControl/FormTreeSelect';

const ItemInfo = ({ id, title, disabled }) => {
  const methods = useFormContext();

  const [companyOpts, setCompanyOpts] = useState([]);
  const [budgetOpts, setBudgetOpts] = useState([]);

  const loadOptions = useCallback(async () => {
    // Lấy danh sách công ty áp dụng
    const _companyOpts = await getOptionsCompany();
    setCompanyOpts(mapDataOptions4SelectCustom(_companyOpts));

    const _budgetOptions = await getOptionsGlobal({ type: 'budget' });
    setBudgetOpts(mapDataOptions4SelectCustom(_budgetOptions));
  }, []);

  useEffect(() => {
    loadOptions();
  }, []);

  return (
    <React.Fragment>
      <BWAccordion title={title} id={id}>
        <div className='bw_row'>
          <FormItem label='Công ty' className='bw_col_6' disabled={disabled} isRequired={true}>
            <FormSelect
              type='text'
              field='company_id'
              placeholder='Chọn'
              list={companyOpts}
              validation={msgError.company_id}
            />
          </FormItem>
          <FormItem label='Khoản mục cha' className='bw_col_6' disabled={disabled}>
            <FormTreeSelect field='parent_id' treeDataSimpleMode fetchOptions={getParentOptions} disabled={disabled} />
          </FormItem>
          <FormItem label='Mã khoản mục' className='bw_col_6' disabled={disabled} isRequired={true}>
            <FormInput type='text' field='item_code' placeholder='Mã khoản mục' validation={msgError.item_code} />
          </FormItem>
          <FormItem label='Tên khoản mục' className='bw_col_6' disabled={disabled} isRequired={true}>
            <FormInput type='text' field='item_name' placeholder='Tên khoản mục' validation={msgError.item_name} />
          </FormItem>
          <FormItem label='Mã ngân sách' className='bw_col_6' disabled={disabled}>
            <FormSelect type='text' field='budget_id' placeholder='Chọn' list={budgetOpts} />
          </FormItem>
          <div className='bw_col_6'>
            <div className='bw_frm_box'>
              <Space direction='vertical' size='small'>
                <label className='bw_checkbox'>
                  <FormInput
                    disabled={disabled}
                    type='checkbox'
                    field='is_budget_creation'
                    onChange={({ target: { checked } }) => {
                      methods.setValue('is_budget_creation', checked ? 1 : 0);
                    }}
                  />
                  <span />
                  Cần lập đề nghị sử dụng ngân sách
                </label>

                <label className='bw_checkbox'>
                  <FormInput
                    disabled={disabled}
                    type='checkbox'
                    field='is_budget_adjustment'
                    onChange={({ target: { checked } }) => {
                      methods.setValue('is_budget_adjustment', checked ? 1 : 0);
                    }}
                  />
                  <span />
                  Cho phép điều chuyển ngân sách
                </label>
              </Space>
            </div>
          </div>
          <div className='bw_col_12'>
            <div className='bw_frm_box'>
              <label>Mô tả</label>
              <FormTextArea disabled={disabled} placeholder='Nhập mô tả' field='description' />
            </div>
          </div>
          <div className='bw_col_12'>
            <div className='bw_frm_box'>
              <label>Ghi chú</label>
              <FormTextArea disabled={disabled} placeholder='Nhập ghi chú' field='note' />
            </div>
          </div>
        </div>
      </BWAccordion>
    </React.Fragment>
  );
};

export default ItemInfo;
