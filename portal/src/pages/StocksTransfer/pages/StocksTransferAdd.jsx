import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FormSection from 'components/shared/FormSection';

import { Transfer, notification } from 'antd';
import { confirmTranfer, create, exportPDF, genStocksTransferCode, read, update, updateStatusTransfer } from '../helpers/call-api';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useAuth } from 'context/AuthProvider';
//compnents

import StocksTransferProduct from '../components/add/StocksTransferProduct';
import StocksTransferReviewTable from '../components/add/StocksTransferReviewTable';
import StocksTransferInfor from '../components/add/StocksTransferInfor';
import StocksTransferRequest from '../components/add/StocksTransferRequest';
import StocksTransport from '../components/add/StocksTransport';
import { TRANSFER_TYPE, defaultValues } from '../helpers/const';
import BWLoader from 'components/shared/BWLoader/index';
import { cdnPath, getErrorMessage } from '../../../utils/index';
import Modal from 'components/shared/Modal/index';
import BWButton from 'components/shared/BWButton/index';
import { showToast } from 'utils/helpers';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';

dayjs.extend(customParseFormat);

const StocksTransferAdd = ({ stocksTransferId = null, isEdit = true }) => {
  const { user: userEnt } = useAuth();
  const dispatch = useDispatch();
  const methods = useForm({ defaultValues: defaultValues });
  const { watch } = methods;

  const [loadingPdf, setLoadingPdf] = useState(false);
  const [isConfirmTransfer, setIsConfirmTransfer] = useState(false);

  const getInit = async () => {
    if (!stocksTransferId) {
      // Tạo mã số phiếu chuyển
      const generalStocktranferCode = await genStocksTransferCode();
      methods.setValue('stocks_transfer_code', generalStocktranferCode?.stocks_transfer_code || '');
      // Lưu người tạo phiếu
      methods.setValue(
        'created_user',
        userEnt?.user_name == 'administrator' ? userEnt?.full_name : `${userEnt?.user_name} - ${userEnt?.full_name}`,
      );
    }
  };

  useEffect(() => {
    getInit();
    methods.register('product_transfer', { required: 'Sản phẩm chuyển kho là bắt buộc.' });
  }, []);

  const handleExportPDF = () => {
    setLoadingPdf(true);

    exportPDF(stocksTransferId)
      .then((response) => {
        let varUrl = response.path;
        const url = cdnPath(varUrl);
        const pdflink = document.createElement('a');
        pdflink.target = '_blank';
        pdflink.href = url;
        document.body.appendChild(pdflink);
        pdflink.click();
      })
      .finally(() => {
        setLoadingPdf(false);
      });
  };

  const onSubmit = async (values) => {
    let formData = { ...values };
    try {
      if (stocksTransferId) {
        await update(stocksTransferId, formData);
        showToast.success('Cập nhật phiếu chuyển kho thành công.');
      } else {
        await create(formData);
        showToast.success('Thêm mới phiếu chuyển kho thành công.');
        const generalStocktranferCode = await genStocksTransferCode();

        const stocks_transfer_code = generalStocktranferCode?.stocks_transfer_code || '';
        const created_user =
          userEnt?.user_name === 'administrator' ? userEnt?.full_name : userEnt?.user_name - userEnt?.full_name;

        methods.reset({
          is_active: 1,
          status_transfer: 5,
          created_date: dayjs().format('DD/MM/YYYY'),
          created_user,
          stocks_transfer_code,
          stocks_transfer_review_list: [],
          product_transfer: {},
        });
        methods.setValue('reviewed_status', 2)
      }
    } catch (error) {
      showToast.error(error?.message || 'Có lỗi xảy ra vui lòng thử lại.');
    }
  };

  const loadStocksTransferDetail = useCallback(async () => {
    if (stocksTransferId) {
      const detail = await read(stocksTransferId);

      methods.reset({
        ...detail,
        is_ready: true,
      });
    }
  }, [stocksTransferId]);

  useEffect(() => {
    loadStocksTransferDetail();
  }, []);

  const handleCancelOrder = async () => {
    try {
      await updateStatusTransfer({stocks_transfer_id: methods.watch('stocks_transfer_id')}); //api update status

      showToast.success(
        getErrorMessage({
          message: 'Phiếu chuyển kho đã được huỷ.',
        }),
      );

      loadStocksTransferDetail();
    } catch (error) {
      showToast.error(
        getErrorMessage({
          message: error?.message || 'Đã xảy ra lỗi vui lòng kiểm tra lại.',
        }),
      );
    }
  };

  const handleConfirmTranfer = async () => {
    try {
      await confirmTranfer(stocksTransferId);

      showToast.success('Xác nhận điều chuyển thành công !');
    } catch (error) {
      showToast.error('Có lỗi xảy ra vui lòng thử lại.');
    } finally {
      setIsConfirmTransfer(false);
      loadStocksTransferDetail();
    }
  };

  const detailForm = useMemo(() => {
    if (!methods.watch('is_ready') && stocksTransferId) {
      return [];
    }
    return [
      {
        id: 'information',
        title: 'Thông tin phiếu chuyển kho',
        component: StocksTransferInfor,
        fieldActive: ['created_date', 'stocks_transfer_code', 'created_user', 'status_transfer'],
      },
      {
        id: 'stocks_request',
        title: 'Yêu cầu chuyển kho',
        component: StocksTransferRequest,
        fieldActive: [
          'business_id',
          'stocks_transfer_type_id',
          'store_import_id',
          'store_export_id',
          'stocks_import_id',
          'stocks_export_id',
          'department_id',
          'import_user_id',
          'export_user_id',
          'request_user',
        ],
        stocksTransferId: stocksTransferId,
      },
      {
        id: 'print_transfer',
        title: 'Thông tin vận chuyển',
        component: StocksTransport,
        fieldActive: ['transport_partner', 'transport_vehicle', 'transport_user'],
        stocksTransferId: stocksTransferId,
        hidden: !watch('hidden_price'),
      },
      {
        id: 'product_transfer',
        title: 'Chọn sản phẩm chuyển kho',
        component: StocksTransferProduct,
        fieldActive: ['product_transfer'],
      },
      {
        id: 'review_stocks_transfer',
        title: 'Duyệt',
        component: StocksTransferReviewTable,
        fieldActive: ['stocks_transfer_review_list'],
      },
    ];
  }, [watch('transfer_type'), watch('is_ready'), watch('hidden_price')]);

  const action = [
    {
      type: 'primary',
      icon: 'fi fi-rr-print',
      content: 'In phiếu chuyển kho',
      onClick: () => handleExportPDF(),
      hidden: !stocksTransferId,
    },
    {
      type: 'warning',
      icon: 'fi-rr-inbox-out',
      content: 'Điều chuyển',
      onClick: () => setIsConfirmTransfer(true),
      hidden: methods.watch('reviewed_status') == 1 && methods.watch('is_can_transfer') ? false : true,
    },
    {
      type: 'warning',
      icon: 'fi fi-rr-edit',
      content: 'Hủy',
      onClick: () => dispatch(
        showConfirmModal(
          ['Bạn có thật sự muốn huỷ phiếu chuyển kho?', 'Phiếu chuyển kho sẽ bị huỷ và ảnh hưởng tới dữ liệu liên quan.'],
          async () => {
            handleCancelOrder();
          },
          ["Tôi muốn hủy"],
        ),
      ),
      hidden: methods.watch('reviewed_status') == 1 && 
              methods.watch('status_transfer') !== 2 &&
              methods.watch('status_transfer') !== 1 ? false : true,
    },
    {
      type: 'warning',
      icon: 'fi fi-rr-edit',
      content: 'Đã Hủy',
      hidden: methods.watch('reviewed_status') == 1 && methods.watch('status_transfer') === 1 ? false : true,
    },
    // {
    //   type: 'warning',
    //   icon: 'fi-rr-',
    //   content: 'Huỷ điều chuyển',
    //   onClick: () => setIsConfirmTransfer(true),
    //   hidden: methods.watch('reviewed_status') == 1 ? false : true
    // },
    {
      type: 'warning',
      icon: 'fi fi-rr-edit',
      content: 'Chỉnh sửa',
      onClick: () => window._$g.rdr(`/stocks-transfer/edit/${stocksTransferId}`),
      hidden: methods.watch('reviewed_status') != 2 ? true : isEdit,
    },
    {
      type: 'success',
      icon: 'fi fi-rr-check',
      content: `Hoàn tất ${stocksTransferId ? 'chỉnh sửa' : 'thêm mới'}`,
      onClick: methods.handleSubmit(onSubmit),
      hidden: methods.watch('reviewed_status') != 2 ? true : !isEdit,
    },
  ];

  return (
    <React.Fragment>
      <FormProvider {...methods}>
        <FormSection
          detailForm={detailForm}
          onSubmit={onSubmit}
          disabled={methods.watch('reviewed_status') != 2 ? true : !isEdit}
          actions={action}
        />
      </FormProvider>
      {loadingPdf && <BWLoader isPage={false} />}

      {isConfirmTransfer ? (
        <Modal
          open={isConfirmTransfer}
          onClose={() => setIsConfirmTransfer(false)}
          header='Xác nhận điều chuyển'
          footer={
            <BWButton
              type='success'
              icon={'fi-rr-inbox-out'}
              content={'Xác nhận chuyển'}
              onClick={() => {
                handleConfirmTranfer();
              }}
            />
          }>
          <div className=' bw_text_center'>
            <p>Bạn có muốn xác nhận điều chuyển kho</p>
            <p>
              Chuyển từ <b>{methods.watch('stocks_export_name')}</b> đến <b>{methods.watch('stocks_import_name')}</b>
            </p>
          </div>
        </Modal>
      ) : null}
    </React.Fragment>
  );
};

export default StocksTransferAdd;
