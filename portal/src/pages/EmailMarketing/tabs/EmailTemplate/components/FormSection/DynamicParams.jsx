import React, { useEffect } from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { useFormContext } from 'react-hook-form';
import DataTable from 'components/shared/DataTable/index';
import { extractParams } from 'pages/EmailMarketing/utils/helper';
import { CRM_ACCOUNT_FIELDS, CRM_DATALEADS_FIELDS, CRM_PARTNER_FIELDS } from 'pages/EmailMarketing/utils/constants';
import FormEditorExtend from 'components/shared/BWFormControl/FormEditorExtend';

const EmailContent = ({ disabled, title, id }) => {
  const methods = useFormContext();

  const columns = [
    {
      header: 'Tham số mẫu mail',
      disabled: disabled,
      accessor: 'template_param',
    },
    {
      header: 'KH Doanh nghiệp',
      disabled: disabled,
      formatter: (_, index) => (
        <FormSelect
          bordered
          list={CRM_PARTNER_FIELDS}
          field={`email_template_params.${index}.business_customer_param`}></FormSelect>
      ),
    },
    {
      header: 'KH Cá nhân',
      disabled: disabled,
      formatter: (_, index) => (
        <FormSelect
          bordered
          list={CRM_ACCOUNT_FIELDS}
          field={`email_template_params.${index}.individual_customer_param`}></FormSelect>
      ),
    },
    {
      header: 'KH Tiềm năng',
      disabled: disabled,
      formatter: (_, index) => (
        <FormSelect
          bordered
          list={CRM_DATALEADS_FIELDS}
          field={`email_template_params.${index}.potentital_customer_param`}></FormSelect>
      ),
    },
  ];

  useEffect(() => {
    const html = methods.getValues('email_template_html');
    const params = extractParams(html);

    const previousParams = methods.getValues('email_template_params');
    if (previousParams && previousParams.length > 0) {
      const mergedParams = params.map((param) => {
        const targetParams = previousParams.find((_) => _.template_param === param);
        return targetParams ? targetParams : { template_param: param };
      });

      methods.setValue('email_template_params', mergedParams);
    } else {
      const template_params = params.map((param) => ({ template_param: param }));
      methods.setValue('email_template_params', template_params);
    }
  }, [methods.watch('email_template_html')]);

  return (
    <BWAccordion title={title} id={id}>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <FormEditorExtend
            field='email_template_html'
            disabled={disabled}
            height={500}
            validation={{
              required: 'Nội dung mẫu mail là bắt buộc',
            }}
          />
        </div>
        <div className='bw_col_12'>
          <DataTable data={methods.watch('email_template_params')} noSelect noPaging columns={columns} />
        </div>
      </div>
    </BWAccordion>
  );
};

export default EmailContent;
