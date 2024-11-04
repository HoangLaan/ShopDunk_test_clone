import React, { useCallback } from 'react';
import { useState } from 'react';
import AutoGenTable from './Table';
import AutoFilter from './Filter';
import { useParams } from 'react-router-dom/cjs/react-router-dom';
import { exportExcelAutoGenCoupon, getListAutoGenCouponService } from 'services/coupon.service';
import { useEffect } from 'react';
import { defaultParams } from 'utils/helpers';
import Loading from 'components/shared/Loading';
import moment from 'moment';
import { notification } from 'antd';

function AutoCodeDetailPage() {
  const { coupon_id } = useParams();
  const [dataList, setDataList] = React.useState([]);
  const [params, setParams] = useState(defaultParams);
  const loadCouponDetail = useCallback(() => {
    if (coupon_id) {
      getListAutoGenCouponService(coupon_id,params).then((value) => {
        setDataList(value);
      });
    }
  }, [coupon_id,params]);

  useEffect(loadCouponDetail, [loadCouponDetail]);
  const { items, itemsPerPage, page, totalItems, totalPages, meta } = dataList;
  const [loadingExport, setLoadingExport] = useState(false);

  const onClearParams = () => setParams(defaultParams);
  const onChange = (p) => setParams((prev) => ({ ...prev, ...p }));
  const onChangePage = (page) => setParams((prev) => ({ ...prev, page }));

  
  const exportExcel = () => {
    setLoadingExport(true);
    exportExcelAutoGenCoupon(coupon_id,params)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        const configDate = moment().format('DDMMYYYY');
        link.setAttribute('download', `Danh_sach_ma_giam${configDate}.xlsx`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => notification.error({ message: error.message || 'Lỗi tải tập tin.' }))
      .finally(() => setLoadingExport(false));
  };


  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <AutoFilter onChange={onChange} onClearParams={onClearParams} />
        <AutoGenTable
          meta={meta}
          params={params}
          onChangePage={onChangePage}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          exportExcel={exportExcel}
        />
      </div>
      {loadingExport && <Loading />}
    </React.Fragment>
  );
}

export default AutoCodeDetailPage;
