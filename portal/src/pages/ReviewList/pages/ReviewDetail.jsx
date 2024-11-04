import React from 'react';
import { useParams } from 'react-router-dom';
import ReviewAdded from './ReviewAdd';

const BookingDetail = () => {
  const { id } = useParams();

  return <ReviewAdded ReviewId={id} isEdit={false} />;
};
export default BookingDetail;
