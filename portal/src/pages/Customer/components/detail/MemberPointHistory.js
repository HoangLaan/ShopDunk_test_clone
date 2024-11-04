import percentIcon from 'assets/bw_image/icon/i__percent.svg';
import bagIcon from 'assets/bw_image/icon/i__bags_re.svg';
import { useState } from 'react';
import { formatPrice } from 'utils/index';
import TablePointHistory from '../tables/TablePointHistory';
import { POINT_TYPE } from 'pages/Customer/utils/constants';
import { getListPointOfUser } from 'services/member-point.service';
import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MemberPointFilter from '../filters/MemberPointFilter';
const MemberPointHistory = () => {
  const { account_id } = useParams();
  const [tabActive, setTabActive] = useState(POINT_TYPE.CUMULATE);
  const [params, setParams] = useState({
    member_id: account_id,
    page: 1,
    itemsPerPage: 25,
  });
  const [dataRows, setDataRows] = useState({
    items: [],
    type: POINT_TYPE.CUMULATE,
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,

    loading: false,
  });
  const [memberPoint, setMemberPoint] = useState({
    total_point: 0,
    current_point: 0,
  });

  useEffect(() => {
    setParams((prev) => ({ ...prev, is_exchange: tabActive }));
  }, [tabActive]);

  const loadData = useCallback(() => {
    setDataRows((prev) => ({ ...prev, loading: true }));
    getListPointOfUser(params)
      .then((data) => {
        setMemberPoint((prev) => ({ prev, ...data.totalPoint }));
        setDataRows((prev) => ({ prev, ...data.data }));
      })
      .finally(() => setDataRows((prev) => ({ ...prev, loading: false })));
  }, [params]);

  useEffect(loadData, [loadData]);
  const panel = [
    {
      key: POINT_TYPE.CUMULATE,
      label: 'Lịch sử tích điểm',
    },
    {
      key: POINT_TYPE.EXCHANGE,
      label: 'Lịch sử tiêu điểm',
    },
  ];

  const onChange = (p) => setParams((prev) => ({ ...prev, ...p }));

  return (
    <div
      style={{
        marginTop: '15px',
      }}
      className='bw_tab_items bw_active'
      id='bw_insurance'>
      <div class='bw_row'>
        <div class='bw_col_6'>
          <div class='bw_count_cus bw_cou_report'>
            <span class='bw_green'>
              <img alt='' src={percentIcon} />
            </span>
            <div>
              <h4>{formatPrice(memberPoint.total_point, false)}</h4>
              <p>Tổng điểm</p>
            </div>
          </div>
        </div>

        <div class='bw_col_6'>
          <div class='bw_count_cus bw_cou_report'>
            <span class='bw_ogrance'>
              <img alt='' src={bagIcon} />
            </span>
            <div>
              <h4>{formatPrice(memberPoint.current_point, false)}</h4>
              <p>Điểm hiện tại</p>
            </div>
          </div>
        </div>
      </div>
      <ul className='bw_tabs'>
        {panel.map((e, index) => {
          return (
            <li
              key={index}
              className={tabActive === e?.key ? `bw_active` : ''}
              onClick={() => {
                setTabActive(e?.key);
              }}>
              <a className='bw_link'>{e?.label}</a>
            </li>
          );
        })}
      </ul>
      <MemberPointFilter
        onChange={(params) => {
          setParams((prev) => ({ ...prev, ...params }));
        }}
      />
      <TablePointHistory type={tabActive} dataRows={dataRows} onChange={onChange} />
    </div>
  );
};

export default MemberPointHistory;
