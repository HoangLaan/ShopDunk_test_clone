import React from 'react';
import { useParams } from 'react-router';
import AddPage from './AddPage';

export default function ReceivePaymentCopy() {
  let { id } = useParams();
  const [currentId, type] = id.split('_');
  return <AddPage receivePaymentId={Number(currentId)} receivePaymentType={Number(type)} isCopy={true} isEdit={true} />;
}
