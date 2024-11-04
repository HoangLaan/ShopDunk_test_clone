import React, { useState } from 'react';
import PageProvider from '../components/PageProvider/PageProvider';
import { LARGE_LIST_PARAMS } from 'utils/constants';
import TemplateTab from '../tabs/zaloTemplate/ListPage'
import { FormProvider, useForm } from 'react-hook-form';
import Panel from 'components/shared/Panel';
import ZaloHistory from '../tabs/zaloHistory/HistoryPage';

function ZaloTabList() {
  const methods = useForm()

  const panel = [
    {
      key: 'history',
      label: 'Lịch sử Zalo',
      component: ZaloHistory
    },
    {
      key: 'templates',
      label: 'Mẫu Zalo',
      component: TemplateTab,
    },
  ];

  return (
    <FormProvider {...methods}>
      <div className='bw_main_wrapp'>
        <Panel panes={panel} noActions={true} />
      </div>
    </FormProvider>
  );
}

export default ZaloTabList;