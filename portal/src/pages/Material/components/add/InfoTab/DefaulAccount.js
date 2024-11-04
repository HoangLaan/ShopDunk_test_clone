import DataTable from 'components/shared/DataTable/index';
import React, { useMemo, useEffect, useState, useCallback } from 'react';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import BWAccordion from 'components/shared/BWAccordion';
import { getAccountingOptions } from 'services/product-model.service';
import { mapDataOptions4SelectCustom } from 'utils/helpers';
import { useFormContext } from 'react-hook-form';
import { DEFAULT_ACCOUNT_TYPE } from 'pages/Material/helpers/constants';

const DefaultAccount = ({ disabled, title }) => {
  const [accountOptions, setAccountOptions] = useState([]);
  const { watch, setValue, clearErrors } = useFormContext();

  useEffect(() => {
    getAccountingOptions().then(setAccountOptions);
  }, []);

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (d, index) => index + 1,
      },
      {
        header: 'Tên tài khoản',
        accessor: 'account_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
        formatter: (item) => <span>{DEFAULT_ACCOUNT_TYPE.find((_) => _.type === item?.type)?.name}</span>,
      },
      {
        header: 'Số tài khoản',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
        formatter: (d, index) => {
          return (
            <FormSelect
              disabled={disabled}
              allowClear={true}
              placeholder='Chọn tài khoản'
              field={`default_account_list.${index}.accounting_account_id`}
              list={mapDataOptions4SelectCustom(accountOptions, 'accounting_account_id', 'accounting_account_code')}
              onChange={(value) => {
                const field = `default_account_list.${index}.accounting_account_id`;
                clearErrors(field);
                setValue(field, value);
              }}
              validation={{
                required: 'Số tài khoản là bắt buộc !',
              }}
            />
          );
        },
      },
      {
        header: 'Tên tài khoản kế toán',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
        formatter: (d, index) => {
          const accounting_account_id = watch(`default_account_list.${index}.accounting_account_id`);
          return (
            <span>
              {accountOptions?.find((_) => _.accounting_account_id === accounting_account_id)?.accounting_account_name}
            </span>
          );
        },
      },
    ],
    [disabled, accountOptions],
  );

  return (
    <BWAccordion title={title} isRequired={true}>
      <DataTable noSelect={true} noPaging={true} columns={columns} data={watch('default_account_list')} />
    </BWAccordion>
  );
};

export default DefaultAccount;
