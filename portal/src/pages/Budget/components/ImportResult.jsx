import React from 'react';
import moment from 'moment';
import { FaRegClock } from 'react-icons/fa';

export default function ImportResultModal({ results, onClose }) {
  const { error, total } = results;

  return (
    <>
      <div className='bw_modal bw_modal_open' id='bw_importError'>
        <div className='bw_modal_container bw_filter'>
          <div className='bw_title_modal'>
            <h3>Nhập danh sách ngân sách</h3>
            <span className='bw_close_modal fi fi-rr-cross-small' onClick={onClose}></span>
          </div>
          <div className='bw_main_modal'>
            <div class='bw_box_card bw_mt_1'>
              <div className='bw_row'>
                <div className='bw_col_12 bw_mb_1 bw_flex'>
                  <span className='bw_mr_1 '>
                    <FaRegClock size={24} style={{ marginRight: 10 }} />
                  </span>
                  <span>{moment().format('DD/MM/YYYY HH:MM')}</span>
                </div>
                <div className='bw_col_12 bw_mb_2'>
                  <span>
                    <b>Danh sách ngân sách đã được cập nhật thành công. Kết quả cụ thể như sau:</b>
                  </span>
                </div>
                <div className='bw_col_12'>
                  <div className='bw_mr_5 bw_mb_1'>
                    <b>Tổng số lượng:</b> <b> {total} dòng</b>
                  </div>
                  <div className='bw_mr_5 bw_mb_1'>
                    <b>Thêm thành công:</b> <b className='bw_green'>{total - error?.length || 0}</b>
                  </div>
                  <div className='bw_mr_5 bw_mb_1'>
                    <b>Số dòng lỗi:</b> <b className='bw_red'>{error?.length}</b>
                  </div>
                </div>
                <div className='bw_col_12 bw_mt_2'>
                  <b>Các dòng import lỗi: </b>
                </div>
                <div className='bw_col_12 bw_mt_1'>
                  <div class='bw_table_responsive'>
                    <table class='bw_table'>
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Mã ngân sách</th>
                          <th>Tên ngân sách</th>
                          <th>Ghi chú</th>
                          <th>Mô tả</th>
                          <th style={{ width: '70%' }}>Lỗi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {error && error.length ? (
                          error.map((er, i) => (
                            <tr key={i}>
                              <td>{er.i}</td>
                              <td>{er.item?.budget_code}</td>
                              <td>{er.item?.budget_name}</td>
                              <td>{er.item?.note}</td>
                              <td>{er.item?.description}</td>
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
