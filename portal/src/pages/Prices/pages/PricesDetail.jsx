import React from 'react';
import { useParams } from 'react-router-dom';
import PricesAdd from './PricesAdd';

const PricesDetail = () => {
  const { id } = useParams();

  return <PricesAdd shiftId={id} isEdit={false} />;
};
export default PricesDetail;
