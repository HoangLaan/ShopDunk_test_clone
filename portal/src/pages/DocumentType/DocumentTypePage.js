import React, { useState, useCallback, useEffect } from 'react';
// services
import { getList } from 'services/document-type.service';
//components
import DocumentTypeTable from './components/DocumentTypeTable';
import DocumentTypeFilter from './components/DocumentTypeFilter';

const DocumentTypePage = () => {
  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 25,
    is_managed_document: 0,
  });
  const [dataList, setDataList] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadDocumentType = useCallback(() => {
    setLoading(true);
    getList(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadDocumentType, [loadDocumentType]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <DocumentTypeFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <DocumentTypeTable
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
          onRefresh={loadDocumentType}
        />
      </div>
    </React.Fragment>
  );
};

export default DocumentTypePage;
