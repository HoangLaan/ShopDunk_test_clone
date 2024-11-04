import React from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { getList, getTaskWorkFlow } from 'services/customer-of-task.service';
import { defaultPaging, defaultParams, showToast } from 'utils/helpers';
import BWButton from 'components/shared/BWButton/index';
import { getConfig } from 'services/customer-of-task.service';
import Filter from '../components/Filter';
import Table from '../components/Table';
import styled from 'styled-components';
import { exportExcelCustomerInfo } from 'services/customer-of-task.service';
import CheckAccess from 'navigation/CheckAccess';


const TabScrollbar = styled.ul`
  .bw_tabs {
    overflow-y: hidden;
    overflow-x: auto;
    white-space: nowrap;
    scrollbar-width: thin; /* Firefox */
  }

  .bw_tabs::-webkit-scrollbar {
    height: 10px; /* Chiều rộng của thanh cuộn trên Chrome và Safari */
  }

  .bw_tabs::-webkit-scrollbar-thumb {
    background-color: #DDDDDD; 
  }
`



const CustomerOfTaskFormList = () => {
  const [params, setParams] = useState(defaultParams);
  const [dataList, setDataList] = useState(defaultPaging);
  const [dataTabs, setDataTabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabActive, setTabActive] = useState(0);

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const getData = useCallback(() => {
    setLoading(true);
    getList(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  const exportExcel = () => {
    exportExcelCustomerInfo(params)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'customer_info.xlsx');
        document.body.appendChild(link);
        link.click();
      })
      .catch(() => { });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const configRes = await getConfig();
        const taskType = configRes.find(e => e.name === "TASKTYPEFORSHOP");
        const taskTypeId = taskType ? taskType.id : 20;
        const taskWorkFlowRes = await getTaskWorkFlow({ task_type_id: params?.task_type_id || taskTypeId });
        setDataTabs([{
          label: `Tất cả (${items.length})`,
          value: 0
        }, ...taskWorkFlowRes]);
      } catch (error) {
        showToast.error(error?.message || 'Có lỗi xảy ra!');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.task_type_id, items]);


  useEffect(getData, [getData]);

  return (
    <div class='bw_main_wrapp'>
      <Filter
        task_id={params}
        onChange={(e) => {
          setParams((prev) => {
            return {
              ...prev,
              ...e,
            };
          });
        }}
      />
      <div className='bw_mt_2'>
        <div className='bw_row bw_mb_1 bw_mt_1 bw_align_items_center mt-20'>
          <div className='bw_col_6'>
          </div>
          <div className='bw_col_6 bw_flex bw_justify_content_right bw_align_items_center bw_btn_group'>
            <CheckAccess permission={'CRM_CUSTOMEROFTASK_ADD'}>
              <BWButton
                type='success'
                color='success'
                submit
                icon='fi fi-rr-plus'
                content='Thêm mới'
                onClick={() => window._$g.rdr(`/customer-of-task/add`)}>
              </BWButton>
            </CheckAccess>
            <CheckAccess permission={'CRM_CUSTOMEROFTASK_EXPORT'}>
              <BWButton
                type='success'
                globalAction='true'
                icon='fi fi-rr-inbox-out'
                content='Xuất excel'
                onClick={exportExcel}
              />
            </CheckAccess>
          </div>
        </div>
      </div>
      <TabScrollbar>
        <ul className='bw_tabs' >
          {dataTabs?.map((o) => {
            return (
              <li
                onClick={
                  tabActive == o.value
                    ? null
                    : () => {
                      let task_work_flow_id;
                      task_work_flow_id = o.value;
                      setTabActive(o.value);
                      setParams((prev) => {
                        return {
                          ...prev,
                          task_work_flow_id,
                        };
                      });
                    }
                }
                className={tabActive == o.value ? 'bw_active' : ''}>
                <a className='bw_link'>{o?.label}</a>
              </li>
            );
          })}
        </ul>
      </TabScrollbar>
      <Table
        onChangePage={(page) => {
          setParams({
            ...params,
            page,
          });
        }}
        data={items}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        loading={loading}
        onRefresh={getData}
      />
    </div>
  );
};

export default CustomerOfTaskFormList;