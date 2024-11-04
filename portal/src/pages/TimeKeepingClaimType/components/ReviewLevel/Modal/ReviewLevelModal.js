import DataTable from 'components/shared/DataTable/index';
import Modal from 'components/shared/Modal/index';
import { useCallback, useEffect, useMemo, useState } from 'react';
import BWButton from 'components/shared/BWButton/index';
import RLMInformation from './RLMInformation';
import { getListReviewLevel, deleteReviewLevel } from 'services/time-keeping-claim-type.service';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';

function ReviewLevelModal({ open, onClose, onApply, defaultDataSelect }) {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const {watch} = methods;
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

  useEffect(() => {
    loadListReviewLevel();
  }, [loadListReviewLevel]);

  const columns = useMemo(
    () => [
      {
        header: 'Tên mức duyệt',
        classNameHeader: 'bw_text_center',
        accessor: 'review_level_name',
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

  const actions = useMemo(() => {
    return [
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'HR_TIMEKEEPINGTYPEREVIEWLEVEL_DEL',
        onClick: (d, i) => {
          console.log(">>> d", d);
          
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteReviewLevel(d.review_level_id);
                loadListReviewLevel();
              },
            ),
          );
        },
      },
    ];
  }, []);

  return (
    <Modal
      witdh={'60%'}
      open={open}
      onClose={onClose}
      header='Danh sách mức duyệt'
      footer={
        <BWButton
          type='success'
          outline
          content={'Xác nhận'}
          onClick={() => {
            onApply(
              reviewLevelSelected.map(item => ({
                ...item,
                departments: item.departments.map(d => ({...d, value: d.id}))
              }))
            );
            onClose();
          }}
        />
      }>
      <RLMInformation refreshListReviewLevel={loadListReviewLevel} />
      <DataTable
        fieldCheck={'review_level_id'}
        title='Danh sách mức duyệt'
        defaultDataSelect={defaultDataSelect}
        loading={loading}
        columns={columns}
        actions={actions}
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
        handleBulkAction={(e) => {
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteReviewLevel(e.map((o) => o.review_level_id));
                loadListReviewLevel();
              },
            ),
          );
        }}
      />
    </Modal>
  );
}

export default ReviewLevelModal;
