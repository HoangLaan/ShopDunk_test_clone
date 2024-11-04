import React, { useState } from 'react';
import styled from 'styled-components';
import { FolderOpenOutlined } from '@ant-design/icons';
import FilterSearch from './FilterSearch';
//import ConfirmModal from 'pages/Common/ModalCustom';
import PropTypes from 'prop-types';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  border-bottom: 1px solid #e0e0e0;
`;

const Title = styled.span`
  font-weight: bold;
  font-size: 20px;
  margin-left: 13px;
`;

const IconFolderOpen = styled(FolderOpenOutlined)`
  width: 34px;
  height: 34px;
  background: #2f80ed;
  color: white;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const Header = ({ onChange }) => {
  const [filter, setFilter] = useState(undefined);

  return (
    <Wrapper>
      <Title>
        <IconFolderOpen />
        <span>Quản lý tài liệu</span>
      </Title>
      <FilterSearch
        onChange={setFilter}
        onSubmit={() =>
          onChange({
            ...filter
          })
        }
      />
      {/* <ConfirmModal onlyModal onOk={() => console.log('a')} propsButton={{ label: 'Xác nhận' }} labelButton="test" /> */}
    </Wrapper> 
  );
};

Header.propTypes = {
  onChange: PropTypes.func,
};

Header.defaultProps = {
  onChange: () => {},
};

export default Header;
