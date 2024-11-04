import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';

import { getListPRProduct } from 'services/request-purchase-order.service';
import TableRequisition from '../Tables/TableRequisition';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import ToggleButton from 'components/shared/ToggleButton/ToggleButton';

function RequestPurchase({ disabled, title, requestPurchaseId, isAdd }) {
  const methods = useFormContext();
  const watchPRList = methods.watch('purchase_requisition_list');
  const purchaseRequisitionOptions = useGetOptions(optionType.purchaseRequisition, {
    params: {
      is_active: 1,
    },
  });
  const discountProgramOptions = useGetOptions(optionType.discountProgram);
  const [isSelectAll, setIsSelectAll] = useState(false);

  useEffect(() => {
    if (watchPRList?.length >= 0) {
      const fetchPrList = async () => {
        const _prList = await getListPRProduct({
          request_purchase_id: requestPurchaseId,
          purchase_requisition_list: watchPRList.map((x) => x.value),
        });
        if (_prList?.length > 0) {
          methods.setValue(
            'pr_product_list',
            _prList?.length > 0
              ? (_prList || []).map((x) => ({
                  ...x,
                  total_price: x.rpo_price,
                }))
              : [],
          );
        }else {
          methods.setValue('pr_product_list', []);
        }
      };
      fetchPrList();
    }
  }, [requestPurchaseId, watchPRList]);

  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <div className='bw_col_12 bw_text_right bw_mb_2'>
          <ToggleButton
            type={'button'}
            isActive={isSelectAll}
            onClick={() => {
              if (!isSelectAll) {
                const prNotRequestIds = purchaseRequisitionOptions.filter((x) => !x.is_exists_request);
                methods.setValue('purchase_requisition_list', prNotRequestIds);
                setIsSelectAll(true);
              } else {
                methods.setValue('purchase_requisition_list', []);
                setIsSelectAll(false);
              }
            }}>
            {isSelectAll ? 'Bỏ chọn tất cả phiếu' : 'Chọn tất cả phiếu chưa tạo đơn đặt hàng'}
          </ToggleButton>
        </div>
        <div className='bw_col_12'>
          <FormItem label='Phiếu yêu cầu nhập hàng' disabled={disabled}>
            <FormSelect
              field='purchase_requisition_list'
              mode='multiple'
              list={purchaseRequisitionOptions}
              // validation={{
              //   required: 'Phiếu yêu cầu nhập hàng là bắt buộc',
              // }}
              className='reload_remove_icon'
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <FormItem label='Chương trình chiết khấu' disabled={disabled}>
            <FormSelect field='discount_program_id' list={discountProgramOptions} disabled={disabled} allowClear />
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <TableRequisition isAdd={isAdd} disabled={disabled} />
        </div>
      </div>
    </BWAccordion>
  );
}

export default RequestPurchase;
