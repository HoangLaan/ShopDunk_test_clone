import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';

import FormStatus from 'components/shared/FormCommon/FormStatus';
import { create, read, update } from 'pages/PriceReviewLevel/helpers/call-api';
import PriceReviewLevelInfor from 'pages/PriceReviewLevel/components/add/PriceReviewLevelInfor';

const PriceReviewLevelAddModel = ({ open, onClose, onConfirm, priceReviewLevelId = null }) => {
  const methods = useForm({
    defaultValues: { is_active: 1 },
  });

  const onSubmit = async (values) => {
    let formData = { ...values };

    formData.is_active = formData.is_active ? 1 : 0;
    formData.is_system = formData.is_system ? 1 : 0;

    try {
      if (priceReviewLevelId) {
        await update({ ...formData, price_review_level_id: priceReviewLevelId });
        showToast.success(`Cập nhật thành công.`, {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      } else {
        await create(formData);

        showToast.success(`Thêm mới thành công.`, {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });

        methods.reset({});
      }
      onConfirm();
    } catch (error) {
      showToast.error(error ? error.message : 'Có lỗi xảy ra!', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    }
  };

  const loadPriceReviewLevelAddDetail = useCallback(async () => {
    if (priceReviewLevelId) {
      try {
        const detail = await read(priceReviewLevelId);

        methods.reset({
          ...detail,
        });
      } catch (error) {
        showToast.error(error ? error.message : 'Có lỗi xảy ra!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      }
    }
  }, [priceReviewLevelId, methods]);

  useEffect(() => {
    loadPriceReviewLevelAddDetail();
  }, [loadPriceReviewLevelAddDetail]);

  ///zone handle scroll effect for header position

  const styleModal = { marginLeft: '300px' };

  const headerStyles = {
    backgroundColor: 'white',
    borderBottom: '#ddd 1px solid',
    position: 'sticky',
    marginTop: '-20px',
    zIndex: '1',
    top: '-2rem',
    width: '55rem',
    marginLeft: '-20px',
    height: '4rem',
    zIndex: 2,
  };
  const titleModal = {
    marginLeft: '2rem',
    marginTop: '1rem',
  };
  const closeModal = {
    marginRight: '2rem',
    marginTop: '1rem',
  };
  ////end zone

  return (
    <React.Fragment>
      <div className={`bw_modal ${open ? 'bw_modal_open' : ''}`} id='bw_notice_del'>
        <div className='bw_modal_container bw_w900' style={styleModal}>
          <div className='bw_title_modal' style={headerStyles}>
            <h3 style={titleModal}>{`${priceReviewLevelId ? 'Cập nhật' : 'Thêm mới'} mức duyệt`}</h3>
            <span className='bw_close_modal fi fi-rr-cross-small' onClick={onClose} style={closeModal}></span>
          </div>
          <div className='bw_main_modal bw_border_top'>
            <div className='bw_row'>
              <div className='bw_col_12' style={{ overflowX: 'auto', maxHeight: '45vh' }}>
                <FormProvider {...methods}>
                  <PriceReviewLevelInfor />
                  <FormStatus />
                </FormProvider>
              </div>
            </div>
          </div>
          <div className='bw_footer_modal'>
            <button className='bw_btn bw_btn_success' onClick={methods.handleSubmit(onSubmit)}>
              <span className='fi fi-rr-check'></span>
              {`Hoàn tất ${priceReviewLevelId ? 'cập nhật' : 'thêm mới'}`}
            </button>
            <button type='button' onClick={onClose} className='bw_btn_outline bw_btn_outline_danger'>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

PriceReviewLevelAddModel.propTypes = {
  open: PropTypes.bool,
  className: PropTypes.string,
  header: PropTypes.node,
  footer: PropTypes.string,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  children: PropTypes.node,
};

export default PriceReviewLevelAddModel;
