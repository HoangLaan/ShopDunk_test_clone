import Modal from 'components/shared/Modal/index';
import React from 'react';

export default function ModalImportError({ open, onClose, errors }) {
  const { error, total } = errors;
  return (
    <Modal witdh={'50%'} open={open} onClose={onClose} header='Lỗi nhập file'>
      <div className='bw_box_card bw_mt_1'>
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
            <div className='bw_table_responsive'>
              <table className='bw_table'>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mã bước</th>
                    <th>Tên bước xử lý</th>
                    <th>Màu</th>
                    <th>Mô tả</th>
                    <th>Đồng ý mua</th>
                    <th style={{ width: '70%' }}>Lỗi</th>
                  </tr>
                </thead>
                <tbody>
                  {error && error.length ? (
                    error.map((er, i) => (
                      <tr key={i}>
                        <td>{er.i}</td>
                        <td>{er.taskWorkFlow?.work_flow_code}</td>
                        <td>{er.taskWorkFlow?.work_flow_name}</td>
                        <td>{er.taskWorkFlow?.color}</td>
                        <td>{er.taskWorkFlow?.description}</td>
                        <td>{er.taskWorkFlow?.argee_to_buy}</td>
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
    </Modal>
  );
}
