import React, { useMemo, useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import FormSection from 'components/shared/FormSection';
import { useLocation, useParams } from 'react-router-dom';
import CustomerCareTypeInformation from './components/add/CustomerCareTypeInformation';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import {
  createCustomerCareType,
  getDetailCustomerCareType,
  updateCustomerCareType,
} from 'services/customer-care-type.service';
import ReceiverTable from './components/add/ReceiverTable';
const CustomerCareTypeAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { pathname } = useLocation();
  const { customer_care_type_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);

  const onSubmit = async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;
      let label;
      if (customer_care_type_id) {
        await updateCustomerCareType(customer_care_type_id, payload);
        label = 'Chỉnh sửa';
      } else {
        await createCustomerCareType(payload);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
        });
      }
      showToast.success(`${label} thành công`);
    } catch (error) {
      showToast.error(error?.message ?? 'Có lỗi xảy ra');
    }
  };

  const loadCustomerCareType = useCallback(() => {
    if (customer_care_type_id) {
      getDetailCustomerCareType(customer_care_type_id).then((value) => {
        methods.reset({
          ...value,
        });
      });
    } else {
      methods.reset({
        is_active: 1,
      });
    }
  }, [customer_care_type_id]);

  useEffect(loadCustomerCareType, [loadCustomerCareType]);

  const detailForm = [
    {
      title: 'Thông tin loại chăm sóc khách hàng',
      id: 'information',
      component: CustomerCareTypeInformation,
      fieldActive: ['customer_care_type_name'],
    },
    {
      title: 'Người nhận thông tin',
      id: 'receiver',
      component: ReceiverTable,
    },
    { id: 'status', title: 'Trạng thái', component: FormStatus },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection disabled={disabled} detailForm={detailForm} onSubmit={onSubmit} />
    </FormProvider>
  );
};

export default CustomerCareTypeAddPage;
