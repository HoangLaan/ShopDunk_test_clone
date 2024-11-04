import React from 'react';

export default function ImportError({ errors, onClose }) {
  const { error, total } = errors;
  return (
    <>
      <div className='bw_modal bw_modal_open' id='bw_importError'>
        <div className='bw_modal_container bw_filter'>
          <div className='bw_title_modal'>
            <h3>Lỗi nhập file</h3>
            <span className='bw_close_modal fi fi-rr-cross-small' onClick={onClose}></span>
          </div>
          <div className='bw_main_modal'>
            <div class='bw_box_card bw_mt_1'>
              <div className='bw_row'>
                <div className='bw_col_12'>
                  <span className='bw_mr_5'>
                    <b>Tổng số dòng:</b> {total}{' '}
                  </span>
                  <span>
                    <b>Số dòng lỗi:</b> {error?.length}
                  </span>
                </div>
                <div className='bw_col_12 bw_mt_1'>
                  <div class='bw_table_responsive'>
                    <table class='bw_table'>
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Mã tài khoản</th>
                          <th>Tên tài khoản</th>
                          <th>Tính chất</th>
                          <th>Công ty thuộc</th>
                          <th>Kích hoạt</th>
                          <th style={{ width: '70%' }}>Lỗi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {error && error.length ? (
                          error.map((er, i) => (
                            <tr key={i}>
                              <td>{er.i}</td>
                              <td>{er.accountingAccount?.accounting_account_code}</td>
                              <td>{er.accountingAccount?.accounting_account_name}</td>
                              <td>{er.accountingAccount?.property}</td>
                              <td>{er.accountingAccount?.is_active}</td>
                              <td style={{ whiteSpace: 'pre', width: '70%' }}>
                                <span className='text-danger'>{er.errmsg.join('\n') || ''}</span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className='text-center'>
                              Không có dữ liệu
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
