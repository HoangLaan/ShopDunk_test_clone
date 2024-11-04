import React, { useCallback, useState, useEffect } from 'react';
import { showToast } from 'utils/helpers';

import { deleteItem, getList } from 'pages/PriceReviewLevel/helpers/call-api';
import PriceReviewLevelTable from 'pages/PriceReviewLevel/components/PriceReviewLevelTable';
import PriceReviewLevelFilter from 'pages/PriceReviewLevel/components/PriceReviewLevelFilter';

const PriceReviewLevelPage = () => {
  const [params, setParams] = useState({
    page: 1,
    itemsPerPage: 25,
    is_active: 2,
  });
  const [dataPriceReviewLevel, setDataPriceReviewLevel] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);

  const { items = [], itemsPerPage, page, totalItems, totalPages } = dataPriceReviewLevel;

  const loadPriceReviewLevel = useCallback(() => {
    setLoading(true);
    getList(params)
      .then(setDataPriceReviewLevel)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  useEffect(loadPriceReviewLevel, [loadPriceReviewLevel]);

  const handleDelete = async (price_review_level_id) => {
    // Lấy ra vị trí
    deleteItem({ price_review_level_id: price_review_level_id })
      .then(() => {
        loadPriceReviewLevel();

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
        <PriceReviewLevelFilter
          onChange={(p) => {
            setParams({
              ...params,
              ...p,
            });
          }}
        />
        <PriceReviewLevelTable
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
          loading={loading}
          totalItems={totalItems}
        />
      </div>
    </React.Fragment>
  );
};

export default PriceReviewLevelPage;
