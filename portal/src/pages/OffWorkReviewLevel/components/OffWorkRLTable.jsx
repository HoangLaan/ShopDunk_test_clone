import DataTable from 'components/shared/DataTable/index'
import React, { useMemo } from 'react'
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import { showConfirmModal } from 'actions/global'
import { useDispatch } from 'react-redux'
import { msgError } from '../helpers/msgError'

dayjs.extend(customParseFormat)

const OffWorkRLTable = ({ data, totalPages, itemsPerPage, page, loading, totalItems, onChangePage, handleDelete }) => {

  const dispatch = useDispatch()

  const columns = useMemo(
    () => [
      {
        header: 'Mức duyệt',
        accessor: 'review_level_name',
        classNameHeader: 'bw_sticky bw_name_sticky',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (p) => <span className='bw_sticky bw_name_sticky'>{p?.review_level_name}</span>,
      },
      {
        header: 'Công ty áp dụng',
        formatter: (p) => <span>{p?.company_name}</span>,
      },
      {
        header: 'Người tạo',
        formatter: (p) => <span>{p?.created_user}</span>,
      },
      {
        header: 'Ngày tạo',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'created_date',
      },
      {
        header: 'Trạng thái',
        accessor: 'is_active',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) =>
          p?.is_active ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Kích hoạt</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Ẩn</span>
          ),
      }
    ], [])

  const actions = useMemo(() => {
    return [

      {
        globalAction: true,
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Thêm mới',
        permission: 'HR_OFFWORK_REVIEWLEVEL_ADD',
        onClick: () => window._$g.rdr(`/off-work-reviewlevel/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'HR_OFFWORK_REVIEWLEVEL_EDIT',
        onClick: (p) => window._$g.rdr(`/off-work-reviewlevel/edit/${p?.off_work_review_level_id}`),
      },

      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'HR_OFFWORK_REVIEWLEVEL_DEL',
        onClick: (p) =>
          dispatch(
            showConfirmModal(
              msgError['model_error'],
              async () => {
                handleDelete(p?.off_work_review_level_id)
              },
            ),
          ),
      }

    ]
  }, [])

  const handleBulkAction = (items, action) => {
    let _mapOject = items.map((_key) => _key.off_work_review_level_id).join("|")
    if (action === 'delete') {
      dispatch(
        showConfirmModal(
          ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
          () => handleDelete(_mapOject)
        )
      )
    }
  }


  return (
    <DataTable
      columns={columns}
      data={data}
      actions={actions}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      page={page}
      totalItems={totalItems}
      onChangePage={onChangePage}
      handleBulkAction={handleBulkAction}
      loading={loading}
    />
  )
}

export default OffWorkRLTable
