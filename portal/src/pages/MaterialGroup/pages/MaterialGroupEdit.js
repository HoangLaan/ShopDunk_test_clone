import React from 'react';
import { useParams } from 'react-router';
import MaterialGroupAdd from './MaterialGroupAdd';

export default function MaterialGroupEdit() {
  const { id } = useParams();
  return <MaterialGroupAdd id={id} disabled={false} />;
}
