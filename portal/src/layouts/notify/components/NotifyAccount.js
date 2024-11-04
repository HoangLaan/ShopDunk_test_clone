import React, { useCallback, useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import useScroll from 'hooks/use-scroll';
import classNames from 'classnames';
import styled from 'styled-components';
import Loading from 'components/shared/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { getNotifyByUser, updateReadNotify } from 'services/global.service';
import { hideNotify, isCallNotify } from 'actions/global';
import types from 'actions/types';

const List = styled.div`
  height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
  a,
  h3 {
    line-height: 1;
  }
`;

const style = {
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '16px',
  fontWeight: '700',
  color: 'silver',
};

const NotifyAccount = ({ setCountNoti }) => {
  const dispatch = useDispatch();
  const ref = useRef();
  const [data, setData] = useState([]);
  const [isScroll] = useScroll(ref);
  const [stopScroll, setStopScroll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const { typeNotify } = useSelector((state) => state.global);

  const loadNotify = useCallback(() => {
    setLoading(true);
    getNotifyByUser(page).then((data) => {
      if (data?.items.length === 0) {
        setStopScroll(true);
        setLoading(false);
        return;
      }
      setCountNoti(data?.items?.filter((item) => !item.is_read)?.length);
      setData((prev) => _.concat(prev, data?.items));
      setLoading(false);
    });
  }, [page]);
  useEffect(loadNotify, [loadNotify]);

  useEffect(() => {
    if (isScroll && !loading && !stopScroll) {
      setPage((prev) => prev + 1);
    }
  }, [isScroll, loading, stopScroll]);

  const handleUpdateRead = (id) => {
    updateReadNotify(id).then((resp) => {});
  };

  const changeTabTaskDetail = (data) => {
    if(!data?.task_detail_id && data?.notify_title?.includes("phép")){
      return window._$g.rdr(`/off-work-add`);
    }
    if(data?.order_id){
      return window._$g.rdr(`/orders/detail/${data?.order_id}?tab_active=information`);
    }
    window._$g.rdr(`/task/detail/${data?.task_detail_id}?currWFlow=${data?.task_work_flow_id}`);
  };

  return (
    <React.Fragment>
      {data?.length > 0 ? (
        <List ref={ref}>
          {data?.map((o) => (
            <a
              onClick={(e) => {
                changeTabTaskDetail(o);
                handleUpdateRead(o?.notify_user_id);
                dispatch(hideNotify());
                e.preventDefault();
              }}
              className={classNames('bw_list_items', {
                bw_non_read: !o?.is_read,
              })}>
              <span className={`fi ${typeNotify?.icon}`}></span>
              <h3>{o?.notify_title}</h3>
              <span>
                <b>{o?.notify_content}</b> - {o?.receive_date}
              </span>
            </a>
          ))}
          {loading && <Loading />}
        </List>
      ) : (
        <List ref={ref}>
          <span style={style}>Bạn không có thông báo nào</span>
        </List>
      )}
    </React.Fragment>
  );
};

export default NotifyAccount;
