import React from 'react';
import styled from 'styled-components';
import empty from 'pages/FileManager/assets/empty.svg';

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
const Empty = styled.div`
  position: relative;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background: #f6f6f6;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
  .content {
    margin-top: 19px;
    width: 100%;
    text-align: center;
    h3 {
      margin-bottom: 0px;
    }
    p {
      color: #828282;
    }
  }
`;

const Icon = styled.img``;
const EmptyFile = () => {
  return (
    <Wrapper>
      <Empty>
        <div>
          <Icon src={empty} />
        </div>
        <div className='content'>
          <h3 style={{ fontWeight: 300 }}>Thư mục trống!</h3>
        </div>
      </Empty>
    </Wrapper>
  );
};

export default EmptyFile;
