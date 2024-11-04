import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import classNames from 'classnames';

import ICON_COMMON from 'utils/icons.common';
import DataTable from 'components/shared/DataTable/index';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import usePagination from 'hooks/usePagination';
import useDeepMemo from 'hooks/useDeepMemo';

import { useRequestPurchaseContext } from 'pages/RequestPurchaseOrder/helpers/context';
import { PERMISSION } from 'pages/RequestPurchaseOrder/helpers/constants';
import BlankButton from '../Shared/BlankButton';
import ModalOrderHistory from '../Modals/ModalOrderHistory';
import usePageInformation from 'hooks/usePageInformation';
import ToggleButton from 'components/shared/ToggleButton/ToggleButton';
import { formatQuantity } from 'utils/number';
import CheckAccess from 'navigation/CheckAccess';
import useVerifyAccess from 'hooks/useVerifyAccess';
import { useAuth } from 'context/AuthProvider';
import { getProductOptions } from 'services/stocks-in-request.service';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import { formatPrice, formatPricePurchaseOrder } from 'utils';
import { getPriceNearly } from 'services/request-purchase-order.service';
import { formatCurrency } from 'pages/Component/helpers';

function TableRequisition({ isAdd }) {
  const methods = useFormContext();
  const { disabled, isView } = usePageInformation();
  const prProductListField = useFieldArray({ control: methods.control, name: 'pr_product_list' });
  const { clearErrors, setValue, watch } = methods;

  const data = methods.watch('pr_product_list') || [];
  const pagination = usePagination({ data, itemsPerPage: 10 });

  const { openModalPRListFunc } = useRequestPurchaseContext();
  const [modalHistory, setModalHistory] = useState({
    isOpen: false,
    product: null,
  });

  const { user } = useAuth();

  const { verifyPermission } = useVerifyAccess();
  const isCanReview =
    verifyPermission(PERMISSION.REVIEW) &&
    methods.watch(`review_level`)?.find((item) => item.user_name === parseInt(user.user_name));

  const openModalRequisition = (e, product) => {
    e.preventDefault();
    const prList = (methods.watch('purchase_requisition_list') || []).map((x) => x.value);
    openModalPRListFunc(product, prList);
  };

  const getOptionsProductName = async (value) => {
    const data = await getProductOptions({ product_name: value, product_code: null });
    return data;
  };

  const isExistPRList = (methods.watch(`purchase_requisition_list`) ?? []).length !== 0;
  const supplier_id = methods.watch('supplier_id');

  const columns = useMemo(() => {
    return [
      {
        header: 'STT',
        classNameHeader: 'bw_sticky bw_check_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_check_sticky bw_text_center',
        formatter: (_, idx) => <b className='bw_sticky bw_name_sticky'>{_.dataIndex + 1}</b>,
      },
      {
        header: 'Mã sản phẩm',
        formatter: (_, idx) => {
          return (
            <button type='button' className='bw_btn_link' onClick={(e) => openModalRequisition(e, _)}>
              {_.product_code ?? watch(`pr_product_list.${_.dataIndex}.product_code`)}
            </button>
          );
        },
      },
      {
        header: 'Tên sản phẩm',
        formatter: (_, index) => {
          if (!isExistPRList) {
            return (
              <FormDebouneSelect
                field={`pr_product_list.${index}.product_name`}
                bordered
                disabled={disabled}
                placeholder='Nhập tên sản phẩm'
                fetchOptions={getOptionsProductName}
                onChange={async (_, p) => {
                  setValue(`pr_product_list.${index}.product_code`, p.product_code);
                  setValue(`pr_product_list.${index}.product_name`, p.product_name);
                  setValue(`pr_product_list.${index}.product_id`, p.id);
                  setValue(`pr_product_list.${index}.unit_name`, p.unit_name);
                  setValue(`pr_product_list.${index}.unit_id`, p.unit_id);
                  setValue(`pr_product_list.${index}.category_name`, p.category_name);
                  setValue(`pr_product_list.${index}.manufacture_name`, p.manufacture_name);
                  setValue(`pr_product_list.${index}.vat_value`, p.vat_value);
                  if (supplier_id && p.id) {
                    const res = await getPriceNearly({ product_id: p.id, supplier_id });
                    setValue(`pr_product_list.${index}.price_nearly`, res);
                  }
                }}
              />
            );
          }
          return _.product_name;
        },
      },
      {
        header: 'ĐVT',
        accessor: 'unit_name',
      },
      {
        header: 'Đơn giá có VAT',
        formatter: (_, idx) => (
          <FormNumber
            bordered={true}
            min={0}
            className='custom-form-number-vat'
            style={{minWidth: '130px'}}
            field={`pr_product_list.${_.dataIndex}.vat_price`}
            validation={{
              required: 'Đơn giá có VAT là bắt buộc',
            }}
            onChange={(value) => {
              methods.clearErrors(`pr_product_list.${_.dataIndex}.vat_price`);
              methods.setValue(`pr_product_list.${_.dataIndex}.vat_price`, value);

              const vat_value = _.vat_value || 0;
              let origin_price = Number(Number(value) / Number((100 + vat_value) / 100));
              if (origin_price) {
                methods.setValue(`pr_product_list.${_.dataIndex}.total_price`, formatPrice(origin_price.toFixed(3), false, ','));
              }
            }}
            disabled={disabled}
          />
        ),
      },
      {
        header: 'VAT',
        formatter: (item) => <span>{`${item.vat_value || 0} %`}</span>,
      },
      {
        header: 'Đơn giá nhập',
        classNameBody: 'bw_sticky bw_check_sticky bw_text_right',
        formatter: (item) => {
          return <span>{item.total_price}</span>;
        },
      },

      {
        header: 'Giá nhập gần nhất',
        classNameBody: 'bw_sticky bw_check_sticky bw_text_right',
        formatter: (_, idx) => formatPrice(_.price_nearly, false, ','),
      },
      {
        header: 'Số lượng đề xuất',
        formatter: (_, idx) => (
          <FormNumber
            bordered={true}
            min={0}
            className='custom-form-number-quantity-expected'
            field={`pr_product_list.${_.dataIndex}.quantity_expected`}
            // validation={{
            //   required: 'Số lượng đề xuất là bắt buộc',
            // }}
            disabled={true}
          />
        ),
      },
      {
        header: 'Lịch sử bán',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, idx) => {
          return <BlankButton onClick={() => setModalHistory({ isOpen: true, product: _ })}>Xem</BlankButton>;
        },
      },
      {
        styleHeader: {
          minWidth: '100px',
          textWrap: 'wrap',
        },
        header: 'Số lượng dự kiến',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        // formatter: (d) => formatQuantity(d.quantity_reality),
        formatter: (_, idx) => (
          <FormNumber
            bordered={true}
            min={0}
            className='custom-form-number-quantity-reality'
            field={`pr_product_list.${_.dataIndex}.quantity_reality`}
            validation={{
              required: 'Số lượng dự kiến là bắt buộc',
            }}
            onChange={(value) => {
              const quantity_expected = watch(`pr_product_list.${_.dataIndex}.quantity_expected`) ?? 0;
              if (value > quantity_expected && watch('purchase_requisition_list')?.length > 0) {
                return setValue(`pr_product_list.${_.dataIndex}.quantity_reality`, quantity_expected);
              }
              setValue(`pr_product_list.${_.dataIndex}.quantity_reality`, value);
            }}
            disabled={disabled}
          />
        ),
      },
      {
        header: 'Thành tiền',
        classNameBody: 'bw_sticky bw_check_sticky bw_text_right',
        formatter: (item) => {
          return <span>{formatPrice(item.vat_price * item.quantity_reality, false, ',')}</span>;
        },
      },
      {
        styleHeader: {
          minWidth: '100px',
          textWrap: 'wrap',
        },
        header: 'Số phiếu yêu cầu mua hàng',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        hidden: !isExistPRList,
        formatter: (d) => watch('purchase_requisition_list').length || 0,
      },
      {
        header: 'Ngành hàng',
        accessor: 'category_name',
        formatter: (_) => _.category_name ?? watch(`pr_product_list.${_.dataIndex}.category_name`),
      },
      {
        header: 'Hãng',
        accessor: 'manufacture_name',
        formatter: (_) => _.manufacture_name ?? watch(`pr_product_list.${_.dataIndex}.manufacture_name`),
      },
      {
        header: 'Duyệt',
        hidden: !isCanReview || isAdd,
        classNameHeader: isView
          ? 'bw_text_center bw_sticky bw_action_table_2_view'
          : 'bw_sticky bw_action_table_2 bw_text_center',
        classNameBody: isView
          ? 'bw_text_center bw_sticky bw_action_table_2_view'
          : 'bw_sticky bw_action_table_2 bw_text_center',
        formatter: (_, idx) => (
          <FormSelect
            field={`pr_product_list.${_.dataIndex}.is_reviewed`}
            list={[
              { label: 'Duyệt', value: 1 },
              { label: 'Từ chối', value: 0 },
            ]}
            style={{ marginLeft: 15 }}
            disabled={disabled}
          />
        ),
      },
    ];
  }, [pagination, isView, supplier_id]);

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm',
        hidden: isExistPRList,
        permission: PERMISSION.ADD_PRODUCT,
        onClick: (p) => {
          const pr_product_list = methods.watch('pr_product_list') ?? [];
          methods.setValue('pr_product_list', [...pr_product_list, {}]);
        },
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        permission: PERMISSION.EDIT,
        hidden: disabled,
        onClick: (p, idx) => {
          prProductListField.remove(p.dataIndex);
        },
      },
    ];
  }, [pagination]);

  const isReviewed = useDeepMemo(() => {
    const values = methods.watch('pr_product_list') || [];
    if (values.length) {
      const isAllReviewed = values.every((x) => x.is_reviewed === 1);
      const isAllNotReviewed = values.every((x) => x.is_reviewed === 0);

      if (isAllReviewed) return 1;
      if (isAllNotReviewed) return 0;
    }
    return null;
  }, [methods.watch('pr_product_list')]);

  useEffect(() => {
    methods.setValue('is_reviewed', isReviewed);
  }, [isReviewed]);

  const changeGridReview = (e, isReview) => {
    e.preventDefault();
    const values = methods.watch('pr_product_list') || [];
    const newValues = values.map((x) => ({ ...x, is_reviewed: isReview }));
    methods.setValue('pr_product_list', newValues);
  };

  const title =
    !isAdd && isCanReview ? (
      <div className='bw_filters'>
        <CheckAccess permission={PERMISSION.REVIEW}>
          <ToggleButton
            isActive={isReviewed === 1}
            onClick={(e) => changeGridReview(e, 1)}
            color='#2f80ed'
            style={{ marginRight: 5 }}>
            Đồng ý
          </ToggleButton>
          <ToggleButton isActive={isReviewed === 0} onClick={(e) => changeGridReview(e, 0)} color='#ec2d41'>
            Từ chối
          </ToggleButton>
        </CheckAccess>
      </div>
    ) : null;

  return (
    <Fragment>
      <DataTable
        noSelect={true}
        title={title}
        actions={actions}
        columns={columns}
        data={pagination.rows}
        noPaging={!isExistPRList}
        totalPages={pagination.totalPages}
        itemsPerPage={pagination.itemsPerPage}
        totalItems={pagination.totalItems}
        page={pagination.page}
        onChangePage={pagination.onChangePage}
        customSumRow={[
          {
            index: 1,
            value: 'Tổng cộng',
            colSpan: 4,
            style: {
              textAlign: 'center',
            },
          },
          // {
          //   index: 5,
          //   formatter: (items) =>
          //     formatPrice(
          //       items?.reduce((acc, item) => {
          //         return acc + (item.vat_price ?? 0);
          //       }, 0).toFixed(3) || 0,
          //       false,
          //       ',',
          //     ),
          //   style: {
          //     textAlign: 'right',
          //   },
          // },
          {
            index: 9,
            formatter: (items) =>
              items?.reduce((acc, item) => {
                return acc + (item.quantity_expected ?? 0);
              }, 0) || 0,
            style: {
              textAlign: 'right',
            },
          },
          {
            index: 11,
            formatter: (items) =>
              items?.reduce((acc, item) => {
                return acc + (item.quantity_reality ?? 0);
              }, 0) || 0,
            style: {
              textAlign: 'right',
            },
          },
          {
            index: 12,
            formatter: (items) =>
              formatPrice(
                items?.reduce((acc, item) => {
                  return acc + (item.vat_price ?? 0) * (item.quantity_reality ?? 0);
                }, 0).toFixed(3) || 0,
                false,
                ',',
              ),
            style: {
              textAlign: 'right',
            },
          },
        ]}
      />
      {modalHistory.isOpen && (
        <ModalOrderHistory
          setModalHistory={setModalHistory}
          product={modalHistory.product}
          purchaseRequisitionList={watch('purchase_requisition_list')}
        />
      )}
    </Fragment>
  );
}

export default TableRequisition;
