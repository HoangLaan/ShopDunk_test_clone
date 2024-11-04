/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useCallback, useEffect, useState } from 'react';
import { showToast } from 'utils/helpers';
import { useDispatch, useSelector } from 'react-redux';

import { ExportExcelOrder, deleteItem, getInformationWithOrder } from 'pages/Orders/helpers/call-api';
import { getErrorMessage } from 'utils/index';
import { getOrdersList, setOrdersQuery } from 'pages/Orders/actions/actions';
// import { useAuth } from 'context/AuthProvider';

import OrdersTable from 'pages/Orders/components/main/OrdersTable';
import OrdersFilter from 'pages/Orders/components/main/OrdersFilter';
import BWButton from 'components/shared/BWButton/index';
import i__file from 'assets/bw_image/icon/i__file.svg';
import CheckAccess from 'navigation/CheckAccess';
import ReportModal from '../components/report/ReportModal';

const OrdersPage = () => {
  const [dataReportSearch, setDataReportSearch] = useState({});
  const dispatch = useDispatch();
  // const { user } = useAuth();

  const [statusList, setStatusList] = useState([]);
  const [loading, setLoading] = useState(false);

  const { dataOrders, loadingList, query } = useSelector((state) => state.orders);
  const tab_active = query?.order_status ?? '';

  const { items = [], itemsPerPage, page, totalItems, totalPages, meta } = dataOrders;

  const [isOpenModal, setIsOpenModal] = useState(false);

  const loadOrders = useCallback(() => {
    dispatch(getOrdersList(query));
  }, [dispatch, query]);

  const loadInformationWithOrder = useCallback(() => {
    setLoading(true);
    getInformationWithOrder(query)
      .then((res) => {
        setStatusList(res);
        // nếu trạng thái đơn hàng tồn tại trong danh sách thì load lại danh sách đơn hàng
        if (query.order_status === -1 || res?.findIndex((e) => e.id === query.order_status) !== -1) {
          loadOrders();
        }
        // nếu trạng thái đơn hàng không tồn tại trong danh sách thì set lại trạng thái đơn hàng là tất cả
        else {
          dispatch(
            setOrdersQuery({
              ...query,
              order_status: -1,
            }),
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [query, loadOrders, dispatch]);

  useEffect(loadInformationWithOrder, [loadInformationWithOrder, query?.order_type_id]);

  const handleActiveTab = (id) => {
    dispatch(
      setOrdersQuery({
        ...query,
        order_status: id,
      }),
    );
  };

  const handleDelete = async (order_id) => {
    // // Lấy ra vị trí của ca làm việc
    deleteItem({ order_id: order_id })
      .then(() => {
        loadOrders();

        showToast.success(
          getErrorMessage({
            message: 'Xoá dữ liệu thành công.',
          }),
        );
      })
      .catch((error) => {
        let { message } = error;
        showToast.error(
          getErrorMessage({
            message: message || 'Đã xảy ra lỗi vui lòng kiểm tra lại',
          }),
        );
      });
  };

  const handleExportExcel = () => {
    ExportExcelOrder(query)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `DS_Don_Hang.xlsx`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        const { message } = err;
        showToast.error(
          getErrorMessage({
            message: message || 'Đã xảy ra lỗi vui lòng kiểm tra lại',
          }),
        );
      })
      .finally(() => { })
  }

  const [selectedOrders, setSelectedOrders] = useState([]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <OrdersFilter setDataReportSearch={setDataReportSearch} disabled={loadingList || loading} />

        <div className='bw_row bw_mb_1 bw_mt_1 bw_align_items_center'>
          <div className='bw_col_6'>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className='bw_count_cus'>
                <img src={i__file} alt='' />
                Tổng đơn: {totalItems || 0}
              </div>
              {dataReportSearch.order_type?.label?.toLowerCase()?.includes('preorder') ? (
                <BWButton
                  type='success'
                  submit
                  icon='fi fi-rr-eye'
                  content={'Xem báo cáo'}
                  onClick={() => setIsOpenModal(true)}></BWButton>
              ) : null}
            </div>
          </div>
          <div className='bw_col_6 bw_flex bw_justify_content_right bw_align_items_center bw_btn_group'>
            <CheckAccess permission='SL_ORDER_EXPORT'>
              <BWButton
                type='success'
                submit
                icon='fi fi-rr-inbox-out'
                content='Xuất Excel'
                onClick={() => handleExportExcel()} />
            </CheckAccess>
            <BWButton
              type='success'
              submit
              icon='fi fi-rr-add-document'
              content='Thêm mới đơn hàng'
              onClick={() => window._$g.rdr(`/orders/add`)}></BWButton>
          </div>
        </div>

        <ul className='bw_tabs'>
          {/* {user?.user_name === 'administrator' && ( */}
          <li
            onClick={() => {
              if (!(loadingList || loading)) {
                handleActiveTab(-1);
              }
            }}
            className={parseInt(tab_active) === -1 ? `bw_active` : ''}>
            <a className='bw_link' onClick={(e) => e.preventDefault()}>
              {'Tất cả'}
            </a>
          </li>
          {/* )} */}
          {statusList.map((e) => {
            return (
              <CheckAccess permission={e.function_alias}>
                <li
                  onClick={() => {
                    if (!(loadingList || loading)) {
                      handleActiveTab(e?.id);
                    }
                  }}
                  className={parseInt(tab_active) === e?.id ? `bw_active` : ''}>
                  <a className='bw_link' onClick={(e) => e.preventDefault()}>{`${e?.name} (${e?.number_order})`}</a>
                </li>
              </CheckAccess>
            );
          })}
        </ul>

        <OrdersTable
          onChangePage={(page) => {
            dispatch(setOrdersQuery({ ...query, page }));
          }}
          handleDelete={handleDelete}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          loading={loadingList || loading}
          handleChecked={setSelectedOrders}
          dataCalPrices={meta}
        />
      </div>

      {isOpenModal && (
        <ReportModal
          open={isOpenModal}
          onClose={() => {
            setIsOpenModal(false);
          }}
          listOrders={selectedOrders}
          dataReportSearch={dataReportSearch}
        />
      )}
    </React.Fragment>
  );
};

export default OrdersPage;
