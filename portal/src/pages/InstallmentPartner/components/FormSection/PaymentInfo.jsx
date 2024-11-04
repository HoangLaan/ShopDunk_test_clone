import React from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { PayTypeOptions } from 'pages/InstallmentPartner/utils/constant';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import DataTable from 'components/shared/DataTable';
import { useDispatch } from 'react-redux';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useMemo } from 'react';
import { showConfirmModal } from 'actions/global';
import { RulePositiveNumber, RulePrice } from 'pages/InstallmentPartner/utils/validate';

const FIELD_NAME = 'payment_list';

const PaymentInfo = ({ disabled, title, id }) => {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const { control, setValue, getValues } = methods;

  const { remove, append } = useFieldArray({
    control,
    name: FIELD_NAME,
  });

  const columns = [
    {
      header: 'STT',
      formatter: (_, index) => index + 1,
      classNameBody: 'bw_text_center',
      classNameHeader: 'bw_text_center',
    },
    {
      header: 'Thời gian phát sinh đơn hàng',
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      accessor: 'parent_name',
      formatter: (item, index) => {
        return (
          <div className='bw_flex bw_align_items_center bw_justify_content_center' style={{ gap: '6px' }}>
            <span>Từ</span>
            <FormNumber
              bordered
              disabled={disabled}
              style={{ width: 'fit_content' }}
              validation={RulePrice}
              field={`${FIELD_NAME}.${index}.order_create_from`}
            />
            <span>Đến</span>
            <FormNumber
              bordered
              disabled={disabled}
              style={{ width: 'fit_content' }}
              validation={RulePrice}
              field={`${FIELD_NAME}.${index}.order_create_to`}
            />
          </div>
        );
      },
    },
    {
      header: 'Thời gian thanh toán',
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      accessor: 'parent_name',
      formatter: (item, index) => {
        return (
          <FormNumber
            style={{ width: 'fit_content' }}
            bordered
            disabled={disabled}
            validation={RulePrice}
            field={`${FIELD_NAME}.${index}.payment_day`}
          />
        );
      },
    },
  ];

  const actions = useMemo(
    () => [
      {
        globalAction: true,
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Thêm dòng',
        permission: 'SL_INSTALLMENTPARTNER_ADD',
        onClick: () => {
          append({});
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        disabled: disabled,
        permission: 'SL_INSTALLMENTPARTNER_ADD',
        onClick: (_, index) => {
          if (!disabled) {
            dispatch(
              showConfirmModal(
                ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
                async () => {
                  remove(index);
                },
              ),
            );
          }
        },
      },
    ],
    [],
  );

  return (
    <BWAccordion title={title} id={id}>
      <div className='bw_row'>
        <div class='bw_col_12'>
          <FormItem disabled={disabled} label='Kiểu thanh toán'>
            <FormSelect type='text' field='payment_type' list={PayTypeOptions} disabled={disabled} />
          </FormItem>
        </div>
        <div class='bw_col_12'>
          <DataTable noSelect noPaging actions={actions} columns={columns} data={methods.watch(FIELD_NAME) || []} />
        </div>
        <div class='bw_col_12 bw_mt_2'>
          <label className='bw_checkbox'>
            <FormInput type='checkbox' field='payment_on_weekend' disabled={disabled} />
            <span />
            Trừ thứ 7, chủ nhật và các ngày lễ trong năm
          </label>
        </div>
      </div>
    </BWAccordion>
  );
};

export default PaymentInfo;
