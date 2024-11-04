import React from 'react';
import {useParams} from 'react-router';
import BusinessTypeAdd from './BusinessTypeAdd'

export default function BusinessTypeEdit() {
  let {id} = useParams();
  return (
    <BusinessTypeAdd businessTypeId={id} isEdit={true}/>
  )
}
