import React, { useState } from 'react';
import TableBankUser from '../components/Tables/TableBankUser';
import FilterBankUser from '../components/Filters/FilterBankUser';
import PageProvider from '../components/PageProvider/PageProvider';
import ModalImportError from '../components/Modals/ModalImportError';
import { MODAL } from '../utils/constants';

function BankUser() {
  const [params, setParams] = useState({ is_active: 1, page: 1, itemsPerPage: 25 });
  const onChangePage = (page) => setParams((prev) => ({ ...prev, page }));
  const onChange = (p) => setParams((prev) => ({ ...prev, ...p }));
  const onClearParams = () => setParams({ is_active: 1, page: 1, itemsPerPage: 25 });

  return (
    <PageProvider>
      <div className='bw_main_wrapp'>
        <FilterBankUser onClearParams={onClearParams} onChange={onChange} />
        <TableBankUser params={params} onChangePage={onChangePage} />
      </div>

      <ModalImportError />
      <div id={MODAL.IMPORT}></div>
      <div id={MODAL.IMPORT_ERROR}></div>
    </PageProvider>
  );
}

export default BankUser;
