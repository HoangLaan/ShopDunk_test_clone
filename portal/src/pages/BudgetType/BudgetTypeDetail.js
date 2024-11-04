import React from 'react';
import { useParams } from 'react-router';
import BudgetTypeAdd from './BudgetTypeAdd';

export default function BudgetTypeDetail() {
  const { id } = useParams();
  return <BudgetTypeAdd id={id} disabled={true} />;
}
