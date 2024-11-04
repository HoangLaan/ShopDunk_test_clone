import React from 'react';
import { useParams } from 'react-router-dom';

import OutputTypeAdd from './OutputTypeAdd';

const OutputTypeDetail = () => {
  const { id } = useParams();

  return <OutputTypeAdd outputTypeId={id} isEdit={false} />;
};
export default OutputTypeDetail;
