/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

function FormCheckboxCare({ label, children }) {
  const methods = useFormContext();

  const fields = (React.Children.map(children, (child) => child.props) || [])
    .filter((x) => Boolean(x.field));

  const booleanValue = methods.watch(fields[0].field);

  useEffect(() => {
    if (fields?.length >= 2 && booleanValue === 0) {
      const resetFields = fields.slice(1);
      resetFields.forEach((field) => {
        const resetValue = field.mode === 'multiple'? [] : null;
        methods.setValue(field.field, resetValue)
      });
    }
  }, [booleanValue]);

  return (
    <div className='bw_frm_box'>
      <div className='bw_flex'>
        <label className='bw_checkbox'>
          {children[0]}
          <span />
          {label}
        </label>
      </div>
      <div className='bw_row bw_mt_1 bw_align_items_center'>
        {children?.length === 2 && <div className='bw_col_12'>{children[1]}</div>}
        {children?.length === 3 && (
          <Fragment>
            <div className='bw_col_6'>{children[1]}</div>
            <div className='bw_col_6'>{children[2]}</div>
          </Fragment>
        )}
      </div>
    </div>
  );
}

export default FormCheckboxCare;
