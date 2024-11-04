import React, { useMemo, useState } from 'react';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import { useFieldArray, useFormContext } from 'react-hook-form';
import DataTable from 'components/shared/DataTable/index';
import BWAccordion from 'components/shared/BWAccordion/index';
import ICON_COMMON from 'utils/icons.common';
import {useDispatch} from "react-redux";
import SelectMemberModal from "../components/SelectMemberModal";
import {showConfirmModal} from "../../../../../actions/global";
import CustomerAdd from 'pages/LockShiftOpen/components/modals/CustomerAdd';

const LockShiftCustomer = ({ disabled, onSubmit, title }) => {
  const methods = useFormContext();
  const { watch, control } = methods;
  const dispatch = useDispatch();
  const [isShowModal, setIsShowModal] = useState(false);
  const [isOpenCustomerAdd, setIsOpenCustomerAdd] = useState(false);
  const [customerType, setCustomerType] = useState(1);
  const { remove } = useFieldArray({
    control,
    name: 'list_shift_customer',
  });

  const columns = [
    {
      header: 'STT',
      formatter: (_, index) => index + 1,
      classNameBody: 'bw_text_center',
      classNameHeader: 'bw_text_center',
    },
    {
      header: 'Mã KH',
      accessor: 'customer_code',
      classNameBody: 'bw_text_center',
      classNameHeader: 'bw_text_center',
    },
    {
      header: 'Tên khách hàng',
      accessor: 'full_name',
      classNameHeader: 'bw_text_center',
    },
    {
      header: 'SĐT',
      accessor: 'phone_number',
      classNameBody: 'bw_text_center',
      classNameHeader: 'bw_text_center',
    },
    {
      header: 'Email',
      accessor: 'email',
      classNameHeader: 'bw_text_center',
    },
    {
      header: 'Ghi chú',
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      formatter: (_, index) => (
        <FormItem>
          <FormInput className='bw_inp' field={`list_shift_customer.${index}.note`} />
        </FormItem>
      ),
    },
    {
      header: 'Trạng thái',
      classNameHeader: 'bw_text_center',
      accessor: 'is_overdue',
      formatter: (p) => {
        return <span className='bw_label_outline bw_label_outline_success text-center'>Chưa chăm sóc</span>;
      },
    },
  ];

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: ICON_COMMON.add,
        type: 'warning',
        content: 'Phân công công việc',
        permission: "MD_LOCKSHIFT_ADD",
        onClick: () => window._$g.rdr('/user-schedule/add'),
      },
      {
        globalAction: true,
        icon: ICON_COMMON.add,
        type: 'success',
        content: 'Thêm mới khách hàng',
        permission: "MD_LOCKSHIFT_ADD",
        onClick: () => setIsOpenCustomerAdd(true)
      },
      {
        globalAction: true,
        icon: ICON_COMMON.add,
        type: 'primary',
        content: 'Chọn khách hàng',
        permission: 'MD_LOCKSHIFT_ADD',
        onClick: () => setIsShowModal(true),
      },
      {
        icon: ICON_COMMON.edit,
        color: 'blue',
        permission: 'MD_LOCKSHIFT_ADD',
      },
      {
        icon: ICON_COMMON.view,
        color: 'green',
        permission: 'MD_LOCKSHIFT_ADD',
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        permission: 'MD_LOCKSHIFT_ADD',
        onClick: (p, index) => remove(index),
      },
    ];
  }, []);

  return (
    <BWAccordion title={title} id='bw_info_cus'>
      <div className='bw_col_12'>
        <DataTable noSelect noPaging columns={columns} actions={actions}
                   data={watch('list_shift_customer')}/>
      </div>
      {isShowModal && (
        <SelectMemberModal
          onClose={() => {
            setIsShowModal(false);
          }}
          customerType={customerType}
        />
      )}
      {isOpenCustomerAdd && (
        <CustomerAdd setIsOpenAddCutomer={setIsOpenCustomerAdd}/>
      )}
    </BWAccordion>
  );
};

export default LockShiftCustomer;
