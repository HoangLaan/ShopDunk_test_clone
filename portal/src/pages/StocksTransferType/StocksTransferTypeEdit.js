import React from 'react';
import { useParams } from 'react-router';

import StocksTransferTypeAdd from './StocksTransferTypeAdd';

function StocksTransferTypeEdit() {
  let { id } = useParams();
  return <StocksTransferTypeAdd stocksTransferTypeId={id} disabled={false} />;
}

export default StocksTransferTypeEdit;
