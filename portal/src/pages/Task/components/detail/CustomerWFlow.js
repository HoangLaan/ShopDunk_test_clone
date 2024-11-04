import React from 'react';
import { useHistory } from 'react-router-dom';

import { showConfirmModal } from 'actions/global';
import styled from 'styled-components';
import BWImage from 'components/shared/BWImage';
import { useDispatch } from 'react-redux';
import { changeWorkFlow } from 'services/task.service';
import { showToast } from 'utils/helpers';
import { useTaskContext } from 'pages/Task/utils/context';
import ICON_COMMON from 'utils/icons.common';
import BlankButton from 'pages/Customer/components/common/BlankButton';

const CustomStyle = styled.div`
  flex-wrap: wrap;
  position: relative;
  margin-left: 20px;

  img {
    max-width: 70px;
    max-height: 70px;
    margin-right: 20px;
  }

  .bw_inf_text {
    width: calc(100% - 90px);
  }

  .bw_inf_text h3 {
    font-size: 20px;
    text-transform: uppercase;
    font-weight: 700;
  }

  .bw_inf_text ul {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
  }

  .bw_inf_text ul li {
    height: 32px;
    padding: 0 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    border: 1px solid var(--borderColor);
    margin: 2px;
    cursor: pointer;
  }

  .bw_inf_text ul li.bw_active {
    background: var(--mainColor);
    color: var(--whiteColor);
  }
`;

function CustomerWFlow({
  customer_information,
  workflow_list,
  currWFlow,
  setLoading,
  task_information,
  setQuery,
  task_detail_id,
}) {
  const dispatch = useDispatch();
  const { refreshCustomerCare } = useTaskContext();
  const history = useHistory();
  const currentWflow = workflow_list.find((x) => +x.workflow_id === currWFlow);

  return (
    <CustomStyle className='bw_flex bw_align_items_center bw_mb_2'>
      <BWImage src={customer_information.avatar} />
      <div className='bw_inf_text'>
        <a
          className='heading_link text_link'
          href={
            customer_information.member_id
              ? `/customer/detail/${customer_information.member_id}?tab_active=information`
              : `/customer-lead/detail/${customer_information.data_leads_id}`
          }>
          {customer_information.customer_name}
        </a>
        {/* {currentWflow?.type_purchase && ()} */}
        <button
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            padding: 0,
            margin: 0,
            marginLeft: 30,
            cursor: 'pointer',
            outline: 'none',
            height: 20,
            fontSize: '15px',
            fontWeight: 600,
          }}
          onClick={() => {
            history.push(
              `/orders/add?tab_active=information&task_detail_id=${task_detail_id}&customer_id=${customer_information?.member_id ? customer_information?.member_id : customer_information?.data_leads_id}`,
              customer_information?.member_id
                ? {
                  member_id: customer_information?.member_id,
                }
                : { data_leads_id: customer_information?.data_leads_id },
            );
          }}>
          <i className={ICON_COMMON.add} style={{ marginRight: 5 }}></i>
          Tạo đơn hàng
        </button>

        <ul className='bw_step_c'>
          {Array.isArray(workflow_list) && workflow_list.length > 0
            ? workflow_list
              .filter((x) => Boolean(x.workflow_id))
              .map((item, index) => (
                <li
                  key={index}
                  className={currWFlow === item.workflow_id ? 'bw_active' : ''}
                  onClick={() => {
                    if (currWFlow !== item.workflow_id) {
                      dispatch(
                        showConfirmModal(
                          ['Xác nhận chuyển bước', 'Bạn thực sự muốn chuyển bước'],
                          () => {
                            setLoading(true);
                            changeWorkFlow({
                              task_detail_id: task_information.task_detail_id,
                              task_workflow_old_id: currWFlow,
                              task_workflow_id: item.workflow_id,
                              customer_name: customer_information.customer_name,
                            })
                              .then(() => {
                                setQuery({ currWFlow: item.workflow_id });
                                refreshCustomerCare();
                              })
                              .catch((error) => showToast.error(error.message))
                              .finally(() => setLoading(false));
                          },
                          'Đồng ý',
                          'Huỷ',
                        ),
                      );
                    }
                  }}>
                  {item.workflow_name}
                </li>
              ))
            : null}
        </ul>
      </div>
    </CustomStyle>
  );
}

export default CustomerWFlow;
