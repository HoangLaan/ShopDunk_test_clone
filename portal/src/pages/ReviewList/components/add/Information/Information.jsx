import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

//component
import FormSection from 'components/shared/FormSection/index';
import OrderInfor from './components/add/OrderInfor';
import CustomerInfor from './components/add/CustomerInfor';
import BusinessInfo from './components/add/BusinessInfo';
import ApproveInfor from './components/add/ApproveInfor';

const Information = ({ disabled, ReviewId, loading, userSchedule, onSubmit }) => {
  const methods = useFormContext();
  const { watch } = methods;
  const order_type = watch('order_type');
  const isOrderFromStocksTransfer = order_type === 11;

  const detailForm = useMemo(() => {
    return [
      {
        title: 'Thông tin chung',
        id: 'OrderInfor',
        component: OrderInfor,
        CustomerInfor,
        fieldActive: ['order_type_id', 'order_status_id'],
        ReviewId: ReviewId,
        userSchedule: userSchedule,
        isOrderFromStocksTransfer,
        nameInstanceBusiness: 'business_receive',
        fieldActive: isOrderFromStocksTransfer ? ['business_name'] : ['customer', 'phone_number'],
      },
      {
        title: 'Thông tin đánh giá',
        id: 'CustomerInfor',
        component: BusinessInfo,
        nameInstanceBusiness: 'business_receive',
        fieldActive: isOrderFromStocksTransfer ? ['business_name'] : ['customer', 'phone_number'],
        ReviewId: ReviewId,
      },

      {
        title: 'Thông tin xét duyệt',
        id: 'ApproveInfor',
        component: ApproveInfor,
        fieldActive: ['order_type_id', 'order_status_id'],
        ReviewId: ReviewId,
        userSchedule: userSchedule,
        isOrderFromStocksTransfer,
        nameInstanceBusiness: 'business_receive',
        fieldActive: isOrderFromStocksTransfer ? ['business_name'] : ['customer', 'phone_number'],
      },
    ];
  }, [ReviewId, userSchedule, isOrderFromStocksTransfer]);

  return <FormSection detailForm={detailForm} disabled={disabled} loading={loading} />;
};

export default Information;
