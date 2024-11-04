import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import { getOptionStock, updateStocksId } from '../helpers/call-api-lazada';
import { showToast } from 'utils/helpers';
import { Tooltip } from 'antd';
import fbActions from 'pages/SaleChannelFacebook/actions';
import SCFacebook from 'pages/SaleChannelFacebook/actions/index';

const ContainerList = (props) => {
  const history = useHistory();
  const methods = useForm();
  let { is_facebook = false, list = [], onDisconnect, handleManager } = props;

  const dispatch = useDispatch();
  const {listPageConnect} = useSelector(state => state.scfacebook);

  const loadFacebookConnect = useCallback(() => {
    dispatch(fbActions.getListPageConnect());
  }, [dispatch]);
  useEffect(loadFacebookConnect, [loadFacebookConnect]);

  const renderHeader = () => {
    return is_facebook ? (
      <thead>
        <th className='bw_text_center'>STT</th>
        <th>Trang của bạn</th>
        <th className='bw_text_center'>Trạng thái</th>
        <th className='bw_text_center'>Thao tác</th>
      </thead>
    ) : (
      <thead>
        <th className='bw_text_center'>STT</th>
        <th className='bw_text_center' style={{ width: '25vw' }}>
          Tên gian hàng
        </th>
        <th className='bw_text_center' style={{ width: '25vw' }}>
          Tên Kho hàng
        </th>
        <th className='bw_text_center' style={{ width: '5vw' }}>
          Thao tác
        </th>
      </thead>
    );
  };

  const handleOrder = (shop) => {
    let { shop_id = null } = shop || {};
    history.push(`/seller-store-connect/lazada-order/${shop_id}`);
  };

  const changeFacebookPage = (e, page) => {
    e?.preventDefault();
    dispatch(SCFacebook.setPageConnect(page));
    window._$g.rdr('/sale-channel-facebook')
  }

  const renderBody = () => {
    return is_facebook ? (
      <>
        <tbody>
          {(listPageConnect || []).map((pageItem, index) => {
            return (
              <tr>
                <td className='bw_text_center'>{index + 1}</td>
                <td>
                  <div className='bw_inf_pro'>{pageItem.page_name}</div>
                </td>
                <td className='bw_text_center bw_green'>
                  <i className='fi fi-rr-check'></i>
                  Đã đồng bộ
                </td>
                <td className='bw_text_center'>
                  <a href='/#' className='bw_btn_table bw_green' onClick={e => changeFacebookPage(e, pageItem)}>
                    <i className='fi fi-rr-eye'></i>
                  </a>
                </td>
              </tr>
            )
          })}
        </tbody>
      </>
    ) : (
      <>
        <tbody>
          {(list || []).map((item, index) => {
            let stt = index + 1;
            return (
              <>
                <tr key={`profile_shope_${item?.shop_id}_${index}`}>
                  <td className='bw_text_center'>{stt}</td>
                  <td>
                    <div className='bw_inf_pro bw_justify_content_center '>{item?.shop_name}</div>
                  </td>
                  <td>
                    <div className='bw_inf_pro bw_justify_content_center '>
                      {item?.stocks_code || ''} {item?.stocks_name || ''}
                    </div>
                  </td>
                  {/* <td>
                      <div className="bw_inf_pro">
                        <FormDebouneSelect
                          field='stock_id'
                          id='stock_id'
                          options={optionsStock}
                          allowClear={true}
                          style={{ width: '100%' }}
                          fetchOptions={fetchStockOpts}
                          debounceTimeout={500}
                          placeholder={"-- Chọn Kho đồng bộ--"}
                          onChange={(e) => handleChangeStocks(e, item )}
                        />
                      </div>
                    </td> */}
                  {/* <td className={(item?.is_sync_order) ? `bw_text_center bw_green` : `bw_text_center bw_red`}>
                      {
                        item?.is_sync_order ? <i class="fi fi-rr-check"></i> : <i class="fi fi-rr-cross-small"></i>
                      }
                    </td>
                    <td className={(item?.is_sync_product) ? `bw_text_center bw_green` : `bw_text_center bw_red`}>
                      {
                        item?.is_sync_product ? <i class="fi fi-rr-check"></i> : <i class="fi fi-rr-cross-small"></i>
                      }
                    </td>
                    <td className={(item?.is_sync_order && item?.is_sync_product) ? `bw_text_center bw_green` : `bw_text_center bw_red`}>
                      {
                        (item?.is_sync_order && item?.is_sync_product) ? <i class="fi fi-rr-check"></i> : <i class="fi fi-rr-cross-small"></i>
                      }
                    </td> */}
                  <td className='bw_text_center'>
                    <Tooltip placement='bottom' title={'Quản lý đơn hàng'}>
                      <a
                        onClick={(e) => {
                          e.preventDefault();
                          handleManager(item);
                        }}
                        className='bw_btn_table bw_green'
                        style={{ marginRight: '3px' }}>
                        <i className='fi-rr-cube'></i>
                      </a>
                    </Tooltip>
                    <Tooltip placement='bottom' title={'Xóa đơn hàng'}>
                      <a
                        onClick={(e) => {
                          e.preventDefault();
                          onDisconnect(item);
                        }}
                        className='bw_btn_table bw_delete bw_red'>
                        <i className='fi fi-rr-cross-small'></i>
                      </a>
                    </Tooltip>
                    {/* <a onClick={e => {
                        e.preventDefault()
                        handleOrder(item)
                      }} className="bw_btn_table bw_blue" style={{ marginRight: '3px' }}>
                        <i className="fi-rr-shopping-cart"></i>
                      </a> */}
                  </td>
                </tr>
              </>
            );
          })}
        </tbody>
      </>
    );
  };

  return (
    <FormProvider {...methods}>
      <React.Fragment>
        <table className='bw_table'>
          {renderHeader()}
          {renderBody()}
        </table>
      </React.Fragment>
    </FormProvider>
  );
};

export default ContainerList;
