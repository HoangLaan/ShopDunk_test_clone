import React, { useState, useCallback, useEffect } from 'react';

import { getListRepair } from 'pages/CareService/helpers/call-api';
import SelectProductModalTable from '../SelectProductRepair/SelectProductModalTable';
import SelectProductModalFilter from '../SelectProductRepair/SelectProductModalFilter';
import ModalPortal from 'components/shared/ModalPortal/ModalPortal';

const SelectProductRepair = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 10,
    //is_stop_selling: 0,
  });
  const [dataList, setDataList] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;
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

  const loadProductListRepair = useCallback(() => {
    setLoading(true);
    getListRepair(params)
      .then(setDataList)
      .catch((_) => {})
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadProductListRepair, [loadProductListRepair]);



  return (
    <ModalPortal
      title='Chọn sản phẩm'
      width={1200}
      onClose={onClose}
      styleModal={styleModal}
      style={headerStyles}
      titleModal={titleModal}
      closeModal={closeModal}
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
        onClear={() => {
          setParams({
            is_active: 1,
            page: 1,
            itemsPerPage: 10,
            //is_stop_selling: 0,
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
        onRefresh={loadProductListRepair}
        onClose={onClose}
      />
    </ModalPortal>
  );
};

export default SelectProductRepair;
