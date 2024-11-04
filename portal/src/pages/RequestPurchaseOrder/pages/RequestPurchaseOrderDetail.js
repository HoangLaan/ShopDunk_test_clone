import React from 'react';
import { useParams } from 'react-router';
import RequestPurchaseOrderAdd from './RequestPurchaseOrderAdd';

export default function RequestPurchaseDetail() {
  const { id } = useParams();
  return <RequestPurchaseOrderAdd requestPurchaseId={id} disabled={true} />;
}
