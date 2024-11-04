import React, {Fragment, useMemo, useState} from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import {useFieldArray, useFormContext} from "react-hook-form";
import ICON_COMMON from "utils/icons.common";
import DataTable from "components/shared/DataTable";
import ModalAddProduct from "../Modal/ModalAddProduct";
import ErrorMessage from "components/shared/BWFormControl/ErrorMessage";

const COLUMN_ID = 'productIMBDCode';

const parseInNumber = (value, valueDefault = 0) => {
  let result = parseInt(value) ?? valueDefault;
  return  result;
}
const checkNumber = (value, valueDefault = 0) => {
  let result = valueDefault;
  let checkValue = parseInNumber(value);
  if(checkValue > 0) {
    result = checkValue
  }
  return result;
}

function BorrowRequestProduct({disabled, title}) {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const methods = useFormContext()
  const {formState: {errors}, clearErrors} = methods
  const {remove} = useFieldArray({
    name: 'list_product_borrow',
    rules: {
      required: false,
      validate: (field) => {
        let msg = field?.length ? '' : 'Vui lòng chọn sản phẩm mượn';
        if (msg) return msg;
        else {
          if (errors['list_product_borrow'])
            clearErrors('list_product_borrow');
        }
      }
    }
  })
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (_, i) => {
          return i + 1;
        }
      },
      {
        header: 'Mã sản phẩm',
        accessor: 'product_code'
      },
      {
        header: 'Tên sản phẩm',
        accessor: 'product_name'
      },
      ,
      {
        header: 'Tên nhà sản xuất',
        accessor: 'manufacture_name'
      },
      {
        header: 'Số lượng',
        formatter: (_,index) => {
          return (
            <div className=" bw_col_12">
              <FormInput
                className="bw_frm_box"
                min={0}
                style={{width: '100%', borderColor: "#ded3d3"}}
                field={`list_product_borrow.${index}.quantity`}
                onChange={(evt) => {
                  let value = checkNumber(evt.target.value);
                  methods.setValue(`list_product_borrow.${index}.quantity`, value);
                }}
                validation={{required:"Số lượng là bắt buộc"}}
                type={"number"}
                placeholder="Nhập số lượng mượn"/>
            </div>
          )
        }
      },
      {
        header: 'Là sản phẩm mới',
        classNameBody: 'bw_text_center',
        formatter: (_, i) => {
          return (
            <FormInput type={'checkbox'} field='search'/>
          )
        }
      },
      {
        header: 'Lý do mượn',
        formatter: (_, index) => {
          return (
            <div className=" bw_col_12">
              <FormInput
                className="bw_frm_box"
                field={`list_product_borrow.${index}.reason`}
                style={{width: '100%', borderColor: "#ded3d3"}}
                placeholder="Nhập lý do mượn"/>
            </div>
          )
        }
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: ICON_COMMON.add,
        type: 'success',
        content: 'Thêm mới',
        permission: "SL_BORROWREQUEST_ADD",
        onClick: () => setIsOpenModal(true),
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        permission: "SL_BORROWREQUEST_DEL",
        onClick: (p, index) => remove(index)
      },
    ];
  }, []);

  return (
    <Fragment>
      <BWAccordion style={{paddìng: '0 0'}} title={title}>
        <DataTable
          fieldCheck={COLUMN_ID}
          columns={columns}
          data={methods.watch('list_product_borrow')}
          noSelect={true}
          noPaging={true}
          actions={actions}
        />
        {errors['list_product_borrow'] && <ErrorMessage message={errors.list_product_borrow.root.message}/>}
      </BWAccordion>
      {isOpenModal && <ModalAddProduct setIsOpenModal={setIsOpenModal}/>}
    </Fragment>
  );
}

export default BorrowRequestProduct;
