import React, { useState } from 'react';
import TableCustomerLead from 'pages/CustomerLead/components/Tables/TableCustomerLead';
import FilterCustomerLead from 'pages/CustomerLead/components/Filters/FilterCustomerLead';
import PageProvider from '../components/PageProvider/PageProvider';
import ModalImportError from '../components/Modals/ModalImportError';
import { MODAL } from '../utils/constants';
import { LARGE_LIST_PARAMS } from 'utils/constants';

function CustomerLead() {
  const [params, setParams] = useState({ is_active: 1, page: 1, itemsPerPage: 25 });
  const onChange = (p) => setParams((prev) => ({ ...prev, ...p }));
  const onClearParams = () => setParams(LARGE_LIST_PARAMS);

  return (
    <PageProvider>
      <div className='bw_main_wrapp'>
        <FilterCustomerLead onChange={(p) => setParams({ ...params, ...p })} onClearParams={onClearParams} />
        <TableCustomerLead params={params} onChange={onChange} />
        <ModalImportError />
        <div id={MODAL.IMPORT}></div>
        <div id={MODAL.IMPORT_ERROR}></div>
      </div>
    </PageProvider>
  );
}

export default CustomerLead;
