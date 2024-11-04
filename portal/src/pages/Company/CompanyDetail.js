import React from 'react';
import {useParams} from 'react-router';
import CompanyAdd from './CompanyAdd'

export default function CompanyDetail() {
  let {id} = useParams();
  return (
    <CompanyAdd companyId={id} isEdit={false}/>
  )
}
