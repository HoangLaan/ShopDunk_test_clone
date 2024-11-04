import React from 'react';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import DataTable from 'components/shared/DataTable/index';
import { Select, Tooltip } from 'antd';
import { splitString } from 'utils';
import { changeWorkFlow } from 'services/customer-of-task.service';
import { TASK_PERMISSION } from 'pages/Task/utils/const';
import { CaretDownOutlined } from '@ant-design/icons';

const Table = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, }) => {
  const dispatch = useDispatch();

  const handleTypeChange = (row, task_work_flow_id) => {
    changeWorkFlow({
      task_detail_id: row.task_detail_id,
      task_workflow_old_id: row.task_work_flow_id,
      task_workflow_id: task_work_flow_id,
    })
  };

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: ' bw_name_sticky bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (item, index) => index + 1,
      },
      {
        header: 'Ngày tạo',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'created_date',
      },
      {
        header: 'Mã khách hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'customer_code',
      },
      {
        header: 'Tên khách hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'customer_name',
      },
      {
        header: 'Giới tính',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (value) => (value.gender === 1 ? 'Nam' : 'Nữ'),
      },
      {
        header: 'Ngày sinh',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'birthday',
      },
      {
        header: 'Số điện thoại',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'phone_number',
      },
      {
        header: 'Ghi chú',
        classNameHeader: 'bw_text_center',
        accessor: 'description',
        formatter: (d) => splitString(d.description, 50),
      },
      {
        header: 'Phân loại khách hàng',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'job',
        formatter: (p) => {
          return (
            <Select
              suffixIcon={<CaretDownOutlined />}
              defaultValue={p.task_work_flow_id}
              placeholder={'--Chọn--'}
              options={p.TASKWORKFLOW}
              onChange={(task_work_flow_id) => handleTypeChange(p, task_work_flow_id)}
              style={{
                minWidth: 300,
              }}
            />
          );
        },
      },
      {
        header: 'Thời gian chuyển bước',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        accessor: 'his_change_date',
      },
      {
        header: 'Công việc',
        classNameHeader: 'bw_text_center',
        accessor: 'task_type_name',
      },
      {
        header: 'Chi nhánh chuyển',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'store_name',
      },
      {
        header: 'Ngày chuyển',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'tranfer_date',
        // formatter: (value) => value?.tranfer_date ? moment.utc(value?.tranfer_date).format('DD/MM/YYYY HH:mm') : '',
      },
      {
        header: 'Người chuyển',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'tranfer_user',
      },
      {
        header: 'Nguồn',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'source_name',
      },
      {
        header: 'Nhân viên SO',
        classNameHeader: 'bw_text_center',
        accessor: 'full_name_so',
      },
      {
        header: 'Mã đơn hàng đã mua',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        accessor: 'order_no',
        formatter: (p) => (
          <Tooltip title={p?.order_no}>
            <a
              style={{cursor: 'pointer'}}
              onClick={() => {
                window.open('/orders/detail/' + p.order_id, '_blank'); 
              }}>
              {p?.order_no}
            </a>
          </Tooltip>
        ),
      },
      {
        header: 'Ngày mua',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        accessor: 'order_date',
      },
      {
        header: 'Địa chỉ khách hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'address',
        formatter: (d) => splitString(d.address, 50),
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'CRM_CUSTOMEROFTASK_EDIT',
        onClick: (p) => {
          window._$g.rdr(`/customer-of-task/edit/${p?.task_detail_id}`);
        },
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: TASK_PERMISSION.VIEW,
        onClick: (p) => window._$g.rdr(`/task/detail/${p?.task_detail_id}`),
      },

    ];
  }, [dispatch]);


  return (
    <React.Fragment>
      <DataTable
        hiddenDeleteClick
        noSelect
        loading={loading}
        columns={columns}
        data={data}
        actions={actions}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        onChangePage={onChangePage}
      />
    </React.Fragment>
  );
};

export default Table;
