import React from 'react';
import { Dropdown, Menu, Space } from 'antd';
import styled from 'styled-components';
import { MoreOutlined } from '@ant-design/icons';
import move from 'pages/FileManager/assets/move.svg';
const DropdownStyled = styled(Dropdown)`
  .ant-space-item {
    display: block !important;
  }
`;

const Manipulation = styled.div`
  display: flex;
  align-items: center;
  width: 400px;
  height: 41px;
  font-size: 16px;
  line-height: 28px;
  img {
    margin-left: 23px;
    margin-right: 25px;
  }
`;

const menu = (
  <Menu
    items={[
      {
        key: '1',
        label: (
          <Manipulation>
            <img src={move}></img>
            <span> Di chuyển tới</span>
          </Manipulation>
        ),
      },
      {
        key: '2',
        label: (
          <Manipulation>
            <img src={move}></img>
            <span> Di chuyển tới</span>
          </Manipulation>
        ),
      },
      {
        key: '3',
        label: (
          <Manipulation>
            <img src={move}></img>
            <span> Di chuyển tới</span>
          </Manipulation>
        ),
      },
    ]}
  />
);

const App = () => (
  <Space direction="vertical">
    <Space wrap>
      <DropdownStyled overlay={menu} placement="topRight">
        <MoreOutlined />
      </DropdownStyled>
    </Space>
  </Space>
);

export default App;
