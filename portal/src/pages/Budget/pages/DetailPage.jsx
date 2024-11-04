import React from 'react';
import { useParams } from 'react-router-dom';

import AddBudgetPage from './AddPage';

const DetailPage = () => {
  const { id } = useParams();

  return <AddBudgetPage budgetId={id} isEdit={false} />;
};
export default DetailPage;
