/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Alert } from 'antd';

import { usePCA } from 'pages/ProductCategory/helpers/context';

import BWAccordion from 'components/shared/BWAccordion/index';
import AttributesModal from './modals/AttributesModalList';

const ProductCategoryAttribute = ({ disabled, title }) => {
  const methods = useFormContext();
  const {
    watch,
    formState: { errors },
    control,
    clearErrors,
  } = methods;
  const { isOpenModalAttribute, setOpenModalAttribute } = usePCA();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'attributes',
    rules: {
      required: 'Thuộc tính sản phẩm là bắt buộc.',
      validate: (field) => {
        if (!field) return 'Thuộc tính sản phẩm là bắt buộc.';
        if (errors['attributes']) {
          clearErrors('attributes');
        }
        return;
      },
    },
  });

  const handleSelectAttributes = (attributesSelected) => {
    const selectedArray = Object.values(attributesSelected);
    for (let i = 0; i < selectedArray.length; i++) {
      let isExist = false;

      isExist = Boolean(fields.find((field) => field.attribute_id === selectedArray[i].attribute_id));

      if (!isExist) {
        append(selectedArray[i]);
      }
    }
    setOpenModalAttribute(false);
  };

  const attributeSelectedObject = () => {
    const attributes = methods.getValues('attributes');
    if (!attributes) return {};
    return Object.assign(
      {},
      ...attributes.map((attr) => {
        return { [attr.attribute_id]: attr };
      }),
    );
  };

  return (
    <BWAccordion title={title} id='bw_info' isRequired={true}>
      {errors['attributes'] && (
        <Alert closable className='bw_mb_2' type='error' message={errors['attributes']?.root?.message} />
      )}
      <div className='bw_flex bw_align_items_center bw_justify_content_between bw_mb_1'>
        <p></p>
        <button
          disabled={disabled}
          data-href='#bw_addattr'
          className='bw_btn bw_btn_success bw_open_modal'
          onClick={(e) => {
            e.preventDefault();
            setOpenModalAttribute(true);
          }}>
          Thêm thuộc tính
        </button>
      </div>
      <div className='bw_table_responsive'>
        <table className='bw_table'>
          <thead>
            <th className='bw_sticky bw_check_sticky bw_text_center'>STT</th>
            <th className='bw_text_center'>Tên thuộc tính</th>
            <th className='bw_text_center'>Đơn vị tính</th>
            {!disabled && <th className='bw_sticky bw_action_table bw_text_center'>Thao tác</th>}
          </thead>
          <tbody>
            {watch('attributes') ? (
              fields.map((attribute, i) => (
                <tr key={attribute.id}>
                  <td> {i + 1}</td>
                  <td> {attribute?.attribute_name} </td>
                  <td> {attribute?.unit_name} </td>
                  {!disabled && (
                    <td className='bw_sticky bw_action_table bw_text_center'>
                      <a onClick={() => remove(i)} className='bw_btn_table bw_delete bw_red'>
                        <i className='fi fi-rr-trash'></i>
                      </a>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colspan={!disabled ? 4 : 3} className='bw_text_center'>
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isOpenModalAttribute && (
        <AttributesModal attributes={attributeSelectedObject} onConfirm={handleSelectAttributes} />
      )}
    </BWAccordion>
  );
};

export default ProductCategoryAttribute;
