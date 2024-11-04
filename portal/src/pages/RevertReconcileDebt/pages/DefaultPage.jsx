import React, { useCallback, useState } from 'react';
import FormSection from 'components/shared/FormSection/index';
import { FormProvider, useForm } from 'react-hook-form';

import { revertReconcile, getHistoryList } from 'services/reconcile-debt.service';
import ReconcileFilter from '../components/FormSection/Infomation';

import { showToast } from 'utils/helpers';
import { DefaultValue, SUBMIT_TYPE } from '../utils/constant';
import HistoryList from '../components/FormSection/HistoryList';
import ConfirmReconcile from '../components/Popup/ConfirmReconcile';

const ReconcileDebtAdd = () => {
  const methods = useForm({
    defaultValues: DefaultValue,
  });

  const { watch } = methods;

  const [showConfirm, setShowConfirm] = useState(false);

  const loadData = useCallback((payload) => {
    getHistoryList({
      currency_type: payload.currency_type,
      supplier_id: payload.supplier_id,
      account_id: payload.account_id,
    }).then((data) => {
      methods.setValue('history_list', data?.history_data || []);
    });
  }, []);

  const onSubmit = async (payload) => {
    try {
      if (payload.submit_type === SUBMIT_TYPE.FILTER) {
        loadData(payload);
      } else if (payload.submit_type === SUBMIT_TYPE.EXECUTE) {
        const selectedHistory = methods.watch('selected_history');
        if (selectedHistory && selectedHistory.length > 0) {
          revertReconcile({ history_list: selectedHistory })
            .then((data) => {
              setShowConfirm(true);
            })
            .catch((err) => {
              showToast.error(err?.message || 'Thực hiện đối trừ xảy ra lỗi !');
            });
        } else {
          showToast.warning('Vui lòng chọn chứng để hủy đối trừ !');
        }
      }
    } catch (error) {
      showToast.error(error?.message || 'Có lỗi xảy ra!');
    }
  };

  const detailForm = [
    {
      title: 'Đối tượng',
      id: 'object_id',
      component: ReconcileFilter,
      fieldActive: ['installment_form_name', 'installment_form_code'],
    },
    {
      title: 'Chứng từ',
      id: 'payment_id',
      component: HistoryList,
      fieldActive: false,
    },
  ];

  const actions = [
    {
      icon: 'fi fi-rr-check',
      submit: false,
      content: 'Bỏ đối trừ',
      className: 'bw_btn bw_btn_danger',
      onClick: (e) => {
        methods.setValue('submit_type', SUBMIT_TYPE.EXECUTE);
        methods.handleSubmit(onSubmit)(e);
      },
    },
  ];

  return (
    <React.Fragment>
      <FormProvider {...methods}>
        <FormSection actions={actions} noClose noSideBar detailForm={detailForm} onSubmit={onSubmit} disabled={false} />
      </FormProvider>
      {showConfirm && (
        <ConfirmReconcile
          onClose={() => {
            setShowConfirm(false);
          }}
          onOK={() => {
            loadData({
              currency_type: watch('currency_type'),
              supplier_id: watch('supplier_id'),
              account_id: watch('account_id'),
            });
            document.getElementById('data-table-select')?.click(); // bỏ chọn items
            methods.setValue('selected_history', []);
          }}
        />
      )}
    </React.Fragment>
  );
};

export default ReconcileDebtAdd;
