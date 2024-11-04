import React from 'react';
import BWAccordion from 'components/shared/BWAccordion';
import ProductDivisionTable from '../Tables/ProductDivisionTable';
import { useFormContext } from 'react-hook-form';

function ProductDivisionForm({ title }) {
  const methods = useFormContext();

  return <>
    {methods.watch('division_type') == 0 ? <BWAccordion title={title}>
      <ProductDivisionTable />
    </BWAccordion> : null}

  </>
}

export default ProductDivisionForm;
