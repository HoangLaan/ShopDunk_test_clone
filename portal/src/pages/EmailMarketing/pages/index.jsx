import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import EmailTab from '../tabs/EmailHistory/pages/ListPage';
import ListTab from '../tabs/EmailList/pages/ListPage';
import TemplateTab from '../tabs/EmailTemplate/pages/ListPage';
import Panel from 'components/shared/Panel/index';

const EmailTabList = ({ id = 0, isEdit = true }) => {
  const methods = useForm();

  const panel = [
    {
      key: 'emails',
      label: 'Email',
      component: EmailTab,
      disabled: !isEdit,
    },
    {
      key: 'receipts',
      label: 'Danh sách',
      component: ListTab,
      disabled: !isEdit,
    },
    {
      key: 'templates',
      label: 'Mẫu Email',
      component: TemplateTab,
      disabled: !isEdit,
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

export default EmailTabList;
