import React, { useEffect } from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { mapDataOptions4SelectCustom } from 'utils/helpers';
import { getOptionsGlobal } from 'actions/global';
import { useDispatch, useSelector } from 'react-redux';
import { getTreeAccountingAccount } from 'services/accounting-account.service';
import FormTreeSelect from 'components/shared/BWFormControl/FormTreeSelect';
import { useParams } from 'react-router-dom';
import { propertys } from 'pages/AccountingAccount/utils/constants';
const AccountingAccountInformation = ({ disabled, title }) => {
  const dispatch = useDispatch();
  const { companyData } = useSelector((state) => state.global);
  const { accounting_account_id } = useParams();

  useEffect(() => {
    if (!companyData) dispatch(getOptionsGlobal('company'));
  }, []);
  const loadTree = (param) => {
    return new Promise(async (resolve, reject) => {
      try {
        let params = {
          parent_id: param.parent_id,
          accounting_account_id: accounting_account_id || null,
        };
        let res = await getTreeAccountingAccount(params);
        let data = (res?.items || []).map((x) => ({
          id: x.accounting_account_id,
          pId: x.account_parent_id || 0,
          value: `${x.accounting_account_id}`,
          title: `${x.accounting_account_code} - ${x.accounting_account_name}`,
          isLeaf: x.is_child === 1 ? true : false,
        }));
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  };
  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <div className='bw_col_6'>
            <FormItem disabled={disabled} isRequired label='Công ty'>
              <FormSelect
                field={'company_id'}
                list={mapDataOptions4SelectCustom(companyData, 'id', 'name')}
                validation={{
                  required: 'Tên công ty cần chọn là bắt buộc',
                }}></FormSelect>
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem disabled={disabled} label='Tài khoản cha'>
              <FormTreeSelect
                field={'account_parent_id'}
                fetchOptions={loadTree}
                placeholder={'Chọn tài khoản cha'}
                treeDataSimpleMode></FormTreeSelect>
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem disabled={disabled} isRequired label='Mã tài khoản'>
              <FormInput
                type='text'
                field='accounting_account_code'
                placeholder='Nhập mã tài khoản'
                validation={{
                  required: 'Mã tài khoản cần nhập là bắt buộc',
                  pattern: {
                    value: /^[0-9a-zA-Z]+$/i,
                    message: 'Mã tài khoản có ký tự không hợp lệ'
                  }
                }}
              />
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem disabled={disabled} isRequired label='Tên tài khoản'>
              <FormInput
                type='text'
                field='accounting_account_name'
                placeholder='Nhập tên tài khoản'
                validation={{
                  required: 'Tên tài khoản cần nhập là bắt buộc',
                }}
              />
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem disabled={disabled} isRequired label='Tính chất'>
              <FormSelect
                field={'property'}
                list={propertys.filter((x) => x.value !== 0)}
                validation={{
                  required: 'Tính chất cần chọn là bắt buộc',
                }}></FormSelect>
            </FormItem>
          </div>
          <div className='bw_col_12'>
            <FormItem disabled={disabled} label='Diễn tả'>
              <FormTextArea type='text' field='description' placeholder='Nhập diễn tả' />
            </FormItem>
          </div>
          <div className='bw_col_12'>
            <FormItem disabled={disabled} label='Ghi chú'>
              <FormTextArea type='text' field='note' placeholder='Nhập ghi chú' />
            </FormItem>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
};

export default AccountingAccountInformation;
