import React from 'react';
import { useParams } from 'react-router';
import StocksTypeAdd from './StocksTypeAdd';

export default function StocksTypeDetail() {
  const { id } = useParams();
  return <StocksTypeAdd id={id} disabled={true} />;
}
