import { showConfirmModal } from 'actions/global';
import BWAccordion from 'components/shared/BWAccordion/index';
import DataTable from 'components/shared/DataTable/index';
import { useMemo, useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import ModalStoreBankAccount from '../Modal/ModalStoreBankAccount';
import { PERMISSION_PAY_PARTNER } from 'pages/PayPartner/utils/constants';

const BeneficiaryAccount = ({ disabled, title }) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { control, setValue } = useFormContext();
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (item, index) => index + 1,
      },
      {
        header: 'Chủ tài khoản *',
        accessor: 'partner_payment_code',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Số tài khoản *',
        accessor: 'bank_number',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Ngân hàng *',
        accessor: 'bank_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Chi nhánh ',
        accessor: 'bank_branch',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Cửa hàng *',
        accessor: 'store_name',
        classNameHeader: 'bw_text_center',
      },
    ],
    [],
  );

  const { fields, remove } = useFieldArray({
    control,
    name: 'list_account',
  });

  const handleAddStoreBankAccount = (items) => {
    setValue('list_account', items);
    setIsOpenModal(false);
  };

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm mới',
        permission: [PERMISSION_PAY_PARTNER.ADD, PERMISSION_PAY_PARTNER.EDIT],
        hidden: disabled,
        onClick: () => setIsOpenModal(true),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        hidden: disabled,
        permission: [PERMISSION_PAY_PARTNER.ADD, PERMISSION_PAY_PARTNER.EDIT],
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () =>
              remove(d),
            ),
          ),
      },
    ];
  }, []);

  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <DataTable noSelect columns={columns} data={fields} actions={actions} noPaging />
      </div>
      {isOpenModal && (
        <ModalStoreBankAccount
          open={isOpenModal}
          defaultDataSelect={fields}
          onClose={() => setIsOpenModal(false)}
          handleAddStoreBankAccount={handleAddStoreBankAccount}
        />
      )}
    </BWAccordion>
  );
};
export default BeneficiaryAccount;
