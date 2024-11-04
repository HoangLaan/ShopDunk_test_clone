import React, { useState, useEffect, useCallback } from 'react';
import i_user_call from 'assets/bw_image/i_user_call.png';
import { getFullName } from 'services/global.service';
import HistoryCall from './HistoryCall';
import HistoryOrders from './HistoryOrders';
import HistoryNote from './HistoryNote';
import styled from 'styled-components';
import { EyeOutlined, EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getTaskWithVoip } from 'services/voip.services';
import customerLeadService from 'services/customer-lead.service';
import { updateFullName } from 'services/customer.service';
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
import CreateCustomerForm from './CreateCustomerForm';
import HistoryWorkFlow from './HistoryWorkFlow';
import CheckAccess from 'navigation/CheckAccess';
import HistoryComments from './HistoryComment';
import { form_work_flow } from '../utils/helpers';

const INFORMATION_CALLING = {
  HISTORY_WORKFLOW: 1,
  HISTORY_CALL: 2,
  HISTORY_ORDER: 3,
  HISTORY_NOTE: 4,
  HISTORY_CUSTOMER_CARE: 5,
  HISTORY_VOIP_EXT: 6,
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

const TabInforCalling = ({setImageUrl}) => {
  const methods = useForm({});
  const dispatch = useDispatch();
  const { phone_number } = useSelector((state) => state.voidIp);
  const [tabActive, setTabActive] = useState(INFORMATION_CALLING.HISTORY_WORKFLOW);
  const [dataUser, setDataUser] = useState(undefined);
  const [dataTask, setDataTask] = useState(undefined);
  const [tabTaskActive, setTabTaskActive] = useState(TAB_CREATE_TASK.TASK_BUTTON);
  const [tabCreateUser, setTabCreateUser] = useState(TAB_CREATE_USER.TAB_BUTTON);
  const [isEdit, setIsEdit] = useState(false);

  const [loadingFullName, setLoadingFullName] = useState(undefined);
  const [loadingLeftBar, setLoadingLeftBar] = useState(undefined);
  const [fetchCustomer, setFetchCustomer] = useState(false);
  const [formWorkFlow, setFormWorkFlow] = useState();

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
          methods.reset({...o});
          o?.image_avatar ? setImageUrl(o?.image_avatar) : setImageUrl(null);
          document.getElementById('bw_calling__nameNumber').innerHTML = o?.full_name || '';
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
    } else {
      setDataTask(undefined)
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

  const jsx_button_check = () => {
    return (
      <>
        <button
          className='btn_check_price'
          onClick={(e) => {
            window.open('/prices', '_blank', 'rel=noopener noreferrer');
          }}>
          Kiểm tra giá
        </button>
        <button
          className='btn_check_stock'
          onClick={(e) => {
            window.open('/stocks-detail', '_blank', 'rel=noopener noreferrer');
          }}>
          Kiểm tra tồn kho
        </button>
      </>
    )
  }

  useEffect(() => {
    if(tabActive !== 1 && formWorkFlow){
      localStorage.setItem(form_work_flow, JSON.stringify(formWorkFlow));
    }
  }, [tabActive, formWorkFlow])

  const jsx_task_detail_render = () => {
    if (true) {
      if (true) {
        return (
          <>
            {dataTask?.work_flow_list.length > 0 && <>
              <b>Chăm sóc hiện tại</b>
              <hr />
              <div className='bw_col bw_col_12'>
                <Space wrap className='bw_col_8'>
                  {dataTask?.work_flow_list?.map((o) => (
                    <button
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
                      className={dataTask?.task_wflow_id === o?.task_work_flow_id ? 'btn_workflow_calling_active' : 'btn_workflow_calling'}
                    // className='btn_workflow_calling '
                    // style={dataTask?.task_wflow_id === o?.task_work_flow_id && {}}
                    >
                      {/* type={dataTask?.task_wflow_id === o?.task_work_flow_id ? 'primary' : 'dashed'}> */}
                      {o?.work_flow_name}
                    </button>
                    // </Button>
                  ))}
                </Space>
                <Space wrap className='bw_col_4'>
                  {jsx_button_check()}
                </Space>
              </div>
            </>}
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

  const handleSubmitForm = (payload) => {
    setIsEdit(false);
    const data = { 
      customer_name: payload.full_name,
    };

    if(payload.data_leads_id && payload.member_id){
      updateFullName(payload.member_id, data)
      .then(() => {
        showToast.success('Cập nhật thành công');
        customerLeadService.updateFullName(payload.data_leads_id, data)
        loadFullName();
      })
      .catch((err) => showToast.error(err.message));
    }else if(payload.data_leads_id){
      customerLeadService.updateFullName(payload.data_leads_id, data)
      .then(() => {
        showToast.success('Cập nhật thành công');
        loadFullName()
      })
      .catch((err) => showToast.error(err.message))
    }else if(payload.member_id){
      updateFullName(payload.member_id, data).then(() => {
        showToast.success('Cập nhật thành công')
        loadFullName()
      })
      .catch((err) => showToast.error(err.message))
    }
  }

  return (
    loadingLeftBar && (
      <FormProvider {...methods}>
        (
        <div className='bw_inf_cus'>
          <span id='bw_show_d' className='fi fi-rr-angle-small-right'></span>
          <h3 style={{ fontWeight: 'bold' }}>Khách hàng</h3>
          <div className='bw_inf_customer bw_flex bw_algin_items_left bw_justify_content_center'>
            {!loadingFullName ? (
              <>
                {dataUser && dataUser?.phone_number ? (
                  <>
                    <img src={dataUser?.image_avatar || i_user_call} className='bw_imgUser' />
                    <div className='bw_flex bw_in' >
                      <div style={{ flex: 1 }}>
                        <span
                          style={{
                            borderRadius: '30px',
                          }}
                          className='bw_flex'>
                          {
                            isEdit ?
                              (<form onSubmit={methods.handleSubmit(handleSubmitForm)}>
                                <input type='text' value={methods.watch('full_name') ?? ''} onChange={
                                  (e) => methods.setValue('full_name', e.target.value)
                                } />
                                <>
                                  <Button
                                  onClick={() => setIsEdit(false)}
                                    style={{ marginLeft: '5px' }}
                                    type='primary'
                                    icon={<CloseOutlined />}
                                    size='small'></Button>
                                  <button className='bw_btn_full_name' type='submit'>
                                    Lưu
                                  </button>
                                </>
                              </form>) : (
                                <>
                                  <h4>{dataUser?.full_name ?? 'Chưa xác định'}</h4>
                                  <Button
                                    target='_blank'
                                    type='primary'
                                    href={
                                      dataUser?.member_id ?
                                      `customer/detail/${dataUser?.member_id}`
                                      : `customer-lead/detail/${dataUser?.data_leads_id}`}
                                    icon={<EyeOutlined />}
                                    size='small'></Button>
                                    {!isEdit && <CheckAccess permission={dataUser?.member_id ? 'CRM_CUSTOMERDATALEADS_EDIT' : 'CRM_ACCOUNT_EDIT'}>
                                  <Button
                                    onClick={() => setIsEdit(true)}
                                    style={{ marginLeft: '5px' }}
                                    type='primary'
                                    icon={<EditOutlined />}
                                    size='small'></Button>
                                </CheckAccess>}
                                </>
                              )}
                        </span>
                        <>
                          <p>Giới tính: {dataUser?.gender === 1 ? 'Nam' : 'Nữ'}</p>
                          <p>Email: {dataUser?.email}</p>
                          <p>
                            Địa chỉ: {dataUser?.address_full}
                          </p>
                        </>
                      </div>
                      <div className=''>
                        <p>Hạng khách:<img style={{ width: '40px', height: '33px' }} src={dataUser.icon_url ? dataUser.icon_url : ''} /> {dataUser?.customer_type_name}</p>
                        <p>Tổng điểm: {dataUser?.current_point || 0} điểm thưởng</p>
                      </div>
                    </div>
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
                    </div>
                  </>
                ) : (
                  <>
                    <div className='bw_notUser'>
                      < CreateCustomerForm 
                        phone_number={phone_number} 
                        onRefresh={loadFullName} 
                        setTabActive={setTabActive} 
                        info={INFORMATION_CALLING} 
                        setFetchCustomer={setFetchCustomer}
                      />
                    </div>
                    <div style={{ width: '100%', marginTop: '10px', gap: '5px' }} className='bw_flex bw_justify_content_end'>
                      {jsx_button_check()}
                    </div>
                  </>
                )}
                {/* <TypeCustomer
                  color={dataUser?.ctype_color}
                  className={dataUser?.ctype_color ? 'bw_label' : ''}
                  noteColor={dataUser?.ctype_notecolor}>
                  {dataUser && <span>Hạng khách hàng : </span>}
                  {dataUser?.customer_type_name}
                </TypeCustomer> */}
              </>
            ) : (
              <Skeleton
                avatar
                paragraph={{
                  rows: 3,
                }}
              />
            )}
            {/* <div
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
            </div> */}
          </div>
          <h3 className='bw_mt_2'>
            <span
              data-href='#bw_workflow'
              onClick={() => setTabActive(INFORMATION_CALLING.HISTORY_WORKFLOW)}
              className={tabActive === INFORMATION_CALLING.HISTORY_WORKFLOW ? 'bw_tab_calling_active' : 'bw_tab_calling'}>
              Data Chuyển Shop
            </span>
            <span
              data-href='#bw_order_call'
              onClick={() => setTabActive(INFORMATION_CALLING.HISTORY_ORDER)}
              className={tabActive === INFORMATION_CALLING.HISTORY_ORDER ? 'bw_tab_calling_active' : 'bw_tab_calling'}>
              Đơn hàng
            </span>
            <span
              data-href='#bw_history_note'
              onClick={() => setTabActive(INFORMATION_CALLING.HISTORY_NOTE)}
              className={tabActive === INFORMATION_CALLING.HISTORY_NOTE ? 'bw_tab_calling_active' : 'bw_tab_calling'}>
              Ghi chú
            </span>
            <span
              data-href='#bw_history_call'
              onClick={() => setTabActive(INFORMATION_CALLING.HISTORY_CALL)}
              className={tabActive === INFORMATION_CALLING.HISTORY_CALL ? 'bw_tab_calling_active' : 'bw_tab_calling'}>
              Lịch sử cuộc gọi
            </span>
            <span
              data-href='#bw_productcare'
              onClick={() => setTabActive(INFORMATION_CALLING.HISTORY_CUSTOMER_CARE)}
              className={tabActive === INFORMATION_CALLING.HISTORY_CUSTOMER_CARE ? 'bw_tab_calling_active' : 'bw_tab_calling'}>
              Sản Phẩm Quan Tâm
            </span>
            <span
              data-href='#bw_voip_ext'
              onClick={() => setTabActive(INFORMATION_CALLING.HISTORY_VOIP_EXT)}
              className={tabActive === INFORMATION_CALLING.HISTORY_VOIP_EXT ? 'bw_tab_calling_active' : 'bw_tab_calling'}>
              Máy nhánh
            </span>
          </h3>
          {tabActive === INFORMATION_CALLING.HISTORY_WORKFLOW && (
            <div className='bw_main_history bw_show' id='bw_workflow'>
              {<HistoryWorkFlow 
                dataTask={dataTask} 
                phone_number={phone_number} 
                onRefresh={loadFullName}
                fetchCustomerStatus={fetchCustomer}
                tabActive={tabActive}
                setFormWorkFlow={setFormWorkFlow}
                formWorkFlow={formWorkFlow}
              />}
            </div>
          )}
          {tabActive === INFORMATION_CALLING.HISTORY_CALL && (
            <div className='bw_main_history bw_show' id='bw_history_call'>
              {phone_number && <HistoryCall phone_number={phone_number} />}
            </div>
          )}
          {tabActive === INFORMATION_CALLING.HISTORY_ORDER && dataUser && (
            <div className='bw_main_history bw_show' id='bw_order_call'>
              {dataUser && <HistoryOrders member_id={dataUser?.member_id} data_leads_id={dataUser?.data_leads_id} createOrder={createOrder} />}
            </div>
          )}
          {tabActive === INFORMATION_CALLING.HISTORY_NOTE && (
            <div className='bw_main_history bw_show' id='bw_history_note'>
              {phone_number && <HistoryNote phone_number={phone_number} />}
            </div>
          )}
          {tabActive === INFORMATION_CALLING.HISTORY_CUSTOMER_CARE && (
            <div className='bw_main_history bw_show' id='bw_productcare'>
              <HistoryComments
                setLoading={() => { }}
                taskDetailId={dataTask?.task_detail_id}
                memberId={dataTask?.member_id}
                dataLeadsId={dataTask?.data_leads_id}
                currWFlow={dataTask?.task_wflow_id}
              />
            </div>
          )}
          {tabActive === INFORMATION_CALLING.HISTORY_VOIP_EXT && (
            <div className='bw_main_history bw_show' id='bw_voip_ext'>
              <HistoryVoipExt />
            </div>
          )}
        </div>
        )
      </FormProvider>
    )
  );
};

export default TabInforCalling;
