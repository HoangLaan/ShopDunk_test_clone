import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

//until
import { mapDataOptions4SelectCustom } from 'utils/helpers';
import { optionsAttribute } from 'pages/ProductAttribute/helper/index';
//service
import { getOptionsUnit } from 'services/unit.service';
//components
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';
import FormRadioGroup from 'components/shared/BWFormControl/FormRadioGroup';
import { ColorPicker } from 'antd';

export const ProductAttributeInfo = ({ disabled }) => {
  const { watch, getValues, reset } = useFormContext();
  const [optionsUnit, setOptionsUnit] = useState();
  const getUnit = useCallback(() => {
    getOptionsUnit().then((data) => {
      setOptionsUnit(mapDataOptions4SelectCustom(data));
    });
  }, []);
  useEffect(getUnit, [getUnit]);

  const isCheckTypeAttribute = useCallback((value) => {
    return optionsAttribute.find((item) => item.value === value)?.value === watch('attribute_type');
  }, []);

  const isCheckColor = useMemo(() => isCheckTypeAttribute(1), [watch('attribute_type')]);

  const isCheckMaterial = useMemo(() => isCheckTypeAttribute(3), [watch('attribute_type')]);

  useEffect(() => {
    if (isCheckMaterial) {
      reset({ ...getValues() });
    }
  }, [isCheckMaterial]);

  return (
    <BWAccordion title='Thông tin thuộc tính' id='bw_info_cus' isRequired>
      <div className='bw_row'>
        <FormItem label='Tên thuộc tính' className='bw_col_8' isRequired>
          <FormInput
            type='text'
            field='attribute_name'
            placeholder='Nhập tên thuộc tính'
            disabled={disabled}
            validation={{
              validate: (value) => {
                if (!value || value === '') return 'Tên thuộc tính là bắt buộc';
                const regexSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                if (regexSpecial.test(value)) return 'Tên thuộc tính không được chứa ký tự đặc biệt';

                return true;
              },
            }}
          />
        </FormItem>
        {!isCheckColor && (
          <FormItem
            label='Đơn vị tính'
            className='bw_col_4'
            // isRequired={!isCheckMaterial ? true : false}
          >
            <FormSelect
              field='unit_id'
              list={optionsUnit}
              disabled={disabled}
              // validation={
              //   !isCheckMaterial
              //     ? {
              //       required: 'Đơn vị tính là bắt buộc',
              //     }
              //     : {}
              // }
            />
          </FormItem>
        )}

        <FormItem label='Mô tả' className='bw_col_12'>
          <FormTextArea field='attribute_description' rows={3} disabled={disabled} placeholder='Mô tả' />
        </FormItem>

        <FormItem className='bw_col_12' label='Loại thuôc tính' disabled={disabled}>
          <FormRadioGroup
            field='attribute_type'
            list={optionsAttribute}
            disabled={disabled}
            style={{ marginBottom: '20px' }}
          />
        </FormItem>
      </div>
    </BWAccordion>
  );
};

export const ProductAttributeValue = ({ disabled }) => {
  const methods = useFormContext();
  const {
    formState: { errors },
    watch,
    setValue,
  } = methods;

  const isCheckTypeAttribute = useCallback((value) => {
    return optionsAttribute.find((item) => item.value === value)?.value === watch('attribute_type');
  }, []);

  const { fields, append, remove } = useFieldArray({
    name: 'attribute_value_list',
    rules: {
      required: { value: true, message: 'Giá trị thuộc tính là bắt buộc' },
      validate: (field) => {
        if (field?.length > 0 && field.findIndex((_) => !_.attribute_values) !== -1) {
          return `Nhập giá trị dòng số ${field.findIndex((_) => !_.attribute_values) + 1}`;
        }
      },
    },
  });

  const onChangeColor = (key, hex) => {
    methods.setValue(`${key}`, `${hex}`);
  };

  const checkSpecialChar = (e) => {
    let regex_symbols = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/;
    if (regex_symbols.test(e.key)) {
      e.preventDefault();
    }
  };

  const renderInputAttributeType = (props = {}) => {
    let attribute_type = methods.watch('attribute_type');
    let list = (optionsAttribute || []).reduce((a, v) => ({ ...a, [v?.value]: v }), {});
    let { field } = props || {};

    switch (list[attribute_type]?.key) {
      case 'is_color':
        return (
          <td>
            {' '}
            <ColorPicker
              allowClear={true}
              disabled={disabled}
              value={methods.watch(`${field}`)}
              style={{ width: '100%' }}
              onChange={(value, hex) => {
                onChangeColor(field, hex);
              }}
              showText
              {...props}
            />
          </td>
        );
      default:
        return <></>;
    }
  };

  const renderThcolor = () => {
    let attribute_type = methods.watch('attribute_type');
    let list = (optionsAttribute || []).reduce((a, v) => ({ ...a, [v?.value]: v }), {});
    // <th>Giá trị màu</th>
    switch (list[attribute_type]?.key) {
      case 'is_color':
        return <th className='bw_text_center'>Giá trị màu</th>;
      default:
        return <></>;
    }
  };

  return (
    <BWAccordion title='Giá trị' id='bw_bank_com' isRequired={false}>
      <>
        <div className='bw_table_responsive'>
          <table className='bw_table'>
            <thead>
              <th className='bw_text_center'>STT</th>
              <th className='bw_text_center'>Giá trị</th>
              {renderThcolor()}
              <th className='bw_sticky bw_action_table bw_text_center'>Thao tác</th>
            </thead>
            <tbody>
              {fields && fields.length > 0 ? (
                (fields || []).map((item, index) => {
                  return (
                    item && (
                      <tr key={index}>
                        <td className='bw_sticky bw_check_sticky'>{index + 1}</td>
                        <td>
                          <FormInput
                            type='text'
                            field={`attribute_value_list.${index}.attribute_values`}
                            placeholder='Giá trị'
                            className='bw_inp'
                            disabled={disabled}
                            // onKeyDown={(e) => checkSpecialChar(e)}
                          />
                        </td>
                        {renderInputAttributeType({
                          field: `attribute_value_list.${index}.color_hex`,
                          placeholder: 'Giá trị màu',
                        })}
                        <td className='bw_sticky bw_action_table bw_text_center'>
                          {!disabled && (
                            <a
                              className='bw_btn_table bw_delete bw_red'
                              onClick={() => {
                                remove(index);
                              }}>
                              <i className='fi fi-rr-trash' />
                            </a>
                          )}
                        </td>
                      </tr>
                    )
                  );
                })
              ) : (
                <></>
              )}
            </tbody>
          </table>
        </div>

        {errors['attribute_value_list'] && <ErrorMessage message={errors?.attribute_value_list?.root?.message} />}

        {!disabled && (
          <a data-href className='bw_btn_outline bw_btn_outline_success bw_add_us' onClick={() => append({})}>
            <span className='fi fi-rr-plus' /> Thêm giá trị
          </a>
        )}
      </>
    </BWAccordion>
  );
};
export const ProductAttributeStatus = ({ disabled }) => {
  return (
    <BWAccordion title='Trạng thái' id='bw_mores' isRequired={false}>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <div className='bw_frm_box'>
            <div className='bw_flex bw_align_items_center bw_lb_sex'>
              <label className='bw_checkbox'>
                <FormInput type='checkbox' field='is_active' disabled={disabled} />
                <span />
                Kích hoạt
              </label>
              <label className='bw_checkbox'>
                <FormInput type='checkbox' field='is_system' disabled={disabled} />
                <span />
                Hệ thống
              </label>
            </div>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
};
