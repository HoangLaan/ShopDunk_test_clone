import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import { getStatistics } from 'services/lockshift-close.service';
import BWAccordion from 'components/shared/BWAccordion/index';
import { FaDollarSign } from 'react-icons/fa';
import { formatPrice } from 'utils/index';
import { showToast } from 'utils/helpers';
import styled from 'styled-components';

const IconWrapper = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: var(--greenColor);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
`;

const Statistics = ({ lockshiftId }) => {
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    getStatistics(lockshiftId)
      .then((statistics) => {
        setStatistics(statistics);
      })
      .catch((err) => {
        showToast.error(err);
      });
  }, [lockshiftId]);

  return (
    <BWAccordion title={'Thống kê cuối ca'} id='bw_info_cus'>
      <div className='bw_row bw_align_items_center'>
        <div className='bw_col_2'>
          <IconWrapper>
            <FaDollarSign size={32} color={'white'} />
          </IconWrapper>
        </div>
        <div className='bw_col_3'>
          <ul>
            <li>
              Tổng tiền mặt cuối ca: <b>{formatPrice(statistics?.current_total_money, true)}</b>
            </li>
            <li>
              Chênh lệch: <b>{formatPrice(statistics?.current_total_money - statistics?.previous_total_money, true)}</b>
            </li>
            <li>
              Tổng số lượng sản phẩm: <b>{statistics?.product_count}</b>
            </li>
          </ul>
        </div>
        <div className='bw_col_7'>
          <ul>
            <li>
              Tổng số lượng đơn hàng: <b>{statistics?.order_count}</b>
            </li>
          </ul>
        </div>
      </div>
    </BWAccordion>
  );
};

export default Statistics;
