/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Alert } from 'antd';
import { useFormContext } from 'react-hook-form';

import { useProductAdd } from 'pages/Product/helpers/context';
import BWModal from 'components/shared/BWModal/index';
import AttributesModal from './modals/AttributesModalList';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import BWAccordion from 'components/shared/BWAccordion/index';

const ModalContent = styled.p`
  margin-bottom: 0;
`;

export default function AttributesTable({ disabled, title, autoGenName }) {
  const methods = useFormContext();
  const {
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = methods;
  const { isOpenModalAttribute, setOpenModalAttribute } = useProductAdd();
  const [isOpenModalRequireModel, setOpenModalRequiredModel] = useState(false);

  useEffect(() => {
    methods.register('attributes', {
      validate: (v) => {
        if (!Array.isArray(v) || v.length <= 0) {
          return 'Thuộc tính là bắt buộc';
        }

        return true;
      },
    });
  }, [methods]);

  const handleDeleteRow = (idx) => {
    let attributes = getValues('attributes') ?? [];
    if (!attributes || !attributes.length) return;
    attributes.splice(idx, 1);
    setValue('attributes', attributes);
  };

  const handleSelectAttributes = (attributesSelected) => {
    methods.setValue('attributes', Object.values(attributesSelected));
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
    <BWAccordion title={title} isRequired>
      {errors['attributes'] && (
        <Alert closable className='bw_mb_2' type='error' message={errors['attributes']?.message} />
      )}
      <div className='bw_flex bw_align_items_center bw_justify_content_between bw_mb_1'>
        <p></p>
        {!disabled ? (
          <button
            className='bw_btn bw_btn_success bw_open_modal'
            onClick={(e) => {
              e.preventDefault();
              if (watch('model_id')) {
                setOpenModalAttribute(true);
              } else {
                setOpenModalRequiredModel(true);
              }
            }}>
            Thêm thuộc tính
          </button>
        ) : null}
      </div>
      <div className='bw_table_responsive'>
        <table className='bw_table'>
          <thead>
            <th className='bw_sticky bw_check_sticky bw_text_center'>STT</th>
            <th className='bw_text_center'>Tên thuộc tính</th>
            <th className='bw_text_center'>Giá trị</th>
            <th className='bw_text_center'>Đơn vị tính</th>
            {!disabled && <th className='bw_sticky bw_action_table bw_text_center'>Thao tác</th>}
          </thead>
          <tbody>
            {watch('attributes') && watch('attributes').length ? (
              watch('attributes').map((attribute, i) => (
                <tr key={i}>
                  <td> {i + 1}</td>
                  <td> {attribute?.attribute_name} </td>
                  <td>
                    <FormSelect
                      field={`attributes.${i}.values`}
                      list={attribute?.attribute_values ?? []}
                      allowClear={true}
                      disabled={disabled}
                      onChange={(value) => {
                        methods.clearErrors(`attributes.${i}.values`);
                        methods.setValue(`attributes.${i}.values`, value);
                        autoGenName();
                      }}
                    />
                  </td>
                  <td> {attribute?.unit_name} </td>
                  {!disabled && (
                    <td className='bw_sticky bw_action_table bw_text_center'>
                      <a onClick={() => handleDeleteRow(i)} className='bw_btn_table bw_delete bw_red'>
                        <i className='fi fi-rr-trash'></i>
                      </a>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colspan={!disabled ? 5 : 4} className='bw_text_center'>
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
      {isOpenModalRequireModel && (
        <BWModal
          onClose={() => setOpenModalRequiredModel(false)}
          open={isOpenModalRequireModel}
          header={
            <>
              <span className='bw_icon_notice'>
                <i className='fi fi-rr-bell'></i>
              </span>{' '}
              Thông báo
            </>
          }>
          <ModalContent>Vui lòng chọn model sản phẩm! </ModalContent>
        </BWModal>
      )}
    </BWAccordion>
  );
}
