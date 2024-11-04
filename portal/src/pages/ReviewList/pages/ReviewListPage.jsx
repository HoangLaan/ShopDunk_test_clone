import React, { useCallback, useEffect, useState } from 'react';
import { showToast } from 'utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { deleteItem, getListReview } from 'pages/ReviewList/helpers/call-api';
import { getErrorMessage } from 'utils/index';
import { setOrdersQuery, getOrdersList } from 'pages/ReviewList/actions/actions';
import ReviewTable from 'pages/ReviewList/components/main/ReviewTable';
import OrdersFilter from 'pages/ReviewList/components/main/OrdersFilter';
import BWButton from 'components/shared/BWButton/index';
import i__file from 'assets/bw_image/icon/i__file.svg';
import { AppointmentStatusOpts } from 'pages/ReviewList/helpers/constans';
import CustomerCareService from 'services/customer-care.service';

const ReviewPage = () => {
  const [tabActive, setTabActive] = useState(-1);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { dataOrders, loadingList, query } = useSelector((state) => state.review);
  const { items = [], itemsPerPage, page, totalItems, totalPages } = dataOrders;
  // const [appointment_status, setAppointmentStatus] = useState(0);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [tabCounts, setTabCounts] = useState({});

  useEffect(() => {
    const [data] = items;

    if (items.length === 0) {
      setTabCounts({
        1: 0,
        2: 0,
        3: 0,
      });
      return;
    }

    setTabCounts({
      1: data.TOTALPENDINGITEMS || 0,
      2: data.TOTALAPPROVEDITEMS || 0,
      3: data.TOTALREJECTEDITEMS || 0,
    });
  }, [items]);
  const loadOrders = useCallback(() => {
    dispatch(getOrdersList(query));
  }, [dispatch, query]);

  const loadInformationWithOrder = useCallback(() => {
    setLoading(true);
    getListReview(query)
      .then((res) => {
        loadOrders();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [loadOrders, query]);

  useEffect(loadInformationWithOrder, [loadInformationWithOrder]);

  const handleDelete = async (CUSTOMERCOMMENTID) => {
    deleteItem({ CUSTOMERCOMMENTID: CUSTOMERCOMMENTID })
      .then(() => {
        loadOrders();
        showToast.success(getErrorMessage({ message: 'Xoá dữ liệu thành công.' }));
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

  const handleTabClick = (value) => {
    if (value === -1) {
      window.location.reload();
      return; // Dừng hàm ở đây để tránh thực hiện các bước tiếp theo
    }
    setTabActive(value);
    dispatch(setOrdersQuery({ ...dataOrders.query, comment_status: value }));
  };

  const exportExcel = () => {
    // const params = {};
    CustomerCareService.exportExcelReview(query)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'customer_comment.xlsx');
        document.body.appendChild(link);
        link.click();
      })
      .catch(() => {});
  };

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <OrdersFilter disabled={loadingList || loading} />

        <div className='bw_row bw_mb_1 bw_mt_1 bw_align_items_center'>
          <div className='bw_col_6'>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className='bw_count_cus'>
                <img src={i__file} alt='' />
                Tổng số đánh giá: {totalItems || 0}
              </div>
            </div>
          </div>

          <div className='bw_col_6 bw_flex bw_justify_content_right bw_align_items_center'>
            <BWButton
              type='success'
              globalAction='true'
              icon='fi fi-rr-inbox-out'
              content='Xuất excel'
              onClick={exportExcel}
            />
          </div>
        </div>

        <ul className='bw_tabs'>
          <li onClick={() => handleTabClick(-1)} className={tabActive === -1 ? 'bw_active' : ''}>
            <a className='bw_link' style={{ whiteSpace: 'nowrap' }}>
              {'Tất cả'}
            </a>
          </li>

          {AppointmentStatusOpts.map((o) => (
            <li
              key={o.value}
              onClick={() => handleTabClick(o.value)}
              className={tabActive === o.value ? 'bw_active' : ''}>
              <a className='bw_link' style={{ whiteSpace: 'nowrap' }}>
                {`${o?.label} (${tabCounts[o.value] || 0})`}
              </a>
            </li>
          ))}
        </ul>

        <ReviewTable
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
          onReloadOrders={loadOrders}
        />
      </div>
    </React.Fragment>
  );
};

export default ReviewPage;
