import React from 'react';
import { useParams } from 'react-router';
import AddPage from './AddPage';

export default function WorkScheduleDetail() {
  const { id } = useParams();
  return <AddPage id={id} disabled={true} />;
}