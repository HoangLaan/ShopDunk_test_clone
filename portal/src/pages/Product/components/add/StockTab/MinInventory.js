import React, { useCallback, useEffect, useMemo } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { MinInventorySchema } from 'pages/Product/helpers/constructors';

import DataTable from 'components/shared/DataTable/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { mapDataOptions4Select, mapDataOptions4SelectCustom } from 'utils/helpers';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import styled from 'styled-components';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { getOptionsGlobal } from 'actions/global';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';

const Wrapper = styled.div`
  .bw_inp {
    max-width: 95px;
    min-width: 50px !important;
  }

  .ant-picker-input {
    max-width: 50px;
  }

  .ant-picker-header > button.ant-picker-header-super-prev-btn,
  button.ant-picker-header-super-next-btn,
  button.ant-picker-year-btn {
    display: none !important;
  }
`;

function MinInventory({ disabled, loading }) {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const { control, trigger, getValues, clearErrors, setValue, watch } = methods;
  const { fields, remove, append } = useFieldArray({
    control,
    name: 'min_inventory_list',
  });
  const { unitData, storeData } = useSelector((state) => state.global);

  const getDataOptions = useCallback(async () => {
    dispatch(getOptionsGlobal('unit'));
    dispatch(getOptionsGlobal('store'));
  }, [dispatch]);

  useEffect(() => {
    getDataOptions();
  }, [getDataOptions]);

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1,
      },
      {
        header: 'Thời gian',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (value, key) => (
          <FormRangePicker
            fieldStart={`min_inventory_list[${key}].date_from`}
            fieldEnd={`min_inventory_list[${key}].date_to`}
            placeholder={['DD/MM', 'DD/MM']}
            disabled={disabled}
            format={'DD/MM'}
            validation={{
              required: 'Thời gian là bắt buộc',
            }}
            style={{ width: 'inteherit !important' }}
          />
        ),
      },
      {
        header: 'Cửa hàng',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (value, key) => (
          <FormSelect
            field={`min_inventory_list[${key}].store_id`}
            list={mapDataOptions4Select(storeData)}
            validation={{
              required: 'Cửa hàng là bắt buộc',
            }}
            disabled={disabled}
            onChange={(value) => {
              clearErrors(`min_inventory_list[${key}].store_id`);
              setValue(`min_inventory_list[${key}].store_id`, value);

              dispatch(getOptionsGlobal('stockTypeByStore', { parent_id: value })).then((res) => {
                setValue(`min_inventory_list[${key}].stock_type_options`, res);
                setValue(`min_inventory_list[${key}].stock_type_id`, null);
              });
            }}
          />
        ),
      },
      {
        header: 'Loại kho',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        colSpan: () => 2,
        formatter: (value, key) => (
          <FormSelect
            field={`min_inventory_list[${key}].stock_type_id`}
            list={mapDataOptions4SelectCustom(watch(`min_inventory_list[${key}].stock_type_options`),'id','name')}
            validation={{
              required: 'Loại kho là bắt buộc',
            }}
            disabled={disabled}
          />
        ),
      },
      {
        header: 'Mức tồn (min - max)',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (value, key) => (
          <>
            <FormNumber
              field={`min_inventory_list[${key}].quantity_in_stock_min`}
              disabled={disabled}
              className='bw_inp bw_mw_2'
              bordered
              min={0}
              validation={{
                required: 'Mức tồn tối thiểu là bắt buộc',
                validate: (value) => {
                  const max = getValues(`min_inventory_list[${key}].quantity_in_stock_max`);
                  if (value > max) {
                    return 'Mức tồn tối thiểu không được lớn hơn mức tồn tối đa';
                  }
                },
              }}
            />
            {' - '}
            <FormNumber
              field={`min_inventory_list[${key}].quantity_in_stock_max`}
              disabled={disabled}
              className='bw_inp bw_mw_2'
              bordered
              min={0}
              validation={{
                required: 'Mức tồn tối đa là bắt buộc',
                validate: (value) => {
                  const min = getValues(`min_inventory_list[${key}].quantity_in_stock_min`);
                  if (value < min) {
                    return 'Mức tồn tối đa không được nhỏ hơn mức tồn tối thiểu';
                  }
                },
              }}
            />
          </>
        ),
      },
      {
        header: 'ĐVT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (value, key) => (
          <FormSelect
            field={`min_inventory_list[${key}].unit_id`}
            list={mapDataOptions4Select(unitData)}
            validation={{
              required: 'Đơn vị tính là bắt buộc',
            }}
            disabled={disabled}
          />
        ),
      },
      {
        header: 'Thời gian lưu kho tối đa (ngày)',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (value, key) => (
          <FormNumber
            field={`min_inventory_list[${key}].max_storage_time`}
            disabled={disabled}
            className='bw_inp bw_mw_2'
            bordered
            min={0}
            validation={{
              required: 'Thời gian lưu kho là bắt buộc',
            }}
          />
        ),
        styleHeader: {
          maxWidth: '121px',
          whiteSpace: 'normal',
        },
      },
      {
        header: 'Quá thời gian lưu kho - Bắt buộc xuất?',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (value, key) => (
          <FormInput type='checkbox' field={`min_inventory_list[${key}].is_force_out`} disabled={disabled} />
        ),
        styleHeader: {
          maxWidth: '121px',
          whiteSpace: 'normal',
        },
      },
    ],
    [disabled, unitData, storeData, getValues, clearErrors, setValue, watch, dispatch],
  );

  const actions = useMemo(() => {
    return [
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        hidden: disabled,
        onClick: (_, index) => {
          remove(index);
        },
      },
    ];
  }, [remove, disabled]);

  const addUnitConversionHandle = useCallback(
    async (e) => {
      e.preventDefault();

      const validateRS = await trigger('min_inventory_list');
      if (validateRS) {
        append(
          new MinInventorySchema(
            null,
            null,
            null,
            0,
            0,
            watch('unit_id')?.value,
            0,
            0,
            null,
            null,
          ),
        );
      }
    },
    [append, trigger,watch],
  );

  return (
    <Wrapper>
      <DataTable
        title='Tồn kho tối thiểu'
        noPaging
        noSelect
        data={fields}
        columns={columns}
        loading={loading}
        actions={actions}
      />

      <button
        type='button'
        disabled={disabled}
        className='bw_btn bw_btn_success bw_mt_2'
        onClick={addUnitConversionHandle}>
        <span className='fi fi-rr-plus'></span> Thêm dòng
      </button>
    </Wrapper>
  );
}

export default MinInventory;
