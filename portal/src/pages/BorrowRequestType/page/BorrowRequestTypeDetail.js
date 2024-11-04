import React from 'react';
import { useParams } from 'react-router';
import BorrowRequestTypeAdd from './BorrowRequestTypeAdd';

export default function BorrowRequestTypeDetail() {
  const { id } = useParams();
  return <BorrowRequestTypeAdd id={id} disabled={true} />;
}
