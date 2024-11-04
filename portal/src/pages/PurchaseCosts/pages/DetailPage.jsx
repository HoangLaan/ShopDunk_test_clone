import React from 'react';
import { useParams } from 'react-router';
import AddPage from './AddPage';

export default function ReceivePaymentDetail() {
  let { id } = useParams();
  return (
    <AddPage purchaseCostId={Number(id)} isCopy={false} isEdit={false} />
  );
}
