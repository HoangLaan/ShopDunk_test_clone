/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { useFormContext } from 'react-hook-form';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { useState } from 'react';
import ModalSendSMS from './Modal/ModalSendSMS';
import ModalZalo from './Modal/ModalZalo';
import ModalSendEmail from './Modal/ModalSendEmail';

const ItemOrderTypeStatus = ({ index, disabled, keyStatus, remove, handleSort, item, update }) => {
  const methods = useFormContext();
  const { watch, setValue } = methods;
  const [openModal, setOpenModal] = useState(false);
  const [isOpenModalZalo, setIsOpenModalZalo] = useState(false);
  const [isOpenModalEmail, setIsOpenModalEmail] = useState(false);

  const resetIsCompleted = (e, index) => {
    let _data = [...(watch('order_status_list') || [])];
    _data = _data.map((p, i) => {
      return {
        ...p,
        is_completed: parseInt(index) === parseInt(i),
      };
    });
    setValue('order_status_list', _data);

    item.is_completed = e.target.checked === true ? 1 : false;
    update(index, item);
  };

  const onConfirm = (value) => {
    setValue(`${keyStatus}.sms`, value);
    setOpenModal(false);
  };

  const onClose = () => {
    setOpenModal(false);
    setValue(`${keyStatus}.is_send_sms`, 0);
  };

  return (
    <React.Fragment>
      <tr>
        <td className='bw_sticky bw_check_sticky'>{index + 1}</td>
        <td>
          <>
            {index === 0 ? null : (
              <a className='bw_btn_table bw_blue' disabled={disabled} style={{ marginRight: 4 }}>
                <i className='fi fi-rr-angle-small-up' onClick={() => (!disabled ? handleSort('up', index) : null)}></i>
              </a>
            )}
            {watch('order_status_list') &&
            watch('order_status_list').length &&
            watch('order_status_list').length - 1 === index ? null : (
              <a className='bw_btn_table bw_red' disabled={disabled}>
                <i
                  className='fi fi-rr-angle-small-down'
                  onClick={() => (!disabled ? handleSort('down', index) : null)}></i>
              </a>
            )}
          </>
        </td>
        <td>
          <span>{item.order_status_name}</span>
        </td>
        <td>
          <span>{item.description}</span>
        </td>

        <td className='bw_text_center'>
          <label className='bw_radio'>
            <FormInput
              id={`${keyStatus}.is_completed`}
              type='radio'
              field={`${keyStatus}.is_completed`}
              disabled={disabled}
              onChange={(e) => resetIsCompleted(e, index)}
            />
            <span />
          </label>
        </td>
        <td className='bw_text_center'>
          <label className='bw_checkbox' style={{marginRight: 0}}>
            <FormInput
              disabled={disabled}
              type='checkbox'
              className={'bw_inp'}
              field={`${keyStatus}.is_send_sms`}
              onChange={(e) => {
                methods.clearErrors(`${keyStatus}.is_send_sms`);
                methods.setValue(`${keyStatus}.is_send_sms`, e.target.checked ? 1 : 0);
                if (e.target.checked) {
                  setOpenModal(true);
                }
              }}
            />
            <span />
          </label>
        </td>
        <td className='bw_text_center'>
          <label className='bw_checkbox' style={{marginRight: 0}}>
            <FormInput
              disabled={disabled}
              type='checkbox'
              className={'bw_inp'}
              field={`${keyStatus}.is_send_zalo_oa`}
              onChange={(e) => {
                methods.clearErrors(`${keyStatus}.is_send_zalo_oa`);
                methods.setValue(`${keyStatus}.is_send_zalo_oa`, e.target.checked ? 1 : 0);
                if (e.target.checked) {
                  setIsOpenModalZalo(true);
                }
              }}
            />
            <span />
          </label>
        </td>
        <td className='bw_text_center'>
          <label className='bw_checkbox' style={{marginRight: 0}}>
            <FormInput
              disabled={disabled}
              type='checkbox'
              className={'bw_inp'}
              field={`${keyStatus}.is_send_email`}
              onChange={(e) => {
                methods.clearErrors(`${keyStatus}.is_send_email`);
                methods.setValue(`${keyStatus}.is_send_email`, e.target.checked ? 1 : 0);
                if (e.target.checked) {
                  setIsOpenModalEmail(true);
                }
              }}
            />
            <span />
          </label>
        </td>
        <td className='bw_sticky bw_action_table bw_text_center'>
          <a
            className='bw_btn_table bw_delete bw_red'
            onClick={() => (disabled ? null : remove(index))}
            disabled={disabled}>
            <i className='fi fi-rr-trash'></i>
          </a>
        </td>
      </tr>
      <ModalSendSMS open={openModal} onClose={onClose} onConfirm={onConfirm}></ModalSendSMS>
      {isOpenModalZalo && (
        <ModalZalo
          title='Gửi tin nhắn Zalo'
          onClose={() => {
            setValue(`${keyStatus}.is_send_zalo_oa`, 0);
            setValue(`${keyStatus}.oa_template_id`, null);
            setIsOpenModalZalo(false);
          }}
          onConfirm={(zalo_zns_template) => {
            setValue(`${keyStatus}.is_send_zalo_oa`, 1);
            setValue(`${keyStatus}.oa_template_id`, zalo_zns_template);
            setIsOpenModalZalo(false);
          }}
        />
      )}
      {isOpenModalEmail && (
        <ModalSendEmail
          onClose={() => {
            setValue(`${keyStatus}.is_send_email`, 0);
            setValue(`${keyStatus}.email_template_id`, null);
            setValue(`${keyStatus}.mail_subject`, null);
            setValue(`${keyStatus}.mail_from`, null);
            setValue(`${keyStatus}.mail_from_name`, null);
            setValue(`${keyStatus}.mail_reply`, null);
            setIsOpenModalEmail(false);
          }}
          onConfirm={({mail_subject, email_template_id, mail_from, mail_from_name, mail_reply}) => {
            setValue(`${keyStatus}.is_send_email`, 1);
            setValue(`${keyStatus}.email_template_id`, email_template_id);
            setValue(`${keyStatus}.mail_subject`, mail_subject);
            setValue(`${keyStatus}.mail_from`, mail_from);
            setValue(`${keyStatus}.mail_from_name`, mail_from_name);
            setValue(`${keyStatus}.mail_reply`, mail_reply);
            setIsOpenModalEmail(false);
          }}
        />
      )}
    </React.Fragment>
  );
};

export default ItemOrderTypeStatus;
