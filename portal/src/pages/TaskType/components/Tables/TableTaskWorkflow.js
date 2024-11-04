import React, { Fragment, useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFormContext, useFieldArray } from 'react-hook-form';
import classNames from 'classnames';
import { StarTwoTone } from '@ant-design/icons';

import DataTable from 'components/shared/DataTable/index';
import ICON_COMMON from 'utils/icons.common';
import { showConfirmModal } from 'actions/global';

import { PERMISSION, WFLOW_REPEAT_TYPE } from 'pages/TaskType/utils/constants';
import { useTaskTypeContext } from 'pages/TaskType/utils/context';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { sortTaskWorkflow } from 'pages/TaskType/utils/utils';
import BlankButton from '../Shared/BlankButton';
import ModalCondition from '../Modals/ModalCondition';
import ModalSendSMS from '../Modals/ModalSendSMS';
import ModalSendEmail from '../Modals/ModalSendEmail';
import ModalWFlowComplete from '../Modals/ModalWFlowComplete';
import ModalZalo from '../Modals/ModalZalo';

const fieldList = 'task_wflow_list';

const TableTaskWorkflow = ({ disabled = false }) => {
  const methods = useFormContext();
  const { watch, control, setValue } = methods;
  const { remove } = useFieldArray({ control, name: fieldList });
  const taskWorkflowList = watch(fieldList) || [];
  const { isOpenModalCondition, openModalCondition } = useTaskTypeContext();
  const [isOpenModalSMS, setIsOpenModalSMS] = useState(false);
  const [isOpenModalEmail, setIsOpenModalEmail] = useState(false);
  const [isOpenModalWflowComplete, setIsOpenModalWflowComplete] = useState(false);
  const [modalSendEmailData, setModalSendEmailData] = useState({});
  const [modalSendSMSData, setModalSendSMSData] = useState({});

  const [modalSendZaloData, setModalSendZaloData] = useState({});
  const [isOpenModalZalo, setIsOpenModalZalo] = useState(false);

  const [modalWFlowCompleteData, setModalWFlowCompleteData] = useState({});

  const dispatch = useDispatch();
  const { setOpenModalTaskWorkflow } = useTaskTypeContext();

  const handleSort = useCallback((type, index) => {
    let value = Object.values(watch(fieldList) || {});
    sortTaskWorkflow(value, type, index);
    setValue(fieldList, value);
  }, []);

  const renderButton = (index, type, style = {}) => {
    return (
      <div
        className={classNames('bw_btn_table', {
          bw_red: type === 'down',
          bw_green: type === 'up',
        })}
        style={style}
        disabled={disabled}
        onClick={() => (!disabled ? handleSort(type, index) : null)}>
        <i className={`fi fi-rr-angle-small-${type}`}></i>
      </div>
    );
  };

  const onOpenModalCondition = (e, taskWorkflowIndex) => {
    e.preventDefault();
    const defaultCondition = taskWorkflowList[taskWorkflowIndex].condition_list || [];
    openModalCondition(true, taskWorkflowIndex, defaultCondition);
  };

  const onConfirm = (condition_list, taskWorkflowIndex) => {
    taskWorkflowList[taskWorkflowIndex].condition_list = condition_list;
    setValue('task_wflow_list', taskWorkflowList);
    openModalCondition(false, null);
  };

  const columns = useMemo(
    () => [
      {
        header: 'Thứ tự',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p, index) => index + 1,
      },
      {
        header: 'Điều kiện tự động chuyển bước',
        styleHeader: { whiteSpace: 'wrap' },
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p, index) => {
          return (
            <BlankButton onClick={(e) => onOpenModalCondition(e, index)}>
              {!p?.condition_list?.length && (
                <div style={{ textAlign: 'center', minWidth: '100px' }}>
                  <StarTwoTone style={{ fontSize: 20 }} />
                </div>
              )}
              {p?.condition_list?.length > 0 && `${p.condition_list.length} điều kiện`}
            </BlankButton>
          );
        },
      },
      {
        header: 'Sắp xếp',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p, index) => {
          if (index === 0 && Object.values(watch(fieldList)).length > 1) {
            return renderButton(index, 'down');
          } else if (
            index + 1 === Object.values(watch(fieldList)).length &&
            Object.values(watch(fieldList)).length > 1
          ) {
            return renderButton(index, 'up');
          } else if (index > 0) {
            return (
              <Fragment>
                {renderButton(index, 'down', { marginRight: 5 })}
                {renderButton(index, 'up')}
              </Fragment>
            );
          }
        },
      },
      {
        header: 'Tên bước',
        accessor: 'work_flow_name',
      },
      {
        header: 'Thời gian tối thiểu (phút)',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p, index) => {
          return (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <FormInput
                type='number'
                field={`task_wflow_list.${index}.minimum_time`}
                disabled={disabled}
                onChange={(e) => {
                  if (e.target.value >= 0) {
                    methods.setValue(`task_wflow_list.${index}.minimum_time`, e.target.value);
                  }
                }}
              />
              <div style={{border: '1px solid', backgroundColor: 'white'}}>
                <span style={{paddingLeft: '5px', paddingRight: '5px'}}> Phút </span> 
              </div>
            </div>
          );
        },
      },
      {
        header: 'Gửi SMS',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => {
          return (
            <label className='bw_checkbox'>
              <FormInput
                type='checkbox'
                field={`task_wflow_list.${index}.is_send_sms`}
                disabled={disabled}
                onChange={(e) => {
                  methods.clearErrors(`task_wflow_list.${index}.is_send_sms`);
                  setModalSendSMSData({
                    ...methods.getValues(`task_wflow_list.${index}.send_sms`),
                    task_work_flow_id: _.task_work_flow_id,
                    index,
                  });
                  setIsOpenModalSMS(true);
                }}
              />
              <span />
            </label>
          );
        },
      },
      {
        header: 'Gửi Email',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => {
          return (
            <label className='bw_checkbox'>
              <FormInput
                type='checkbox'
                field={`task_wflow_list.${index}.is_send_email`}
                disabled={disabled}
                onChange={(e) => {
                  methods.clearErrors(`task_wflow_list.${index}.is_send_email`);
                  setModalSendEmailData({
                    ...methods.getValues(`task_wflow_list.${index}.send_email`),
                    task_work_flow_id: _.task_work_flow_id,
                    index,
                  });
                  setIsOpenModalEmail(true);
                }}
              />
              <span />
            </label>
          );
        },
      },
      {
        header: 'Gửi ZaloOA',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => {
          return (
            <label className='bw_checkbox'>
              <FormInput
                type='checkbox'
                field={`task_wflow_list.${index}.is_send_zalo_oa`}
                disabled={disabled}
                onChange={(e) => {
                  methods.clearErrors(`task_wflow_list.${index}.is_send_zalo_oa`);
                  setModalSendZaloData({
                    ...methods.getValues(`task_wflow_list.${index}.send_zalo`),
                    task_work_flow_id: _.task_work_flow_id,
                    index,
                  });
                  setIsOpenModalZalo(true);
                }}
              />
              <span />
            </label>
          );
        },
      },
      {
        header: 'Đồng ý',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => {
          const field = `task_wflow_list.${index}.type_purchase`;
          const field_2 = `task_wflow_list.${index}.is_refuse`;
          return (
            <label className='bw_checkbox'>
              <FormInput
                type='checkbox'
                field={`task_wflow_list.${index}.type_purchase`}
                disabled={disabled}
                onChange={(e) => {
                  methods.setValue(field, e.target.checked ? 1 : null);
                  if (e.target.checked && methods.watch(field_2)) {
                    methods.setValue(field_2, null);
                  }
                }}
              />
              <span />
            </label>
          );
        },
      },
      {
        header: 'Từ chối',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => {
          const field = `task_wflow_list.${index}.is_refuse`;
          const field_2 = `task_wflow_list.${index}.type_purchase`;
          return (
            <label className='bw_checkbox'>
              <FormInput
                type='checkbox'
                field={field}
                disabled={disabled}
                onChange={(e) => {
                  methods.setValue(field, e.target.checked ? 1 : null);
                  if (e.target.checked && methods.watch(field_2)) {
                    methods.setValue(field_2, null);
                  }
                }}
              />
              <span />
            </label>
          );
        },
      },
      {
        header: 'Là bước hoàn thành?',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => (
          <label className='bw_checkbox'>
            <FormInput
              type='checkbox'
              field={`task_wflow_list.${index}.is_complete`}
              disabled={disabled}
              onChange={(e) => {
                methods.clearErrors(`task_wflow_list.${index}.is_complete`);
                setModalWFlowCompleteData({
                  ...methods.getValues(`task_wflow_list.${index}`),
                  task_work_flow_id: _.task_work_flow_id,
                  index,
                });
                setIsOpenModalWflowComplete(true);
              }}
            />
            <span />
            {methods.watch(`task_wflow_list.${index}.type_repeat`) === WFLOW_REPEAT_TYPE.WEEK && 'Lặp hàng tuần'}
            {methods.watch(`task_wflow_list.${index}.type_repeat`) === WFLOW_REPEAT_TYPE.MONTH && 'Lặp hàng tháng'}
            {methods.watch(`task_wflow_list.${index}.type_repeat`) === WFLOW_REPEAT_TYPE.YEAR && 'Lặp hàng năm'}
          </label>
        ),
      },
    ],
    [taskWorkflowList],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: ICON_COMMON.add,
        type: 'success',
        content: 'Chọn bước xử lý',
        permission: PERMISSION.ADD,
        hidden: disabled,
        onClick: () => setOpenModalTaskWorkflow(true),
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        permission: PERMISSION.DEL,
        hidden: disabled,
        onClick: (_, index) => dispatch(showConfirmModal(['Xóa bước xử lý này'], () => remove(index))),
      },
    ];
  }, []);

  return (
    <div className='bw_table_task_workflow'>
      <DataTable
        loading={false}
        columns={columns}
        data={taskWorkflowList}
        actions={actions}
        noPaging={true}
        noSelect={true}
        disabled={disabled}
      />
      {isOpenModalCondition && <ModalCondition onConfirm={onConfirm} />}
      {isOpenModalSMS && (
        <ModalSendSMS
          wFlowSendSMS={methods.watch('wflow_send_sms')}
          taskWorkflowList={taskWorkflowList}
          modalSendSMSData={modalSendSMSData}
          onClose={() => setIsOpenModalSMS(false)}
          onConfirm={(values) => {
            setValue(`task_wflow_list.${modalSendSMSData.index}.send_sms`, values);
            setValue(`task_wflow_list.${modalSendSMSData.index}.is_send_sms`, 1);
            setIsOpenModalSMS(false);
          }}
          onReject={() => {
            setValue(`task_wflow_list.${modalSendSMSData.index}.send_sms`, {});
            setValue(`task_wflow_list.${modalSendSMSData.index}.is_send_sms`, 0);
            setIsOpenModalSMS(false);
          }}
        />
      )}
      {isOpenModalEmail && (
        <ModalSendEmail
          wFlowSendEmail={methods.watch('wflow_send_email')}
          taskWorkflowList={taskWorkflowList}
          modalSendEmailData={modalSendEmailData}
          onClose={() => setIsOpenModalEmail(false)}
          onConfirm={(values) => {
            setValue(`task_wflow_list.${modalSendEmailData.index}.send_email`, values);
            setValue(`task_wflow_list.${modalSendEmailData.index}.is_send_email`, 1);
            setIsOpenModalEmail(false);
          }}
          onReject={() => {
            setValue(`task_wflow_list.${modalSendEmailData.index}.send_email`, {});
            setValue(`task_wflow_list.${modalSendEmailData.index}.is_send_email`, 0);
            setIsOpenModalEmail(false);
          }}
        />
      )}
      {isOpenModalZalo && (
        <ModalZalo
          title='Gửi tin nhắn Zalo'
          onClose={() => {
            setValue(`task_wflow_list.${modalSendZaloData.index}.is_send_zalo_oa`, 0);
            setValue(`task_wflow_list.${modalSendZaloData.index}.oa_template_id`, null);
            setIsOpenModalZalo(false);
          }}
          onConfirm={(values) => {
            setValue(`task_wflow_list.${modalSendZaloData.index}.is_send_zalo_oa`, 1);
            setValue(`task_wflow_list.${modalSendZaloData.index}.send_zalo`, values);
            setIsOpenModalZalo(false);
          }}
        />
      )}
      {isOpenModalWflowComplete && (
        <ModalWFlowComplete
          wFlowSendEmail={methods.watch('wflow_send_email')}
          onClose={() => setIsOpenModalWflowComplete(false)}
          onConfirm={(values) => {
            setValue(`task_wflow_list.${modalWFlowCompleteData.index}.type_repeat`, values?.type_repeat || null);
            setValue(`task_wflow_list.${modalWFlowCompleteData.index}.is_complete`, 1);
            setIsOpenModalWflowComplete(false);
          }}
          onReject={() => {
            setValue(`task_wflow_list.${modalWFlowCompleteData.index}.type_repeat`, null);
            setValue(`task_wflow_list.${modalWFlowCompleteData.index}.is_complete`, 0);
            setIsOpenModalWflowComplete(false);
          }}
        />
      )}
    </div>
  );
};

export default TableTaskWorkflow;
