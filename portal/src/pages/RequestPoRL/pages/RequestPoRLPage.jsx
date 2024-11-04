import React, { useCallback, useState, useEffect } from 'react'
import { deleteItem, getList } from '../helpers/call-api'
import RequestPoRLTable from '../components/RequestPoRLTable'
import RequestPoRLFilter from '../components/RequestPoRLFilter'
import { defaultPaging, defaultParams, showToast } from 'utils/helpers'


const RequestPoPage = () => {
  const [params, setParams] = useState(defaultParams)
  const [dataRequestPoRL, setDataRequestPoRL] = useState(defaultPaging)

  const [loading, setLoading] = useState(true);

  const { items = [], itemsPerPage, page, totalItems, totalPages } = dataRequestPoRL


  const loadRequestPoRL = useCallback(() => {
    setLoading(true);
    getList(params).then(setDataRequestPoRL).finally(() => {
      setLoading(false);
    });
  }, [params])

  useEffect(loadRequestPoRL, [loadRequestPoRL]);

  const handleDelete = async (request_po_request_id) => {
    // // Lấy ra vị trí của ca làm việc
    deleteItem(request_po_request_id).then(() => {
      loadRequestPoRL();
      showToast.success('Xoá dữ liệu thành công')
    }).catch((error) => {
      let { message } = error
      if (error.message) {
        showToast.error(message + "")
      }
    })

  }

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <RequestPoRLFilter
          onChange={(p) => {
            setParams({
              ...params,
              ...p,
            });
          }}
        />
        <RequestPoRLTable
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

export default RequestPoPage
