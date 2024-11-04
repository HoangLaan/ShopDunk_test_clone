import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFormContext, useFieldArray } from 'react-hook-form';
import PropTypes from 'prop-types';
// import { showToast } from 'utils/helpers';

import BWAccordion from 'components/shared/BWAccordion/index';
import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import BankAccountModal from './modals/BankAccount/BankAccountModal';

const BankAccountTable = ({ disabled, loading, title }) => {
  const methods = useFormContext();
  const { control, watch } = methods;
  const { remove } = useFieldArray({
    control,
    name: 'bank_account_list',
  });
  const dispatch = useDispatch();
  const [isShowBankAccountModal, setIsShowBankAccountModal] = useState(false);

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1,
      },
      {
        header: 'STK',
        classNameHeader: 'bw_text_center',
        formatter: (_, index) => {
          const bankAccount = watch(`bank_account_list`)[index];
          return `${bankAccount.bank_number} - ${bankAccount.bank_account_name}`;
        },
      },
      {
        header: 'Ngân hàng',
        classNameHeader: 'bw_text_center',
        formatter: (d, index) => {
          const bankAccount = watch(`bank_account_list`)[index];
          return (
            <div className='bw_inf_pro'>
              <img
                alt=''
                src={
                  /[/.](gif|jpg|jpeg|tiff|png)$/i.test(bankAccount?.bank_logo)
                    ? bankAccount.bank_logo
                    : 'bw_image/logo.png'
                }
              />
              {bankAccount?.bank_name}
            </div>
          );
        },
      },
      {
        header: 'Mô tả',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => {
          return watch(`bank_account_list`)[index]?.description;
        },
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
        content: 'TK Ngân Hàng',
        hidden: disabled,
        permission:['MD_RECEIVETYPE_ADD', 'MD_RECEIVETYPE_EDIT'],
        onClick: () => {
          setIsShowBankAccountModal(true);
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        hidden: disabled,
        onClick: (_, index) =>
          dispatch(
            showConfirmModal(['Xoá tài khoản này?'], () => {
              remove(index);

              //update order index
              methods.setValue(
                'bank_account_list',
                methods.watch('bank_account_list')?.map((e, idx) => {
                  return { ...e, order_index: idx };
                }),
              );
            }),
          ),
      },
    ];
  }, []);

  return (
    <React.Fragment>
      <BWAccordion title={title}>
        <DataTable
          style={{
            marginTop: '0px',
          }}
          hiddenActionRow
          noPaging
          noSelect
          data={methods.watch('bank_account_list')}
          columns={columns}
          loading={loading}
          actions={actions}
        />
      </BWAccordion>

      {isShowBankAccountModal && (
        <BankAccountModal
          onClose={() => {
            setIsShowBankAccountModal(false);
          }}
          setBankAccountModalData={() => {}}
        />
      )}
    </React.Fragment>
  );
};

BankAccountTable.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default BankAccountTable;
