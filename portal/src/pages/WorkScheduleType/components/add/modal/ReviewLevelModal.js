import DataTable from 'components/shared/DataTable/index';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import Modal from 'components/shared/Modal/index';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { mapDataOptions4SelectCustom, statusTypesOption } from 'utils/helpers';
import BWButton from 'components/shared/BWButton/index';
import RLMInformation from './RLMInformation';
import { useFormContext } from 'react-hook-form';
import { getListReviewLevel } from 'services/work-schedule-type.service';

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

  useEffect(() => {
    loadListReviewLevel();
  }, []);

  const columns = useMemo(
    () => [
      {
        header: 'Tên mức duyệt',
        accessor: 'work_schedule_review_level_name',
      },
      {
        header: 'Phòng ban duyệt',
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
        accessor: 'company_name',
      },
    ],
    [],
  );

  return (
    <Modal
      witdh={'55%'}
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
              reviewLevelSelected.map((item) => ({
                work_schedule_review_level_id: item.work_schedule_review_level_id,
                work_schedule_review_level_name: item.work_schedule_review_level_name,
              })),
            );
            onClose();
          }}
        />
      }>
      <RLMInformation refreshListReviewLevel={loadListReviewLevel} />
      <DataTable
        hiddenDeleteClick
        defaultDataSelect={defaultDataSelect}
        // fieldCheck='user_id'
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
