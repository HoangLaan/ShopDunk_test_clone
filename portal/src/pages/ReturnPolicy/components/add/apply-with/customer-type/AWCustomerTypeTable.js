import DataTable from 'components/shared/DataTable/index';
import React, { useMemo, useState, useEffect } from 'react';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { getCustomerTypeOptions } from 'services/return-policy.service';
import { mapDataOptions4SelectCustom, showToast } from 'utils/helpers';
import { useFormContext } from 'react-hook-form';

const AWCustomerTypeTable = ({ isSubmit, disabled }) => {
  const [customerTypeOptions, setCustomerTypeOptions] = useState();
  const { watch, setValue } = useFormContext();
  const customerTypeIds = useMemo(() => watch('customertype_ids') ?? [undefined], [watch('customertype_ids')]);
  useEffect(() => {
    getCustomerTypeOptions().then(({ items }) => {
      setCustomerTypeOptions(mapDataOptions4SelectCustom(items));
    });
  }, []);

  useEffect(() => {
    if (isSubmit) {
      setValue('customertype_ids', [undefined]);
    }
  }, [isSubmit]);

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1,
      },
      {
        header: 'Loại khách hàng',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_text',
        formatter: (d, index) => {
          return (
            <FormSelect
              disabled={disabled}
              field={`customertype_ids.${index}`}
              list={customerTypeOptions}
              validation={{
                require: 'Loại khách hàng không được trống',
              }}
            />
          );
        },
      },
    ],
    [customerTypeOptions, disabled],
  );

  const actions = useMemo(() => {
    return [
      {
        hidden: disabled,
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm dòng',
        onClick: () => {
          if (customerTypeIds.includes(undefined)) {
            return showToast.error('Vui lòng chọn loại khách hàng trước khi thêm dòng mới');
          }
          setValue('customertype_ids', [...customerTypeIds, undefined]);
        },
      },
      {
        hidden: disabled,
        icon: 'fi fi-rr-trash',
        color: 'red',
        onClick: (_, index) => {
          const customerType = watch('customertype_ids');
          if (customerType.length === 1) return;
          setValue(
            'customertype_ids',
            customerType.filter((c, i) => i !== index),
          );
        },
      },
    ];
  }, [customerTypeIds, disabled]);

  return <DataTable noSelect={true} noPaging={true} columns={columns} data={customerTypeIds} actions={actions} />;
};

export default AWCustomerTypeTable;
