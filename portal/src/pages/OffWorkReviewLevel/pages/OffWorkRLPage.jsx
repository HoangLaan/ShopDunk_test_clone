import React, { useCallback, useState, useEffect } from 'react'
import { deleteItem, getList } from '../helpers/call-api'
import OffWorkRLTable from '../components/OffWorkRLTable'
import OffWorkRLFilter from '../components/OffWorkRLFilter'
import { notification } from 'antd'


const OffWorkRLPage = () => {
  const [params, setParams] = useState({
    page: 1,
    itemsPerPage: 25,
    is_active: 1
  })
  const [dataOffWorkRL, setDataOffWorkRL] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0
  })

  const [loading, setLoading] = useState(true);

  const { items = [], itemsPerPage, page, totalItems, totalPages } = dataOffWorkRL


  const loadOffWorkRL = useCallback(() => {
    setLoading(true);
    getList(params).then(setDataOffWorkRL).finally(() => {
      setLoading(false);
    });
  }, [params])

  useEffect(loadOffWorkRL, [loadOffWorkRL]);

  const handleDelete = async (off_work_review_level_id) => {

    // // Lấy ra vị trí của ca làm việc
    deleteItem({ off_work_review_level_id: off_work_review_level_id }).then(() => {
      loadOffWorkRL()

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
        <OffWorkRLFilter
          onChange={(p) => {
            setParams({
              ...params,
              ...p,
            });
          }}
        />
        <OffWorkRLTable
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
  )
}

export default OffWorkRLPage
