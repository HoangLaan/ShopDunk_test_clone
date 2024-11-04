import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

//component
import FormSection from 'components/shared/FormSection/index';
import OrderInfor from './components/add/OrderInfor';
import CustomerInfor from './components/add/CustomerInfor';
import BusinessInfo from './components/add/BusinessInfo';
import ApproveInfor from './components/add/ApproveInfor';

const Information = ({ disabled, ordersId, loading, userSchedule, onSubmit }) => {
  const methods = useFormContext();
  const { watch } = methods;
  const gifts = watch('gifts');
  const order_type = watch('order_type');
  const isOrderFromStocksTransfer = order_type === 11;



  const detailForm = useMemo(() => {
    return [
      {
        title: 'Thông tin đặt lịch',
        id: 'OrderInfor',
        component: OrderInfor,
        fieldActive: ['order_type_id', 'order_status_id'],
        orderId: ordersId,
        userSchedule: userSchedule,
        isOrderFromStocksTransfer,
        nameInstanceBusiness: 'business_receive',
        fieldActive: isOrderFromStocksTransfer ? ['business_name'] : ['customer', 'phone_number'],
      },
      {
        title: 'Thông tin khách hàng',
        id: 'CustomerInfor',
        component: isOrderFromStocksTransfer ? BusinessInfo : CustomerInfor,
        nameInstanceBusiness: 'business_receive',
        fieldActive: isOrderFromStocksTransfer ? ['business_name'] : ['customer', 'phone_number'],
        orderId: ordersId,
      },


      {
        title: 'Thông tin duyệt',
        id: 'ApproveInfor',
        component: ApproveInfor,
        fieldActive: ['order_type_id', 'order_status_id'],
        orderId: ordersId,
        userSchedule: userSchedule,
        isOrderFromStocksTransfer,
        nameInstanceBusiness: 'business_receive',
        fieldActive: isOrderFromStocksTransfer ? ['business_name'] : ['customer', 'phone_number'],
      },



    ];
  }, [gifts, ordersId, order_type, userSchedule, onSubmit]);

  return <FormSection detailForm={detailForm} disabled={disabled} loading={loading} />;
};

export default Information;
