import DataTable from 'components/shared/DataTable/index';
import Modal from 'components/shared/Modal/index';
import { useMemo, useState } from 'react';

function ModalImei({ open, onClose, onApply, data }) {
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1,
      },
      {
        header: 'Tên IMEI',
        // accessor: 'imei',
        formatter: (p) => p
      },
    ],
    [],
  );

  return (
    <Modal
      witdh={'40%'}
      open={open}
      onClose={onClose}
      header='Danh sách IMEI'
     >
      <DataTable
      noSelect={true}
        noPaging
        hiddenDeleteClick
        columns={columns}
        data={data}
      />
    </Modal>
  );
}

export default ModalImei;
