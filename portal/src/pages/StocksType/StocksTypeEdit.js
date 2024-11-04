import React from 'react';
import { useParams } from 'react-router';
import StocksTypeAdd from './StocksTypeAdd';

export default function StocksTypeEdit() {
  const { id } = useParams();
  return <StocksTypeAdd id={id} disabled={false} />;
}
