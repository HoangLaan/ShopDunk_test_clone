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

function ModalLoading({ title = 'Đang xuất file Excel ...' }) {
  return (
    <div className='bw_modal bw_modal_open' id='bw_export_loading'>
      <div
        className='bw_modal_container bw_filter'
        style={{ width: 100, background: 'transparent', boxShadow: 'none' }}>
        <div className='text-center'>
          <span>
            <LoadingOutlinedStyled />
          </span>
        </div>
      </div>
    </div>
  );
}

export default ModalLoading;
