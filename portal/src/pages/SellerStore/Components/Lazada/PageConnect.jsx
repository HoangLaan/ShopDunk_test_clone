import React, { useEffect, useState } from 'react';
import { Table, Steps } from 'antd';
import { stepsLazada } from '../../helpers/constaint';
import BWLoadingPage from 'components/shared/BWLoadingPage';
import { getconnectLazada, connectLazada } from '../../helpers/call-api-lazada';
import { showToast } from 'utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const Step = Steps.Step;

const PageLazadaConnect = () => {
  const dispatch = useDispatch();
  const [current, setCurrent] = useState(0);
  const [dataShop, setDataShop] = useState({});
  const [codeAuthen, setCodeAuthen] = useState(null);
  const [loadingPdf, setloadingPdf] = useState(false);
  const history = useHistory();

  useEffect(() => {
    window.addEventListener(
      'storage',
      (_c) => {
        let code = localStorage.getItem('code');
        //Call Api o day
        if (code != '') {
          setCodeAuthen(code);
        }
      },
      false,
    );
  }, []);

  useEffect(() => {
    if (codeAuthen) {
      saveLazadaToken();
    }
  }, [codeAuthen]);

  // Thêm kết nối
  const handleconnectLazada = async (e) => {
    try {
      setloadingPdf(true);
      let res = await getconnectLazada();
      let { path = '' } = res || {};
      window.open(path, '_blank', 'location=yes,height=765,width=1280,scrollbars=yes,status=yes', false);
      setloadingPdf(false);
    } catch (error) {
      showToast.error(error ? error.message : 'Có lỗi xảy ra!');
    }
  };

  // Thêm kết nối
  const handleProductLazada = () => {
    history.push(`/seller-store-connect/manage-lazada`);
  };

  const saveLazadaToken = async () => {
    try {
      // setisLoadingPdf(true);
      let result = await connectLazada({ code: codeAuthen });
      dispatch({ type: 'SHOP', payload: result });
      setCurrent(1);
      setCodeAuthen(null);
      // setIsLoadingFrist(false);
      // setIsRefesh(true);
      // setisLoadingPdf(false);
    } catch (error) {
      showToast.error(error ? error.message : 'Có lỗi xảy ra!');
    } finally {
      localStorage.setItem('code', '');
    }
  };

  const renderStepContent = () => {
    switch (current) {
      case 0:
        return (
          <div style={{ margin: 15 }}>
            <h2>Kết nối gian hàng trên sàn</h2>
            <p>Đăng nhập và kết nối gian hàng trên Lazada để có thể đồng bộ thông tin hàng hóa, đơn hàng</p>
            <button
              id='btn_login_lazada'
              className='bw_btn bw_btn_success'
              style={{ marginRight: '10px' }}
              type='button'
              onClick={handleconnectLazada}>
              {' '}
              Đăng nhập
            </button>
          </div>
        );
      case 1:
        return (
          <div style={{ margin: 15 }}>
            <h2>Liên kết hàng hóa</h2>
            <p>
              Liên kết hàng hóa trên sàn với hàng hóa trên portal để tự động đồng bộ tồn kho, giá bán khi có thay đổi
              trên portal lên tất cả các sàn, đồng thời cũng để trừ đúng tồn kho khi có đơn hàng về.
            </p>

            <button
              id='btn_login_lazada'
              className='bw_btn bw_btn_success'
              style={{ marginRight: '10px' }}
              type='button'
              onClick={handleProductLazada}>
              {' '}
              Liên kết ngay
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        {loadingPdf && (
          <BWLoadingPage
            style={{
              position: 'absolute',
              top: '0',
              right: '0',
              width: '100%',
              opacity: '0.5',
              height: '100%',
            }}
          />
        )}
        <Steps size='small' current={current}>
          {stepsLazada.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className='bw_row'>
          <div className='bw_col_12'>{renderStepContent()}</div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PageLazadaConnect;
