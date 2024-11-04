import React from 'react';
import {useParams} from 'react-router';
import CustomerTypeAdd from './CustomerTypeAdd'

export default function CustomerTypeEdit() {
  let {id} = useParams();
  return (
    <CustomerTypeAdd customerTypeId={id} isEdit={true}/>
  )
}
