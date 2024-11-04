import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import React, { useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
// Services
import { deleteDebit } from '../helpers/call-api';
import { formatMoney } from 'utils/index';
import BWImage from 'components/shared/BWImage/index';

const DebitTable = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'Đối tượng',
        accessor: 'full_name',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (p) => {
          // let picture = p?.avatar ? p?.avatar : defaultImage;
          return (
            <div className='bw_inf_pro'>
              <BWImage src={p?.avatar} alt='avatar' />
              {p?.full_name}
            </div>
          );
        },
      },
      {
        header: 'Loại công nợ',
        accessor: 'debit_type',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) =>
          p?.debit_type === 1 ? (
            <span className='bw_label  bw_label_success text-center'>Thu</span>
          ) : (
            <span className='bw_label bw_label_danger text-center'>Trả</span>
          ),
      },
      {
        header: 'Số Phiếu',
        classNameHeader: 'bw_text_center',
        accessor: 'ref_code',
      },
      {
        header: 'Số tiền cần thu/trả (đ)',
        accessor: 'total_money',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        formatter: (p) => {
          return formatMoney(p?.total_money);
        },
      },
      {
        header: 'Đã thanh toán (đ)',
        accessor: 'total_paid',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        formatter: (p) => {
          return formatMoney(p?.total_paid);
        },
      },
      {
        header: 'Công nợ (đ)',
        accessor: 'total_amount',
        classNameBody: 'bw_text_right',
        formatter: (p) => {
          return formatMoney(p?.total_amount);
        },
      },
      {
        header: 'Ngày chứng từ',
        classNameHeader: 'bw_text_center',
        accessor: 'created_date',
      },
      {
        header: 'Thời hạn nợ',
        classNameHeader: 'bw_text_center',
        accessor: 'expired_date',
      },
      {
        header: 'Trạng thái',
        classNameHeader: 'bw_text_center',
        accessor: 'is_overdue',

        formatter: (p) => {
          // Đã thanh toán
          const isPayCompleted = p?.total_amount <= 0 ? true : false;
          return isPayCompleted ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Đã thanh toán</span>
          ) : // Thời gian quá hạn
          !!p?.is_overdue ? (
            <span className='bw_label_outline  text-center'>Nợ chưa quá hạn</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Nợ quá hạn</span>
          );
        },
      },
    ],
    [],
  );

  const handleClick = useCallback((items) => {
    const { ref_link, ref_id } = items;
    let url = null;
    if (ref_link) {
      if (ref_link === 'order') {
        // // Hieunm 20230202 nếu đơn hàng mà là cod thì => sẽ sinh ra phiếu thu với đơn vị vận chuyển
        // if(!!is_cod){
        //     url = `/receiveslip/add?order_id=${ref_id}&type=shipping`;
        // // Nếu không có Cod thì sẽ đẩy sang phiếu thu với khách hàng
        // }else{
        url = `/receive-slip/add?order_id=${ref_id}&type=debt`;
        // }
      } else {
        url = `/${ref_link}/edit/${ref_id}`;
      }
    }
    if (url) window.open(url, '_blank');
    // if(debit_type===1){
    //     window._$g.rdr(`/receiveslip/add?order_id=${order_id}&type=debt`)
    // }else{
    //     window._$g.rdr(`/receiveslip/add?order_id=${order_id}&type=debt`)
    // }
  }, []);

  const actions = useMemo(() => {
    return [
      // {
      //     globalAction: true,
      //     icon: 'fi fi-rr-add',
      //     type: 'success',
      //     content: 'Thêm mới',
      //     permissions: 'MD_TIMEKEEPINGCONFIRMDATE_ADD',
      //     onClick: () => window._$g.rdr(`/date-confirm-time-keeping/add`),
      // },
      {
        icon: 'fi fi-rr-credit-card',
        color: 'green',
        permissions: 'MD_DEBIT_VIEW',
        onClick: (_, d) => dispatch(() => handleClick(_)),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        title: 'Xóa',
        permissions: 'MD_DEBIT_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              // () =>
              //     handleDelete(`${_.time_keeping_confirm_date_id}`),
              async () => {
                await deleteDebit({ list_id: `${_?.debit_id}` });
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, []);
  // }, [dispatch, onRefresh,handleClick]);

  // const handleDelete = async (arr) => {
  //     await deleteDebit({ list_id: arr });
  //     onRefresh();
  // };

  const handleBulkAction = (items, action) => {
    let arrDel = items?.map((item) => item?.debit_id)?.join(',');
    if (action === 'delete') {
      dispatch(
        showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], async () => {
          await deleteDebit({ list_id: arrDel });
          onRefresh();
          //     handleDelete(arrDel)
          //     // (items || []).forEach((item) => {
          //     //   handleDelete(item.solution_id);
          //     // });
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

export default DebitTable;
