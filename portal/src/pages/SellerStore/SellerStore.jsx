import React, { useState, useCallback, useEffect } from 'react';
import ContainerList from './Components/ContainerList';
import logoShopee from 'assets/bw_image/sp.png';
import logoLazada from 'assets/bw_image/lzd.png';
import Loading from 'components/shared/Loading/index';
import BWLoadingPage from 'components/shared/BWLoadingPage';

// import { getconnectLazada, connectLazada } from '../../helpers/call-api';
import { showToast } from 'utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { triggerSidebar } from 'actions/global';
import './styles.scss';

// Lazada
import { getListShopProfile, getconnectLazada, connectLazada, DisconnectLazada } from './helpers/call-api-lazada';

// Shopee
import { connectShopee, DisconnectShopee, saveShopeeToken } from './helpers/call-api-shopee';
import FacebookConnect from './Components/Facebook/FacebookConnect';

const SellerStore = () => {
  const [params, setParams] = useState({
    itemsPerPage: 25,
    is_active: 1,
  });

  const dispatch = useDispatch();
  const [codeAuthen, setCodeAuthen] = useState(null);
  const [codeAuthenShopee, setCodeAuthenShopee] = useState(null);
  const [loadingPdf, setloadingPdf] = useState(false);
  const history = useHistory();

  const [dataList, setDataList] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [listLazada, setListLazada] = useState([]);
  const [listShopee, setListShopee] = useState([]);

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

  useEffect(() => {
    dispatch(triggerSidebar());
  }, []);

  useEffect(() => {
    window.addEventListener(
      'storage',
      (_c) => {
        let code = localStorage.getItem('code_shopee');
        if (!!code) {
          setCodeAuthenShopee(JSON.parse(code));
        }
      },
      false,
    );
  }, []);

  useEffect(() => {
    if (codeAuthenShopee) {
      handleSaveShopeeToken();
    }
  }, [codeAuthenShopee]);

  const loadingDataShop = useCallback(() => {
    setLoading(true);
    getListShopProfile(params)
      .then((res) => {
        let { data = {} } = res || {};
        let { listLazada = [], listShopee = [] } = data || {};
        setListLazada(listLazada);
        setListShopee(listShopee);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  useEffect(loadingDataShop, [loadingDataShop]);

  // Thêm kết nối Lazada
  const handleconnectLazada = async (e) => {
    try {
      setloadingPdf(true);
      let res = await getconnectLazada();
      let { path = '' } = res || {};
      window.open(path, '_blank', 'location=yes,height=765,width=1280,scrollbars=yes,status=yes', false);
      setloadingPdf(false);
    } catch (error) {
      showToast.error(error ? error.message : 'Có lỗi xảy ra');
      setloadingPdf(false);
    }
  };

  //Thêm kết nối Shopee
  const handleConnectShopee = async (e) => {
    try {
      setloadingPdf(true);
      let result = await connectShopee();
      let { path = null } = result;
      if (!!path) {
        window.open(path, '_blank', 'location=yes,height=765,width=1280,scrollbars=yes,status=yes', false);
      }
      setloadingPdf(false);
    } catch (error) {
      showToast.error(error ? error.message : 'Có lỗi xảy ra');
      setloadingPdf(false);
    }
  };

  const saveLazadaToken = async () => {
    try {
      setloadingPdf(true);
      let result = await connectLazada({ code: codeAuthen });
      // dispatch({ type: 'SHOP', payload: result });
      setCodeAuthen(null);
      setParams({
        page: 1,
        itemsPerPage: 25,
      });
      showToast.success(`Kết nối gian hàng thành công`);

      setloadingPdf(false);
    } catch (error) {
      showToast.error(error ? error.message : 'Có lỗi xảy ra');
      setloadingPdf(false);
    } finally {
      localStorage.setItem('code', '');
    }
  };

  const handleSaveShopeeToken = async () => {
    try {
      setloadingPdf(true);
      let result = await saveShopeeToken({ ...codeAuthenShopee });
      // dispatch({ type: 'SHOP', payload: result });
      setCodeAuthenShopee(null);
      setParams({
        page: 1,
        itemsPerPage: 25,
      });
      showToast.success(`Kết nối gian hàng thành công`);
      setloadingPdf(false);
    } catch (error) {
      showToast.error(error ? error.message : 'Có lỗi xảy ra');
      setloadingPdf(false);
    } finally {
      localStorage.setItem('code_shopee', '');
    }
  };

  // Hủy kết nối Lazada
  const handleDisconnectLazada = async (e) => {
    try {
      setloadingPdf(true);
      let result = await DisconnectLazada(e);
      showToast.success(`Hủy kết nối gian hàng thành công`);
      setParams({
        page: 1,
        itemsPerPage: 25,
      });
      setloadingPdf(false);
    } catch (error) {
      setloadingPdf(false);
      showToast.error(error ? error.message : 'Có lỗi xảy ra!');
    }
  };

  // Hủy kết nối Lazada
  const handleDisconnectShopee = async (e) => {
    try {
      setloadingPdf(true);
      let result = await DisconnectShopee();
      let { path = null } = result;
      if (!!path) {
        window.open(path, '_blank', 'location=yes,height=765,width=1280,scrollbars=yes,status=yes', false);
      }
      setloadingPdf(false);
      setParams({
        page: 1,
        itemsPerPage: 25,
      });
      setloadingPdf(false);
    } catch (error) {
      setloadingPdf(false);
      showToast.error(error ? error.message : 'Có lỗi xảy ra');
    }
  };

  const handleManagerLazada = (shop) => {
    let { shop_id = null } = shop || {};
    history.push(`/seller-store-connect/manage-lazada/${shop_id}`);
  };

  const handleManagerShopee = (shop) => {
    let { shop_id = null } = shop || {};
    history.push(`/seller-store-connect/manage-shopee/${shop_id}`);
  };

  return (
    <React.Fragment>
      {loadingPdf && (
        <BWLoadingPage
          style={{
            position: 'absolute',
            top: '0',
            right: '0',
            width: '100%',
            opacity: '0.5',
            zIndex: '20',
            height: '100%',
          }}
        />
      )}
      <div className='bw_main_wrapp'>
        <div className='bw_row'>
          <div className='bw_col_3'>
            <div className='bw_control_form'>
              <h1 className='bw_title_card'>Liên kết bán hàng</h1>
              <p>Chọn hình thức và kết nối bán hàng</p>
            </div>
          </div>
          <div className='bw_col_9 bw_pb_6'>

            <FacebookConnect />

            <div className='bw_items_frm bw_conn_shopee'>
              <div className='bw_collapse'>
                <div className='bw_head_connect'>
                  <img src={logoShopee} alt='Shopee' />
                  <a
                    href='#'
                    onClick={(e) => {
                      e.preventDefault();
                      handleConnectShopee();
                    }}
                    className='bw_btn'>
                    Thêm liên kết
                  </a>
                </div>
                <div className='bw_main_conn bw_table_responsive'>
                  <ContainerList
                    list={listShopee}
                    onDisconnect={handleDisconnectShopee}
                    handleManager={handleManagerShopee}
                  />
                </div>
              </div>
            </div>

            <div className='bw_items_frm bw_conn_lazada'>
              <div className='bw_collapse'>
                <div className='bw_head_connect'>
                  <img src={logoLazada} alt='Lazada' />
                  {/* <a href="#!" className="bw_btn">Thêm liên kết</a> */}
                  <button className='bw_btn' onClick={(e) => handleconnectLazada(e)}>
                    Thêm liên kết
                  </button>
                </div>
                <div className='bw_main_conn bw_table_responsive'>
                  <ContainerList
                    list={listLazada}
                    onDisconnect={handleDisconnectLazada}
                    handleManager={handleManagerLazada}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SellerStore;
