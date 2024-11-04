import React, { useEffect, useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { getOptions } from 'services/discount-program.service';
import { getDiscountProducts } from 'services/discount-program.service';

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

  useEffect(() => {
    methods.reset(initFilter);
  }, [methods]);

  const onClear = () => {
    methods.reset(initFilter);
    onClearParams();
  };

  useEffect(() => {
    getOptions().then(setDiscountProgram);
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
          });

          parentMethods.setValue(
            'discount_programs',
            discountProgram?.filter((_) => value?.discount_program_list?.find((p) => Number(p.id) === Number(_.value))),
          );
        }}
        onClear={() => {
          onClear();
          parentMethods.setValue('discount_programs', []);
        }}
        actions={[
          {
            title: 'Chương trình chiết khấu',
            component: <FormSelect mode='multiple' field='discount_program_list' list={discountProgram} />,
          },
          {
            title: 'Sản phẩm áp dụng',
            component: <FormSelect mode='multiple' field='product_list' list={productOptions} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default ProfitLossFilter;
