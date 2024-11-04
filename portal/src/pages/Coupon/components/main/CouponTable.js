import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import CouponFilter from 'pages/Coupon/components/main/CouponFilter';
import { COUPON_PERMISSION } from 'pages/Coupon/utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { getCoupons } from 'pages/Coupon/actions/actions';
import { couponTypes } from 'pages/Coupon/utils/helpers';
import { delCouponService } from 'services/coupon.service';
import ICON_COMMON from 'utils/icons.common';
import { useForm, FormProvider } from 'react-hook-form';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';

const CouponTable = () => {
  const history = useHistory();
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });

  const [params, setParams] = useState({
    is_active: 1,
  });

  const dispatch = useDispatch();

  const { couponList, getCouponsLoading } = useSelector((state) => state.coupon);
  const { items, itemsPerPage, page, totalItems, totalPages } = couponList;

  const loadCoupon = useCallback(() => {
    dispatch(getCoupons(params));
  }, [dispatch, params]);
  useEffect(loadCoupon, [loadCoupon]);
  const columns = useMemo(
    () => [
      {
        header: 'Tên chương trình mã khuyến mại',
        classNameHeader: 'bw_text_center',
        accessor: 'coupon_name',
        style: {
          width: '250px',
          maxWidth: '350px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
      },
      {
        header: 'Ngân sách',
        accessor: 'budget',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        formatter: (e) => `${e?.budget?.toLocaleString()}đ`,
      },
      {
        header: 'Thời gian áp dụng',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (e) => `${e?.start_date} - ${e?.end_date || 'Vô thời hạn'}`,
      },
      {
        header: 'Trạng thái',
        accessor: 'coupon_status_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (e) => {
          const _ = couponTypes.find((p) => p?.value === e?.coupon_type_status_id);
          const className = 'bw_label ' + _?.class;
          return (
            <span
              onClick={() => {
                methods.setValue('coupon_type_status_id', e?.coupon_type_status_id);
                setParams((prev) => ({
                  ...prev,
                  coupon_type_status_id: e?.coupon_type_status_id,
                }));
              }}
              className={className}>
              {_?.label}
            </span>
          );
        },
      },
      {
        header: 'Người tạo',
        classNameHeader: 'bw_text_center',
        accessor: 'created_user',
      },
      {
        header: 'Ngày tạo',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'created_date',
      },
      {
        header: 'Kích hoạt',
        accessor: 'is_active',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) =>
          p?.is_active ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Kích hoạt</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Ẩn</span>
          ),
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
        permission: COUPON_PERMISSION.ADD,
        onClick: (p) => history.push(`/coupon/add`),
      },
      {
        icon: ICON_COMMON.edit,
        color: 'blue',
        permission: COUPON_PERMISSION.EDIT,
        onClick: (p) => history.push(`/coupon/edit/${p?.coupon_id}`, { coupon: p }),
      },
      {
        icon: ICON_COMMON.view,
        color: 'green',
        permission: COUPON_PERMISSION.VIEW,
        onClick: (p) => history.push(`/coupon/detail/${p?.coupon_id}?tab_active=information`, { coupon: p }),
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        permission: COUPON_PERMISSION.DEL,
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await delCouponService([_?.coupon_id]);
                loadCoupon();
              },
            ),
          ),
      },
    ];
  }, []);

  return (
    <React.Fragment>
      <FormProvider {...methods}>
        <CouponFilter
          onChange={(e) => {
            setParams({
              ...params,
              ...e,
              page: 1,
            });
          }}
          onClear={() => {
            setParams({
              is_active: 1,
            });
          }}
        />
        <DataTable
          loading={getCouponsLoading}
          columns={columns}
          data={items}
          actions={actions}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          onChangePage={(page) => {
            setParams({
              ...params,
              page,
            });
          }}
          handleBulkAction={(e) =>
            dispatch(
              showConfirmModal(
                ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
                async () => {
                  await delCouponService(e?.map((o) => o?.coupon_id));
                  loadCoupon();
                },
              ),
            )
          }
        />
      </FormProvider>
    </React.Fragment>
  );
};

export default CouponTable;
