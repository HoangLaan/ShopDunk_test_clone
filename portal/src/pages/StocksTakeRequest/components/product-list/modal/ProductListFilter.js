import React from 'react';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import PropTypes from 'prop-types';
import { FormProvider, useForm } from 'react-hook-form';
import FormTreeSelect from 'components/shared/BWFormControl/FormTreeSelect';
import { getOptionsTreeview, getOptionsModel } from 'services/product-category.service';
import { mapDataOptions4Select } from 'utils/helpers';
import { showToast } from 'utils/helpers';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';

const ProductListFilter = ({ onChange, onClear }) => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });

  const handleChangeCategory = (value, label) => {
    methods.clearErrors('product_category_id');
    methods.setValue('product_category_id', value);
    methods.setValue('product_category_name', label);
    methods.setValue('model_id', null);
    methods.setValue('model_name', null);
    methods.setValue('product_id', null);
    methods.setValue('product_name', null);
    //getProductModel().then((res) => setOptionsModel(res));
  };

  const getProductModel = async (search = '') => {
    try {
      const productCategoryId = methods.getValues('product_category_id');
      return getOptionsModel({ search, limit: 100, productCategoryId });
    } catch (error) {
      showToast.error({ message: error.message || 'Lỗi lấy model sản phẩm.' });
    }
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() =>
          onClear({
            is_active: 1,
          })
        }
        actions={[
          {
            title: 'Tìm kiếm',
            component: <FormInput placeholder='Mã sản phẩm, tên sản phẩm' field='search' />,
          },
          {
            title: 'Ngành hàng',
            component: (
              <FormTreeSelect
                placeholder='--Chọn--'
                field='product_category_name'
                allowClear={true}
                treeDataSimpleMode
                treeDefaultExpandAll
                fetchOptions={getOptionsTreeview}
                onChange={handleChangeCategory}
              />
            ),
          },
          {
            title: 'Model',
            component: (
              <FormDebouneSelect
                allowClear
                placeholder='--Chọn--'
                field='model_id'
                fetchOptions={getProductModel}
                disabled={!methods.watch('product_category_id')}
              />
            ),
          },
          {
            title: 'Sản phẩm',
            component: (
              <FormDebouneSelect
                allowClear
                placeholder='--Chọn--'
                field='model_id'
                fetchOptions={getProductModel}
                disabled={!methods.watch('product_category_id')}
              />
            ),
          },
        ]}
      />
    </FormProvider>
  );
};

export default ProductListFilter;

ProductListFilter.propTypes = {
  onChange: PropTypes.func,
  onClear: PropTypes.func,
};

ProductListFilter.defaultPropTypes = {
  onChange: () => {},
  onClear: () => {},
};
