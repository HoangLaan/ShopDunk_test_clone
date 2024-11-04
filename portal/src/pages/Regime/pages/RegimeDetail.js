import React from 'react';
import { useParams } from 'react-router';
import RegimeAdd from './RegimeAdd';

export default function RegimeDetail() {
  const { id } = useParams();
  return <RegimeAdd id={id} disabled={true} />;
}
