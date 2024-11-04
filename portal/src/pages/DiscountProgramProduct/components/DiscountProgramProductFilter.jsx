import React, { useCallback, useEffect, useState } from 'react';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import { FormProvider, useForm } from 'react-hook-form';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { mapDataOptions4Select, mapDataOptions4SelectCustom, showToast } from 'utils/helpers';
import { getProductOptions } from 'services/discount-program-product.service';
import { getOptionsTreeview, getOptionsModel } from 'services/product-category.service';
import { useDispatch, useSelector } from 'react-redux';
import { getOptionsGlobal } from 'actions/global';
import FormTreeSelect from 'components/shared/BWFormControl/FormTreeSelect';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';

const InitialValue = {
  apply_from: null,
  apply_to: null,
  discount_program_id: null,
  product_category_id: null,
  model_id: null,
  product_id: null,
  apply_date_from: null,
  apply_date_to: null,
};

const DiscountProgramProductFilter = ({ onChange }) => {
  const methods = useForm();
  const { watch, reset } = methods;
  const dispatch = useDispatch();

  const product_category_id = watch('product_category_id');
  const model_id = watch('model_id');

  const [productOptions, setProductOptions] = useState([]);
  const discountProgramData = useSelector((state) => state.global.discountProgramData);

  useEffect(() => {
    dispatch(getOptionsGlobal('discountProgram'));
  }, []);

  const getProductModel = async (search = '') => {
    try {
      let models = [];
      if (product_category_id) {
        const res = await getOptionsModel({ search, limit: 100, productCategoryId: product_category_id });
        models = mapDataOptions4Select(res);
      }
      return models;
    } catch (error) {
      showToast.error({ message: error.message || 'Lỗi lấy model sản phẩm.' });
    }
  };

  useEffect(() => {
    getProductOptions({ product_category_id, model_id: model_id?.value }).then((data) => {
      setProductOptions(data);
    });
  }, [product_category_id, model_id]);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={(query) => {
          onChange({ ...query, model_id: query.model_id?.value || null });
        }}
        onClear={() => {
          onChange(InitialValue);
          reset(InitialValue);
        }}
        actions={[
          {
            title: 'Chương trình chiết khấu',
            component: (
              <FormSelect field={'discount_program_id'} list={mapDataOptions4SelectCustom(discountProgramData)} />
            ),
          },
          {
            title: 'Ngành hàng',
            component: (
              <FormTreeSelect
                field='product_category_id'
                allowClear={true}
                treeDataSimpleMode
                fetchOptions={getOptionsTreeview}
                placeholder='Tất cả'
              />
            ),
          },
          {
            title: 'Model',
            component: (
              <FormDebouneSelect
                field='model_id'
                fetchOptions={getProductModel}
                allowClear={true}
                placeholder='Tất cả'
                disabled={!product_category_id}
              />
            ),
          },
          {
            title: 'Sản phẩm',
            component: <FormSelect field={'product_id'} list={productOptions} />,
          },
          {
            title: 'Thời gian áp dụng chiết khấu',
            component: (
              <FormDateRange
                allowClear={true}
                fieldStart={'apply_date_from'}
                fieldEnd={'apply_date_to'}
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
              />
            ),
          },
        ]}
        colSize={3}
      />
    </FormProvider>
  );
};

export default DiscountProgramProductFilter;
