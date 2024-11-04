import React from 'react';
import PropTypes from 'react';
import { formatPrice } from 'utils/index';

const CouponCodeCount = ({ label, value, className }) => {
  return (
    <div className='bw_count_w'>
      <p>{label}</p>
      <h3 className={className ? className : ''}>{formatPrice(value)}</h3>
    </div>
  );
};

CouponCodeCount.propTypes = {
  label: PropTypes.string,
  value: PropTypes.number,
  className: PropTypes.string,
};

export default CouponCodeCount;
