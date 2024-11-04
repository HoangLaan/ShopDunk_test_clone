import React, { useState } from 'react';
import PropTypes from 'prop-types';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import stocksTakeExel from 'assets/exel/stockstakerequest.xlsx';
import DataTable from 'components/shared/DataTable/index';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { productStocksTakeImport } from 'services/stocks-take-request.service';
import { useMemo } from 'react';

dayjs.extend(customParseFormat);

const Containter = styled.div`
  max-width: 50vw !important;
`;

const ImportProductModal = ({ open, onClose, stockId = null, onChange }) => {
  // const [alerts, setAlerts] = useState([]);
  const [fileName, setFileName] = useState(undefined);
  const [file, setFile] = useState(undefined);
  const [dataError, setDataError] = useState([]);
  const [totalData, setTotalData] = useState(undefined);
  const lengthDataError = useMemo(() => dataError.length, [dataError]);

  const handleGetFile = (files) => {
    const _files = files[0];

    if (!_files) {
      return;
    } else if (!_files?.name || !_files?.name.match(/\.(xlsx)$/i)) {
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

    try {
      const data = await productStocksTakeImport(stockId, file);
      if (data) {
        setTotalData(data.length);
        const error = data.filter((o) => o?.error);
        if (error.length > 0) {
          setDataError(error);
        } else {
          onChange(data);
          onClose();
        }
      }
    } catch (error) {
      let { errors, statusText, message } = error;
      let msg = [`<b>${statusText || message || 'fail'}</b>`].concat(errors || []).join('<br/>');
    }
  };

  const jsx_import = (
    <React.Fragment>
      <div className='bw_note'>
        <h3>Chú ý</h3>
        <p>Các mục đánh dấu * bắt buộc khai báo.</p>
        <p>Chuyển đổi file nhập dưới dạng .XLSX trước khi tải dữ liệu.</p>
        <p>
          Tải file mẫu danh sách tại đây{' '}
          <a href={`${stocksTakeExel}`} className='bw_green'>
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
    </React.Fragment>
  );

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        formatter: (_, index) => index + 1,
      },
      {
        header: 'Mã hàng',
        accessor: 'product_code',
      },
      {
        header: 'Tên hàng',
        accessor: 'created_user',
      },
      {
        header: 'IMEI/SKU',
        accessor: 'product_imei_code',
      },
      {
        header: 'Lỗi',
        accessor: 'error',
        formatter: (p) => <span className='bw_red'>{p?.error}</span>,
      },
    ],
    [],
  );

  const jsx_data_error = (
    <React.Fragment>
      <p>
        Số bản ghi lỗi/Tổng số bản ghi: {lengthDataError}/{totalData}
      </p>
      <DataTable noSelect noPaging data={dataError} columns={columns} />
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <div className={`bw_modal ${open ? 'bw_modal_open' : ''}`} id='bw_notice_del'>
        <Containter className='bw_modal_container'>
          <div className='bw_title_modal'>
            <h3>{lengthDataError === 0 ? 'Import Excel' : 'Lỗi nhập file'}</h3>
            <span className='bw_close_modal fi fi-rr-cross-small' onClick={onClose}></span>
          </div>
          <div className='bw_main_modal'>{lengthDataError ? jsx_data_error : jsx_import}</div>
          <div className='bw_footer_modal'>
            <button
              type='button'
              className='bw_btn bw_btn_success'
              onClick={() => {
                if (lengthDataError === 0) {
                  handleUploadExcel();
                } else {
                  setDataError([]);
                }
              }}>
              <span className='fi fi-rr-check'></span>
              {lengthDataError === 0 ? 'Nhập file' : 'Nhập lại'}
            </button>
            <button type='button' onClick={onClose} className='bw_btn_outline bw_btn_outline_danger'>
              Đóng
            </button>
          </div>
        </Containter>
      </div>
    </React.Fragment>
  );
};

ImportProductModal.propTypes = {
  open: PropTypes.bool,
  className: PropTypes.string,
  header: PropTypes.node,
  footer: PropTypes.string,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  children: PropTypes.node,
};

export default ImportProductModal;
