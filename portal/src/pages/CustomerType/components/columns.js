import BWButton from 'components/shared/BWButton/index';
import CheckAccess from 'navigation/CheckAccess';
const { Button, Tooltip, Tag } = require('antd');
// import styled from 'styled-components';

export const columns = (
  page = 1,
  pageSize = 20,
  handleActionRow,
  customerType,
  dataChoosen,
  setDataChoosen,
  isAdministrator,
) => {
  return [
    {
      title: () => {
        return (
          <div className='bw_sticky bw_check_sticky bw_text_center '>
            <label className='bw_checkbox bw_text_center' style={{ marginRight: 0 }}>
              <input
                type='checkbox'
                checked={Object.keys(dataChoosen).length > 0}
                onChange={({ target }) => {
                  let _data = customerType.items || [];
                  if (target.checked) {
                    _data.forEach((item) => (dataChoosen[item.customer_type_id] = item));
                    dataChoosen = { ...dataChoosen };
                  } else {
                    dataChoosen = {};
                  }
                  setDataChoosen(dataChoosen);
                }}
              />
              <span style={{ marginRight: 0 }} />
            </label>
          </div>
        );
      },
      key: '#',
      dataIndex: '#',
      align: 'center',
      // responsive: ["sm"],
      render: (value, item, index) => {
        return (
          <div className='bw_sticky bw_check_sticky bw_text_center '>
            <label className='bw_checkbox bw_text_center' style={{ marginRight: 0 }}>
              <input
                type='checkbox'
                checked={!!dataChoosen[item.customer_type_id]}
                value={item.customer_type_id}
                onChange={(e) => {
                  if (dataChoosen[item.customer_type_id]) {
                    delete dataChoosen[item.customer_type_id];
                  } else {
                    let itema = (customerType.items || []).find(
                      (_) => '' + _.customer_type_id === '' + item.customer_type_id,
                    );
                    itema && (dataChoosen[item.customer_type_id] = itema);
                  }
                  dataChoosen = { ...dataChoosen };
                  setDataChoosen(dataChoosen);
                }}
              />
              <span style={{ marginRight: 0 }} />
            </label>
          </div>
        );
      },
      width: '5%',
    },
    {
      title: 'Tên hạng khách hàng',
      key: 'customer_type_name',
      dataIndex: 'customer_type_name',
      //align: "center",
      // responsive: ["sm"],
      render: (value, item, index) => {
        return (
          <div className=''>
            <b
              style={{
                backgroundColor: `${item.color}`,
                color: `${item.color ? '#fff' : ''}`,
                padding: '2px 5px 4px 5px',
                borderRadius: '5px',
              }}>
              {value}
            </b>
          </div>
        );
      },
      // width: '5%',
    },
    {
      title: 'Công ty áp dụng',
      key: 'company_name',
      dataIndex: 'company_name',
      //align: "center",
      // responsive: ["sm"],
      render: (value, item, index) => {
        return <div className='bw_text_left'>{value}</div>;
      },
    },
    {
      title: 'Miền áp dụng',
      key: 'business_name',
      dataIndex: 'business_name',
      // align: "center",
      // responsive: ["sm"],
      // width: '15%',
    },
    {
      title: 'Người tạo',
      key: 'created_user',
      dataIndex: 'created_user',
      //align: "center",
      responsive: ['sm'],
      render: (value, item, index) => {
        return <div className='bw_text_left'>{value}</div>;
      },
      // width: '20%',
    },
    {
      title: 'Ngày tạo',
      key: 'created_date',
      dataIndex: 'created_date',
      align: 'center',
      responsive: ['sm'],
      // width: '10%',
    },
    {
      title: 'Trạng thái',
      key: 'is_active',
      dataIndex: 'is_active',
      align: 'center',
      responsive: ['sm'],
      // width: '13%',
      // width: '100px',
      render: (value, item, index) => {
        return (
          <div>
            {value == 1 ? (
              <Tag color='blue' className='bw_label_outline bw_label_outline_success'>
                Kích hoạt
              </Tag>
            ) : (
              <Tag color='red'>Ẩn</Tag>
            )}
          </div>
        );
      },
    },
    {
      title: 'Thao tác',
      key: '#',
      dataIndex: '#',
      align: 'center',
      responsive: ['sm'],
      width: '150px',
      fixed: 'right',
      render: (value, item, index) => {
        return (
          <div className='bw_sticky bw_action_table bw_text_center'>
            <CheckAccess permission='CRM_CUSTOMERTYPE_EDIT'>
              <BWButton
                style={{
                  border: 'none',
                  marginRight: '3px',
                  color: isAdministrator || !item.is_system ? '' : 'silver',
                }}
                table
                type='green'
                icon='fi fi-rr-edit'
                onClick={() => handleActionRow(item, 'edit')}
                disabled={isAdministrator || !item.is_system ? false : true}
              />
            </CheckAccess>
            <CheckAccess permission='CRM_CUSTOMERTYPE_VIEW'>
              <BWButton
                style={{ border: 'none', marginRight: '3px' }}
                table
                type='green'
                icon='fi fi-rr-eye'
                onClick={() => handleActionRow(item, 'detail')}
              />
            </CheckAccess>
            <CheckAccess permission='CRM_CUSTOMERTYPE_DEL'>
              <BWButton
                style={{
                  border: 'none',
                  color: isAdministrator || !item.is_system ? '' : 'silver',
                }}
                table
                type='red'
                // className="bw_btn_table bw_delete bw_red"
                icon='fi fi-rr-trash'
                onClick={() => handleActionRow(item, 'delete')}
                disabled={isAdministrator || !item.is_system ? false : true}
              />
            </CheckAccess>
          </div>
        );
      },
    },
  ];
};
