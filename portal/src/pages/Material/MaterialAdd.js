/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useParams, useLocation } from 'react-router';
import { showToast } from 'utils/helpers';

// Components
import InfoTab from './components/add/InfoTab/index';
import StockTab from './components/add/StockTab/index';
// Services
import { getDetail, update, create, genCode } from 'services/material.service';
import { DEFAULT_ACCOUNT_LIST, PANEL_TYPES } from './helpers/constants';
import { initialValues } from './helpers/index';
import { ProductAddProvider } from './helpers/context';
// Helper
import Panel from 'components/shared/Panel/index';
import AttributesAdd from './components/add/InfoTab/modals/AttributesModalAdd';

export default function MaterialAdd() {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });

  const { reset } = methods;

  let { material_id } = useParams();
  const { pathname } = useLocation();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);
  const isCopy = useMemo(
    () => !pathname.includes('/edit') && Boolean(material_id) && !disabled,
    [pathname, material_id, disabled],
  );
  const [loading, setLoading] = useState(false);

  const getData = useCallback(() => {
    try {
      if (material_id) {
        setLoading(true);
        getDetail(material_id)
          .then((data) => {
            if (data?.default_account_list?.length === 0) {
              data.default_account_list = DEFAULT_ACCOUNT_LIST;
            }
            if (data) reset({ ...data });
          })
          .catch(() => {
            showToast.error(`Không tìm thấy túi bao bì.`, {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'colored',
            });
            window._$g.rdr('/404');
          })
          .finally(() => {
            setLoading(false);
          });
      }
    } catch (error) {
      showToast.error(window._$g._(error.message));
    }
  }, [material_id, reset]);

  useEffect(getData, [getData]);

  // Test data
  useEffect(() => {
    methods.reset(initialValues);
    if(!material_id) genCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = useCallback(
    async (values) => {
      values.manufacturer_id = values.manufacturer_id?.value;
      values.origin_id = values.origin_id?.value;
      values.unit_id = values.unit_id?.value;

      values.is_active = values.is_active ? 1 : 0;
      values.is_system = values.is_system ? 1 : 0;

      if (isCopy) values.material_id = null;

      try {
        setLoading(true);

        if (material_id && !isCopy) {
          await update(material_id, values);

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

          showToast.success(`${isCopy ? 'Sao chép' : 'Thêm mới'} túi bao bì thành công`, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });

          reset({ ...initialValues, material_code: await genCode() });
          if (isCopy) window.location.href = '/material';
        }
      } catch (error) {
        let { errors, statusText, message } = error;
        let msg = [`${statusText || message}`].concat(errors || []).join('.');
        showToast.error(msg, {
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
    [material_id, isCopy, reset],
  );

  const panels = [
    {
      key: PANEL_TYPES.INFORMATION,
      label: 'Thông tin túi bao bì',
      noActions: true,
      component: InfoTab,
      disabled: disabled,
      loading: loading,
      isEdit: material_id ? true : false,
    },
    {
      key: PANEL_TYPES.STOCK,
      label: 'Hạn mức tồn kho',
      component: StockTab,
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

        <AttributesAdd />
      </ProductAddProvider>
    </div>
  );
}
