import React from 'react';
import {useParams} from 'react-router';
import CompanyAdd from './CompanyAdd'

export default function CompanyEdit() {
  let {id} = useParams();
  return (
    <CompanyAdd companyId={id} isEdit={true}/>
  )
}
