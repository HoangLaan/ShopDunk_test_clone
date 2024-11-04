import React, { useEffect, useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { getOptions } from 'services/discount-program.service';
import { getDiscountProducts } from 'services/discount-program.service';
import { getOptionsUser } from 'services/users.service';
import { mapDataOptions4SelectCustom } from 'utils/helpers';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';

const initFilter = {
  search: null,
  product_list: [],
  discount_program_list: [],
};

const ProfitLossFilter = ({ onChange, onClearParams }) => {
  const methods = useForm();
  const parentMethods = useFormContext();

  const { watch } = methods;
  const [productOptions, setProductOptions] = useState([]);
  const [discountProgram, setDiscountProgram] = useState([]);
  const [userOptions, setUserOptions] = useState([]);

  useEffect(() => {
    methods.reset(initFilter);
  }, [methods]);

  const onClear = () => {
    methods.reset(initFilter);
    onClearParams();
  };

  useEffect(() => {
    getOptions().then(setDiscountProgram);
    getOptionsUser().then((data) => {
      setUserOptions(mapDataOptions4SelectCustom(data));
    });
  }, []);

  useEffect(() => {
    getDiscountProducts({
      discount_program_ids: watch('discount_program_list')
        ?.map((_) => _.id)
        ?.join('|'),
    }).then((data) => {
      setProductOptions(data);
    });
  }, [watch('discount_program_list')]);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={(value) => {
          onChange({
            discount_program_ids: value?.discount_program_list?.map((_) => _.id)?.join('|') || null,
            product_ids: value?.product_list?.map((_) => _.id)?.join('|') || null,
            user_name: value?.user_name,
            from_date: value?.from_date,
            to_date: value?.to_date,
          });
        }}
        onClear={() => onClear()}
        actions={[
          {
            title: 'Chương trình chiết khấu',
            component: <FormSelect mode='multiple' field='discount_program_list' list={discountProgram} />,
          },
          {
            title: 'Sản phẩm áp dụng',
            component: <FormSelect mode='multiple' field='product_list' list={productOptions} />,
          },
          {
            title: 'Người thực hiện tính',
            component: <FormSelect field='user_name' list={userOptions} />,
          },
          {
            title: 'Thời gian tính',
            component: (
              <FormRangePicker
                fieldStart={'from_date'}
                allowClear
                fieldEnd='to_date'
                format={['DD/MM/YYYY', 'DD/MM/YYYY']}
                placeholder={['DD/MM/YYYY', 'DD/MM/YYYY']}
              />
            ),
          },
        ]}
      />
    </FormProvider>
  );
};

export default ProfitLossFilter;
