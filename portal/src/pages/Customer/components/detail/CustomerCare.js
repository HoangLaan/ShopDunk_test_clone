import React from "react";
import { getListHistoryTask } from "services/customer.service";
import { useHistory, useLocation, useParams } from 'react-router-dom';
import moment from "moment";

const CustomerCareHistory = () => {
  const { account_id } = useParams();
  const [params, setParams] = React.useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 25,
    member_id: account_id
  });
  const [customerCare, setCustomerCare] = React.useState({
    items: [],
    itemsPerPage: 25,
    page: 1,
    totalItems: 0,
    totalPages: 0,
  });

  const loadCustomerHistory = React.useCallback(() => {
    if (account_id)
      getListHistoryTask(params).then((value) => {
        setCustomerCare(value);
      });
  }, [account_id, params]);
  React.useEffect(loadCustomerHistory, [loadCustomerHistory]);
  console.log(customerCare);
  return (
    <div className="bw_list_sevice">
      {(customerCare?.items ?? [])?.map((customerCareValue) => {
        return (
          <div className="bw_service_items">
            <h3>{moment(customerCareValue.created_date).format('HH:mm DD/MM/YYYY')}</h3>
            <div className="bw_service_items_info">
              <div className="bw_content_cus">
                <h4>{customerCareValue?.task_name}</h4>
                <p>{customerCareValue?.description}</p>
                <a href={`/task/detail/${customerCareValue?.task_detail_id}`} className="bw_btn_outline bw_btn_outline_success">Xem chi tiết</a>
              </div>
              <div className="bw_progcess">
                {customerCareValue?.work_flow_name && <span className="bw_badge">{customerCareValue?.work_flow_name}</span>}
              </div>
            </div>
          </div>
        )
      })}

    </div>
  )
}

export default CustomerCareHistory;