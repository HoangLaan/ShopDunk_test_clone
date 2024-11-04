import React, { useEffect, useState } from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import DefaultAccountTableAdd from './DefaultAccountTableAdd';
import { getAccountingAccountOptions } from 'services/default-account.service';
import { mapDataOptions4Select } from 'utils/helpers';

const DefaultAccountInformation = ({ disabled, title, documentOptions }) => {
  const [defaultAccountTypes, setDefaultAccountTypes] = useState([
    { debt: 'TK Nợ' },
    { credit: 'TK Có' },
    // { tax: 'TK Thuế GTGT' },
  ]);

  useEffect(() => {
    getAccountingAccountOptions().then(({ items: data }) => {
      setDefaultAccountTypes((prev) =>
        prev.map((item) => {
          const type = Object.keys(item)[0];
          return {
            type,
            col_name: item[type],
            account_options: mapDataOptions4Select(data, 'accounting_account_id', 'accounting_account_code'),
          };
        }),
      );
    });
  }, []);

  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <div className='bw_col_12'>
            <FormItem disabled={disabled} isRequired label='Loại chứng từ'>
              <FormSelect
                field={'document_id'}
                list={documentOptions}
                allowClear={true}
                validation={{
                  required: 'Loại chứng từ là bắt buộc',
                }}
              />
            </FormItem>
          </div>
          <div className='bw_col_12'>
            <FormItem disabled={disabled} isRequired label='Tên định khoản'>
              <FormInput
                type='text'
                field='ac_default_account_name'
                placeholder='Tên định khoản'
                validation={{
                  validate: (value) => {
                    if (!value || value === '') return 'Tên định khoản là bắt buộc';
                    const regexSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                    if (regexSpecial.test(value)) return 'Tên định khoản không được chứa ký tự đặc biệt';

                    return true;
                  },
                }}
              />
            </FormItem>
          </div>
          <div className='bw_col_12'>
            <FormItem label='Tài khoản ngầm định'>
              <DefaultAccountTableAdd disabled={disabled} data={defaultAccountTypes} />
            </FormItem>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
};

export default DefaultAccountInformation;
