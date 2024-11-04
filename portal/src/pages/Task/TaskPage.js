import React, { useState, useCallback, useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';

import TaskFilter from './components/page/TaskFilter';
import TaskTable from './components/page/TaskTable';
import { getTaskList } from 'services/task.service';
import { defaultPaging, defaultParams } from 'utils/helpers';
import { useAuth } from 'context/AuthProvider';
import useVerifyAccess from 'hooks/useVerifyAccess';
import { TASK_PERMISSION } from './utils/const';

const TaskPage = () => {
  const [params, setParams] = useState({ ...defaultParams, is_complete: 2 });
  const [dataList, setDataList] = useState(defaultPaging);
  const [loading, setLoading] = useState(true);
  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;
  const { user } = useAuth()

  const { verifyPermission } = useVerifyAccess();
  const isViewAll = user?.isAdministrator || verifyPermission(TASK_PERMISSION.VIEW_ALL);

  const loadTask = useCallback(() => {
    setLoading(true);

    const _params = { ...params }
    if (!isViewAll) {
      window._$g.rdr('/task/customer')
    } else {
      getTaskList(_params)
        .then(setDataList)
        .finally(() => setLoading(false));
    }
  }, [params, user, isViewAll]);
  useEffect(loadTask, [loadTask]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <TaskFilter
          params={params}
          onChange={(e) => {
            setParams((prev) => {
              if (isEmpty(e)) {
                return defaultParams;
              }
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <TaskTable
          params={params}
          loading={loading}
          onChangePage={(page) => {
            setParams({
              ...params,
              page,
            });
          }}
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          onRefresh={loadTask}
        />
      </div>
    </React.Fragment>
  );
};

export default TaskPage;
