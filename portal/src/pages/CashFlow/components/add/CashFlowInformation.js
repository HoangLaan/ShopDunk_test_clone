import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getOptionsGlobal } from 'actions/global';
import { mapDataOptions4Select } from 'utils/helpers';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormRadioGroup from 'components/shared/BWFormControl/FormRadioGroup';
import FormTreeSelect from 'components/shared/BWFormControl/FormTreeSelect';

const CashFlowInformation = ({ disabled, title }) => {
  const dispatch = useDispatch();
  const { companyData, accountingAccountData } = useSelector((state) => state.global);

  const getOptions = useCallback(() => {
    dispatch(getOptionsGlobal('company'));
    dispatch(getOptionsGlobal('accountingAccount'));
  }, [dispatch]);

  useEffect(getOptions, [getOptions]);

  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <FormItem className='bw_col_6' label='Công ty' isRequired disabled={disabled}>
            <FormSelect
              field='company_id'
              list={mapDataOptions4Select(companyData)}
              validation={{
                required: 'Công ty là bắt buộc',
              }}
            />
          </FormItem>

          <FormItem className='bw_col_6' label='Tài khoản kế toán ngầm định' disabled={disabled}>
            <FormSelect mode="multiple" field='implicit_account_id' list={mapDataOptions4Select(accountingAccountData)} />
          </FormItem>
        </div>

        <div className='bw_row'>
          <FormItem className='bw_col_6' label='Thuộc dòng tiền' disabled={disabled}>
            <FormTreeSelect
              field='parent_id'
              treeDataSimpleMode
              fetchOptions={(params) =>
                dispatch(getOptionsGlobal('cashFlow', params)).then((res) => {
                  return res.map((item) => ({ value: item.id, label: item.name, pId: item.parent_id, ...item }));
                })
              }
            />
          </FormItem>

          <FormItem className='bw_col_6' label='Mã dòng tiền' isRequired disabled={disabled}>
            <FormInput
              type='text'
              field='cash_flow_code'
              placeholder='Nhập mã dòng tiền'
              validation={{
                required: 'Mã dòng tiền là bắt buộc',
              }}
            />
          </FormItem>
        </div>

        <div className='bw_row'>
          <FormItem className='bw_col_6' label='Tên dòng tiền' isRequired disabled={disabled}>
            <FormInput
              type='text'
              field='cash_flow_name'
              placeholder='Nhập tên dòng tiền'
              validation={{
                required: 'Tên dòng tiền là bắt buộc',
              }}
            />
          </FormItem>

          <FormItem className='bw_col_6' label='Loại dòng tiền' disabled={disabled}>
            <FormRadioGroup
              field='cash_flow_type'
              list={[
                { value: 1, label: 'Loại thu' },
                { value: 2, label: 'Loại chi' },
              ]}
            />
          </FormItem>
        </div>

        <FormItem className='bw_col_12' label='Diễn giải'>
          <FormTextArea field='description' rows={3} placeholder='Nhập mô tả' disabled={disabled} />
        </FormItem>

        <FormItem className='bw_col_12' label='Ghi chú'>
          <FormTextArea field='note' rows={3} placeholder='Nhập ghi chú' disabled={disabled} />
        </FormItem>
      </div>
    </BWAccordion>
  );
};
export default CashFlowInformation;
