import React, { useCallback, useState, useEffect } from 'react';
import { showToast } from 'utils/helpers';

import { deleteItem, getList } from '../helpers/call-api';
import OutputTypeTable from 'pages/OutputType/components/OutputTypeTable';
import OutputTypeFilter from 'pages/OutputType/components/OutputTypeFilter';

const OutputTypePage = () => {
  const [params, setParams] = useState({
    page: 1,
    itemsPerPage: 25,
    is_active: 2,
    is_vat: 2,
  });
  const [dataOutputType, setDataOutputType] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);

  const { items = [], itemsPerPage, page, totalItems, totalPages } = dataOutputType;

  const loadOutputType = useCallback(() => {
    setLoading(true);
    getList(params)
      .then(setDataOutputType)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  useEffect(loadOutputType, [loadOutputType]);

  const handleDelete = async (output_type_id) => {
    deleteItem({ output_type_id: output_type_id })
      .then(() => {
        loadOutputType();

        showToast.success(`Xoá thành công.`, {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      })
      .catch((error) => {
        if (error.message) {
          showToast.error(error ? error.message : 'Có lỗi xảy ra!', {
            position: 'top-right',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });
        }
      });
  };

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <OutputTypeFilter
          onChange={(p) => {
            setParams({
              ...params,
              ...p,
            });
          }}
        />
        <OutputTypeTable
          onChangePage={(page) => {
            setParams({
              ...params,
              page,
            });
          }}
          handleDelete={handleDelete}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          loading={loading}
        />
      </div>
    </React.Fragment>
  );
};

export default OutputTypePage;
