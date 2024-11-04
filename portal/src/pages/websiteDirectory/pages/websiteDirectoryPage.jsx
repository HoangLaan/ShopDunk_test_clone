import React, { useCallback, useEffect, useState } from 'react';
import { showToast } from 'utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { deleteItem, getListReview } from 'pages/websiteDirectory/helpers/call-api';
import { getErrorMessage } from 'utils/index';
import { setOrdersQuery, getOrdersList } from 'pages/websiteDirectory/actions/actions';
import WebSiteTable from 'pages/websiteDirectory/components/main/WebsiteTable';
import OrdersFilter from 'pages/websiteDirectory/components/main/OrdersFilter';
import BWButton from 'components/shared/BWButton/index';
import i__file from 'assets/bw_image/icon/i__file.svg';
import { AppointmentStatusOpts } from 'pages/websiteDirectory/helpers/constans';
import CustomerCareService from 'services/customer-care.service';
import CheckAccess from 'navigation/CheckAccess';

const WebsiteDirectoryPage = () => {
  const [tabActive, setTabActive] = useState(-1);
  const [dataReportSearch, setDataReportSearch] = useState({});
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { dataOrders, loadingList, query } = useSelector((state) => state.website);
  const { items = [], itemsPerPage, page, totalItems, totalPages } = dataOrders;
  const [appointment_status, setAppointmentStatus] = useState(0);
  const [selectedOrders, setSelectedOrders] = useState([]);

  // Calculate counts for tabs

  const loadOrders = useCallback(() => {
    dispatch(getOrdersList(query));
  }, [dispatch, query]);

  const loadInformationWithOrder = useCallback(() => {
    setLoading(true);
    getListReview(query)
      .then((res) => {
        const apiAppointmentStatus = res?.items?.[0]?.appointment_status;
        setAppointmentStatus(apiAppointmentStatus || 0);
        loadOrders();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [loadOrders, query]);

  useEffect(loadInformationWithOrder, [loadInformationWithOrder]);

  const handleDelete = async (website_category_id) => {
    // xóa ở đây nhé
    deleteItem({ id: website_category_id })
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
    dispatch(setOrdersQuery({ ...dataOrders.query }));
  };

  const exportExcel = () => {
    CustomerCareService.exportExcelWebSite(query)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'menu_website.xlsx');
        document.body.appendChild(link);
        link.click();
      })
      .catch(() => {});
  };

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <OrdersFilter setDataReportSearch={setDataReportSearch} disabled={loadingList || loading} />

        <div className='bw_row bw_mb_1 bw_mt_1 bw_align_items_center'>
          <div className='bw_col_6'>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className='bw_count_cus'>
                <img src={i__file} alt='' />
                Danh mục website: {totalItems || 0}
              </div>
            </div>
          </div>

          <div className='bw_col_6 bw_flex bw_justify_content_right bw_align_items_center bw_btn_group '>
            <CheckAccess permission={'CRM_CUSTOMEROFTASK_EXPORT'}>
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
              onClick={() => window._$g.rdr(`/menu-website/add`)}
            />
          </div>
        </div>

        <ul className='bw_tabs'>
          {/* <li onClick={() => handleTabClick(-1)} className={tabActive === -1 ? 'bw_active' : ''}>
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
          ))} */}
        </ul>

        <WebSiteTable
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

export default WebsiteDirectoryPage;
