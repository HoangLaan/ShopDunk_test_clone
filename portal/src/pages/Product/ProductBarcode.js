/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Alert } from 'antd';

// Components
import BWButton from 'components/shared/BWButton/index';
import BarcodeInfo from './components/Barcode/Info';
import PrintSize from './components/Barcode/PrintSize';
import Setting from './components/Barcode/Setting';
import Products from './components/Barcode/Products';
import BWImage from 'components/shared/BWImage/index';
import StemImage from 'assets/bw_image/stem1.png';
import QRImage from 'assets/bw_image/qr.png';
// Services
import { printBarcode, printQRCode } from 'services/product.service';
import { cdnPath } from 'utils';
import Loading from './components/Loading';

export default function ProductBarcode() {
  const methods = useForm({
    defaultValues: {
      size: 3,
      is_show_name: 1,
      is_show_price: 1,
      is_show_code: 1,
      is_show_imei: 1,
      is_qr_code: 1,
    },
  });
  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = methods;

  const isShowName = methods.watch('is_show_name') === 1 ? true : false;
  const isShowCode = methods.watch('is_show_code') === 1 ? true : false;
  const isShowPrice = methods.watch('is_show_price') === 1 ? true : false;

  const [alerts, setAlerts] = useState([]);
  const [tab, setTab] = useState('bw_info');

  const handleScrollToFormItem = (id) => {
    const violation = document.getElementById(id);
    window.scrollTo({
      top: violation.offsetTop,
      behavior: 'smooth',
    });
    setTab(id);
  };
  const isQrCode = methods.watch('is_qr_code');
  const onSubmit = async (values) => {
    let _alerts = [];
    setValue('is_loading_barcode', true);
    try {
      if (!watch('is_show_imei'))
        values.products = values.products.map(({ imeis, ...item }) => ({ ...item, imeis: [] }));

      if (isQrCode) {
        return printQRCode(values).then((data) => {
          methods.reset({
            ...methods.getValues(),
            products: [],
          });
          window.open(cdnPath(data.path), '_blank');
          setValue('is_loading_barcode', false);
        });
      }
      printBarcode(values).then((data) => {
        methods.reset({
          ...methods.getValues(),
          products: [],
        });
        window.open(cdnPath(data.path), '_blank');
        setValue('is_loading_barcode', false);
      });
    } catch (error) {
      let { errors, statusText, message } = error;
      let msg = [`${statusText || message}`].concat(errors || []).join('.');
      _alerts.push({ type: 'error', msg });
      setValue('is_loading_barcode', false);
    } finally {
      setAlerts(_alerts);
    }
  };

  useEffect(() => {
    if (errors) window.scrollTo(0, 0);
  }, [errors]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp' style={{ position: 'inherit' }}>
        {/* <Alert message="Success Tips" type="success" showIcon /> */}
        {/* general alerts */}
        {(alerts || []).map(({ type, msg }, idx) => {
          return (
            <Alert
              key={`alert-${idx}`}
              type={type}
              //isOpen={true}
              message={msg}
              //toggle={() => setAlerts([])}
              showIcon
            />
          );
        })}
        <div className='bw_row bw_mt_2'>
          <div className='bw_col_3'>
            <ul className='bw_control_form'>
              <li onClick={() => handleScrollToFormItem('bw_info')}>
                <a data-href='#bw_info' className={tab === 'bw_info' ? 'bw_active' : ''}>
                  <span className='fi fi-rr-check' /> Thông tin
                </a>
              </li>
              <li onClick={() => handleScrollToFormItem('bw_image')}>
                <a data-href='#bw_image' className={tab === 'bw_image' ? 'bw_active' : ''}>
                  <span className='fi fi-rr-check' /> Danh sách sản phẩm
                </a>
              </li>
              <li onClick={() => handleScrollToFormItem('bw_des')}>
                <a data-href='#bw_des' className={tab === 'bw_des' ? 'bw_active' : ''}>
                  <span className='fi fi-rr-check' /> Khổ in
                </a>
              </li>

              <li onClick={() => handleScrollToFormItem('bw_attr')}>
                <a data-href='#bw_attr' className={tab === 'bw_attr' ? 'bw_active' : ''}>
                  <span className='fi fi-rr-check' /> Cài đặt tem in
                </a>
              </li>
            </ul>
            <div className='bw_view_prints'>
              {isQrCode ? (
                <div className='bw_row'>
                  <div className='bw_col_4'>
                    <BWImage src={QRImage} />
                  </div>
                  <div className='bw_col_8'>
                    {isShowName && <p style={{ textAlign: 'left' }}>Điện thoại di động Apple iPhone 11 128GB Black</p>}
                    {isShowCode && <p style={{ textAlign: 'left' }}>MHDH3VN/A</p>}
                    {isShowPrice && <p style={{ fontWeight: 'bold', textAlign: 'left' }}>30,000,000 đ</p>}
                  </div>
                </div>
              ) : (
                <>
                  {isShowName && <p>Điện thoại di động Apple iPhone 11 128GB Black</p>}
                  <BWImage src={StemImage} />
                  {isShowCode && <p>MHDH3VN/A</p>}
                  {isShowPrice && <p style={{ fontWeight: 'bold' }}>30,000,000 đ</p>}
                </>
              )}
            </div>
          </div>
          <div className='bw_col_9 bw_pb_6'>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <BarcodeInfo />
                <Products />
                <PrintSize />
                <Setting />
                <div className='bw_btn_save bw_btn_group bw_flex bw_justify_content_right bw_align_items_center'>
                  <BWButton
                    type='success'
                    icon='fi fi-rr-print'
                    content={'In mã vạch'}
                    onClick={handleSubmit(onSubmit)}
                    submit></BWButton>
                  <BWButton outline content='Đóng' onClick={() => window._$g.rdr('/product')}></BWButton>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
      {watch('is_loading_barcode') && <Loading />}
    </React.Fragment>
  );
}
