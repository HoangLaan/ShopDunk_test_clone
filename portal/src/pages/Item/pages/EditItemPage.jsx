import React from 'react';
import { useParams } from 'react-router-dom';

import AddItemPage from './AddItemPage';

const ItemEdit = () => {
  const { id } = useParams();

  return <AddItemPage itemId={id} isEdit={true} />;
};
export default ItemEdit;
