import React from 'react';

import BaseInventory from './BaseInventory';
import MinInventory from './MinInventory';

export default function StockTab({ disabled }) {
  return (
    <div className='bw_tab_items bw_active' id='bw_insurance'>
      <BaseInventory disabled={disabled} />
      <MinInventory disabled={disabled} />
    </div>
  );
}
