import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { showToast } from 'utils/helpers';

import { getOptionsGlobal } from 'actions/global';
import { MaterialSchema } from 'pages/ProductCategory/helpers/constructors';
import { mapDataOptions4Select } from 'utils/helpers';
import { getMaterialById } from 'services/product-category.service';

import DataTable from 'components/shared/DataTable/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormNumber from 'components/shared/BWFormControl/FormNumber';

const ProductCategoryMaterial = ({ disabled, loading }) => {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const { control, watch, clearErrors, setValue, trigger } = methods;
  const { fields, remove, append } = useFieldArray({
    control,
    name: 'material_list',
  });
  const { materialData } = useSelector((state) => state.global);
  const [materialOptions, setMaterialOptions] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState({});

  const getDataOptions = useCallback(async () => {
    dispatch(getOptionsGlobal('material'));
  }, [dispatch]);

  useEffect(() => {
    getDataOptions();
  }, [getDataOptions]);

  useEffect(() => {
    if (Array.isArray(materialData)) {
      setMaterialOptions(
        mapDataOptions4Select(materialData).map((item) => ({
          ...item,
          disabled: Boolean(Object.values(selectedMaterial).find((value) => value === item.value)),
        })),
      );
    }
  }, [selectedMaterial, materialData]);

  useEffect(() => {
    setSelectedMaterial(fields.reduce((acc, cur) => ({ ...acc, [cur.id]: cur.material_id }), {}));
  }, [loading, fields]);

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1,
      },
      {
        header: 'Tên túi bao bì sử dụng',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (value, key) => (
          <FormSelect
            field={`material_list[${key}].material_id`}
            list={materialOptions}
            validation={{
              required: 'Tên túi bao bì là bắt buộc',
            }}
            disabled={disabled}
            onChange={async (value) => {
              clearErrors(`material_list[${key}].material_id`);
              setValue(`material_list[${key}].material_id`, value);
              setSelectedMaterial((prev) => ({ ...prev, [key]: value }));

              if (value) {
                try {
                  const material = await getMaterialById(value);

                  setValue(`material_list[${key}].material_group_name`, material.material_group_name);
                  setValue(`material_list[${key}].unit_name`, material.unit_name);
                } catch (error) {
                  showToast.error(error.message ?? 'Có lỗi xảy ra!', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'colored',
                  });
                }
              }
            }}
          />
        ),
      },
      {
        header: 'Nhóm túi bao bì',
        classNameHeader: 'bw_text_center',
        formatter: (value, key) => watch(`material_list[${key}].material_group_name`),
      },
      {
        header: 'ĐVT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (value, key) => watch(`material_list[${key}].unit_name`),
      },
      {
        header: 'Số lượng',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (value, key) => (
          <FormNumber
            field={`material_list[${key}].number`}
            disabled={disabled}
            className='bw_inp bw_mw_2'
            bordered
            min={1}
            validation={{
              required: 'Số lượng là bắt buộc',
            }}
          />
        ),
      },
      {
        header: 'Ghi chú',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (value, key) => (
          <FormInput field={`material_list[${key}].note`} disabled={disabled} className='bw_inp bw_mw_4' />
        ),
      },
    ],
    [disabled, watch, clearErrors, setValue, materialOptions],
  );

  const actions = useMemo(() => {
    return [
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        hidden: disabled,
        onClick: (_, index) => {
          remove(index);
          setSelectedMaterial((prev) => ({ ...prev, [index]: undefined }));
        },
      },
    ];
  }, [remove, disabled]);

  const addMaterialHandle = useCallback(
    async (e) => {
      e.preventDefault();

      const validateRS = await trigger('material_list');
      if (validateRS) {
        append(new MaterialSchema());
      }
    },
    [append, trigger],
  );

  return (
    <>
      <React.Fragment>
        {/* <BWAccordion title={title}> */}
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

        <button type='button' className='bw_btn bw_btn_success bw_mt_2' onClick={addMaterialHandle}>
          <span className='fi fi-rr-plus'></span> Thêm túi bao bì
        </button>
        {/* </BWAccordion> */}
      </React.Fragment>
    </>
  );
};

ProductCategoryMaterial.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  title: PropTypes.string,
};

export default ProductCategoryMaterial;
