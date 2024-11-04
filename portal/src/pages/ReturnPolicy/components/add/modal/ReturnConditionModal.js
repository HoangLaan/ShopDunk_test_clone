import DataTable from 'components/shared/DataTable/index';
import Modal from 'components/shared/Modal/index';
import { useCallback, useEffect, useMemo, useState } from 'react';
import BWButton from 'components/shared/BWButton/index';
import { getListReturnCondition } from 'services/return-policy.service';
import ReturnConditionFilter from './ReturnConditionFilter';
import { mapDataOptions4Select } from 'utils/helpers';

function ReturnConditionModal({ open, onClose, defaultDataSelect, onApply, isReturn }) {
  const policyTypeList = useMemo(
    () =>
      mapDataOptions4Select([
        { value: 0, label: 'Trả hàng' },
        { value: 1, label: 'Đổi hàng' },
        { value: 2, label: 'Tất cả' },
      ]),
    [],
  );

  const [titleApply, setTitleApply] = useState(policyTypeList[isReturn].label);

  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 5,
    type_policy: isReturn,
  });
  const [dataCondition, setDataCondition] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [returnConditionSelected, setReturnConditionSelected] = useState([]);

  const loadListReturnCondition = useCallback(() => {
    setLoading(true);
    getListReturnCondition(params)
      .then(setDataCondition)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  const { items, itemsPerPage, page, totalItems, totalPages } = dataCondition;

  ///zone handle scroll effect for header position

  const styleModal = { marginLeft: '300px' };

  const headerStyles = {
    backgroundColor: 'white',
    borderBottom: '#ddd 1px solid',
    position: 'sticky',
    marginTop: '-20px',
    zIndex: '1',
    top: '-2rem',
    width: '51rem',
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

  useEffect(loadListReturnCondition, [loadListReturnCondition]);

  const columns = useMemo(
    () => [
      {
        header: 'Điều kiện',
        accessor: 'return_condition_name',
      },
      {
        header: 'Áp dụng cho chính sách',
        accessor: 'work_schedule_review_level_name',
        formatter: () => titleApply,
      },
      {
        header: 'Ngày tạo',
        accessor: 'created_date',
      },
      {
        header: 'Người tạo',
        accessor: 'created_user',
      },
      {
        header: 'Trạng thái',
        accessor: 'is_active',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) =>
          p?.is_active ? (
            <span class='bw_label_outline bw_label_outline_success text-center'>Kích hoạt</span>
          ) : (
            <span class='bw_label_outline bw_label_outline_danger text-center'>Ẩn</span>
          ),
      },
    ],
    [titleApply],
  );

  return (
    <Modal
      witdh={'55%'}
      styleModal={styleModal}
      headerStyles={headerStyles}
      titleModal={titleModal}
      closeModal={closeModal}
      open={open}
      onClose={onClose}
      header='Danh sách điều kiện'
      footer={
        <BWButton
          type='success'
          outline
          content={'Xác nhận'}
          onClick={(e) => {
            onApply(returnConditionSelected);
            onClose();
          }}
        />
      }>
      <ReturnConditionFilter
        defaultPolicy={isReturn}
        policyTypeList={policyTypeList}
        onChange={(e) => {
          setTitleApply(() => policyTypeList.find((p) => p.value === e.type_policy).label);
          setParams((prev) => ({
            ...prev,
            ...e,
          }));
        }}
      />
      <DataTable
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
          setReturnConditionSelected(d);
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

export default ReturnConditionModal;
