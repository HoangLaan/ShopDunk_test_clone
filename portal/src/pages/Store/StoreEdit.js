import React from 'react';
import { useParams } from 'react-router';
import StoreAdd from './StoreAdd';

export default function StoreEdit() {
  let { id } = useParams();
  return <StoreAdd storeId={id} isEdit={true} />;
}
