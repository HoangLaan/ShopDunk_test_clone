import DataTable from 'components/shared/DataTable/index';
import Modal from 'components/shared/Modal/index';
import { useCallback, useEffect, useMemo, useState } from 'react';
import BWButton from 'components/shared/BWButton/index';
import { getSalaryElementList } from 'services/payroll-template.service';
import SalaryElementFilter from './SalaryElementFilter';
import { elementTypeOptions, propertiesOptions } from 'pages/PayrollTemplate/helper/const';

function SalaryElementModal({ open, onClose, defaultDataSelect, onApply, companyOptions }) {
  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 10,
  });
  const [listSalaryElement, setListSalaryElement] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [productSelected, setSalaryElementSelected] = useState([]);

  const loadListSalaryElement = useCallback(() => {
    setLoading(true);
    getSalaryElementList(params)
      .then(setListSalaryElement)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  const { items, itemsPerPage, page, totalItems, totalPages } = listSalaryElement;

  useEffect(() => loadListSalaryElement(), [loadListSalaryElement]);

  const columns = useMemo(
    () => [
      {
        header: 'Mã thành phần',
        accessor: 'element_code',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
      },
      {
        header: 'Tên thành phần',
        accessor: 'element_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
      },
      {
        header: 'Loại thành phần',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
        formatter: (d) => elementTypeOptions.find((e) => e.value === d.element_type)?.label,
      },
      {
        header: 'Tính chất',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
        formatter: (d) => propertiesOptions.find((e) => e.value === d.property)?.label,
      },
      {
        header: 'Người tạo',
        accessor: 'created_user',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Ngày tạo',
        accessor: 'created_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
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
    [],
  );

  return (
    <Modal
      witdh={'80%'}
      open={open}
      onClose={onClose}
      header='Chọn thành phần lương'
      footer={
        <BWButton
          type='success'
          outline
          content={'Xác nhận'}
          onClick={() => {
            onApply(productSelected);
            onClose();
          }}
        />
      }>
      <SalaryElementFilter
        companyOptions={companyOptions}
        onChange={(e) => {
          setParams((prev) => {
            return {
              ...prev,
              ...e,
            };
          });
        }}
      />
      <DataTable
        hiddenDeleteClick
        defaultDataSelect={defaultDataSelect}
        fieldCheck={'element_id'}
        loading={loading}
        columns={columns}
        data={items}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        onChangeSelect={(d) => {
          setSalaryElementSelected(d);
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

export default SalaryElementModal;
