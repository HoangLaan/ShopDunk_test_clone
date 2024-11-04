import FormSection from 'components/shared/FormSection';
import OrderInfor from './OrderInfor';
import CustomerInfor from './CustomerInfor';
import InvoiceLookup from './InvoiceLookup';
import InvoiceTable from './InvoiceTable';
import { getPaymentMethodByPaymentList } from 'pages/Orders/helpers/utils';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { createInvoice, getOrderInvoice } from 'services/return-purchase.service';
import { showToast } from 'utils/helpers';

function Invoice({ ordersId, loading }) {
  const methods = useFormContext();
  const { watch, getValues, reset } = methods;

  useEffect(() => {
    const paymentMethod = getPaymentMethodByPaymentList(methods.getValues()?.data_payment ?? []);
    methods.setValue('order_payment_form', paymentMethod);
  }, []);

  const purchase_order_id = watch('purchase_order_id');
  useEffect(() => {
    if (purchase_order_id) {
      getOrderInvoice({ purchase_order_id }).then((data) => {
        reset({
          ...getValues(),
          order_id: data.order_id,
        });
      });
    }
  }, [purchase_order_id]);

  const onSubmit = async () => {
    try {
      await createInvoice(getValues()).then(() => showToast.success('Thêm hóa đơn thành công'));
    } catch (error) {
      console.log(`error:`, error);
      showToast.error('Thêm hóa đơn thất bại');
    }
  };

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

  const actions = [
    {
      className: 'bw_btn bw_btn_success',
      type: 'success',
      icon: 'fi fi-rr-check',
      content: `Hoàn tất thêm mới`,
      onClick: (e) => {
        e.preventDefault();
        onSubmit();
      },
    },
    // {
    //   className: 'bw_btn bw_btn_success',
    //   type: 'success',
    //   icon: 'fi fi-rr-check',
    //   content: 'Chỉnh sửa',
    //   hidden: !isView,
    //   disabled: false,
    //   onClick: (e) => {
    //     e.preventDefault();
    //     // if(isView) window._$g.rdr(`/internal-transfer/edit/${id}`);
    //   },
    // },
  ];

  return (
    // <FormProvider {...methods}>
    <FormSection detailForm={detailForm} loading={loading} actions={actions} />
    // </FormProvider>
  );
}

export default Invoice;
