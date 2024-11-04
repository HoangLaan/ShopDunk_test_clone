import BWButton from 'components/shared/BWButton/index';
import CheckAccess from 'navigation/CheckAccess';
const { DeleteOutlined, SearchOutlined, EyeOutlined, DownloadOutlined } = require('@ant-design/icons');
const { Button, Tooltip, Tag } = require('antd');
// import styled from 'styled-components';

export const columns = (page = 1, pageSize = 20, handleActionRow, data, dataChoosen, setDataChoosen) => {
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
                  let _data = data.items || [];
                  if (target.checked) {
                    _data.forEach((item) => (dataChoosen[item.stocks_review_level_id] = item));
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
                checked={!!dataChoosen[item.stocks_review_level_id]}
                value={item.stocks_review_level_id}
                onChange={(e) => {
                  if (dataChoosen[item.stocks_review_level_id]) {
                    delete dataChoosen[item.stocks_review_level_id];
                  } else {
                    let itema = (data.items || []).find(
                      (_) => '' + _.stocks_review_level_id === '' + item.stocks_review_level_id,
                    );
                    itema && (dataChoosen[item.stocks_review_level_id] = itema);
                  }
                  console.log(dataChoosen[item.stocks_review_level_id]);
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
      title: 'Tên mức duyệt',
      key: 'stocks_review_level_name',
      dataIndex: 'stocks_review_level_name',
      //align: "center",
      // responsive: ["sm"],
      render: (value, item, index) => {
        return (
          <div>
            <b>{value}</b>
          </div>
        );
      },
      // width: '5%',
    },
    {
      title: 'Hình thức',
      key: 'stocks_review_level_type',
      dataIndex: 'stocks_review_level_type',
      // align: "center",
      // responsive: ["sm"],
      // width: '15%',
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
      //align: "center",
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
            <CheckAccess permission='ST_STOCKSREVIEWLEVEL_EDIT'>
              <BWButton
                style={{ border: 'none', marginRight: '3px' }}
                table
                type='blue'
                icon='fi fi-rr-edit'
                onClick={() => handleActionRow(item, 'edit')}
              />
            </CheckAccess>
            <CheckAccess permission='ST_STOCKSREVIEWLEVEL_VIEW'>
              <BWButton
                style={{ border: 'none', marginRight: '3px' }}
                table
                type='green'
                icon='fi fi-rr-eye'
                onClick={() => handleActionRow(item, 'detail')}
              />
            </CheckAccess>
            <CheckAccess permission='ST_STOCKSREVIEWLEVEL_DEL'>
              <BWButton
                style={{ border: 'none' }}
                table
                type='red'
                icon='fi fi-rr-trash'
                onClick={() => handleActionRow(item, 'delete')}
              />
            </CheckAccess>
          </div>
        );
      },
    },
  ];
};
