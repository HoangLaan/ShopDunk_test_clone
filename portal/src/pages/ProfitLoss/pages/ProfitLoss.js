import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import AddTab from 'pages/ProfitLoss/tabs/ProfitLossAdd';
import HistoryTab from 'pages/ProfitLoss/tabs/ProfitHistoryHistory';
import Panel from 'components/shared/Panel/index';

const PurchaseOrderAdd = () => {
  const methods = useForm();

  const panel = [
    {
      key: 'profit-loss-calculator',
      label: 'Bảng tính',
      component: AddTab,
    },
    {
      key: 'profit-loss-history',
      label: 'Lịch sử',
      component: HistoryTab,
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
