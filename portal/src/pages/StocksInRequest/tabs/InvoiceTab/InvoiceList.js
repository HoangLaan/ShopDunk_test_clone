import React from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';

import Table from './components/Table';
import InvoiceModal from './InvoiceAdd';
import PaymentModal from './Modal/ModalAddPayment';
import PurchaseInvoiceService from 'services/purchase-invoice.service';
import { useHistory } from 'react-router-dom';
import useVerifyAccess from 'hooks/useVerifyAccess';
import { useAuth } from 'context/AuthProvider';
import { useFormContext } from 'react-hook-form';

const InvoiceList = ({ purchaseOrder }) => {
  const methods = useFormContext();
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopupInvoice, setShowPopupInvoice] = useState(false);
  const [showPopupPayment, setShowPopupPayment] = useState(false);
  const searchParams = new URLSearchParams(window.location.search);
  const tabActive = searchParams.get('tab_active');

  const [invoiceId, setInvoiceId] = useState([]);
  const [invoiceIds, setInvoiceIds] = useState([]);
  const { verifyPermission } = useVerifyAccess();
  const { user } = useAuth();
  let history = useHistory();
  const [actions, setActions] = useState({
    isAdd: false,
    isEdit: false,
  });
  const [refresh, setRefresh] = useState(false);

  const getData = useCallback(() => {
    setLoading(true);
    PurchaseInvoiceService.getList({ purchase_order_id: purchaseOrder?.purchase_order_id })
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [purchaseOrder, refresh]);

  useEffect(getData, [getData]);

  // verify permissions
  useEffect(() => {
    if (tabActive === 'purchase-order') {
      const VIEW_PERMISSIONS = 'SL_INVOICE_VIEW';
      const isVerify = verifyPermission(VIEW_PERMISSIONS);
      if (!isVerify && !user.isAdministrator) {
        console.log('redirect ');
        history.push('/500');
      }
    }
  }, [tabActive]);

  return (
    <React.Fragment>
      <div class='bw_main_wrapp' style={{ minHeight: '78vh' }}>
        <Table
          data={dataList}
          loading={loading}
          setShowPopupInvoice={setShowPopupInvoice}
          setShowPopupPayment={setShowPopupPayment}
          setActions={setActions}
          setInvoiceId={setInvoiceId}
          refreshPage={() => setRefresh(!refresh)}
          reloadGlobal={() => {
            setTimeout(() => {
              methods.setValue('reload', {});
            }, 100);
          }}
          invoiceIdFromLedger={searchParams.get('open_popup')}
          setInvoiceIds={setInvoiceIds}
        />
      </div>
      {showPopupInvoice && (
        <InvoiceModal
          purchaseOrder={purchaseOrder}
          onClose={() => {
            setShowPopupInvoice(false);
          }}
          refreshPage={() => setRefresh(!refresh)}
          isAdd={actions.isAdd}
          isEdit={actions.isEdit}
          invoiceId={invoiceId}
          setShowPopupPayment={setShowPopupPayment}
          goToEdit={() => {
            setActions({ isAdd: false, isEdit: true });
          }}
          reloadGlobal={() => {
            setTimeout(() => {
              methods.setValue('reload', {});
            }, 300); // delay for update all pages after
          }}
        />
      )}
      {showPopupPayment && (
        <PaymentModal
          open={showPopupPayment}
          onClose={() => {
            setShowPopupPayment(false);
          }}
          title='Thanh toán hóa đơn mua hàng'
          invoiceIds={invoiceId ? [invoiceId] : invoiceIds}
        />
      )}
    </React.Fragment>
  );
};

export default InvoiceList;
