import React from 'react';

function ColumnCheckbox({ checked }) {
  return (
    <label className='bw_checkbox' style={{ marginRight: 0 }}>
      <input type='checkbox' checked={checked} disabled />
      <span />
    </label>
  );
}

export default ColumnCheckbox;
