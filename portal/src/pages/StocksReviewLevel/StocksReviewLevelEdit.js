import React from 'react';
import {useParams} from 'react-router';
import StocksReviewLevelAdd from './StocksReviewLevelAdd'

export default function StocksReviewLevelEdit() {
  let {id} = useParams();
  return (
    <StocksReviewLevelAdd stocksReviewLevelId={id} isEdit={true}/>
  )
}
