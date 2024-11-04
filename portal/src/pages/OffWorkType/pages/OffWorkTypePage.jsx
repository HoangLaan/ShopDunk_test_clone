import React, { useCallback, useState, useEffect } from 'react';
import { deleteItem, getList } from '../helpers/call-api';
import OffWorkTypeTable from '../components/OffWorkTypeTable';
import OffWorkTypeFilter from '../components/OffWorkTypeFilter';
import { notification } from 'antd';

const OffWorkTypePage = () => {
  const [params, setParams] = useState({
    page: 1,
    itemsPerPage: 25,
    keyword: '',
    is_active: 1,
  });
  const [dataOffWorkType, setDataOffWorkType] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });

  const { items = [], itemsPerPage, page, totalItems, totalPages } = dataOffWorkType;

  const loadOffWorkType = useCallback(() => {
    getList(params).then(setDataOffWorkType);
  }, [params]);

  useEffect(loadOffWorkType, [loadOffWorkType]);

  const handleDelete = async (off_work_type_id) => {
    const list_ids = Array.isArray(off_work_type_id) ? off_work_type_id : [off_work_type_id];
    // // Lấy ra vị trí của ca làm việc
    deleteItem(list_ids)
      .then(() => {
        loadOffWorkType();

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

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <OffWorkTypeFilter
          onChange={(p) => {
            setParams({
              ...params,
              ...p,
            });
          }}
        />
        <OffWorkTypeTable
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
        />
      </div>
    </React.Fragment>
  );
};

export default OffWorkTypePage;
