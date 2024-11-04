import PropTypes from 'prop-types';

import { Tag } from 'antd';
import styled from 'styled-components';
import React, { useMemo, useState } from 'react';
import ModalExcuses from './Modal/ModalExcuses';
import { Image } from 'antd';
import ModalQC from './Modal/ModalQC';

const TimeKeeping = styled.div`
  min-width: 170px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 8px;
`;

const ModelTimeKeeping = ({ open, onClose, timeKeepingMore = [], handleModelConfirm }) => {
  const [openModalLate, setOpenModalLate] = useState(false);
  const [data, setData] = useState([]);
  const [isLate, setIsLate] = useState(1);

  const isShiftQC = timeKeepingMore.some((i) => i.is_check_store);

  const timeKeeping = (_keeping) => {
    let time_start = _keeping?.time_keeping_time_start ? _keeping?.time_keeping_time_start : '--';
    let url_checkin = _keeping?.url_checkin ? _keeping?.url_checkin : '';
    const checkin_style = {
      width: '15px',
      height: '15px',
      marginRight: '5px',
      border: '1px solid black',
      borderRadius: '10px',
    };

    let time_end = _keeping?.time_keeping_time_end ? _keeping?.time_keeping_time_end : '--';
    let url_checkout = _keeping?.url_checkout ? _keeping?.url_checkout : '';
    const checkout_style = { ...checkin_style, marginLeft: '-5px' };

    return (
      <div>
        {_keeping?.time_keeping_time_start ? (
          <span>
            <a>
              <Image src={url_checkin} style={checkin_style} preview={{ mask: '' }} />
            </a>
          </span>
        ) : (
          <span></span>
        )}
        {time_start} :{' '}
        {_keeping?.time_keeping_time_end ? (
          <span>
            <a>
              <Image src={url_checkout} style={checkout_style} preview={{ mask: '' }} />
            </a>
          </span>
        ) : (
          <span></span>
        )}
        {time_end}
      </div>
    );
  };
  //Calculate working time
  function calculateTimeDifference(_keeping) {
    let time_start = _keeping?.time_keeping_time_start;

    let time_end = _keeping?.time_keeping_time_end;
    if (_keeping?.time_keeping_time_start && _keeping?.time_keeping_time_end) {
      const [startHourStr, startMinuteStr] = time_start.split(':');
      const [endHourStr, endMinuteStr] = time_end.split(':');

      const startHour = parseInt(startHourStr);
      const startMinute = parseInt(startMinuteStr);
      const endHour = parseInt(endHourStr);
      const endMinute = parseInt(endMinuteStr);

      let hourDifference = endHour - startHour;
      let minuteDifference = endMinute - startMinute;

      if (minuteDifference < 0) {
        hourDifference -= 1;
        minuteDifference += 60;
      }

      const resultHour = (hourDifference < 10 ? '0' : '') + hourDifference;
      const resultMinute = (minuteDifference < 10 ? '0' : '') + minuteDifference;

      return `${resultHour} giờ ${resultMinute} phút`;
    } else {
      return '0 giờ 0 phút';
    }
  }

  function calculateConfirmTime(_keeping) {
    let time_start = _keeping?.confirm_time_start;

    let time_end = _keeping?.confirm_time_end;

    if (_keeping?.confirm_time_start && _keeping?.confirm_time_end) {
      const [startHourStr, startMinuteStr] = time_start.split(':');
      const [endHourStr, endMinuteStr] = time_end.split(':');

      const startHour = parseInt(startHourStr);
      const startMinute = parseInt(startMinuteStr);
      const endHour = parseInt(endHourStr);
      const endMinute = parseInt(endMinuteStr);

      let hourDifference = endHour - startHour;
      let minuteDifference = endMinute - startMinute;

      if (minuteDifference < 0) {
        hourDifference -= 1;
        minuteDifference += 60;
      }

      const resultHour = (hourDifference < 10 ? '0' : '') + hourDifference;
      const resultMinute = (minuteDifference < 10 ? '0' : '') + minuteDifference;

      return `${resultHour} giờ ${resultMinute} phút`;
    } else {
      return '0 giờ 0 phút';
    }
  }

  function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 60);
    var m = Math.floor(d % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? ' giờ ' : ' giờ ') : '';
    var mDisplay = m > 0 ? m + (m == 1 ? ' phút ' : ' phút ') : '';

    return hDisplay + mDisplay;
  }

  const showModal = (_keeping) => {
    setOpenModalLate(true);
    setData((prevData) => [_keeping, ...prevData]);
  };

  return (
    <React.Fragment>
      <div className={`bw_modal ${open ? 'bw_modal_open' : ''}`} id='bw_notice_del'>
        <div className='bw_modal_container bw_w800'>
          <div className='bw_title_modal'>
            <h3>Ca làm việc trong ngày</h3>
            <span className='bw_close_modal fi fi-rr-cross-small' onClick={onClose}></span>
          </div>
          <div className='bw_main_modal bw_border_top'>
            <div className='bw_row' style={{ overflowX: 'auto', maxHeight: '45vh' }}>
              {timeKeepingMore && timeKeepingMore.length
                ? timeKeepingMore.map((_keeping, idx) => (
                    <TimeKeeping key={idx} className='bw_col_12'>
                      <Tag style={{ height: '100%' }} color={!_keeping?.is_confirm ? 'cyan' : ''}>
                        <div className='bw_row bw_flex bw_justify_content_between' style={{ margin: '5px' }}>
                          <p>
                            <span style={{ display: 'flex', gap: '10px' }}>
                              <b>{_keeping?.shift_name}</b>
                              <p>
                                {_keeping.listSchedule ? (
                                  <p>
                                    <Tag color='purple'>P{_keeping?.number_of_workday}</Tag>
                                  </p>
                                ) : (
                                  <p></p>
                                )}
                              </p>
                              <p>
                                {_keeping?.time_keeping_time_start > _keeping?.time_start ? (
                                  <a
                                    onClick={() => {
                                      setIsLate(1);
                                      showModal(_keeping);
                                    }}>
                                    <p>
                                      <Tag color='#f50'>Muộn</Tag>
                                    </p>
                                  </a>
                                ) : (
                                  <p></p>
                                )}
                              </p>
                              <p>
                                {_keeping?.time_keeping_time_end < _keeping?.time_end ? (
                                  <a
                                    onClick={() => {
                                      setIsLate(0);
                                      showModal(_keeping);
                                    }}
                                    style={{ padding: 'unset' }}>
                                    <p>
                                      <Tag color='error'>Về sớm</Tag>
                                    </p>
                                  </a>
                                ) : (
                                  <p></p>
                                )}
                              </p>
                            </span>
                          </p>
                        </div>
                        <p>
                          Giờ chấm công: <Tag color='volcano'>{timeKeeping(_keeping)}</Tag>
                        </p>
                        <p>Tổng giờ làm: {calculateTimeDifference(_keeping)}</p>
                        <p>
                          Giờ xác nhận:{' '}
                          {_keeping?.is_confirm == 1 && !_keeping?.is_lock_confirm ? (
                            <a
                              onClick={() => handleModelConfirm(_keeping)}
                              className='bw_label bw_label_success bw_open_modal'>
                              Xác nhận
                            </a>
                          ) : !_keeping?.is_lock_confirm &&
                            !_keeping?.is_confirm &&
                            (_keeping?.confirm_time_start ||
                            _keeping?.confirm_time_end) ? (
                            <Tag color='cyan'>{_keeping?.confirm_time_start + ' - ' + _keeping?.confirm_time_end}</Tag>
                          ) : (
                            // <a className='bw_label bw_label_danger bw_open_modal'>Đã khoá</a>
                            <></>
                          )}
                        </p>
                        <p>Tổng giờ làm: {calculateConfirmTime(_keeping)}</p>
                      </Tag>
                    </TimeKeeping>
                  ))
                : null}
            </div>

            {isShiftQC && <ModalQC keepingQC={timeKeepingMore} open={true} />}
          </div>
          <div className='bw_footer_modal'>
            <button type='button' onClick={onClose} className='bw_btn_outline bw_btn_outline_danger'>
              Đóng
            </button>
          </div>
        </div>
      </div>

      {openModalLate && (
        <ModalExcuses
          item={data}
          open={openModalLate}
          onClose={() => setOpenModalLate(false)}
          timeKeeping={timeKeeping}
          isLate={isLate}
        />
      )}
    </React.Fragment>
  );
};

ModelTimeKeeping.propTypes = {
  open: PropTypes.bool,
  className: PropTypes.string,
  header: PropTypes.node,
  footer: PropTypes.string,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  children: PropTypes.node,
};

export default ModelTimeKeeping;
