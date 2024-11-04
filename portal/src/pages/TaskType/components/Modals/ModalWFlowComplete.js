import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';

import ModalPortal from 'components/shared/ModalPortal/ModalPortal';
import { WFLOW_REPEAT_TYPE_OPTIONS } from 'pages/TaskType/utils/constants';

function ModalWFlowComplete({ onClose, onConfirm, onReject }) {
  const methods = useForm();

  return (
    <ModalPortal
      title='Xác nhận bước hoàn thành'
      onClose={onClose}
      confirmText='Xác nhận'
      onConfirm={methods.handleSubmit(onConfirm)}
      onReject={onReject}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onConfirm)}>
          <div className='bw_main_modal'>
            <FormItem className='bw_col_12' label='Lặp lại quy trình này' style='gray'>
              <FormSelect
                field='type_repeat'
                list={WFLOW_REPEAT_TYPE_OPTIONS}
                allowClear={true}
              />
            </FormItem>
          </div>
        </form>
      </FormProvider>
    </ModalPortal>
  );
}

export default ModalWFlowComplete;
