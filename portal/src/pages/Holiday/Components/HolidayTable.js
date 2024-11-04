import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Tooltip } from 'antd';
// Services
import { deleteHoliday } from '../helpers/call-api';

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

const HolidayTable = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
  const dispatch = useDispatch();

  const columns = useMemo(
    () => [
      {
        header: 'Tên ngày lễ tết',
        accessor: 'holiday_name',
        classNameBody: 'bw_sticky bw_name_sticky',
        classNameHeader: 'bw_sticky bw_name_sticky',
        formatter: (p) => {
          let name = p?.holiday_name;
          return (
            <Tooltip title={name}>
              <b>{name.length > 20 ? `${name?.slice(0, 20)}...` : name}</b>
            </Tooltip>
          );
        },
      },
      {
        header: 'Ngày bắt đầu',
        accessor: 'date_from',
        // classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Ngày kết thúc',
        accessor: 'date_to',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Tổng ngày nghỉ',
        accessor: 'total_day',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Ngày tạo',
        accessor: 'created_date',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Tính công',
        accessor: 'is_apply_work_day',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (p) =>
          p?.is_apply_work_day ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Có</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Không</span>
          ),
      },
      {
        header: 'Trạng thái',
        accessor: 'is_active',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (p) =>
          p?.is_active ? (
            <span className='bw_label_outline bw_label_outline_success text-center' style={{ height: '72px' }}>
              Kích hoạt
            </span>
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
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Thêm mới',
        permission: 'MD_HOLIDAY_ADD',
        onClick: () => window._$g.rdr(`/holiday/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'MD_HOLIDAY_EDIT',
        onClick: (p) => {
          window._$g.rdr(`/holiday/edit/${p?.holiday_id}`);
        },
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'MD_HOLIDAY_VIEW',
        onClick: (p) => {
          window._$g.rdr(`/holiday/detail/${p?.holiday_id}`);
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'MD_HOLIDAY_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () =>
              handleDelete(`${_.holiday_id}`),
            ),
          ),
      },
    ];
  }, []);

  const handleDelete = async (arr) => {
    await deleteHoliday({ list_id: arr });
    onRefresh();
  };

  const handleBulkAction = (items, action) => {
    let arrDel = items?.map((item) => item?.holiday_id)?.join(',');
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

export default HolidayTable;
