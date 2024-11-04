import BWAccordion from 'components/shared/BWAccordion/index';
import FormEditor from 'components/shared/BWFormControl/FormEditor';
import React from 'react';

const NewsContent = ({ disabled, title, website_category_id }) => {
  return (
    <BWAccordion title={title} id={website_category_id} isRequired>
      <FormEditor
        field='description'
        disabled={disabled}
        // validation={{
        //   required: 'Nội dung là bắt buộc',
        // }}
      />
    </BWAccordion>
  );
};

export default NewsContent;