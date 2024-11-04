import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Select, Alert } from 'antd';
import { useDispatch } from 'react-redux';
// Compnents
import BWAccordion from 'components/shared/BWAccordion/index';
// Services
import { getOptionsBanks } from 'services/bank.service';
import { mapDataOptions4Select } from 'utils/helpers';
import { showConfirmModal } from 'actions/global';

export default function BankUser({ disabled = true }) {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const {
    watch,
    register,
    getValues,
    formState: { errors },
  } = methods;
  const [optionsBank, setOptionsBank] = useState(null);

  useEffect(() => {
    getOptionsBanks()
      .then((data) => setOptionsBank(mapDataOptions4Select(data)))
      .catch((error) => window._$g.dialogs.alert(window._$g._(error.message)));
  }, []);

  const handleAddBankUser = () => {
    let bankUsers = getValues('bank_users') ?? [];
    if (bankUsers.length && bankUsers.filter((x) => !x.bank_id).length) return;
    bankUsers.push({
      bank_id: '',
      bank_number: '',
      bank_branch: '',
      is_default: 1,
    });
    methods.setValue('bank_users', bankUsers);
  };

  return (
    <BWAccordion title='Tài khoản ngân hàng' id='bw_account_cus'>   
      <div className='bw_table_responsive'>
        <table className='bw_table'>
          <thead>
            <tr>
              <th className='bw_sticky bw_check_sticky bw_text_center'>STT</th>
              <th>Số tài khoản</th>
              <th>Ngân hàng</th>
              <th>Chi nhánh</th>
              <th className='bw_text_center'>Mặc định</th>
              {!disabled && <th className='bw_sticky bw_action_table bw_text_center'>Thao tác</th>}
            </tr>
          </thead>
          <tbody>
            {watch('bank_users') ? (
              watch('bank_users').map((bk, i) => (
                <tr key={i}>
                  <td className='bw_sticky bw_check_sticky bw_text_center'>{i + 1}</td>
                  <td>
                    <input
                      disabled={disabled}
                      type='text'
                      placeholder='Số tài khoản'
                      className='bw_inp bw_mw_2'
                      {...register(`bank_users.${i}.bank_number`)}
                    />
                  </td>
                  <td style={{ width: 300 }}>
                    <Select
                      placeholder='Chọn ngân hàng'
                      size='middle'
                      defaultValue={watch(`bank_users.${i}.bank_id`) || undefined}
                      onChange={(value) => methods.setValue(`bank_users.${i}.bank_id`, value)}
                      options={optionsBank}
                      disabled={disabled}
                      style={{ width: 300 }}
                    />
                  </td>
                  <td>
                    <input
                      disabled={disabled}
                      type='text'
                      placeholder='Chi nhánh'
                      className='bw_inp bw_mw_2'
                      {...register(`bank_users.${i}.bank_branch`)}
                    />
                  </td>
                  <td className='bw_text_center'>
                    <label className='bw_checkbox'>
                      <input disabled={disabled} type='checkbox' {...register(`bank_users.${i}.is_default`)} />
                      <span></span>
                    </label>
                  </td>
                  {!disabled && (
                    <td className='bw_sticky bw_action_table bw_text_center'>
                      <a
                        onClick={() =>
                          dispatch(
                            showConfirmModal(
                              ['Bạn thực sự muốn xoá'],
                              () => {
                                methods.setValue(
                                  'bank_users',
                                  watch('bank_users').filter((_, idx) => idx != i),
                                );
                              },
                              'Đồng ý',
                            ),
                          )
                        }
                        className='bw_btn_table bw_delete bw_red'>
                        <i className='fi fi-rr-trash'></i>
                      </a>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={!disabled ? 6 : 5} className='bw_text_center'>
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {!disabled && (
        <a onClick={handleAddBankUser} className='bw_btn_outline bw_btn_outline_success bw_add_us'>
          <span className='fi fi-rr-plus'></span> Thêm tài khoản
        </a>
      )}
    </BWAccordion>
  );
}
