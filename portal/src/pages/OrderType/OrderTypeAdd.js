import React, { useCallback, useEffect, useMemo, useState } from 'react';
import FormSection from 'components/shared/FormSection/index';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';
import { createOrderType, updateOrderType, getDetail } from './helpers/call-api';
import OrderTypeInfo from './components/Form/OrderTypeInfo';
import OrderTypePermission from './components/Form/OrderTypePermission';
import OrderTypeStatus from './components/Form/OrderTypeStatus';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import { mapDataOptions4Select, showToast } from 'utils/helpers';
import { getOptionsFunction } from 'services/function.service';
import { useAuth } from 'context/AuthProvider';
import OrderTypeMapping from './components/Form/OrderTypeStocksType';
const OrderTypeAdd = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
      is_offline: 1,
    },
  });
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { id: order_type_id } = useParams();
  const isDetail = useMemo(() => pathname.includes('/detail'), [pathname]);
  const disabled = useMemo(
    () => isDetail || (!user.isAdministrator && methods.watch('is_system')),
    [isDetail, methods.watch('is_system')],
  );
  const clearInput = useCallback((value = '') => value?.trim(), []);

  const onSubmit = async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;
      payload.description = clearInput(payload.description);
      let label;
      if (order_type_id) {
        await updateOrderType(order_type_id, payload);
        label = 'Chỉnh sửa';
      } else {
        await createOrderType(payload);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
          is_offline: 1,
        });
      }
      showToast.success(`${label} thành công!!!`);
    } catch (error) {
      showToast.error(error ? error.message : 'Có lỗi xảy ra!');
    }
  };

  const loadDetail = useCallback(() => {
    if (order_type_id) {
      getDetail(order_type_id).then((value) => {
        methods.reset(value);
      });
    } else {
      methods.reset({
        is_active: 1,
        business_ids: [],
      });
    }
  }, [order_type_id]);

  const [functionOpts, setFunctionOpts] = useState([]);
  const loadFunctionOptions = useCallback(async () => {
    try {
      let dataFunctionOpts = await getOptionsFunction();
      setFunctionOpts(mapDataOptions4Select(dataFunctionOpts, 'id', 'name'));
    } catch (error) {
      showToast.error(error ? error.message : 'Có lỗi xảy ra!');
    }
  }, []);
  useEffect(() => {
    loadFunctionOptions();
  }, []);

  const detailForm = [
    {
      title: 'Thông tin loại đơn hàng',
      id: 'information_order_type',
      component: OrderTypeInfo,
      fieldActive: ['order_type_name'],
    },
    {
      title: 'Thông tin trạng thái loại đơn hàng',
      id: 'information_order_type_status',
      component: OrderTypeStatus,
      fieldActive: ['order_status_list'],
      functionOpts,
    },
    {
      title: 'Danh sách loại kho',
      id: 'stoks_type_list',
      component: OrderTypeMapping,
      fieldActive: ['stocks_type_list'],
    },
    {
      title: 'Thông tin quyền',
      id: 'information_permission',
      component: OrderTypePermission,
      fieldActive: ['view_function_id', 'add_function_id', 'edit_function_id', 'delete_function_id'],
      functionOpts,
    },

    {
      id: 'status',
      title: 'Trạng thái',
      component: FormStatus,
    },
  ];

  useEffect(loadDetail, [loadDetail]);

  return (
    <FormProvider {...methods}>
      <FormSection detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} />
    </FormProvider>
  );
};

export default OrderTypeAdd;
