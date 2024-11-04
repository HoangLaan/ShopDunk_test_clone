import React from 'react';
import { useParams } from 'react-router-dom';
import OrdersAdd from './ReviewAdd';

const ReviewEdit = () => {
  const { id } = useParams();

  return <OrdersAdd orderId={id} isEdit={true} />;
};
export default ReviewEdit;
