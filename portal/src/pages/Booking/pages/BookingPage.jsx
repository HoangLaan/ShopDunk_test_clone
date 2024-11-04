import React, { useCallback, useEffect, useState } from 'react';
import { showToast } from 'utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { deleteItem, getListBooking } from 'pages/Booking/helpers/call-api';
import { getErrorMessage } from 'utils/index';
import { getOrdersList, setOrdersQuery } from 'pages/Booking/actions/actions';
import BookingTable from 'pages/Booking/components/main/BookingTable';
import OrdersFilter from 'pages/Booking/components/main/OrdersFilter';
import BWButton from 'components/shared/BWButton/index';
import i__file from 'assets/bw_image/icon/i__file.svg';
import { AppointmentStatusOpts } from 'pages/Booking/helpers/constans';
import CustomerCareService from 'services/customer-care.service';
import CheckAccess from 'navigation/CheckAccess';

const BookingPage = () => {
  const [tabActive, setTabActive] = useState(-1);
  const [dataReportSearch, setDataReportSearch] = useState({});
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { dataOrders, loadingList, query } = useSelector((state) => state.orders);
  const { items = [], itemsPerPage, page, totalItems, totalPages } = dataOrders;
  const [appointment_status, setAppointmentStatus] = useState(0);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [tabCounts, setTabCounts] = useState({});

  // Calculate counts for tabs
  useEffect(() => {
    const counts = {};
    AppointmentStatusOpts.forEach((o) => {
      const count = items.filter((item) => item.appointment_status === o.value).length;
      counts[o.value] = count;
    });
    setTabCounts(counts);
  }, [items]);

  const loadOrders = useCallback(() => {
    dispatch(getOrdersList(query));
  }, [dispatch, query]);

  const loadInformationWithOrder = useCallback(() => {
    setLoading(true);
    getListBooking(query)
      .then((res) => {
        const apiAppointmentStatus = res?.items?.[0]?.appointment_status;
        setAppointmentStatus(apiAppointmentStatus || 0);
        loadOrders();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [query, loadOrders, dispatch]);

  useEffect(loadInformationWithOrder, [loadInformationWithOrder]);

  const handleDelete = async (booking_id) => {
    deleteItem({ booking_id: booking_id })
      .then(() => {
        loadOrders();
        showToast.success(getErrorMessage({ message: 'Xoá dữ liệu thành công.' }));
      })
      .catch((error) => {
        let { message } = error;
        showToast.error(
          getErrorMessage({
            message: message || 'Đã xảy ra lỗi vui lòng kiểm tra lại',
          })
        );
      });
  };



  const handleTabClick = (value) => {
    if (value === -1) {
      window.location.reload();
      return; // Dừng hàm ở đây để tránh thực hiện các bước tiếp theo
    }
    setTabActive(value);
    dispatch(setOrdersQuery({ ...dataOrders.query, appointment_status: value }));
  };

  const exportExcel = () => {
    const params = {};
    CustomerCareService.exportExcelB(params)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Danh_sach_dat_lich_SDCare.xlsx');
        document.body.appendChild(link);
        link.click();
      })
      .catch(() => { });
  };

  return (
    <React.Fragment>
      <div className='bw_main_wrapp custom-booking'>
        <OrdersFilter setDataReportSearch={setDataReportSearch} disabled={loadingList || loading} />

        <div className='bw_row bw_mb_1 bw_mt_1 bw_align_items_center'>
          <div className='bw_col_6'>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className='bw_count_cus'>
                <img src={i__file} alt='' />
                Tổng số đặt lịch: {totalItems || 0}
              </div>
              {dataReportSearch.order_type?.label?.toLowerCase()?.includes('preorder') && (
                <BWButton
                  type='success'
                  submit
                  icon='fi fi-rr-eye'
                  content={'Xem báo cáo'}
                  onClick={() => setIsOpenModal(true)}
                />
              )}
            </div>
          </div>


          <div className='bw_col_6 bw_flex bw_justify_content_right bw_align_items_center bw_btn_group btn_group-send'>
            <CheckAccess permission='ST_BOOKING_EXPORT'>
              <BWButton
                type='success'
                globalAction='true'
                icon='fi fi-rr-inbox-out'
                content='Xuất excel'
                onClick={exportExcel}
              />
            </CheckAccess>
            <BWButton
              type='success'
              submit
              icon='fi fi-rr-add-document'
              content='Thêm mới'
              onClick={() => window._$g.rdr(`/booking/add`)}
            />
          </div>
        </div>

        <ul className='bw_tabs'>
          <li
            onClick={() => handleTabClick(-1)}
            className={tabActive === -1 ? 'bw_active' : ''}
          >
            <a className='bw_link' style={{ whiteSpace: 'nowrap' }}>
              {'Tất cả'}
            </a>
          </li>

          {AppointmentStatusOpts.map((o) => (
            <li
              key={o.value}
              onClick={() => handleTabClick(o.value)}
              className={tabActive === o.value ? 'bw_active' : ''}
            >
              <a className='bw_link' style={{ whiteSpace: 'nowrap' }}>
                {`${o?.label} (${tabCounts[o.value] || 0})`}
              </a>
            </li>
          ))}
        </ul>

        <BookingTable
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
        />
      </div>


    </React.Fragment>
  );
};

export default BookingPage;
