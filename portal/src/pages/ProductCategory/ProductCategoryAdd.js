import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { showToast } from 'utils/helpers';

import { PANEL_TYPES } from './helpers/constants';
import { getDetail, create, update } from 'services/product-category.service';

import Panel from 'components/shared/Panel/index';
import ProductCategoryCommonInfo from './components/add/CommonInfoTab/index';
import ProductCategoryMaterial from './components/add/MaterialTab/index';

const defaultValues = {
  is_active: 1,
  category_type: 1,
  pictures: [],
};

export default function ProductCategoryAdd() {
  const methods = useForm({
    defaultValues,
  });
  const { reset } = methods;
  const { pathname } = useLocation();
  const { product_category_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);
  const isCopy = useMemo(
    () => !pathname.includes('/edit') && Boolean(product_category_id) && !disabled,
    [pathname, product_category_id, disabled],
  );
  const [loading, setLoading] = useState(false);

  const getData = useCallback(() => {
    try {
      if (product_category_id) {
        setLoading(true);
        getDetail(product_category_id)
          .then((data) => {
            if (data) {
              reset({
                ...data,
                add_function_id: String(data?.add_function_id),
                edit_function_id: String(data?.edit_function_id),
                view_function_id: String(data?.view_function_id),
                delete_function_id: String(data?.delete_function_id),
                company_id: parseInt(data.company_id),
              });
            }
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        reset(defaultValues);
      }
    } catch (error) {
      showToast.error(window._$g._(error.message));
    }
  }, [product_category_id, reset]);
  useEffect(getData, [getData]);

  const onSubmit = useCallback(
    async (values) => {
      setLoading(true);

      values.parent_id = values?.parent_id?.value ? values.parent_id.value : values.parent_id;

      if (isCopy) values.product_category_id = null;

      values.delete_function_id = values?.delete_function_id?.id ?? values?.delete_function_id;
      values.edit_function_id = values?.edit_function_id?.id ?? values?.edit_function_id;
      values.view_function_id = values?.view_function_id?.id ?? values?.view_function_id;
      values.view_function_id = values?.view_function_id?.id ?? values?.view_function_id;
      values.add_function_id = values?.add_function_id?.id ?? values?.add_function_id;
      try {
        if (product_category_id && !isCopy) {
          await update(product_category_id, values);
          showToast.success('Cập nhật ngành hàng thành công', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });
        } else {
          await create(values);
          showToast.success(`${isCopy ? 'Sao chép' : 'Thêm mới'} ngành hàng thành công`, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });
          reset(defaultValues);
          if (isCopy) window.location.href = '/product-category';
        }
      } catch (error) {
        let { message } = error;

        showToast.error(message ?? 'Có lỗi xảy ra!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      } finally {
        setLoading(false);
      }
    },
    [product_category_id, reset, isCopy],
  );

  const panels = [
    {
      key: PANEL_TYPES.INFORMATION,
      label: 'Thông tin chung',
      noActions: true,
      component: ProductCategoryCommonInfo,
      disabled: disabled,
      loading: loading,
    },
    {
      key: PANEL_TYPES.MATERIAL,
      label: 'Túi bao bì',
      component: ProductCategoryMaterial,
      disabled: disabled,
      loading: loading,
    },
  ];

  return (
    <FormProvider {...methods}>
      <div className='bw_main_wrapp'>
        <Panel panes={panels} onSubmit={onSubmit} hasSubmit />
      </div>
    </FormProvider>
  );
}
