import React from 'react';
import classNames from 'classnames';

function FormItemCheckbox({ label, children, className, gray }) {
  return (
    <div className={classNames('bw_row', { [className]: !!className })}>
      <div className='bw_col_12'>
        <div className={classNames('bw_frm_box', { "bw_readonly": gray })}>
          <div className='bw_flex'>
            <label className='bw_checkbox'>
              {children}
              {label && <span />}
              {label}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormItemCheckbox;
