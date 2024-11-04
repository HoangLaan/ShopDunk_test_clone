import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import DataTable from 'components/shared/DataTable';

import { showConfirmModal } from 'actions/global';
import { useDispatch, useSelector } from 'react-redux';

import {
  FIELD_STOCKSTAKEREQUEST,
  REVIEW_TYPES,
  ROUTE_STOCKS_TAKE_REQUEST,
  STOCKS_TAKE_REQUEST_PERMISSION,
} from 'pages/StocksTakeRequest/utils/constants';
import { reviewTypeOptions } from 'pages/StocksOutRequest/utils/helper';
import { reviewTypes } from 'pages/StocksTakeRequest/utils/helpers';
import { deleteStocksTake } from 'services/stocks-take-request.service';

const StocksTakeRequestTable = ({ onChangeParams, onChangePage, onRefresh }) => {
  const dispatch = useDispatch();
  const [tabActive, setTabActive] = useState(REVIEW_TYPES.ALL);

  const { stocksTakeRequestList, getStocksTakeRequestLoading } = useSelector((state) => state.stocksTakeRequest);
  const { items, itemsPerPage, page, totalItems, totalPages } = stocksTakeRequestList;

  const jsx_review = ({ type = '', full_name_review = null, default_picture_url = null }) => {
    const findReview = reviewTypeOptions?.find((p) => p?.value === parseInt(type));
    if (findReview) {
      const { label = '', className, icon, colorLabel } = findReview;
      return (
        <li className={className}>
          <img src={default_picture_url ?? 'bw_image/img_cate_default.png'} alt='2' />
          <span className={`fi ${icon}`}></span>
          <p>
            {full_name_review} <i className={colorLabel}>{label}</i>
          </p>
        </li>
      );
    }
  };

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
        header: 'Số phiếu kiểm kê kho',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (p) => <b>{p[FIELD_STOCKSTAKEREQUEST.stocks_take_request_code]}</b>,
      },
      {
        header: 'Hình thức phiếu kiểm kê kho',
        classNameHeader: 'bw_text_center',
        accessor: FIELD_STOCKSTAKEREQUEST.stocks_take_type_name,
      },
      {
        header: 'Kho kiểm kê',
        classNameHeader: 'bw_text_center',
        formatter: (value) => {
          console.log('>>> check', value.stocks_take_name_list);
          return value.stocks_take_name_list?.length > 0 && value.stocks_take_name_list.map((item) => <p>{item}</p>);
        },
      },
      {
        header: 'Tên kỳ kiểm kê',
        classNameHeader: 'bw_text_center',
        accessor: FIELD_STOCKSTAKEREQUEST.stocks_take_request_name,
      },
      {
        header: 'Ngày kiểm kê',
        classNameHeader: 'bw_text_center',
        accessor: FIELD_STOCKSTAKEREQUEST.stocks_take_request_date,
      },
      {
        header: 'Trạng thái duyệt',
        classNameHeader: 'bw_text_center',
        accessor: FIELD_STOCKSTAKEREQUEST.is_reviewed,
        formatter: (p) => (
          <ul className='bw_confirm_level'>
            {p.list_review.map((o) => {
              return jsx_review({
                type: o?.is_reviewed,
                ...o,
              });
            })}
          </ul>
        ),
      },
      {
        header: 'Trạng thái xử lý',
        classNameHeader: 'bw_text_center',
        formatter: (p) => (p?.is_processed ? 'Đã xứ lý' : 'Chưa xử lý'),
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
        onClick: (p) => window._$g.rdr(ROUTE_STOCKS_TAKE_REQUEST.ADD),
        permission: STOCKS_TAKE_REQUEST_PERMISSION.EDIT,
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        onClick: (p) => window._$g.rdr(ROUTE_STOCKS_TAKE_REQUEST.EDIT(p?.stocks_take_request_id)),
        permission: STOCKS_TAKE_REQUEST_PERMISSION.EDIT,
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        onClick: (p) => window._$g.rdr(ROUTE_STOCKS_TAKE_REQUEST.VIEW(p?.stocks_take_request_id)),
        permission: STOCKS_TAKE_REQUEST_PERMISSION.VIEW,
      },
      {
        icon: 'fi fi-rr-trash',
        permission: STOCKS_TAKE_REQUEST_PERMISSION.DELETE,
        color: 'red',
        onClick: (p) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteStocksTake(p?.stocks_take_request_id);
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, []);

  const jsx_table = (
    <DataTable
      title={
        <ul className='bw_tabs'>
          {reviewTypes?.map((o) => {
            return (
              <li
                onClick={() => {
                  setTabActive(o.value);
                  onChangeParams({
                    is_reviewed: o?.value,
                  });
                }}
                className={tabActive === o.value ? 'bw_active' : ''}>
                <a className='bw_link'>{o?.label}</a>
              </li>
            );
          })}
        </ul>
      }
      actions={actions}
      loading={getStocksTakeRequestLoading}
      columns={columns}
      data={items}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      page={page}
      totalItems={totalItems}
      onChangePage={onChangePage}
      handleBulkAction={(arrayList) => {
        dispatch(
          showConfirmModal(
            ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
            async () => {
              for (let p of arrayList) {
                await deleteStocksTake(p?.stocks_take_request_id);
              }
              onRefresh();
            },
          ),
        );
      }}
    />
  );
  return <React.Fragment>{jsx_table}</React.Fragment>;
};

StocksTakeRequestTable.propTypes = {
  onChangePage: PropTypes.func,
  onRefresh: PropTypes.func,
};

StocksTakeRequestTable.defaultProps = {
  onChangePage: () => {},
  onRefresh: () => {},
};

export default StocksTakeRequestTable;
