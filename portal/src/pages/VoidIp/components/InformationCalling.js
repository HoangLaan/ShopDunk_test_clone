import React, { useState, useEffect, useCallback } from 'react';
import i_user_call from 'assets/bw_image/i_user_call.png';
import { getFullName } from 'services/global.service';
import HistoryCall from './HistoryCall';
import HistoryOrders from './HistoryOrders';
import HistoryNote from './HistoryNote';
import styled from 'styled-components';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getTaskWithVoip } from 'services/voip.services';
import { changeWorkFlow, createTask } from 'services/task.service';
import { showConfirmModal } from 'actions/global';
import { showToast } from 'utils/helpers';
import TaskForVoidIp from './TaskForVoidIp';
import TaskAssignForVoip from './TaskAssignForVoip';
import { FormProvider, useForm } from 'react-hook-form';
import CustomerForm from './CustomerForm';
import { Skeleton } from 'antd';
import Comments from 'pages/Task/components/detail/Comments';
import HistoryVoipExt from './HistoryVoipExt';

const INFORMATION_CALLING = {
  HISTORY_CALL: 1,
  HISTORY_ORDER: 2,
  HISTORY_NOTE: 3,
  HISTORY_CUSTOMER_CARE: 4,
  HISTORY_VOIP_EXT: 5,
};

const TypeCustomer = styled.div`
  margin-left: 10px;
  background-color: ${(p) => p?.color ?? ''};
  color: ${(p) => (p?.noteColor ? p?.noteColor : 'black')};
  &:hover {
    background: ${(p) => p?.color ?? ''};
  }
`;

const TAB_CREATE_TASK = {
  TASK_BUTTON: 1,
  TASK_INFORMATION: 2,
  TASK_ASSIGN: 3,
};

const TAB_CREATE_USER = {
  TAB_BUTTON: 1,
  TAB_CREATE: 2,
};

