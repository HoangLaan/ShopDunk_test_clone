import React from 'react';
import { useParams } from 'react-router';
import BorrowRequestAdd from './BorrowRequestAdd';

export default function BorrowRequestDetail() {
  const { id } = useParams();
  return <BorrowRequestAdd id={id} disabled={true} />;
}
