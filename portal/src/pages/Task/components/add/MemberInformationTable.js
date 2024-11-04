import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFormContext, useFieldArray } from 'react-hook-form';
import PropTypes from 'prop-types';

import BWAccordion from 'components/shared/BWAccordion/index';
import DataTable from 'components/shared/DataTable/index';
import SelectMemberModal from './modals/SelectMemberModal';

import { showConfirmModal } from 'actions/global';

const MemberInformationTable = ({ disabled, loading, title }) => {
  const methods = useFormContext();
  const { control, watch } = methods;
  const { remove } = useFieldArray({
    control,
    name: 'member_list',
  });
  const dispatch = useDispatch();
  const [isShowModal, setIsShowModal] = useState(false);
  const [customerType, setCustomerType] = useState(1);

  //style for action
  const styleAction = { gap: '10px', flexWrap: 'nowrap', minWidth: '100%' };

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1,
      },
      {
        header: 'Mã khách hàng',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'customer_code',
      },
      {
        header: 'Tên khách hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'full_name',
      },
      {
        header: 'Giới tính',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (value) => (value.gender === 1 ? 'Nam' : 'Nữ'),
      },
      {
        header: 'Ngày sinh',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'birthday',
      },
      {
        header: 'SĐT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'phone_number',
      },
      {
        header: 'Email',
        classNameHeader: 'bw_text_center',
        accessor: 'email',
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm khách hàng cá nhân',
        hidden: disabled,
        onClick: () => {
          setCustomerType(1);
          setIsShowModal(true);
        },
      },
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm khách hàng tiềm năng',
        hidden: disabled,
        onClick: () => {
          setCustomerType(2);
          setIsShowModal(true);
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        hidden: disabled,
        onClick: (_, index) =>
          dispatch(
            showConfirmModal(['Xoá khách hàng này?'], () => {
              remove(index);
            }),
          ),
      },
    ];
  }, [remove, disabled, dispatch, setIsShowModal]);

  const member_list = watch('member_list');

  return (
    <>
      <React.Fragment>
        <BWAccordion title={title}>
          <DataTable
            styleAction={styleAction}
            style={{
              marginTop: '0px',
            }}
            hiddenActionRow
            noPaging
            noSelect
            data={member_list}
            columns={columns}
            loading={loading}
            actions={actions}
          />
        </BWAccordion>

        {isShowModal && (
          <SelectMemberModal
            onClose={() => {
              setIsShowModal(false);
            }}
            customerType={customerType}
          />
        )}
      </React.Fragment>
    </>
  );
};

MemberInformationTable.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  title: PropTypes.string,
};

export default MemberInformationTable;
