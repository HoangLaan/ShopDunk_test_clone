import React from 'react';
import { useParams } from 'react-router';
import RequestPurchaseOrderAdd from './RequestPurchaseOrderAdd';

export default function RequestPurchaseEdit() {
  const { id } = useParams();
  return <RequestPurchaseOrderAdd requestPurchaseId={id} disabled={false} />;
}
