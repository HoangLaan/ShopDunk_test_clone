import React from "react";
import { useFormContext } from 'react-hook-form'

const SelectFilter = ({
  actions,
  onChange
}) => {
  const methods = useFormContext();
  return (<FormProvider {...methods}>
    <FilterSearchBar
      title='Tìm kiếm ca làm việc'
      onSubmit={onChange}
      onClear={() => onClear({})}
      actions={actions}
    />
  </FormProvider>)
}

export default SelectFilter;