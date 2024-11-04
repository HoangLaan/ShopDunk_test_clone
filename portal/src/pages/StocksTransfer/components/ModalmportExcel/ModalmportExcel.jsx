import { downloadExcelFile, uploadExcel } from 'pages/StocksTransfer/helpers/call-api';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import { notification, Alert } from 'antd';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { showToast } from 'utils/helpers';

dayjs.extend(customParseFormat);

const ModalmportExcel = ({ open, onClose, onConfirm, stockId = null }) => {
  const [alerts, setAlerts] = useState([]);
  const [fileName, setFileName] = useState(undefined);
  const [file, setFile] = useState(undefined);

  const fetchGetFileExmple = async () => {
    downloadExcelFile()
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        const configDate = dayjs().format('DDMMYYYY_HHmmss');
        link.setAttribute('download', `Danh_Sach_San_Pham_Chuyen_Kho${configDate}.xlsx`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        showToast.error('Đã xảy ra lỗi vui lòng thử lại');
      })
      .finally(() => {});
  };

  const handleGetFile = (files) => {
    const _files = files[0];

    if (!_files) {
      setAlerts([{ type: 'danger', msg: 'Vui lòng chọn tập tin tải lên.' }]);

      return;
    } else if (!_files?.name || !_files?.name.match(/\.(xlsx)$/i)) {
      setAlerts([{ type: 'danger', msg: 'Tập tin tải lên không đúng định dạng.' }]);

      return;
    }
    if (_files) {
      setFile(_files);
      setFileName(_files?.name);
    }
  };

  const handleClearFile = () => {
    setFileName(undefined);
    setFile(undefined);
    document.getElementById('uploadFile').value = '';
  };

  const handleUploadExcel = async () => {
    setAlerts([]);
    try {
      const data = await uploadExcel(stockId, file);

      if (data && data.length) {
        let data_format = data.reduce((a, v) => ({ ...a, [v.imei]: v }), {});
        onConfirm(data_format);
      }
    } catch (error) {
      let { errors, statusText, message } = error;
      let msg = [`<b>${statusText || message || 'fail'}</b>`].concat(errors || []).join('<br/>');
      setAlerts([{ color: 'danger', msg }]);
    }
  };

  return (
    <React.Fragment>
      <div className={`bw_modal ${open ? 'bw_modal_open' : ''}`} id='bw_notice_del'>
        <div className='bw_modal_container'>
          <div className='bw_title_modal'>
            <h3>Import Excel</h3>
            <span className='bw_close_modal fi fi-rr-cross-small' onClick={onClose}></span>
          </div>
          {/* general alerts */}
          {alerts.map(({ type, msg }, idx) => {
            return <Alert key={`alert-${idx}`} type={type} message={msg} showIcon />;
          })}
          <div className='bw_main_modal'>
            <div className='bw_note'>
              <h3>Chú ý</h3>
              <p>Các mục đánh dấu * bắt buộc khai báo.</p>
              <p>Chuyển đổi file nhập dưới dạng .XLSX trước khi tải dữ liệu.</p>
              <p>
                Tải file mẫu danh sách tại đây{' '}
                <a onClick={() => fetchGetFileExmple()} className='bw_green'>
                  (file excel danh sách sản phẩm mẫu)
                </a>
              </p>
            </div>
            <label className='bw_import_file'>
              {fileName ? (
                <>
                  <span style={{ fontSize: 15 }}>{fileName}</span>
                  <span
                    style={{ fontSize: 15, color: 'red' }}
                    onClick={() => handleClearFile()}
                    className='fi fi-rr-trash'></span>
                </>
              ) : (
                <>
                  <input
                    id='uploadFile'
                    type='file'
                    onChange={({ target: { files } }) => handleGetFile(files)}
                    accept='.xls,.xlsx'
                  />
                  <span className='fi fi-rr-inbox-in'></span>
                  Kéo thả file hoặc tải lên từ thiết bị
                </>
              )}
            </label>
          </div>
          <div className='bw_footer_modal'>
            <button type='button' className='bw_btn bw_btn_success' onClick={() => handleUploadExcel()}>
              <span className='fi fi-rr-check'></span>
              Nhập file
            </button>
            <button type='button' onClick={onClose} className='bw_btn_outline bw_btn_outline_danger'>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

ModalmportExcel.propTypes = {
  open: PropTypes.bool,
  className: PropTypes.string,
  header: PropTypes.node,
  footer: PropTypes.string,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  children: PropTypes.node,
};

export default ModalmportExcel;
