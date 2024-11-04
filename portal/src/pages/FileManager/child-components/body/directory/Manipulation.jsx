import React from 'react';
import styled from 'styled-components';
import create from 'pages/FileManager/assets/create.svg';
import more from 'pages/FileManager/assets/more.svg';
import trash from 'pages/FileManager/assets/trash.svg';
import userAdd from 'pages/FileManager/assets/user-add.svg';

const Wrapper = styled.div`
  width: 100% !important;
  height: 69px !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px;

`;

const LeftIcon = styled.div`
  svg {
    font-size: 25px;
    margin-right: 5px;
  }
`;
const RightIcon = styled.div`
  svg {
    font-size: 25px;
    margin-right: 5px;
    color: #2f80ed !important;
  }
`;

const Icon = styled.img`
  font-size: 16px;
  margin-right: 18px;
`;

const Manipulation = ({ data }) => {
  return (
    <Wrapper>
      <LeftIcon>
        <Icon src={userAdd} />
        <Icon src={trash} />
        <Icon src={more} />
      </LeftIcon>
      <RightIcon>
        <Icon src={create} />
      </RightIcon>
    </Wrapper>
  );
};

export default Manipulation;
