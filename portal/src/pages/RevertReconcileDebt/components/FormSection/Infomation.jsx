import React, { useEffect, useState } from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import { useFormContext } from 'react-hook-form';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { CurrencyTypeOpts, SUBMIT_TYPE } from 'pages/RevertReconcileDebt/utils/constant';
import BWButton from 'components/shared/BWButton';
import { optionType } from 'hooks/useGetOptions';
import { mapDataOptions4SelectCustom } from 'utils/helpers';
import { getOptionsGlobal } from 'services/global.service';

const ReconcileDebtFilter = ({ disabled, title, id }) => {
  const methods = useFormContext();
  const { watch, setValue } = methods;
  const [accountingAccountOpts, setAccountingAccountOpts] = useState([]);
  const [supplierOpts, setSupplierOpts] = useState([]);

  useEffect(() => {
    getOptionsGlobal({ type: optionType.accountingAccount }).then(setAccountingAccountOpts);
    getOptionsGlobal({ type: optionType.supplier }).then(setSupplierOpts);
  }, []);

  useEffect(() => {
    if (accountingAccountOpts && accountingAccountOpts.length > 0 && !watch('account_id')) {
      const account331 = accountingAccountOpts.find((acc) => acc.code === '331');
      if (account331) {
        setValue('account_id', account331.id);
      }
    }
  }, [accountingAccountOpts, watch('account_id')]);

  return (
    <BWAccordion title={title} id={id}>
      <div className='bw_row'>
        <div class='bw_col_10'>
          <div className='bw_row'>
            <div className='bw_col_4'>
              <FormItem label='Nhà cung cấp' isRequired disabled={disabled}>
                <FormSelect
                  field='supplier_id'
                  placeholder='--Chọn--'
                  list={mapDataOptions4SelectCustom(supplierOpts) || []}
                  validation={{
                    required: 'Nhà cung cấp là bắt buộc',
                  }}
                />
              </FormItem>
            </div>
            <div className='bw_col_4'>
              <FormItem label='Tài khoản phải trả' isRequired disabled>
                <FormSelect
                  field='account_id'
                  placeholder='--Chọn--'
                  list={mapDataOptions4SelectCustom(accountingAccountOpts) || []}
                  validation={{
                    required: 'Tài khoản phải trả là bắt buộc',
                  }}
                />
              </FormItem>
            </div>
            <div className='bw_col_4'>
              <FormItem label='Loại tiền' isRequired disabled={disabled}>
                <FormSelect
                  field='currency_type'
                  placeholder='--Chọn--'
                  list={CurrencyTypeOpts}
                  validation={{
                    required: 'Loại tiền là bắt buộc',
                  }}
                />
              </FormItem>
            </div>
          </div>
        </div>

        <div className='bw_col_2'>
          <div className='bw-row' style={{ height: '100%' }}>
            <div className='bw_col_12' style={{ height: '100%' }}>
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <BWButton
                  submit
                  style={{ margin: '10px 0' }}
                  content='Lấy dữ liệu'
                  icon='fi fi-rr-check'
                  onClick={(data) => {
                    setValue('submit_type', SUBMIT_TYPE.FILTER);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
};

export default ReconcileDebtFilter;
