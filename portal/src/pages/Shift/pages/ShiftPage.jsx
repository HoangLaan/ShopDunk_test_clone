import React, { useCallback, useState, useEffect } from 'react'
import { deleteItem, getList } from '../helpers/call-api'
import ShiftTable from '../components/ShiftTable'
import ShiftFilter from '../components/ShiftFilter'
import { notification } from 'antd'


const ShiftPage = () => {
  const [params, setParams] = useState({
    page: 1,
    itemsPerPage: 25,
    is_active: 1
  })
  const [dataShift, setDataShift] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0
  })

  const [loading, setLoading] = useState(false);

  const { items = [], itemsPerPage, page, totalItems, totalPages } = dataShift

  const loadShift = useCallback(() => {
    setLoading(true)
    getList(params).then(setDataShift).finally(() => {
      setLoading(false);
    });
  }, [params])

  useEffect(loadShift, [loadShift]);

  const handleDelete = async (shift) => {
    let msgError = undefined

    // // Lấy ra vị trí của ca làm việc
    deleteItem(shift?.shift_id).then(() => {
      loadShift()

      notification.success({
        message: 'Xoá dữ liệu thành công'
      })
    }).catch((error) => {
      let { message } = error

      if (error.message) {

        notification.error({
          message: message + ""
        })
      }
    })

  }

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <ShiftFilter
          onChange={(p) => {
            setParams({
              ...params,
              ...p,
            });
          }}
        />
        <ShiftTable
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
        />
      </div>
    </React.Fragment>
  );
};

export default ShiftPage;
