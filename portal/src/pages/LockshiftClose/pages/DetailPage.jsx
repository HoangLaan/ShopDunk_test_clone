import React from 'react';
import { useParams } from 'react-router-dom';

import AddLockShiftPage from './AddPage';

const DetailPage = () => {
  const { id } = useParams();

  return <AddLockShiftPage id={id} isEdit={false} />;
};
export default DetailPage;
