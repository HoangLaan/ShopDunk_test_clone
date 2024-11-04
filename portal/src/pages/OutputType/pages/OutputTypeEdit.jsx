import React from 'react';
import { useParams } from 'react-router-dom';

import OutputTypeAdd from './OutputTypeAdd';

const OutputTypeEdit = () => {
  const { id } = useParams();

  return <OutputTypeAdd outputTypeId={id} isEdit={true} />;
};
export default OutputTypeEdit;
