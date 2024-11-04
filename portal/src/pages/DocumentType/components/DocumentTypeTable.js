import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { deleteDocumentType } from 'services/document-type.service';
import { showToast } from 'utils/helpers';
import { splitString } from 'utils';

const DocumentTypeTable = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        formatter: (_, index) => index + 1,
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Tên loại hồ sơ',
        accessor: 'document_type_name',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
      },
      {
        header: 'Mô tả',
        accessor: 'description',
        classNameHeader: 'bw_text_center',
        formatter: (d) => splitString(d.description, 50),
      },
      {
        header: 'Bắt buộc',
        accessor: 'is_required',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) =>
          p?.is_required ? (
            <span className='text-center'>Có</span>
          ) : (
            <span className='text-center'>Không</span>
          ),
      },
      {
        header: 'Công ty',
        classNameHeader: 'bw_text_center',
        accessor: 'company_name',
      },
      {
        header: 'Người tạo',
        classNameHeader: 'bw_text_center',
        accessor: 'created_user',
      },
      {
        header: 'Ngày tạo',
        classNameHeader: 'bw_text_center',
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
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Thêm mới',
        permission: 'MD_DOCUMENTTYPE_ADD',
        onClick: () => window._$g.rdr(`/document-type/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'MD_DOCUMENTTYPE_EDIT',
        onClick: (p) => {
          window._$g.rdr(`/document-type/edit/${p?.document_type_id}`);
        },
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'MD_DOCUMENTTYPE_VIEW',
        onClick: (p) => {
          window._$g.rdr(`/document-type/detail/${p?.document_type_id}`);
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'MD_DOCUMENTTYPE_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () => {
              handleDelete(_.document_type_id);
            }),
          ),
      },
    ];
  }, []);

  const handleDelete = async (id) => {
    await deleteDocumentType(id);
    await showToast.success(`Xóa thành công`);
    onRefresh();
  };

  const handleBulkAction = (items, action) => {
    if (action === 'delete') {
      if (Array.isArray(items)) {
        dispatch(
          showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () => {
            (items || []).forEach((item) => {
              handleDelete(item.document_type_id);
            });
          }),
        );
      }
    }
  };

  return (
    <DataTable
      loading={loading}
      columns={columns}
      data={data}
      actions={actions}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      page={page}
      totalItems={totalItems}
      onChangePage={onChangePage}
      handleBulkAction={handleBulkAction}
    />
  );
};

export default DocumentTypeTable;
