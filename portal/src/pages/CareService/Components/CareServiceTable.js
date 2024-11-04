import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Tooltip } from 'antd';
// Services
import { deleteCareService } from '../helpers/call-api';
import { formatPrice } from 'utils';
const spanStyle = {
  width: '20%',
  display: 'inline-block',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  position: 'relative',
};

// const toolTip = {
//   position: 'relative',
//   display : 'inline-block',
//   borderBottom : '1px dotted black'
// }

const tooltiptext = {
  visibility: 'hidden',
  width: '120px',
  textAlign: 'center',
  borderRadius: '6px',
  padding: '5px , 0',
  width: '120px',
  top: '100%',
  left: '50%',
  marginLeft: '-60px',
};

const CareServiceTable = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
  const dispatch = useDispatch();

  const columns = useMemo(
    () => [
      {
        header: 'Mã dịch vụ',
        accessor: 'care_service_code',
        classNameBody: 'bw_sticky bw_name_sticky',
        classNameHeader: 'bw_sticky bw_name_sticky',
        formatter: (p) => {
          let name = p?.care_service_code;
          return (
            <Tooltip title={name}>
              <b>{name}</b>
            </Tooltip>
          );
        },
      },
      {
        header: 'Tên dịch vụ',
        accessor: 'care_service_name',
        classNameBody: 'bw_sticky bw_name_sticky',
        classNameHeader: 'bw_sticky bw_name_sticky',
        // formatter: (p) => {
        //   let name = p?.care_service_name;
        //   return (
        //     <Tooltip title={name}>
        //       <b>{name?.length > 20 ? `${name?.slice(0, 20)}...` : name}</b>
        //     </Tooltip>
        //   );
        // },
      },
      {
        header: 'Nhóm dịch vụ',
        accessor: 'group_service_name',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        // formatter: (p) => {
        //   let name = p?.group_service_name;
        //   return (
        //     <Tooltip title={name}>
        //       <b>{name?.length > 20 ? `${name?.slice(0, 20)}...` : name}</b>
        //     </Tooltip>
        //   );
        // },
      },
      {
        header: 'Thời gian sửa chữa',
        accessor: 'model_name',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (p) => {
          let fromDate = p?.type_time_repair_from;
          let toDate = p?.type_time_repair_to;
          return (
            <Tooltip title='Thời gian sửa chữa'>
              {`${fromDate} - ${toDate} phút`}
            </Tooltip>
          );
        },
      },
      {
        header: 'Phí dịch vụ',
        accessor: 'model_name',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (p) => {
          let costService = formatPrice(p?.cost_service);
          return (
            <Tooltip title={costService}>
              {costService}
            </Tooltip>
          );
        },
      },
      {
        header: 'Phí sau khuyến mãi',
        accessor: 'cost_promotion',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (p) => {
          // let costService = p?.cost_service;
          // let costPromotion = p?.cost_promotion;
          // let costResult = costService - costPromotion;
          let cost_promotion = formatPrice(p?.cost_promotion);
          return (
            <Tooltip title={cost_promotion}>
              {cost_promotion}
            </Tooltip>
          );
        },
      },
      {
        header: 'Trạng thái',
        accessor: 'model_name',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (p) =>
          p?.is_active ? (
            <span class='bw_label_outline bw_label_outline_success text-center'>Kích hoạt</span>
          ) : (
            <span class='bw_label_outline bw_label_outline_danger text-center'>Ẩn</span>
          ),
      },
      {
        header: 'Hiển thị trên web',
        accessor: 'model_name',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (p) =>
          p?.is_show_web ? (
            <span class='bw_label_outline bw_label_outline_success text-center'>Hiển thị</span>
          ) : (
            <span class='bw_label_outline bw_label_outline_danger text-center'>Ẩn</span>
          ),

      },
      {
        header: 'Ngày tạo',
        accessor: 'created_date',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Người tạo',
        accessor: 'created_user',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
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
        permission: 'MD_CARESERVICE_ADD',
        onClick: () => window._$g.rdr(`/care-service/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'MD_CARESERVICE_EDIT',
        onClick: (p) => {
          window._$g.rdr(`/care-service/edit/${p?.care_service_code}`);
        },
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'MD_CARESERVICE_VIEW',
        onClick: (p) => {
          window._$g.rdr(`/care-service/edit/${p?.care_service_code}`);
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'MD_CARESERVICE_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () =>
              handleDelete(`${_.care_service_code}`),
            ),
          ),
      },
    ];
  }, []);

  const handleDelete = async (arr) => {
    await deleteCareService({ list_id: arr });
    onRefresh();
  };

  const handleBulkAction = (items, action) => {
    let arrDel = items?.map((item) => item?.care_service_id)?.join(',');
    if (action === 'delete') {
      dispatch(
        showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () => {
          handleDelete(arrDel);
          // (items || []).forEach((item) => {
          //   handleDelete(item.solution_id);
          // });
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

export default CareServiceTable;
