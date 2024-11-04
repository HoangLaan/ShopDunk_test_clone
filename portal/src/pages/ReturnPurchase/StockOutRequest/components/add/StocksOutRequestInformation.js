import React, { useCallback, useEffect, useMemo } from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import { getStocksRequestCode } from 'services/stocks-out-request.service';
import { useFormContext } from 'react-hook-form';
import { REVIEW_TYPE } from 'pages/StocksOutRequest/utils/constants';
import { useParams } from 'react-router-dom';
import { TRANSFER_TYPE } from 'pages/StocksTransfer/helpers/const';

const StocksOutRequestInformation = ({ title, isTransferDiffBusiness }) => {
  const methods = useFormContext();
  const { watch, setValue } = methods;
  const stocks_out_type_id = watch('stocks_out_type_id');
  const { stocks_out_request_id } = useParams();
  const loadStocksOutRequestCode = useCallback(() => {
    if (stocks_out_type_id && !stocks_out_request_id) {
      getStocksRequestCode(stocks_out_type_id)
        .then((object) => {
          for (const property in object) {
            setValue(property, object[property]);
          }
        })
        .catch((_) => {})
        .finally(() => {});
    }
  }, [stocks_out_type_id, stocks_out_request_id]);
  useEffect(loadStocksOutRequestCode, [loadStocksOutRequestCode]);

  const list_review = watch('list_review') ?? [];
  const lengthPending = list_review.filter((p) => parseInt(p.is_reviewed) === REVIEW_TYPE.PENDING).length;
  const lengthAccpect = list_review.filter((p) => parseInt(p.is_reviewed) === REVIEW_TYPE.ACCEPT).length;
  const lengthReject = list_review.filter((p) => parseInt(p.is_reviewed) === REVIEW_TYPE.REJECT).length;

  const statusReview = useMemo(() => {
    if (lengthReject > 0) {
      return 'Không duyệt';
    } else if (lengthAccpect === list_review.length) {
      return 'Đã duyệt';
    } else if (lengthPending === list_review.length || list_review.length === 0) {
      return 'Chưa duyệt';
    } else if (lengthPending < list_review.length) {
      return 'Đang duyệt';
    }
  }, [lengthPending, lengthReject, list_review, lengthAccpect]);

  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <div className='bw_col_3'>
          <FormItem disabled label='Số phiếu xuất'>
            <FormInput disabled type='text' field='stocks_out_request_code' />
          </FormItem>
        </div>
        <div className='bw_col_3'>
          <FormItem disabled label='Người tạo'>
            <FormInput disabled type='text' field='created_user' placeholder='Người tạo' />
          </FormItem>
        </div>
        <div className='bw_col_3'>
          <FormItem disabled label='Ngày phiếu xuất'>
            <FormInput disabled field='stocks_out_request_date' placeholder='' />
          </FormItem>
        </div>
        <div className='bw_col_3'>
          <FormItem disabled label='Trạng thái xuất'>
            <input
              type='text'
              value={
                stocks_out_request_id ? (watch('is_outputted') ? 'Đã xuất kho' : 'Chưa xuất kho') : 'Chưa xuất kho'
              }></input>
          </FormItem>
        </div>
      </div>

      {isTransferDiffBusiness ? (
        <>
          <div className='bw_row'>
            <div className='bw_col_3'>
              <FormItem disabled label='Số hóa đơn'>
                <FormInput disabled field='bill_code' />
              </FormItem>
            </div>
            <div className='bw_col_3'>
              <FormItem disabled label='Ngày hóa đơn'>
                <FormInput disabled field='bill_date' placeholder='' />
              </FormItem>
            </div>
            <div className='bw_col_3'>
              <FormItem disabled label='Ký hiệu'>
                <FormInput disabled field='symbol' placeholder='' />
              </FormItem>
            </div>
            <div className='bw_col_3'>
              <FormItem disabled label='Mẫu số'>
                <FormInput disabled field='number_example' placeholder='' />
              </FormItem>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </BWAccordion>
  );
};

export default StocksOutRequestInformation;
