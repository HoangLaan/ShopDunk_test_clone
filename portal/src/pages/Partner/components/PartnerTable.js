import DataTable from 'components/shared/DataTable/index';
import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import { deletePartner } from 'services/partner.service';
import useVerifyAccess from 'hooks/useVerifyAccess';
import TooltipHanlde from 'components/shared/TooltipWrapper';
import { getListPartner } from 'services/partner.service';
import { showToast } from 'utils/helpers';
import { StyledCareActions } from 'pages/CustomerLead/utils/styles';
import i__cus_home from 'assets/bw_image/icon/i__cus_home.svg';
import CheckAccess from 'navigation/CheckAccess';
import BWButton from 'components/shared/BWButton';


let isStopLoadedData = false;

const PartnerTable = ({
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onRefresh,
  setSelectedCustomer,
  selectedCustomer,
  tableKey,
  setOpenModalSelectAll,
  setLoadedData,
  setTableKey,
  openModalSelectAll,
  handleExportExcel
}) => {
  const dispatch = useDispatch();
  const { verify } = useVerifyAccess({});
  isStopLoadedData = !openModalSelectAll;

  const isPermissionEdit = verify({ function: 'CRM_PARTNER_EDIT' });

  const columns = useMemo(
    () => [
      {
        header: 'Mã khách hàng DN',
        accessor: 'partner_code',
        classNameHeader: 'bw_sticky bw_name_sticky',
        classNameBody: 'bw_sticky bw_name_sticky',
      },
      {
        header: 'Tên khách hàng DN',
        accessor: 'partner_name',
        classNameHeader: 'bw_text_center',
        formatter: (item) => (
          <span onClick={(_) => isPermissionEdit && window._$g.rdr(`/partner/edit/${item?.partner_id}`)}>
            {item.partner_name}
          </span>
        ),
      },
      {
        header: 'Mã số thuế',
        accessor: 'tax_code',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Số điện thoại',
        accessor: 'phone_number',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Nhân viên phụ trách',
        accessor: 'caring_user_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Địa chỉ',
        accessor: 'address',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <TooltipHanlde>{p?.address}</TooltipHanlde>,
      },
      {
        header: 'Trạng thái',
        accessor: 'is_active',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) =>
          p?.is_active ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Kích hoạt</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Ẩn</span>
          ),
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fa fa-street-view',
        type: 'success',
        outline: true,
        content: 'Chọn tất cả',
        onClick: async () => {
          try {
            setOpenModalSelectAll(true);
            const result = [];
            const updateResult = (newArray = []) => {
              for (let i = 0; i < newArray.length; i++) {
                const indexMemberId = result.findIndex((x) => x?.partner_id === newArray[i]?.partner_id);
                if (indexMemberId === -1) {
                  result.push(newArray[i]);
                }
              }
              setLoadedData(result);
              setTableKey((prev) => ++prev);
            };
            const firstRes = await getListPartner({ is_active: 1, page: 1, itemsPerPage: 250 });
            updateResult(firstRes.items);
            for (let page = 2; page <= firstRes.totalPages; page++) {
              if (isStopLoadedData) {
                continue;
              }
              const pageRes = await getListPartner({ is_active: 1, page, itemsPerPage: 250 });
              updateResult(pageRes?.items || []);
            }
          } catch (error) {
            showToast.error('Lấy danh sách khách hàng xảy ra lỗi !');
          }
        },
      },
      {
        globalAction: true,
        icon: 'fi fi-rr-inbox-out',
        type: 'success',
        content: 'Export',
        outline: true,
        permission: 'CRM_PARTNER_EXPORT',
        onClick: () => handleExportExcel(),
      },
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm mới',
        permission: 'CRM_PARTNER_ADD',
        onClick: () => window._$g.rdr(`/partner/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'CRM_PARTNER_EDIT',
        onClick: (p) => window._$g.rdr(`/partner/edit/${p?.partner_id}`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'CRM_PARTNER_VIEW',
        onClick: (p) => window._$g.rdr(`/partner/detail/${p?.partner_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        title: 'Xóa',
        permission: 'CRM_PARTNER_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deletePartner([_?.partner_id]);
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, []);

  return (
    <>
      <StyledCareActions>
        <div className='bw_row bw_row_actions_custom'>
          <div className='bw_col_6 bw_table_top_badges'>
            <div className='bw_care_actions_count'>
              <img src={i__cus_home} alt='total items' />
              Tổng số khách hàng doanh nghiệp: {totalItems.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
            </div>
          </div>
          <div className='bw_col_6 bw_flex bw_justify_content_right bw_align_items_center bw_btn_group'>
            {actions
              ?.filter((p) => p.globalAction && !p.hidden)
              .map((props, i) => (
                <CheckAccess permission={props?.permission}>
                  <BWButton style={{ marginLeft: '3px' }} {...props} />
                </CheckAccess>
              ))}
          </div>
        </div>
      </StyledCareActions>
      <DataTable
        key={tableKey}
        loading={loading}
        columns={columns}
        data={data}
        // actions={actions}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        onChangePage={onChangePage}
        defaultDataSelect={selectedCustomer}
        onChangeSelect={setSelectedCustomer}
        handleBulkAction={(e) => {
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deletePartner(e?.map((val) => parseInt(val?.partner_id)));
                onRefresh();
              },
            ),
          );
        }}
      />
    </>
  );
};

export default PartnerTable;
