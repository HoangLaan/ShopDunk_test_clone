import React, {useState, useEffect} from 'react';
import {getStatistics} from 'services/lockshift-open.service';
import BWAccordion from 'components/shared/BWAccordion/index';
import {FaDollarSign} from 'react-icons/fa';
import {formatPrice} from 'utils/index';
import {showToast} from 'utils/helpers';
import styled from 'styled-components';
import LockShiftOpenContext from '../context/LockShiftOpenContext';
import { useContext } from 'react';

const IconWrapper = styled.div`
  width: 70px;
  height 70px;
  border-radius: 50%;
  background-color: var(--greenColor);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
`;

const Statistics = ({lockShiftId}) => {
  const context = useContext(LockShiftOpenContext);
  const [statistics, setStatistics] = useState({});


  useEffect(() => {
    getStatistics({lockShiftId})
      .then((statistics) => {
        setStatistics(statistics);
        context.setStatistic(statistics);
      })
      .catch((err) => {
        showToast.error(err);
      });
  }, [lockShiftId]);

  return (
    <BWAccordion title={'Thống kê đầu ca'} id='bw_info_cus'>
      <div className='bw_row bw_align_items_center'>
        <div className='bw_col_2'>
          <IconWrapper>
            <FaDollarSign size={32} color={'white'}/>
          </IconWrapper>
        </div>
        <div className='bw_col_3'>
          <ul>
            <li>
              Tổng tiền mặt đầu ca: <b>{formatPrice(statistics?.current_total_money, true)}</b>
            </li>
            <li>
              Chênh lệch: <b>{formatPrice(statistics?.previous_total_money - statistics?.current_total_money, true)}</b>
            </li>

          </ul>
        </div>
        <div className='bw_col_7'>
          <ul>
            <li>
              Tổng số lượng sản phẩm: <b>{statistics?.product_count}</b>
            </li>
          </ul>
        </div>
      </div>
    </BWAccordion>
  );
};

export default Statistics;
