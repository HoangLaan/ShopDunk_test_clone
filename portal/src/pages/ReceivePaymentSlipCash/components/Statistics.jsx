import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { getStatistics } from 'services/receive-slip.service';
import styled from 'styled-components';
import { showToast } from 'utils/helpers';
import { formatPrice } from 'utils/index';

const StatisticsWrapper = styled.div`
  height: 100%;
  border: 1px solid #999;
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
  .text-right {
    text-align: right;
    font-weight: bold;
  }
`;

const StatisticsBlock = ({ params }) => {
  const [statistic, setStatistic] = useState({});

  useEffect(() => {
    getStatistics({ payment_type: 1, ...params })
      .then(setStatistic)
      .catch(() => {
        showToast.error('Lấy thông tin thống kê xảy ra lỗi !');
      });
  }, [params]);

  return (
    <StatisticsWrapper>
      <div className='statistic-header'>BÁO CÁO, THỐNG KÊ</div>
      <ul className='statistic-wrapper'>
        <li>
          <div className='bw_row'>
            <div className='bw_col_7'>Tổng thu đầu năm đến hiện tại:</div>
            <div className='bw_col_5'>
              <p className='text-right'>{formatPrice(statistic?.total_receive_by_year, false)}</p>
            </div>
          </div>
        </li>
        <li>
          <div className='bw_row'>
            <div className='bw_col_7'>Tổng chi đầu năm đến hiện tại:</div>
            <div className='bw_col_5'>
              <p className='text-right'>{formatPrice(statistic?.total_expend_by_year, false)}</p>
            </div>
          </div>
        </li>
        <li>
          <div className='bw_row'>
            <div className='bw_col_7'>Tồn quỹ hiện tại:</div>
            <div className='bw_col_5'>
              <p className='text-right'>{formatPrice(statistic?.total_fund, false)}</p>
            </div>
          </div>
        </li>
        <li>
          <div className='bw_row'>
            <div className='bw_col_7'>Tổng thu đầu tháng đến hiện tại:</div>
            <div className='bw_col_5'>
              <p className='text-right'>{formatPrice(statistic?.total_receive_by_month, false)}</p>
            </div>
          </div>
        </li>
        <li>
          <div className='bw_row'>
            <div className='bw_col_7'>Tổng chi đầu tháng đến hiện tại:</div>
            <div className='bw_col_5'>
              <p className='text-right'>{formatPrice(statistic?.total_expend_by_month, false)}</p>
            </div>
          </div>
        </li>
      </ul>
    </StatisticsWrapper>
  );
};

export default StatisticsBlock;
