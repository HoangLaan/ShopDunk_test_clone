import React, { useMemo } from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { PAYER, PayerOptions, PeriodUnitOptions, UNITS } from 'pages/InstallmentPartner/utils/constant';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import { RulePercent } from 'pages/InstallmentPartner/utils/validate';

const FIELD_NAME = 'period_list';

const InstallmentPeriod = ({ disabled, title, id }) => {
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
      header: 'Kỳ hạn trả góp',
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      formatter: (item, index) => {
        return (
          <div className='bw_row'>
            <div className='bw_col_6'>
              <FormInput
                bordred
                style={{ minWidth: 'unset' }}
                className='bw_inp'
                type='text'
                disabled={disabled}
                placeholder='Gía trị'
                field={`${FIELD_NAME}.${index}.period_value`}
                validation={{
                  required: 'Kỳ hạn trả góp là bắt buộc',
                }}
              />
            </div>
            <div className='bw_col_6'>
              <FormSelect
                field={`${FIELD_NAME}.${index}.period_unit`}
                bordered
                disabled={disabled}
                list={PeriodUnitOptions}
                validation={{
                  required: 'Đơn vị là bắt buộc',
                }}
              />
            </div>
          </div>
        );
      },
    },
    {
      header: 'Mức trả trước tối thiểu',
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      accessor: 'parent_name',
      formatter: (item, index) => {
        return (
          <FormNumber
            bordered
            disabled={disabled}
            field={`${FIELD_NAME}.${index}.min_prepay`}
            validation={RulePercent}
            addonAfter='%'
          />
        );
      },
    },
    {
      header: 'Lãi suất phải trả',
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      accessor: 'parent_name',
      formatter: (item, index) => {
        return (
          <FormNumber
            bordered
            disabled={disabled}
            field={`${FIELD_NAME}.${index}.interest_rate`}
            validation={RulePercent}
            addonAfter='%'
          />
        );
      },
    },
    {
      header: 'Đối tượng trả lãi suất',
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      accessor: 'parent_name',
      formatter: (item, index) => {
        return <FormSelect bordered disabled={disabled} field={`${FIELD_NAME}.${index}.payer`} list={PayerOptions} />;
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
        permission: 'SL_INSTALLMENTFORM_ADD',
        onClick: () => {
          append({
            period_value: null,
            period_unit: UNITS.DAYS,
            payer: PAYER.BUYER,
          });
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        disabled: disabled,
        permission: 'SL_INSTALLMENTFORM_EDIT',
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
          <DataTable noSelect noPaging actions={actions} columns={columns} data={methods.watch(FIELD_NAME) || []} />
        </div>
      </div>
    </BWAccordion>
  );
};

export default InstallmentPeriod;
