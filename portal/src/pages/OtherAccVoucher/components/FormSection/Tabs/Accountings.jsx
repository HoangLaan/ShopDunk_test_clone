import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import { RulePositiveNumber } from 'pages/OtherAccVoucher/utils/validate';
import { PERMISSIONS } from 'pages/OtherAccVoucher/utils/permission';
import { getCreditAccountOpts, getDeptAccountOpts } from 'services/receive-slip.service';
import { getReceiveTypeOpts, getPaymentTypeOpts } from 'services/receive-slip.service';
import { mapDataOptions4SelectCustom } from 'utils/helpers';
import { OBJECT_TYPE, ObjectTypeOptions, VOUCHER_TYPE } from 'pages/OtherAccVoucher/utils/constant';
import { getObjectOptions } from 'services/other-acc-voucher.service';
import { mapDataOptions4Select } from 'pages/SaleChannelFacebook/utils/html';
import { formatPrice } from 'utils';
import { convertValueToString } from 'pages/OtherAccVoucher/utils/helper';
import { Spin } from 'antd';

const FIELD_NAME = 'accounting_list';

const Accounting = ({ disabled, customerOptions, loading }) => {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const { control, setValue, getValues, watch } = methods;
  const [deptAccountingAccountOpts, setDeptAccountingAccountOpts] = useState([]);
  const [creditAccountingAccountOpts, setCreditAccountingAccountOpts] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [staffOptions, setStaffOptions] = useState([]);
  const [supplierOptions, setSupplierOptions] = useState([]);
  const [partnerOptions, setPartnerOptions] = useState([]);
  const [installmentPartnerOptions, setInstallmentPartnerOptions] = useState([]);

  const { remove, append } = useFieldArray({
    control,
    name: FIELD_NAME,
  });

  useEffect(() => {
    getDeptAccountOpts().then((data) => {
      setDeptAccountingAccountOpts(mapDataOptions4SelectCustom(data));
    });
    getCreditAccountOpts().then((data) => {
      setCreditAccountingAccountOpts(mapDataOptions4SelectCustom(data));
    });

    getObjectOptions({ query_type: OBJECT_TYPE.STAFF }).then((data) => {
      setStaffOptions(convertValueToString(data));
    });
    getObjectOptions({ query_type: OBJECT_TYPE.SUPPLIER }).then((data) => {
      setSupplierOptions(convertValueToString(data));
    });

    getObjectOptions({ query_type: OBJECT_TYPE.BUSINESS_CUSTOMER }).then((data) => {
      setPartnerOptions(convertValueToString(data));
    });

    getObjectOptions({ query_type: OBJECT_TYPE.PARTNER }).then((data) => {
      setInstallmentPartnerOptions(convertValueToString(data));
    });
  }, []);

  useEffect(() => {
    (async () => {
      const data = await Promise.all([getReceiveTypeOpts(), getPaymentTypeOpts()]);
      const options = data[0]
        ?.map((_) => ({ ..._, id: `${_.id}_${VOUCHER_TYPE.RECEIVE}` }))
        .concat(data[1]?.map((_) => ({ ..._, id: `${_.id}_${VOUCHER_TYPE.EXPEND}` })));
      setTypeOptions(mapDataOptions4Select(options));
    })();
  }, []);

  const getOptionsByType = (objectType) => {
    switch (objectType) {
      case OBJECT_TYPE.STAFF:
        return staffOptions;
      case OBJECT_TYPE.BUSINESS_CUSTOMER:
        return partnerOptions;
      case OBJECT_TYPE.SUPPLIER:
        return supplierOptions;
      case OBJECT_TYPE.INDIVIDUAL_CUSTOMER:
        return customerOptions;
      case OBJECT_TYPE.PARTNER:
        return installmentPartnerOptions;
      default:
        return [];
    }
  };

  const updateMoney = useCallback(() => {
    const totalMoney = watch(FIELD_NAME)?.reduce((total, item) => total + (item?.money || 0), 0) || 0;
    setValue('total_money', totalMoney);
  }, [watch(FIELD_NAME)]);

  const columns = [
    {
      header: 'STT',
      formatter: (_, index) => index + 1,
      classNameBody: 'bw_text_center',
      classNameHeader: 'bw_text_center',
    },
    {
      header: 'Diễn giải',
      disabled: disabled,
      style: { minWidth: '200px' },
      classNameHeader: 'bw_text_center',
      formatter: (item, index) => {
        return (
          <FormInput
            bordered
            className='bw_inp'
            type='text'
            disabled={disabled}
            field={`${FIELD_NAME}.${index}.note`}
            validation={{
              required: 'Diễn giải là bắt buộc',
            }}
          />
        );
      },
    },
    {
      header: 'TK Nợ',
      style: { minWidth: '140px' },
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      accessor: 'parent_name',
      formatter: (item, index) => {
        return (
          <FormSelect
            bordered
            disabled={disabled}
            field={`${FIELD_NAME}.${index}.debt_acc_id`}
            list={deptAccountingAccountOpts}
            validation={{
              required: 'Tài khoản nợ là bắt buộc',
            }}
          />
        );
      },
    },
    {
      header: 'TK Có',
      style: { minWidth: '140px' },
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      accessor: 'parent_name',
      formatter: (item, index) => {
        return (
          <FormSelect
            bordered
            disabled={disabled}
            field={`${FIELD_NAME}.${index}.credit_acc_id`}
            list={creditAccountingAccountOpts}
            validation={{
              required: 'Tài khoản có là bắt buộc',
            }}
          />
        );
      },
    },
    {
      header: 'Số tiền',
      style: { minWidth: '140px' },
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      formatter: (item, index) => {
        return (
          <FormNumber
            onChange={(value) => {
              const field = `${FIELD_NAME}.${index}.money`;
              methods.clearErrors(field);
              methods.setValue(field, value);
              updateMoney();
            }}
            bordered
            disabled={disabled}
            field={`${FIELD_NAME}.${index}.money`}
            validation={{
              ...RulePositiveNumber,
              required: 'Số tiền là bắt buộc',
            }}
          />
        );
      },
    },
    {
      header: 'Loại chứng từ',
      style: { minWidth: '140px' },
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      accessor: 'parent_name',
      formatter: (item, index) => {
        return (
          <FormSelect bordered disabled={disabled} field={`${FIELD_NAME}.${index}.voucher_type`} list={typeOptions} />
        );
      },
    },
    {
      header: 'Loại đối tượng Nợ',
      style: { minWidth: '160px' },
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      formatter: (item, index) => {
        const field = `${FIELD_NAME}.${index}.debt_object_type`;
        return (
          <FormSelect
            bordered
            disabled={disabled}
            field={field}
            list={ObjectTypeOptions}
            onChange={(value) => {
              methods.clearErrors(field);

              const accountingList = watch(FIELD_NAME);
              accountingList[index].debt_object_type = value;
              accountingList[index].debt_object_id = null;
              accountingList[index].debt_object_name = null;
              methods.setValue(FIELD_NAME, [...accountingList]);
            }}
          />
        );
      },
    },
    {
      header: 'Đối tượng Nợ',
      style: { minWidth: '140px' },
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      formatter: (item, index) => {
        const field = `${FIELD_NAME}.${index}.debt_object_id`;
        const options = getOptionsByType(watch(`${FIELD_NAME}.${index}.debt_object_type`));
        return loading ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Spin />
          </div>
        ) : (
          <FormSelect
            style={{ width: '100%' }}
            bordered
            disabled={disabled}
            field={field}
            list={options}
            onChange={(value) => {
              methods.clearErrors(field);
              methods.setValue(field, value);
              const selectedItem = options?.find((_) => _.value === value);
              methods.setValue(`${FIELD_NAME}.${index}.debt_object_name`, selectedItem?.name);
            }}
            filterOption={(inputValue, options) => {
              return options?.search?.includes(inputValue) || options.label.includes(inputValue);
            }}
          />
        );
      },
    },
    {
      header: 'Tên đối tượng Nợ',
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      accessor: 'debt_object_name',
    },
    {
      header: 'Loại đối tượng Có',
      style: { minWidth: '160px' },
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      formatter: (item, index) => {
        const field = `${FIELD_NAME}.${index}.credit_object_type`;
        return (
          <FormSelect
            bordered
            disabled={disabled}
            field={field}
            list={ObjectTypeOptions}
            onChange={(value) => {
              methods.clearErrors(field);

              const accountingList = watch(FIELD_NAME);
              accountingList[index].credit_object_type = value;
              accountingList[index].credit_object_id = null;
              accountingList[index].credit_object_name = null;
              methods.setValue(FIELD_NAME, [...accountingList]);
            }}
          />
        );
      },
    },
    {
      header: 'Đối tượng Có',
      style: { minWidth: '140px' },
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      formatter: (item, index) => {
        const field = `${FIELD_NAME}.${index}.credit_object_id`;
        const options = getOptionsByType(watch(`${FIELD_NAME}.${index}.credit_object_type`));
        return loading ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Spin />
          </div>
        ) : (
          <FormSelect
            style={{ width: '100%' }}
            bordered
            disabled={disabled}
            field={field}
            list={options}
            onChange={(value) => {
              methods.clearErrors(field);
              methods.setValue(field, value);

              const selectedItem = options?.find((_) => _.value === value);
              methods.setValue(`${FIELD_NAME}.${index}.credit_object_name`, selectedItem?.name);
            }}
            filterOption={(inputValue, options) => {
              return options?.search?.includes(inputValue) || options.label.includes(inputValue);
            }}
          />
        );
      },
    },
    {
      header: 'Tên đối tượng Có',
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      accessor: 'credit_object_name',
    },
  ];

  const actions = useMemo(
    () => [
      {
        globalAction: true,
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Thêm dòng',
        disabled: disabled,
        permission: PERMISSIONS.AC_OTHERACCVOUCHER_EDIT,
        onClick: () => {
          if (!disabled) {
            append({
              note: watch('description') ? `${watch('description')}` : '',
            });
          }
        },
      },
      {
        globalAction: true,
        icon: 'fi fi-rr-trash',
        type: 'danger',
        style: { marginLeft: '6px' },
        content: 'Xóa hết dòng',
        disabled: disabled,
        permission: PERMISSIONS.AC_OTHERACCVOUCHER_EDIT,
        onClick: () => {
          if (!disabled) {
            dispatch(
              showConfirmModal(
                ['Bạn có thực sự muốn xóa tất cả bản ghi ?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
                async () => {
                  remove();
                },
              ),
            );
          }
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        disabled: disabled,
        permission: PERMISSIONS.AC_OTHERACCVOUCHER_EDIT,
        onClick: (_, index) => {
          if (!disabled) {
            dispatch(
              showConfirmModal(
                ['Bạn có thực sự muốn xóa dữ liệu này ?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
                async () => {
                  remove(index);
                },
              ),
            );
          }
        },
      },
    ],
    [disabled],
  );

  const customSumRow = [
    {
      index: 1,
      value: 'Tổng cộng',
      colSpan: 4,
      style: { textAlign: 'center' },
    },
    {
      index: 5,
      style: { textAlign: 'right' },
      formatter: (items) =>
        formatPrice(
          items?.reduce((acc, item) => acc + (item.money || 0), 0),
          false,
          ',',
        ),
    },
  ];

  return (
    <div className='bw_row'>
      <div class='bw_col_12'>
        <DataTable
          noSelect
          noPaging
          actions={actions}
          columns={columns}
          data={methods.watch(FIELD_NAME) || []}
          customSumRow={customSumRow}
        />
      </div>
    </div>
  );
};

export default Accounting;
