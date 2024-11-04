import React, { useCallback, useState, useEffect } from 'react';
import { defaultPaging, defaultParams } from 'utils/helpers';
import ProductFilter from './section/EqiupmentFilter';
import EquipmentTable from './section/EquipmentTable';

import { getListEquipment } from 'services/lockshift-close.service';
import styled from 'styled-components';

const ModalWrapper = styled.div`
  .bw_modal_wrapper {
    max-height: 80vh;
    max-width: 80vw;
  }
`;

const AddProductModal = ({ open, onClose }) => {
  const [params, setParams] = useState(defaultParams);
  const [dataItem, setDataItem] = useState(defaultPaging);
  const [loading, setLoading] = useState(true);

  const { items = [], itemsPerPage, page, totalItems, totalPages } = dataItem;

  const loadData = useCallback(() => {
    setLoading(true);
    getListEquipment(params)
      .then(setDataItem)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onChange = (params) => {
    setParams((prev) => ({ ...prev, ...params }));
  };

  return (
    <ModalWrapper>
      <div className={`bw_modal ${open ? 'bw_modal_open' : ''}`} id='bw_addProduct'>
        <div class='bw_modal_container bw_w1200 bw_modal_wrapper'>
          <div class='bw_title_modal'>
            <h3>Danh sách hàng hóa vật tư</h3>
            <span class='fi fi-rr-cross-small bw_close_modal' onClick={onClose}></span>
          </div>
          <div>
            <div>
              <div className='bw_main_wrapp'>
                <ProductFilter onChange={onChange} />
                <EquipmentTable
                  onChangePage={(page) => {
                    onChange({ page });
                  }}
                  data={items}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  page={page}
                  totalItems={totalItems}
                  loading={loading}
                  closeModal={onClose}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default AddProductModal;
