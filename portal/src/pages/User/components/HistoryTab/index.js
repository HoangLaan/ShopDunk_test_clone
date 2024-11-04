import ULHistory from 'pages/UserLevelHistory/ULHistory';
import React from 'react';

export default function HistoryTab({ userId }) {
  return (
    <div className='bw_tab_items bw_active'>
      <ULHistory userId={userId} />
    </div>
  );
}
