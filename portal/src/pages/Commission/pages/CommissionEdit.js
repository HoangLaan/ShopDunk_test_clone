import React from 'react';
import { useParams } from 'react-router';
import CommissionAdd from './CommissionAdd';

export default function CommissionEdit() {
  const { id } = useParams();
  return <CommissionAdd commissionId={id} disabled={false} />;
}