const InformationCalling = () => {
  const methods = useForm();
  const dispatch = useDispatch();
  const { phone_number } = useSelector((state) => state.voidIp);
  const [tabActive, setTabActive] = useState(INFORMATION_CALLING.HISTORY_CALL);
  const [dataUser, setDataUser] = useState(undefined);
  const [dataTask, setDataTask] = useState(undefined);
  const [tabTaskActive, setTabTaskActive] = useState(TAB_CREATE_TASK.TASK_BUTTON);
  const [tabCreateUser, setTabCreateUser] = useState(TAB_CREATE_USER.TAB_BUTTON);

  const [loadingFullName, setLoadingFullName] = useState(undefined);
  const [loadingLeftBar, setLoadingLeftBar] = useState(undefined);

  const loadFullName = useCallback(() => {
    setLoadingFullName(true);
    const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
    if (phone_number && phone_number.match(regexPhoneNumber)) {
      setLoadingLeftBar(true);
      getFullName({
        type: 2,
        value_query: phone_number,
      })
        .then((o) => {
          setDataUser(o);
          document.getElementById('bw_calling__nameNumber').innerHTML = o?.full_name || phone_number;
          document.getElementById('bw_reCalling__number').innerHTML = o?.full_name || phone_number;
        })
        .finally(() => {
          setLoadingFullName(false);
        });
    } else {
      setLoadingLeftBar(false);
    }
  }, [phone_number]);

  useEffect(loadFullName, [phone_number]);

  const loadTaskWithVoip = useCallback(() => {
    if (dataUser?.member_id || dataUser?.data_leads_id) {
      getTaskWithVoip({
        data_leads_id: dataUser?.data_leads_id,
        member_id: dataUser?.member_id,
      }).then(setDataTask);
    }
  }, [dataUser]);

  useEffect(loadTaskWithVoip, [loadTaskWithVoip]);

  const onSubmit = async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;

      payload.supervisor_user = String(payload.supervisor_user?.value);

      payload.staff_user = String(payload.staff_user?.value);
      payload.member_list = [
        {
          member_id: dataUser?.member_id,
          data_leads_id: dataUser?.data_leads_id,
        },
      ];

      createTask(payload).then(async () => {
        await loadTaskWithVoip();
      });
    } catch (error) {
    } finally {
    }
  };

  const jsx_task_render = () => {
    if (tabTaskActive === TAB_CREATE_TASK.TASK_BUTTON) {
      return (
        <Button
          size='small'
          type='primary'
          onClick={() => {
            setTabTaskActive(TAB_CREATE_TASK.TASK_INFORMATION);
          }}>
          Tạo công việc cho khách hàng này
        </Button>
      );
    } else if (tabTaskActive === TAB_CREATE_TASK.TASK_INFORMATION) {
      return (
        <TaskForVoidIp
          onCancel={() => setTabTaskActive(TAB_CREATE_TASK.TASK_BUTTON)}
          onNextAssign={() => setTabTaskActive(TAB_CREATE_TASK.TASK_ASSIGN)}
        />
      );
    } else if (tabTaskActive === TAB_CREATE_TASK.TASK_ASSIGN) {
      return (
        <TaskAssignForVoip
          onReturn={() => {
            setTabTaskActive(TAB_CREATE_TASK.TASK_INFORMATION);
          }}
          onSubmitForm={methods.handleSubmit(onSubmit)}
        />
      );
    }
  };

  const jsx_task_detail_render = () => {
    if (dataUser) {
      if (dataTask) {
        return (
          <>
            <b>Chăm sóc hiện tại</b>
            <hr />
            <Space wrap>
              {dataTask?.work_flow_list?.map((o) => (
                <Button
                  onClick={() => {
                    if (dataTask?.task_wflow_id !== o?.task_work_flow_id) {
                      dispatch(
                        showConfirmModal(
                          ['Xác nhận chuyển bước', 'Bạn thực sự muốn chuyển bước'],
                          () => {
                            changeWorkFlow({
                              task_detail_id: dataTask.task_detail_id,
                              task_workflow_old_id: dataTask?.task_wflow_id,
                              task_workflow_id: o?.task_work_flow_id,
                            })
                              .then(() => {
                                setDataTask((prev) => ({
                                  ...prev,
                                  task_wflow_id: o?.task_work_flow_id,
                                }));
                              })
                              .catch((error) => showToast.error(error.message));
                          },
                          'Đồng ý',
                          'Huỷ',
                        ),
                      );
                    }
                  }}
                  type={dataTask?.task_wflow_id === o?.task_work_flow_id ? 'primary' : 'dashed'}>
                  {o?.work_flow_name}
                </Button>
              ))}
            </Space>
          </>
        );
      } else {
        return jsx_task_render();
      }
    }
  };

  const createOrder = () => {
    const jsonString = JSON.stringify(dataUser);
    localStorage.setItem('dataUser', jsonString);
  };

  return (
    loadingLeftBar && (
      <FormProvider {...methods}>
        (
        <div className='bw_inf_cus'>
          <span id='bw_show_d' className='fi fi-rr-angle-small-right'></span>
          <h3>Khách hàng</h3>
          <div className='bw_inf_customer bw_flex bw_algin_items_left bw_justify_content_center'>
            {!loadingFullName ? (
              <>
                {dataUser ? (
                  <>
                    <img src={i_user_call} className='bw_imgUser' />
                    <div className='bw_in'>
                      <span
                        style={{
                          borderRadius: '30px',
                        }}
                        className='bw_flex'>
                        <h4>{dataUser?.full_name ?? 'Chưa xác định'}</h4>
                        <Button
                          target='_blank'
                          type='primary'
                          href={`customer/detail/${dataUser?.member_id}`}
                          icon={<EyeOutlined />}
                          size='small'></Button>
                      </span>
                      <>
                        <p>Giới tính : Nam</p>
                        <p>
                          <i className='fi-rr fi-rr-map-marker'></i> {dataUser?.adress_full}
                        </p>
                      </>
                    </div>
                  </>
                ) : (
                  <div className='bw_notUser'>
                    {tabCreateUser === TAB_CREATE_USER.TAB_BUTTON ? (
                      <>
                        <p>Người dùng không phải là khách hàng</p>
                        <a
                          onClick={() => setTabCreateUser(TAB_CREATE_USER.TAB_CREATE)}
                          className='bw_btn bw_btn_primary'>
                          Tạo người dùng ngay
                        </a>
                      </>
                    ) : (
                      <CustomerForm
                        phone_number={phone_number}
                        onRefresh={loadFullName}
                        onClose={() => setTabCreateUser(TAB_CREATE_USER.TAB_BUTTON)}
                      />
                    )}
                  </div>
                )}
                <TypeCustomer
                  color={dataUser?.ctype_color}
                  className={dataUser?.ctype_color ? 'bw_label' : ''}
                  noteColor={dataUser?.ctype_notecolor}>
                  {dataUser && <span>Hạng khách hàng : </span>}
                  {dataUser?.customer_type_name}
                </TypeCustomer>
              </>
            ) : (
              <Skeleton
                avatar
                paragraph={{
                  rows: 3,
                }}
              />
            )}
            <div
              id='call_container'
              style={{
                width: '100%',
                marginTop: '13px',
                maxWidth: '100%',
                overflowX: 'auto',
                overflowY: 'hidden',
                height: 'fix-content',
                paddingBottom: '10px',
              }}>
              {jsx_task_detail_render()}

              <hr />
              <Space wrap>
                <Button
                  size='small'
                  type='dashed'
                  onClick={(e) => {
                    window.open('/prices', '_blank', 'rel=noopener noreferrer');
                  }}>
                  Kiểm tra giá sản phẩm
                </Button>
                <Button
                  size='small'
                  type='dashed'
                  onClick={(e) => {
                    window.open('/stocks-detail', '_blank', 'rel=noopener noreferrer');
                  }}>
                  Kiểm tra tồn kho
                </Button>
              </Space>
            </div>
          </div>
          <h3 className='bw_mt_2 bw_tabs_title'>
            <span
              style={{
                fontSize: '16px',
              }}
              data-href='#bw_history_call'
              onClick={() => setTabActive(INFORMATION_CALLING.HISTORY_CALL)}
              className={tabActive === INFORMATION_CALLING.HISTORY_CALL ? 'bw_active' : ''}>
              Lịch sử cuộc gọi
            </span>
            {dataUser && (
              <span
                style={{
                  fontSize: '16px',
                }}
                data-href='#bw_order_call'
                onClick={() => setTabActive(INFORMATION_CALLING.HISTORY_ORDER)}
                className={tabActive === INFORMATION_CALLING.HISTORY_ORDER ? 'bw_active' : ''}>
                Đơn hàng
              </span>
            )}
            <span
              style={{
                fontSize: '16px',
              }}
              data-href='#bw_history_note'
              onClick={() => setTabActive(INFORMATION_CALLING.HISTORY_NOTE)}
              className={tabActive === INFORMATION_CALLING.HISTORY_NOTE ? 'bw_active' : ''}>
              Ghi chú
            </span>
            <span
              style={{
                fontSize: '16px',
              }}
              data-href='#bw_productcare'
              onClick={() => setTabActive(INFORMATION_CALLING.HISTORY_CUSTOMER_CARE)}
              className={tabActive === INFORMATION_CALLING.HISTORY_CUSTOMER_CARE ? 'bw_active' : ''}>
              Quan tâm
            </span>
            <span
              style={{
                fontSize: '16px',
              }}
              data-href='#bw_voip_ext'
              onClick={() => setTabActive(INFORMATION_CALLING.HISTORY_VOIP_EXT)}
              className={tabActive === INFORMATION_CALLING.HISTORY_VOIP_EXT ? 'bw_active' : ''}>
              Máy nhánh
            </span>
          </h3>
          {tabActive === INFORMATION_CALLING.HISTORY_CALL && (
            <div className='bw_main_history bw_show' id='bw_history_call'>
              {phone_number && <HistoryCall phone_number={phone_number} />}
            </div>
          )}
          {tabActive === INFORMATION_CALLING.HISTORY_ORDER && dataUser && (
            <div className='bw_main_history bw_show' id='bw_order_call'>
              <div className='bw_add_note bw_text_center'>
                <a target='_blank' href='/orders/add' onClick={() => createOrder()} className='bw_btn bw_btn_primary'>
                  Tạo đơn hàng
                </a>
              </div>
              {dataUser && <HistoryOrders member_id={dataUser?.member_id} />}
            </div>
          )}
          {tabActive === INFORMATION_CALLING.HISTORY_NOTE && (
            <div className='bw_main_history bw_show' id='bw_history_call'>
              {phone_number && <HistoryNote phone_number={phone_number} />}
            </div>
          )}
          {tabActive === INFORMATION_CALLING.HISTORY_CUSTOMER_CARE && (
            <div className='bw_main_history bw_show' id='bw_history_call'>
              <Comments
                setLoading={() => {}}
                taskDetailId={dataTask?.task_detail_id}
                memberId={dataTask?.member_id}
                dataLeadsId={dataTask?.data_leads_id}
                currWFlow={dataTask?.task_wflow_id}
              />
            </div>
          )}
          {tabActive === INFORMATION_CALLING.HISTORY_VOIP_EXT && (
            <div className='bw_main_history bw_show' id='bw_history_call'>
              <HistoryVoipExt />
            </div>
          )}
        </div>
        )
      </FormProvider>
    )
  );
};

export default InformationCalling;
