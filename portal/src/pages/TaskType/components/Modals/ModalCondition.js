import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import ModalPortal from 'components/shared/ModalPortal/ModalPortal';
import { MODAL } from 'pages/TaskType/utils/constants';
import FormTaskWorkflowCondition from '../Forms/FormTaskWorkflowCondition';
import TableSelectCondition from '../Tables/TableSelectCondition';
import FilterSelectCondition from '../Filters/FilterSelectCondition';
import FormCondition from '../Forms/FormCondition';
import { useTaskTypeContext } from 'pages/TaskType/utils/context';

function ModalCondition({ onConfirm }) {
  const methods = useForm();
  const { openModalCondition, taskWorkflowIndex, defaultCondition } = useTaskTypeContext();

  // console.log('ModalCondition', methods.getValues())

  const [params, setParams] = useState({ is_active: 1 });
  const onChange = (p) => setParams({ ...params, ...p });

  useEffect(() => {
    methods.reset({ condition_list: defaultCondition });
  }, [defaultCondition])

  return (
    <ModalPortal
      title='Chọn điều kiện tự động chuyển bước xử lý'
      width={1200}
      onClose={() => openModalCondition(false)}
      onConfirm={() => onConfirm(methods.getValues('condition_list'), taskWorkflowIndex)}>
      <FormProvider {...methods}>
        <div className='bw_row'>
          <div className='bw_col_6'>
            <FormTaskWorkflowCondition />
            <FilterSelectCondition onChange={onChange} />
            <TableSelectCondition params={params} defaultCondition={defaultCondition} />
          </div>
          <div className='bw_col_6'>
            <FormCondition />
          </div>
        </div>
      </FormProvider>
    </ModalPortal>
  );
}

export default ModalCondition;
