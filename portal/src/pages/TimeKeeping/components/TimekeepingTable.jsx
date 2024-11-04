import React, { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { Pagination, Empty, notification } from 'antd';
import styled from 'styled-components';
import debounce from 'lodash/debounce';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import ItemTimeKeeping from './ItemTimeKeeping';
import BWImage from 'components/shared/BWImage/index';
import ConfirmTimeKeeping from './ConfirmTimeKeeping';
import { getTimeKeeping } from '../actions/actions';
import { useDispatch, useSelector } from 'react-redux';
import ModelTimeKeeping from './ModelTimeKeeping';
import ModalAddUserSchedule from './Modal/ModalAddUserSchedule';

dayjs.extend(customParseFormat);

const PaginationStyled = styled(Pagination)`
  display: flex;
  justify-content: right;

  margin-top: 20px;
  .ant-pagination-item-link {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  @media screen and (max-width: 1024px) {
    .ant-pagination-total-text {
      width: 50%;
    }
    .ant-pagination-simple-pager {
      width: 20%;
    }
  }

  @media screen and (min-width: 1025px) {
    .ant-pagination-total-text {
      width: 70%;
    }
    .ant-pagination-simple-pager {
      width: 10%;
    }
  }
  .ant-pagination-prev,
  .ant-pagination-next {
    height: auto !important;
    line-height: 3 !important;
    width: 5%;
  }
`;

const TimekeepingTable = (props) => {
  const dispatch = useDispatch();
  const { query: params } = useSelector((state) => state.timeKeeping);
  const { data, listDate = [], loadTimeKeeping, setSelected, selected } = props;

  const [isModelViewMoreItem, setIsModelViewMoreItem] = useState(false);
  const [isModelConFirm, setIsModelConFirm] = useState(false);
  const [keepingConfirm, setKeepingConfirm] = useState({});
  const [timeKeepingMore, setTimeKeepingMore] = useState([]);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [selectModal, setSelectModal] = useState({});

  const handleModelConfirm = (_keeping) => {
    // kiểm tra nếu model được mở từ danh sách xem nhiều thì đóng model xem nhiều
    if (isModelViewMoreItem) {
      setIsModelViewMoreItem(false);
    }

    setKeepingConfirm(_keeping);
    setIsModelConFirm(true);
  };

  // for (let i = 0; i < listDate.length; i++) {
  //   if (listDate[i].isHoliday == true) console.log(listDate[i].title);
  // }
  // mở model xem dữ liệu cho những ngày có nhiều ca làm việc
  const handleShowMore = async (_keeping) => {
    setTimeKeepingMore(_keeping);
    setIsModelViewMoreItem(true);
  };

  const handleSelectedAll = ({ target: { checked } }) => {
    let _selected = {};
    if (checked) {
      _selected = { ...selected };
      data.map((_item) => {
        _selected[_item?.user_name] = _item;
      });
    }
    setSelected(_selected);
  };

  const handleSelected = (valueRender, checked) => {
    let _selected = { ...selected };

    if (checked) {
      _selected[valueRender?.user_name] = valueRender;
    } else {
      delete _selected[valueRender?.user_name];
    }

    setSelected(_selected);
  };

  const handleSearch = useMemo(() => {
    const loadKeyWord = (keyword) => {
      dispatch(getTimeKeeping({ ...params, keyword: keyword }));
    };
    return debounce(loadKeyWord, 700);
  }, [params]);

  const totalChecked = data.filter((_user) => selected[_user?.user_name]).length;

  const handleOpenModalAdd = (user, day) => {
    const curent_date = dayjs();
    if (curent_date <= dayjs(day, 'DD/MM/YYYY')) {
      setSelectModal({ user: user, day: day });
      setOpenModalAdd(true);
    } else {
      notification.warning({
        message: 'Chọn ngày lớn hơn thời gian hiện tại',
      });
    }
  };

  return (
    <React.Fragment>
      <div className='bw_box_card bw_mt_1'>   {/* ChungLD: Sửa class bw_mb_2 thành bw_mb_1 */}
        <div className='bw_table_responsive'>
          <table className='bw_table bw_border_top bw_table_timekeeping'>
            <thead>
              <tr>
                <td className='bw_sticky bw_check_sticky' style={{ padding: '6px 12px' }}>
                  <label className='bw_checkbox'>
                    <input
                      type='checkbox'
                      checked={totalChecked > 0 && totalChecked == data.length ? true : false}
                      onChange={handleSelectedAll}
                    />
                    <span></span>
                  </label>
                </td>
                <td className='bw_sticky bw_name_sticky'>
                  <div className='bw_search'>
                    <div>
                      <input
                        className='bw_inp bw_inp_success'
                        placeholder='Họ tên, mã nhân viên'
                        onChange={({ target: { value } }) => handleSearch(value)}
                      />
                    </div>
                  </div>
                </td>
                {/*Danh sách ngày đã load */}
                {listDate.length
                  ? listDate.map((_days) => (
                    <td className='bw_text_center' key={_days?.day}>
                      {_days?.title} {_days?.isHoliday ? 'Ngày lễ' : ''}
                    </td>
                  ))
                  : null}
              </tr>
            </thead>
            <tbody>
              {data && data.length ? (
                data.map((_user, idx) => {
                  return (
                    <tr key={_user?.user_name}>
                      <td className='bw_sticky bw_check_sticky' style={{ padding: '6px 12px', zIndex: 2 }}>
                        <label className='bw_checkbox'>
                          <input
                            type='checkbox'
                            onChange={({ target: { checked } }) => handleSelected(_user, checked)}
                            checked={selected[_user?.user_name] ? true : false}
                          />
                          <span></span>
                        </label>
                      </td>
                      <td style={{ zIndex: 2 }} className='bw_sticky bw_name_sticky bw_text_center'>
                        <div className='bw_inf_pro'>
                          <BWImage src={_user?.user_picture_url} />
                          <b>{_user?.user_fullname}</b>
                        </div>
                      </td>
                      {listDate.length
                        ? listDate.map((_days) => {
                          return _user?.listSchedule[_days?.day] ? (
                            <ItemTimeKeeping
                              key={_days?.day}
                              item={_user?.listSchedule[_days?.day]}
                              collaborate={_user?.listWorkSchedule}
                              user={_user}
                              handleModelConfirm={handleModelConfirm}
                              handleShowMore={handleShowMore}
                              handleOpenModalAdd={handleOpenModalAdd}
                            />
                          ) : (
                            <td key={_days?.day} className='bw_text_center'>
                              <ItemTimeKeeping
                                isOff={true}
                                day={_days?.day}
                                user={_user}
                                collaborate={_user?.listWorkSchedule}
                                isHoliday={_days.isHoliday}
                                handleOpenModalAdd={handleOpenModalAdd}
                              />
                            </td>
                          );
                        })
                        : null}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10}>
                    {' '}
                    <Empty description='Không có dữ liệu' />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {data && data.length > 0 ? (
        <PaginationStyled
          simple
          showSizeChanger
          total={props?.total ?? 0}
          defaultCurrent={props?.pageIndex ?? 1}
          current={props?.pageIndex ?? 1}
          defaultPageSize={props?.pageSize ?? 25}
          showTotal={(total) => (
            <div className='bw_show_table_page'>
              <p style={{ paddingTop: '5px' }}>
                Show {props?.pageSize > total ? total : props?.pageSize}/{total} records
              </p>
            </div>
          )}
          onChange={(current, size) => {
            props?.handleChangePage(current, size);
          }}
          onShowSizeChange={(current, size) => props?.handleChangePage(current, size)}
        />
      ) : null}
      {isModelConFirm ? (
        <ConfirmTimeKeeping
          open={isModelConFirm}
          onClose={() => {
            if (timeKeepingMore && timeKeepingMore.length) {
              setIsModelViewMoreItem(true);
            }
            setIsModelConFirm(false);
          }}
          keepingConfirm={keepingConfirm}
        />
      ) : null}

      {isModelViewMoreItem ? (
        <ModelTimeKeeping
          open={isModelViewMoreItem}
          onClose={() => {
            setIsModelViewMoreItem(false);
            setTimeKeepingMore([]);
          }}
          timeKeepingMore={timeKeepingMore}
          handleModelConfirm={handleModelConfirm}
        />
      ) : null}

      {openModalAdd && (
        <ModalAddUserSchedule
          open={openModalAdd}
          selected={selectModal}
          onClose={() => setOpenModalAdd(false)}
          onRefresh={() => loadTimeKeeping()}
        />
      )}
    </React.Fragment>
  );
};

export default TimekeepingTable;
