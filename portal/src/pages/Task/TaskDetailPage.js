import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import useQueryString from 'hooks/use-query-string';
import { getCareDetail } from 'services/task.service';

import CustomerInformation from './components/detail/CustomerInformation';
import TaskInformation from './components/detail/TaskInformation';
import CustomerCare from './components/detail/CustomerCare';
import Comments from './components/detail/Comments';
import { showToast } from 'utils/helpers';
import { TaskProvider } from './utils/context';
import CustomerWFlow from './components/detail/CustomerWFlow';
import CustomerContentInterest from './components/detail/CustomerContentInterest';

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
  />
);

const TasDetailPage = () => {
  let { task_detail_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const customer_information = data?.customer_information ?? {};
  const task_information = data?.task_information ?? {};
  const workflow_list = data?.workflow_list ?? [];

  const [query, setQuery] = useQueryString();
  const currWFlow = query.currWFlow ? parseInt(query.currWFlow) : workflow_list?.[0]?.workflow_id ?? 0;

  const loadData = useCallback(() => {
    if (task_detail_id) {
      setLoading(true);
      getCareDetail(task_detail_id)
        .then((value) => {
          setQuery({ currWFlow: value?.currWFlow });
          setData({ ...value });
        })
        .catch((error) => showToast.error(error?.message))
        .finally(() => setLoading(false));
    } else {
      setData({
        is_active: 1,
      });
    }
  }, [task_detail_id]);

  useEffect(loadData, [loadData]);

  return (
    <TaskProvider>
      <div className='bw_main_wrapp'>
        <Spin spinning={loading} indicator={antIcon}>
          <TaskInformation taskInformation={task_information} />
          <div className='bw_row'>
            <div className='bw_col_6'>
              <CustomerWFlow
                customer_information={customer_information}
                workflow_list={workflow_list}
                currWFlow={currWFlow}
                setLoading={setLoading}
                task_information={task_information}
                task_detail_id={task_detail_id}
                setQuery={setQuery}
              />
            </div>
            <div className='bw_col_6'>
              <CustomerInformation customerInformation={customer_information} />
            </div>
          </div>
          <CustomerContentInterest
            task_detail_id={task_information.task_detail_id}
            interest_content={customer_information?.interest_content || []}
            interest_content_list={customer_information?.interest_content_list || []}
          />

          <div className='bw_row'>
            <div className='bw_col_6'>
              <CustomerCare
                setLoading={setLoading}
                taskDetailId={task_information.task_detail_id}
                dataLeadsId={customer_information.data_leads_id}
                memberId={customer_information.member_id}
                phoneNumber={customer_information.phone_number}
                customerEmail={customer_information?.email}
                currWFlow={currWFlow}
                customerInformation={customer_information}
              />
            </div>
            <div className='bw_col_6'>
              <Comments
                setLoading={setLoading}
                taskDetailId={task_information.task_detail_id}
                memberId={customer_information.member_id}
                dataLeadsId={customer_information.data_leads_id}
                currWFlow={currWFlow}
                loadData={loadData}
              />
            </div>
          </div>
        </Spin>
      </div>
    </TaskProvider>
  );
};

export default TasDetailPage;