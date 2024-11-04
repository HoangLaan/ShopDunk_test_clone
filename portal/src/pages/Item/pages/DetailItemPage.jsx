import React from 'react';
import { useParams } from 'react-router-dom';

import AddItemPage from './AddItemPage';

const ItemDetail = () => {
  const { id } = useParams();

  return <AddItemPage itemId={id} isEdit={false} />;
};
export default ItemDetail;
