import React from 'react';
import { useForm } from 'react-hook-form';
import pick from 'lodash/pick';

import { ZALO_TYPE_SEND } from 'components/shared/FormZalo/FormZalo';
import ModalPortal from 'components/shared/ModalPortal/ModalPortal';
import { showToast } from 'utils/helpers';
import ZaloOAService from 'services/zalo-oa.service.';
import FormZaloDynamic, { ZALO_DATA_TYPE } from 'components/shared/FormZalo/FormZaloDynamic';
import { compliedSMSTemplate } from 'components/shared/FormZalo/utils';

function ModalZalo({ onClose, customer, selectedCustomer = [] }) {
  const methods = useForm();

  const onSubmit = async (payload) => {
    try {
      const zalo_type_send = methods.watch('zalo_type_send');

      /**
       * Gửi tin nhắn zalo thông thường
       */
      if (zalo_type_send === ZALO_TYPE_SEND.SEND_SMS) {
        const _selectedCustomer = (selectedCustomer || []).filter((x) => x.zalo_id);
        if (_selectedCustomer.length <= 0) {
          showToast.warning('Chưa có khách hàng nào cập nhật Zalo ID để gửi tin nhắn');
          return;
        }
        for (let i = 0; i < _selectedCustomer.length; i++) {
          const compliedText = compliedSMSTemplate(payload.zalo_sms_content_complied, _selectedCustomer[i]);

          await ZaloOAService.sendTextMessage({
            text_message: compliedText,
            user_id: _selectedCustomer[i].zalo_id,
            attachment_url: payload?.zalo_sms_image_url? payload.zalo_sms_image_url: null,
          }).catch(() => {});
        }
        showToast.success('Gửi tin nhắn Zalo thành công');
        onClose();
        return;
      }

      /**
       * Gửi thông báo ZNS
       */
      if (zalo_type_send === ZALO_TYPE_SEND.SEND_ZNS) {
        for (let cusIndex = 0; cusIndex < selectedCustomer.length; cusIndex++) {
          const cusItem = selectedCustomer[cusIndex];
          const cusPayload = { ...payload }
          const znsParams = cusPayload.zalo_zns_type || []
          for (let i = 0; i < znsParams.length; i++) {
            const paramName = cusPayload?.detail_zns?.listParams[i]?.name
            if (znsParams[i] === ZALO_DATA_TYPE.DATA && paramName) {
              cusPayload[paramName] = cusItem[cusPayload[paramName]] || ''
            }
          }
          if (cusItem?.phone_number) {
            const templateDataParams = (cusPayload?.detail_zns?.listParams || []).map(x => x.name)
            await ZaloOAService.sendZNS({
              phone: cusItem?.phone_number,
              template_id: cusPayload.zalo_zns_template,
              template_data: pick(cusPayload, templateDataParams),
            }).catch(() => {})
          }
        }
        showToast.success('Gửi thông báo ZNS thành công');
        onClose();
        return;
      }
      
      /**
       * Gửi thông báo ZNS ZaloPay
       */
      if (zalo_type_send === ZALO_TYPE_SEND.SEND_ZNS_ZALO_PAY_SAMCENTER || zalo_type_send === ZALO_TYPE_SEND.SEND_ZNS_ZALO_PAY_SHOPDUNK) {
        let payloadArray = [];
        for (let cusIndex = 0; cusIndex < selectedCustomer.length; cusIndex++) {
          const cusItem = selectedCustomer[cusIndex];
          const cusPayload = { ...payload }
          const znsParams = cusPayload.zalo_zns_zalopay_type || []
          for (let i = 0; i < znsParams.length; i++) {
            const paramName = cusPayload?.detail_zns_zalo_pay?.listParams[i]?.name
            if (znsParams[i] === ZALO_DATA_TYPE.DATA && paramName) {
              cusPayload[paramName] = cusItem[cusPayload[paramName]] || ''
            }
          }
          if (cusItem?.phone_number) {
            const templateDataParams = (cusPayload?.detail_zns_zalo_pay?.listParams || []).map(x => x.name)
            
            // await ZaloOAService.sendZNSZaloPay({
            //   member_id: cusItem.member_id,
            //   phone: cusItem?.phone_number,
            //   template_id: cusPayload.zalo_pay_zns_template,
            //   template_data: pick(cusPayload, templateDataParams),
            //   feature_key: zalo_type_send === ZALO_TYPE_SEND.SEND_ZNS_ZALO_PAY_SHOPDUNK ? 1 : 2
            // }).catch(() => {})
            payloadArray.push({
              member_id: cusItem.member_id,
              phone: cusItem?.phone_number,
              template_id: cusPayload.zalo_pay_zns_template,
              template_data: pick(cusPayload, templateDataParams),
              feature_key: zalo_type_send === ZALO_TYPE_SEND.SEND_ZNS_ZALO_PAY_SHOPDUNK ? 1 : 2
            });
          }
        }
        if (payloadArray.length > 0) {
          await ZaloOAService.sendZNSZaloPay({payload: payloadArray})
          .then(() => {
            showToast.success('Gửi thông báo ZNS ZaloPay thành công');
            onClose();
            return;
          })
          .catch(() => {});
        }
        // showToast.success('Gửi thông báo ZNS ZaloPay thành công');
        // onClose();
        // return;
      }
    } catch (error) {
      showToast.error(error.message);
    }
  };

  return (
    <ModalPortal
      title='Gửi tin nhắn Zalo'
      confirmText='Gửi'
      onClose={onClose}
      onConfirm={methods.handleSubmit(onSubmit)}>
      <FormZaloDynamic customer={customer} methods={methods} />
    </ModalPortal>
  );
}

export default ModalZalo;
