import React, { useCallback, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { Button, Tag } from 'antd';
import styled from 'styled-components';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import ModalExcuses from './Modal/ModalExcuses';
import { Image } from 'antd';
import CheckAccess from 'navigation/CheckAccess';
import { result } from 'lodash';
import ModalQC from './Modal/ModalQC';
import ModalBrokenShift from './Modal/ModalBrokenShift';
import moment from 'moment';

dayjs.extend(customParseFormat);

//ChungLD: Xóa: height: 120px;
const TimeKeeping = styled.div`
  min-width: 170px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const DotTimeKeeping = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 10px;
  background-color: #00a2ff;
  margin: 5px;
`;

//ChungLD: Đổi: margin: -5px -> margin: 0;
const TagStyle = styled(Tag)`
  height: 100%;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
`;

const ItemTimeKeeping = ({
  item = [],
  user = {},
  day = '',
  collaborate = {},
  isHoliday = [],
  isOff = false,
  handleModelConfirm,
  handleShowMore,
  handleOpenModalAdd,
}) => {
  const [openModalLate, setOpenModalLate] = useState(false);
  const [selectModal, setSelectModal] = useState({});
  const [isOpenModalQC, setIsOpenModalQC] = useState(false);
  const [keepingQC, setKeepingQC] = useState({});
  const [isOpenModalBrokenShift, setIsOpenModalBrokenShift] = useState(false);
  const [keepingBrokenShift, setKeepingBrokenShift] = useState({});
  const [isLate, setIsLate] = useState(1);

  const timeKeeping = (_keeping) => {
    let time_start = _keeping?.time_keeping_time_start ? _keeping?.time_keeping_time_start : '--';
    let url_checkin = _keeping?.url_checkin ? _keeping?.url_checkin : '';
    const checkin_style = {
      width: '20px',
      height: '20px',
      border: '1px solid black',
      borderRadius: '10px',
      marginBottom: '1px'
    };
    //console.log('_keeping',_keeping)
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

  //Compare collaborate day with days in week
  const Collaborate = useMemo(() => {
    const result = collaborate.find(
      (x) =>
        dayjs(x.start_time, 'MM/DD/YYYY') <= dayjs(day, 'DD/MM/YYYY') &&
        dayjs(day, 'DD/MM/YYYY') <= dayjs(x.end_time, 'MM/DD/YYYY'),
    );
    return result;
  });

  const timeCollaborate = (_keeping) => {
    // let start_collaborate_time = _keeping?.start_time ? _keeping?.start_time : '--:--';
    let start_time = dayjs(_keeping?.start_time).format('HH:mm');

    // let end_collaborate_time = _keeping?.end_time ? _keeping?.end_time : '--:--';
    let end_time = dayjs(_keeping?.end_time).format('HH:mm');

    return start_time + ' - ' + end_time;
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
  const showModal = () => {
    setOpenModalLate(true);
  };

  function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 60);
    var m = Math.floor(d % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? ' giờ ' : ' giờ ') : '';
    var mDisplay = m > 0 ? m + (m == 1 ? ' phút ' : ' phút ') : '';

    return hDisplay + mDisplay;
  }

  const checkTimeOff = (date) => {
    let isOff = false;
    for (let i = 0; i < user.listOffWork.length; i++) {
      const start_date = moment(user.listOffWork[i].date_off_from, 'DD/MM/YYYY');
      const end_date = moment(user.listOffWork[i].date_off_to, 'DD/MM/YYYY');
      const dateCheck = moment(date, 'DD/MM/YYYY');
      if (start_date <= dateCheck && dateCheck <= end_date) {
        isOff = true;
        break;
      }
    }
    return isOff;
  };

  const calculateTimeOff = (date) => {
    let totalDate = 0;
    for (let i = 0; i < user.listOffWork.length; i++) {
      const start_date = moment(user.listOffWork[i].date_off_from, 'DD/MM/YYYY');
      const end_date = moment(user.listOffWork[i].date_off_to, 'DD/MM/YYYY');
      const dateCheck = moment(date, 'DD/MM/YYYY');
      if (start_date <= dateCheck && dateCheck <= end_date) {
        totalDate = end_date.diff(start_date, 'days') + 1;
        break;
      }
    }
    return totalDate;
  };

  return (
    <React.Fragment>
      {item.length === 1 && !isOff ? (
        item.map((_keeping) => (
          <td key={_keeping?.schedule_id}>
            <TimeKeeping>
              <Tag style={{ height: '100%', margin: 0, padding: 5 }} color={!_keeping?.is_confirm ? 'cyan' : ''}>{/* ChungLD: Xóa margin: -5; Bổ sung: margin: 0, padding: 5 */}
                <div className='bw_row bw_flex bw_justify_content_between' style={{ margin: '0' }}> {/* ChungLD: Đổi margin: -5px -> margin 0; */}
                  <p> {/* style={{ maxHeight: '15px' }} */}
                    <span style={{ display: 'flex', gap: '10px', marginBottom: '1px' }}>
                      <b>{_keeping?.shift_name}</b>
                      <p>
                        {checkTimeOff(_keeping.shift_date) ? (
                          <p>
                            <Tag color='purple'>P{calculateTimeOff(_keeping.shift_date)}</Tag>
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
                              showModal();
                            }}
                            style={{ padding: 'unset' }}>
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
                              showModal();
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
                      <p>
                        {_keeping?.time_keeping_time_start && !_keeping?.time_keeping_time_end ? (
                          <a
                            onClick={() => {
                              setIsLate(2);
                              showModal();
                            }}
                            style={{ padding: 'unset' }}>
                            <p>
                              <Tag color='pink'>KCR</Tag>
                            </p>
                          </a>
                        ) : (
                          <p></p>
                        )}
                      </p>
                      <p>
                        {!_keeping?.time_keeping_time_start && !_keeping?.time_keeping_time_end ? (
                          <a
                            onClick={() => {
                              setIsLate(3);
                              showModal();
                            }}
                            style={{ padding: 'unset' }}>
                            <p>
                              <Tag color='gray'>KCC</Tag>
                            </p>
                          </a>
                        ) : (
                          <p></p>
                        )}
                      </p>
                    </span>
                  </p>
                </div>
                <p style={{ marginBottom: '1px' }}>
                  Giờ chấm công: <Tag color='volcano'>{timeKeeping(_keeping)}</Tag>
                </p>
                {/* <p>Tổng giờ làm: {calculateTimeDifference(_keeping)}</p> */}
                <p>
                  Giờ xác nhận:{' '}
                  {
                    _keeping?.is_confirm == 1 && !_keeping?.is_lock_confirm ?
                      (
                        (<CheckAccess permission={'HR_USER_TIMEKEEPING_EXPORT'}>
                          <a onClick={() => handleModelConfirm(_keeping)} className='bw_label bw_label_success bw_open_modal'>
                            Xác nhận
                          </a>
                        </CheckAccess>)
                      ) : !_keeping?.is_lock_confirm && 
                        !_keeping?.is_confirm &&
                        (_keeping?.confirm_time_start ||
                        _keeping?.confirm_time_end) ? (
                        <Tag color='cyan'>{_keeping?.confirm_time_start + ' - ' + _keeping?.confirm_time_end}</Tag>
                      ) : (
                        <a className='bw_label bw_label_danger bw_open_modal'>Đã khoá</a>
                      )
                  }
                </p>

                <p>
                  Tổng giờ làm: {calculateTimeDifference(_keeping) ? calculateTimeDifference(_keeping) : 0}
                  <br />
                  {/* Chỉ ca QC mới hiện */}
                  {_keeping.is_check_store ? (
                    <a
                      onClick={() => {
                        setKeepingQC(_keeping);
                        setIsOpenModalQC(true);
                      }}
                      className='bw_label bw_label_success bw_open_modal'>
                      Xem chi tiết QC
                    </a>
                  ) : _keeping?.is_break_shift ? (
                    <a
                      onClick={() => {
                        setKeepingBrokenShift(_keeping);
                        setIsOpenModalBrokenShift(true);
                      }}
                      className='bw_label bw_label_success bw_open_modal'>
                      Xem chi tiết ca gãy
                    </a>
                  ) : null}
                </p>
              </Tag>
            </TimeKeeping>
          </td>
        ))
      ) : item.length > 1 && !isOff ? (
        <td>
          <TimeKeeping onClick={() => handleShowMore(item)}>
            <TagStyle color='orange'>
              {item.length} Ca làm việc
              <div style={{ display: 'flex', flexDirection: 'row', marginTop: 4 }}>
                {item.length
                  ? item.map((_item) => (
                    <DotTimeKeeping
                      style={{
                        backgroundColor: `${!_item?.schedule_id ? '#fff' : _item?.user_confirm ? '#00FF2B' : '#00A2FF'
                          }`,
                      }}
                    />
                  ))
                  : null}
              </div>
            </TagStyle>
          </TimeKeeping>
        </td>
      ) : Collaborate ? (
        collaborate?.map((_keeping) => (
          <td key={_keeping?.user_name}>
            <TimeKeeping>
              <Tag style={{ height: '100%', margin: 0, padding: 5 }} color={!_keeping?.is_confirm ? 'cyan' : ''}> {/* ChungLD: Xóa margin: -5; Bổ sung: margin: 0, padding: 5 */}
                <div className='bw_row bw_flex bw_justify_content_between' style={{ margin: '0' }}> {/* ChungLD: Đổi margin: -5px -> margin 0; */}
                  <p>
                    <b>{_keeping?.work_schedule_name}</b>
                  </p>
                  <p>
                    <Tag color='#108ee9'>Công tác</Tag>
                  </p>
                </div>
                <p>{_keeping?.user_name}</p>
                <p>
                  Giờ chấm công: <Tag color='volcano'>{timeCollaborate(_keeping)}</Tag>
                </p>
                <p>Tổng giờ làm: {_keeping?.total_time_confirm ? secondsToHms(_keeping?.total_time_confirm) : 0}</p>
              </Tag>
            </TimeKeeping>
          </td>
        ))
      ) : isHoliday ? (
        <TimeKeeping onClick={() => handleOpenModalAdd(user, day)}>
          <Tag style={{ height: '100%', margin: -5, backgroundColor: 'pink' }}>Nghỉ lễ</Tag>
        </TimeKeeping>
      ) : (
        <TimeKeeping>
          <Tag
            style={{
              height: '100%',
              margin: 0, // ChungLD: Đổi margin: 5 -> 0
              backgroundColor: isHoliday ? 'pink' : '',
              textAlign: 'center',
              padding: '10px', // ChungLD: Đổi padding: 20px -> 10px
            }}>
            <div style={{ marginBottom: '5px', fontSize: '14px', fontWeight: '600' }}>Không có ca làm việc</div> {/* ChungLD: Đổi style */}
            <Button style={{ fontSize: '13px', fontWeight: '400' }} onClick={() => handleOpenModalAdd(user, day)}> {/* ChungLD: Đổi style */}
              Phân ca làm việc
            </Button>
          </Tag>
        </TimeKeeping>
      )}

      {openModalLate && (
        <ModalExcuses
          isLate={isLate}
          item={item}
          open={openModalLate}
          selected={selectModal}
          onClose={() => setOpenModalLate(false)}
          timeKeeping={timeKeeping}
        />
      )}

      {isOpenModalQC && <ModalQC keepingQC={keepingQC} open={isOpenModalQC} onClose={() => setIsOpenModalQC(false)} />}
      {isOpenModalBrokenShift && (
        <ModalBrokenShift
          keepingBrokenShift={keepingBrokenShift}
          open={isOpenModalBrokenShift}
          onClose={() => setIsOpenModalBrokenShift(false)}
        />
      )}
    </React.Fragment>
  );
};

export default ItemTimeKeeping;
