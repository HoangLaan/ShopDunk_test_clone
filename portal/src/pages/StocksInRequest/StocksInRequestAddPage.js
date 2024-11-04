import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import StockInRequestTab from 'pages/StocksInRequest/tabs/StockInRequestTab';
import InvoiceTab from 'pages/StocksInRequest/tabs/InvoiceTab/InvoiceList';
import Panel from 'components/shared/Panel/index';
import { useLocation } from 'react-router-dom';

const StockInRequestAdd = ({ id = 0, isEdit = true }) => {
  const methods = useForm();
  const [purchaseOrder, setpurchaseOrder] = useState();
  const [poId, SetPId] = useState(null);

  const search = useLocation().search;
  const searchParams = new URLSearchParams(search);
  const purchaseOrderId = searchParams.get('purchase_order_id');
  
  useEffect(() => {
    if (purchaseOrderId) {
      SetPId(purchaseOrderId)
    }
  }, [purchaseOrderId]);

  const panel = [
    {
      key: 'stocks_in_request',
      label: 'Phiếu nhập kho',
      component: StockInRequestTab,
      disabled: !isEdit,
      setpurchaseOrder: setpurchaseOrder,
    },
    {
      key: 'invoice',
      label: 'Hóa đơn',
      component: InvoiceTab,
      disabled: !isEdit,
      purchaseOrder: purchaseOrder,
    },
  ];

  return (
    <FormProvider {...methods}>
      <div className='bw_main_wrapp'>
        <Panel panes={panel} noActions={true} purchaseOrderId={poId} />
      </div>
    </FormProvider>
  );
};

export default StockInRequestAdd;
