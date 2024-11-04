import React, { useState } from 'react';
import TableInvoiceManagement from 'pages/InvoiceManagement/components/Tables/TableInvoiceManagement';
import FilterInvoiceManagement from 'pages/InvoiceManagement/components/Filters/FilterInvoiceManagement';
import PageProvider from '../components/PageProvider/PageProvider';
import ModalImportError from '../components/Modals/ModalImportError';
import { MODAL } from '../utils/constants';
import { LARGE_LIST_PARAMS } from 'utils/constants';

function InvoiceManagement() {
  const [params, setParams] = useState({ is_active: 1, page: 1, itemsPerPage: 25 });
  const onChange = (p) => setParams((prev) => ({ ...prev, ...p }));
  const onClearParams = () => setParams(LARGE_LIST_PARAMS);

  return (
    <PageProvider>
      <div className='bw_main_wrapp'>
        <FilterInvoiceManagement onChange={(p) => setParams({ ...params, ...p })} onClearParams={onClearParams} />
        <TableInvoiceManagement params={params} onChange={onChange} />
        <ModalImportError />
        <div id={MODAL.IMPORT}></div>
        <div id={MODAL.IMPORT_ERROR}></div>
      </div>
    </PageProvider>
  );
}

export default InvoiceManagement;
