import React from 'react';
import { Modal } from 'antd'

export default function ModallShowList({ listValue = [], open = false, setOpen = () => {}, funcIn = () => {}, title = '' }) {

  const handleCancel = () => {
    setOpen(false);
  };

  return (
      <>
        <Modal
          title={title}
          open={open}
          footer={() => {}}
          onCancel={handleCancel}
        >
          {
            funcIn(listValue)
          }
        </Modal>
    </>
  );
}
