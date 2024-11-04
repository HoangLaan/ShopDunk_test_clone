import DataTable from 'components/shared/DataTable/index';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import ModalBusiness from './Modal/ModalBusiness';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { showConfirmModal } from 'actions/global';
import { useDispatch } from 'react-redux';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';
import { PERMISSION_PAYMENT_FORM } from 'pages/PaymentForm/utils/constants';

const BusinessTable = ({ disabled }) => {
  const { control, watch, setValue, register, getFieldState, formState } = useFormContext();
  const dispatch = useDispatch();
  const [openModalBusiness, setOpenModalBusiness] = useState(false);
  const [params, setParams] = useState({
    page: 1,
    itemsPerPage: 5,
  });

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1,
      },
      {
        header: 'Tên miền',
        classNameHeader: 'bw_text_left bw_text_center',
        classNameBody: 'bw_text_left',
        formatter: (item, index) => item.business_code + '-' + item.business_name,
      },
      {
        header: 'Khu vực',
        accessor: 'area_name',
        classNameHeader: 'bw_text_left bw_text_center',
        classNameBody: 'bw_text_left',
      },
      {
        header: 'Địa chỉ',
        accessor: 'address',
        classNameHeader: 'bw_text_left bw_text_center',
        classNameBody: 'bw_text_left',
      },
    ],
    [],
  );

  const { fields, remove } = useFieldArray({
    control,
    name: 'list_business',
    rules: watch('is_all_business') ? 'Bắt buộc chọn miền' : false,
  });

  const { error } = getFieldState('list_business', formState);

  const totalPages = useMemo(() => Math.ceil(fields.length / params.itemsPerPage), [fields, params.itemsPerPage]);

  const data = useMemo(() => {
    let start = (params.page - 1) * params.itemsPerPage;
    let end = start + params.itemsPerPage;
    return fields.slice(start, end);
  }, [fields, params.itemsPerPage, params.page]);

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Chọn',
        permission: [PERMISSION_PAYMENT_FORM.ADD, PERMISSION_PAYMENT_FORM.EDIT],
        hidden: disabled || watch('is_all_business') === 1,
        onClick: () => setOpenModalBusiness(true),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        disabled: disabled,
        permission: [PERMISSION_PAYMENT_FORM.ADD, PERMISSION_PAYMENT_FORM.EDIT],
        onClick: (_, d) => {
          dispatch(
            showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () => {
              remove(d);
            }),
          );
        },
      },
    ];
  }, [disabled, remove, watch('is_all_business')]);

  const handleAddBusiness = (items) => {
    setValue('list_business', items);
    setOpenModalBusiness(false);
  };

  useEffect(() => {
    if (totalPages > 0 && params.page > totalPages) {
      setParams((prev) => ({
        ...prev,
        page: prev.page - 1,
      }));
    }
  }, [totalPages, params]);

  useEffect(() => {
    register('list_business', {
      required: watch('is_all_business') ? false : 'Bắt buộc chọn miền',
    });
  }, [watch('is_all_business')]);

  return (
    <Fragment>
      <label className='bw_checkbox'>
        <FormInput disabled={disabled} type='checkbox' field='is_all_business' />
        <span />
        Áp dụng tất cả miền
      </label>
      {!watch('is_all_business') && (
        <DataTable
          title={<ErrorMessage message={error?.root?.message} />}
          columns={columns}
          data={data}
          actions={actions}
          noSelect
          totalPages={totalPages}
          itemsPerPage={params.itemsPerPage}
          page={params.page}
          totalItems={fields.length}
          onChangePage={(data) => {
            setParams((prev) => ({
              ...prev,
              page: data,
            }));
          }}
        />
      )}
      {openModalBusiness && (
        <ModalBusiness
          open={openModalBusiness}
          handleAddBusiness={handleAddBusiness}
          onClose={() => setOpenModalBusiness(false)}
          defaultDataSelect={fields}></ModalBusiness>
      )}
    </Fragment>
  );
};
export default BusinessTable;
