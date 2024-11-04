import React from 'react';
import { useParams } from 'react-router';
import CustomerWorkingAdd from './CustomerWorkingAdd';

export default function CustomerWorkingDetail() {
  const { customer_working_id } = useParams();
  return <CustomerWorkingAdd customer_working_id={customer_working_id} disabled={true} />;
}
