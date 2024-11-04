import React, { useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';

import FormItem from '../BWFormControl/FormItem';
import ZaloOAService from 'services/zalo-oa.service.';
import { mapDataOptions } from 'utils/helpers';
import FormSelect from '../BWFormControl/FormSelect';

function FormZaloZNS({ methods }) {
  const [znsTemplateOptions, setZnsTemplateOptions] = useState([]);
  const detailZNS = methods.watch('detail_zns');

  useEffect(() => {
    ZaloOAService.getListTemplate().then((res) => {
      const _options = mapDataOptions(res, { valueName: 'templateId', labelName: 'templateName', valueAsString: true });
      setZnsTemplateOptions(_options);
    });
    methods.reset({});
  }, []);

  return (
    <FormProvider {...methods}>
      <form>
        <FormItem label='Mẫu gửi' style='gray' isRequired={true}>
          <FormSelect
            field='zalo_zns_template'
            list={znsTemplateOptions}
            onChange={(value) => {
              methods.clearErrors('zalo_zns_template');
              methods.setValue('zalo_zns_template', value);
              ZaloOAService.getTemplateById({ template_id: value }).then((res) => {
                methods.setValue('detail_zns', res);
              });
            }}
            validation={{ required: 'Mẫu gửi là bắt buộc' }}
          />
        </FormItem>
        {detailZNS?.previewUrl && (
          <FormItem label='Bản xem trước của template' style='gray'>
            <a href={detailZNS?.previewUrl} target='_blank' rel='noreferrer'>
              {detailZNS?.previewUrl}
            </a>
          </FormItem>
        )}
      </form>
    </FormProvider>
  );
}

export default FormZaloZNS;
