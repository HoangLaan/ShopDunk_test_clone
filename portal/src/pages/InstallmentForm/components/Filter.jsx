import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { mapDataOptions4SelectCustom, statusTypesOption } from 'utils/helpers';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { DefaultFilter } from '../utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { getOptionsGlobal } from 'actions/global';

const InstallmentFilter = ({ onChange }) => {
  const methods = useForm();
  const dispatch = useDispatch();
  const { installmentPartnerData } = useSelector((state) => state.global);

  useEffect(() => {
    dispatch(getOptionsGlobal('installmentPartner'));
  });

  useEffect(() => {
    methods.reset({
      is_active: 1,
    });
  }, [methods]);

  const onClear = () => {
    methods.reset(DefaultFilter);
    onChange(DefaultFilter);
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        colSize={4}
        onSubmit={(v) => {
          methods.setValue('search', v.search?.trim());
          onChange(v);
        }}
        onClear={() => onClear({})}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder='Nhập tên hình thức trả góp' maxLength={250} />,
          },
          {
            title: 'Đối tác',
            component: (
              <FormSelect field='installment_partner_id' list={mapDataOptions4SelectCustom(installmentPartnerData)} />
            ),
          },
          {
            title: 'Trạng thái',
            component: <FormSelect field='is_active' list={statusTypesOption} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default InstallmentFilter;
