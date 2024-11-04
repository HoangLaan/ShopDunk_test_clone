import React from 'react';
import styled from 'styled-components';

const StatisticsWrapper = styled.div`
  height: 100%;
  border: 1px solid #999;
  user-select: none;
  .statistic-header {
    padding: 10px;
    font-weight: bold;
    border-bottom: 1px solid #999;
    background-color: #ccc;
  }
  .statistic-wrapper {
    padding: 10px;
  }
  li {
    margin-bottom: 5px;
  }
  .bw_col_4 {
    display: flex;
    justify-content: flex-end;
  }
  .text-right {
    width: 60px;
    min-width: 60px;
    text-align: right;
    font-weight: bold;
    padding: 5px 10px;
    border: 1px solid #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const StatisticsBlock = ({ meta }) => {
  return (
    <StatisticsWrapper>
      <ul className='statistic-wrapper'>
        <li>
          <div className='bw_row'>
            <div className='bw_col_8'>Đã gửi</div>
            <div className='bw_col_4'>
              <p className='text-right'>{meta?.sent}</p>
            </div>
          </div>
        </li>
        <li>
          <div className='bw_row'>
            <div className='bw_col_8'>Đã nhận</div>
            <div className='bw_col_4'>
              <p className='text-right'>{(meta?.sent || 0) - (meta?.rejects || 0) - (meta?.scheduled || 0)}</p>
            </div>
          </div>
        </li>
        <li>
          <div className='bw_row'>
            <div className='bw_col_8'>Đã mở</div>
            <div className='bw_col_4'>
              <p className='text-right'>{meta?.opens || 0}</p>
            </div>
          </div>
        </li>
        <li>
          <div className='bw_row'>
            <div className='bw_col_8'>Đã click</div>
            <div className='bw_col_4'>
              <p className='text-right'>{meta?.clicks || 0}</p>
            </div>
          </div>
        </li>
        <li>
          <div className='bw_row'>
            <div className='bw_col_8'>Đặt lịch</div>
            <div className='bw_col_4'>
              <p className='text-right'>{meta?.scheduled}</p>
            </div>
          </div>
        </li>
        <li>
          <div className='bw_row'>
            <div className='bw_col_8'>Thất bại</div>
            <div className='bw_col_4'>
              <p className='text-right'>{meta?.rejects || 0}</p>
            </div>
          </div>
        </li>
      </ul>
    </StatisticsWrapper>
  );
};

export default StatisticsBlock;
