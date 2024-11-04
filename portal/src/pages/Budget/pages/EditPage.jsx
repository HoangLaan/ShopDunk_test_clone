import React from 'react';
import { useParams } from 'react-router-dom';

import AddBudgetPage from './AddPage';

const EditPage = () => {
  const { id } = useParams();

  return <AddBudgetPage budgetId={id} isEdit={true} />;
};
export default EditPage;
