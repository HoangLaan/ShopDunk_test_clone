import React from 'react';
import { useParams } from 'react-router';
import CommissionAdd from './CommissionAdd';

export default function CommissionDetail() {
  const { id } = useParams();
  return <CommissionAdd commissionId={id} disabled={true} />;
}
