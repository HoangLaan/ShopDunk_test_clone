import FormSection from 'components/shared/FormSection';
import OrderInfor from './OrderInfor';
import CustomerInfor from './CustomerInfor';
import InvoiceLookup from './InvoiceLookup';
import InvoiceTable from './InvoiceTable';
import { getPaymentMethodByPaymentList } from 'pages/Orders/helpers/utils';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

function Invoice({ disabled, ordersId, loading }) {
  const methods = useFormContext();

  useEffect(() => {
    const paymentMethod = getPaymentMethodByPaymentList(methods.getValues()?.data_payment);
    methods.setValue('order_payment_form', paymentMethod);
  }, []);

  const detailForm = [
    {
      title: 'Thông tin đơn hàng',
      id: 'OrderInfor',
      component: OrderInfor,
      fieldActive: [],
    },
    {
      title: 'Thông tin khách hàng',
      id: 'CustomerInfor',
      component: CustomerInfor,
      fieldActive: [],
    },
    {
      title: 'Bảng hoá đơn',
      id: 'InvoiceTable',
      component: InvoiceTable,
      fieldActive: [],
    },
    {
      title: 'Thông tin tra cứu hóa đơn',
      id: 'InvoiceLookup',
      component: InvoiceLookup,
      fieldActive: [],
    },
  ];

  return (
    // <FormProvider {...methods}>
    <FormSection detailForm={detailForm} disabled={disabled} loading={loading} />
    // </FormProvider>
  );
}

export default Invoice;
