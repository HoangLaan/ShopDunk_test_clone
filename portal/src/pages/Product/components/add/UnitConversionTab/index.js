import React, { useCallback, useEffect, useMemo } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { UnitConversionSchema } from 'pages/Product/helpers/constructors';
import { getOptionsGlobal } from 'actions/global';
import { mapDataOptions4Select } from 'utils/helpers';

import DataTable from 'components/shared/DataTable/index';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';

const FormDansityValue = styled.div`
  .bw_inp {
    max-width: 100px;
  }
`;

const UnitConversionTab = ({ disabled, loading }) => {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const { control, trigger } = methods;
  const { fields, remove, append } = useFieldArray({
    control,
    name: 'sub_unit_list',
  });
  const { unitData } = useSelector((state) => state.global);

  const getDataOptions = useCallback(async () => {
    dispatch(getOptionsGlobal('unit'));
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
        header: 'Đơn vị quy đổi',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (value, key) => (
          <FormSelect
            field={`sub_unit_list[${key}].sub_unit_id`}
            list={mapDataOptions4Select(unitData)}
            validation={{
              required: 'Nguyên liệu là bắt buộc',
            }}
            disabled={disabled}
          />
        ),
      },
      {
        header: 'Tỷ lệ quy đổi',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (value, key) => (
          <FormDansityValue>
            <FormNumber
              field={`sub_unit_list[${key}].density_value_1`}
              disabled={disabled}
              className='bw_inp bw_mw_2'
              bordered
              min={1}
              validation={{
                required: 'Số lượng là bắt buộc',
              }}
            />
            {' / '}
            <FormNumber
              field={`sub_unit_list[${key}].density_value_2`}
              disabled={disabled}
              className='bw_inp bw_mw_2'
              bordered
              min={1}
              validation={{
                required: 'Số lượng là bắt buộc',
              }}
            />
          </FormDansityValue>
        ),
      },
      {
        header: 'ĐVT mặc định',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (value, key) => (
          <FormSelect
            field={`sub_unit_list[${key}].main_unit_id`}
            list={mapDataOptions4Select(unitData)}
            validation={{
              required: 'Nguyên liệu là bắt buộc',
            }}
            disabled={disabled}
          />
        ),
      },
      {
        header: 'Mô tả',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (value, key) => (
          <FormInput field={`sub_unit_list[${key}].note`} disabled={disabled} className='bw_inp bw_mw_4' />
        ),
      },
    ],
    [disabled, unitData],
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

      const validateRS = await trigger('sub_unit_list');
      if (validateRS) {
        append(new UnitConversionSchema());
      }
    },
    [append, trigger],
  );

  return (
    <React.Fragment>
      <DataTable
        style={{
          marginTop: '0px',
        }}
        hiddenActionRow
        noPaging
        noSelect
        data={fields}
        columns={columns}
        loading={loading}
        actions={actions}
      />

      <button type='button' className='bw_btn bw_btn_success bw_mt_2' onClick={addUnitConversionHandle}>
        <span className='fi fi-rr-plus'></span> Đơn vị quy đổi
      </button>
    </React.Fragment>
  );
};

UnitConversionTab.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  title: PropTypes.string,
};

export default UnitConversionTab;
