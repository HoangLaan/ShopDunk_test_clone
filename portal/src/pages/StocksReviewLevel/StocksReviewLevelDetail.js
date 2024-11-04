import React from 'react';
import {useParams} from 'react-router';
import StocksReviewLevelAdd from './StocksReviewLevelAdd'

export default function StocksReviewLevelDetail() {
  let {id} = useParams();
  return (
    <StocksReviewLevelAdd stocksReviewLevelId={id} isEdit={false}/>
  )
}
