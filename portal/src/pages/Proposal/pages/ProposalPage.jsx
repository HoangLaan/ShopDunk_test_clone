import React, { useState, useCallback, useEffect } from 'react';
import ProposalFilter from '../components/ProposalFilter';
import ProposalTable from '../components/ProposalTable';
import { getListProposal } from 'services/proposal.service';

const ProposalPage = () => {
  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 25,
  });
  const [dataList, setDataList] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
    totalReview: {},
  });
  const [loading, setLoading] = useState(true);
  const { items, itemsPerPage, page, totalItems, totalPages , totalReview } = dataList;

  const loadProposal = useCallback(() => {
    setLoading(true);
    getListProposal(params)
      .then((x) =>
        setDataList((prev) => ({
          ...prev,
          ...x.data,
          totalReview: x.total_review
        })),
      )
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadProposal, [loadProposal]);
  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <ProposalFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <ProposalTable
          loading={loading}
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
          totalReview={totalReview}
          totalItems={totalItems}
          onRefresh={loadProposal}
          onChangeStatus={(isReview) => {
            setParams({
              ...params,
              is_review: isReview,
            });
          }}
        />
      </div>
    </React.Fragment>
  );
};

export default ProposalPage;
