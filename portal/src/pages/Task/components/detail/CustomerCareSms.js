import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { getBrandnameOptions, getSmsTemplateOptions } from 'services/task.service';
import { mapDataOptions4Select } from 'utils/helpers';

import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import { TABS } from './CustomerCare';

function CustomerCareSms({ currTab }) {
  const methods = useFormContext();
  const [smsState, setSmsState] = useState('');
  const [brandnameOptions, setBrandnameOptions] = useState([]);
  const [smsTemplateOptions, setSmsTemplateOptions] = useState([]);

  useEffect(() => {
    getBrandnameOptions().then((res) => {
      setBrandnameOptions(mapDataOptions4Select(res));
    });
    return () => {
      methods.unregister('brandname');
      methods.unregister('sms_template_id');
      methods.unregister('content_sms');
    }
  }, []);


  const brandname = methods.watch('brandname');
  useEffect(() => {
    if (brandname) {
      getSmsTemplateOptions({ brandname }).then((res) => {
        setSmsTemplateOptions(mapDataOptions4Select(res));
      });
    }
  }, [brandname]);

  const regexp = /\{(.+?)\,(\d*)\}/g;
  const arrayRegex = useMemo(() => [...smsState.matchAll(regexp)], [smsState]);

  const render_sms = useMemo(() => {
    return arrayRegex.map((o, i) =>
      <FormItem
        className='bw_col_12'
        label={'Nội dung ' + (i + 1)}
      >
        <input
          {...methods.register(`message_${o?.index}`)}
        ></input>
      </FormItem>
    )
  }, [arrayRegex])

  const messageContentRender = () => {
    return smsState.replace(regexp, (value, __, ___, index) => {
      let content = methods.watch(`message_${index}`);
      if (content === '') {
        content = undefined;
      }
      return content ?? value;
    })
  }

  return (
    <div className='bw_tab_items bw_active'>
      <FormItem className='bw_col_12' label='Brandname'>
        <FormSelect list={brandnameOptions} field='brandname' validation={{ required: 'Brandname là bắt buộc' }} />
      </FormItem>

      <FormItem className='bw_col_12' label='Nội dung mẫu' disabled={!brandname}>
        <FormSelect
          list={smsTemplateOptions}
          field='sms_template_id'
          validation={{ required: 'Nội dung mẫu là bắt buộc' }}
          onChange={(value) => {
            methods.clearErrors('sms_template_id');
            methods.setValue('sms_template_id', value);
            const cotentTemplate = smsTemplateOptions.find((e) => e.value === value).label
            methods.setValue('content_sms', cotentTemplate);
            setSmsState(cotentTemplate)
          }}
        />
      </FormItem>
      {render_sms}
      <FormItem
        disabled
        className='bw_col_12' label='Nội dung tin nhắn'>
        <span id="content_sms_brand" value={messageContentRender()}>
          {messageContentRender()}
        </span>
        {/* <FormTextArea
          rows={3}
          field='content_sms'
          placeholder='Nội dung'
          validation={
            isValidate ?? {
              required: 'Nội dung không được trống',
            }
          }
        /> */}
      </FormItem>
    </div>
  );
}

export default CustomerCareSms;
