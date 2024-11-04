import React, { useEffect, useState, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FormSection from 'components/shared/FormSection/index';
import { STATUS_TYPES } from 'utils/constants';
import ICON_COMMON from 'utils/icons.common';
import { showToast } from 'utils/helpers';
import { getDetail, update, create } from 'services/stocks-type.service';

import StocksTypeInfo from './components/Section/StocksTypeInfo';
import StocksTypeStatus from './components/Section/StocksTypeStatus';

function StocksTypeAdd({ id = null, disabled = false }) {
  const methods = useForm();
  const { reset, handleSubmit } = methods;

  const [loading, setLoading] = useState(false);

  const STOCKSTYPE = useMemo(
    () => [
      { value: 1, label: 'Kho hàng mới' },
      { value: 2, label: 'Kho hàng cũ' },
      { value: 3, label: 'Kho bảo hành' },
      { value: 4, label: 'Kho hàng lỗi' },
      { value: 5, label: 'Kho hàng trưng bày' },
      { value: 6, label: 'Kho hàng trôi bảo hành' },
      { value: 7, label: 'Kho hàng dự án' },
      { value: 8, label: 'Kho phụ kiện' },
      { value: 9, label: 'Kho công ty' },
      { value: 0, label: 'Kho chờ xử lí khác' },
    ],
    [],
  );

  const initData = async () => {
    try {
      setLoading(true);
      if (id) {
        const data = await getDetail(id);
        reset({
          ...data,
          stock_type: STOCKSTYPE.findIndex((x) => data[x.key] * 1 === 1),
        });
      } else {
        reset({
          is_active: STATUS_TYPES.ACTIVE,
          is_system: STATUS_TYPES.HIDDEN,
          type: 1,
          is_export_to: 1,
        });
      }
    } catch (error) {
      showToast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initData();
  }, []);

  const onSubmit = async (values) => {
    // let dataSubmit = {
    //   ...values,
    //   ...(STOCKSTYPE || []).reduce((o, x) => {
    //     o[x.key] = 0;
    //     return o;
    //   }, {}),
    //   [STOCKSTYPE.find((v) => v.value === values.stock_type)['key']]: 1,
    // };
    try {
      setLoading(true);
      if (id) {
        await update(id, values);
        showToast.success('Chỉnh sửa thành công');
      } else {
        await create(values);
        showToast.success('Thêm mới thành công');
        await initData();
      }
    } catch (error) {
      showToast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const detailForm = [
    {
      title: 'Thông tin loại kho',
      component: StocksTypeInfo,
      fieldActive: ['stocks_type_name', 'stock_type'],
    },

    {
      title: 'Trạng thái',
      component: StocksTypeStatus,
      fieldActive: ['is_active', 'is_system'],
    },
  ];

  const actions = [
    {
      globalAction: true,
      icon: ICON_COMMON.save,
      type: 'success',
      submit: true,
      content: disabled ? 'Chỉnh sửa' : id ? 'Hoàn tất chỉnh sửa' : 'Hoàn tất thêm mới',
      onClick: () => {
        if (disabled) window._$g.rdr('/stocks-type/edit/' + id);
        else handleSubmit(onSubmit);
      },
    },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection
        loading={loading}
        detailForm={detailForm}
        onSubmit={onSubmit}
        disabled={disabled}
        actions={actions}
      />
    </FormProvider>
  );
}

export default StocksTypeAdd;
