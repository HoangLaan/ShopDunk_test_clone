import React, { useMemo, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { cdnPath, splitString } from 'utils/index';
import { showConfirmModal } from 'actions/global';

import { exportPDF, deleteStocksInRequest } from 'services/stocks-in-request.service';
import DataTable from 'components/shared/DataTable/index';
import BWLoader from '../../../components/shared/BWLoader/index';
import ModalReview from './ModalReview';
import { ISIMPORTED, STOCKINTYPEID, reviewTypeOptions } from './utils/constants';
import { useAuth } from '../../../context/AuthProvider';
import { REVIEW_STATUS_TYPES } from './utils/constants';
import { Tooltip } from 'antd';
import moment from 'moment';
const StocksInRequestTable = ({
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onRefresh,
}) => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [showModalReview, setShowModalReview] = useState(false);
  const [itemReviewLevel, setItemReviewLevel] = useState(null);

  const handleExportPDF = (stocks_in_request_id) => {
    setLoadingPdf(true);
    exportPDF({ stocks_in_request_id })
      .then((response) => {
        let varUrl = response.path;
        const url = cdnPath(varUrl);
        const pdflink = document.createElement('a');
        pdflink.target = '_blank';
        pdflink.href = url;
        document.body.appendChild(pdflink);
        pdflink.click();
      })
      .finally(() => {
        setLoadingPdf(false);
      });
  };
  const handleReview = (item) => {
    setItemReviewLevel(item);
    setShowModalReview(true);
  };
  const jsx_review = useCallback(
    ({ type = '', review_user = null, full_name = '', avatar_url = null, stocks_review_level_name }) => {
      const findReview = reviewTypeOptions?.find((p) => p?.value === parseInt(type));
      if (findReview) {
        const { label = '', className, icon, colorLabel } = findReview;
        const joinName = `${review_user ? `${review_user} - ` : `Duyệt tự động`}${full_name ? full_name : ''}`;
        return (
          <li className={className}>
            <img src={avatar_url ?? 'bw_image/img_cate_default.png'} alt='2' />
            <span className={`fi ${icon}`}></span>
            <p>
              {joinName} <i className={colorLabel}>{label}</i>
            </p>
          </li>
        );
      }
    },
    [],
  );

  const columns = useMemo(
    () => [
      {
        header: 'Ngày tạo',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (p) => <b>{p?.created_date}</b>
      },
      {
        style: {
          left: '130px'
        },
        styleHeader: {
          left: '130px'
        },
        header: 'Số phiếu nhập',
        accessor: 'stocks_in_code',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
      },
      {
        header: 'Số phiếu yêu cầu',
        classNameHeader: 'bw_text_center',
        accessor: 'request_code',
      },
      {
        header: 'Hình thức phiếu nhập',
        classNameHeader: 'bw_text_center',
        accessor: 'stocks_in_type_name',
      },
      {
        header: 'Kho nhập',
        classNameHeader: 'bw_text_center',
        accessor: 'stocks_name',
      },
      {
        header: 'Nhà cung cấp',
        classNameHeader: 'bw_text_center',
        accessor: 'supplier_name',
        formatter: (d) => (
          <Tooltip title={d.supplier_name}>
            {splitString(d.supplier_name, 30)}
          </Tooltip>
        )
      },
      {
        header: 'Người lập phiếu',
        classNameHeader: 'bw_text_center',
        accessor: 'created_user',
      },
      {
        header: 'Ngày tạo phiếu',
        classNameHeader: 'bw_text_center',
        accessor: 'created_date',
      },

      {
        header: 'Trạng thái phiếu nhập',
        classNameHeader: 'bw_text_center',
        accessor: 'stocks_in_request_status',
        //classNameBody: "bw_text_center",
      },
      {
        header: 'Trạng thái duyệt',
        classNameHeader: 'bw_text_center',
        accessor: 'status_reviewed',
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

        //classNameBody: "bw_text_center",
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
        permission: 'ST_STOCKSINREQUEST_ADD',
        onClick: () => window._$g.rdr(`/stocks-in-request/add`),
      },
      {
        icon: 'fi fi-rr-check',
        hidden: (_) => {
          let indexUser = _.review_list.findIndex((r) => r.review_user === user.user_name * 1);
          return (_.status_reviewed === REVIEW_STATUS_TYPES.REVIEWING ||
            _.status_reviewed === REVIEW_STATUS_TYPES.NOTYETREVIEW) &&
            indexUser !== -1
            ? false
            : true;
        },
        color: 'ogrance',
        permission: 'ST_STOCKSINREQUEST_REVIEW',
        onClick: (p) => {
          const itemReview = p.review_list.find((_) => _.review_user === user.user_name * 1);
          handleReview(itemReview);
        },
      },
      {
        icon: 'fi fi-rr-print',
        hidden: (_) => {
          return _.status_reviewed === REVIEW_STATUS_TYPES.REVIEWED && _.is_imported === 1 ? false : true;
        },
        color: 'black',
        permission: 'ST_STOCKSINREQUEST_VIEW',
        onClick: (p) => {
          handleExportPDF(p?.stocks_in_request_id);
        },
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'ST_STOCKSINREQUEST_EDIT',
        hidden: (_) => {
          const stocks_in_date = moment(_?.stocks_in_date, 'DD/MM/YYYY')
          const currDate = moment();
          if (stocks_in_date && stocks_in_date?.isSame(currDate, 'day') && _.is_imported === ISIMPORTED && _?.stocks_in_type_id == STOCKINTYPEID) {
            return false
          }
          if (_.status_reviewed !== REVIEW_STATUS_TYPES.NOTYETREVIEW) {
            return true
          }
          // return _.status_reviewed === REVIEW_STATUS_TYPES.NOTYETREVIEW ? false : true;
        },
        onClick: (p) => {
          window._$g.rdr(`/stocks-in-request/edit/${p?.stocks_in_request_id}`);
        },
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'ST_STOCKSINREQUEST_VIEW',
        onClick: (p) => {
          window._$g.rdr(`/stocks-in-request/detail/${p?.stocks_in_request_id}?purchase_order_id=${p?.purchase_order_id}`);
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'ST_STOCKSINREQUEST_DEL',
        hidden: (_) => {
          return _.status_reviewed === REVIEW_STATUS_TYPES.REVIEWING ||
            _.status_reviewed === REVIEW_STATUS_TYPES.REVIEWED ||
            _.status_reviewed === REVIEW_STATUS_TYPES.NOREVIEW
            ? true
            : false;
        },
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () =>
              handleDelete(_.stocks_in_request_id),
            ),
          ),
      },
    ];
  }, []);

  const handleDelete = async (arr) => {
    await deleteStocksInRequest({ list_id: arr });
    onRefresh();
  };

  const handleBulkAction = (items, action) => {
    let arrDel = items?.map((item) => item?.stocks_in_request_id);
    if (action === 'delete') {
      dispatch(
        showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () => {
          handleDelete(arrDel);
        }),
      );
    }
  };

  return (
    <>
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
        hiddenRowSelect={(p) => p?.status_reviewed == 3}
      />
      {loadingPdf && <BWLoader isPage={false} />}
      {showModalReview && (
        <ModalReview
          disabled={true}
          itemReviewLevel={itemReviewLevel}
          setShowModalReview={setShowModalReview}
          onRefresh={onRefresh}
        />
      )}
    </>
  );
};

export default StocksInRequestTable;
