import DataTable from 'components/shared/DataTable/index';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import Modal from 'components/shared/Modal/index';
import { useCallback, useEffect, useMemo, useState } from 'react';
import BWButton from 'components/shared/BWButton/index';
import RLMInformation from './RLMInformation';
import { getListReviewLevel } from 'services/transfer-shift-type.service';

function ReviewLevelModal({ open, onClose, defaultDataSelect, onApply }) {
  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 5,
  });
  const [listReviewLevel, setListReviewLevel] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [reviewLevelSelected, setReviewLevelSelected] = useState([]);

  const loadListReviewLevel = useCallback(() => {
    setLoading(true);
    getListReviewLevel(params)
      .then(setListReviewLevel)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  const { items, itemsPerPage, page, totalItems, totalPages } = listReviewLevel;

  ///zone handle scroll effect for header position

  const styleModal = { marginLeft: '300px' };

  const headerStyles = {
    backgroundColor: 'white',
    borderBottom: '#ddd 1px solid',
    position: 'sticky',
    marginTop: '-20px',
    zIndex: '1',
    top: '-2rem',
    width: '55rem',
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

  useEffect(() => {
    loadListReviewLevel();
  }, [loadListReviewLevel]);

  const columns = useMemo(
    () => [
      {
        header: 'Tên mức duyệt',
        classNameHeader: 'bw_text_center',
        accessor: 'transfer_shift_review_level_name',
      },
      {
        header: 'Phòng ban duyệt',
        classNameHeader: 'bw_text_center',
        formatter: (d) => {
          const totalDepartment = d.departments.length;
          return d.departments.map((de, i) => {
            return (
              <p>
                {de.name}
                {i !== totalDepartment - 1 && <hr />}
              </p>
            );
          });
        },
      },
      {
        header: 'Vị trí duyệt',
        classNameHeader: 'bw_text_center',
        formatter: (d, i) => {
          const totalDepartment = d.departments.length;
          return d.departments.map((de, i) => {
            const totalPosition = de.positions.length;
            return de.positions.map((po, indexPo) => {
              return (
                <p>
                  {po.name}
                  {indexPo === totalPosition - 1 && totalPosition !== 1 && totalDepartment > 1 && <hr />}
                </p>
              );
            });
          });
        },
      },
      {
        header: 'Công ty',
        classNameHeader: 'bw_text_center',
        accessor: 'company_name',
      },
    ],
    [],
  );

  //style for title table
  const styleTitle = { fontSize: '18px', fontWeight: '700' };

  return (
    <Modal
      witdh={'60%'}
      open={open}
      onClose={onClose}
      styleModal={styleModal}
      titleModal={titleModal}
      headerStyles={headerStyles}
      closeModal={closeModal}
      header='Danh sách mức duyệt'
      footer={
        <BWButton
          type='success'
          outline
          content={'Xác nhận'}
          onClick={() => {
            onApply(
              reviewLevelSelected.map((item) => ({
                transfer_shift_review_level_id: item.transfer_shift_review_level_id,
                transfer_shift_review_level_name: item.transfer_shift_review_level_name,
                departments: item.departments.map((d) => ({ ...d, id: d.id ?? 0 })),
              })),
            );
            onClose();
          }}
        />
      }>
      <RLMInformation refreshListReviewLevel={loadListReviewLevel} />
      <DataTable
        styleTitle={styleTitle}
        title='Danh sách mức duyệt'
        hiddenDeleteClick
        defaultDataSelect={defaultDataSelect}
        loading={loading}
        columns={columns}
        data={items}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        onChangeSelect={(d) => {
          setReviewLevelSelected(d);
        }}
        onChangePage={(page) => {
          setParams({
            ...params,
            page,
          });
        }}
      />
    </Modal>
  );
}

export default ReviewLevelModal;
