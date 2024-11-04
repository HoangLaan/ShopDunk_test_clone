import React, { useMemo } from 'react';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { statusTypesOption } from 'utils/helpers';
import { FormProvider, useForm } from 'react-hook-form';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import { PAYMENT_TYPE, STATUS_RECEIVE_MONEY } from '../helpers/const';

const InternalTransferFilter = ({ onChange }) => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });

  const { watch } = methods;
  const userOptions = useGetOptions(optionType.user, { isHasOptionAll: true });
  const storeOptions = useGetOptions(optionType.store, { isHasOptionAll: true });
  const internalTransferTypeOptions = useGetOptions(optionType.internalTransferType, { isHasOptionAll: true });

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() =>
          onChange({
            search: undefined,
            // is_active: 1,
            internal_transfer_type_id: undefined,
            store_id: undefined,
            payment_type: 0,
            date_from: undefined,
            date_to: undefined,
            created_user: undefined,
            page: 1,
          })
        }
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput placeholder='Số chứng từ, tiêu đề phiếu chuyển tiền' field='search' />,
          },
          {
            title: 'Cửa hàng',
            component: <FormSelect list={storeOptions} field='store_id' />,
          },
          {
            title: 'Người tạo',
            component: <FormSelect list={userOptions} field='created_user' />,
          },
          {
            title: 'Ngày tạo phiếu',
            component: (
              <FormDateRange
                allowClear={true}
                fieldStart={'date_from'}
                fieldEnd={'date_to'}
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
              />
            ),
          },
          {
            title: 'Hình thức',
            component: <FormSelect list={internalTransferTypeOptions} field='internal_transfer_type_id' />,
          },
          {
            title: 'Hình thức chuyển',
            component: <FormSelect list={PAYMENT_TYPE} field='payment_type' />,
          },
          {
            title: 'Trạng thái nhận tiền',
            component: <FormSelect list={STATUS_RECEIVE_MONEY} field='status_receive_money' />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default InternalTransferFilter;
