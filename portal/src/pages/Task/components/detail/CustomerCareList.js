import React from 'react';
import styled from 'styled-components';

import BWImage from 'components/shared/BWImage/index';
import moment from 'moment';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import BWButton from 'components/shared/BWButton/index';
import { Empty } from 'antd';

const CustomStyle = styled.div`
  border: 1px dashed var(--borderColor);
  border-radius: 5px;
  padding: 10px;
  background: var(--whiteColor);
  margin-top: 10px;

  h4 {
    font-size: 15px;
    margin-bottom: 3px;
  }

  p {
    margin-top: 7px;
  }

  span {
    font-size: 14px;
    color: var(--mainColor);
    text-decoration: underline;
  }

  p span {
    padding: 0px 8px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    border: 1px solid var(--borderColor);
    font-size: 16px;
    color: var(--blackColor);
  }

  ul {
    display: flex;
    flex-wrap: wrap;
  }

  ul li {
    width: 50%;
    padding: 4px 0;
  }

  .mail_wrapper {
    display: flex;
    gap: 40px;
    align-items: center;
  }

  .product_list {
    border: 1px solid var(--borderColor);
    padding-bottom: 10px;
  }

  .product_list div {
    display: flex;
    align-items: center;
    margin-top: 10px;
  }

  .product_list img {
    max-width: 40px;
    max-height: 40px;
    margin: 0 10px;
  }
`;

const TABS = {
  ALL: { name: 'Tất cả', value: 0 },
  CARESTATUS: { name: 'Trạng thái chăm sóc', value: 1 },
  SMS: { name: 'SMS', value: 2 },
  CALL: { name: 'Call', value: 3 },
  APPOINTMENT: { name: 'Lịch hẹn', value: 4 },
  EMAIL: { name: 'Email', value: 5 },
  FAVORITEPRODUCT: { name: 'Sản phẩm quan tâm', value: 6 },
};

