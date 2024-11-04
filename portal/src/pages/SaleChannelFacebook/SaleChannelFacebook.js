import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import fbActions from './actions/index';
import { layoutFullWidthHeight } from 'pages/SaleChannelFacebook/utils/html';
import './assets/styles.scss';
import Board from './v2/Board';
import { StyledSaleChannelFacebook } from './utils/styles';

layoutFullWidthHeight();

const SaleChannelFacebook = () => {
  const dispatch = useDispatch();
  const { listPageConnect, listPageConnectLoading } = useSelector((state) => state.scfacebook);
  const flag = Array.isArray(listPageConnect) && listPageConnect.length > 0;

  const loadFacebookConnect = useCallback(() => {
    dispatch(fbActions.getListPageConnect());
  }, [dispatch]);
  useEffect(loadFacebookConnect, [loadFacebookConnect]);

  useEffect(() => {
    return () => {
      dispatch(fbActions.reset());
    }
  }, [])


  return (
    <StyledSaleChannelFacebook>
       <Board />
    </StyledSaleChannelFacebook>
  );
};

export default SaleChannelFacebook;
