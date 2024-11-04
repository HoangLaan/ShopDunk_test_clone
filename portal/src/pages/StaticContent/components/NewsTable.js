import React, { useMemo } from 'react';
import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import { useDispatch } from 'react-redux';
import { deleteNews } from '../helpers/call-api';
import { useAuth } from 'context/AuthProvider';
import { showToast } from 'utils/helpers';
import CustomerCareService from 'services/customer-care.service';
const NewsTable = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
  const dispatch = useDispatch();
  const { user: userEnt } = useAuth();
  const columns = useMemo(
    () => [
      {
        header: 'Mã trang tĩnh',
        accessor: 'static_code',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Tên trang tĩnh',
        accessor: 'static_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Keyword',
        accessor: 'keyword',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Thứ tự hiển thị',
        accessor: 'order_index',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      
      {
        header: 'Trạng thái',
        accessor: 'is_active',
        classNameBody: 'bw_text_center',
        formatter: (p) =>
          p?.is_active ? (
            <span class='bw_label_outline bw_label_outline_success text-center'>Hiển Thị</span>
          ) : (
            <span class='bw_label_outline bw_label_outline_danger text-center'>Ẩn</span>
          ),
      },



      {
        header: 'Top menu',
        accessor: 'includeintopmenu',
        classNameBody: 'bw_text_center',
        formatter: (p) =>
          p?.includeintopmenu ? (
            <span class='bw_label_outline bw_label_outline_success text-center'>Có</span>
          ) : (
            <span class='bw_label_outline bw_label_outline_danger text-center'>Không</span>
          ),
      },
      {
        header: 'Cột 1 Footer',
        accessor: 'includeinfootercolumn1',
        classNameBody: 'bw_text_center',
        formatter: (p) =>
          p?.includeinfootercolumn1 ? (
            <span class='bw_label_outline bw_label_outline_success text-center'>Có</span>
          ) : (
            <span class='bw_label_outline bw_label_outline_danger text-center'>Không</span>
          ),
      },
      {
        header: 'Cột 2 Footer',
        accessor: 'includeinfootercolumn2',
        classNameBody: 'bw_text_center',
        formatter: (p) =>
          p?.includeinfootercolumn2 ? (
            <span class='bw_label_outline bw_label_outline_success text-center'>Có</span>
          ) : (
            <span class='bw_label_outline bw_label_outline_danger text-center'>Không</span>
          ),
      },
      {
        header: 'Cột 3 Footer',
        accessor: 'includeinfootercolumn3',
        classNameBody: 'bw_text_center',
        formatter: (p) =>
          p?.includeinfootercolumn3 ? (
            <span class='bw_label_outline bw_label_outline_success text-center'>Có</span>
          ) : (
            <span class='bw_label_outline bw_label_outline_danger text-center'>Không</span>
          ),
      },
      {
        header: 'Ngày tạo',
        accessor: 'created_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      
    ],
    [],
  );
  

  const exportExcel = () => {
    const params = {};
    CustomerCareService.exportExcelS(params)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Static-content.xlsx');
        document.body.appendChild(link);
        link.click();
      })
      .catch(() => { });
  };

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-inbox-out',
        type: 'success',
        outline: true,
        content: 'Xuất excel',
        permission: 'CMS_STATICCONTENT_EXPORT',
        onClick: () => exportExcel(),
      },
      {
        globalAction: true,
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Thêm mới',
        permission: 'CMS_STATICCONTENT_ADD',
        onClick: () => window._$g.rdr(`/static/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'CMS_STATICCONTENT_EDIT',
        onClick: (p) => {
          window._$g.rdr(`/static/edit/${p?.static_code}`);
        },
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'CMS_STATICCONTENT_VIEW',
        onClick: (p) => {
          window._$g.rdr(`/static/detail/${p?.static_code}`);
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'CMS_STATICCONTENT_DEL',
        onClick: (_, d) => {
          if (_.is_system === 1 && userEnt?.user_name !== 'administrator' && _.static_id) {
            showToast.error('Bạn không có quyền xóa', {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'colored',
            });
            return;
          }
          dispatch(
            showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () =>
              handleDelete(_.static_id),
            ),
          );
        },
      },
    ];
  }, []);
  const handleDelete = async (params) => {
    await deleteNews(params);
    onRefresh();
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
      handleBulkAction={(e) =>
        dispatch(
          showConfirmModal(
            ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
            async () => {
              await deleteNews(e);
              onRefresh();
            },
          ),
        )
      }
    />
  );
};

export default NewsTable;
