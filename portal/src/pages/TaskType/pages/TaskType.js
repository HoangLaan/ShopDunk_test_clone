import React, { useState } from 'react';
import TableTaskType from '../components/Tables/TableTaskType';
import FilterTaskType from '../components/Filters/FilterTaskType';
import PageProvider from '../components/PageProvider/PageProvider';
import { MODAL } from '../utils/constants';
import ModalImportError from '../components/Modals/ModalImportError';

function TaskType() {
  const [params, setParams] = useState({ is_active: 1, page: 1, itemsPerPage: 25 });
  const onChangePage = (page) => setParams((prev) => ({ ...prev, page }));

  return (
    <PageProvider>
      <div className='bw_main_wrapp'>
        <FilterTaskType onChange={(p) => setParams({ ...params, ...p })} />
        <TableTaskType params={params} onChangePage={onChangePage} />
      </div>

      <ModalImportError />
      <div id={MODAL.IMPORT}></div>
      <div id={MODAL.IMPORT_ERROR}></div>
    </PageProvider>
  );
}

export default TaskType;
