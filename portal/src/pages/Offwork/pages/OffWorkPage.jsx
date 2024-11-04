import React, { useCallback, useState, useEffect } from 'react';
import { deleteItem, exportExcelOffWork, getList } from '../helpers/call-api';
import OffWorkTable from '../components/OffWorkTable';
import OffWorkFilter from '../components/OffWorkFilter';
import { notification } from 'antd';
import { defaultPaging, defaultParams, showToast } from 'utils/helpers';
import { getErrorMessage } from 'utils';
import { useForm } from 'react-hook-form';

const OffWorkTypePage = () => {
  const methods = useForm({ defaultValues: { is_active: 1, status: 4 } });
  const [params, setParams] = useState(defaultParams);

  const [dataOffWork, setDataOffWork] = useState(defaultPaging);
  const [loading, setLoading] = useState(true);

  const { items = [], itemsPerPage, page, totalItems, totalPages } = dataOffWork;

  const loadOffWork = useCallback(() => {
    setLoading(true);
    getList(params)
      .then(setDataOffWork)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  useEffect(loadOffWork, [loadOffWork]);

  const handleDelete = async (off_work_type) => {
    // // Lấy ra vị trí của ca làm việc
    deleteItem(off_work_type?.off_work_id)
      .then(() => {
        loadOffWork();

        notification.success({
          message: 'Xoá dữ liệu thành công',
        });
      })
      .catch((error) => {
        let { message } = error;

        if (error.message) {
          notification.error({
            message: message + '',
          });
        }
      });
  };

  const onChange = (params) => {
    setParams((prev) => ({ ...prev, ...params }));
  };

  const handleExportExcel = () => {
    exportExcelOffWork({...methods.watch()})
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `DS_Nghi_Phep.xlsx`);
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
      .finally(() => {});
  };


  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <OffWorkFilter onChange={setParams} methods={methods} />
        <OffWorkTable
          onChangePage={(page) => {
            setParams({
              ...params,
              page,
            });
          }}
          handleDelete={handleDelete}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          loading={loading}
          handleExportExcel={handleExportExcel}
        />
      </div>
    </React.Fragment>
  );
};

export default OffWorkTypePage;
