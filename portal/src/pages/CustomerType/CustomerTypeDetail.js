import React from 'react';
import {useParams} from 'react-router';
import CustomerTypeAdd from './CustomerTypeAdd'

export default function CustomerTypeDetail() {
  let {id} = useParams();
  return (
    <CustomerTypeAdd customerTypeId={id} isEdit={false}/>
  )
}
