import React, {useCallback, useEffect, useState} from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import {mapDataOptions4Select, mapDataOptions4SelectCustom, mapDataOptions4SelectCustomByType} from "utils/helpers";
import FormSelect from "components/shared/BWFormControl/FormSelect";
import {useDispatch, useSelector} from "react-redux";
import {getOptionsGlobal} from "actions/global";
import {useFormContext} from "react-hook-form";
import {getListReviewByType} from "services/borrow-request.service"
import FormRangePicker from "components/shared/BWFormControl/FormDateRange";
function BorrowRequestInfo({disabled, title}) {
  const dispatch= useDispatch();
  const [stockBorrow, setStockBorrow] = useState([]);
  const [stockOut, setStockOut] = useState([]);
  const methods=useFormContext()
  const {watch,setValue}=methods;

  useEffect(()=>{
    dispatch(getOptionsGlobal("company"))
    dispatch(getOptionsGlobal("borrowType"))
    dispatch(getOptionsGlobal("stocks"))
    dispatch(getOptionsGlobal("store",{company_id:watch("company_id")}))
    dispatch(getOptionsGlobal("user",{company_id:watch("company_id")}));
    if(stocksData) {
      setStockBorrow(stocksData)
      setStockOut(stocksData)
    }
  },[watch("company_id")])

  const {companyData,storeData,userData,stocksData,borrowTypeData}=useSelector(state => state.global)
  const handleChangeTypeBorrow= (value)=>{
    getListReviewByType({borrow_type_code:value}).then(res=>{
      setValue("borrow_type_id",value)
      setValue("borrow_request_review_list",[])
      setValue("borrow_request_review",[])
      setValue("borrow_request_review_list",res)
    })
  }

  const handleCompanyChange = async(value = null) => {
    setValue('company_id', value);
    handleChangeStock(null, 'store_borrow_id');
    handleChangeStock(null, 'store_out_id');
    dispatch(getOptionsGlobal("store",{company_id:value}));
    dispatch(getOptionsGlobal("user",{company_id:value}));
  }

  const DEFSTORE = [
    {
      idStore: 'store_borrow_id',
      fieldReset: [
        'stock_borrow_id',
      ],
    },
    {
      idStore: 'store_out_id',
      fieldReset: [
        'stock_out_id',
      ],
    }
  ]

  const handleChangeStock = async (value = null, def = null, field= null, defField = 'store_id', valueReset = null) => {
    if(field) {
      let objParam = {};
      objParam[defField] = value;
      await dispatch(getOptionsGlobal(field,objParam));    
    }
    const cloneDEFSTORE = structuredClone(DEFSTORE);
    cloneDEFSTORE.map((val, index) => {
      if(val) {
        if(val?.idStore === def) {
          setValue(def, value);
          if(field === 'stocks') {
            if(def === 'store_out_id') {
              setStockOut(stocksData);
            } else {
              setStockBorrow(stocksData);
            }
          }
          val?.fieldReset.map((valX, indexX) => {
            if(valX) {
              setValue(valX, valueReset);
            }
          })
        }
      }
    })
  }

  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <div className='bw_col_6'>
          <FormItem label='Hình thức mượn hàng' isRequired disabled={disabled}>
            <FormSelect
              field='borrow_type_id'
              onChange={handleChangeTypeBorrow}
              list={mapDataOptions4Select(borrowTypeData)}
              validation={{
                required: 'Hình thức mượn là bắt buộc',
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Thuộc công ty' isRequired disabled={disabled}>
            <FormSelect
              field='company_id'
              list={mapDataOptions4SelectCustom(companyData)}
              onChange={(evt) => {
                handleCompanyChange(evt);
              }}
              validation={{
                required: 'Công ty là bắt buộc',
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem  label='Mã phiếu mượn' isRequired disabled={disabled}>
            <FormInput
              field='borrow_request_code'
              validation={{
                required: 'Mã phiếu là bắt buộc',
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Cửa hàng mượn' isRequired={true} disabled={disabled}>
            <FormSelect
              field='store_borrow_id'
              list={mapDataOptions4SelectCustom(storeData)}
              onChange={(evt) => {
                handleChangeStock(evt, 'store_borrow_id', 'stocks', 'store_id');
              }}
              validation={{
                required: 'Cửa hàng mượn là bắt buộc',
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Nhân viên mượn' isRequired={true} disabled={disabled}>
            <FormSelect
              field='employee_borrow'
              list={mapDataOptions4SelectCustomByType(userData)}
              validation={{
                required: 'Nhân viên mượn là bắt buộc',
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Kho Mượn' isRequired={true} disabled={disabled}>
            <FormSelect
              field='stock_borrow_id'
              list={mapDataOptions4SelectCustom(stockBorrow)}
              validation={{
                required: 'Kho mượn là bắt buộc',
              }}
              disabled={disabled || !watch('store_borrow_id')}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Cửa hàng xuất' isRequired={true} disabled={disabled}>
            <FormSelect
              field='store_out_id'
              list={mapDataOptions4SelectCustom(storeData)}
              validation={{
                required: 'Cửa hàng xuất là bắt buộc',
              }}
              onChange={(evt) => {
                handleChangeStock(evt, 'store_out_id', 'stocks', 'store_id');
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Kho xuất' isRequired={true} disabled={disabled}>
            <FormSelect
              field='stock_out_id'
              list={mapDataOptions4SelectCustom(stockOut)}
              validation={{
                required: 'Kho xuất là bắt buộc',
              }}
              disabled={disabled || !watch('store_out_id')}
            />
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <FormItem label='Ngày mượn - Ngày hẹn trả' disabled={disabled}>
          <FormRangePicker
            style={{ width: '100%' }}
            fieldStart='date_borrow'
            fieldEnd='date_return'
            validation={{
              required: 'Thời gian mượn trả là bắt buộc',
            }}
            placeholder={['Nhập ngày mượn', 'Nhập ngày hẹn trả']}
            format={'DD/MM/YYYY'}
            allowClear={true}
          />
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <FormItem label='Ghi chú' disabled={disabled}>
            <FormTextArea
              field='note'
              placeholder='Nhập ghi chú'
              disabled={disabled}
            />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
}

export default BorrowRequestInfo;
