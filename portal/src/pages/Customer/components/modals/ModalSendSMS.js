import React, { Fragment, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import ModalPortal from 'components/shared/ModalPortal/ModalPortal';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { useState } from 'react';
import { useEffect } from 'react';
import { createSMSCustomer, getBrandnameOptions, getSmsTemplateOptions } from 'services/task.service';
import { mapDataOptions4Select, showToast } from 'utils/helpers';
import { SMS_TEMPLATE_FIELDS } from 'pages/Customer/utils/constants';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { compliedTemplate } from 'pages/Customer/utils/utils';
import NotifyService from 'services/notify.service';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import dayjs from 'dayjs';

const TYPE_SEND = {
  NORMAL: 1,
  ADVERTISING: 2,
};

const TYPE_SEND_OPTIONS = [
  { label: 'Tin thường', value: TYPE_SEND.NORMAL },
  { label: 'Tin quảng cáo', value: TYPE_SEND.ADVERTISING },
];

const ADV_TEMPLATE_OPTIONS = [
  {
    label: 'Nhập nội dung',
    value: -1,
  },
  {
    label:
      'Apple ra mat iPhone moi. Tham gia minigame trung voucher toi 500k tu 13/9/23 - du kien 21/9/23 tại ShopDunk ngay. Chi tiet: https://shopdunk.com/iphone14beta. LH 19006626',
    value: 1,
  },
  {
    label:
      'HOT - Chi con 5 tieng nua chinh thuc mo dat coc iPhone moi. Dung bo lo co hoi dat coc som nhat de nhan uu dai hap dan tai ShopDunk. Dat tai: https://shopdunk.com/iphone14beta',
    value: 2,
  },
];

const defaultForm = { brandname: 'SHOPDUNK', type_send: TYPE_SEND.NORMAL };

function ModalSendSMS({ onClose, selectedCustomer }) {
  const methods = useForm();

  const [smsState, setSmsState] = useState('');
  const [brandnameOptions, setBrandnameOptions] = useState([]);
  const [smsTemplateOptions, setSmsTemplateOptions] = useState([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    getBrandnameOptions().then((res) => {
      setBrandnameOptions(mapDataOptions4Select(res));
      if (res && res.findIndex((x) => x.name === 'SHOPDUNK') !== -1) {
        methods.reset(defaultForm);
      }
    });
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

  const renderSMS = () => {
    return arrayRegex.map((o, i) => (
      <div className='bw_row' key={i}>
        <FormItem label='Loại' className='bw_col_4' style='gray'>
          <FormSelect
            field={`message_type_${o?.index}`}
            list={[
              { label: 'Nhập nội dung', value: 1 },
              { label: 'Theo dữ liệu', value: 2 },
            ]}
            defaultValue={1}
          />
        </FormItem>
        <FormItem className='bw_col_8' label={'Nội dung ' + (i + 1)} style='gray' key={i}>
          {methods.watch(`message_type_${o?.index}`) === 2 ? (
            <FormSelect
              field={`message_${o?.index}`}
              list={SMS_TEMPLATE_FIELDS}
              validation={{
                required: 'Nội dung là bắt buộc',
              }}
            />
          ) : (
            <FormInput field={`message_${o?.index}`} />
          )}
        </FormItem>
      </div>
    ));
  };

  const messageContentRender = () => {
    return smsState.replace(regexp, (value, __, ___, index) => {
      let content = methods.watch(`message_${index}`);
      if (content === '') {
        content = undefined;
      }
      return content ?? value;
    });
  };
  const messageContent = messageContentRender();

  const onSubmit = async (payload) => {
    setLoadingSubmit(true);
    if (!selectedCustomer?.length) return;

    if (payload.type_send === TYPE_SEND.NORMAL) {
      let errorCount = 0;
      for (let i = 0; i < selectedCustomer.length; i++) {
        try {
          const { data_leads_id, member_id, phone_number, customer_code, data_leads_code } = selectedCustomer[i];
          if ((!member_id && !data_leads_id) || !phone_number) continue;

          let _messageContent = messageContent;
          if (messageContent.includes('<%= INTERESTID %>')) {
            _messageContent = messageContent.replace(
              '<%= INTERESTID %>',
              btoa(`SMS_${customer_code || data_leads_code}`),
            );
          }
          await createSMSCustomer({
            member_id,
            data_leads_id,
            phone_number,
            task_detail_id: -1,
            brandname: payload.brandname || 'SHOPDUNK',
            content_sms: compliedTemplate(_messageContent, selectedCustomer[i]),
          });
        } catch (error) {
          errorCount++;
        }
      }
      showToast.success(
        `Gửi thành công: ${selectedCustomer.length - errorCount}/${selectedCustomer.length} khách hàng`,
      );
    } else {
      const advContent = ADV_TEMPLATE_OPTIONS.find((x) => x.value === payload.adv_template)?.label;
      if (advContent && selectedCustomer?.length >= 30) {
        try {
          await NotifyService.sendAdv({
            phones: selectedCustomer.map((x) => x.phone_number),
            content: payload.adv_template !== -1 ? advContent : payload.content,
            send_date: dayjs(payload.send_date, 'HH:mm DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss'),
          });
        } catch (error) {
          showToast.error(error.message);
        }
      }
      if (!selectedCustomer || selectedCustomer?.length < 30) {
        showToast.error('Số lượng khách hàng gửi tin quảng cáo phải lớn hơn 30');
      }
    }

    setLoadingSubmit(false);
    onClose();
    document?.getElementById('data-table-select')?.click();
  };

  return (
    <ModalPortal title='Gửi SMS' onClose={onClose} onConfirm={methods.handleSubmit(onSubmit)} loading={loadingSubmit}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {methods.watch('type_send') === 1 && (
            <Fragment>
              <FormItem className='bw_col_12' label='Brandname' style='gray'>
                <FormSelect
                  list={brandnameOptions}
                  field='brandname'
                  validation={{ required: 'Brandname là bắt buộc' }}
                />
              </FormItem>
              <FormItem className='bw_col_12' label='Nội dung mẫu' disabled={!brandname} style='gray'>
                <FormSelect
                  list={smsTemplateOptions}
                  field='sms_template_id'
                  validation={{ required: 'Nội dung mẫu là bắt buộc' }}
                  onChange={(value) => {
                    methods.clearErrors('sms_template_id');
                    methods.setValue('sms_template_id', value);
                    const cotentTemplate = smsTemplateOptions.find((e) => e.value === value).label;
                    methods.setValue('content_sms', cotentTemplate);
                    setSmsState(cotentTemplate);
                  }}
                />
              </FormItem>
              {renderSMS()}
              <FormItem disabled className='bw_col_12' label='Nội dung tin nhắn' style='gray'>
                <span id='content_sms_brand' value={messageContent}>
                  {messageContent}
                </span>
              </FormItem>
            </Fragment>
          )}
          {methods.watch('type_send') === 2 && (
            <Fragment>
              <FormItem className='bw_col_12' label='Chọn mẫu gửi' style='gray' isRequired>
                <FormSelect
                  list={ADV_TEMPLATE_OPTIONS}
                  field='adv_template'
                  validation={{ required: 'Nội dung là bắt buộc' }}
                />
              </FormItem>
              {methods.watch('adv_template') === -1 && (
                <FormItem label='Nội dung tin quảng cáo' style='gray' isRequired>
                  <FormTextArea
                    field='content'
                    placeholder='Nhập nội dung tin quảng cáo'
                    validation={{ required: 'Nội dung là bắt buộc' }}
                  />
                </FormItem>
              )}
              <FormItem label='Lịch gửi' style='gray'>
                <FormDatePicker
                  field='send_date'
                  bordered={false}
                  style={{ width: '100%' }}
                  placeholder={'HH:mm DD/MM/YYYY'}
                  format={'HH:mm DD/MM/YYYY'}
                  showTime={true}
                  allowClear={true}
                />
              </FormItem>
            </Fragment>
          )}
        </form>
      </FormProvider>
    </ModalPortal>
  );
}

export default ModalSendSMS;
