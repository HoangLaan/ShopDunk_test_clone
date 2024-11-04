import React from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { LIST_TYPE } from 'pages/EmailMarketing/utils/constants';
import { useFormContext } from 'react-hook-form';
import FormEditor from 'components/shared/BWFormControl/FormEditor';

const EmailHistoryInfo = ({ disabled, title, id }) => {
  const methods = useFormContext();

  return (
    <BWAccordion title={title} id={id}>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <FormEditor field='email_content' disabled={disabled} height={500} />
        </div>
      </div>
    </BWAccordion>
  );
};

export default EmailHistoryInfo;
