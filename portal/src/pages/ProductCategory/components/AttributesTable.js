import React, { useState } from 'react';
import { Alert } from 'antd';
import { useFormContext, useFieldArray } from 'react-hook-form';
import AttributesModal from './AttributesModalList';
import { usePCA } from '../helpers/context';

export default function AttributesTable(props) {
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
    append(Object.values(attributesSelected));
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
    <>
      {errors['attributes'] && (
        <Alert closable className='bw_mb_2' type='error' message={errors['attributes']?.root?.message} />
      )}
      <div className='bw_flex bw_align_items_center bw_justify_content_between bw_mb_1'>
        <p></p>
        <button
          disabled={!props.isEdit}
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
            <th>Tên thuộc tính</th>
            <th>Đơn vị tính</th>
            {props.isEdit && <th className='bw_sticky bw_action_table bw_text_center'>Thao tác</th>}
          </thead>
          <tbody>
            {watch('attributes') ? (
              fields.map((attribute, i) => (
                <tr key={attribute.id}>
                  <td> {i + 1}</td>
                  <td> {attribute?.attribute_name} </td>
                  <td> {attribute?.unit_name} </td>
                  {props.isEdit && (
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
                <td colspan={props.isEdit ? 4 : 3} className='bw_text_center'>
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
    </>
  );
}
