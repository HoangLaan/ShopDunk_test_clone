import React, { useMemo, useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import { useLocation, useParams } from 'react-router-dom';

import { createOrderStatus, getDetaiOrderStatus, updateOrderStatus } from '../../services/order-status.service';

import FormStatus from 'components/shared/FormCommon/FormStatus';
import FormSection from 'components/shared/FormSection';
import OrderStatusInformation from './components/add/OrderStatusInformation';
import OrderStatusPermission from './components/add/OrderStatusPermission';
import { useAuth } from 'context/AuthProvider';

const OrderStatusAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const reset = methods.reset;
  const { pathname } = useLocation();
  const { order_status_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/view'), [pathname]);
  const { user } = useAuth();

  const clearInput = useCallback((value = '') => value?.trim(), []);

  const onSubmit = async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;
      payload.order_status_name = clearInput(payload.order_status_name);
      payload.description = clearInput(payload.description);

      let label;
      if (order_status_id) {
        await updateOrderStatus({ ...payload, order_status_id });
        label = 'Chỉnh sửa';
      } else {
        await createOrderStatus(payload);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
        });
      }
      showToast.success(`${label} thành công!!!`);
    } catch (error) {
      showToast.error(error.message || 'Có lỗi xảy ra!');
    }
  };

  const loadDetailHrSalary = useCallback(() => {
    if (order_status_id) {
      getDetaiOrderStatus(order_status_id).then((value) => {
        reset({
          ...value,
        });
      });
    } else {
      reset({
        is_active: 1,
        formality: '0',
      });
    }
  }, [order_status_id, reset]);

  useEffect(loadDetailHrSalary, [loadDetailHrSalary]);

  const detailForm = [
    {
      title: 'Thông tin trạng thái đơn hàng',
      id: 'information',
      component: OrderStatusInformation,
      fieldActive: ['order_status_name'],
    },
    {
      title: 'Thông tin quyền',
      id: 'information_permission',
      component: OrderStatusPermission,
      fieldActive: ['view_function_id', 'add_function_id', 'edit_function_id', 'delete_function_id'],
    },
    { id: 'form_status', title: 'Trạng thái', component: FormStatus, hiddenSystem: !user?.isAdministrator },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} />
    </FormProvider>
  );
};

export default OrderStatusAddPage;
