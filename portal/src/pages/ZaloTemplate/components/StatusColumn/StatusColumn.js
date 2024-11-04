import classNames from 'classnames';
import React from 'react';

function StatusColumn({ status }) {
  return (
    <span
      className={classNames('bw_label_outline', {
        bw_label_outline_success: status,
        bw_label_outline_danger: !status,
      })}>
      {status ? 'Kích hoạt' : 'Ẩn'}
    </span>
  );
}

export default StatusColumn;
