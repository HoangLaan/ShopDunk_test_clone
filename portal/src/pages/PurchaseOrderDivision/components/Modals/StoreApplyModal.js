import React, { useState } from 'react';
import ModalPortal from 'components/shared/ModalPortal/ModalPortal';
import { SMALL_LIST_PARAMS } from 'utils/constants';
import StoreApplyModalTable from '../Tables/StoreApplyModalTable';
import StoreApplyModalFilter from '../Filters/StoreApplyModalFilter';

function StoreApplyModal({ area_list, title, onClose, onConfirm, defaultDataSelect, setModalDataSelect }) {
  const area_id = (area_list || []).map(x => x.value).join('|')
  const initParams = { ...SMALL_LIST_PARAMS, area_id }
  const [params, setParams] = useState(initParams);
  const onClearParams = () => setParams(initParams);
  const onChange = (p) => setParams((prev) => ({ ...prev, ...p }));

  return (
    <ModalPortal title={title} onClose={onClose} onConfirm={onConfirm}>
      <StoreApplyModalFilter onChange={onChange} onClearParams={onClearParams} />
      <StoreApplyModalTable
        params={params}
        onChange={onChange}
        defaultDataSelect={defaultDataSelect}
        setModalDataSelect={setModalDataSelect}
      />
    </ModalPortal>
  );
}

export default StoreApplyModal;
