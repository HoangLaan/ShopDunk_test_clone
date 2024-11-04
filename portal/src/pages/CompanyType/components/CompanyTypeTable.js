import React, { useMemo } from 'react';
import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import { useDispatch } from 'react-redux';
import { deleteCompanyType } from '../helpers/call-api';
import { sliceText } from 'utils/helpers';

const CompanyTypeTable = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'Tên loại công ty',
        accessor: 'company_type_name',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky bw_text_left',
      },
      {
        header: 'Mô tả',
        classNameHeader: 'bw_text_center',
        accessor: 'descriptions',
        formatter: (p) => sliceText(p?.descriptions, 50, 47),
      },
      {
        header: 'Người tạo',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        accessor: 'created_user',
      },
      {
        header: 'Ngày tạo',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        accessor: 'created_date',
      },
      {
        header: 'Trạng thái',
        accessor: 'is_active',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
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
        permission: 'MD_COMPANY_TYPE_ADD',
        onClick: () => window._$g.rdr(`/company-type/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'MD_COMPANY_TYPE_EDIT',
        onClick: (p) => {
          window._$g.rdr(`/company-type/edit/${p?.company_type_id}`);
        },
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'MD_COMPANY_TYPE_VIEW',
        onClick: (p) => {
          window._$g.rdr(`/company-type/detail/${p?.company_type_id}`);
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'MD_COMPANY_TYPE_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteCompanyType(_.company_type_id);
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, []);

  const handleDelete = async (params) => {
    await deleteCompanyType(params);
    onRefresh();
  };

  const handleBulkAction = (items, action) => {
    if (action === 'delete') {
      dispatch(
        showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], async () => {
          for (let _ of items) {
            await deleteCompanyType(_.company_type_id);
          }
          onRefresh();
        }),
      );
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

export default CompanyTypeTable;