function CustomerCareList({ items, page, totalPages, setParams, currHistoryTab, setCurrHistoryTab }) {
  return (
    <React.Fragment>
      <h3 className='bw_mt_2 bw_title_page'>Lịch sử</h3>
      <ul className='bw_tabs'>
        {Object.values(TABS).map((item, index) => (
          <li className={currHistoryTab === item.value ? 'bw_active' : ''} key={index}>
            <a
              href='/'
              className='bw_link'
              onClick={(e) => {
                setCurrHistoryTab(item.value);
                e.preventDefault();
              }}>
              {item.name}
            </a>
          </li>
        ))}
      </ul>

      {Array.isArray(items) && items.length ? (
        <>
          {items.map((item, index) => {
            switch (item.tab) {
              case TABS.CARESTATUS.value: {
                return (
                  <CustomStyle>
                    <h4>
                      Trạng thái thay đổi {item.created_date} bởi [{item.created_user}]
                    </h4>
                    {/* <span>{'Chăm sóc khách walkin'}</span> */}
                    <p>
                      {item.task_workflow_old_name && <><span>{item.task_workflow_old_name}</span> -&gt;</>}
                      {item.task_workflow_name && <span>{item.task_workflow_name}</span>}
                    </p>
                  </CustomStyle>
                );
              }

              case TABS.SMS.value: {
                return (
                  <CustomStyle>
                    <h4>
                      <b>SMS</b> {item.created_date} bởi [{item.created_user}]
                    </h4>
                    {/* <span>{'Chăm sóc khách walkin'}</span> */}
                    {/* <p>Đến: {'123'}</p> */}
                    <p>Nội dung: {item.content_sms}</p>
                  </CustomStyle>
                );
              }

              case TABS.CALL.value: {
                return (
                  <CustomStyle>
                    <h4>
                      <b>Call</b> {item.created_date} bởi [{item.created_user}]
                    </h4>
                    {/* <span>Chăm sóc khách walkin</span> */}
                    <ul>
                      {/* <li>Loại cuộc gọi: {item.call_type}</li> */}
                      {/* <li>Chủ đề: {item.subject}</li> */}
                      {/* <li>Mô tả: {item.description}</li> */}
                      <li>Bắt đầu: {item.time_started ? moment(item.time_started).format('DD/MM/YYYY HH:mm'): ''}</li>
                      <li>Kết thúc: {item.time_ended? moment(item.time_ended).format('DD/MM/YYYY HH:mm'): ''}</li>
                      <li>Đổ chuông: {moment(item.time_ringging).format('DD/MM/YYYY HH:mm')}</li>
                      <li>Nhấc máy: {moment(item.time_answered).format('DD/MM/YYYY HH:mm')}</li>
                      <li>Tổng thời gian gọi: {item?.billsec}</li>
                      {item?.file_record && (
                        <AudioPlayer
                          src={item?.file_record}
                        // other props here
                        />
                      )}
                    </ul>
                  </CustomStyle>
                );
              }

              case TABS.APPOINTMENT.value: {
                return (
                  <CustomStyle>
                    <h4>
                      <b>Lịch hẹn</b> {item.created_date} bởi [{item.created_user}]
                    </h4>
                    {/* <span>{'Chăm sóc khách walkin'}</span> */}
                    <li>Bắt đầu: {item.event_start_date_time ? moment(item.event_start_date_time).format('DD/MM/YYYY HH:mm'): ''}</li>
                    <li>Kết thúc: {item.event_end_date_time? moment(item.event_end_date_time).format('DD/MM/YYYY HH:mm'): ''}</li>
                    <p>Nội dung: {item.content_meeting}</p>
                    <p>Địa chỉ: {item.location}</p>
                  </CustomStyle>
                );
              }

              case TABS.EMAIL.value: {
                return (
                  <CustomStyle>
                    <h4>
                      <b>Email</b> {item.created_date} bởi [{item.created_user}]
                    </h4>
                    <span>{item.campaign_name}</span>
                    <p>Nhà cung cấp: MailChimp</p>
                    <div className='mail_wrapper'>
                      <p>Từ: {item.sender_email}</p>
                      <p>Đến: {item.list_name}</p>
                    </div>
                    <p>Tên hiển thị: {item.sender_name}</p>
                    <p>Phản hồi tới: {item.status}</p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <p>Xem nội dung </p>
                      <BWButton
                        onClick={() => {
                          if (item.email_history_id) {
                            window._$g.rdr(`/email-history/detail/${item.email_history_id}`);
                          }
                        }}
                        content='Xem'
                      />
                    </div>
                  </CustomStyle>
                );
              }

              case TABS.FAVORITEPRODUCT.value: {
                return (
                  <CustomStyle>
                    <h4>
                      <b>Sản phẩm</b> {item.created_date} bởi [{item.created_user}]
                    </h4>
                    {/* <span>{'Chăm sóc khách walkin'}</span> */}
                    <p>Quan tâm sản phẩm:</p>
                    <div className='bw_row product_list'>
                      {Array.isArray(item.care_product_list) && item.care_product_list.length
                        ? item.care_product_list.map((product) => {
                          return (
                            <div className='bw_col_12'>
                              <BWImage src={product.picture_url} />
                              <a href={`product/detail/${product.product_id}`}>{product.product_name}</a>
                            </div>
                          );
                        })
                        : null}
                    </div>
                  </CustomStyle>
                );
              }
              default: {
                return null;
              }
            }
          })}

          {totalPages > 1 ? (
            <div className='bw_pagination bw_mt_2'>
              <div className='bw_pagination_action'>
                <button
                  className='bw_btn bw_btn_outline bw_btn_sm'
                  onClick={() => {
                    if (page > 1) {
                      setParams((prev) => ({ ...prev, page: prev.page - 1 }));
                    }
                  }}>
                  <i className='fa fa-chevron-left'></i>
                </button>

                <span style={{ margin: '0 6px' }}>
                  {page} / {totalPages}
                </span>

                <button
                  className='bw_btn bw_btn_outline bw_btn_sm'
                  onClick={() => {
                    if (page < totalPages) {
                      setParams((prev) => ({ ...prev, page: prev.page + 1 }));
                    }
                  }}>
                  <i className='fa fa-chevron-right'></i>
                </button>
              </div>
            </div>
          ) : null}
        </>
      ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có dữ liệu' />}
    </React.Fragment>
  );
}

export default CustomerCareList;
