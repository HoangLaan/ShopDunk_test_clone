import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

//component
import FormSection from 'components/shared/FormSection/index';
import OrderInfor from './components/add/OrderInfor';
import CustomerInfor from './components/add/CustomerInfor';
import StockoutInfor from './components/add/StockoutInfor';
import Products from './components/add/Products';
import DetailExportVAT from './components/add/DetailExportVAT';
import PayingDetail from './components/add/PayingDetail';
import Materials from './components/add/Materials';
import Gifts from './components/add/Gifts';
import { orderType } from 'pages/Orders/helpers/constans';
import StockoutInforPreOrder from './components/add/StockoutInforPreOrder';
import PayingDetailPreOrder from './components/add/PayingDetailPreOrder';
import InstallmentForm from './components/add/InstallmentForm';
import CustomerInforPreOrder from './components/add/CustomerInforPreOrder';
import BusinessInfo from './components/add/BusinessInfo';

const Information = ({ disabled, ordersId, loading, userSchedule, onSubmit }) => {
  const methods = useFormContext();
  const { watch } = methods;
  const gifts = watch('gifts');
  const order_type = watch('order_type');
  const isOrderFromStocksTransfer = order_type === 11;

  const detailForm = useMemo(() => {
    if (order_type === orderType.PREORDER) {
      return [
        {
          title: 'Thông tin đơn hàng',
          id: 'OrderInfor',
          component: OrderInfor,
          fieldActive: ['order_type_id', 'order_status_id'],
          orderId: ordersId,
        },
        {
          title: 'Thông tin khách hàng',
          id: 'CustomerInfor',
          component: CustomerInforPreOrder,
          fieldActive: ['customer', 'phone_number'],
          orderId: ordersId,
        },
        {
          title: 'Thông tin xuất hàng',
          id: 'StockoutInfor',
          component: StockoutInforPreOrder,
          fieldActive: ['store_id', 'is_delivery_type'],
          ordersId: ordersId,
        },
        {
          title: 'Thông tin sản phẩm',
          id: 'Products',
          component: Products,
          fieldActive: ['products'],
        },
        {
          title: 'Thông tin túi bao bì ',
          id: 'Materials',
          component: Materials,
          fieldActive: ['materials'],
          orderId: ordersId,
        },
        {
          title: 'Thông tin quà tặng',
          id: 'Gifts',
          component: Gifts,
          hidden: gifts?.length === 0,
        },
        {
          title: 'Thông tin thanh toán',
          id: 'PayingDetail',
          component: PayingDetailPreOrder,
          fieldActive: ['total_money', 'sub_total_apply_discount'],
        },
        {
          title: 'Thông tin khác',
          id: 'DetailExportVAT',
          component: DetailExportVAT,
          fieldActive: [
            'is_invoice',
            'invoice_full_name',
            'invoice_tax',
            'invoice_company_name',
            // 'invoice_price',
            'invoice_email',
          ],
          onSubmit: onSubmit,
        },
      ];
    } else if (order_type === orderType.INSTALLMENT_OFFLINE || order_type === orderType.INSTALLMENT_ONLINE) {
      return [
        {
          title: 'Thông tin đơn hàng',
          id: 'OrderInfor',
          component: OrderInfor,
          fieldActive: ['order_type_id', 'order_status_id'],
          orderId: ordersId,
          userSchedule: userSchedule,
        },
        {
          title: 'Thông tin khách hàng',
          id: 'CustomerInfor',
          component: CustomerInfor,
          fieldActive: ['customer', 'phone_number'],
          orderId: ordersId,
        },
        {
          title: 'Thông tin xuất hàng',
          id: 'StockoutInfor',
          component: StockoutInfor,
          fieldActive: ['store_id', 'is_delivery_type'],
          ordersId: ordersId,
          userSchedule: userSchedule,
        },
        {
          title: 'Thông tin sản phẩm',
          id: 'Products',
          component: Products,
          fieldActive: ['products'],
        },
        {
          title: 'Thông tin túi bao bì',
          id: 'Materials',
          component: Materials,
          fieldActive: ['materials'],
          orderId: ordersId,
        },
        {
          title: 'Thông tin quà tặng',
          id: 'Gifts',
          component: Gifts,
          hidden: gifts?.length === 0,
        },
        {
          title: 'Hình thức trả góp',
          id: 'InstallmentType',
          component: InstallmentForm,
          fieldActive: ['installment_type'],
          ordersId: ordersId,
        },
        {
          title: 'Thông tin thanh toán',
          id: 'PayingDetail',
          component: PayingDetail,
          fieldActive: ['total_money', 'sub_total_apply_discount'],
        },
        {
          title: 'Thông tin khác',
          id: 'DetailExportVAT',
          component: DetailExportVAT,
          fieldActive: ['is_invoice', 'invoice_full_name', 'invoice_tax', 'invoice_company_name', 'invoice_email'],
        },
      ];
    }
    return [
      {
        title: 'Thông tin đơn hàng',
        id: 'OrderInfor',
        component: OrderInfor,
        fieldActive: ['order_type_id', 'order_status_id'],
        orderId: ordersId,
        userSchedule: userSchedule,
        isOrderFromStocksTransfer,
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
        title: 'Thông tin xuất hàng',
        id: 'StockoutInfor',
        component: isOrderFromStocksTransfer ? BusinessInfo : StockoutInfor,
        nameInstanceBusiness: 'business_transfer',
        fieldActive: ['store_id', 'is_delivery_type'],
        ordersId: ordersId,
        userSchedule: userSchedule,
        isShowStore: true,
      },
      {
        title: 'Thông tin sản phẩm',
        id: 'Products',
        component: Products,
        fieldActive: ['products'],
        isOrderFromStocksTransfer,
      },
      {
        title: 'Thông tin túi bao bì ',
        id: 'Materials',
        component: Materials,
        fieldActive: ['materials[0]'],
        orderId: ordersId,
      },
      {
        title: 'Thông tin quà tặng',
        id: 'Gifts',
        component: Gifts,
        hidden: gifts?.length === 0 || isOrderFromStocksTransfer,
      },
      {
        title: 'Thông tin thanh toán',
        id: 'PayingDetail',
        component: PayingDetail,
        fieldActive: ['total_money', 'sub_total_apply_discount'],
        isOrderFromStocksTransfer,
      },
      {
        title: 'Thông tin khác',
        id: 'DetailExportVAT',
        component: DetailExportVAT,
        fieldActive: ['is_invoice', 'invoice_full_name', 'invoice_tax', 'invoice_company_name', 'invoice_email'],
        onSubmit: onSubmit,
      },
    ];
  }, [gifts, ordersId, order_type, userSchedule, onSubmit]);

  return <FormSection detailForm={detailForm} disabled={disabled} loading={loading} />;
};

export default Information;
