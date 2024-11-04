import React from 'react';

export default function ImportError({ errors, onClose }) {
  const { error, total } = errors;
  return (
    <>
      <div className='bw_modal bw_modal_open' id='bw_importError'>
        <div className='bw_modal_container bw_filter bw_w1200'>
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
                          <th>Mã dòng tiền</th>
                          <th>Tên dòng tiền</th>
                          <th>Công ty áp dụng</th>
                          <th>Tài khoản kế toán ngầm định</th>
                          <th>Thuộc dòng tiền</th>
                          <th>Loại dòng tiền</th>
                          <th>Diễn giải</th>
                          <th>Ghi chú</th>
                          <th>Trạng thái</th>
                          <th style={{ width: '70%' }}>Lỗi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {error && error.length ? (
                          error.map((er, i) => (
                            <tr key={i}>
                              <td>{er.i + 1}</td>
                              <td>{er.cashFlow?.cash_flow_code}</td>
                              <td>{er.cashFlow?.cash_flow_name}</td>
                              <td>{er.cashFlow?.company_id}</td>
                              <td>{er.cashFlow?.implicit_account_id}</td>
                              <td>{er.cashFlow?.parent_id}</td>
                              <td>{er.cashFlow?.cash_flow_type}</td>
                              <td>{er.cashFlow?.description}</td>
                              <td>{er.cashFlow?.note}</td>
                              <td>{er.cashFlow?.is_active}</td>
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
