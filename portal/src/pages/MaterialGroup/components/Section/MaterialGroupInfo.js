import React, {useEffect, useState} from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormSelect from "components/shared/BWFormControl/FormSelect";
import BWButton from "components/shared/BWButton";
import {getOptionsGlobal} from "actions/global";
import MaterialAttributeModal from "./MaterialAttributeModal";
import {useDispatch, useSelector} from "react-redux";
import {mapDataOptions4SelectCustom} from "utils/helpers";
import FormDebouneTreeSelect from 'components/shared/BWFormControl/FormTreeSelect';
import {generateCode, getOptionsTreeView} from "services/material-group.service";
import {useFormContext} from "react-hook-form";


function MaterialGroupInfo({disabled, title,id}) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const dispatch = useDispatch();
  const methods = useFormContext()
  const {setValue} = methods

  useEffect(() => {
    dispatch(getOptionsGlobal("attributeMaterial", {keyword: 'TYPEMATERIAL'}))
    dispatch(getOptionsGlobal("materialGroup"))
  }, [])
  const {attributeMaterialData, materialGroupData} = useSelector((state) => state.global)

  const handleGenerateCode = async (value) => {
    const prefix = value.currentTarget.value
    setValue("material_group_name", prefix)
      if (!id && prefix.trim().length === 1) {
        const codeGenerated = await generateCode({prefix})
        if (codeGenerated.code) {
          setValue('material_group_code', codeGenerated.code)
        }
    }
  }
  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <div className='bw_col_6'>
          <FormItem label='Tên nhóm nhiên liệu' isRequired disabled={disabled}>
            <FormInput
              field='material_group_name'
              onChange={handleGenerateCode}
              placeholder="Nhập tên nhóm nguyên liệu"
              validation={{
                required: 'Tên nhóm nguyên liệu là bắt buộc',
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Mã nhóm nhiên liệu' isRequired disabled={true}>
            <FormInput
              field='material_group_code'
              disabled={true}
              placeholder="Mã nhóm nguyên liệu"
              validation={{
                required: 'Mã nhóm nhiên liệu là bắt buộc',
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Thuộc nhóm nguyên liệu' isRequired disabled={disabled}>
            <FormDebouneTreeSelect
              field='material_group_parent'
              treeDataSimpleMode
              fetchOptions={getOptionsTreeView}
              disabled={disabled}
            />
          </FormItem>
        </div>

        <div className='bw_col_6 bw_flex bw_justify_content_right bw_align_items_right'>
          {!disabled &&
          <BWButton type="primary" className='bw_mb_1' onClick={() => setIsOpenModal(true)} content="+ Thêm Thuộc tính">Thêm
            thuộc tính</BWButton>}
        </div>
        <div className='bw_col_12'>
          <FormItem label='Thuộc tính nhóm nguyên liệu' isRequired disabled={disabled}>
            <FormSelect
              field='material_group_attribute'
              mode='tags'
              list={mapDataOptions4SelectCustom(attributeMaterialData)}
            />
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <FormItem label='Mô tả' disabled={disabled}>
            <FormTextArea
              rows={1}
              field='description'
              placeholder='Nhập mô tả nhóm nguyên liệu'
              disabled={disabled}
            />
          </FormItem>
        </div>
      </div>
      {isOpenModal && <MaterialAttributeModal setIsOpenModal={setIsOpenModal}></MaterialAttributeModal>}
    </BWAccordion>
  );
}

export default MaterialGroupInfo;
