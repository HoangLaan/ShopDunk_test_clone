import React, { useCallback, useMemo, useState } from 'react';
import DataTable from 'components/shared/DataTable';
import ConfirmReview from 'pages/StocksOutRequest/components/add/modal/ConfirmReview';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import { useAuth } from 'context/AuthProvider';
import { reviewTypeOptions } from 'pages/StocksOutRequest/utils/helper';
import { REVIEW_TYPE, STOCKSOUT_PERMISSION } from 'pages/StocksOutRequest/utils/constants';
import { deleteListStocksOut, exportPDFStocksOut } from 'services/stocks-out-request.service';
import { openInNewTab, showToast } from 'utils/helpers';
import { TRANSFER_TYPE } from 'pages/StocksTransfer/helpers/const';

const StocksOutTable = ({
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onRefresh,
  loading,
  isFilterPreOder,
}) => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [dataReview, setDataReview] = useState(undefined);
  const [loadingPrint, setLoadingPrint] = useState(false);
  const jsx_review = useCallback(({ type = '', user_name = null, full_name = '', avatar_url = null }) => {
    const findReview = reviewTypeOptions?.find((p) => p?.value === parseInt(type));
    if (findReview) {
      const { label = '', className, icon, colorLabel } = findReview;
      const joinName = `${user_name ? `${user_name} -` : ''}${full_name}`;
      return (
        <li className={className}>
          <img src={avatar_url ?? 'bw_image/img_cate_default.png'} />
          <span className={`fi ${icon}`}></span>
          <p>
            {joinName} <i className={colorLabel}>{label}</i>
          </p>
        </li>
      );
    }
  }, []);

  const columns = useMemo(
    () => [
      {
        header: 'Ngày tạo',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (p) => <b>{p?.created_date}</b>,
      },
      {
        style: {
          left: '125px',
        },
        styleHeader: {
          left: '125px',
        },
        header: 'Số phiếu xuất',
        accessor: 'stocks_out_request_code',
        classNameBody: 'bw_sticky bw_name_sticky',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        formatter: (p) => <b>{p?.stocks_out_request_code}</b>,
      },
      {
        header: 'Số phiếu yêu cầu',
        accessor: 'request_code',
        classNameHeader: 'bw_text_center',
        // formatter: (p) => (
        //   <a onClick={() => window._$g.rdr(`/stocks-out-request/detail/${p?.stocks_out_request_id}`)}>
        //     {p?.request_code}
        //   </a>
        // ),
      },
      {
        header: 'Hình thức phiếu xuất',
        accessor: 'stocks_out_type_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Kho xuất',
        accessor: 'stocks_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Người lập phiếu',
        accessor: 'created_user',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Ngày tạo phiếu',
        accessor: 'created_date',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Trạng thái phiếu xuất',
        accessor: 'is_outputted',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Trạng thái duyệt',
        classNameHeader: 'bw_text_center',
        formatter: (p) => (
          <ul className='bw_confirm_level'>
            {p.review_list.map((o) => {
              return jsx_review({
                type: o?.is_reviewed,
                ...o,
              });
            })}
          </ul>
        ),
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm mới',
        permission: STOCKSOUT_PERMISSION.ADD,
        onClick: () => window._$g.rdr(`/stocks-out-request/add`),
      },
      // {
      //   globalAction: true,
      //   icon: 'fi fi-rr-check',
      //   type: 'success',
      //   hidden: !isFilterPreOder,
      //   content: 'Duyệt',
      //   permission: STOCKSOUT_PERMISSION.ADD,
      //   onClick: () => {
      //     setShowModalReview(true);
      //   },
      // },
      // {
      //   globalAction: true,
      //   icon: 'fi fi-rr-plus',
      //   type: 'success',
      //   hidden: !isFilterPreOder,
      //   content: 'Từ chối duyệt',
      //   permission: STOCKSOUT_PERMISSION.ADD,
      //   onClick: () => {},
      // },
      {
        icon: (p) => `fi ${p.transaction_id ? 'fi-rr-receipt' : 'fi-rr-file-invoice'}`,
        permission: STOCKSOUT_PERMISSION.PRINT_INVOICE,
        color: 'blue',
        hidden: (p) => ![TRANSFER_TYPE.ORIGIN_STOCKS, TRANSFER_TYPE.SAME_BUSINESS].includes(p.transfer_type),
        onClick: (p) => {
          showToast.warning('Tính năng đăng phát triển !');
        },
      },
      {
        icon: 'fi fi-rr-print',
        color: 'black',
        permission: STOCKSOUT_PERMISSION.PRINT,
        hidden: (p) => !(p?.is_outputted === 'Đã xuất kho'),
        onClick: (p) => {
          setLoadingPrint(true);
          exportPDFStocksOut(p?.stocks_out_request_id).then((result) => {
            openInNewTab(result);
          });
          setLoadingPrint(false);
        },
      },
      {
        icon: 'fi fi-rr-check',
        color: 'ogrance',
        permission: STOCKSOUT_PERMISSION.REVIEW,
        hidden: (p) => {
          const review_list = p?.review_list;
          if (review_list) {
            const indexReview = review_list.findIndex((o) => o.user_name === user.user_name);
            if (indexReview >= 0) {
              if (indexReview === 0) {
                if (parseInt(review_list[0].is_reviewed) === REVIEW_TYPE.PENDING) {
                  return false;
                }
              } else {
                if (
                  parseInt(review_list[indexReview - 1].is_reviewed) === REVIEW_TYPE.ACCEPT ||
                  parseInt(review_list[indexReview].is_reviewed) === REVIEW_TYPE.PENDING
                ) {
                  return false;
                }
              }
            }
          }
          return true;
        },
        onClick: (p) => {
          setDataReview(p);
        },
      },
      {
        icon: 'fi fi-rr-edit',
        permission: STOCKSOUT_PERMISSION.EDIT,
        color: 'blue',
        hidden: (p) => p?.is_outputted === 'Đã xuất kho',
        onClick: (p) => window._$g.rdr(`/stocks-out-request/edit/${p?.stocks_out_request_id}`),
      },
      {
        icon: 'fi fi-rr-eye',
        permission: STOCKSOUT_PERMISSION.VIEW,
        color: 'green',
        onClick: (p) => window._$g.rdr(`/stocks-out-request/detail/${p?.stocks_out_request_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        permission: STOCKSOUT_PERMISSION.DEL,
        color: 'red',
        hidden: (p) => p?.is_outputted === 'Đã xuất kho',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteListStocksOut([_?.stocks_out_request_id]);
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, [isFilterPreOder]);

  return (
    <React.Fragment>
      <DataTable
        // onChangeSelect={setSelectedData}
        loading={loading || loadingPrint}
        columns={columns}
        data={data}
        actions={actions}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        onChangePage={onChangePage}
        hiddenRowSelect={(p) => p?.is_outputted === 'Đã xuất kho'}
        handleBulkAction={(e) => {
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteListStocksOut(e.map((o) => o.stocks_out_request_id));
                onRefresh();
              },
            ),
          );
        }}
      />
      {dataReview && (
        <ConfirmReview
          dataReview={dataReview}
          onClose={() => {
            setDataReview(undefined);
            onRefresh();
          }}
        />
      )}
    </React.Fragment>
  );
};

export default StocksOutTable;
