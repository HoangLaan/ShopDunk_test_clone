import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FormSection from 'components/shared/FormSection/index';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import { showToast } from 'utils/helpers';
import usePageInformation from 'hooks/usePageInformation';
import { STATUS_TYPES } from 'utils/constants';

import customerCouponService from 'services/customerCoupon.service';
import PageProvider from '../components/PageProvider/PageProvider';
import CouponForm from '../components/Forms/CouponForm';
import CustomerForm from '../components/Forms/CustomerForm';
import StatusForm from '../components/Forms/StatusForm';

function CustomerCouponAdd() {
  const methods = useForm();
  const [loading, setLoading] = useState(false);

  const { disabled, id: customerCouponId } = usePageInformation();

  const initData = async () => {
    try {
      setLoading(true);
      if (customerCouponId) {
        const data = await customerCouponService.getById(customerCouponId);
        methods.reset(data);
      } else {
        methods.reset({ is_active: STATUS_TYPES.ACTIVE });
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

  const onSubmit = async (payload) => {
    try {
      setLoading(true);
      if (customerCouponId) {
        await customerCouponService.update(payload);
        showToast.success('Chỉnh sửa thành công');
      } else {
        // await customerCouponService.create(payload);
        // showToast.success('Thêm mới thành công');
        // await initData();
      }
    } catch (error) {
      showToast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const detailForm = [
    {
      id: 'CUSTOMER_FORM',
      title: 'Thông tin khách hàng',
      component: CustomerForm,
    },
    {
      id: 'COUPON_FORM',
      title: 'Thông tin mã giảm giá',
      component: CouponForm,
    },
    {
      id: 'STATUS_FORM',
      title: 'Trạng thái',
      component: StatusForm,
    },
  ];

  return (
    <PageProvider>
      <FormProvider {...methods}>
        <FormSection loading={loading} detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} />
      </FormProvider>
    </PageProvider>
  );
}

export default CustomerCouponAdd;
