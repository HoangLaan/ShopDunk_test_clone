import { showConfirmModal } from 'actions/global';
import { Input } from 'antd';
import BWAccordion from 'components/shared/BWAccordion/index';
import BWButton from 'components/shared/BWButton/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import DataTable from 'components/shared/DataTable/index';
import FormPassword from 'pages/PayPartner/utils/FormPassword';
import { PERMISSION_PAY_PARTNER } from 'pages/PayPartner/utils/constants';
import { useMemo } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useDispatch } from 'react-redux';

const ApiInformation = ({ disabled }) => {
  const { control, watch, clearErrors, setValue } = useFormContext();
  const dispatch = useDispatch();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'list_api',
  });

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_sticky bw_name_sticky',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (item, index) => index + 1,
      },
      {
        header: 'Link API',
        classNameHeader: 'bw_text_center',
        formatter: (_, index) => <FormInput className={'bw_inp'} field={`list_api.${index}.api_url`}></FormInput>,
      },
      {
        header: 'Tài khoản',
        classNameHeader: 'bw_text_center',
        formatter: (_, index) => <FormInput className={'bw_inp'} field={`list_api.${index}.account`}></FormInput>,
      },
      {
        header: 'Mật khẩu',
        classNameHeader: 'bw_text_center',
        formatter: (_, index) => <FormPassword field={`list_api.${index}.password`} />,
      },
      {
        header: 'Mặc định',
        accessor: 'partner_payment_code',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => (
          <label className='bw_radio'>
            <input
              type='radio'
              name='bw_type'
              disabled={disabled}
              checked={watch(`list_api.${index}.is_default`) === 1}
              onChange={(e) => {
                let indexDefault = watch('list_api')?.findIndex((x) => x.is_default === 1);
                if (indexDefault > -1) {
                  setValue(`list_api.${indexDefault}.is_default`, 0);
                }
                clearErrors(`list_api.${index}.is_default`);
                setValue(`list_api.${index}.is_default`, 1);
              }}
            />
            <span />
          </label>
        ),
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
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
    <BWAccordion title={'Thông tin api'}>
      <div className='bw_col_12'>
        <DataTable columns={columns} data={fields} actions={actions} noPaging />
        <BWButton className='bw_mt_2' disabled={disabled} content={'Thêm dòng'} onClick={() => append()} />
      </div>
    </BWAccordion>
  );
};
export default ApiInformation;
