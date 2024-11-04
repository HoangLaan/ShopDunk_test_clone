import BWButton from 'components/shared/BWButton/index';
import CheckAccess from 'navigation/CheckAccess';
import styled from 'styled-components';
const { Button, Tooltip, Tag } = require('antd');

const ButtonStyle = styled.a`
  color: ${(props) =>
    props.color === 'bw_blue'
      ? '#2F80ED'
      : props.color === 'bw_green'
      ? '#119480'
      : props.color === 'bw_red'
      ? '#EC2D41'
      : ''} !important;
  margin-right: 3px;
`;
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
                    _data.forEach((item) => (dataChoosen[item.company_id] = item));
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
      //className:'bw',
      // responsive: ["sm"],
      render: (value, item, index) => {
        return (
          <div className='bw_sticky bw_check_sticky bw_text_center '>
            <label className='bw_checkbox bw_text_center' style={{ marginRight: 0 }}>
              <input
                type='checkbox'
                checked={!!dataChoosen[item.company_id]}
                value={item.company_id}
                onChange={(e) => {
                  if (dataChoosen[item.company_id]) {
                    delete dataChoosen[item.company_id];
                  } else {
                    let itema = (data.items || []).find((_) => '' + _.company_id === '' + item.company_id);
                    itema && (dataChoosen[item.company_id] = itema);
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
      title: 'Tên công ty',
      key: 'company_name',
      dataIndex: 'company_name',
      align: 'center',
      // responsive: ["sm"],
      render: (value, item, index) => {
        return (
          <div>
            <p>{value}</p>
          </div>
        );
      },
      width: '15%',
    },
    {
      title: 'Loại hình công ty',
      key: 'company_type_name',
      dataIndex: 'company_type_name',
      align: 'center',
      // responsive: ["sm"],
      width: '10%',
    },
    {
      title: 'Số điện thoại',
      key: 'phone_number',
      dataIndex: 'phone_number',
      align: 'center',
      width: '10%',
    },

    {
      title: 'Email',
      key: 'email',
      dataIndex: 'email',
      align: 'center',
      responsive: ['sm'],
      render: (value, item, index) => {
        return <div className='bw_text_left'>{value}</div>;
      },
      // width: '20%',
    },
    {
      title: 'Địa chỉ',
      key: 'address_full',
      dataIndex: 'address_full',
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
            <CheckAccess permission='AM_COMPANY_EDIT'>
              <ButtonStyle
                onClick={() => handleActionRow(item, 'edit')}
                style={{
                  marginRight: '2px',
                }}
                color='bw_blue'
                className={`bw_btn_table bw_blue`}>
                <i className={`fi fi-rr-edit`} />
              </ButtonStyle>
            </CheckAccess>
            <CheckAccess permission='AM_COMPANY_VIEW'>
              <ButtonStyle
                onClick={() => handleActionRow(item, 'detail')}
                style={{
                  marginRight: '2px',
                }}
                color='bw_green'
                className={`bw_btn_table bw_green`}>
                <i className={`fi fi-rr-eye`} />
              </ButtonStyle>
            </CheckAccess>
            <CheckAccess permission='AM_COMPANY_DEL'>
              <ButtonStyle
                onClick={() => handleActionRow(item, 'delete')}
                style={{
                  marginRight: '2px',
                }}
                color='bw_red'
                className={`bw_btn_table bw_red`}>
                <i className={`fi fi-rr-trash`} />
              </ButtonStyle>
            </CheckAccess>
          </div>
        );
      },
    },
  ];
};
