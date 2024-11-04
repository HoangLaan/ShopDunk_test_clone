import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import {
  getCareHistoryList,
  createAppointmentCustomer,
  createCallCustomer,
  createSMSCustomer,
} from 'services/task.service';

import { sentOneMail } from 'services/email-marketing.service';

import CustomerCareSms from './CustomerCareSms';
import CustomerCareEmail from './CustomerCareEmail';
import CustomerCareCall from './CustomerCareCall';
import CustomerCareAppointment from './CustomerCareAppointment';
import CustomerCareList from './CustomerCareList';
import BWAccordion from 'components/shared/BWAccordion/index';
import { defaultPaging, showToast } from 'utils/helpers';
import { useTaskContext } from 'pages/Task/utils/context';
import CustomerCareZalo from './CustomerCareZalo';
import ZaloOAService from 'services/zalo-oa.service.';
import { ZALO_TYPE_SEND } from 'components/shared/FormZalo/FormZalo';

export const TABS = {
  SMS: { name: 'SMS', value: 0 },
  CALL: { name: 'Call', value: 1 },
  APPOINTMENT: { name: 'Lịch hẹn', value: 2 },
  EMAIL: { name: 'Email', value: 3 },
  ZALO: { name: 'Zalo', value: 4 },
};

function CustomerCare({
  setLoading,
  taskDetailId,
  taskId,
  memberId,
  dataLeadsId,
  currWFlow,
  phoneNumber,
  customerEmail,
  customerInformation,
}) {
  const { setTaskState } = useTaskContext();
  const [currTab, setCurrTab] = useState(0);
  const [currHistoryTab, setCurrHistoryTab] = useState(0);
  const methods = useForm({});

  const [params, setParams] = useState({
    page: 1,
    itemsPerPage: 7,
  });
  const [dataList, setDataList] = useState(defaultPaging);

  const { items, page, totalPages } = dataList;


  const onSubmitZalo = async (payload) => {
    try {
      const zalo_type_send = methods.watch('zalo_type_send');
      const detailZNS = methods.watch('detail_zns');

      if (zalo_type_send === ZALO_TYPE_SEND.SEND_SMS && !customerInformation.zalo_id) {
        showToast.warning('Khách hàng chưa cập nhật Zalo ID');
        return;
      }
      if (zalo_type_send === ZALO_TYPE_SEND.SEND_SMS && customerInformation.zalo_id) {
        await ZaloOAService.sendTextMessage({
          text_message: payload.zalo_sms_content,
          user_id: customerInformation.zalo_id,
        });
        methods.reset({})
        return;
      }
      if (zalo_type_send === ZALO_TYPE_SEND.SEND_ZNS && !customerInformation?.phone_number && payload?.phone_number) {
        showToast.warning('Chưa có số điện thoại để gửi ZNS');
        return;
      }
      if (zalo_type_send === ZALO_TYPE_SEND.SEND_ZNS) {
        await ZaloOAService.sendZNS({
          phone: customerInformation?.phone_number || payload?.phone_number,
          template_id: String(detailZNS.templateId),
          template_data: payload,
        });
        methods.reset({})
        return;
      }
    } catch (error) {
      showToast.error(error.message);
    }
  };
  const onSubmit = async (payload) => {
    console.log('~  payload >>>', payload)
    // onSubmit Zalo tab
    if (currTab === TABS.ZALO.value) {
      onSubmitZalo(payload);
      return;
    }

    // onSubmit another tab
    try {
      setLoading(true);

      const funcCustomer = {
        sms: createSMSCustomer,
        call: createCallCustomer,
        appointment: createAppointmentCustomer,
        email: sentOneMail,
      };

      payload = {
        ...payload,
        task_detail_id: taskDetailId,
        data_leads_id: dataLeadsId,
        member_id: memberId,
      };


      const typeTakeCareOfCustomer =
        currTab === TABS.SMS.value
          ? 'sms'
          : currTab === TABS.CALL.value
            ? 'call'
            : currTab === TABS.APPOINTMENT.value
              ? 'appointment'
              : 'email';

      if (typeTakeCareOfCustomer !== 'sms' && typeTakeCareOfCustomer !== 'email') {
        payload.username = payload.username?.name;
        let duration;
        if (payload?.date && payload?.time_from && payload?.time_to) {
          const date = payload.date.split('/').reverse().join('-');
          payload = {
            ...payload,
            datetime_from: `${date} ${payload.time_from}:00`,
            datetime_to: `${date} ${payload.time_to}:00`,
          };

          const [hoursFrom, minutesFrom] = payload.time_from.split(':');
          const [hoursTo, minutesTo] = payload.time_to.split(':');
          duration = parseInt(hoursTo) * 60 + parseInt(minutesTo) - (parseInt(hoursFrom) * 60 + parseInt(minutesFrom));
          if (duration <= 0) {
            return showToast.error('Thời gian đến phải > Thời gian từ');
          }

        }
        payload = {
          ...payload,
          duration,
        };
      } else {
        payload.content_sms = document.getElementById('content_sms_brand')?.innerText;
        payload.phone_number = phoneNumber;
      }

      await funcCustomer[typeTakeCareOfCustomer](payload);

      methods.reset({});

      showToast.success('Thêm mới thành công');
    } catch (error) {
      console.log('~  error >>>', error)
      showToast.error(error?.message ?? 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const loadData = useCallback(() => {
    if (taskDetailId) {
      setLoading(true);
      params.task_detail_id = taskDetailId;
      params.tab = currHistoryTab;
      getCareHistoryList(params)
        .then(setDataList)
        .catch((error) => {
          showToast.error(error?.message ?? 'Có lỗi xảy ra');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [taskDetailId, currHistoryTab, params, setLoading]);

  useEffect(() => {
    loadData();
    setTaskState((prev) => ({ ...prev, refreshCustomerCare: loadData }));
  }, [loadData]);

  // console.log('Task detail customer care', methods.watch())
  // console.log('Task detail customer care ... errors', methods.formState.errors)

  return (
    <React.Fragment>
      <BWAccordion
        title='Chăm sóc khách hàng'
        componentCustom={
          <CustomerCareList
            items={items}
            page={page}
            totalPages={totalPages}
            setParams={setParams}
            currHistoryTab={currHistoryTab}
            setCurrHistoryTab={setCurrHistoryTab}
          />
        }>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className='bw_frm_box'>
              <ul className='bw_tabs'>
                {Object.values(TABS).map((item, index) => (
                  <li className={currTab === item.value ? 'bw_active' : ''} key={index}>
                    <a
                      href='/'
                      className='bw_link'
                      onClick={(e) => {
                        setCurrTab(item.value);
                        e.preventDefault();
                      }}>
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>

              {currTab === TABS.SMS.value && <CustomerCareSms currTab={currTab} />}

              {currTab === TABS.CALL.value && (
                <CustomerCareCall phoneNumber={phoneNumber} methods={methods} currTab={currTab} />
              )}

              {currTab === TABS.APPOINTMENT.value && <CustomerCareAppointment methods={methods} currTab={currTab} />}
              {currTab === TABS.ZALO.value && (
                <CustomerCareZalo customer={customerInformation} methods={methods} currTab={currTab} />
              )}

              {currTab === TABS.EMAIL.value && (
                <CustomerCareEmail
                  customerEmail={customerEmail}
                  taskDetailId={taskDetailId}
                  memberId={memberId}
                  dataLeadsId={dataLeadsId}
                  methods={methods}
                  currTab={currTab}
                />
              )}
            </div>

            {!(currTab === TABS.CALL.value) && (
              <div className='bw_mt_1'>
                <button className='bw_btn bw_btn_success' type='submit'>
                  Gửi
                </button>
                <button
                  className='bw_btn_outline'
                  style={{ marginLeft: '5px' }}
                  onClick={(e) => {
                    e.preventDefault();
                    methods.reset();
                  }}>
                  Làm lại
                </button>
              </div>
            )}
          </form>
        </FormProvider>
      </BWAccordion>
    </React.Fragment>
  );
}

export default CustomerCare;
