import React from 'react';
import { useParams } from 'react-router';
import BudgetPlanAdd from './BudgetPlanAdd';

export default function BudgetPlanCopy() {
  const { id } = useParams();
  return <BudgetPlanAdd id={id} disabled={false} />;
}
