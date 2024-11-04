import React from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';

import Filter from '../components/Filter';
import Table from '../components/Table';
import ModalSendMail from '../components/SendMailModal';
import StatisticsBlock from '../components/Statistics';

import { getList } from 'services/email-history.service';

import { defaultPaging, defaultParams } from 'utils/helpers';

const Email = () => {
  const [openModel, setOpenModel] = useState(false);
  const [params, setParams] = useState(defaultParams);
  const [dataList, setDataList] = useState(defaultPaging);
  const [loading, setLoading] = useState(true);

  const { items, itemsPerPage, page, totalItems, totalPages, meta } = dataList;

  const getData = useCallback(() => {
    setLoading(true);
    getList(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  useEffect(getData, [getData]);

  const onFilter = (e) => {
    setParams((prev) => {
      return {
        ...prev,
        ...e,
      };
    });
  };

  return (
    <>
      <div class='bw_main_wrapp'>
        <div className='bw_row'>
          <div className='bw_col_2'>
            <StatisticsBlock onChagne={onFilter} meta={meta} />
          </div>
          <div className='bw_col_10'>
            <Filter onChange={onFilter} />
          </div>
        </div>

        <Table
          onChangePage={(page) => {
            setParams({
              ...params,
              page,
            });
          }}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          loading={loading}
          openModalSendMail={() => {
            setOpenModel(true);
          }}
          onRefresh={getData}
        />
      </div>
      {openModel && (
        <ModalSendMail
          onClose={() => {
            setOpenModel(false);
          }}
          onRefresh={getData}
        />
      )}
    </>
  );
};

export default Email;
