import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import CheckAccess from 'navigation/CheckAccess';
import ModalSendMail from 'pages/Customer/components/modals/ModalSendMail';
import ModalSendSMS from 'pages/Customer/components/modals/ModalSendSMS';
import ModalZalo from 'pages/CustomerCare/components/Modals/ModalZalo';
import { CUSTOMER_CARE_PERMISSION } from 'pages/CustomerCare/utils/constants';
import { showToast } from 'utils/helpers';
import BWButton from '../BWButton';
import { StyledCareActionsV2 } from './styles';

function CareActionsV2(props) {
  const {
    selectedCustomer,
    isOpenModalSendMail,
    setIsOpenModalSendMail,
    isOpenModalSMS,
    setIsOpenModalSMS,
    isOpenModalZalo,
    setIsOpenModalZalo,
    exportExcel,
    setOpenModalSelectAll,
    setLoadedData,
    setTableKey,
    isOpenModel,
    keyId = 'data_leads_id',
    getListPromise,
    showExport = true,
    params,
  } = props;

  const hanldeSelectAll = useCallback(async () => {
    try {
      setOpenModalSelectAll(true);
      const result = [];
      const updateResult = (newArray = []) => {
        for (let i = 0; i < newArray.length; i++) {
          const indexMemberId = result.findIndex((x) => x[keyId] === newArray[i][keyId]);
          // if (indexMemberId === -1) {
          result.push(newArray[i]);
          // }
        }
        setLoadedData(result);
        setTableKey((prev) => ++prev);
      };
      const firstRes = await getListPromise({
        ...params,
        is_active: 1,
        page: 1,
        itemsPerPage: 250,
      });
      updateResult(firstRes.items);
      for (let page = 2; page <= firstRes.totalPages; page++) {
        // if (isOpenModel) {
        const pageRes = await getListPromise({
          ...params,
          is_active: 1,
          page,
          itemsPerPage: 250,
        });
        updateResult(pageRes?.items || []);
        // }
      }
    } catch (error) {
      showToast.error('Lấy danh sách khách hàng xảy ra lỗi !');
    }
  }, [getListPromise, keyId, setLoadedData, setOpenModalSelectAll, setTableKey, params]);

  const history = useHistory();

  return (
    <StyledCareActionsV2>
      <div className='bw_care_actions_v2 bw_col_12 bw_flex bw_justify_content_right bw_btn_group'>
        <CheckAccess permission={CUSTOMER_CARE_PERMISSION.ACTIONS}>
          {showExport && (
            <CheckAccess permission={CUSTOMER_CARE_PERMISSION.EXPORT}>
              <BWButton
                content='Export'
                outline={true}
                icon='fi fi-rr-inbox-out'
                onClick={() => {
                  exportExcel(selectedCustomer);
                }}
              />
            </CheckAccess>
          )}
          <CheckAccess permission={CUSTOMER_CARE_PERMISSION.ACTIONS_ZALO}>
            <BWButton
              content='Gửi Zalo'
              outline={true}
              icon='fa fa-comments'
              onClick={() => {
                if (selectedCustomer?.length <= 0) {
                  showToast.warning('Vui lòng chọn khách hàng để gửi mail');
                } else {
                  setIsOpenModalZalo(true);
                }
              }}
            />
          </CheckAccess>
          <CheckAccess permission={CUSTOMER_CARE_PERMISSION.ACTIONS_SMS}>
            <BWButton
              content='Gửi SMS'
              outline={true}
              icon='fa fa-rss'
              onClick={() => {
                if (selectedCustomer?.length <= 0) {
                  showToast.warning('Vui lòng chọn khách hàng để gửi mail');
                } else {
                  setIsOpenModalSMS(true);
                }
              }}
            />
          </CheckAccess>
          <CheckAccess permission={CUSTOMER_CARE_PERMISSION.ACTIONS_EMAIL}>
            <BWButton
              content='Gửi email'
              outline={true}
              icon='fa fa-share'
              onClick={() => {
                if (selectedCustomer?.length <= 0) {
                  showToast.warning('Vui lòng chọn khách hàng để gửi mail');
                } else {
                  setIsOpenModalSendMail(true);
                }
              }}
            />
          </CheckAccess>
          <CheckAccess permission={CUSTOMER_CARE_PERMISSION.SELECT_ALL}>
            <BWButton content='Chọn tất cả' icon='fa fa-street-view' onClick={hanldeSelectAll} />
          </CheckAccess>
          <CheckAccess permission={CUSTOMER_CARE_PERMISSION.ACTIONS_TASK}>
            <BWButton
              content='Tạo công việc'
              type='success'
              icon='fa fa-tasks'
              onClick={() => {
                if (selectedCustomer?.length <= 0) {
                  showToast.warning('Vui lòng chọn khách hàng để tạo công việc');
                } else {
                  history.push('/task/add', { selectedCustomer });
                }
              }}
            />
          </CheckAccess>
        </CheckAccess>
        {isOpenModalSendMail && (
          <ModalSendMail onClose={() => setIsOpenModalSendMail(false)} selectedCustomer={selectedCustomer} />
        )}
        {isOpenModalSMS && (
          <ModalSendSMS selectedCustomer={selectedCustomer} onClose={() => setIsOpenModalSMS(false)} />
        )}
        {isOpenModalZalo && (
          <ModalZalo selectedCustomer={selectedCustomer} onClose={() => setIsOpenModalZalo(false)} customer={{}} />
        )}
      </div>
    </StyledCareActionsV2>
  );
}

export default CareActionsV2;
