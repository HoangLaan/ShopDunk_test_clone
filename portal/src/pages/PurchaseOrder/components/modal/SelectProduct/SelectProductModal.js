import React, { useState, useCallback, useEffect } from 'react';

import { getList } from 'services/product.service';
import SelectProductModalTable from './SelectProductModalTable';
import SelectProductModalFilter from './SelectProductModalFilter';
import ModalPortal from 'components/shared/ModalPortal/ModalPortal';

const SelectProductModal = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 10,
  });
  const [dataList, setDataList] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });

  ///zone handle scroll effect for header position

  const styleModal = { marginLeft: '300px' };

  const headerStyles = {
    backgroundColor: 'white',
    borderBottom: '#ddd 1px solid',
    position: 'sticky',
    marginTop: '-20px',
    zIndex: '1',
    top: '-2rem',
    width: '74rem',
    marginLeft: '-20px',
    height: '4rem',
  };
  const titleModal = {
    marginLeft: '2rem',
    marginTop: '1rem',
  };
  const closeModal = {
    marginRight: '2rem',
    marginTop: '1rem',
  };
  ////end zone

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadProductList = useCallback(() => {
    setLoading(true);
    getList(params)
      .then(setDataList)
      .catch((_) => {})
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadProductList, [loadProductList]);

  return (
    <React.Fragment>
      <ModalPortal
        title='Chọn sản phẩm'
        width={1200}
        styleModal={styleModal}
        style={headerStyles}
        titleModal={titleModal}
        closeModal={closeModal}
        onClose={onClose}
        onConfirm={() => {
          document.getElementById('trigger-delete')?.click();
          onClose();
        }}>
        <SelectProductModalFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />

        <SelectProductModalTable
          loading={loading}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          onChangePage={(page) => {
            setParams({
              ...params,
              page,
            });
          }}
          onRefresh={loadProductList}
          onClose={onClose}
        />
      </ModalPortal>
    </React.Fragment>
  );
};

export default SelectProductModal;
