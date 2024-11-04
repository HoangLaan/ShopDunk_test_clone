import { showConfirmModal } from 'actions/global';
import BWImage from 'components/shared/BWImage/index';
import DataTable from 'components/shared/DataTable/index';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { msgError } from '../helpers/msgError';
import { useAuth } from 'context/AuthProvider';

dayjs.extend(customParseFormat);

const CustomerTable = ({ data, totalPages, itemsPerPage, page, loading, totalItems, onChangePage, handleDelete, handleExportExcel }) => {
  const dispatch = useDispatch();

  const status_review = (_status) => {
    switch (_status) {
      case 'Đã duyệt':
        return 'bw_agree';
      case 'Không duyệt':
        return 'bw_non_agree';
      default:
        return '';
    }
  };

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        formatter: (p, index) => <p>{index+1}</p>,
      },
      {
        header: 'Nhân viên',
        accessor: 'full_name',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <p>{p?.full_name}</p>,
      },
      {
        header: 'Từ ngày',
        classNameHeader: 'bw_text_center',
        formatter: (p) => (
          <p>
            {p?.from_date} - {p?.to_date}
          </p>
        ),
      },

      {
        header: 'Loại phép',
        classNameHeader: 'bw_text_center',
        accessor: 'off_work_type_name',
      },
      {
        header: 'Số ngày',
        accessor: 'total_time_off',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_text_center bw_name_sticky',
        formatter: (p) => <span>{p?.total_time_off} Ngày</span>,
      },
      {
        header: 'Người duyệt',
        classNameHeader: 'bw_text_center',
        accessor: 'offwork_review',
        formatter: (p) => {
          return (
            <div className='text-left'>
              {!p?.offwork_review
                ? 'Tự động duyệt'
                : (p?.offwork_review || '').split(',').map((user, i) => {
                    let _user = user.split('|');
                    return (
                      <ul className='bw_confirm_level'>
                        <li className={status_review(_user[2])}>
                          <div
                            style={{
                              width: '32px',
                            }}>
                            <BWImage src={process.env.REACT_APP_CDN + _user[0]} />
                          </div>
                          <span
                            className={
                              _user[2] === 'Đã duyệt'
                                ? 'fi fi-rr-check'
                                : _user[2] === 'Không duyệt'
                                ? 'fi fi-rr-cross'
                                : 'fi fi-rr-minus'
                            }></span>

                          <p
                            style={{
                              marginLeft: '10px',
                            }}>
                            {_user[1]} -{' '}
                            <i
                              className={
                                _user[2] === 'Đã duyệt'
                                  ? 'bw_green'
                                  : _user[2] === 'Không duyệt'
                                  ? 'bw_red'
                                  : 'bw_black'
                              }>
                              {_user[2]}
                            </i>
                          </p>
                        </li>
                      </ul>
                    );
                  })}
            </div>
          );
        },
      },
      {
        header: 'Trạng thái',
        accessor: 'is_approve',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => {
          return p?.is_approve == 2 ? (
            <span className='bw_label_outline text-center'>Chưa duyệt</span>
          ) : p?.is_approve == 0 ? (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Không duyệt</span>
          ) : p?.is_approve == 3 ? (
            <span className='bw_label_outline bw_label_outline_warning text-center'>Đang duyệt</span>
          ) : p?.is_approve == 1 ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Đã duyệt</span>
          ) : null;
        },
      },
      {
        header: 'Ngày xin',
        accessor: 'created_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Trạng thái xác nhận',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (d) => (d.is_confirm ? 'Đã xác nhận' : 'Chưa xác nhận'),
      },
    ],
    [],
  );

  const { user } = useAuth();
  const reviewed = 1;
  const rejected = 0;
  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Xuất Excel',
        permission: 'HR_OFFWORK_EXPORT',
        onClick: () => handleExportExcel(),
      },
      {
        globalAction: true,
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Đăng kí nghỉ phép',
        permission: 'HR_OFFWORK_ADD',
        onClick: () => window._$g.rdr(`/off-work-add`),
      },
      {
        icon: 'fi fi-rr-check',
        color: 'ogrance',
        permission: 'HR_OFFWORK_REVIEW',
        hidden: (p) => {
          const reviewedText = 'Chưa duyệt';
          const list_user_review = p.offwork_review?.split(',');
          const user_review_current = list_user_review?.find((item) => item.includes(user.user_name));
          return !user_review_current?.includes(reviewedText);
        },
        onClick: (p) =>
          ![reviewed, rejected].includes(p?.is_approve) ? window._$g.rdr(`/off-work/review/${p?.off_work_id}`) : null,
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'HR_OFFWORK_EDIT',
        hidden: (p) => p?.is_approve == 1 ? true : user?.user_name !== p?.user_name ? true : false,
        disabled: (p) => (p?.is_approve == 2 ? false : true),
        onClick: (p) => (p?.is_approve == 2 ? window._$g.rdr(`/off-work/edit/${p?.off_work_id}`) : null),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'HR_OFFWORK_VIEW',
        onClick: (p) => window._$g.rdr(`/off-work/detail/${p?.off_work_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        disabled: (p) => (p?.is_approve == 2 ? false : true),
        permission: 'HR_OFFWORK_DEL',
        onClick: (p) => {
          if (p?.is_approve == 2) {
            dispatch(
              showConfirmModal(msgError['model_error'], async () => {
                handleDelete(p);
              }),
            );
          }
        },
      },
    ];
  }, []);

  return (
    <DataTable
      noSelect
      columns={columns}
      data={data}
      actions={actions}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      page={page}
      totalItems={totalItems}
      onChangePage={onChangePage}
      loading={loading}
    />
  );
};

export default CustomerTable;
