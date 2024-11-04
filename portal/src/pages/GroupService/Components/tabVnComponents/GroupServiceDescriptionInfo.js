import React from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormEditor from 'components/shared/BWFormControl/FormEditor'


export default function GroupServiceDescriptionInfo({ disabled }) {
  return (
    <BWAccordion title='Mô tả' id='description'>
      <FormEditor
        field='description'
        disabled={disabled}
        // validation={{
        //   required: 'Nội dung là bắt buộc'
        // }}
      />
    </BWAccordion>
  );
}