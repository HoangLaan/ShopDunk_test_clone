import React from 'react';
import { useFormContext } from 'react-hook-form';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { Empty } from 'antd';

export default function IpAddress({ isEdit = true }) {
  const methods = useFormContext();
  const { watch, getValues, setValue } = methods;

  const handleDeleteRow = (idx) => {
    let _ips = getValues('ips') ?? [];
    if (!_ips || !_ips.length) return;
    _ips.splice(idx, 1);
    setValue('ips', _ips);
  };

  const handleAddRow = () => {
    let _ips = getValues('ips') ?? [];
    const _ipsBlank = _ips.filter((x) => !x.ip_name && !x.ip_address);
    if (_ips.length && _ipsBlank.length) return;
    _ips.push({
      ip_name: '',
      ip_address: '',
      is_ipv4: false,
    });
    setValue('ips', _ips);
  };

  return (
    <>
      {isEdit && (
        <div style={{ display: 'flex', flexDirection: 'row-reverse', marginBottom: '1em' }}>
          <a onClick={handleAddRow} className='bw_btn_outline bw_btn_outline_success'>
            <span className='fi fi-rr-plus'></span> Thêm địa chỉ
          </a>
        </div>
      )}
      <div className='bw_table_responsive'>
        <table className='bw_table'>
          <thead>
            <tr>
              <th className='bw_sticky bw_check_sticky bw_text_center'>STT</th>
              <th className='bw_text_center'>Tên địa chỉ IP</th>
              <th className='bw_text_center'>Địa chỉ IP</th>
              <th className='bw_text_center'>Là IPV4</th>
              {isEdit && <th className='bw_sticky bw_action_table bw_text_center'>Thao tác</th>}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(watch('ips')) && watch('ips').length ? (
              watch('ips').map((ip, i) => (
                <tr key={i}>
                  <td className='bw_sticky bw_check_sticky bw_text_center'>{i + 1}</td>
                  <td className='bw_text_center'>
                    <input
                      disabled={!isEdit}
                      className='bw_inp bw_mw_2 bw_text_center'
                      {...methods.register(`ips.${i}.ip_name`)}
                      placeholder='Tên địa chỉ'
                    />
                  </td>
                  <td className='bw_text_center'>
                    <input
                      disabled={!isEdit}
                      className='bw_inp bw_mw_2 bw_text_center'
                      {...methods.register(`ips.${i}.ip_address`)}
                      placeholder='Địa chỉ'
                    />
                  </td>
                  <td className='bw_text_center'>
                    <label
                      style={{
                        marginRight: '0px',
                      }}
                      className='bw_checkbox'>
                      <FormInput disabled={!isEdit} type='checkbox' field={`ips.${i}.is_ipv4`} />
                      <span></span>
                    </label>
                  </td>
                  {isEdit && (
                    <td className='bw_sticky bw_action_table bw_text_center'>
                      <a onClick={() => handleDeleteRow(i)} className='bw_btn_table bw_delete bw_red'>
                        <i className='fi fi-rr-trash'></i>
                      </a>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <td colSpan={5}>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không tìm thấy dữ liệu' />
              </td>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
