import React, { useCallback, useState, useEffect } from 'react';
import { deleteItem, getList, updateReview, exportExcel, exportExcelSchedule } from '../helpers/call-api';
import UserScheduleTable from '../components/UserScheduleTable';
import UserScheduleFilter from '../components/UserScheduleFilter';
import { notification } from 'antd';
import { defaultParams, showToast } from '../../../utils/helpers';
import ModalReview from '../components/Modal/ModalReview';
import { getErrorMessage } from 'utils';
import moment from 'moment';

const UserSchedulePage = () => {
  const [loading, setLoading] = useState(true);

  const [params, setParams] = useState({
    page: 1,
    itemsPerPage: 25,
    keyword: '',
    is_active: 1,
    date_from: moment().startOf('month').format('DD/MM/YYYY'),
    date_to: moment().format('DD/MM/YYYY'),
    is_review: 4,
  });

  const [dataUserSchedule, setDataUserSchedule] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });
  const [refreshFlag, setRefreshFlag] = useState(false);
  const { items, limit: itemsPerPage, page, total: totalItems } = dataUserSchedule;
  const [isShowModalReview, setIsShowModalReview] = useState(false);
  const [reviewPayload, setReviewPayload] = useState({});

  const loadUserSchedule = useCallback(() => {
    setLoading(true);
    if (params) {
      getList(params)
        .then((resp) => setDataUserSchedule(resp))
        .finally(() => setLoading(false));
    }
  }, [params]);
  useEffect(loadUserSchedule, [loadUserSchedule]);

  const handleDelete = async (_schedule) => {
    try {
      // Lấy ra vị trí của ca làm việc
      if (Array.isArray(_schedule) && _schedule?.length > 0) {
        const deletePromises = _schedule.map(schedule => deleteItem(schedule));
        await Promise.all(deletePromises);
      } else {
        await deleteItem(_schedule)
      }
      showToast.success('Xóa ca làm việc thành công');
      setRefreshFlag(true)
      loadUserSchedule();
    } catch (error) {
      notification.error({
        message: error.message,
      });
    }
  };
  const onClearParams = (p) => setParams(() => ({ ...defaultParams, ...p }));
  const onChange = (p) => setParams((prev) => ({ ...prev, ...p }));

  const onSubmitReview = async (data) => {
    try {
      await updateReview({ ...data, ...reviewPayload }).then(() => loadUserSchedule());
      setIsShowModalReview(false);
      showToast.success('Duyệt thành công');
    } catch (error) {
      showToast.error(error.message ?? 'Duyệt thất bại');
    }
  };

  const handleExportExcel = () => {
    exportExcel(params)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `DS_Ca_Ho_Tro.xlsx`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        const { message } = err;
        showToast.error(
          getErrorMessage({
            message: message || 'Đã xảy ra lỗi vui lòng kiểm tra lại',
          }),
        );
      })
      .finally(() => { });
  };

  const handleExportExcelSchedule = () => {
    exportExcelSchedule(params)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `DS_Phan_Ca.xlsx`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        const { message } = err;
        showToast.error(
          getErrorMessage({
            message: message || 'Đã xảy ra lỗi vui lòng kiểm tra lại',
          }),
        );
      })
      .finally(() => { });
  };

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <UserScheduleFilter dataUserSchedule={dataUserSchedule} onChange={onChange} onClearParams={onClearParams} initFilter={params} />
        <UserScheduleTable
          onChangePage={(page) => {
            setParams({
              ...params,
              page,
            });
          }}
          data={items}
          totalPages={Math.ceil(totalItems / itemsPerPage)}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          handleDelete={handleDelete}
          loading={loading}
          setReviewPayload={setReviewPayload}
          setIsShowModalReview={setIsShowModalReview}
          handleExportExcel={handleExportExcel}
          handleExportExcelSchedule={handleExportExcelSchedule}
          refreshFlag={refreshFlag}
        />
      </div>

      {isShowModalReview && <ModalReview onSubmit={onSubmitReview} onClose={() => setIsShowModalReview(false)} />}
    </React.Fragment>
  );
};

export default UserSchedulePage;
