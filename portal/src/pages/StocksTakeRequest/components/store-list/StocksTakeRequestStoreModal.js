import React, { useState, useMemo, useCallback, useEffect } from 'react';
import DataTable from 'components/shared/DataTable';

import Modal from 'components/shared/Modal';
import BWButton from 'components/shared/BWButton';

import { useDispatch } from 'react-redux';
import { getList } from 'services/store.service';
import { useFormContext } from 'react-hook-form';
import { defaultPaging } from 'utils/helpers';
import Filter from 'pages/Store/components/Filter';

const StocksTakeRequestStoreModal = ({ open, onClose }) => {
  const methods = useFormContext();
  const dispatch = useDispatch();
  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 5,
  });

  const [dataProductCategory, setDataProductCategory] = useState(defaultPaging);

  const { items, itemsPerPage, page, totalItems, totalPages } = dataProductCategory;

  ///zone handle scroll effect for header position

  const styleModal = { marginLeft: '300px' };

  const headerStyles = {
    backgroundColor: 'white',
    borderBottom: '#ddd 1px solid',
    position: 'sticky',
    marginTop: '-20px',
    zIndex: '1',
    top: '-2rem',
    width: '47rem',
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

  const loadCustomerType = useCallback(() => {
    getList(params).then((data) => {
      setDataProductCategory(data);
    });
  }, [dispatch, params]);
  useEffect(loadCustomerType, [loadCustomerType]);

  const handleSubmitFilter = (values) => {
    let _query = { ...params, ...values, page: 1 };
    setParams(_query);
  };

  const columns = useMemo(
    () => [
      {
        header: 'Mã cửa hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'store_code',
        formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.store_code}</b>,
      },
      {
        header: 'Cửa hàng',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <b>{p?.store_name}</b>,
      },
      {
        header: 'Miền',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <span>{p?.area_name}</span>,
      },
      {
        header: 'Cụm',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <span>{p?.cluster_name}</span>,
      },
      {
        header: 'Số điện thoại',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <span>{p?.phone_number}</span>,
      },
      {
        header: 'Trạng thái',
        classNameHeader: 'bw_text_center',
        accessor: 'is_active',
        formatter: (p) =>
          p?.is_active ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Kích hoạt</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Khóa</span>
          ),
      },
    ],
    [],
  );

  return (
    <React.Fragment>
      <Modal
        witdh='70vw'
        // styleModal={styleModal}
        // headerStyles={headerStyles}
        // titleModal={titleModal}
        // closeModal={closeModal}
        header='Chọn cửa hàng'
        open={open}
        onClose={onClose}
        footer={
          <BWButton
            type='success'
            outline
            content={'Xác nhận'}
            onClick={() => {
              document.getElementById('trigger-delete').click();
              onClose();
            }}
          />
        }>
        <Filter onChange={handleSubmitFilter} />

        <DataTable
          hiddenDeleteClick
          hiddenActionRow
          fieldCheck='store_id'
          defaultDataSelect={methods.watch('store_apply_list')}
          columns={columns}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          handleBulkAction={(e) => {
            methods.setValue('store_apply_list', e);
          }}
          onChangePage={(page) => {
            setParams({
              ...params,
              page,
            });
          }}
        />
      </Modal>
    </React.Fragment>
  );
};

export default StocksTakeRequestStoreModal;
