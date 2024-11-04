import React, { useMemo } from 'react';
import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import { useDispatch } from 'react-redux';
import { deleteNews } from '../helpers/call-api';
import { useAuth } from 'context/AuthProvider';
import { showToast } from 'utils/helpers';

const NewsTable = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
  const dispatch = useDispatch();
  const { user: userEnt } = useAuth();
  const columns = useMemo(
    () => [
      {
        header: 'Tên bài viết',
        accessor: 'news_title',
        classNameHeader: 'bw_sticky bw_name_sticky',
        classNameBody: 'bw_sticky bw_name_sticky',
      },
      // {
      //     header: 'Loại bài viết',
      //     accessor: 'news_type',
      // },
      {
        header: 'Người tạo',
        accessor: 'created_user',
      },
      {
        header: 'Ngày tạo',
        accessor: 'created_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Lượt xem',
        accessor: 'view_count',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Bình luận',
        accessor: 'total_comment',
        classNameBody: 'bw_text_center',
        formatter: (p) => <span className='fi fi-rr-comments'> {p.total_comment}</span>,
      },
      {
        header: 'Trạng thái',
        accessor: 'is_active',
        classNameBody: 'bw_text_center',
        formatter: (p) =>
          p?.is_active ? (
            <span class='bw_label_outline bw_label_outline_success text-center'>Kích hoạt</span>
          ) : (
            <span class='bw_label_outline bw_label_outline_danger text-center'>Ẩn</span>
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
        permission: 'NEWS_NEWS_ADD',
        onClick: () => window._$g.rdr(`/news/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'NEWS_NEWS_EDIT',
        onClick: (p) => {
          window._$g.rdr(`/news/edit/${p?.news_id}`);
        },
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'NEWS_NEWS_VIEW',
        onClick: (p) => {
          window._$g.rdr(`/news/detail/${p?.news_id}`);
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'NEWS_NEWS_DEL',
        onClick: (_, d) => {
          if (_.is_system === 1 && userEnt?.user_name !== 'administrator' && _.news_id) {
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
              handleDelete(_.news_id),
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
