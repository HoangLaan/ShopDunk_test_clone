import moment from "moment";
import React, { useState, useCallback, useEffect } from "react";
import AudioPlayer from 'react-h5-audio-player';
import { getListCdrs } from 'services/voip.services';
import { Empty } from 'antd';

const HistoryCall = ({ phone_number }) => {

  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 5,
    phone: phone_number
  });

  const [dataList, setDataList] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  useEffect(() => {
    if (params?.phone) {
      getListCdrs(params)
        .then(setDataList)
        .finally(() => {
        });
    }
  }, [params]);

  return <>
    <ul>
      {(items ?? []).length > 0 ? (items ?? [])?.map((value, index) => {
        return <li key={index}>
          <span>{moment.utc(value?.time_started).format('HH:mm:ss - DD/MM/YYYY')}<span>
            {value?.recording_url && <AudioPlayer
              style={{
                marginTop: '5px'
              }}
              src={value?.recording_url}
            />}
          </span></span></li>
      }) : <Empty description='Không có dữ liệu' image={Empty.PRESENTED_IMAGE_SIMPLE} />}
    </ul>
    {items.length > 0 && <div style={{
      margin: '0 auto'
    }} className="bw_col_6">
      <div className="bw_nav_table">
        <button
          disabled={page === 1}
          onClick={(e) => {
            if (params !== 1) {
              setParams((prev) => ({
                ...prev,
                page: parseInt(page) - 1
              }))
            }
          }}
          className={page > 1 ? "bw_active" : ""}
        ><span className="fi fi-rr-angle-small-left">
          </span>
        </button>
        <button
          className={params?.page === totalPages ? '' : "bw_active"}
          onClick={(e) => {
            if (params?.page !== totalPages) {
              setParams((prev) => ({
                ...prev,
                page: parseInt(page) + 1
              }))
            }
          }}><span className="fi fi-rr-angle-small-right"></span></button>
      </div>
    </div >}
  </>
}

export default HistoryCall