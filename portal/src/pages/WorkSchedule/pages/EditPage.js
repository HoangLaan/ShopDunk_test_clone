import React from 'react';
import { useParams } from 'react-router';
import AddPage from './AddPage';

export default function WorkScheduleEdit() {
  const { id } = useParams();
  return <AddPage id={id} disabled={false} />;
}