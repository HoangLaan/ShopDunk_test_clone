import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import BWButton from 'components/shared/BWButton/index';
import Modal from 'components/shared/Modal/index';
import { useTaskTypeContext } from 'pages/TaskType/utils/context';
import TableSelectTaskWorkflow from '../Tables/TableSelectTaskWorkflow';
import FilterSelectTaskWorkflow from '../Filters/FilterSelectTaskWorkflow';
import { MEDIUM_LIST_PARAMS } from 'utils/constants';

function ModalSelectTaskWorkflow() {
  const { openModalTaskWorkflow, setOpenModalTaskWorkflow } = useTaskTypeContext();

  const [params, setParams] = useState(MEDIUM_LIST_PARAMS);
  const onChangePage = (page) => setParams((prev) => ({ ...prev, page }));
  const onChangeParams = (p) => setParams((prev) => ({ ...prev, ...p }));
  const onCloseModal = () => {
    setOpenModalTaskWorkflow(false);
  };
  const onConfirmModal = () => {
    document.getElementById('trigger-delete').click();
    onCloseModal();
  };

  ///zone handle scroll effect for header position

  const styleModal = { marginLeft: '300px' };

  const headerStyles = {
    backgroundColor: 'white',
    borderBottom: '#ddd 1px solid',
    position: 'sticky',
    marginTop: '-20px',
    zIndex: '1',
    top: '-2rem',
    width: '46rem',
    marginLeft: '-20px',
    height: '4rem',
    zIndex: 2,
  };
  const titleModal = {
    marginLeft: '2rem',
    marginTop: '1rem',
  };
  const closeModal = {
    marginRight: '2rem',
    marginTop: '1rem',
  };
  ////end zone

  return openModalTaskWorkflow ? (
    <Modal
      witdh='50vw'
      styleModal={styleModal}
      headerStyles={headerStyles}
      titleModal={titleModal}
      closeModal={closeModal}
      header='Chọn bước xử lý'
      open={true}
      onClose={onCloseModal}
      footer={<BWButton type='success' outline content='Xác nhận' onClick={onConfirmModal} />}>
      <FilterSelectTaskWorkflow onChange={onChangeParams} />
      <TableSelectTaskWorkflow params={params} onChangePage={onChangePage} />
    </Modal>
  ) : null;
}

export default ModalSelectTaskWorkflow;
