import React, { useCallback, useState, useEffect } from 'react';
import TimekeepingFilter from '../components/TimekeepingFilter';
import TimekeepingTable from '../components/TimekeepingTable';
import { exportExcel, getList, updateCofirmTimeKeeping, exportExcelAllUser, exportExcelTimeKeeping } from '../helpers/call-api';
import dayjs from 'dayjs';
import { notification } from 'antd';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isoWeek from 'dayjs/plugin/isoWeek';
import { changeDate, showToast } from 'utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { getTimeKeeping } from '../actions/actions';
import { Tag } from 'antd';
import { useFormContext } from 'react-hook-form';
import Loading from 'components/shared/Loading/index';

dayjs.extend(isoWeek);
dayjs.extend(customParseFormat);

const TimekeepingPage = () => {
  const dispatch = useDispatch();
  const [dateType, setDateType] = useState('isoweek');
  const [listDate, setListDate] = useState([]);
  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(false);
  // const method = useFormContext();

  const { dataTimeKeeping, query: params } = useSelector((state) => state.timeKeeping);

  const { items = [], totalItems, is_lock_confirm, list_holiday } = dataTimeKeeping;
  //console.log('margin-bottom:',is_lock_confirm);
  const loadTimeKeeping = useCallback(() => {
    // Lấy ngày hiện tại
    const curent_date = dayjs();
    // const curent_date = method.watch('current_date');
    let date_from = dayjs(curent_date).startOf(dateType);
    let date_to = dayjs(curent_date).endOf(dateType);

    const new_params = {
      ...params,
      date_from: date_from.format('DD/MM/YYYY'),
      date_to: date_to.format('DD/MM/YYYY'),
    };

    dispatch(getTimeKeeping(new_params));
  }, [dispatch, params]);

  // useEffect(() => {
  //   loadTimeKeeping();
  // }, []);

  const loadArrayDate = useCallback(
    (date) => {
      let days = [];

      let date_from = dayjs(date).startOf(dateType);
      let date_to = dayjs(date).endOf(dateType);
      while (date_from <= date_to) {
        days.push({
          title: `${changeDate(date_from.format('ddd'))} ${date_from.format('DD/MM/YYYY')}`,
          day: `${date_from.format('DD/MM/YYYY')}`,
          isHoliday: (list_holiday || []).some(
            (x) => dayjs(x.start_date) <= date_from && date_from <= dayjs(x.end_date),
          ),
        });
        date_from = date_from.clone().add(1, 'd');
      }

      setListDate(days);
    },
    [dateType, params?.curent_date, list_holiday],
  );

  useEffect(() => {
    loadArrayDate(params?.curent_date);
  }, [loadArrayDate]);

  const handleExportXcel = (type, all = null, timeKeeping = null, timeKeepingIsAll = null) => {
    let users = Object.values(selected);

    let date_from = dayjs(params?.curent_date).startOf(dateType);
    let date_to = dayjs(params?.curent_date).endOf(dateType);
    const _params = {
      ...params,
      date_from: date_from.format('DD/MM/YYYY'),
      date_to: date_to.format('DD/MM/YYYY'),
      type: 3,
    };
    if (all) {
      users = [{ user_name: 'ALL' }, '']
      setLoading(true);
      exportExcel({ query: _params, users })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response?.data]));
          const link = document.createElement('a');
          link.href = url;
          const configDate = dayjs().format('DDMMYYYY_HHmmss');
          link.setAttribute('download', `DS_Cham_Cong_${configDate}.xlsx`);
          document.body.appendChild(link);
          link.click();
        })
        .catch((err) => {
          notification.error({
            message: 'Không có dữ liệu!',
          });
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      if (timeKeepingIsAll) {
        // Xuất công
        users = [{ user_name: 'ALL' }, '']
        setLoading(true);
        exportExcelTimeKeeping({ query: _params, users })
          .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response?.data]));
            const link = document.createElement('a');
            link.href = url;
            const configDate = dayjs().format('DDMMYYYY_HHmmss');
            link.setAttribute('download', `DS_Cham_Cong_${configDate}.xlsx`);
            document.body.appendChild(link);
            link.click();
          })
          .catch((err) => {
            notification.error({
              message: 'Không có dữ liệu!',
            });
          })
          .finally(() => {
            setLoading(false);
          });
      } else if (timeKeeping) {
        if (!users.length) {
          notification.error({
            message: 'Vui lòng chọn nhân viên',
          });
        } else {
          setLoading(true);
          exportExcelTimeKeeping({ query: _params, users })
            .then((response) => {
              const url = window.URL.createObjectURL(new Blob([response?.data]));
              const link = document.createElement('a');
              link.href = url;
              const configDate = dayjs().format('DDMMYYYY_HHmmss');
              link.setAttribute('download', `DS_Cham_Cong_${configDate}.xlsx`);
              document.body.appendChild(link);
              link.click();
            })
            .catch((err) => {
              notification.error({
                message: 'Không có dữ liệu!',
              });
            })
            .finally(() => {
              setLoading(false);
            });
        }
      } else {
        if (!users.length) {
          notification.error({
            message: 'Vui lòng chọn nhân viên',
          });
        } else {
          setLoading(true);
          exportExcel({ query: _params, users })
            .then((response) => {
              const url = window.URL.createObjectURL(new Blob([response?.data]));
              const link = document.createElement('a');
              link.href = url;
              const configDate = dayjs().format('DDMMYYYY_HHmmss');
              link.setAttribute('download', `DS_Cham_Cong_${configDate}.xlsx`);
              document.body.appendChild(link);
              link.click();
            })
            .catch((err) => {
              notification.error({
                message: 'Không có dữ liệu!',
              });
            })
            .finally(() => { setLoading(false); });
        }
      }
    }
  };

  const handleConfirmSchedule = (value) => {
    const users = Object.values(selected);
    if (!users.length) {
      notification.error({
        message: 'Vui lòng chọn nhân viên',
      });
    } else {
      updateCofirmTimeKeeping({ ...value, users })
        .then(() => {
          showToast.success('Xác nhận công thành công');
          loadTimeKeeping(params);
        })
        .catch((error) => {
          showToast.error('Xảy ra lỗi vui lòng thử lại');
        });
    }
  };

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        {loading && <Loading />}
        <TimekeepingFilter
          setDateType={setDateType}
          dateType={dateType}
          handleExportXcel={handleExportXcel}
          users={Object.values(selected)}
          handleConfirmSchedule={handleConfirmSchedule}
          selected={selected}
          isLockConfirm={is_lock_confirm}
        />
        <div className='bw_col_12 bw_flex bw_mt_1'>
          {/* ChungLD: Bổ sung style */}
          Lưu ý:
          <Tag color='purple' style={{ margin: '0 7px 0 7px' }}>Phép + số ngày</Tag>
          <Tag color='#f50'>Muộn</Tag>
          <Tag color='#108ee9'>Công tác</Tag>
          <Tag color='pink'>KCR (Không chấm ra)</Tag>
          <Tag color='gray'>KCC (Không chấm công)</Tag>
        </div>
        <TimekeepingTable
          data={items}
          listDate={listDate}
          loadTimeKeeping={loadTimeKeeping}
          total={totalItems}
          pageIndex={params?.page}
          pageSize={params?.itemsPerPage}
          setSelected={setSelected}
          selected={selected}
          handleChangePage={(page, itemsPerPage) => {
            dispatch(getTimeKeeping({ ...params, page, itemsPerPage }));
          }}
        />
      </div>
    </React.Fragment>
  );
};

export default TimekeepingPage;