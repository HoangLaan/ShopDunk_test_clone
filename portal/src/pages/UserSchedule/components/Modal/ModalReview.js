import React from 'react';

import { FormProvider, useForm } from 'react-hook-form';
import ModalPortal from 'components/shared/ModalPortal/ModalPortal';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormItem from 'components/shared/BWFormControl/FormItem';

function ModalReview({ onSubmit, onClose }) {
  const methods = useForm({});

  return (
    <ModalPortal
      title='Duyệt'
      onClose={onClose}
      onConfirm={() => {
        methods.setValue('is_review', 1)
        methods.handleSubmit(onSubmit)()
      }}
      confirmText='Đồng ý'
      rejectText='Từ chối'
      onReject={() => {
        methods.setValue('is_review', 0)
        methods.handleSubmit(onSubmit)()
      }}
      >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <FormItem label='Ghi chú duyệt' isRequired={true} style='gray'>
            <FormTextArea
              rows={3}
              field='note'
              placeholder='Nhập ghi chú duyệt'
              validation={{
                required: 'Vui lòng nhập ghi chú duyệt',
              }}
            />
          </FormItem>
        </form>
      </FormProvider>
    </ModalPortal>
  );
}

export default ModalReview;
