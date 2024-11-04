import React from 'react';

import { LoadingOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const LoadingOutlinedStyled = styled(LoadingOutlined)`
  color: var(--blueColor);
  width: 100%;
  display: flex;
  justify-content: center;
  font-size: 30px;
  margin-top: 15px;
  margin-bottom: 15px;
`;

const Loading = () => {
  return <LoadingOutlinedStyled />;
};

export default Loading;
