/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useParams, useLocation } from 'react-router';
import { showToast } from 'utils/helpers';

// Components
import InfoTab from './components/add/InfoTab/index';
import StockTab from './components/add/StockTab/index';
// Services
import { getDetail, update, create } from 'services/product.service';
// Helper
import { initialValues } from './helpers/index';
import { PANEL_TYPES } from './helpers/constants';
import Panel from 'components/shared/Panel/index';
import { ProductAddProvider } from './helpers/context';
import AttributesAdd from './components/add/InfoTab/modals/AttributesModalAdd';
import UnitConversionTab from './components/add/UnitConversionTab/index';

export default function ProductAdd() {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });

  const { reset, register, watch } = methods;

  let { product_id } = useParams();
  const { pathname } = useLocation();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);
  const isCopy = useMemo(
    () => !pathname.includes('/edit') && Boolean(product_id) && !disabled,
    [pathname, product_id, disabled],
  );
  const [loading, setLoading] = useState(false);

  const getData = useCallback(() => {
    try {
      if (product_id) {
        setLoading(true);
        getDetail(product_id)
          .then((data) => {
            if (data) reset({ ...data });
          })
          .catch(() => {
            showToast.error(`Không tìm thấy sản phẩm.`);
            window._$g.rdr('/404');
          })
          .finally(() => {
            setLoading(false);
          });
      }
    } catch (error) {
      showToast.error(window._$g._(error.message));
    }
  }, [product_id, reset]);

  useEffect(getData, [getData]);

  // Test data
  useEffect(() => {
    methods.reset(initialValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    register('attributes', { required: 'Thuộc tính sản phẩm là bắt buộc.' });
    // register('images', { required: 'Hình ảnh sản phẩm là bắt buộc.' });
  }, [register]);

  const onSubmit = useCallback(
    async (values) => {
      values.warranty_period_id = values?.warranty_period_id?.value
        ? values.warranty_period_id.value
        : values.warranty_period_id;

      if (isCopy) values.product_id = null;

      try {
        setLoading(true);
        if (typeof values.product_category_id == 'object') {
          values.product_category_id = parseInt(values.product_category_id?.value);
        }

        if (product_id && !isCopy) {
          await update(product_id, values);

          showToast.success('Cập nhật sản phẩm thành công');
        } else {
          await create(values);
          showToast.success(`${isCopy ? 'Sao chép' : 'Thêm mới'} sản phẩm thành công`);
          reset(initialValues);
          if (isCopy) window.location.href = '/product';
        }
      } catch (error) {
        let { errors, statusText, message } = error;
        let msg = [`${statusText || message}`].concat(errors || []).join('.');
        showToast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [product_id, isCopy, reset],
  );

  const panels = [
    {
      key: PANEL_TYPES.INFORMATION,
      label: 'Thông tin hàng hóa - vật tư',
      noActions: true,
      component: InfoTab,
      disabled: disabled,
      loading: loading,
    },
    {
      key: PANEL_TYPES.STOCK,
      label: 'Hạn mức tồn kho',
      component: StockTab,
      disabled: disabled,
      loading: loading,
    },
    {
      key: PANEL_TYPES.UNIT_CONVERSION,
      label: 'Quy đổi đơn vị tính',
      component: UnitConversionTab,
      disabled: disabled,
      loading: loading,
    },
  ];

  return (
    <div className='bw_main_wrapp'>
      <ProductAddProvider>
        <FormProvider {...methods}>
          <Panel panes={panels} onSubmit={onSubmit} hasSubmit />
        </FormProvider>

        <AttributesAdd modelId={watch('model_id.value')} />
      </ProductAddProvider>
    </div>
  );
}
