import React, { useState, useCallback, useEffect } from 'react';
import TimeKeepingClaimTable from 'pages/TimeKeepingClaim/components/TimeKeepingClaimTable';
import TimeKeepingClaimFilter from 'pages/TimeKeepingClaim/components/TimeKeepingClaimFilter';
import { ExportExcelTimeKeepingClaim, getList } from 'services/time-keeping-claim.service';
import ConfirmModal from 'components/shared/ConfirmDeleteModal/index';
import CheckAccess from 'navigation/CheckAccess';
import BWButton from 'components/shared/BWButton';
import { getErrorMessage } from 'utils';
import { showToast } from 'utils/helpers';
import dayjs from 'dayjs';

const TimeKeepingClaimPage = () => {
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 25,
    date_from: dayjs().startOf('month').format('DD/MM/YYYY'),
    date_to: dayjs().format('DD/MM/YYYY')
  });
  const [dataList, setDataList] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadListTimeKeepingClaim = useCallback(() => {
    setLoading(true);
    getList(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadListTimeKeepingClaim, [loadListTimeKeepingClaim]);

  const handleExportExcel = () => {
    ExportExcelTimeKeepingClaim(params)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `DS_Giai_Trinh.xlsx`);
          document.body.appendChild(link);
          link.click();
      })
      .catch((err) => {
        const { message } = err;
        showToast.error(
          getErrorMessage({
            message: message || 'Đã xảy ra lỗi vui lòng kiểm tra lại',
          }),
        );
      })
      .finally(() => { })
  }

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <TimeKeepingClaimFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />

        <div className='bw_col_12 bw_flex bw_justify_content_right bw_align_items_center bw_btn_group'
          style={{ marginRight: '14px', transform: 'translate(0px, 20px)', padding: '0px' }}
        >
          <CheckAccess permission='HR_TIMEKEEPING_EXPORT'>
            <BWButton
              type='success'
              submit
              icon='fi fi-rr-inbox-out'
              content='Xuất Excel'
              onClick={() => handleExportExcel()} />
          </CheckAccess>
        </div>

        <TimeKeepingClaimTable
          loading={loading}
          data={items}
          totalPages={parseInt(totalPages)}
          itemsPerPage={parseInt(itemsPerPage)}
          page={parseInt(page)}
          totalItems={parseInt(totalItems)}
          onChangePage={(page) => {
            setParams({
              ...params,
              page,
            });
          }}
          onRefresh={loadListTimeKeepingClaim}
        />
      </div>
      <ConfirmModal />
    </React.Fragment>
  );
};

export default TimeKeepingClaimPage;
