import React, { useState } from 'react';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';
import { useForm } from 'react-hook-form';
import { changePassCRMAccount } from 'services/customer.service';
import { useParams } from 'react-router-dom';
import { showToast } from 'utils/helpers';

const CustomerResetPassword = ({ onClose }) => {
  const methods = useForm();
  const [error, setError] = useState();
  const { account_id } = useParams();

  const onSubmit = async (payload) => {
    try {
      if (payload?.password !== payload?.password_again) {
        setError('Mật khẩu không khớp, vui lòng kiểm tra lại');
        return;
      }
      await changePassCRMAccount(account_id, payload);

      showToast.success('Đổi mật khẩu thành công');
      onClose();
    } catch (err) {
      showToast.error(err?.message);
    }
  };

  return (
    <div className='bw_modal bw_modal_open'>
      <div className='bw_modal_container'>
        <div className='bw_title_modal'>
          <h3>Đổi mật khẩu</h3>
          <span className='bw_close_modal fi fi-rr-cross-small' onClick={onClose}></span>
        </div>
        <div className='bw_main_modal bw_border_top'>
          <form className='bw_frm_change'>
            <div className='bw_frm_box bw_relative'>
              <label>
                Mật khẩu mới <span className='bw_red'>*</span>
              </label>
              <input
                type='password'
                placeholder='**************'
                onChange={(e) => {
                  setError(undefined);
                  methods.setValue('password', e.target.value);
                }}
              />
              <span className='bw_show_pass'>
                <i className='fi fi-rr-eye'></i>
              </span>
            </div>
            <div className='bw_frm_box bw_relative'>
              <label>
                Nhập lại mật khẩu mới <span className='bw_red'>*</span>
              </label>
              <input
                type='password'
                placeholder='**************'
                onChange={(e) => {
                  setError(undefined);
                  methods.setValue('password_again', e.target.value);
                }}
              />
              <span className='bw_show_pass'>
                <i className='fi fi-rr-eye'></i>
              </span>
            </div>
            {error && <ErrorMessage message={error} />}
          </form>
        </div>
        <div className='bw_footer_modal'>
          <button type='button' onClick={methods.handleSubmit(onSubmit)} className='bw_btn bw_btn_success'>
            <span className='fi fi-rr-check'></span> Đổi mật khẩu
          </button>
          <button onClick={onClose} type='button' className='bw_btn_outline bw_btn_outline_success'>
            <span className='fi fi-rr-refresh'></span>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerResetPassword;
