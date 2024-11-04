import React, { useState, useEffect } from 'react';
import { defaultPaging } from 'utils/helpers';
import FilterSection from './section/Filter';
import TableSection from './section/Table';
import { getList } from 'services/stocks-type.service';

const AddStocksTypeModal = ({ open, onClose, title }) => {
  const [params, setParams] = useState({ page: 1, itemsPerPage: 7 });
  const [dataItem, setDataItem] = useState(defaultPaging);
  const [loading, setLoading] = useState(true);

  const { items = [], itemsPerPage, page, totalItems, totalPages } = dataItem;

  useEffect(() => {
    setLoading(true);
    getList({
      ...params,
      is_not_for_sale: 0,
    })
      .then((data) => {
        setDataItem(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  const onChange = (params) => {
    setParams((prev) => ({ ...prev, ...params }));
  };

  return (
    <div className={`bw_modal ${open ? 'bw_modal_open' : ''}`} id='bw_addProduct'>
      <div class='bw_modal_container bw_w1200 bw_modal_wrapper'>
        <div class='bw_title_modal'>
          <h3>{title}</h3>
          <span class='fi fi-rr-cross-small bw_close_modal' onClick={onClose}></span>
        </div>
        <div>
          <div className='bw_main_wrapp'>
            <FilterSection onChange={onChange} />
            <TableSection
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
  );
};

export default AddStocksTypeModal;
