import React from 'react';
import { useParams } from 'react-router';

import StocksTransferTypeAdd from './StocksTransferTypeAdd';

function StocksTransferTypeDetail() {
  let { id } = useParams();
  return <StocksTransferTypeAdd stocksTransferTypeId={id} disabled={true} />;
}

export default StocksTransferTypeDetail;
