import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../assets/styles.scss';
import { layoutFullWidthHeight } from 'pages/SaleChannelFacebook/utils/html';
import BoardNew from './BoardNew';
import fbActions from '../actions';

layoutFullWidthHeight();

const Board = () => {
  const dispatch = useDispatch();
  const { listPageConnect } = useSelector((state) => state.scfacebook);
  const { pageConnect: pageSelected } = useSelector((state) => state.scFacebookPerTist);

  const loadListHashTag = useCallback(() => {
    dispatch(fbActions.getListHashTag());
  }, [dispatch]);
  useEffect(loadListHashTag, [loadListHashTag]);

  const loadListPage = useCallback(() => {
    if (Array.isArray(listPageConnect) && listPageConnect.length > 0)
      if (!pageSelected) dispatch(fbActions.setPageConnect(listPageConnect[0]));
  }, [listPageConnect, pageSelected]);
  useEffect(loadListPage, [loadListPage]);

  return (
    <div key={`view-facebook-board`} className='animated fadeIn sc-facebook'>
      <BoardNew />
    </div>
  );
};

export default Board;
