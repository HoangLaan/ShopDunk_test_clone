import FormSection from 'components/shared/FormSection/index';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';
import { useCallback, useEffect, useMemo } from 'react';
import { showToast } from 'utils/helpers';
import InvoiceInfo from './components/InvoiceInfo';
import moment from 'moment';
import { useAuth } from 'context/AuthProvider';
import ProductList from './components/ProductsList';
import styled from 'styled-components';
import InvoiceSumary from './components/InvoiceInSumary';
import { PAYMENT_STATUS } from './utils/constants';
import PurchaseInvoiceService from 'services/purchase-invoice.service';
import { isNumber } from 'lodash';

const ModalStyle = styled.div`
  .bw_modal_container::-webkit-scrollbar {
    width: 10px;
  }

  .bw_modal_container::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  .bw_modal_container::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 30px;
    transition: all 0.2 ease;
  }

  .bw_modal_container::-webkit-scrollbar-thumb:hover {
    background: #999;
  }

  .bw_modal_container {
    padding: 0;
  }

  .modal_title {
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    padding: 24px !important;
    background: white;
    box-shadow: rgba(149, 157, 165, 0.1) 0px 8px 24px;
  }

  .table-minimun .bw_row.bw_mt_2.bw_mb_2.bw_align_items_center {
    margin: 0 !important;
  }
`;

function InvoiceModal({
  onClose,
  isEdit,
  isAdd,
  purchaseOrder,
  refreshPage,
  invoiceId,
  goToEdit,
  reloadGlobal,
  setShowPopupPayment,
}) {
  const { user } = useAuth();

  const DefaultValue = {
    created_date: moment().format('DD/MM/YYYY'),
    created_user: `${user?.user_name} - ${user?.full_name}`,
    invoice_date: moment().format('DD/MM/YYYY'),
    z_index: 2,
    payment_status: PAYMENT_STATUS.UNPAID,
    is_active: 1,
    cost_price: 0,
    vat_money: 0,
    total_price: 0,
    discount_price: 0,
    total_discount_price: 0,
    total_purchase_cost: 0,
    payment_price: 0,
    supplier_id: purchaseOrder?.supplier_id,
    company_id: purchaseOrder?.company_id,
    purchase_order_id: purchaseOrder?.purchase_order_id,
    payment_expire_date: isNumber(purchaseOrder?.payment_period)
      ? moment().add(purchaseOrder?.payment_period, 'days').format('DD/MM/YYYY')
      : null,
  };

  const methods = useForm({
    defaultValues: DefaultValue,
  });

  const { watch } = methods;

  const disabled = !isEdit && !isAdd;

  const onSubmit = async (payload) => {
    try {
      let label;
      if (isAdd) {
        await PurchaseInvoiceService.create(payload);
        label = 'Thêm mới';
        methods.reset(DefaultValue);
        onClose();
      } else if (isEdit) {
        await PurchaseInvoiceService.create(payload);
        label = 'Chỉnh sửa';
      }
      // refreshPage();
      showToast.success(`${label} thành công !`);
    } catch (error) {
      showToast.error(error?.message || 'Có lỗi xảy ra!');
    }
  };

  useEffect(() => {
    if (invoiceId && !isAdd) {
      PurchaseInvoiceService.getDetail(invoiceId).then((value) => {
        if (value) {
          methods.reset({
            ...value,
            purchase_order_id: purchaseOrder?.purchase_order_id,
          });
        }
      });
    } else {
      // methods.reset(DefaultValue);
    }
  }, [invoiceId, isAdd]);

  const detailForm = [
    {
      title: 'Thông tin hóa đơn mua hàng',
      id: 'invoice_info',
      component: InvoiceInfo,
      fieldActive: ['invoice_date', 'invoice_serial'],
      purchaseOrder: purchaseOrder,
      isEdit: isEdit,
      isAdd: isAdd,
    },
    {
      title: 'Thông tin sản phẩm',
      id: 'invoice_products',
      component: ProductList,
      fieldActive: ['pay_partner_id', 'installment_period'],
      purchaseOrder: purchaseOrder,
      isEdit: isEdit,
      isAdd: isAdd,
    },
    {
      title: 'Thông tin tổng quan',
      id: 'invoice_sumary',
      component: InvoiceSumary,
      fieldActive: ['installment_form_name'],
      purchaseOrder: purchaseOrder,
      isEdit: isEdit,
      isAdd: isAdd,
    },
  ];

  const actions = useMemo(() => {
    return [
      {
        className: 'bw_btn bw_btn_success',
        type: 'success',
        submit: true,
        icon: 'fi fi-rr-check',
        hidden: !isAdd && !isEdit,
        content: `Hoàn tất ${isAdd ? 'thêm mới' : 'chỉnh sửa'}`,
        disabled: false,
        onClick: () => {
          reloadGlobal();
        },
      },
      {
        className: 'bw_btn bw_btn_success',
        type: 'success',
        icon: 'fi fi-rr-check',
        content: 'Chỉnh sửa',
        hidden: isAdd || isEdit || methods.watch('invoice_status') !== 1 || methods.watch('payment_status') !== 0,
        disabled: false,
        onClick: (e) => {
          e.preventDefault();
          goToEdit();
        },
      },
      {
        className: 'bw_btn bw_btn_success',
        type: 'success',
        icon: 'fi fi-rr-dollar',
        content: 'Thanh toán',
        hidden: isAdd || methods.watch('invoice_status') === 0 || methods.watch('payment_status') === 1,
        disabled: false,
        onClick: (e) => {
          e.preventDefault();
          setShowPopupPayment(true);
        },
      },
    ];
  }, [goToEdit, isAdd, isEdit, methods.watch('invoice_status'), reloadGlobal]);

  return (
    <ModalStyle>
      <div
        className='bw_modal bw_modal_open'
        id='bw_add_customer'
        style={{ position: 'absolute', height: 'calc(100vh - 140px)' }}>
        <div
          className='bw_modal_container'
          style={{ width: '94%', maxHeight: '75vh', minWidth: '94%', position: 'relative', paddingTop: '0px' }}>
          <div className='bw_title_modal modal_title' style={{ zIndex: watch('z_index') || 2 }}>
            <h3>{`${isAdd ? 'Thêm mới' : isEdit ? 'Chỉnh sửa' : 'Chi tiết'} hóa đơn mua hàng`}</h3>
            <span className='fi fi-rr-cross-small bw_close_modal' onClick={onClose} />
          </div>
          <div className='modal_content' style={{ padding: '10px', paddingTop: '0px' }}>
            <FormProvider {...methods}>
              <FormSection
                noSideBar
                actions={actions}
                detailForm={detailForm}
                customerClose={onClose}
                onSubmit={onSubmit}
                disabled={disabled}
              />
            </FormProvider>
          </div>
        </div>
      </div>
    </ModalStyle>
  );
}

export default InvoiceModal;
