import React, { useCallback, useEffect } from 'react';
import logoFB from 'assets/bw_image/fb.png';
import ContainerList from '../ContainerList';
import fbActions from 'pages/SaleChannelFacebook/actions';
import { useDispatch, useSelector } from 'react-redux';
import grapql from 'pages/SaleChannelFacebook/actions/grapql';

function FacebookConnect() {
  const dispatch = useDispatch();
  const { loginError, authResponse, getPageList } = useSelector((state) => state.scFacebookPerTist);
  const { data: getPageData } = getPageList;
  const {listPageConnect} = useSelector(state => state.scfacebook);

  const loadFanpageWithFacebook = useCallback(() => {
    if (authResponse) {
      dispatch(
        grapql.getFanpage({
          access_token: authResponse?.accessToken,
        }),
      );
    }
  }, [authResponse]);
  useEffect(loadFanpageWithFacebook, [loadFanpageWithFacebook]);


  const gotoBoard = useCallback(() => {
    if (getPageData?.length && authResponse?.accessToken) {
      dispatch(
        fbActions.facebookSyncPage({
          page_ids: getPageData.map((_) => _.id),
          user_id: authResponse?.userID,
          user_access_token: authResponse?.accessToken,
        }),
      );
    }
  }, [getPageData, authResponse]);
  useEffect(gotoBoard, [gotoBoard]);


  return (
    <div className='bw_items_frm bw_conn_facebook'>
      <div className='bw_collapse'>
        <div className='bw_head_connect'>
          <img src={logoFB} alt='Facebook' />
          {!!listPageConnect?.length && <a
            href='#'
            onClick={async (e) => {
              e.preventDefault();
              await dispatch(fbActions.deletePageConnect());
            }}
            className='bw_btn'>
            Đồng bộ lại
          </a>}
          {!!!listPageConnect?.length && <a
            href='#'
            onClick={async (e) => {
              e.preventDefault();
              await dispatch(fbActions.login());
            }}
            className='bw_btn'>
            Đồng bộ trang
          </a>}
        </div>
        <div className='bw_main_conn bw_table_responsive'>
          <ContainerList
            is_facebook={true}
            list={[]}
            // onDisconnect={handleDisconnectShopee}
            // handleManager={handleManagerShopee}
          />
        </div>
      </div>
    </div>
  );
}

export default FacebookConnect;
