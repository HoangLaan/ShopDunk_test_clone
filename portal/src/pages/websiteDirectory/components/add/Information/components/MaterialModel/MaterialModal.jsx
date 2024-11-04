import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { getListMaterial } from 'pages/Orders/helpers/call-api';
import { getErrorMessage } from 'utils';

import DataTable from 'components/shared/DataTable';
import { showToast } from 'utils/helpers';

const MaterialModal = ({ onClose, onConfirm }) => {
  const { watch } = useFormContext();

  const [selectedProduct, setSelectedProduct] = useState(watch('materials') || []);
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);

  const store_id = watch('store_id');

  const { items = [], itemsPerPage, page, totalItems, totalPages } = dataList;

  ///zone handle scroll effect for header position

  const styleModal = { marginLeft: '300px' };

  const headerStyles = {
    backgroundColor: 'white',
    borderBottom: '#ddd 1px solid',
    position: 'sticky',
    marginTop: '-20px',
    zIndex: '1',
    top: '-2rem',
    width: '75rem',
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

  const getData = useCallback(
    (page = 1) => {
      setLoading(true);

      getListMaterial({
        store_id,
        page,
        itemsPerPage: 15,
      })
        .then((res) => {
          setDataList(res);
        })
        .catch((error) => {
          showToast.error(
            getErrorMessage({
              message: error.message || 'Có lỗi khi lấy danh sách túi, bao bì.',
            }),
          );
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [store_id],
  );

  useEffect(getData, [getData]);

  const onChangePage = useCallback(
    (page) => {
      getData(page);
    },
    [getData],
  );

  const onChangeSelect = useCallback((selected) => {
    setSelectedProduct(selected);
  }, []);

  const columns = useMemo(
    () => [
      {
        header: 'Mã túi, bao bì',
        accessor: 'material_code',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Tên túi, bao bì',
        accessor: 'material_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Số lượng trong kho',
        accessor: 'inventory_number',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
    ],
    [],
  );

  return (
    <div className='bw_modal bw_modal_open' id='bw_add_customer'>
      <div className='bw_modal_container bw_w1200' style={styleModal}>
        <div className='bw_title_modal' style={headerStyles}>
          <h3 style={titleModal}>Chọn túi, bao bì</h3>
          <span className='fi fi-rr-cross-small bw_close_modal' onClick={onClose} style={closeModal} />
        </div>
        <div className='bw_main_modal'>
          <DataTable
            columns={columns}
            data={items}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            page={page}
            totalItems={totalItems}
            onChangePage={onChangePage}
            loading={loading}
            onChangeSelect={onChangeSelect}
            defaultDataSelect={selectedProduct}
            fieldCheck='material_id'
          />
        </div>
        <div className='bw_footer_modal bw_mt_1'>
          <button
            type='button'
            className='bw_btn bw_btn_success'
            onClick={() => {
              onConfirm(selectedProduct);
            }}>
            <span className='fi fi-rr-check' />
            Chọn túi, bao bì
          </button>
          <button type='button' className='bw_btn_outline bw_close_modal' onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaterialModal;
