import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import PurchaseOrdersTab from 'pages/PurchaseOrder/tabs/PurchaseOrdersTab';
import InvoiceTab from 'pages/PurchaseOrder/tabs/InvoiceTab/InvoiceList';
import Panel from 'components/shared/Panel/index';

const PurchaseOrderAdd = ({ id = 0, isEdit = true }) => {
  const methods = useForm();
  const [purchaseOrder, setpurchaseOrder] = useState();

  const panel = [
    {
      key: 'purchase-order',
      label: 'Phiếu mua hàng',
      component: PurchaseOrdersTab,
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
        <Panel panes={panel} noActions={true} />
      </div>
    </FormProvider>
  );
};

export default PurchaseOrderAdd;
