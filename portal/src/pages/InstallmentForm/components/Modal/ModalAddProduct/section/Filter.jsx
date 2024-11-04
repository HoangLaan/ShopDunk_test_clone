import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import { getOptionsGlobal } from 'actions/global';

import { useDispatch, useSelector } from 'react-redux';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { mapDataOptions4SelectCustom } from 'utils/helpers';

const CustomerFilter = ({ onChange }) => {
  const methods = useForm();
  const dispatch = useDispatch();
  const { productCategoryData } = useSelector((state) => state.global);

  const onClear = () => {
    methods.reset({
      search: '',
      product_category_id: null,
    });
    onChange({
      search: '',
      product_category_id: null,
    });
  };

  useEffect(() => {
    dispatch(getOptionsGlobal('productCategory'));
  }, []);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() => onClear()}
        colSize={4}
        expanded
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder='Tên hoặc mã sản phẩm' />,
          },
          {
            title: 'Ngành hàng',
            component: (
              <FormSelect field='product_category_id' list={mapDataOptions4SelectCustom(productCategoryData)} />
            ),
          },
        ]}
      />
    </FormProvider>
  );
};

export default CustomerFilter;
