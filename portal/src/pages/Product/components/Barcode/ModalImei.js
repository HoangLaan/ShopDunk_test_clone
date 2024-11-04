import DataTable from 'components/shared/DataTable/index';
import Modal from 'components/shared/Modal/index';
import { useMemo, useState } from 'react';
import BWButton from 'components/shared/BWButton/index';

function ModalImei({ open, onClose, onApply, data, defaultDataSelect }) {
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
        accessor: 'imei',
      },
    ],
    [],
  );

  const [imeiSelected, setImeiSelected] = useState([]);

  return (
    <Modal
      witdh={'40%'}
      open={open}
      onClose={onClose}
      header='Danh sách IMEI'
      footer={
        <BWButton
          type='success'
          outline
          content={'Xác nhận'}
          onClick={() => {
            onApply(imeiSelected);
            onClose();
          }}
        />
      }>
      <DataTable
        defaultDataSelect={defaultDataSelect ?? data}
        noPaging
        hiddenDeleteClick
        columns={columns}
        data={data}
        onChangeSelect={(d) => {
          setImeiSelected(d);
        }}
      />
    </Modal>
  );
}

export default ModalImei;
