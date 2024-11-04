import React from 'react';
import { useParams } from 'react-router';
import AddPage from './AddPage';

export default function ReceivePaymentDetail() {
  let { id } = useParams();
  const [currentId, type] = id.split('_');
  return (
    <AddPage
      receivePaymentId={Number(currentId)}
      receivePaymentType={Number(type)}
      isCopy={false}
      isEdit={false}
      isAddPage={false}
    />
  );
}
