import React, { useState } from 'react';
import { Alert, notification } from 'antd';
import { useFormContext } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import moment from 'moment';
import { showToast } from 'utils/helpers';
import dayjs from 'dayjs';
import BWLoader from 'components/shared/BWLoader/index';
import { upload, downloadExcelFile } from 'services/stocks-in-request.service';
import { ToastStyle } from '../utils/constants';
import ModalLoading from 'pages/Product/components/Loading';
const ModalImport = ({ setShowModalImport }) => {
  const methods = useFormContext();
  const { watch, setValue } = methods;
  const [alerts, setAlerts] = useState([]);
  const [showModalErrors, setShowModalErrors] = useState({ isShow: false, list: [] });
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone();
  const [uploading, setUploading] = useState(false);

  const handleImportExcel = async () => {
    setUploading(true);
    let currentFile = acceptedFiles[0];
    if (!currentFile) {
      setAlerts([{ type: 'error', msg: 'Vui lòng chọn tập tin tải lên.' }]);
    } else if (!currentFile?.name || !currentFile?.name.match(/\.(xlsx)$/i)) {
      setAlerts([{ type: 'error', msg: 'Tập tin tải lên không đúng định dạng.' }]);
    }
    try {
      const data = await upload(currentFile, { stocks_id: watch('stocks_id') });
      const { product_list, errors_list } = data;
      if (errors_list?.length) {
        setShowModalErrors({ isShow: true, list: errors_list });
        setAlerts([{ type: 'error', msg: 'Lỗi tập tin tải lên' }]);
      } else {
        setValue('products_list', product_list);
        showToast.success('Tải lên thành công!!', ToastStyle);
        setShowModalImport(false);
      }
    } catch (error) {
      let { errors, statusText, message } = error;
      let msg = [`${statusText || message || 'fail'}`].concat(errors || []).join('<br/>');
      showToast.error(message);
      // setAlerts([{ type: 'error', msg}]);
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTemplateExcel = async () => {
    downloadExcelFile()
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        const configDate = dayjs().format('DDMMYYYY_HHmmss');
        link.setAttribute('download', `Danh_Sach_San_Pham_Nhap_Kho${configDate}.xlsx`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        notification.error({
          message: 'Đã xảy ra lỗi vui lòng thử lại',
        });
      })
      .finally(() => {});
  };
  const ModalErrors = () => {
    if (showModalErrors.list && showModalErrors.list.length > 0)
      return (
        <div className='bw_modal bw_modal_open'>
          <div className='bw_modal_container bw_w800'>
            <div className='bw_title_modal'>
              <h3>Lỗi file tải lên</h3>
              <span
                className='fi fi-rr-cross-small bw_close_modal'
                onClick={() => setShowModalErrors({ isShow: false, list: [] })}
              />
            </div>
            <div className='bw_main_modal'>
              <div className='bw_box_card bw_mt_1'>
                <div className='bw_table_responsive'>
                  <table className='bw_table'>
                    <thead>
                      <tr>
                        <th className='bw_sticky bw_check_sticky'>Dòng lỗi</th>
                        <th>Nội dung</th>
                      </tr>
                    </thead>
                    <tbody>
                      {showModalErrors.list.map((item, idx) => {
                        return (
                          <tr key={idx}>
                            <td className='bw_text_center'>{item.index}</td>
                            <td>{item.content}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className='bw_footer_modal'>
              <button
                type='button'
                className='bw_btn_outline bw_close_modal'
                onClick={() => setShowModalErrors({ isShow: false, list: [] })}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      );
  };
  return (
    <React.Fragment>
      <div className='bw_modal bw_modal_open' id='bw_importExcel'>
        {/* {uploading && <BWLoader isPage={false} />} */}
        {uploading && <ModalLoading />}
        <div className='bw_modal_container bw_filter'>
          <div className='bw_title_modal'>
            <h3>Import Excel</h3>
            <span className='bw_close_modal fi fi-rr-cross-small' onClick={() => setShowModalImport(false)} />
          </div>
          <div className='bw_main_modal'>
            <div className='bw_note'>
              <h3>Chú ý</h3>
              <p>Các mục đánh dấu * bắt buộc khai báo.</p>
              <p>Chuyển đổi file nhập dưới dạng .XLSX trước khi tải dữ liệu.</p>
              <p>
                Tải file mẫu danh sách <a onClick={() => handleDownloadTemplateExcel()}>tại đây</a> (file excel danh
                sách sản phẩm mẫu)
              </p>
            </div>
            <div {...getRootProps()}>
              <label className='bw_import_file'>
                {/* <input type='file' /> */}
                <input {...getInputProps()} />
                <span className='fi fi-rr-inbox-in' />
                Kéo thả file hoặc tải lên từ thiết bị
              </label>
            </div>
          </div>
          <div className=''>{acceptedFiles[0]?.path}</div>
          {/* general alerts */}
          {alerts.map(({ type, msg }, idx) => {
            return <Alert key={`alert-${idx}`} type={type} message={msg} showIcon />;
          })}
          <div className='bw_footer_modal bw_mt_1'>
            <button
              type='button'
              className='bw_btn bw_btn_success'
              onClick={() => {
                handleImportExcel();
              }}>
              <span className='fi fi-rr-check' /> Nhập file
            </button>
            <button
              type='button'
              className='bw_btn_outline bw_btn_outline_success'
              onClick={() => setShowModalImport(false)}>
              <span className='fi fi-rr-refresh' />
              Đóng
            </button>
          </div>
        </div>
      </div>
      {showModalErrors.isShow ? ModalErrors() : null}
    </React.Fragment>
  );
};

export default ModalImport;
