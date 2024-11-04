import React, { useCallback, useEffect, useMemo } from 'react';
import FormSection from 'components/shared/FormSection/index';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';

import { create, update, getById } from 'services/email-list.service';
import CustomerListInfo from '../components/FormSection/Infomation';
import CustomerList from '../components/FormSection/CustomerList';
import { showToast } from 'utils/helpers';
import { EMAIL_LIST_TYPE } from 'pages/EmailMarketing/utils/constants';

const CustomerListAdd = () => {
  const methods = useForm({
    defaultValues: {
      email_list_type: EMAIL_LIST_TYPE.PRESONAL,
    },
  });

  const { pathname } = useLocation();
  const { id: customer_list_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);

  const onSubmit = async (payload) => {
    try {
      if (!payload?.customer_list?.length) {
        showToast.warn('Vui lòng chọn danh sách khách hàng');
        return;
      }
      let label;
      if (customer_list_id) {
        await update(payload);
        label = 'Chỉnh sửa';
      } else {
        await create(payload);
        label = 'Thêm mới';
        methods.reset({
          email_list_type: EMAIL_LIST_TYPE.PRESONAL,
        });
      }
      showToast.success(`${label} thành công`);
    } catch (error) {
      showToast.error(error?.message || 'Có lỗi xảy ra');
    }
  };

  const loadDetail = useCallback(() => {
    if (customer_list_id) {
      getById(customer_list_id).then((value) => {
        methods.reset(value);
      });
    } else {
      methods.reset({
        email_list_type: EMAIL_LIST_TYPE.PRESONAL,
      });
    }
  }, [customer_list_id, methods]);

  const detailForm = [
    {
      title: 'Thông tin danh sách khách hàng',
      id: 'customer_list_info',
      component: CustomerListInfo,
      fieldActive: ['email_list_name', 'email_list_type'],
    },
    {
      id: 'customer_list',
      title: 'Danh sách khách hàng',
      require: true,
      fieldActive: ['customer_list'],
      component: CustomerList,
    },
  ];

  useEffect(loadDetail, [loadDetail]);

  return (
    <FormProvider {...methods}>
      <FormSection
        detailForm={detailForm}
        onSubmit={onSubmit}
        disabled={disabled}
        customerClose={() => {
          window._$g.rdr(`/email-marketing?tab_active=receipts`);
        }}
      />
    </FormProvider>
  );
};

export default CustomerListAdd;
