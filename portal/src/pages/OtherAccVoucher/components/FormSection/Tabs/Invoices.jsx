import React, { useEffect, useMemo, useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import { RulePositiveNumber } from 'pages/OtherAccVoucher/utils/validate';
import { PERMISSIONS } from 'pages/OtherAccVoucher/utils/permission';
import {
  OBJECT_TYPE,
  ObjectTypeOptions,
  TAX_TYPE,
  TaxTypeOptions,
  VatOptions,
} from 'pages/OtherAccVoucher/utils/constant';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import { getDeptAccountOpts } from 'services/receive-slip.service';
import { mapDataOptions4SelectCustom } from 'utils/helpers';
import { getObjectOptions } from 'services/other-acc-voucher.service';
import { formatPrice } from 'utils';
import { convertValueToString } from 'pages/OtherAccVoucher/utils/helper';
import { Spin } from 'antd';

const FIELD_NAME = 'invoice_list';

const InvoiceList = ({ disabled, customerOptions, loading }) => {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const { control, setValue, getValues, watch } = methods;

  const [staffOptions, setStaffOptions] = useState([]);
  const [supplierOptions, setSupplierOptions] = useState([]);
  const [partnerOptions, setPartnerOptions] = useState([]);

  const { remove, append } = useFieldArray({
    control,
    name: FIELD_NAME,
  });

  const [deptAccountingAccountOpts, setDeptAccountingAccountOpts] = useState([]);

  useEffect(() => {
    getDeptAccountOpts().then((data) => {
      setDeptAccountingAccountOpts(mapDataOptions4SelectCustom(data));
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
      default:
        return [];
    }
  };

  const columns = [
    {
      header: 'STT',
      formatter: (_, index) => index + 1,
      classNameBody: 'bw_text_center',
      classNameHeader: 'bw_text_center',
    },
    {
      header: 'Diễn giải thuế',
      disabled: disabled,
      style: { minWidth: '200px' },
      classNameHeader: 'bw_text_center',
      formatter: (item, index) => {
        return (
          <FormInput
            className='bw_inp'
            type='text'
            disabled={disabled}
            field={`${FIELD_NAME}.${index}.explain`}
            validation={{
              required: 'Diễn giải thuế là bắt buộc',
            }}
          />
        );
      },
    },
    {
      header: 'Có hóa đơn',
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      formatter: (item, index) => {
        return <FormInput type='checkbox' field={`${FIELD_NAME}.${index}.invoice_checking`} disabled={disabled} />;
      },
    },
    {
      header: 'Loại thuế',
      style: { minWidth: '180px' },
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      formatter: (item, index) => {
        const field = `${FIELD_NAME}.${index}.tax_type`;
        return (
          <FormSelect
            bordered
            disabled={disabled}
            field={field}
            list={TaxTypeOptions}
            onChange={(value) => {
              methods.clearErrors(field);
              methods.setValue(field, value);
              if (value === TAX_TYPE.INCREASE_INPUT) {
                const taxItem = deptAccountingAccountOpts?.find((_) => _.label === '1331');
                methods.setValue(`${FIELD_NAME}.${index}.tax_acc_id`, taxItem?.value);
              } else if (value === TAX_TYPE.INCREASE_OUTPUT) {
                const taxItem = deptAccountingAccountOpts?.find((_) => _.label === '3331');
                methods.setValue(`${FIELD_NAME}.${index}.tax_acc_id`, taxItem?.value);
              }
            }}
          />
        );
      },
    },
    {
      header: 'Giá trị HHDV chưa thuế',
      style: { minWidth: '140px' },
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      accessor: 'parent_name',
      formatter: (item, index) => {
        const field = `${FIELD_NAME}.${index}.origin_money`;
        return (
          <FormNumber
            bordered
            disabled={disabled}
            field={field}
            validation={RulePositiveNumber}
            onChange={(value) => {
              methods.clearErrors(field);
              methods.setValue(field, value);

              const vatPercent = VatOptions?.find((_) => _.value === watch(`${FIELD_NAME}.${index}.vat_value`));
              const vatMoney = ((vatPercent?.percent || 0) * (value || 0)) / 100;
              methods.setValue(`${FIELD_NAME}.${index}.vat_money`, vatMoney);
            }}
          />
        );
      },
    },
    {
      header: 'Thuế GTGT',
      style: { minWidth: '140px' },
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      formatter: (item, index) => {
        const field = `${FIELD_NAME}.${index}.vat_value`;
        return (
          <FormSelect
            bordered
            disabled={disabled}
            field={`${FIELD_NAME}.${index}.vat_value`}
            list={VatOptions}
            onChange={(value) => {
              methods.clearErrors(field);
              methods.setValue(field, value);

              const vatPercent = VatOptions?.find((_) => _.value === value);
              const vatMoney = ((vatPercent?.percent || 0) * (watch(`${FIELD_NAME}.${index}.origin_money`) || 0)) / 100;
              methods.setValue(`${FIELD_NAME}.${index}.vat_money`, vatMoney);
            }}
          />
        );
      },
    },
    {
      header: 'Tiền thuế GTGT',
      style: { minWidth: '140px' },
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      accessor: 'vat_money',
      formatter: (item, index) => formatPrice(Math.round(item?.vat_money || 0), false, ','),
    },
    {
      header: 'TK Thuế',
      style: { minWidth: '140px' },
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      formatter: (item, index) => {
        return (
          <FormSelect
            bordered
            disabled={disabled}
            field={`${FIELD_NAME}.${index}.tax_acc_id`}
            list={deptAccountingAccountOpts}
          />
        );
      },
    },
    {
      header: 'Số hóa đơn',
      style: { minWidth: '140px' },
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      formatter: (item, index) => {
        return (
          <div>
            {watch(`${FIELD_NAME}.${index}.invoice_checking`) ? (
              <FormNumber
                formatter={(_) => _}
                bordered
                disabled={disabled}
                field={`${FIELD_NAME}.${index}.invoice_no`}
                validation={RulePositiveNumber}
              />
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <span class='bw_label_outline bw_label_outline_warning text-center'>Trống</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      header: 'Ngày hóa đơn',
      style: { minWidth: '140px' },
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      accessor: 'parent_name',
      formatter: (item, index) => {
        return (
          <div>
            {watch(`${FIELD_NAME}.${index}.invoice_checking`) ? (
              <FormDatePicker
                field={`${FIELD_NAME}.${index}.invoice_date`}
                style={{ width: '100%', padding: '4px' }}
                placeholder={'Ngày hóa đơn'}
                format='DD/MM/YYYY'
                bordered
              />
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <span class='bw_label_outline bw_label_outline_warning text-center'>Trống</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      header: 'Mẫu số',
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      formatter: (item, index) => {
        return (
          <div>
            {watch(`${FIELD_NAME}.${index}.invoice_checking`) ? (
              <FormInput
                className='bw_inp'
                type='text'
                disabled={disabled}
                field={`${FIELD_NAME}.${index}.invoice_form_no`}
              />
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <span class='bw_label_outline bw_label_outline_warning text-center'>Trống</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      header: 'Ký hiệu',
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      formatter: (item, index) => {
        return (
          <div>
            {watch(`${FIELD_NAME}.${index}.invoice_checking`) ? (
              <FormInput
                className='bw_inp'
                type='text'
                disabled={disabled}
                field={`${FIELD_NAME}.${index}.invoice_serial`}
              />
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <span class='bw_label_outline bw_label_outline_warning text-center'>Trống</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      header: 'Loại đối tượng',
      style: { minWidth: '160px' },
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      formatter: (item, index) => {
        const field = `${FIELD_NAME}.${index}.object_type`;
        return (
          <FormSelect
            bordered
            disabled={disabled}
            field={field}
            list={ObjectTypeOptions}
            onChange={(value) => {
              methods.clearErrors(field);

              const accountingList = watch(FIELD_NAME);
              accountingList[index].object_type = value;
              accountingList[index].object_id = null;
              accountingList[index].object_name = null;
              methods.setValue(FIELD_NAME, [...accountingList]);
            }}
          />
        );
      },
    },
    {
      header: 'Đối tượng',
      style: { minWidth: '140px' },
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      formatter: (item, index) => {
        const field = `${FIELD_NAME}.${index}.object_id`;
        const options = getOptionsByType(watch(`${FIELD_NAME}.${index}.object_type`));
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
              methods.setValue(`${FIELD_NAME}.${index}.object_name`, selectedItem?.name);
            }}
            filterOption={(inputValue, options) => {
              return options?.search?.includes(inputValue) || options.label.includes(inputValue);
            }}
          />
        );
      },
    },
    {
      header: 'Tên đối tượng',
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      accessor: 'object_name',
    },
  ];

  const actions = useMemo(
    () => [
      {
        globalAction: true,
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Thêm dòng',
        permission: PERMISSIONS.AC_OTHERACCVOUCHER_EDIT,
        disabled: disabled,
        onClick: () => {
          if (!disabled) {
            append({
              explain: watch('description') ? `Thuế GTGT- ${watch('description')}` : '',
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

  return (
    <div className='bw_row'>
      <div class='bw_col_12'>
        <DataTable noSelect noPaging actions={actions} columns={columns} data={methods.watch(FIELD_NAME) || []} />
      </div>
    </div>
  );
};

export default InvoiceList;
